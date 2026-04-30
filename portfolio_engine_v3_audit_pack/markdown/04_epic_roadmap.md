# Rewritten Epic Roadmap


---

# Epic 0: Update label taxonomy for v3 architecture

## Labels

`type:epic`, `source:human`, `area:docs`

## Why
The v3 plan adds Python/MCP workflow-kit, consumer registry, safety gates, downstream lifecycle, and patch lifecycle. Existing labels are too narrow.

## Tickets
### T0.1 — Update issue-label docs
Labels: `task:chore`, `owner:simple-ai`, `source:human`, `area:docs`
- Add `area:workflow-kit`, `area:consumer-registry`, `area:safety`, `area:governance`, `area:downstream`, `area:patch-lifecycle`, `area:admin-tools`, `area:engine-core`, `area:schema`.
- Preserve owner/source/task conventions.

### T0.2 — Create missing GitHub labels
Labels: `task:chore`, `owner:human-dev`, `source:human`, `area:docs`
- Create labels in GitHub with descriptions.


---

# Epic 1: Establish open-source governance and agent contribution protocol

## Labels

`type:epic`, `source:human`, `area:governance`, `area:docs`

## Why
Consumers are potential contributors. The repo needs a contribution protocol for AI-assisted downstream-originated PRs.

## Tickets
### T1.1 — Add root AGENTS.md
Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:governance`, `claude-ready`
- Explain upstream repo mode.
- Tell agents not to add consumer-specific hacks.
- Link layer-boundary docs.
- Mention Python/MCP workflow-kit as downstream optional tooling.

### T1.2 — Add CLAUDE.md pointer
Labels: `task:chore`, `owner:simple-ai`, `source:human`, `area:docs`

### T1.3 — Add PR template
Labels: `task:chore`, `owner:simple-ai`, `source:human`, `area:safety`
- Ask target layer, downstream origin, private data, AI assistance, changeset need.

### T1.4 — Add governance docs
Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:governance`, `claude-ready`
- `GOVERNANCE.md`, `AI_USAGE.md`, `DCO.md`, `CITATION.cff`, `SECURITY.md`, `TRADEMARK.md`, `NOTICE`.

### T1.5 — Add issue templates
Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:governance`, `claude-ready`
- upstream feature, upstream bug, downstream-originated PR, temporary patch tracking, human-review request.


---

# Epic 2: Define layer boundaries, consumer layout, and state protocol

## Labels

`type:epic`, `source:human`, `area:docs`, `area:downstream`

## Why
This is the central protocol that all runtime packages, MCP tools, demo-site docs, and admin-tools depend on.

## v3 layer model
`src/config`, `src/content`, `src/context`, `src/registry`, `src/overrides`, `src/components`, `src/pages-local`, `public`, `.portfolio-engine`.

## Tickets
### T2.1 — Add layer-boundaries doc
Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:docs`, `claude-ready`
- Explain every layer and registry vs component vs pages-local vs override.

### T2.2 — Add consumer repo layout doc
Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:downstream`, `claude-ready`
- Include annotated tree.
- Explain why `public/` remains top-level.

### T2.3 — Add folder README templates
Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:downstream`, `claude-ready`
- Add tiny README templates for every consumer layer folder.

### T2.4 — Define structured context schemas
Labels: `task:decision`, `owner:human-dev`, `source:human`, `area:schema`
- Decide fields for `site-owner.json` and `brand-voice.json`.

### T2.5 — Add Python-native/web-native glossary
Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:docs`, `claude-ready`


---

# Epic 3: Refactor runtime paths, registries, and manifest

## Labels

`type:epic`, `source:human`, `area:engine-core`, `area:theme`

## Why
Runtime must support v3 layout and expose a manifest for workflow-kit tools.

## Tickets
### T3.1 — Decide config path migration strategy
Labels: `task:decision`, `owner:human-dev`, `source:human`, `area:engine-core`

### T3.2 — Add `paths` option to editorialTheme
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:theme`, `claude-ready`

### T3.3 — Move built-in route metadata to explicit registry
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:theme`, `claude-ready`

### T3.4 — Move override surfaces to explicit registry
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:theme`, `claude-ready`

### T3.5 — Generate `.portfolio-engine/manifest.json`
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:engine-core`, `claude-ready`

### T3.6 — Ensure manifest does not leak private content
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:safety`, `claude-ready`


---

# Epic 4: Add consumer extension registry support

## Labels

`type:epic`, `source:human`, `area:consumer-registry`, `area:theme`

## Why
The consumer registry is the middle ground between ordinary local edits and upstream engine changes.

## Target path
`src/registry/portfolio-engine.registry.ts`

## Tickets
### T4.1 — Decide registry file format
Labels: `task:decision`, `owner:human-dev`, `source:human`, `area:consumer-registry`

### T4.2 — Add consumer route extensions
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:consumer-registry`, `claude-ready`

### T4.3 — Add consumer embed presets
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:consumer-registry`, `claude-ready`

