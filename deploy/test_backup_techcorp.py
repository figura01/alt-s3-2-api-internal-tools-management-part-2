import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('backup', Path(__file__).with_name('backup-techcorp.py'))
backup = importlib.util.module_from_spec(spec)
spec.loader.exec_module(backup)


class BackupTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.project = self.root / 'project'
        self.project.mkdir()
        (self.project / '.env.production').write_text('secret')
        (self.project / 'compose.production.yml').write_text('services: {}')
        self.dest = self.root / 'daily'
        for name, value in [('PROJECT', self.project), ('DESTINATION', self.dest)]:
            p = patch.object(backup, name, value)
            p.start()
            self.addCleanup(p.stop)
        real_copy = backup.shutil.copyfile
        def copy(source, target):
            if str(source) == '/srv/vps-infra/Caddyfile':
                Path(target).write_text('example.test {}')
            else:
                real_copy(source, target)
        p = patch.object(backup.shutil, 'copyfile', side_effect=copy)
        p.start()
        self.addCleanup(p.stop)
        p = patch.object(backup.subprocess, 'check_output', return_value='test-commit\n')
        p.start()
        self.addCleanup(p.stop)

    def run_command(self, args, **kwargs):
        if 'pg_dump' in args:
            kwargs['stdout'].write(b'fake-dump')
        return subprocess.CompletedProcess(args, 0)

    def test_publish_verify_and_same_day_retry(self):
        with patch.object(backup.subprocess, 'run', side_effect=self.run_command) as run:
            backup.backup('production')
            folder = next((self.dest / 'production').iterdir())
            backup.verify(folder)
            self.assertEqual(0o600, (folder / 'environment.env').stat().st_mode & 0o777)
            backup.backup('production')
            self.assertEqual(2, run.call_count)

    def test_failure_does_not_publish_partial_backup(self):
        with patch.object(backup.subprocess, 'run', side_effect=subprocess.CalledProcessError(1, 'pg_dump')):
            with self.assertRaises(subprocess.CalledProcessError):
                backup.backup('production')
        self.assertEqual([], list((self.dest / 'production').iterdir()))

    def test_corruption_is_reported_and_not_overwritten(self):
        with patch.object(backup.subprocess, 'run', side_effect=self.run_command):
            backup.backup('production')
            folder = next((self.dest / 'production').iterdir())
            (folder / 'database.dump').write_bytes(b'corrupt')
            with self.assertRaisesRegex(RuntimeError, 'checksum mismatch'):
                backup.backup('production')
            self.assertEqual(b'corrupt', (folder / 'database.dump').read_bytes())

    def test_retention_keeps_seven_and_ignores_other_folders(self):
        parent = self.dest / 'production'
        parent.mkdir(parents=True)
        for day in range(1, 9):
            folder = parent / ('2020-01-%02d' % day)
            folder.mkdir()
            (folder / 'checksums.json').write_text('{}')
        (parent / 'manual-backup').mkdir()
        with patch.object(backup.subprocess, 'run', side_effect=self.run_command):
            backup.backup('production')
        self.assertFalse((parent / '2020-01-01').exists())
        self.assertFalse((parent / '2020-01-02').exists())
        self.assertTrue((parent / 'manual-backup').exists())
        self.assertEqual(8, len(list(parent.iterdir())))


if __name__ == '__main__':
    unittest.main()
