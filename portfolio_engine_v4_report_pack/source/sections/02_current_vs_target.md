# Current Repo vs Target

## What is already done

The Epic 4 extraction (from the profesional_site monorepo) is complete. All five tasks are done:

- `@portfolio-engine/editorial-theme` exists with 13 components, 5 page types, layouts, and global CSS.
- `@portfolio-engine/engine-core` exists with config-loader, route-discovery, override-resolution, virtual-modules (~1,000 LOC).
- `@portfolio-engine/schema` exists with 4 Zod validation schemas.
- `examples/demo-site` builds and deploys to Vercel.
- The theme runtime consumes engine-core modules via the integration API.
- The CI pipeline (lint → check → build) is in place with a `public/` guard on packages.

The admin-tools UI also substantially exists — it was built in the profesional_site/agreni-site codebase and needs to be extracted into the `@portfolio-engine/admin-tools` package. It is not a greenfield build.

## What the current repo does well

The runtime mental model (consumer site, editorial-theme, engine-core, schema) is solid and should be preserved. The demo-site is the canonical reference consumer and should remain so. The override-resolution system validates supported component surfaces at build time — that is a strong starting point.

## Main mismatches

### Mismatch 1 — workflow-kit stub comment is stale

The `packages/workflow-kit/src/index.ts` stub comment says "reusable GitHub workflow templates and engine-aware change classifier." That is the old description from before ADR-002. The target is a Python/MCP package. The stub comment needs to be updated.

### Mismatch 2 — config path needs migration

Current demo-site and config-loader use:

```text
config/*.json          ← top-level, not src/
src/content/**
public/**
```

Target layout uses:

```text
src/config/*.json
src/content/**
src/context/**
src/overrides/**
public/**
```

This is the number one Phase 2 task. The migration must be deliberate: update the engine-core config-loader to accept the new path, update demo-site, and update all docs.

### Mismatch 3 — no formal context layer

Target adds structured context files:

```text
src/context/site-owner.json
src/context/brand-voice.json
src/context/agent-rules.md
```

None of these exist anywhere in the current repo. The schema package does not yet define these types.

### Mismatch 4 — override bridge is wired but not demonstrated

`override-resolution.ts` validates component override names against `SUPPORTED_COMPONENT_SURFACES` (hardcoded: Hero, FeaturedWriting, TestimonialSection, CollaborationSection). However, there is no demo override example in demo-site, and it is not confirmed whether the editorial-theme's page components actually consume the override map at render time. Both gaps need to close before **Backbone MVP** is declared (or override scope explicitly excluded in docs).

### Mismatch 5 — no consumer registry yet

Target adds (post-MVP):

```text
src/registry/portfolio-engine.registry.ts
```

This allows local pages and embeds without editing upstream packages. This is post-MVP.

### Mismatch 6 — no `.portfolio-engine` tool state yet

Target adds (post-MVP):

```text
.portfolio-engine/manifest.json
.portfolio-engine/state.json
.portfolio-engine/upstream-tracking.json
.portfolio-engine/patch-ledger.json
```

None of these exist. This is post–Product-MVP and depends on Phase 5 (**Epic 10**).

## Named technical debt (not yet in any ticket)

### Hardcoded ROUTE_METADATA

`packages/engine-core/src/route-discovery.ts` lines 17–74 hardcode 9 routes with full metadata as a static array. This is the concrete technical debt that **Epic 10** (explicit registries) is meant to fix. The routes work, but they cannot be inspected by tools or extended by consumers without editing this file.

### Hardcoded SUPPORTED_COMPONENT_SURFACES

`packages/engine-core/src/override-resolution.ts` hardcodes 4 override surface names as a `Set<string>`. Same issue, same fix (**Epic 10**). The override list is correct for now but cannot be machine-read or dynamically extended.

### No package build scripts

All three required packages have `"build": "echo 'build not yet configured'"`. The Changesets release workflow cannot publish without real build output. This is a Phase 1 blocker for the separate-consumer-repo model (**Epic 4**).

### No test suite

There are zero unit or integration tests across all packages. The project relies on `tsc --noEmit`, `astro check`, and CI build as quality gates. This is a known gap. At minimum, the **Backbone MVP** / debt register should acknowledge it explicitly.

## Where the current repo is already solid

- The CI/check/build pipeline structure is correct.
- The Changesets release workflow is correct.
- The dependency direction (schema → engine-core → editorial-theme) is enforced by code and CI.
- The docs/ directory is more complete than it may appear: issue-labels.md, project-management.md, github-project-board.md, architecture docs, and downstream docs all exist.
- The README should not bury new users under optional features — it should lead with the runtime MVP then explain optional layers.
