# @portfolio-engine/admin-tools

Admin and reviewer UI for portfolio-engine sites.

## Planned capabilities

- Admin/reviewer interface components (extracted from `profesional_site` admin route)
- Site map generated from the route registry
- Content and config inspection panels

## Status

**Shipped (v0):** `adminTools()` Astro integration — `/admin` read-only dashboard (engine virtual modules + route tree + filesystem audit for config/content/context/assets/registry + manifest status), `/api/auth/*` GitHub OAuth, and read-only `/api/content` file listing endpoint. See [`packages/admin-tools/README.md`](../../packages/admin-tools/README.md) and `examples/demo-site/astro.config.mjs`.

**Next:** Port GitHub Contents `/api/content` and in-browser editors from `professional_site` (Epic 7).
