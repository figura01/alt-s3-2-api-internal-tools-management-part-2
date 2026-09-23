#!/usr/bin/env bash
set -euo pipefail

case "${1:-}" in
  staging|production) environment=$1 ;;
  *) echo 'Usage: deploy/deploy-techcorp.sh staging|production' >&2; exit 2 ;;
esac
root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
cd "$root"
compose=(docker compose --env-file ".env.$environment" -f "compose.$environment.yml")
# Validate before building or changing running services.
"${compose[@]}" config --quiet
"${compose[@]}" --profile operations build
"${compose[@]}" up -d --wait postgres
# Always run migrations, including on repeated deployments; stop on failure.
"${compose[@]}" run --rm --no-deps migrate
"${compose[@]}" up -d --no-deps "techcorp-$environment-api" "techcorp-$environment-frontend"
"${compose[@]}" ps
