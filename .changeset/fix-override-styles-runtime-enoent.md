---
'@portfolio-engine/engine-core': patch
'@portfolio-engine/editorial-theme': patch
---

Fix `ENOENT` crash on any server-rendered route when a consumer configures `overrides.styles`.

`resolveOverrides()` (`engine-core`) previously stored resolved **file paths** for `overrides.styles` in the `__styles__` entry of the `@portfolio-engine:overrides` virtual module. `Layout.astro` (`editorial-theme`) then called `fs.readFileSync()` on those paths **at request time**. That works for prerendered/static routes (built once, when the consumer's `src/` tree is present on the build machine), but any server-rendered route (`export const prerender = false`, or any route under `output: 'server'`) re-runs `Layout.astro`'s frontmatter **per request** — and serverless runtimes (Vercel included) don't bundle the raw source tree, only what static analysis can trace. Since the path came from a runtime-parsed JSON string, it isn't traceable, so the file is missing at runtime: `ENOENT: no such file or directory, open '.../src/overrides/styles/....css'`. Astro's error handling for this case can result in a `200` response with an **empty body** rather than a clean `500` — the page silently renders blank.

`resolveOverrides()` now reads and inlines the CSS **content** (not paths) at config-resolution time — this runs once during `astro build`/dev-server-start, when the source tree is guaranteed to exist, regardless of whether any given route ends up prerendered or server-rendered. `Layout.astro` no longer touches the filesystem at all; it just reads the already-resolved string from the virtual module.

Verified against `tests/fixtures/node-ssr` (`output: 'server'`): built with an `overrides.styles` entry, then the source file was deleted before starting the built server — the override CSS still rendered correctly with no runtime error, confirming no filesystem dependency survives into the running server.

#### Agent migration

- **Packages:** `@portfolio-engine/engine-core`, `@portfolio-engine/editorial-theme`
- **Consumer paths:** no file changes required — `astro.config.*`'s `overrides.styles` option is unchanged.
- **Actions:**
  - No migration needed — internal implementation fix, same public config shape.
  - If any consumer route using `overrides.styles` is server-rendered (`prerender = false`, or an `output: 'server'`/`'hybrid'` project) and previously rendered blank/broken, it should now render correctly after upgrading — no workaround needed.
