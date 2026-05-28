# @portfolio-engine/editorial-theme

## 0.8.0

### Minor Changes

- 5fc2bcf: Add canonical project visibility support (`published | unlisted | draft`).

  **`@portfolio-engine/schema`**
  - `ProjectVisibilitySchema` — Zod enum for the three visibility states
  - `ProjectVisibility` — inferred TypeScript type

  **`@portfolio-engine/editorial-theme`**
  - `ProjectData.visibility` field — required; build will throw a descriptive error if the field is absent from an entry
  - `getProjectVisibility(entry)` — reads the visibility field and throws with an actionable message if it is missing
  - `isProjectListed(entry)` — true for `published` entries only
  - `isProjectBuildable(entry)` — true for `published` and `unlisted`; false for `draft`
  - `getProjects()` now accepts `opts.visibility`:
    - `'listed'` (default) — published only; safe for all public list pages
    - `'buildable'` — published + unlisted; use in `getStaticPaths` for detail routes
    - `'all'` — every entry including drafts; for admin/editorial tools
  - `getProjectById()` now accepts `opts.visibility` and defaults to `buildable` (direct links to drafts return `undefined`)

  **Behavior change:** `getProjects()` with no arguments now returns only `published` entries (previously returned all). Public pages are unaffected. Any custom page that previously relied on `getProjects()` returning draft or unlisted entries should switch to `getProjects({ visibility: 'all' })`.

  #### Agent migration
  - **Packages:** `@portfolio-engine/schema`, `@portfolio-engine/editorial-theme`
  - **Consumer paths:** `src/content.config.ts`
  - **Actions:**
    1. Add `ProjectVisibilitySchema` to your schema imports from `@portfolio-engine/schema`.
    2. Add `visibility: ProjectVisibilitySchema.optional().default('published')` to your `projects` collection schema.
    3. Existing project entries without a `visibility` frontmatter value will default to `published` via the schema `.default('published')`. No per-file frontmatter changes required.
    4. See `docs/downstream/project-visibility.md` for full usage and workflow guidance.

### Patch Changes

- Updated dependencies [5fc2bcf]
  - @portfolio-engine/schema@0.8.0
  - @portfolio-engine/engine-core@0.3.6

## 0.7.5

### Patch Changes

- Updated dependencies [fa1558a]
  - @portfolio-engine/schema@0.7.1
  - @portfolio-engine/engine-core@0.3.5

## 0.7.4

### Patch Changes

- 3556096: Add strict theme-token boundary enforcement, structured color token schema, and `DEFAULT_THEME_CONFIG`.

  **Breaking changes in `@portfolio-engine/schema`:**
  - `SemanticColorsSchema` color slots now require structured token objects (`value`, `name`, `cssVar`, `role`, `usage`, `avoid`, `examples`) instead of plain hex strings. Update `src/config/theme.json` in downstream sites.
  - `cssVar` is validated with `z.literal(...)` per semantic slot — arbitrary names are rejected.
  - Flat `colors` (`primary`, `secondary`, `background`, `text`) removed from `ThemeConfigSchema`. Use `semanticColors` only.
  - `design-resolve.ts` reads `semanticColors.*.*.value` — the legacy `theme.colors.*` fallback is gone.
  - Source labels in `design-snapshot.json` now include `.value` suffix (e.g. `theme.semanticColors.accent.primary.value`).

  **New in `@portfolio-engine/schema`:**
  - `DEFAULT_THEME_CONFIG` — complete structured default theme for downstream scaffolding.
  - `ThemeColorToken` type export.
  - `guidance` field on `ThemeConfigSchema` for design principles and agent guidance.

  **New in `@portfolio-engine/workflow-kit`:**
  - `templates/scripts/check-theme-token-boundaries.mjs` — reusable downstream guardrail script. Fails on literal hex, rgb, hsl, oklch, private palettes, and canonical token redefinition outside `src/config/theme.json`.
  - `templates/scripts/theme-token-boundaries.config.example.mjs` — config template.
  - `TEMPLATE_PATHS.scripts.checkThemeTokenBoundaries` and `themeTokenBoundariesConfigExample` exports.

  **Upstream:**
  - Root `check:theme-token-boundaries` script scans `examples/demo-site` and workflow-kit templates.
  - Wired into root `pnpm check`.
  - Failing fixture (`scripts/fixtures/theme-token-boundaries/failing-private-palette.html`) and passing fixture for regression testing.

- Updated dependencies [3556096]
  - @portfolio-engine/schema@0.7.0
  - @portfolio-engine/engine-core@0.3.4

## 0.7.3

### Patch Changes

