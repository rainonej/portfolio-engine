#!/usr/bin/env bash
set -euo pipefail

echo "[1/6] Preflight: verifying repo root + required tools"
[[ -f package.json ]] || { echo "ERROR: package.json not found. Scaffold first with: pnpm create astro@latest . --template minimal --install --typescript strict --git false"; exit 1; }
command -v node >/dev/null || { echo "ERROR: node not found"; exit 1; }
command -v pnpm >/dev/null || { echo "ERROR: pnpm not found"; exit 1; }
echo "Node: $(node -v)"
echo "pnpm: $(pnpm -v)"
