# @portfolio-engine/schema

Shared Zod schemas for portfolio-engine content and configuration:

- Content types: `person`, `writing`, `project`, `testimonial`
- Config types: `siteConfig`, `navigationConfig`, `themeConfig`, `featuresConfig`

Consumed by both `engine-core` (for validation) and downstream consumer sites (for type safety).

See [`docs/packages/schema.md`](../../docs/packages/schema.md) for architecture detail.

## Status

Active runtime package used by `engine-core`/`editorial-theme`, including manifest-related registry types (`RouteRegistryEntry`, `OverrideSurfaceEntry`, `EngineManifest`) and **consumer registry** Zod schemas (`ConsumerPortfolioEngineRegistrySchema`, `parseConsumerPortfolioEngineRegistry`).
