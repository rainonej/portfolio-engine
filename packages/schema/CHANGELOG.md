# @portfolio-engine/schema

## 0.1.1

### Patch Changes

- Fix npm package entry points: remove `publishConfig` that rewrote `exports` to missing `dist/` files. Published packages now expose `./src/index.ts` and `./src/*` so Astro/Vite consumers resolve the integration and theme sources correctly.

## 0.1.0

### Minor Changes

- 4c8ff7a: Implement engine-core (Epic 3, Tasks 3.1–3.9): config loader + schema bridge, virtual modules, route discovery + injection, route remap/disable semantics, route registry contract, override resolution, and type injection. Also codifies the v1 no-packaged-public-dir constraint in docs and CI.
- 0497449: Tasks 4.1 + 4.2: port layouts, components, styles, and page routes into editorial-theme
  - Extended `SiteConfigSchema` with required `tagline` and `contact`, optional `bookingUrl` (validated as URL when present)
  - Extended `FeaturesConfigSchema` with optional `pillars` array and `ctaBody` string
  - Ported all shared components to `packages/editorial-theme/src/components/` (includes `ImageOrFallback`)
  - Ported `Layout.astro` to `packages/editorial-theme/src/layouts/` — uses `@portfolio-engine:config` for site title and nav, removing all direct JSON imports
  - Ported `Nav.astro` — uses `config.navigation.items` and `config.site.title` from virtual module
  - Ported `global.css` and `utils.ts` to theme package
  - Ported all 7 user-facing page routes to `packages/editorial-theme/src/pages/` — uses `astro:content` for person/cv data and `@portfolio-engine:config` for site/features config
  - Added per-package `tsconfig.json` to all five packages to scope TypeScript checks correctly
