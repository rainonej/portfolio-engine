# Epic 5: Build optional Python/MCP workflow-kit

## Labels

`type:epic`, `source:human`, `area:workflow-kit`

## Why

Workflow-kit is the tool layer that lets Claude/Copilot inspect, plan, validate, and escalate consumer-site changes.

## Target shape

```text
packages/workflow-kit/
  pyproject.toml
  README.md
  tools/
    inspect_site.py
    plan_request.py
    validate_plan.py
    plan_upstream.py
    patch_ledger.py
  mcp_server.py
```

## Tickets

### T5.1 — Replace workflow-kit docs with Python/MCP package docs

Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:workflow-kit`, `claude-ready`

### T5.2 — Add pyproject.toml

Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:workflow-kit`, `claude-ready`

### T5.3 — Add MCP server skeleton

Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:workflow-kit`, `claude-ready`

### T5.4 — Add inspect_site tool

Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:workflow-kit`, `claude-ready`

### T5.5 — Add plan_request tool

Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:workflow-kit`, `claude-ready`

### T5.6 — Add validate_plan tool

Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:workflow-kit`, `claude-ready`

### T5.7 — Add Claude `.mcp.json` template

Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:workflow-kit`, `claude-ready`

### T5.8 — Add Copilot MCP configuration docs

Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:workflow-kit`, `claude-ready`