### T4.4 — Add local component embed support
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:consumer-registry`, `claude-ready`

### T4.5 — Wire registry into admin-tools plan
Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:admin-tools`, `claude-ready`


---

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


---

# Epic 6: Define patch and upstream lifecycle

## Labels

`type:epic`, `source:human`, `area:patch-lifecycle`, `area:downstream`

## Why
Consumers become contributors when local levers are insufficient.

## v3 update
Patch and upstream tracking are tool state in `.portfolio-engine`.

## Tickets
### T6.1 — Document local → upstream escalation ladder
Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:patch-lifecycle`, `claude-ready`

### T6.2 — Define patch-ledger schema
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:patch-lifecycle`, `claude-ready`

### T6.3 — Define upstream-tracking schema
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:patch-lifecycle`, `claude-ready`

### T6.4 — Document linked checkout vs package patch
Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:patch-lifecycle`, `claude-ready`


---

# Epic 7: Add contribution safety gates

## Labels

`type:epic`, `source:human`, `area:safety`, `area:ci`

## Why
If consumer agents can contribute upstream, the upstream repo needs safety checks.

## Tickets
### T7.1 — Add layer-boundary PR checklist
Labels: `task:chore`, `owner:simple-ai`, `source:human`, `area:safety`

### T7.2 — Add deterministic layer-boundary guard
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:safety`, `claude-ready`

### T7.3 — Add AI review prompt/check
Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:safety`, `claude-ready`


---

# Epic 8: Turn demo-site into full customization showcase

## Labels

`type:epic`, `source:human`, `area:demo`, `area:docs`

## Why
Demo-site should teach consumers and agents how the whole system works.

## v3 target
`examples/demo-site/src/config`, `src/content`, `src/context`, `src/registry`, `src/overrides`, `src/components`, `src/pages-local`, `public`, `.portfolio-engine`.

## Tickets
### T8.1 — Add demo-site layout migration plan
Labels: `task:decision`, `owner:human-dev`, `source:human`, `area:demo`

### T8.2 — Add folder READMEs to demo-site
Labels: `task:chore`, `owner:simple-ai`, `source:human`, `area:demo`

### T8.3 — Add rendered customization index
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:demo`, `claude-ready`

### T8.4 — Add framed YouTube local component example
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:demo`, `claude-ready`

### T8.5 — Add local page example
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:demo`, `claude-ready`


---

# Epic 9: Port public-safe automation spine

## Labels

`type:epic`, `source:human`, `area:ci`, `area:safety`

## Why
GitHub automation protects the upstream repo; workflow-kit helps consumer agents plan/escalate.

## Tickets
### T9.1 — Reconcile current CI/Copilot issues
Labels: `task:chore`, `owner:human-dev`, `source:human`, `area:ci`

### T9.2 — Add branch-name-check workflow
Labels: `task:chore`, `owner:simple-ai`, `source:human`, `area:ci`

### T9.3 — Add close-on-merge workflow
Labels: `task:chore`, `owner:simple-ai`, `source:human`, `area:ci`

### T9.4 — Add public-safe planner workflow
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:ci`, `claude-ready`

### T9.5 — Add gated Claude workflow
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:ci`, `claude-ready`


---

# Epic 10: Create clean private agreni-site consumer repo

## Labels

`type:epic`, `source:human`, `area:downstream`

## Why
The private consumer repo should use the final consumer layout and optional MCP tools.

## Tickets
### T10.1 — Create/private repo setup
Labels: `task:chore`, `owner:human-dev`, `source:human`, `area:downstream`

### T10.2 — Scaffold Astro consumer using new layout
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:downstream`, `claude-ready`

### T10.3 — Migrate content/config/media
Labels: `task:content`, `owner:agentic-ai`, `source:human`, `area:downstream`, `claude-ready`

### T10.4 — Add structured context
Labels: `task:feat`, `owner:agentic-ai`, `source:human`, `area:downstream`, `claude-ready`

### T10.5 — Configure optional MCP tools
Labels: `task:chore`, `owner:human-dev`, `source:human`, `area:workflow-kit`

### T10.6 — Configure Vercel/CMS/admin workflow
Labels: `task:chore`, `owner:human-dev`, `source:human`, `area:downstream`


---

# Epic 11: Align admin-tools with structured context and consumer layout

## Labels

`type:epic`, `source:human`, `area:admin-tools`

## Why
Admin-tools should eventually let nontechnical users edit important site levers without looking at code.

## Tickets
### T11.1 — Update admin-tools docs for v3 layout
Labels: `task:chore`, `owner:agentic-ai`, `source:human`, `area:admin-tools`, `claude-ready`

### T11.2 — Define admin-readable context schema
Labels: `task:decision`, `owner:human-dev`, `source:human`, `area:admin-tools`

### T11.3 — Design admin information architecture
Labels: `task:design`, `owner:human-dev`, `source:human`, `area:admin-tools`
- Colors/theme
- Sitemap/routes
- Content collections
- Context/brand voice
- Assets/public files
- Registry/extensions
- Upstream blockers/patches
