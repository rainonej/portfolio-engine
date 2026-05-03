# demo-site

Reference **Astro consumer** for [`@portfolio-engine/editorial-theme`](../../packages/editorial-theme/). It proves integration end-to-end, including named overrides, explicit route/override registries, generated manifest output, and admin tooling.

## What you own vs the theme

| Yours (edit freely)                       | From the theme (via integration)                                                  |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| `config/*.json`                           | Layouts, pages, components, `global.css`                                          |
| `src/content/**`, `src/content.config.ts` | Routes injected by `@portfolio-engine/engine-core`                                |
| `public/**`                               | Tailwind + PostCSS setup inside `editorialTheme()`                                |
| `astro.config.mjs`                        | Virtual modules `@portfolio-engine:config`, `:overrides`, optional `adminTools()` |

Architecture detail: [`docs/packages/editorial-theme.md`](../../docs/packages/editorial-theme.md).

## Prerequisites

From the **monorepo root** (`portfolio-engine/`), not only this folder:

- Node **≥ 18**, **pnpm ≥ 9** (see root [`package.json` engines](../../package.json)).

## Install and run

```bash
cd portfolio-engine   # repo root
pnpm install
pnpm --filter demo-site dev
# or
pnpm --filter demo-site run build
```

Build output: `examples/demo-site/dist/` (**SSR** via `@astrojs/node` so `/admin` and `/api/auth/*` work). Open `http://localhost:4321/admin` after `pnpm --filter demo-site dev` (dev bypass skips GitHub; see `.env.example` for OAuth).

Each build also generates `.portfolio-engine/manifest.json` in the demo-site root, including resolved route registry entries and named override surfaces.

The demo intentionally passes **custom registry metadata** (`agentGuidance`, `guidance`, `docsUrl`) through `editorialTheme({ registries })` in `astro.config.mjs` to exercise the registry + manifest contract directly.

## Checks

```bash
pnpm --filter demo-site run check   # astro check
```

## Vercel

Recommended **Option A** (pnpm workspace–friendly):

1. Create a Vercel project linked to **`rainonej/portfolio-engine`**.
2. **Root Directory:** repository root (`.`), _not_ only `examples/demo-site`, so `workspace:*` resolves during install.
3. **Install Command:** `pnpm install`
4. **Build Command:** `pnpm --filter demo-site run build`
5. **Output Directory:** `examples/demo-site/dist` (Node server bundle — ensure the Vercel project runtime matches Astro’s Node adapter, or swap the adapter for `@astrojs/vercel` if you deploy there.)
6. **Production branch:** `main` (or your release branch). **Preview:** all other branches and PRs (including `dev`) so every push gets a URL.

If you instead set Root Directory to `examples/demo-site`, you must run install from the monorepo root (e.g. custom install command); Option A avoids that foot-gun.

**Standalone downstream repo** (separate Git project, e.g. `agreni-site`): Vercel root is that repo’s root, `pnpm build`, and branch rules are the same idea (`main` = production, `dev` / PRs = previews). See **[`docs/downstream/consumption.md` § Vercel (standalone consumer repo)](../../docs/downstream/consumption.md#vercel-standalone-consumer-repo)**.