- b341c26: Prevent the decorative ambient background from intercepting pointer interactions.

  `AmbientBackground.astro` is `aria-hidden` and visually behind the page (`-z-10`), but
  lacked explicit `pointer-events: none`. This allowed the layer to intercept clicks and text
  selection in rendered sites, causing CTAs and cards to fail in real browser interaction even
  when their `href` values were correct.

  This was the root cause of the downstream click failures reported in `jordan-site` PR #60:
  static rendered-link checks passed because hrefs existed, but actual browser clicks were
  blocked until pointer events were disabled on `.ambient-bg`.

  #### Agent migration
  - **Packages:** `@portfolio-engine/editorial-theme`
  - **Consumer paths:** no consumer action required — this is fixed upstream
  - **Actions:**
    - If a downstream site added a local CSS workaround like `.ambient-bg { pointer-events: none }`,
      that workaround is now redundant and can be removed after upgrading.

## 0.7.2

### Patch Changes

- 9259505: Fix FeaturedWork section on homepage to respect `features.work` flag. Previously, setting `features.work: false` in `features.json` had no effect — the section gated only on `featured.length > 0`. Now the section (and the underlying `getProjects()` call) is skipped entirely when `features.work` is `false`, consistent with how `features.testimonials` already gates its section.

## 0.7.1

### Patch Changes

- Updated dependencies [4ff12a1]
  - @portfolio-engine/engine-core@0.3.3
  - @portfolio-engine/schema@0.6.0

## 0.7.0

### Minor Changes

- d623afc: Add universal content component library under `components/content/` with 11 generic editorial components
  (ContentSectionHeader, LinkCard, FeatureCard, EvidenceCard, MetricCard, MetricStrip, QuoteCard, CardGrid,
  ArticlePreviewCard, RelatedLinkCard, TagList). Export all components through stable public package paths.

### Patch Changes

- 4094a9d: Fix IDE type errors in editorial-theme and engine-core: add typed collection wrappers (`getProjects`, `getWritingPosts`, `getTestimonials`), add constrained overload + runtime guard to `sortByDateDesc`, publish `client.d.ts` at package root for reliable IDE virtual-module resolution, and mark the root file as generated.
- b7c2c97: Unlock `/work/[slug]` and `/writing/[slug]` in the default registry (`remappable: true, disableable: true`) so downstream sites can fully replace the individual work and writing item screens.
- Updated dependencies [4094a9d]
  - @portfolio-engine/engine-core@0.3.2

## 0.6.0

### Minor Changes

