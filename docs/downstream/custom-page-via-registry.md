# Add a custom page with the consumer registry

For replacing a Portfolio Engine theme route such as `/about`, `/writing`, or `/contact`, prefer **consumer-local registry routes** under **`src/pages-local`** and disable the corresponding theme route first. Use ordinary **`src/pages`** only when you deliberately want an Astro-owned route that Portfolio Engine does not inject or diagnose. See **[route-ownership.md](./route-ownership.md)** for the full comparison table and résumé guidance.

This recipe matches the MVP in [Epic: consumer registry](https://github.com/rainonej/portfolio-engine/issues/81). You add routes **without** new named override surfaces in `@portfolio-engine/editorial-theme`.

## Prerequisites

- Astro site using `editorialTheme()` from `@portfolio-engine/editorial-theme/integration` (same setup as [new-site-setup](./new-site-setup.md)).

## Registry format (Phase 7)

The contract on disk is **JSON** under `src/registry/`; **`@portfolio-engine/schema`** provides Zod validation and inferred types (`parseConsumerPortfolioEngineRegistry`). Rationale, versioning, and admin-tools trade-offs are summarized in [ADR-005 (consumer extension registry format)](https://github.com/rainonej/portfolio-engine/blob/main/portfolio_engine_v5_report_pack/source/decisions/ADR-005-consumer-extension-registry-format.md) in the upstream repo (stable URL for copies of this doc).

**Admin-tools:** `src/registry/` is an allowed root. In **local `devBypass` development**, registry file **listing**, read, and save all use your working tree on disk. In **OAuth (GitHub Contents API) mode**, **read and save** for a known file path (for example `src/registry/portfolio-engine.registry.json`) go through GitHub; **directory listings** for the registry section still use `node:fs` under `process.cwd()` in admin-tools (see [content API route source](https://github.com/rainonej/portfolio-engine/blob/main/packages/admin-tools/src/routes/api/content.ts)), so they only reflect files present on that server—typically your laptop when running `astro dev`, not a remote tree listing from GitHub.

## Steps

### 1. Registry file

Create `src/registry/portfolio-engine.registry.json` at the project root of your consumer site (relative to `astro.config.mjs`).

Minimal shape:

```json
{
  "version": 1,
  "localRoutes": [
    {
      "pattern": "/how-i-think",
      "page": "how-i-think.astro",
      "label": "How I Think",
      "visibility": "public"
    }
  ]
}
```

Only **`version: 1`** is accepted today; future formats must bump this deliberately alongside engine support.

- **`pattern`** — URL path Astro injects (must start with `/`).
- **`page`** — Path relative to `src/pages-local`, must end in `.astro`, no `..` path segments, no Windows drive / UNC paths.
- **`label`**, **`section`**, **`visibility`** — Optional metadata for manifests and `@portfolio-engine:routes`.

The Zod schemas live in `@portfolio-engine/schema` (`ConsumerPortfolioEngineRegistrySchema`, `ConsumerLocalRouteEntrySchema`) so you can validate this file in your own tooling if needed.

### 2. Page source

Add the Astro file under **`src/pages-local/`** at the path named by `page`:

`src/pages-local/how-i-think.astro`

Use the theme shell so the page matches the rest of the site:

```astro
---
import Layout from '@portfolio-engine/editorial-theme/layouts/Layout.astro';
---

<Layout title="How I Think">
  <main class="mx-auto max-w-prose px-4 py-16">
    <h1>How I Think</h1>
  </main>
</Layout>
```

### 3. Navigation (optional)

Add an entry to `src/config/navigation.json` so the page appears in the nav.

### 4. Build

Run `astro build` (or `astro dev`). The integration loads the registry, resolves files under `src/pages-local`, injects routes, and writes `.portfolio-engine/manifest.json`.

## Collision rules

If a **`localRoutes[].pattern`** matches the **injected URL** of an editorial-theme route (including after theme route **remaps**), the build fails with an explicit error. Fix by renaming the local pattern or changing theme route overrides in `astro.config.mjs`.

## Optional integration options

Pass these to `editorialTheme()` / `createEngineIntegration()`:

| Option                  | Purpose                                                                       |
| ----------------------- | ----------------------------------------------------------------------------- |
| `consumerRegistryPath`  | Alternate JSON path (relative to site root). If set, the file **must** exist. |
| `consumerPagesLocalDir` | Alternate directory for page files (default `src/pages-local`).               |

## Manifest

Routes from the registry appear in `.portfolio-engine/manifest.json` with `"routeOrigin": "consumer-local"` and the relative `entrypoint` path. `capabilities.consumerLocalRoutes` is `true` when at least one such route is active.

## Replacing a default theme page

To replace a theme route (e.g. `/writing`) with a consumer-local version:

**1. Disable the theme route** in `astro.config.mjs`:

```js
editorialTheme({
  routes: { '/writing': { enabled: false } },
  // ...
});
```

**2. Add a registry entry** in `src/registry/portfolio-engine.registry.json`:

```json
{
  "version": 1,
  "localRoutes": [
    {
      "pattern": "/writing",
      "page": "writing/index.astro",
      "label": "Research & Ideas",
      "visibility": "public"
    }
  ]
}
```

**3. Add the page file** at `src/pages-local/writing/index.astro`:

```astro
---
import Layout from '@portfolio-engine/editorial-theme/layouts/Layout.astro';
---

<Layout title="Research & Ideas">
  <main class="mx-auto max-w-3xl px-6 pb-24 pt-40">
    <h1>Research & Ideas</h1>
    <!-- your custom content here -->
  </main>
</Layout>
```

**4. Verify the nav item** in `src/config/navigation.json` points to `/writing`:

```json
{ "label": "Research & Ideas", "href": "/writing", "visible": true }
```

**5. Build and inspect** `.portfolio-engine/manifest.json`. The `/writing` entry
should show `"routeOrigin": "consumer-local"` and the entrypoint path.

### src/pages vs src/pages-local

| Directory          | Routing owner      | Use case                                            |
| ------------------ | ------------------ | --------------------------------------------------- |
| `src/pages-local/` | Engine (registry)  | Replace a theme page while keeping the theme shell  |
| `src/pages/`       | Astro (file-based) | Fully custom pages that don't replace a theme route |

Use `src/pages/` (ordinary Astro routing) for pages that have no theme
equivalent and don't need to be registered — e.g. `src/pages/resume.astro`.
Use `src/pages-local/` + registry when you want the engine to know about the
route (nav validation, manifest, collision checks).

## Verified examples

- `examples/demo-site` — static output; the canonical public example.
- `tests/fixtures/node-ssr` — `output: 'server'` with `@astrojs/node`; route `/ssr-registry-smoke` (internal fixture).
