#!/usr/bin/env bash
set -euo pipefail

echo "[5/6] Seeding setup feedback log"
mkdir -p src/docs
if [[ ! -f src/docs/setup-feedback.md ]]; then
  cat > src/docs/setup-feedback.md <<'MD'
# Setup Feedback Log

Capture friction, missing steps, and confusion encountered during setup.
Please remove personal information and secrets before sharing publicly.
MD
else
  echo "setup-feedback.md already exists; leaving as-is"
fi
