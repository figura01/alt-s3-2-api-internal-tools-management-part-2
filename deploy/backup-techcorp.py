#!/usr/bin/env python3
"""Atomic daily PostgreSQL/config backups; keep the last seven successful days."""
import datetime
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile

PROJECT = Path('/srv/apps/techcorp')
DESTINATION = Path('/home/ubuntu/backups/techcorp/daily')
ENVIRONMENTS = ('production', 'staging')


def digest(path):
    value = hashlib.sha256()
    with path.open('rb') as source:
        for block in iter(lambda: source.read(1024 * 1024), b''):
            value.update(block)
    return value.hexdigest()


def verify(folder):
    expected = json.loads((folder / 'checksums.json').read_text())
    for name in ('database.dump', 'environment.env', 'compose.yml', 'Caddyfile', 'metadata.json'):
        if digest(folder / name) != expected[name]:
            raise RuntimeError('Backup checksum mismatch: ' + str(folder / name))


def backup(environment):
    parent = DESTINATION / environment
    parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    today = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d')
    target = parent / today
    if target.exists():
        verify(target)
        print(str(target) + ': already complete and checksums verified', flush=True)
        return
    if shutil.disk_usage(parent).free < 512 * 1024 * 1024:
        raise RuntimeError('Less than 512 MiB free; no backup or retention deletion performed')
    compose = ['docker', 'compose', '--env-file', str(PROJECT / ('.env.' + environment)), '-f', str(PROJECT / ('compose.' + environment + '.yml'))]
    pending = Path(tempfile.mkdtemp(prefix='.partial-', dir=parent))
    try:
        dump = pending / 'database.dump'
        with dump.open('wb') as output:
            subprocess.run(compose + ['exec', '-T', 'postgres', 'pg_dump', '-U', 'techcorp', '-d', 'techcorp', '-Fc'], stdout=output, check=True, timeout=1800)
            output.flush()
            os.fsync(output.fileno())
        if dump.stat().st_size == 0:
            raise RuntimeError('Empty PostgreSQL dump')
        with dump.open('rb') as source:
            subprocess.run(compose + ['exec', '-T', 'postgres', 'pg_restore', '--list'], stdin=source, stdout=subprocess.DEVNULL, check=True, timeout=120)
        shutil.copyfile(PROJECT / ('.env.' + environment), pending / 'environment.env')
        shutil.copyfile(PROJECT / ('compose.' + environment + '.yml'), pending / 'compose.yml')
        shutil.copyfile('/srv/vps-infra/Caddyfile', pending / 'Caddyfile')
        commit = subprocess.check_output(['git', '-C', str(PROJECT), 'rev-parse', 'HEAD'], text=True).strip()
        (pending / 'metadata.json').write_text(json.dumps({'environment': environment, 'commit': commit, 'created_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'verification': 'pg_restore --list; SHA-256 (not a full restore)'}, indent=2))
        files = ('database.dump', 'environment.env', 'compose.yml', 'Caddyfile', 'metadata.json')
        (pending / 'checksums.json').write_text(json.dumps({name: digest(pending / name) for name in files}, indent=2))
        for path in pending.iterdir():
            path.chmod(0o600)
        verify(pending)
        pending.rename(target)
    finally:
        if pending.exists():
            shutil.rmtree(pending)
    # Only this script's completed daily folders are eligible for retention.
    complete = sorted(path for path in parent.iterdir() if path.is_dir() and not path.is_symlink() and re.fullmatch(r'\d{4}-\d{2}-\d{2}', path.name) and (path / 'checksums.json').is_file())
    for old in complete[:-7]:
        shutil.rmtree(old)
    print(str(target) + ': created and checksums verified', flush=True)


def main():
    os.umask(0o077)
    DESTINATION.mkdir(parents=True, exist_ok=True, mode=0o700)
    with (DESTINATION / '.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        failures = []
        for environment in ENVIRONMENTS:
            try:
                backup(environment)
            except Exception as error:
                failures.append(environment)
                print(environment + ': FAILED: ' + str(error), flush=True)
        if failures:
            raise SystemExit(1)


if __name__ == '__main__':
    main()
