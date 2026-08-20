# Route ownership: theme, registry, and ordinary Astro pages

Portfolio Engine distinguishes three ways a URL can be served. Mixing them on purpose is fine; mixing them by accident is what this page helps you avoid.

## 1. Theme-injected routes

The editorial theme owns standard pages such as `/`, `/work`, `/writing`, `/about`, `/contact`, and `/resume`. The engine integration injects them from `@portfolio-engine/editorial-theme` and records them in **`.portfolio-engine/manifest.json`** with `routeOrigin: "theme"`.

## 2. Consumer-local registry routes

Downstream sites declare extra routes (or replacements for theme URLs) in **`src/registry/portfolio-engine.registry.json`**, with Astro files under **`src/pages-local/`**. These appear in the manifest as `routeOrigin: "consumer-local"` with a resolved entrypoint under your repo.

**Recommendation:** For replacing a Portfolio Engine theme route such as `/about`, `/writing`, or `/contact`, prefer consumer-local registry routes under `src/pages-local` and **disable the corresponding theme route first** (via `editorialTheme({ routes: { … } })` or the supported remap/disable options in your Astro config). That keeps one clear owner per URL, preserves the theme shell when you want it, and keeps doctor/manifest output truthful.

## 3. Ordinary Astro file routes

Files under **`src/pages/`** are normal Astro routes. Astro owns them directly. They are **not** injected by Portfolio Engine and **usually do not appear** in `.portfolio-engine/manifest.json`.

**Use `src/pages/` when** you deliberately want an Astro-owned route that Portfolio Engine does not inject or diagnose—fully custom behavior, separate layout experiments, or legacy pages you are not ready to fold into the registry.

**Nav and diagnostics:** Navigation items that point at ordinary `src/pages` routes may trigger **nav warnings** during build: the engine only validates hrefs against **active injected** routes plus consumer-local registry routes. That is expected. Either accept the warning, tighten nav to injected routes only, enable **`strictNavRoutes`** only after every nav target is accounted for, or move the page to **`src/pages-local`** with a registry entry so it participates in the manifest.

## Résumé (`/resume`) visibility

The editorial theme injects `/resume` by default. Configure a canonical PDF with
`site.resumePdfUrl` (for example `/documents/resume.pdf`) to show the built-in
download action. Set `features.resumePage` to `false` when a consumer should not
have any résumé route.

If you want **full doctor/manifest visibility** for `/resume`, implement it as a **consumer-local registry** route (pattern `/resume`, page under `src/pages-local`). If `/resume` is intentionally a **fully custom** Astro page under `src/pages/resume.astro`, that is valid, but document for your team that it **will not** be engine-injected and **may not** show up in the Portfolio Engine manifest—doctor will not list it as a first-class engine route.

## Quick comparison

| Location           | Injected by engine | Typical manifest entry | Best for                                     |
| ------------------ | ------------------ | ---------------------- | -------------------------------------------- |
| Theme pages        | Yes                | `theme`                | Default product surface                      |
| `src/pages-local/` | Yes (via registry) | `consumer-local`       | Replacements + additive routes with theme UX |
| `src/pages/`       | No                 | Usually absent         | Deliberately custom / non-catalogued routes  |

See also **[custom-page-via-registry.md](./custom-page-via-registry.md)** for the registry file format and **[consumption.md](./consumption.md)** for integration wiring.
