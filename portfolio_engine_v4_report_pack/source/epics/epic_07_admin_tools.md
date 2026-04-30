# Epic 7 — Optional admin-tools UI

**Phase:** Phase 6  
**MVP relevance:** Post-MVP  
**Labels:** `type:epic`, `area:admin-tools`, `source:human`

## Summary

Build an optional UI layer for nontechnical users to edit/render content, config, context, assets, and registry state.

## Why this matters

Admin-tools is the direct UI for people who do not want to edit code. It should eventually expose site-owner context and brand voice as structured, editable forms.

## Tickets

### T7.1 — Update admin-tools docs for target layout

**Labels:** `task:docs`, `owner:agentic-ai`, `area:admin-tools`, `claude-ready`

Document how admin-tools will read `src/config`, `src/content`, `src/context`, `src/registry`, `public`, and `.portfolio-engine/manifest.json`.

**Acceptance criteria**

- [ ] Docs distinguish admin-tools from workflow-kit.
- [ ] Docs identify admin-editable vs tool-state files.

### T7.2 — Design admin information architecture

**Labels:** `task:design`, `owner:human-dev`, `area:admin-tools`

Design admin sections for theme/config, sitemap/routes, content, context, assets, registry, and upstream blockers.

**Acceptance criteria**

- [ ] IA sketch documented.
- [ ] MVP admin scope separated from future scope.

### T7.3 — Define admin-editable context fields

**Labels:** `task:decision`, `owner:human-dev`, `area:admin-tools`

Finalize which `site-owner.json` and `brand-voice.json` fields admin-tools should render/edit.

**Acceptance criteria**

- [ ] Fields map to schema.
- [ ] Privacy/visibility documented.
