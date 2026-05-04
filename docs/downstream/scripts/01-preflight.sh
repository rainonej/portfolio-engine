#!/usr/bin/env bash
set -euo pipefail

echo "[1/6] Preflight: verifying repo root + required tools"
[[ -f package.json ]] || echo "WARN: package.json not found yet (ok before Astro scaffold)."
command -v node >/dev/null || { echo "ERROR: node not found"; exit 1; }
command -v pnpm >/dev/null || { echo "ERROR: pnpm not found"; exit 1; }
echo "Node: $(node -v)"
echo "pnpm: $(pnpm -v)"
