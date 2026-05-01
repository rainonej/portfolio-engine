# Epic 6 — Optional Python/MCP workflow-kit

**Phase:** Phase 6  
**MVP relevance:** Post-MVP, highly recommended for AI-native workflow  
**Labels:** `type:epic`, `area:workflow-kit`, `source:human`

## Summary

Build the optional Python package that exposes MCP tools to Claude/Copilot for consumer site planning and escalation.

## Why this matters

The consumer agent should not manually run terminal commands or guess repo structure. It should call tools exposed through MCP.

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

### T6.1 — Rewrite workflow-kit docs as Python/MCP package

**Labels:** `task:docs`, `owner:agentic-ai`, `area:workflow-kit`, `claude-ready`

Replace the current reusable-GitHub-workflows description.

**Acceptance criteria**

- [ ] Docs explain optional install.
- [ ] Docs explain local MCP server.
- [ ] Docs explain Claude and Copilot access.

### T6.2 — Add Python package skeleton

**Labels:** `task:feat`, `owner:agentic-ai`, `area:workflow-kit`, `claude-ready`

Add `pyproject.toml`, `tools/`, and `mcp_server.py`.

**Acceptance criteria**

- [ ] Package installable locally.
- [ ] MCP server entrypoint defined.
- [ ] No website-rendering dependency on Python.

### T6.3 — Implement `inspect_site`

**Labels:** `task:feat`, `owner:agentic-ai`, `area:workflow-kit`, `claude-ready`

Read repo layout and manifest, return editable layers, capabilities, forbidden paths, warnings.

**Acceptance criteria**

- [ ] Read-only.
- [ ] Understands target `src/*` layout.
- [ ] Returns structured data.

### T6.4 — Implement `plan_request`

**Labels:** `task:feat`, `owner:agentic-ai`, `area:workflow-kit`, `claude-ready`

Break a site-owner request into layer-specific tasks.

**Acceptance criteria**

- [ ] Targets include local-content, local-config, local-context, local-registry, upstream-feature, human-review.
- [ ] Can mark blockers.

### T6.5 — Implement `validate_plan`

**Labels:** `task:feat`, `owner:agentic-ai`, `area:workflow-kit`, `claude-ready`

Validate a plan before edits.

**Acceptance criteria**

- [ ] Rejects forbidden paths such as node_modules.
- [ ] Warns on upstream-specific hacks.

### T6.6 — Implement `plan_upstream`

**Labels:** `task:feat`, `owner:agentic-ai`, `area:workflow-kit`, `claude-ready`

Generate generalized upstream issue/PR proposal from downstream request.

**Acceptance criteria**

- [ ] Includes downstream request.
- [ ] Includes missing capability.
- [ ] Includes non-goals and privacy note.

### T6.7 — Add Claude/Copilot MCP setup docs

**Labels:** `task:docs`, `owner:agentic-ai`, `area:workflow-kit`, `claude-ready`

Document `.mcp.json` for Claude and repository MCP configuration/custom agent setup for Copilot.

**Acceptance criteria**

- [ ] No online hosting required.
- [ ] Read/planning tools recommended first.
