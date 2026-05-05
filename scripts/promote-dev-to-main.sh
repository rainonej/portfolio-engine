#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo 'GitHub CLI (gh) is not installed or not on PATH. Install from https://cli.github.com/' >&2
  exit 1
fi

git fetch origin dev main

dev="$(git rev-parse origin/dev)"
main="$(git rev-parse origin/main)"
if [[ "$dev" == "$main" ]]; then
  echo 'origin/dev and origin/main already match — nothing to promote.'
  exit 0
fi

pr="$(gh pr list --base main --head dev --state open --json number -q '.[0].number' | tr -d '[:space:]')"
if [[ -z "$pr" ]]; then
  echo 'Creating promotion PR dev → main…'
  gh pr create --base main --head dev \
    --title 'chore(release): promote dev → main' \
    --body 'Promotion via VS Code task **Promote dev → main** (scripts/promote-dev-to-main.sh).'
  pr="$(gh pr list --base main --head dev --state open --json number -q '.[0].number' | tr -d '[:space:]')"
fi

if [[ -z "$pr" ]]; then
  echo 'Could not create or find an open promotion PR.' >&2
  exit 1
fi

echo "PR #${pr} — waiting for checks (Ctrl+C to stop)…"
gh pr checks "$pr" --watch

echo "Merging PR #${pr} …"
gh pr merge "$pr" --merge --delete-branch=false

echo 'Done. main should update shortly; Release runs on push to main.'
