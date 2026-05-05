# Add a custom page with the consumer registry

This recipe matches the MVP in [Epic: consumer registry](https://github.com/rainonej/portfolio-engine/issues/81). You add routes **without** new named override surfaces in `@portfolio-engine/editorial-theme`.

## Prerequisites

- Astro site using `editorialTheme()` from `@portfolio-engine/editorial-theme` (same setup as [new-site-setup](./new-site-setup.md)).

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

- **`pattern`** — URL path Astro injects (must start with `/`).
- **`page`** — Path relative to `src/pages-local`, must end in `.astro`, no `..`.
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

| Option                   | Purpose                                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------------------------- |
| `consumerRegistryPath`   | Alternate JSON path (relative to site root). If set, the file **must** exist.                            |
| `consumerPagesLocalDir`  | Alternate directory for page files (default `src/pages-local`).                                        |

## Manifest

Routes from the registry appear in `.portfolio-engine/manifest.json` with `"routeOrigin": "consumer-local"`. `capabilities.consumerLocalRoutes` is `true` when at least one such route is active.

## Verified example

`examples/demo-site` in this repo implements `/how-i-think` using the steps above.
