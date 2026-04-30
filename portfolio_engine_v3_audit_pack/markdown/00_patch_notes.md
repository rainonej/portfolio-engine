
# Patch Notes Since v2

This v3 pack supersedes the previous v2 context pack where the two disagree.

## New decisions

### Decision 1 — `workflow-kit` is a Python/MCP package

The `workflow-kit` package is no longer modeled as another npm/TypeScript package like `engine-core`, `schema`, and `editorial-theme`.

New target:

```text
packages/workflow-kit/
  pyproject.toml
  tools/
    inspect_site.py
    plan_request.py
    validate_plan.py
    plan_upstream.py
  mcp_server.py
```

The website runtime remains Astro/npm/pnpm. The AI workflow tooling is optional and Python-based.

### Decision 2 — MCP is the shared tool interface for Claude and Copilot

The workflow-kit exposes tools through a local MCP server. The consumer repo does not copy Python tool files. Instead:

```text
consumer repo .mcp.json
  → starts installed portfolio-engine workflow-kit MCP server
  → Claude/Copilot discover tools from that server
```

The MCP server does not need to be hosted online. It is a local process started by the AI client.

### Decision 3 — Python docstrings and type hints are enough for initial MCP tool schemas

We do not need to manually write a separate JSON schema for every tool if the tools are Python functions with clear names, type hints, and docstrings. LangChain can be used later, but is not required for first MCP implementation.

### Decision 4 — consumer repo uses Astro conventions, but groups site layers under `src/`

The target consumer repo should not use top-level `config/`. Instead:

```text
src/config/
src/content/
src/context/
src/registry/
src/overrides/
src/components/
src/pages-local/
public/
.portfolio-engine/
```

### Decision 5 — upstream tracking and patch ledger are tool state

Move these out of `src/context`:

```text
src/context/upstream-tracking.md
src/context/patch-ledger.json
```

Use:

```text
.portfolio-engine/upstream-tracking.json
.portfolio-engine/patch-ledger.json
```

### Decision 6 — site-owner and brand-voice context should be structured

Use JSON for admin-renderable context:

```text
src/context/site-owner.json
src/context/brand-voice.json
```

### Decision 7 — every consumer-owned layer folder gets a small README

Each folder under `src/` and `public/` should have a short README explaining what belongs there, what does not, typical file types, and a tiny example.

## Affected epics from v2

- Epic 2 — rewrite around `src/*` consumer layers and `.portfolio-engine` state.
- Epic 3 — manifest must reflect new paths and generated/tool state.
- Epic 4 — consumer registry path is `src/registry/portfolio-engine.registry.ts`.
- Epic 5 — major rewrite: Python/MCP workflow-kit.
- Epic 6 — patch/upstream state moves to `.portfolio-engine`.
- Epic 8 — demo-site must migrate/showcase new layout.
- Epic 10 — agreni-site target shape changes.
- New Epic 11 — admin-tools must render structured context later.

## Current repo facts that must be reconciled

- Root README still says `workflow-kit` is reusable GitHub workflows / AI classifier.
- Demo-site README says consumers own `config/*.json`, `src/content/**`, `public/**`, and `astro.config.mjs`.
- Editorial-theme README shows config paths under `./config/*.json`.
- Engine-core docs say config is read from `config/*.json`.

These are current implementation facts, not errors. The roadmap should migrate them deliberately.
