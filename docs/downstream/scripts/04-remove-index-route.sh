#!/usr/bin/env bash
set -euo pipefail

echo "[4/6] Removing scaffold src/pages/index.astro if present"
if [[ -f src/pages/index.astro ]]; then
  rm -f src/pages/index.astro
  echo "Removed src/pages/index.astro"
else
  echo "No scaffold index route found"
fi
