# Registries, manifest, and runtime package defaults

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

### Move route metadata to explicit registry

**Labels:** `task:feat`, `owner:agentic-ai`, `area:editorial-theme`, `agent:approved`, `mvp:post`

Create a built-in route registry with labels, paths, visibility, remappable/disableable flags, and agent/admin metadata. Replaces the hardcoded `ROUTE_METADATA` array currently in `packages/engine-core/src/route-discovery.ts`.

**Acceptance criteria**

- [ ] The static `ROUTE_METADATA` array in `packages/engine-core/src/route-discovery.ts` is removed.
- [ ] Route metadata is loaded from the editorial-theme registry (`packages/editorial-theme/src/registry/routes.ts`) via the engine-core registry utilities.
- [ ] Routes still inject correctly in the demo-site build (no regressions).
- [ ] Registry is exported to `.portfolio-engine/manifest.json`.

### Move override surfaces to explicit registry

**Labels:** `task:feat`, `owner:agentic-ai`, `area:editorial-theme`, `agent:approved`, `mvp:post`

Declare supported surfaces with props, default component, page, docs, and guidance. Replaces the hardcoded `SUPPORTED_COMPONENT_SURFACES` array currently in `packages/engine-core/src/override-resolution.ts`.

**Acceptance criteria**

- [ ] The static `SUPPORTED_COMPONENT_SURFACES` array in `packages/engine-core/src/override-resolution.ts` is removed.
- [ ] Override validation reads supported surfaces from the editorial-theme registry (`packages/editorial-theme/src/registry/override-surfaces.ts`).
- [ ] Registry entries include props, default component path, host page, docs URL, and agent/admin guidance fields.
- [ ] Override resolution still rejects unknown surface names with the existing error contract.

### Generate `.portfolio-engine/manifest.json`

**Labels:** `task:feat`, `owner:agentic-ai`, `area:engine-core`, `agent:approved`, `mvp:post`

Generate consumer-local manifest with paths, active routes, override surfaces, content collections, package versions, and capabilities.

**Acceptance criteria**

- [ ] Manifest generated.
- [ ] Manifest includes paths/capabilities.
- [ ] Manifest does not include private content bodies.

### Define manifest privacy policy

**Labels:** `task:decision`, `owner:human-dev`, `area:safety`, `mvp:post`

Decide exactly what the manifest may include and what it must not include.

**Acceptance criteria**

- [ ] Privacy policy documented.
- [ ] Workflow-kit/admin-tools implications considered.

### Define registry schema contracts

**Labels:** `task:feat`, `owner:agentic-ai`, `area:schema`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] Route registry schema type exists.
- [ ] Override surface schema type exists.
- [ ] Embed/service schema type exists.
- [ ] Manifest schema type exists.
- [ ] No imports from engine-core or editorial-theme.

### Add engine-core registry utilities

**Labels:** `task:feat`, `owner:agentic-ai`, `area:engine-core`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] Generic validate/merge/normalize functions exist.
- [ ] No imports from editorial-theme.
- [ ] Errors are agent-readable (structured, not just thrown strings).

### Add editorial-theme default registries

**Labels:** `task:feat`, `owner:agentic-ai`, `area:editorial-theme`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] Default routes declared in registry files (`/`, `/about`, `/contact`, `/work`, `/work/[slug]`, `/writing`, `/writing/[slug]`).
- [ ] Default override surfaces declared (`Hero`, `FeaturedWriting`, `TestimonialSection`, `CollaborationSection`).
- [ ] Default services/components documented.
- [ ] Existing routes still render (no regressions).
- [ ] Dependency direction maintained.
