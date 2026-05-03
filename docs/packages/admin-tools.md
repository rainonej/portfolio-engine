# @portfolio-engine/admin-tools

Admin and reviewer UI for portfolio-engine sites.

## Planned capabilities

- Admin/reviewer interface components (extracted from `profesional_site` admin route)
- Site map generated from the route registry
- Content and config inspection panels

## Status

**Shipped (v0):** `adminTools()` Astro integration — `/admin` dashboard with read/write capabilities
(engine virtual modules + route tree + filesystem audit for config/content/context/assets/registry +
manifest status + in-browser content editor + public asset uploader), `/api/auth/*` GitHub OAuth, and
`/api/content` endpoint (inventory/read/save — local writes in `devBypass`, GitHub Contents API writes in
OAuth mode). Requires a **Node.js adapter** (`@astrojs/node` or equivalent) — `node:fs` is used by the
filesystem audit and `/api/content`; these features are unavailable on edge runtimes. See
[`packages/admin-tools/README.md`](../../packages/admin-tools/README.md) and
`examples/demo-site/astro.config.mjs`.

**Next:** Add schema-aware editors, file move/rename/delete flows, and richer non-technical UX from
`professional_site` extraction (Epic 7).

- Admin asset uploads: use the `/admin` **Public assets uploader** to drop files into `public/` or a
  nested folder (e.g. `media/uploads`).
