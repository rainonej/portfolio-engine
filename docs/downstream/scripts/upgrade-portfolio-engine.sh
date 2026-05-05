#!/usr/bin/env bash
set -euo pipefail

# Upgrade all @portfolio-engine/* packages in the consumer repo to their latest
# published version.
#
# Run from your consumer repo root:
#   bash docs/downstream/scripts/upgrade-portfolio-engine.sh
#
# To upgrade to the @next pre-release dist-tag instead of @latest, set:
#   DIST_TAG=next bash docs/downstream/scripts/upgrade-portfolio-engine.sh

DIST_TAG="${DIST_TAG:-latest}"

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

echo "[upgrade] Done. Run 'pnpm build' to verify no breaking changes."
