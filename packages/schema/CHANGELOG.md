# @portfolio-engine/schema

## 0.6.0

### Minor Changes

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

## 0.5.0

### Minor Changes

- 96f0133: **Breaking (schema):** `ProfilePersonSchema` drops `bio` and is now `.strict()` — use `shortBio`, `summary`, and `longBio` only. Editorial theme resolvers and admin settings UI follow the same model; TypeScript `ProfilePerson` keeps `@deprecated bio?` as a compile-time warning only (never read).

  **Breaking (editorial-theme):** Import the Astro integration from `@portfolio-engine/editorial-theme/integration` (not the package root). The root entry no longer exports `editorialTheme`, so SSR bundles do not pull Tailwind’s native Oxide binaries — fixes Vercel/Linux builds with `@astrojs/vercel`.

- c7c0ba8: **Breaking (CSS):** Legacy palette variables (`--ink`, `--paper`, `--copper`, etc.) are removed. Use semantic tokens (`--color-text-primary`, `--color-surface-page`, …) in custom CSS and overrides. `resolveCssVariables` / design snapshots now emit `--color-*` keys only.

  **Breaking (editorial-theme):** Import `editorialTheme` from `@portfolio-engine/editorial-theme/integration` (not the package root). The root entry no longer exports `editorialTheme`, so SSR bundles do not pull Tailwind’s native Oxide binaries — fixes Vercel/Linux CI builds with `@astrojs/vercel`.

  **Schema:** `theme.json` may set `semanticColors.text.inverse`, `semanticColors.border.strong`, and `site.json` may set optional `admin.showPublicLink` / `admin.publicLinkLabel` for the public footer admin link (still independent of OAuth).

  **Docs:** Route ownership, scheduling/Calendly, token checker (`pnpm check:tokens`), and upgrade guidance for bumping all `@portfolio-engine/*` packages together.

## 0.4.0

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

## 0.3.1

### Patch Changes

- 51ed888: Structured profile and typography (font entry schema), resume page, hero CTA improvements, Google Fonts `provider` handling, sanitized font fallback stacks in CSS variables, and review follow-ups.

## 0.3.0

### Minor Changes

- 777d3da: Add provider-light scheduling config and `SchedulingBlock` component for downstream contact pages. Supports button, link, and iframe embed modes using public HTTPS booking URLs without provider SDKs or calendar API integration.

## 0.2.0

### Minor Changes

- 0aca192: **Consumer registry MVP** ([Epic #81](https://github.com/rainonej/portfolio-engine/issues/81)): Zod-validated `src/registry/portfolio-engine.registry.json`, inject Astro routes from `src/pages-local`, fail on URL collisions with injected theme routes (after remaps), manifest fields `routeOrigin` and `capabilities.consumerLocalRoutes`, and package export `@portfolio-engine/editorial-theme/layouts/Layout.astro` for consumer-local pages.

## 0.1.4

### Patch Changes

- b10cfd6: Republish all core packages after release pipeline hardening so tarballs consistently include built dist artifacts.

## 0.1.3

### Patch Changes

- c84249e: Ship `dist/` package exports, real `admin-tools` build (Astro routes + API copied to `dist`), Astro peer `^6.0.0`, and publishable `@portfolio-engine/admin-tools` with `publishConfig.access: public`.

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
