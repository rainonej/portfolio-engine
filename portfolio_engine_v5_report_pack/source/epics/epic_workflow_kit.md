# Optional Python/MCP workflow-kit

**Phase:** Phase 8  
**MVP relevance:** Post–Product-MVP — highly recommended for AI-native workflow  
**Products touched:** C, D, F, G  
**Labels:** `type:epic`, `area:workflow-kit`, `source:human`

## Summary

Build the optional Python package that exposes MCP tools to Claude/Copilot for consumer site planning and escalation.

## Why this matters

The consumer agent should not manually run terminal commands or guess repo structure. It should call tools exposed through MCP.

## Replaces old profesional_site workflow epic (historical)

This epic replaces `profesional_site #179` (obsolete GitHub Actions workflow-kit MVP) and related tasks. ADR-002: workflow-kit is a Python/MCP package, not a GitHub Actions suite.

**Disposition of old tasks:**

| Issue                 | Title                                                 | Action                                                             |
| --------------------- | ----------------------------------------------------- | ------------------------------------------------------------------ |
| profesional_site #179 | Old workflow-kit MVP                                  | Re-scope: reference ADR-002 and [Workflow-kit](#epic-workflow-kit) |
| profesional_site #226 | Task 8.1 — Define workflow classification contract    | Re-scope: MCP tool contracts                                       |
| profesional_site #227 | Task 8.2 — Package reusable GitHub workflow templates | **Close**                                                          |
| profesional_site #228 | Task 8.3 — Add engine-aware classifier                | **Close**                                                          |
| profesional_site #229 | Task 8.4 — Downstream-to-upstream routing             | Re-scope: `plan_upstream` MCP tool                                 |

## Target package shape

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

### Rewrite workflow-kit docs as Python/MCP package

**Labels:** `task:docs`, `owner:agentic-ai`, `area:workflow-kit`, `agent:approved`

Replace the current reusable-GitHub-workflows description.

**Acceptance criteria**

- [ ] Docs explain optional install.
- [ ] Docs explain local MCP server.
- [ ] Docs explain Claude and Copilot access.

### Add Python package skeleton

**Labels:** `task:feat`, `owner:agentic-ai`, `area:workflow-kit`, `agent:approved`

Add `pyproject.toml`, `tools/`, and `mcp_server.py`.

**Acceptance criteria**

- [ ] Package installable locally.
- [ ] MCP server entrypoint defined.
- [ ] No website-rendering dependency on Python.

### Implement `inspect_site`

**Labels:** `task:feat`, `owner:agentic-ai`, `area:workflow-kit`, `agent:approved`

Read repo layout and manifest, return editable layers, capabilities, forbidden paths, warnings.

**Acceptance criteria**

- [ ] Read-only.
- [ ] Understands target `src/*` layout.
- [ ] Returns structured data.

### Implement `plan_request`

**Labels:** `task:feat`, `owner:agentic-ai`, `area:workflow-kit`, `agent:approved`

Break a site-owner request into layer-specific tasks.

**Acceptance criteria**

- [ ] Targets include local-content, local-config, local-context, local-registry, upstream-feature, human-review.
- [ ] Can mark blockers.

### Implement `validate_plan`

**Labels:** `task:feat`, `owner:agentic-ai`, `area:workflow-kit`, `agent:approved`

Validate a plan before edits.

**Acceptance criteria**

- [ ] Rejects forbidden paths such as node_modules.
- [ ] Warns on upstream-specific hacks.

### Implement `plan_upstream`

**Labels:** `task:feat`, `owner:agentic-ai`, `area:workflow-kit`, `agent:approved`

Generate generalized upstream issue/PR proposal from downstream request.

**Acceptance criteria**

- [ ] Includes downstream request.
- [ ] Includes missing capability.
- [ ] Includes non-goals and privacy note.

### Add Claude/Copilot MCP setup docs

**Labels:** `task:docs`, `owner:agentic-ai`, `area:workflow-kit`, `agent:approved`

Document `.mcp.json` for Claude and repository MCP configuration/custom agent setup for Copilot.

**Acceptance criteria**

- [ ] No online hosting required.
- [ ] Read/planning tools recommended first.
