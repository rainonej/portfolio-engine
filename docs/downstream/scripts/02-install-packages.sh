#!/usr/bin/env bash
set -euo pipefail

echo "[2/6] Installing required packages"
[[ -f package.json ]] || { echo "ERROR: package.json not found. Run from scaffolded repo root."; exit 1; }
pnpm add @portfolio-engine/editorial-theme @portfolio-engine/admin-tools @astrojs/vercel zod
