# Epic 12 — Explicit default registries in runtime packages

**Phase:** Phase 3 (post-MVP)
**MVP relevance:** Post-MVP — may begin before MVP if needed, but full manifest/consumer extension support is post-MVP
**Labels:** `type:epic`, `area:schema`, `area:engine-core`, `area:editorial-theme`, `source:human`

## Summary

Add explicit registry folders to the three required runtime packages. Each package has a distinct registry role. Registries make routes, override surfaces, components, and services machine-readable for agents, admin-tools, and the workflow-kit.

## Why this matters

Currently, capabilities are implicit — scattered across hardcoded route lists and component trees. An agent or admin-tools UI cannot discover what the engine supports without reading source code. Explicit registries fix this: they are the single machine-readable source of truth for what the engine exposes.

## Target structure

### packages/schema/src/registry/

Type and schema definitions for registry entries. Shared contracts used by engine-core, editorial-theme, admin-tools, and workflow-kit.

```text
packages/schema/src/
  registry/
    routes.ts
    override-surfaces.ts
    embed-services.ts
    consumer-extensions.ts
    manifest.ts
```

### packages/engine-core/src/registry/

Generic registry merging, validation, and runtime utilities. Does not own editorial-theme defaults. Must not import from editorial-theme.

```text
packages/engine-core/src/
  registry/
    normalize.ts
    validate.ts
    merge.ts
    manifest.ts
```

### packages/editorial-theme/src/registry/

Default routes, pages, components, and override surfaces shipped by the theme.

```text
packages/editorial-theme/src/
  registry/
    routes.ts
    pages.ts
    components.ts
    override-surfaces.ts
    embed-services.ts
    default-config.ts
```

## Architecture rule

Dependency direction must be preserved:

```text
schema → engine-core → editorial-theme
```

schema defines types. engine-core provides generic behavior. editorial-theme provides default values. engine-core must never import editorial-theme.

## Tickets

### T12.1 — Define registry schema contracts

**Labels:** `task:feat`, `owner:agentic-ai`, `area:schema`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] Route registry schema type exists.
- [ ] Override surface schema type exists.
- [ ] Embed/service schema type exists.
- [ ] Manifest schema type exists.
- [ ] No imports from engine-core or editorial-theme.

### T12.2 — Add engine-core registry utilities

**Labels:** `task:feat`, `owner:agentic-ai`, `area:engine-core`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] Generic validate/merge/normalize functions exist.
- [ ] No imports from editorial-theme.
- [ ] Errors are agent-readable (structured, not just thrown strings).

### T12.3 — Add editorial-theme default registries

**Labels:** `task:feat`, `owner:agentic-ai`, `area:editorial-theme`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] Default routes declared in registry files (`/`, `/about`, `/contact`, `/work`, `/work/[slug]`, `/writing`, `/writing/[slug]`).
- [ ] Default override surfaces declared (`Hero`, `FeaturedWriting`, `TestimonialSection`, `CollaborationSection`).
- [ ] Default services/components documented.
- [ ] Existing routes still render (no regressions).
- [ ] Dependency direction maintained: no imports from schema or engine-core in editorial-theme registry that would reverse the flow.
