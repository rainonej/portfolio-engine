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
