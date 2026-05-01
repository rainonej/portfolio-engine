# Epic 8 — Demo-site as reference and showcase

**Phase:** Phase 2 (MVP role) + Phase 8 (showcase role)
**MVP relevance:** ★ Reference consumer required for MVP; product showcase is post-MVP
**Labels:** `type:epic`, `area:demo-site`, `area:docs`, `source:human`

## Summary

Demo-site has two distinct roles that should be staged separately:

1. **MVP checker** — proves the runtime did not break; build/check/deploy reference consumer.
2. **Product showcase** — teaches consumers and agents how to use every layer of the system.

## Why this matters

The demo-site should prove the package works and teach consumers/agents how to use it. Conflating the MVP CI role with the full showcase role leads to scope creep during the critical runtime stabilization phase.

## Tickets

### T8.1 — Migrate demo-site to target consumer layout

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo-site`, `agent:approved`

Move demo-site toward `src/config`, `src/content`, `src/context`, `src/overrides`, `public`, and `.portfolio-engine` once runtime supports paths.

**Acceptance criteria**

- [ ] Demo build still passes.
- [ ] Vercel docs updated.
- [ ] Existing config path issue references updated.

### T8.2 — Add folder READMEs to demo-site

**Labels:** `task:docs`, `owner:simple-ai`, `area:demo-site`

Add small explanatory README files under each consumer-owned demo folder.

**Acceptance criteria**

- [ ] READMEs exist.
- [ ] READMEs explain what belongs and what does not.

### T8.3 — Add rendered customization index

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo-site`, `agent:approved`

Create a rendered page explaining config/content/context/overrides/registry/public/.portfolio-engine.

**Acceptance criteria**

- [ ] Page renders.
- [ ] Links rendered result to source files.

### T8.4 — Add source-code explanation panels

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo-site`, `agent:approved`

Each demo customization page should show what file/folder drives the rendered result.

**Acceptance criteria**

- [ ] Rendered and source views exist.
- [ ] Snippets are copy-pasteable.

## Post-MVP showcase tickets (Phase 8)

These are deferred until after the ★ MVP backbone is stable.

### T8.5 — Add "How config works" showcase page

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo-site`, `agent:approved`, `mvp:post`

### T8.6 — Add "How content works" showcase page

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo-site`, `agent:approved`, `mvp:post`

### T8.7 — Add "How context works" showcase page

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo-site`, `agent:approved`, `mvp:post`

### T8.8 — Add "How overrides work" showcase page

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo-site`, `agent:approved`, `mvp:post`

### T8.9 — Add "How registry works" showcase page

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo-site`, `agent:approved`, `mvp:post`

### T8.10 — Add "How MCP workflow-kit helps" showcase page

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo-site`, `area:workflow-kit`, `agent:approved`, `mvp:post`

**Acceptance criteria (all showcase tickets)**

- [ ] Page renders.
- [ ] Rendered result and source snippet shown side by side.
- [ ] Links to relevant upstream source files.
- [ ] MCP/workflow-kit demo deferred until workflow-kit exists.
