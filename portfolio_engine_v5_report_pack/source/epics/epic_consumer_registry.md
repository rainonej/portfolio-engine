# Consumer extension registry

**Phase:** Phase 7  
**MVP relevance:** Post–Product-MVP  
**Products touched:** A, B, C, D, E, F  
**Labels:** `type:epic`, `area:consumer-registry`, `area:editorial-theme`, `source:human`

## Summary

Add the consumer-owned registry as the middle ground between config/content changes and upstream engine changes.

## Why this matters

Consumers should be able to declare local reusable pages and embeds without editing package internals.

## Tickets

### Decide registry file format

**Labels:** `task:decision`, `owner:human-dev`, `area:consumer-registry`

Choose TypeScript, JSON, or hybrid for `src/registry/portfolio-engine.registry.*`.

**Acceptance criteria**

- [x] Decision recorded.
- [x] Admin-tools readability considered.

### Add local route extension support

**Labels:** `task:feat`, `owner:agentic-ai`, `area:consumer-registry`, `agent:approved`

Allow registry entries to add local pages backed by `src/pages-local`.

**Acceptance criteria**

- [x] Local route renders.
- [x] Duplicate paths fail clearly.
- [x] Manifest includes local route.

### Add local component/embed support

**Labels:** `task:feat`, `owner:agentic-ai`, `area:consumer-registry`, `agent:approved`

Allow registry entries to declare local embeds backed by `src/components`.

**Acceptance criteria**

- [ ] Content can reference registered embed.
- [ ] Missing component fails clearly.
- [ ] SnakeGame example possible.

### Add framed YouTube example

**Labels:** `task:feat`, `owner:agentic-ai`, `area:demo-site`, `agent:approved`

Demonstrate registry + component + content usage for a framed YouTube embed.

**Acceptance criteria**

- [ ] Rendered demo exists.
- [ ] Source explanation exists.
