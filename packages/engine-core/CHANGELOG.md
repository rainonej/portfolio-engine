# @portfolio-engine/engine-core

## 0.3.7

### Patch Changes

- eeeaf3b: Fix `ENOENT` crash on any server-rendered route when a consumer configures `overrides.styles`.

  `resolveOverrides()` (`engine-core`) previously stored resolved **file paths** for `overrides.styles` in the `__styles__` entry of the `@portfolio-engine:overrides` virtual module. `Layout.astro` (`editorial-theme`) then called `fs.readFileSync()` on those paths **at request time**. That works for prerendered/static routes (built once, when the consumer's `src/` tree is present on the build machine), but any server-rendered route (`export const prerender = false`, or any route under `output: 'server'`) re-runs `Layout.astro`'s frontmatter **per request** — and serverless runtimes (Vercel included) don't bundle the raw source tree, only what static analysis can trace. Since the path came from a runtime-parsed JSON string, it isn't traceable, so the file is missing at runtime: `ENOENT: no such file or directory, open '.../src/overrides/styles/....css'`. Astro's error handling for this case can result in a `200` response with an **empty body** rather than a clean `500` — the page silently renders blank.

  `resolveOverrides()` now reads and inlines the CSS **content** (not paths) at config-resolution time — this runs once during `astro build`/dev-server-start, when the source tree is guaranteed to exist, regardless of whether any given route ends up prerendered or server-rendered. `Layout.astro` no longer touches the filesystem at all; it just reads the already-resolved string from the virtual module.

  Verified against `tests/fixtures/node-ssr` (`output: 'server'`): built with an `overrides.styles` entry, then the source file was deleted before starting the built server — the override CSS still rendered correctly with no runtime error, confirming no filesystem dependency survives into the running server.

  #### Agent migration
  - **Packages:** `@portfolio-engine/engine-core`, `@portfolio-engine/editorial-theme`
  - **Consumer paths:** no file changes required — `astro.config.*`'s `overrides.styles` option is unchanged.
  - **Actions:**
    - No migration needed — internal implementation fix, same public config shape.
    - If any consumer route using `overrides.styles` is server-rendered (`prerender = false`, or an `output: 'server'`/`'hybrid'` project) and previously rendered blank/broken, it should now render correctly after upgrading — no workaround needed.

## 0.3.6

### Patch Changes

- Updated dependencies [5fc2bcf]
  - @portfolio-engine/schema@0.8.0

## 0.3.5

### Patch Changes

- Updated dependencies [fa1558a]
  - @portfolio-engine/schema@0.7.1

## 0.3.4

### Patch Changes

- Updated dependencies [3556096]
  - @portfolio-engine/schema@0.7.0

## 0.3.3

### Patch Changes

- 4ff12a1: Add generic schema primitives and build out workflow-kit templates.

  **`@portfolio-engine/engine-core`** — updated `client.d.ts` header comment with detailed
  explanation of the script vs. module classification constraint.

  **`@portfolio-engine/schema`** — new `content-primitives` exports:

  `MetricSchema`, `EvidenceItemSchema`, `RelatedLinkSchema`, `ImageAssetSchema`,
  `TagListSchema`, `PageHeaderSchema`, `CalloutSchema`, `ContentBlockSchema`,
  `CardSummarySchema`, `TemplateContractSchema`. Object schemas use `.strict()`;
  `TagListSchema` is `z.array(z.string())` (array schemas do not use `.strict()`).
  Downstream repos compose these into site-specific schemas instead of defining
  generic shapes from scratch.

  **`@portfolio-engine/workflow-kit`** — templates directory built out:
  - `templates/github/` — CI workflow, PR template, issue template
  - `templates/vscode/` — extensions, settings (format-on-save, file nesting, rulers), tasks
  - `templates/cursor/rules/` — architecture boundary rules and downstream agent rules for AI tools
  - `templates/prompts/` — four AI review prompts (architecture-review, downstream-upgrade, content-boundary-review, visual-review)
  - `templates/scripts/` — five check scripts (check-content-boundaries, check-schema-strictness, check-rendered-links, check-unused, check-tooling-version)

  ### Agent update note

  Workflow-kit templates changed.

  Downstream agents should compare and update:
  - `.github/workflows/ci.yml`
  - `.vscode/extensions.json`
  - `.vscode/settings.json`
  - `.cursor/rules/portfolio-engine-boundaries.md`
  - `.cursor/rules/downstream-agent-rules.md`
  - `scripts/check-content-boundaries.mjs`
  - `scripts/check-schema-strictness.mjs`
  - `scripts/check-rendered-links.mjs`
  - `scripts/check-unused.mjs`
  - `scripts/check-tooling-version.mjs`

  Do not blindly overwrite downstream customizations. Copy the new checks intentionally.

- Updated dependencies [4ff12a1]
  - @portfolio-engine/schema@0.6.0

## 0.3.2

### Patch Changes

- 4094a9d: Fix IDE type errors in editorial-theme and engine-core: add typed collection wrappers (`getProjects`, `getWritingPosts`, `getTestimonials`), add constrained overload + runtime guard to `sortByDateDesc`, publish `client.d.ts` at package root for reliable IDE virtual-module resolution, and mark the root file as generated.

## 0.3.1

### Patch Changes

- c7c0ba8: **Breaking (CSS):** Legacy palette variables (`--ink`, `--paper`, `--copper`, etc.) are removed. Use semantic tokens (`--color-text-primary`, `--color-surface-page`, …) in custom CSS and overrides. `resolveCssVariables` / design snapshots now emit `--color-*` keys only.

  **Breaking (editorial-theme):** Import `editorialTheme` from `@portfolio-engine/editorial-theme/integration` (not the package root). The root entry no longer exports `editorialTheme`, so SSR bundles do not pull Tailwind’s native Oxide binaries — fixes Vercel/Linux CI builds with `@astrojs/vercel`.

  **Schema:** `theme.json` may set `semanticColors.text.inverse`, `semanticColors.border.strong`, and `site.json` may set optional `admin.showPublicLink` / `admin.publicLinkLabel` for the public footer admin link (still independent of OAuth).

  **Docs:** Route ownership, scheduling/Calendly, token checker (`pnpm check:tokens`), and upgrade guidance for bumping all `@portfolio-engine/*` packages together.

- Updated dependencies [96f0133]
- Updated dependencies [c7c0ba8]
  - @portfolio-engine/schema@0.5.0

## 0.3.0

### Minor Changes

- cde901a: Upstream hardening: nav CSS baseline, manifest diagnostics, profile schemas, doctor script

  **Nav rendering robustness (P0)**
  - Added `pe-site-*` semantic classes to `Nav.astro` alongside Tailwind utilities, so nav layout holds even when Tailwind utility generation is partial or absent in a downstream build.
  - Added explicit CSS baseline for `.pe-site-header`, `.pe-site-nav`, `.pe-site-brand`, `.pe-site-nav-list`, `.pe-site-nav-link` in `global.css`, with a responsive mobile rule at `≤720px`.

  **Manifest diagnostics (P0)**
  - `ManifestRouteEntry` now includes a required `routeOrigin` and `entrypoint` (relative path from consumer root) for every route. The engine emits `"theme"` for editorial-theme routes and `"consumer-local"` for registry routes. `"consumer-pages"` and `"unknown"` are reserved type values for future use and are not emitted in this release.
  - `EngineManifest` now includes `portfolioEngine` (package versions), `consumerRegistry` (load state and route count), `routeOverrides` (disabled and remapped patterns), and an optional `navWarnings` array.
  - Engine integration validates nav items against active injected routes and emits warnings for items that cannot be matched. Pass `diagnostics: { strictNavRoutes: true }` to `editorialTheme()` to fail the build on nav/route mismatches.

  **Profile schemas (P1)**
  - `@portfolio-engine/schema` now exports `ProfilePersonSchema`, `ProfileCvSchema`, `ProfileExperienceSchema`, `ProfileEducationSchema`, and `ProfileAwardSchema` so downstream sites can import canonical schemas rather than duplicating minimal local definitions.
  - Demo site `content.config.ts` updated to use the exported schemas.

  **Accessibility (P1)**
  - `ImageOrFallback` fallback character is now `aria-hidden="true"` with `role="img"` and `aria-label` on the container, so screen readers get the card title instead of a lone letter.

  **Default copy (P1)**
  - Writing index page now shows "Essays, notes, and selected thinking." subtitle and a neutral empty-state message.

  **Doctor script (P2)**
  - `portfolio-engine` (or `pnpm pe:doctor`) runs the doctor CLI, which reads `.portfolio-engine/manifest.json` and prints a structured diagnostic report: package versions, consumer registry state, route origins and entrypoints, nav warnings, and capabilities. The `portfolio-engine` bin maps directly to the doctor script — no subcommand is needed.

### Patch Changes

- Updated dependencies [cde901a]
  - @portfolio-engine/schema@0.4.0

## 0.2.2

### Patch Changes

- Updated dependencies [51ed888]
  - @portfolio-engine/schema@0.3.1

## 0.2.1

### Patch Changes

- Updated dependencies [777d3da]
  - @portfolio-engine/schema@0.3.0

## 0.2.0

### Minor Changes

- 0aca192: **Consumer registry MVP** ([Epic #81](https://github.com/rainonej/portfolio-engine/issues/81)): Zod-validated `src/registry/portfolio-engine.registry.json`, inject Astro routes from `src/pages-local`, fail on URL collisions with injected theme routes (after remaps), manifest fields `routeOrigin` and `capabilities.consumerLocalRoutes`, and package export `@portfolio-engine/editorial-theme/layouts/Layout.astro` for consumer-local pages.

### Patch Changes

- Updated dependencies [0aca192]
  - @portfolio-engine/schema@0.2.0

## 0.1.5

### Patch Changes

- b10cfd6: Republish all core packages after release pipeline hardening so tarballs consistently include built dist artifacts.
- Updated dependencies [b10cfd6]
  - @portfolio-engine/schema@0.1.4

## 0.1.4

### Patch Changes

- c84249e: Ship `dist/` package exports, real `admin-tools` build (Astro routes + API copied to `dist`), Astro peer `^6.0.0`, and publishable `@portfolio-engine/admin-tools` with `publishConfig.access: public`.
- Updated dependencies [c84249e]
  - @portfolio-engine/schema@0.1.3

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
