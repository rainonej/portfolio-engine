---
'@portfolio-engine/editorial-theme': minor
'@portfolio-engine/engine-core': minor
'@portfolio-engine/schema': minor
---

Upstream hardening: nav CSS baseline, manifest diagnostics, profile schemas, doctor script

**Nav rendering robustness (P0)**
- Added `pe-site-*` semantic classes to `Nav.astro` alongside Tailwind utilities, so nav layout holds even when Tailwind utility generation is partial or absent in a downstream build.
- Added explicit CSS baseline for `.pe-site-header`, `.pe-site-nav`, `.pe-site-brand`, `.pe-site-nav-list`, `.pe-site-nav-link` in `global.css`, with a responsive mobile rule at `≤720px`.

**Manifest diagnostics (P0)**
- `ManifestRouteEntry` now includes a required `routeOrigin` (`"theme" | "consumer-local" | "consumer-pages" | "unknown"`) and `entrypoint` (relative path) for every route, making it immediately clear which file owns each URL.
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
- `portfolio-engine doctor` (or `pnpm pe:doctor`) reads `.portfolio-engine/manifest.json` and prints a structured diagnostic report: package versions, consumer registry state, route origins and entrypoints, nav warnings, and capabilities.
