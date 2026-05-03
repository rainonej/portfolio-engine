# demo-site

Reference **Astro consumer** for [`@portfolio-engine/editorial-theme`](../../packages/editorial-theme/). It proves the integration end-to-end and mirrors how **agreni-site** / **jordan-site** should wire config, content, and `astro.config.mjs`.

## What you own vs the theme

| Yours (edit freely)                       | From the theme (via integration)                         |
| ----------------------------------------- | -------------------------------------------------------- |
| `config/*.json`                           | Layouts, pages, components, `global.css`                 |
| `src/content/**`, `src/content.config.ts` | Routes injected by `@portfolio-engine/engine-core`       |
| `public/**`                               | Tailwind + PostCSS setup inside `editorialTheme()`       |
| `astro.config.mjs`                        | Virtual modules `@portfolio-engine:config`, `:overrides` |

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

Output static site: `examples/demo-site/dist/`.

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
5. **Output Directory:** `examples/demo-site/dist`
6. **Production branch:** `main` (or your release branch). **Preview:** all other branches and PRs (including `dev`) so every push gets a URL.

If you instead set Root Directory to `examples/demo-site`, you must run install from the monorepo root (e.g. custom install command); Option A avoids that foot-gun.

**Standalone downstream repo** (separate Git project, e.g. `agreni-site`): Vercel root is that repo’s root, `pnpm build`, and branch rules are the same idea (`main` = production, `dev` / PRs = previews). See **[`docs/downstream/consumption.md` § Vercel (standalone consumer repo)](../../docs/downstream/consumption.md#vercel-standalone-consumer-repo)**.
