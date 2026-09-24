import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('pull', Path(__file__).with_name('pull-backups-mac.py'))
pull = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pull)


class PullTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        p = patch.object(pull, 'DESTINATION', self.root)
        p.start()
        self.addCleanup(p.stop)

    def transfer(self, args, **kwargs):
        target = Path(args[-1])
        sums = {}
        for name in pull.FILES:
            (target / name).write_bytes(b'test')
            sums[name] = hashlib.sha256(b'test').hexdigest()
        (target / 'checksums.json').write_text(json.dumps(sums))

    def test_verified_download_and_idempotence(self):
        with patch.object(pull.subprocess, 'run', side_effect=self.transfer) as run:
            self.assertTrue(pull.download('production', '2026-09-24'))
            self.assertFalse(pull.download('production', '2026-09-24'))
            self.assertEqual(run.call_count, 1)
        path = self.root / 'production/2026-09-24'
        self.assertTrue((path / '.verified').exists())
        self.assertEqual((path / 'environment.env').stat().st_mode & 0o777, 0o600)
        (path / 'database.dump').write_bytes(b'corrupt')
        with self.assertRaisesRegex(ValueError, 'Checksum mismatch'):
            pull.download('production', '2026-09-24')

    def test_failed_transfer_never_publishes(self):
        with patch.object(pull.subprocess, 'run', side_effect=subprocess.CalledProcessError(1, 'scp')):
            with self.assertRaises(subprocess.CalledProcessError):
                pull.download('staging', '2026-09-24')
        self.assertEqual(list((self.root / 'staging').iterdir()), [])

    def test_retention_only_removes_verified_owned_dates(self):
        for day in range(1, 32):
            folder = self.root / ('2026-08-%02d' % day)
            folder.mkdir()
            (folder / '.verified').write_text('verified')
        (self.root / 'manual').mkdir()
        (self.root / '2020-01-01').mkdir()
        pull.retain(self.root)
        self.assertFalse((self.root / '2026-08-01').exists())
        self.assertTrue((self.root / 'manual').exists())
        self.assertTrue((self.root / '2020-01-01').exists())
        self.assertEqual(len(list(self.root.iterdir())), 32)


if __name__ == '__main__':
    unittest.main()
