# ADR-001: workflow-kit is an optional Python/MCP package

## Decision
`packages/workflow-kit` will be a Python package exposing MCP tools to Claude/Copilot.

## Consequences
- Optional for website rendering.
- Not a runtime dependency of `editorial-theme`.
- Consumers configure `.mcp.json` if they want Claude tool access.
- Copilot uses repo-level MCP/custom agent configuration.
