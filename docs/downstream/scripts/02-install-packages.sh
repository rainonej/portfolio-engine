#!/usr/bin/env bash
set -euo pipefail

echo "[2/7] Installing required packages"
[[ -f package.json ]] || { echo "ERROR: package.json not found. Run from scaffolded repo root."; exit 1; }
pnpm add @portfolio-engine/editorial-theme @astrojs/vercel

cat <<'NOTE'
NOTE: @portfolio-engine/admin-tools is currently private/unpublished.
Skip installing it in standalone consumer repos until it is published.
NOTE
