import datetime as dt
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from types import SimpleNamespace

spec = importlib.util.spec_from_file_location('health', Path(__file__).with_name('check-techcorp.py'))
health = importlib.util.module_from_spec(spec)
spec.loader.exec_module(health)


class HealthTests(unittest.TestCase):
    def test_reserved_disk_space_counts_towards_threshold(self):
        with patch.object(health.shutil, 'disk_usage', return_value=SimpleNamespace(total=110, used=85, free=15)):
            with self.assertRaises(ValueError):
                health.disk()

    def test_backup_fresh_corrupt_stale_and_future(self):
        now = dt.datetime(2026, 9, 26, 12, tzinfo=dt.timezone.utc)
        with tempfile.TemporaryDirectory() as temp, patch.object(health, 'BACKUPS', Path(temp)):
            folder = Path(temp) / 'production' / '2026-09-26'
            folder.mkdir(parents=True)
            for name in health.FILES:
                (folder / name).write_text('fixture')
            def publish(created):
                (folder / 'metadata.json').write_text(json.dumps({'environment': 'production', 'created_utc': created.isoformat()}))
                (folder / 'checksums.json').write_text(json.dumps({name: hashlib.sha256((folder / name).read_bytes()).hexdigest() for name in health.FILES}))
            publish(now - dt.timedelta(hours=10))
            self.assertIn('verified', health.backup('production', now))
            (folder / 'database.dump').write_text('corrupt')
            with self.assertRaises(ValueError):
                health.backup('production', now)
            for created in (now - dt.timedelta(hours=37), now + dt.timedelta(hours=1)):
                publish(created)
                with self.assertRaises(ValueError):
                    health.backup('production', now)

    def test_unhealthy_container_fails(self):
        states = [{'Status': 'running'} for _ in range(7)]
        states[1]['Health'] = {'Status': 'unhealthy'}
        with patch.object(health.subprocess, 'run', return_value=SimpleNamespace(stdout='\n'.join(json.dumps(s) for s in states))):
            with self.assertRaises(ValueError):
                health.containers()


if __name__ == '__main__':
    unittest.main()
