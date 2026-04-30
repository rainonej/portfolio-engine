# Epic 5 — Consumer extension registry

**Phase:** Phase 4  
**MVP relevance:** Post-MVP  
**Labels:** `type:epic`, `area:consumer-registry`, `area:theme`, `source:human`

## Summary

Add the consumer-owned registry as the middle ground between config/content changes and upstream engine changes.

## Why this matters

Consumers should be able to declare local reusable pages and embeds without editing package internals.

## Tickets

### T5.1 — Decide registry file format

**Labels:** `task:decision`, `owner:human-dev`, `area:consumer-registry`

Choose TypeScript, JSON, or hybrid for `src/registry/portfolio-engine.registry.*`.

**Acceptance criteria**

- [ ] Decision recorded.
- [ ] Admin-tools readability considered.

### T5.2 — Add local route extension support

**Labels:** `task:feat`, `owner:agentic-ai`, `area:consumer-registry`, `claude-ready`

Allow registry entries to add local pages backed by `src/pages-local`.

**Acceptance criteria**

- [ ] Local route renders.
- [ ] Duplicate paths fail clearly.
- [ ] Manifest includes local route.

### T5.3 — Add local component/embed support

**Labels:** `task:feat`, `owner:agentic-ai`, `area:consumer-registry`, `claude-ready`

Allow registry entries to declare local embeds backed by `src/components`.

**Acceptance criteria**

- [ ] Content can reference registered embed.
- [ ] Missing component fails clearly.
- [ ] SnakeGame example possible.

### T5.4 — Add framed YouTube example

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo`, `claude-ready`

Demonstrate registry + component + content usage for a framed YouTube embed.

**Acceptance criteria**

- [ ] Rendered demo exists.
- [ ] Source explanation exists.
