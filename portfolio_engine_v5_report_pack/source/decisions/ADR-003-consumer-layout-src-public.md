# ADR-003 — Consumer layout uses `src/*` plus top-level `public/`

## Decision

Consumer-owned layers live under `src/`.

Top-level `public/` remains because Astro/web frameworks serve it directly.

## Target

```text
src/config
src/content
src/context
src/registry
src/overrides
src/components
src/pages-local
public
.portfolio-engine
```
