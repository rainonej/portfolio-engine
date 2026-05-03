# @portfolio-engine/engine-core

## 0.1.1

### Patch Changes

- Fix npm package entry points: remove `publishConfig` that rewrote `exports` to missing `dist/` files. Published packages now expose `./src/index.ts` and `./src/*` so Astro/Vite consumers resolve the integration and theme sources correctly.
- Updated dependencies
  - @portfolio-engine/schema@0.1.1

## 0.1.0

### Minor Changes

- 4c8ff7a: Implement engine-core (Epic 3, Tasks 3.1–3.9): config loader + schema bridge, virtual modules, route discovery + injection, route remap/disable semantics, route registry contract, override resolution, and type injection. Also codifies the v1 no-packaged-public-dir constraint in docs and CI.
- 1e2155e: Tasks 4.3–4.5: implement the consumer-facing `editorialTheme()` integration, define the override surfaces it exposes, and add a working demo site.
  - `editorialTheme(options)` returns an array of integrations: a Tailwind PostCSS integration plus the engine-core integration. Astro flattens nested integration arrays, so the consumer-facing API is unchanged (`integrations: [editorialTheme({ ... })]`). Tailwind is configured internally via `vite.css.postcss.plugins` using the `tailwindcss` package directly; `@astrojs/tailwind` is no longer a dependency.
  - `engine-core/override-resolution.ts` declares four named component override surfaces: `Hero`, `FeaturedWriting`, `TestimonialSection`, `CollaborationSection`. Unknown surface names continue to produce a build-time error.
  - New section wrappers under `editorial-theme/src/components/sections/` check the `@portfolio-engine:overrides` virtual module and render the consumer's override or the theme default.
  - `Layout.astro` reads `overrides.__styles__` and inlines the resolved CSS files as a global stylesheet, providing the `styles[]` extra-CSS override.
  - `examples/demo-site/` is wired up end-to-end (config, content collections, sample entries, public assets) as the canonical consumer reference.
  - `editorial-theme/README.md` replaces the placeholder with a consumer quick-start, schemas, and an override surfaces reference.

### Patch Changes

- Updated dependencies [4c8ff7a]
- Updated dependencies [0497449]
  - @portfolio-engine/schema@0.1.0
