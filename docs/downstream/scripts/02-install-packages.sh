#!/usr/bin/env bash
set -euo pipefail

echo "[2/6] Installing required packages"
pnpm add @portfolio-engine/editorial-theme @portfolio-engine/admin-tools @astrojs/vercel
