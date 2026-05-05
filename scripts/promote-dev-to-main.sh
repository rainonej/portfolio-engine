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

# The merge push starts Release (changeset version when .changeset/*.md exist). That job
# pushes the RELEASING commit with GITHUB_TOKEN, which does not trigger a second workflow,
# so npm publish would not run until another Release trigger. Always queue a follow-up
# Release (waits behind the in-flight run due to workflow concurrency on main).
echo ''
echo 'Queuing follow-up Release on main (workflow_dispatch)…'
before_sec="$(date -u +%s)"
gh workflow run Release --ref main

echo 'Waiting for the workflow_dispatch Release run to finish…'
run_id=""
sleep 4
for _ in $(seq 1 120); do
  run_id="$(
    gh run list --workflow Release --branch main --limit 15 --json databaseId,event,createdAt |
      jq -r --argjson b "$before_sec" '
        [.[] | select(.event == "workflow_dispatch")
          | select((.createdAt | fromdateiso8601) > ($b - 15))]
        | sort_by(.createdAt) | reverse | .[0].databaseId // empty
      '
  )"
  if [[ -n "$run_id" ]]; then
    break
  fi
  sleep 3
done

if [[ -z "$run_id" ]]; then
  echo 'Warning: could not resolve the workflow_dispatch Release run. Check Actions → Release on main.' >&2
  exit 0
fi

gh run watch "$run_id" --exit-status
echo "Release run ${run_id} completed."
echo 'Tip: git fetch origin main --tags  (then refresh Git Graph)'
