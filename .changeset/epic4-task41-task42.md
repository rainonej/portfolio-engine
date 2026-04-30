---
"@portfolio-engine/schema": minor
"@portfolio-engine/editorial-theme": minor
---

Tasks 4.1 + 4.2: port layouts, components, styles, and page routes into editorial-theme

- Extended `SiteConfigSchema` with optional `tagline`, `bookingUrl`, and `contact` fields
- Extended `FeaturesConfigSchema` with optional `pillars` array and `ctaBody` string
- Ported all shared components to `packages/editorial-theme/src/components/` (includes `ImageOrFallback`)
- Ported `Layout.astro` to `packages/editorial-theme/src/layouts/` — uses `@portfolio-engine:config` for site title and nav, removing all direct JSON imports
- Ported `Nav.astro` — uses `config.navigation.items` and `config.site.title` from virtual module
- Ported `global.css` and `utils.ts` to theme package
- Ported all 7 user-facing page routes to `packages/editorial-theme/src/pages/` — uses `astro:content` for person/cv data and `@portfolio-engine:config` for site/features config
- Added per-package `tsconfig.json` to all five packages to scope TypeScript checks correctly
