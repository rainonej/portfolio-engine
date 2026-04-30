# Epic 8 — Demo-site as reference and showcase

**Phase:** Cross-cutting  
**MVP relevance:** ★ Reference consumer required for MVP; advanced showcase post-MVP  
**Labels:** `type:epic`, `area:demo`, `area:docs`, `source:human`

## Summary

Make demo-site both the canonical reference consumer and the visual tutorial for customization layers.

## Why this matters

The demo-site should prove the package works and teach consumers/agents how to use it.

## Tickets

### T8.1 — Migrate demo-site to target consumer layout

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo`, `claude-ready`

Move demo-site toward `src/config`, `src/content`, `src/context`, `src/overrides`, `public`, and `.portfolio-engine` once runtime supports paths.

**Acceptance criteria**

- [ ] Demo build still passes.
- [ ] Vercel docs updated.
- [ ] Existing config path issue references updated.

### T8.2 — Add folder READMEs to demo-site

**Labels:** `task:docs`, `owner:simple-ai`, `area:demo`

Add small explanatory README files under each consumer-owned demo folder.

**Acceptance criteria**

- [ ] READMEs exist.
- [ ] READMEs explain what belongs and what does not.

### T8.3 — Add rendered customization index

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo`, `claude-ready`

Create a rendered page explaining config/content/context/overrides/registry/public/.portfolio-engine.

**Acceptance criteria**

- [ ] Page renders.
- [ ] Links rendered result to source files.

### T8.4 — Add source-code explanation panels

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo`, `claude-ready`

Each demo customization page should show what file/folder drives the rendered result.

**Acceptance criteria**

- [ ] Rendered and source views exist.
- [ ] Snippets are copy-pasteable.
