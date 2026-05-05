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

- Node **≥ 24**, **pnpm ≥ 10** (see root [`package.json` engines](../../package.json)).

## Install and run

```bash
cd portfolio-engine   # repo root
pnpm install
pnpm --filter demo-site dev
# or
pnpm --filter demo-site run build
```

This example uses **`output: 'static'`** with **[`@astrojs/vercel`](https://docs.astro.build/en/guides/integrations-guide/vercel/)**, matching **[`docs/downstream/new-site-setup.md`](../../docs/downstream/new-site-setup.md)**. Admin and API routes set `prerender = false` so they can run as serverless/SSR on Vercel.

Open `http://localhost:4321/admin` after `pnpm --filter demo-site dev` (dev bypass skips GitHub; see `.env.example` for OAuth).

Each build also generates `.portfolio-engine/manifest.json` in the demo-site root, including resolved route registry entries and named override surfaces.

The demo intentionally passes **custom registry metadata** (`agentGuidance`, `guidance`, `docsUrl`) through `editorialTheme({ registries })` in `astro.config.mjs` to exercise the registry + manifest contract directly.

For a **Node SSR** mirror of this site (standalone server bundle), see [`examples/node-ssr-demo`](../node-ssr-demo/).

## Checks

```bash
pnpm --filter demo-site run check   # astro check
```

### Windows: `astro build` and symlinks

`@astrojs/vercel` may create symlinks under `.vercel/output/`. If `astro build` fails with `EPERM` on `symlink`, enable **Developer Mode** (Settings → System → For developers) or run the build in **WSL** / **CI (Linux)**, where symlinks are allowed.

## Vercel

Recommended **Option A** (pnpm workspace–friendly):

1. Create a Vercel project linked to **`rainonej/portfolio-engine`**.
2. **Root Directory:** repository root (`.`), _not_ only `examples/demo-site`, so `workspace:*` resolves during install.
3. **Install Command:** `pnpm install`
4. **Build Command:** `pnpm --filter demo-site run build`
5. **Output Directory:** follow [`@astrojs/vercel` output](https://docs.astro.build/en/guides/integrations-guide/vercel/) (adapter emits the correct layout; do not point only at a flat `dist/` unless you know you are fully static with no server routes).
6. **Production branch:** `main` (or your release branch). **Preview:** all other branches and PRs (including `dev`) so every push gets a URL.

If you instead set Root Directory to `examples/demo-site`, you must run install from the monorepo root (e.g. custom install command); Option A avoids that foot-gun.

**Standalone downstream repo** (separate Git project, e.g. `agreni-site`): Vercel root is that repo’s root, `pnpm build`, and branch rules are the same idea (`main` = production, `dev` / PRs = previews). See **[`docs/downstream/consumption.md` § Vercel (standalone consumer repo)](../../docs/downstream/consumption.md#vercel-standalone-consumer-repo)**.
