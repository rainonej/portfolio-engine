# @portfolio-engine/editorial-theme

## 0.1.4

### Patch Changes

- c84249e: Ship `dist/` package exports, real `admin-tools` build (Astro routes + API copied to `dist`), Astro peer `^6.0.0`, and publishable `@portfolio-engine/admin-tools` with `publishConfig.access: public`.
- Updated dependencies [c84249e]
  - @portfolio-engine/schema@0.1.3
  - @portfolio-engine/engine-core@0.1.4

## 0.1.2

### Patch Changes

- a6e295c: Fix override bridge for Windows SSG builds. Replace `@vite-ignore` dynamic
  imports (which bypassed Vite's compiler and broke Node's ESM loader on Windows)
  with per-surface virtual modules that emit static imports — Vite now processes
  consumer override `.astro` files through its normal pipeline.

  `engine-core` adds `@portfolio-engine:override/<Surface>` virtual modules (one
  per supported surface) that export the consumer component or `null`. `editorial-
theme` updates all five override-capable components to use these static imports
  instead of dynamic `await import()`.

  Also adds `Footer` as a new supported override surface.

- Updated dependencies [a6e295c]
  - @portfolio-engine/engine-core@0.1.2

## 0.1.1

### Patch Changes

- Fix npm package entry points: remove `publishConfig` that rewrote `exports` to missing `dist/` files. Published packages now expose `./src/index.ts` and `./src/*` so Astro/Vite consumers resolve the integration and theme sources correctly.
- Updated dependencies
  - @portfolio-engine/engine-core@0.1.1

## 0.1.0

### Minor Changes

- 0497449: Tasks 4.1 + 4.2: port layouts, components, styles, and page routes into editorial-theme
  - Extended `SiteConfigSchema` with required `tagline` and `contact`, optional `bookingUrl` (validated as URL when present)
  - Extended `FeaturesConfigSchema` with optional `pillars` array and `ctaBody` string
  - Ported all shared components to `packages/editorial-theme/src/components/` (includes `ImageOrFallback`)
  - Ported `Layout.astro` to `packages/editorial-theme/src/layouts/` — uses `@portfolio-engine:config` for site title and nav, removing all direct JSON imports
  - Ported `Nav.astro` — uses `config.navigation.items` and `config.site.title` from virtual module
  - Ported `global.css` and `utils.ts` to theme package
  - Ported all 7 user-facing page routes to `packages/editorial-theme/src/pages/` — uses `astro:content` for person/cv data and `@portfolio-engine:config` for site/features config
  - Added per-package `tsconfig.json` to all five packages to scope TypeScript checks correctly

- 1e2155e: Tasks 4.3–4.5: implement the consumer-facing `editorialTheme()` integration, define the override surfaces it exposes, and add a working demo site.
  - `editorialTheme(options)` returns an array of integrations: a Tailwind PostCSS integration plus the engine-core integration. Astro flattens nested integration arrays, so the consumer-facing API is unchanged (`integrations: [editorialTheme({ ... })]`). Tailwind is configured internally via `vite.css.postcss.plugins` using the `tailwindcss` package directly; `@astrojs/tailwind` is no longer a dependency.
  - `engine-core/override-resolution.ts` declares four named component override surfaces: `Hero`, `FeaturedWriting`, `TestimonialSection`, `CollaborationSection`. Unknown surface names continue to produce a build-time error.
  - New section wrappers under `editorial-theme/src/components/sections/` check the `@portfolio-engine:overrides` virtual module and render the consumer's override or the theme default.
  - `Layout.astro` reads `overrides.__styles__` and inlines the resolved CSS files as a global stylesheet, providing the `styles[]` extra-CSS override.
  - `examples/demo-site/` is wired up end-to-end (config, content collections, sample entries, public assets) as the canonical consumer reference.
  - `editorial-theme/README.md` replaces the placeholder with a consumer quick-start, schemas, and an override surfaces reference.

### Patch Changes

- Updated dependencies [4c8ff7a]
- Updated dependencies [1e2155e]
  - @portfolio-engine/engine-core@0.1.0