- f99591c: Add `IframeEmbed.astro` — a generic, security-vetted iframe component for embedding static interactive demos (e.g. self-contained HTML/Plotly pages dropped under `public/assets/demos/...`) or trusted absolute https:// URLs inside content pages.

  The component validates `src` (rejects `http://`, `javascript:`, `data:`, protocol-relative `//host`, paths containing backslashes that WHATWG URL parsers normalize cross-origin, and paths containing control characters; accepts same-origin paths starting with `/` and absolute https:// URLs only after a sentinel-base resolution check), enforces an optional `allowedHosts` allowlist for absolute URLs (compared against the normalized `URL.hostname`, lowercased, with whitespace trimming — port is intentionally not part of host matching), requires a `title` for accessibility, and exposes typed props for `sandbox`, `allow`, and `referrerpolicy` so each consumer chooses the right posture per embed. `height` and `aspectRatio` inputs are validated against restrictive CSS-length / aspect-ratio regexes before being placed on the element (so the props are safe even if a consumer ever wires them to a content-collection field). Sizing falls back to a fixed 720px height to match `SchedulingBlock`, with `height` and `aspectRatio` overrides for fixed-pixel and responsive content respectively. Renders as a `<figure>` with an optional `<figcaption>` styled against the theme's existing `--color-border-default` / `--color-surface-elevated` / `--color-text-muted` / `--text-small` tokens.

  New package export: `@portfolio-engine/editorial-theme/components/IframeEmbed.astro`.

  Companion docs page: `docs/downstream/iframe-embeds-and-demos.md`, covering placement of static demos under `public/`, embedding from `.astro` pages, the raw-`<iframe>` path required for `.md` content collection entries (content collections can only import Astro components from `.mdx`), and the opt-in `@astrojs/mdx` setup that lets `.mdx` entries use the component directly.

  #### Agent migration
  - **Packages:** `@portfolio-engine/editorial-theme`. No content / schema / public-import / CSS-variable contract changes — purely additive.
  - **Consumer paths:** none required for existing sites. No edits to `src/content/**`, `src/config/**`, `src/registry/**`, or `astro.config.*`.
  - **Actions:**
    - **No-op for upgrades.** Run `pnpm install` (or bump the editorial-theme version in `package.json`) and the new component ships with the package.
    - To use it, import from `@portfolio-engine/editorial-theme/components/IframeEmbed.astro` inside an `.astro` page (theme route, `src/pages-local/**`, or `src/pages/**`). `.md` content collection entries should keep using raw `<iframe>` HTML; `.mdx` entries can import the component after the consumer installs and registers `@astrojs/mdx`.
  - **CSS:** No new editorial CSS variables. The component uses scoped styles that read existing `--color-border-default` / `--color-surface-elevated` / `--color-text-muted` / `--text-small` tokens.

## 0.5.1

### Patch Changes

- 0ee8cc1: Neutralize default Work and About page copy: generic headings, subtitle on Work, and a persona-neutral About empty state.

## 0.5.0

### Minor Changes

- 96f0133: **Breaking (schema):** `ProfilePersonSchema` drops `bio` and is now `.strict()` — use `shortBio`, `summary`, and `longBio` only. Editorial theme resolvers and admin settings UI follow the same model; TypeScript `ProfilePerson` keeps `@deprecated bio?` as a compile-time warning only (never read).

  **Breaking (editorial-theme):** Import the Astro integration from `@portfolio-engine/editorial-theme/integration` (not the package root). The root entry no longer exports `editorialTheme`, so SSR bundles do not pull Tailwind’s native Oxide binaries — fixes Vercel/Linux builds with `@astrojs/vercel`.

- c7c0ba8: **Breaking (CSS):** Legacy palette variables (`--ink`, `--paper`, `--copper`, etc.) are removed. Use semantic tokens (`--color-text-primary`, `--color-surface-page`, …) in custom CSS and overrides. `resolveCssVariables` / design snapshots now emit `--color-*` keys only.

  **Breaking (editorial-theme):** Import `editorialTheme` from `@portfolio-engine/editorial-theme/integration` (not the package root). The root entry no longer exports `editorialTheme`, so SSR bundles do not pull Tailwind’s native Oxide binaries — fixes Vercel/Linux CI builds with `@astrojs/vercel`.

  **Schema:** `theme.json` may set `semanticColors.text.inverse`, `semanticColors.border.strong`, and `site.json` may set optional `admin.showPublicLink` / `admin.publicLinkLabel` for the public footer admin link (still independent of OAuth).

  **Docs:** Route ownership, scheduling/Calendly, token checker (`pnpm check:tokens`), and upgrade guidance for bumping all `@portfolio-engine/*` packages together.

### Patch Changes

- Updated dependencies [96f0133]
- Updated dependencies [c7c0ba8]
  - @portfolio-engine/schema@0.5.0
  - @portfolio-engine/engine-core@0.3.1

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

### Patch Changes

- Updated dependencies [cde901a]
  - @portfolio-engine/engine-core@0.3.0
  - @portfolio-engine/schema@0.4.0

## 0.3.1

### Patch Changes

- 51ed888: Structured profile and typography (font entry schema), resume page, hero CTA improvements, Google Fonts `provider` handling, sanitized font fallback stacks in CSS variables, and review follow-ups.
- Updated dependencies [51ed888]
  - @portfolio-engine/schema@0.3.1
  - @portfolio-engine/engine-core@0.2.2

## 0.3.0

### Minor Changes

- 777d3da: Add provider-light scheduling config and `SchedulingBlock` component for downstream contact pages. Supports button, link, and iframe embed modes using public HTTPS booking URLs without provider SDKs or calendar API integration.

### Patch Changes

- Updated dependencies [777d3da]
  - @portfolio-engine/schema@0.3.0
  - @portfolio-engine/engine-core@0.2.1

## 0.2.0

### Minor Changes

- 0aca192: **Consumer registry MVP** ([Epic #81](https://github.com/rainonej/portfolio-engine/issues/81)): Zod-validated `src/registry/portfolio-engine.registry.json`, inject Astro routes from `src/pages-local`, fail on URL collisions with injected theme routes (after remaps), manifest fields `routeOrigin` and `capabilities.consumerLocalRoutes`, and package export `@portfolio-engine/editorial-theme/layouts/Layout.astro` for consumer-local pages.

### Patch Changes

- Updated dependencies [0aca192]
  - @portfolio-engine/schema@0.2.0
  - @portfolio-engine/engine-core@0.2.0

## 0.1.5

### Patch Changes

- b10cfd6: Republish all core packages after release pipeline hardening so tarballs consistently include built dist artifacts.
- Updated dependencies [b10cfd6]
  - @portfolio-engine/schema@0.1.4
  - @portfolio-engine/engine-core@0.1.5

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
