# @portfolio-engine/schema

Shared Zod schemas for portfolio-engine content and configuration:

- Content types: `person`, `writing`, `project`, `testimonial`
- Config types: `siteConfig`, `navigationConfig`, `themeConfig`, `featuresConfig`

Consumed by both `engine-core` (for validation) and downstream consumer sites (for type safety).

## Multiple public email addresses

Keep the existing `email` field as the primary address and add labeled secondary
addresses with `emails`:

```jsonc
{
  "email": "name@institution.edu",
  "emails": [{ "label": "Personal", "address": "name@example.com" }],
}
```

The editorial theme keeps the primary address first and de-duplicates addresses
case-insensitively.

## Résumé document and route

Set a canonical public PDF in `config/site.json` and control the built-in route
from `config/features.json`:

```jsonc
// config/site.json
{
  "resumePdfUrl": "/documents/resume.pdf"
}

// config/features.json
{
  "resumePage": true
}
```

`resumePdfUrl` accepts a root-relative consumer asset or an absolute HTTPS URL.
`resumePage` defaults to `true` for backward compatibility. Set it to `false`
to stop the editorial theme from injecting `/resume`.

See [`docs/packages/schema.md`](../../docs/packages/schema.md) for architecture detail.

## Status

Active runtime package used by `engine-core`/`editorial-theme`, including manifest-related registry types (`RouteRegistryEntry`, `OverrideSurfaceEntry`, `EngineManifest`) and **consumer registry** Zod schemas (`ConsumerPortfolioEngineRegistrySchema`, `parseConsumerPortfolioEngineRegistry`).
