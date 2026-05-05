#!/usr/bin/env bash
set -euo pipefail

echo "[6/6] Ensuring .gitignore contains local/build artifacts"
touch .gitignore
grep -q '^\.portfolio-engine/$' .gitignore || echo '.portfolio-engine/' >> .gitignore
grep -q '^\.vercel/$' .gitignore || echo '.vercel/' >> .gitignore
