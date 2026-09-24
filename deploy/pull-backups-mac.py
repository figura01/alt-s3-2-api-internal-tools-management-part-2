#!/usr/bin/env python3
"""Download verified TechCorp backups over SSH; retain 30 successful dates locally."""
import datetime
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import shlex
import shutil
import subprocess
import tempfile

HOST = 'ubuntu@51.91.99.187'
REMOTE = '/home/ubuntu/backups/techcorp/daily'
DESTINATION = Path.home() / 'Backups' / 'TechCorp'
FILES = ('database.dump', 'environment.env', 'compose.yml', 'Caddyfile', 'metadata.json')
OPTIONS = ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15', '-o', 'StrictHostKeyChecking=yes']


def verify(folder):
    checksums = json.loads((folder / 'checksums.json').read_text())
    if set(checksums) != set(FILES):
        raise ValueError('Unexpected backup manifest')
    for name in FILES:
        path = folder / name
        if path.is_symlink() or not path.is_file():
            raise ValueError('Invalid backup file: ' + name)
        digest = hashlib.sha256()
        with path.open('rb') as source:
            for chunk in iter(lambda: source.read(1024 * 1024), b''):
                digest.update(chunk)
        if digest.hexdigest() != checksums[name]:
            raise ValueError('Checksum mismatch: ' + name)


def remote_dates(environment):
    code = "import json,pathlib; p=pathlib.Path(%r); print(json.dumps([x.name for x in p.iterdir() if x.is_dir() and not x.is_symlink() and (x/'checksums.json').is_file()]))" % (REMOTE + '/' + environment)
    output = subprocess.check_output(['ssh'] + OPTIONS + [HOST, 'python3 -c ' + shlex.quote(code)], text=True, timeout=60)
    result = []
    for name in json.loads(output):
        if isinstance(name, str) and re.fullmatch(r'\d{4}-\d{2}-\d{2}', name):
            datetime.date.fromisoformat(name)
            result.append(name)
    if not result:
        raise RuntimeError('No completed remote backups for ' + environment)
    return sorted(result)


def download(environment, day):
    parent = DESTINATION / environment
    parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    parent.chmod(0o700)
    target = parent / day
    if target.exists():
        if target.is_symlink():
            raise ValueError('Refusing a symlink destination')
        verify(target)
        return False
    pending = Path(tempfile.mkdtemp(prefix='.partial-', dir=parent))
    try:
        sources = [HOST + ':' + REMOTE + '/' + environment + '/' + day + '/' + name for name in FILES + ('checksums.json',)]
        subprocess.run(['scp', '-q'] + OPTIONS + sources + [str(pending) + '/'], check=True, timeout=1800)
        verify(pending)
        for path in pending.iterdir():
            path.chmod(0o600)
        (pending / '.verified').write_text('Verified by pull-backups-mac.py\n')
        (pending / '.verified').chmod(0o600)
        pending.rename(target)
    finally:
        if pending.exists():
            shutil.rmtree(pending)
    return True


def retain(parent):
    dates = sorted(p for p in parent.iterdir() if p.is_dir() and not p.is_symlink() and re.fullmatch(r'\d{4}-\d{2}-\d{2}', p.name) and (p / '.verified').is_file())
    for old in dates[:-30]:
        shutil.rmtree(old)


def main():
    os.umask(0o077)
    DESTINATION.mkdir(mode=0o700, parents=True, exist_ok=True)
    DESTINATION.chmod(0o700)
    with (DESTINATION / '.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        failures = []
        for environment in ('production', 'staging'):
            try:
                dates = remote_dates(environment)
                copied = sum(download(environment, day) for day in dates)
                newest = datetime.date.fromisoformat(dates[-1])
                today = datetime.datetime.now(datetime.timezone.utc).date()
                if (today - newest).days > 1 or newest > today:
                    raise RuntimeError('Remote backup date is stale or in the future: ' + str(newest))
                retain(DESTINATION / environment)
                print('%s: %d copied, %d verified, latest %s' % (environment, copied, len(dates), dates[-1]), flush=True)
            except Exception as error:
                print(environment + ': FAILED: ' + str(error), flush=True)
                failures.append(environment)
        if failures:
            raise SystemExit(1)


if __name__ == '__main__':
    main()
