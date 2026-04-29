# @portfolio-engine/engine-core

The Astro integration at the heart of portfolio-engine.

## Responsibilities

- **Config loader + schema bridge** — loads and validates `site.json`, `navigation.json`, `theme.json`, `features.json` against `@portfolio-engine/schema`
- **Virtual modules** — exposes validated config and content data to Astro components without filesystem coupling
- **Route discovery + injection** — scans the theme's route directory and injects them into the consumer Astro project
- **Route remap / enable / disable** — consumers can disable or remap individual routes via config
- **Route registry** — exports a stable contract listing all registered routes (public + admin)
- **Override resolution** — resolves named override surfaces: consumer overrides take precedence over theme defaults
- **Type injection** — provides TypeScript types for all virtual modules

## Non-goals (v1)

- Packaged public-dir assets (see Task 3.9)
- Generic multi-theme support
- Runtime API routes

## Implementation

Epic 3 tasks: 3.1–3.9. See [../../packages/engine-core/](../../packages/engine-core/).
