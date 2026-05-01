# Epic 10 — Registries, manifest, and runtime package defaults

**Phase:** Phase 5  
**MVP relevance:** Post–Product-MVP — full manifest and consumer extension support  
**Products touched:** A, B, E, F  
**Labels:** `type:epic`, `area:schema`, `area:engine-core`, `area:editorial-theme`, `source:human`

## Summary

Expose routes, override surfaces, paths, and capabilities as explicit registries and `.portfolio-engine/manifest.json`, and add explicit default registry folders in `schema`, `engine-core`, and `editorial-theme` so agents, admin-tools, and workflow-kit read machine-readable contracts instead of scraping source.

## Why this matters

Capabilities are currently implicit (hardcoded route lists, component trees). Explicit registries are the single source of truth for what the engine exposes. Dependency direction stays `schema → engine-core → editorial-theme`; engine-core must not import editorial-theme.

## Target structure (runtime packages)

### packages/schema/src/registry/

Type and schema definitions for registry entries.

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

Generic registry merging, validation, runtime utilities, manifest generation.

```text
packages/engine-core/src/
  registry/
    normalize.ts
    validate.ts
    merge.ts
    manifest.ts
```

### packages/editorial-theme/src/registry/

Default routes, pages, components, override surfaces shipped by the theme.

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

## Tickets

### T10.1 — Move route metadata to explicit registry

**Labels:** `task:feat`, `owner:agentic-ai`, `area:editorial-theme`, `agent:approved`, `mvp:post`

Create a built-in route registry with labels, paths, visibility, remappable/disableable flags, and agent/admin metadata.

**Acceptance criteria**

- [ ] Routes still inject correctly.
- [ ] Registry exported to manifest.

### T10.2 — Move override surfaces to explicit registry

**Labels:** `task:feat`, `owner:agentic-ai`, `area:editorial-theme`, `agent:approved`, `mvp:post`

Declare supported surfaces with props, default component, page, docs, and guidance.

**Acceptance criteria**

- [ ] Override validation uses registry.
- [ ] Registry includes docs/guidance fields.

### T10.3 — Generate `.portfolio-engine/manifest.json`

**Labels:** `task:feat`, `owner:agentic-ai`, `area:engine-core`, `agent:approved`, `mvp:post`

Generate consumer-local manifest with paths, active routes, override surfaces, content collections, package versions, and capabilities.

**Acceptance criteria**

- [ ] Manifest generated.
- [ ] Manifest includes paths/capabilities.
- [ ] Manifest does not include private content bodies.

### T10.4 — Define manifest privacy policy

**Labels:** `task:decision`, `owner:human-dev`, `area:safety`, `mvp:post`

Decide exactly what the manifest may include and what it must not include.

**Acceptance criteria**

- [ ] Privacy policy documented.
- [ ] Workflow-kit/admin-tools implications considered.

### T10.5 — Define registry schema contracts

**Labels:** `task:feat`, `owner:agentic-ai`, `area:schema`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] Route registry schema type exists.
- [ ] Override surface schema type exists.
- [ ] Embed/service schema type exists.
- [ ] Manifest schema type exists.
- [ ] No imports from engine-core or editorial-theme.

### T10.6 — Add engine-core registry utilities

**Labels:** `task:feat`, `owner:agentic-ai`, `area:engine-core`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] Generic validate/merge/normalize functions exist.
- [ ] No imports from editorial-theme.
- [ ] Errors are agent-readable (structured, not just thrown strings).

### T10.7 — Add editorial-theme default registries

**Labels:** `task:feat`, `owner:agentic-ai`, `area:editorial-theme`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] Default routes declared in registry files (`/`, `/about`, `/contact`, `/work`, `/work/[slug]`, `/writing`, `/writing/[slug]`).
- [ ] Default override surfaces declared (`Hero`, `FeaturedWriting`, `TestimonialSection`, `CollaborationSection`).
- [ ] Default services/components documented.
- [ ] Existing routes still render (no regressions).
- [ ] Dependency direction maintained.
