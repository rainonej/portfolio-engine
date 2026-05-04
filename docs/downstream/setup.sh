#!/usr/bin/env bash
set -euo pipefail

# Portfolio Engine downstream setup orchestrator (macOS/Linux)
# Safe to read before running. Set SKIP_* env vars to skip phases.
# Example: DRY_RUN=1 SKIP_INSTALL=1 ./docs/downstream/setup.sh

ROOT_DIR="$(pwd)"
SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/scripts"

step() { printf "\n[%s] %s\n" "$1" "$2"; }
run_step() {
  local name="$1" script="$2" skip_var="$3"
  if [[ "${!skip_var:-0}" == "1" ]]; then
    step "SKIP" "$name (set $skip_var=1)"
    return
  fi
  if [[ "${DRY_RUN:-0}" == "1" ]]; then
    step "DRY" "$name -> bash $script"
    return
  fi
  step "RUN" "$name"
  bash "$script"
  step "OK" "$name"
}

step "INFO" "Starting downstream bootstrap in $ROOT_DIR"
step "INFO" "Scripts directory: $SCRIPTS_DIR"
if [[ "${DRY_RUN:-0}" == "1" ]]; then
  step "INFO" "DRY_RUN=1: no files will be modified"
fi

run_step "Preflight checks" "$SCRIPTS_DIR/01-preflight.sh" "SKIP_PREFLIGHT"
run_step "Install packages" "$SCRIPTS_DIR/02-install-packages.sh" "SKIP_INSTALL"
run_step "Create directories" "$SCRIPTS_DIR/03-create-dirs.sh" "SKIP_DIRS"
run_step "Remove scaffold route collision" "$SCRIPTS_DIR/04-remove-index-route.sh" "SKIP_ROUTE_FIX"
run_step "Seed setup feedback doc" "$SCRIPTS_DIR/05-seed-feedback-log.sh" "SKIP_FEEDBACK"
run_step "Patch .gitignore" "$SCRIPTS_DIR/06-patch-gitignore.sh" "SKIP_GITIGNORE"

step "DONE" "Bootstrap complete. Next: follow docs/downstream/new-site-setup.md for config/content wiring."
