#!/usr/bin/env bash
set -euo pipefail

# Upgrade all @portfolio-engine/* packages in the consumer repo to the selected
# dist-tag.
#
# Run from your consumer repo root:
#   bash docs/downstream/scripts/upgrade-portfolio-engine.sh
#
# To upgrade to the @next pre-release dist-tag instead of @latest, set:
#   DIST_TAG=next bash docs/downstream/scripts/upgrade-portfolio-engine.sh
#
# To also run verification and generate an agent handoff prompt:
#   AGENT_HANDOFF=1 bash docs/downstream/scripts/upgrade-portfolio-engine.sh

DIST_TAG="${DIST_TAG:-latest}"
AGENT_HANDOFF="${AGENT_HANDOFF:-0}"

[[ -f package.json ]] || {
  echo "ERROR: package.json not found. Run from your consumer repo root."
  exit 1
}

echo "[upgrade] Discovering @portfolio-engine/* packages in package.json..."

pkgs=$(node -e "
const pkg = JSON.parse(require('fs').readFileSync('package.json', 'utf8'));
const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
const pe = Object.keys(deps).filter(k => k.startsWith('@portfolio-engine/'));
if (!pe.length) {
  process.stderr.write('No @portfolio-engine/* packages found in package.json.\n');
  process.exit(1);
}
console.log(pe.join(' '));
")

pkg_args=()
for pkg in $pkgs; do
  pkg_args+=("${pkg}@${DIST_TAG}")
done

echo "[upgrade] Upgrading to @${DIST_TAG}: ${pkg_args[*]}"
pnpm add "${pkg_args[@]}"

if [[ "$AGENT_HANDOFF" != "1" ]]; then
  echo "[upgrade] Done. Run 'pnpm check' and 'pnpm build' to verify no breaking changes."
  exit 0
fi

handoff_dir=".portfolio-engine/upgrade-handoff"
mkdir -p "$handoff_dir"
check_log="$handoff_dir/pnpm-check.log"
build_log="$handoff_dir/pnpm-build.log"
prompt_file="$handoff_dir/agent-upgrade-prompt.md"

echo "[upgrade] AGENT_HANDOFF=1 -> running pnpm check..."
set +e
pnpm check > >(tee "$check_log") 2>&1
check_status=$?
set -e

echo "[upgrade] AGENT_HANDOFF=1 -> running pnpm build..."
set +e
pnpm build > >(tee "$build_log") 2>&1
build_status=$?
set -e

cat > "$prompt_file" <<EOF
# Package upgrade agent handoff

Use this prompt in Copilot/Claude after upgrading \`@portfolio-engine/*\`.

## Context

- Dist tag used: \`$DIST_TAG\`
- Upgraded packages: \`$pkgs\`
- Check exit code: \`$check_status\`
- Build exit code: \`$build_status\`
- Check log: \`$check_log\`
- Build log: \`$build_log\`

## Task

Create a new branch from the current branch to handle any issues introduced by this upgrade.

1. Read \`docs/downstream/upgrade-path.md\` in this repo and follow the **AI / coding agents** section.
2. For each upgraded package, read \`node_modules/@portfolio-engine/<pkg>/CHANGELOG.md\`; if it is missing, use \`https://github.com/rainonej/portfolio-engine/tree/main/packages/<pkg>/CHANGELOG.md\`. Merge every \`#### Agent migration\` block in the semver window into one checklist.
3. Resolve issues surfaced by \`pnpm check\` and \`pnpm build\` logs.
4. Re-run \`pnpm check\` and \`pnpm build\` until both pass.
5. Open a PR into \`origin/dev\` that summarizes:
   - package versions upgraded
   - applied Agent migration steps
   - resolved warnings/errors

EOF

echo "[upgrade] Agent handoff prompt written: $prompt_file"
echo "[upgrade] Next step: paste that prompt into Copilot/Claude."

if [[ "$check_status" -ne 0 ]]; then
  exit "$check_status"
fi

if [[ "$build_status" -ne 0 ]]; then
  exit "$build_status"
fi
