#!/usr/bin/env bash
set -euo pipefail

echo "[7/7] Seeding optional agent tooling files"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOWNSTREAM_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_DIR="$DOWNSTREAM_DIR/templates/agent"

install_if_missing() {
  local src="$1"
  local dest="$2"

  mkdir -p "$(dirname "$dest")"

  if [[ -f "$dest" ]]; then
    echo "Exists: $dest; leaving as-is"
    return
  fi

  cp "$src" "$dest"
  echo "Created: $dest"
}

[[ -d "$TEMPLATE_DIR" ]] || {
  echo "ERROR: missing template directory: $TEMPLATE_DIR"
  echo "Copy the full docs/downstream directory before running setup."
  exit 1
}

install_if_missing "$TEMPLATE_DIR/mcp.example.json" ".cursor/mcp.example.json"
install_if_missing "$TEMPLATE_DIR/CLAUDE.md" "CLAUDE.md"
install_if_missing "$TEMPLATE_DIR/copilot-instructions.md" ".github/copilot-instructions.md"

install_if_missing "$DOWNSTREAM_DIR/agent-tooling.md" "src/docs/agent-tooling.md"
install_if_missing "$DOWNSTREAM_DIR/visual-qa-prompt.md" "src/docs/visual-qa-prompt.md"
install_if_missing "$DOWNSTREAM_DIR/design-review-checklist.md" "src/docs/design-review-checklist.md"

touch .gitignore
grep -q '^\.cursor/mcp\.json$' .gitignore || echo '.cursor/mcp.json' >> .gitignore

echo "Agent tooling seed complete."
echo "Next: copy .cursor/mcp.example.json to .cursor/mcp.json if you want project-local Cursor MCP config."
