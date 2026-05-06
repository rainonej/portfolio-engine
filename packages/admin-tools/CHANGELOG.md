# @portfolio-engine/admin-tools

## 0.0.15

### Patch Changes

- 51c8a0c: Improve admin route ergonomics for consumers: extensionless client script import, `@ts-nocheck` on the published route, and README guidance for tsconfig `exclude` and tarball patching workflows.
- Updated dependencies [51ed888]
  - @portfolio-engine/schema@0.3.1
  - @portfolio-engine/editorial-theme@0.3.1
  - @portfolio-engine/engine-core@0.2.2

## 0.0.13

### Patch Changes

- Fix token swatch rendering for modern CSS color functions (`color(srgb…)`, `oklch(…)`): prefer server-side design-token snapshot when available so swatches display correct colors regardless of how `getComputedStyle` serializes them.

## 0.0.12

### Patch Changes

- Fix release workflow: add `contents: write` permission and push git tags after `changeset publish` so `@portfolio-engine/*@x.y.z` tags appear in Git history even when publish no-ops.
- Fix promote script: queue a follow-up `workflow_dispatch` Release after the dev→main merge so npm publish always runs (default `GITHUB_TOKEN` does not re-trigger workflows on push).

## 0.0.11

### Patch Changes

- Fix broken `/admin` client script: replace invalid `define:vars` + ESM `import` combination (which Astro wraps in an IIFE, making `import` illegal) with a plain module `<script>` that reads `contentApiUrl` from `#admin-root`'s `data-content-api` dataset attribute.
- Fix missing `dist/client/` in published npm tarball: add `'client'` to the `copyAstroAndApiTree` directory list in `tsup.config.ts` so `dist/client/admin-app.ts`, `content-api.ts`, and `yaml-frontmatter.ts` are included on publish.

## 0.0.10

### Patch Changes

- Updated dependencies [777d3da]
  - @portfolio-engine/schema@0.3.0
  - @portfolio-engine/editorial-theme@0.3.0
  - @portfolio-engine/engine-core@0.2.1

## 0.0.9

### Patch Changes

- Updated dependencies [0aca192]
  - @portfolio-engine/schema@0.2.0
  - @portfolio-engine/engine-core@0.2.0
  - @portfolio-engine/editorial-theme@0.2.0

## 0.0.8

### Patch Changes

- b10cfd6: Republish all core packages after release pipeline hardening so tarballs consistently include built dist artifacts.
- Updated dependencies [b10cfd6]
  - @portfolio-engine/engine-core@0.1.5

## 0.0.7

### Patch Changes

- c84249e: Ship `dist/` package exports, real `admin-tools` build (Astro routes + API copied to `dist`), Astro peer `^6.0.0`, and publishable `@portfolio-engine/admin-tools` with `publishConfig.access: public`.
- Updated dependencies [c84249e]
  - @portfolio-engine/engine-core@0.1.4

## 0.0.5

### Minor Changes

- Ship `adminTools()` Astro integration: injects `/admin` read-only dashboard (engine virtual modules + content collections) and `/api/auth/*` GitHub OAuth routes. Optional `devBypass` for local `astro dev` without OAuth.

### Patch Changes

- Enforce authentication in `/admin` server render before emitting dashboard HTML; remove client-only gate.
- OAuth: use `read:user repo`; validate token exchange responses; respect Astro `base` for callback, post-login redirect, and logout.
- Logout is `POST` only (`GET` returns 405) to avoid cross-site forced logout.
- Harden `getCollection` usage when optional collections are missing; expand `tsconfig` `include` for route TypeScript.

## 0.0.4

### Patch Changes

- Updated dependencies [a6e295c]
  - @portfolio-engine/engine-core@0.1.2

## 0.0.3

### Patch Changes

- Updated dependencies
  - @portfolio-engine/engine-core@0.1.1

## 0.0.2

### Patch Changes

- Updated dependencies [4c8ff7a]
- Updated dependencies [1e2155e]
  - @portfolio-engine/engine-core@0.1.0
