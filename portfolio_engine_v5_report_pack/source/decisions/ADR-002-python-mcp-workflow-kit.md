# ADR-002 — workflow-kit is Python/MCP

## Decision

`packages/workflow-kit` will be a Python package exposing a local MCP server.

## Target

```text
packages/workflow-kit/
  pyproject.toml
  tools/
    inspect_site.py
    plan_request.py
    validate_plan.py
    plan_upstream.py
    patch_ledger.py
  mcp_server.py
```

## Rationale

Claude and Copilot can both access MCP tools. The MCP server runs locally and does not need online hosting.
