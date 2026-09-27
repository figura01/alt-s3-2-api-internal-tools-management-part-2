#!/usr/bin/env python3
"""Read-only VPS diagnostic. Exit 1 if any check fails; never print secrets."""
import datetime as dt
import hashlib
import json
from pathlib import Path
import re
import shutil
import subprocess
import urllib.request

BACKUPS = Path('/home/ubuntu/backups/techcorp/daily')
FILES = ('database.dump', 'environment.env', 'compose.yml', 'Caddyfile', 'metadata.json')


def disk():
    usage = shutil.disk_usage('/')
    # Match df: reserved filesystem space is unavailable to this user.
    percent = 100 * usage.used / (usage.used + usage.free)
    if percent >= 85:
        raise ValueError('disk usage at or above 85%')
    return f'{percent:.1f}% used, {usage.free / 1024**3:.1f} GiB free'


def containers():
    names = ['caddy'] + [
        f'techcorp-{env}-{service}-1'
        for env in ('production', 'staging')
        for service in ('postgres', f'techcorp-{env}-api', f'techcorp-{env}-frontend')
    ]
    result = subprocess.run(
        ['docker', 'inspect', '--format', '{{json .State}}', *names],
        capture_output=True, text=True, check=True, timeout=20,
    )
    states = [json.loads(line) for line in result.stdout.splitlines()]
    if len(states) != len(names):
        raise ValueError('missing containers')
    for name, state in zip(names, states):
        if state.get('Status') != 'running' or state.get('Restarting'):
            raise ValueError('container not running: ' + name)
        health = state.get('Health', {}).get('Status')
        if (name.endswith('-postgres-1') and health != 'healthy') or health not in (None, 'healthy'):
            raise ValueError('container not healthy: ' + name)
    return '7 expected containers running; configured health checks healthy'


def backup(environment, now=None):
    now = now or dt.datetime.now(dt.timezone.utc)
    folders = sorted(p for p in (BACKUPS / environment).iterdir()
                     if p.is_dir() and not p.is_symlink()
                     and re.fullmatch(r'\d{4}-\d{2}-\d{2}', p.name))
    if not folders:
        raise ValueError('no completed daily backup')
    folder = folders[-1]
    metadata = json.loads((folder / 'metadata.json').read_text())
    created = dt.datetime.fromisoformat(metadata['created_utc'])
    age = (now - created).total_seconds()
    if metadata['environment'] != environment or not 0 <= age <= 36 * 3600:
        raise ValueError('backup wrong environment, future-dated or older than 36 hours')
    checksums = json.loads((folder / 'checksums.json').read_text())
    for name in FILES:
        path = folder / name
        if path.is_symlink() or not path.is_file() or path.stat().st_size == 0:
            raise ValueError('backup file missing, empty or symlinked')
        digest = hashlib.sha256()
        with path.open('rb') as source:
            for block in iter(lambda: source.read(1024 * 1024), b''):
                digest.update(block)
        if digest.hexdigest() != checksums[name]:
            raise ValueError('backup checksum mismatch')
    return f'{folder.name}, {age / 3600:.1f} hours old, SHA-256 verified'


def https(environment):
    host = ('staging.' if environment == 'staging' else '') + 'techcorp.laurent-vuillaume.ovh'
    with urllib.request.urlopen('https://' + host + '/login', timeout=20) as response:
        if response.status != 200 or response.url != 'https://' + host + '/login':
            raise ValueError('unexpected HTTP status or redirect')
    return 'HTTPS login HTTP 200 (certificate verified)'


def main():
    checks = [('disk', disk), ('containers', containers)]
    for env in ('production', 'staging'):
        checks.extend([(env + ' backup', lambda env=env: backup(env)),
                       (env + ' HTTPS', lambda env=env: https(env))])
    failed = False
    for name, check in checks:
        try:
            print('OK ' + name + ': ' + check(), flush=True)
        except Exception as error:
            # Do not echo exceptions: third-party output could contain secrets.
            print('FAIL ' + name + ': ' + type(error).__name__, flush=True)
            failed = True
    return int(failed)


if __name__ == '__main__':
    raise SystemExit(main())
