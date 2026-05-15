# demo-site — the Portfolio Engine showcase

This site is the official showcase for [Portfolio Engine](../../). It is a working Astro consumer of the same `@portfolio-engine/*` packages a downstream site would install — but its content is _about Portfolio Engine itself_. It is intentionally **not** a generated personal portfolio: every page demonstrates the engine and routes visitors toward the open-source repo and the contributor workflow.

**Live:** [`portfolio-engine-demo-site.vercel.app`](https://portfolio-engine-demo-site.vercel.app)

## What this demo proves

Each piece of the engine has a visible counterpart here:

| Feature                                                     | Where you can see it                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Theme route injection                                       | `/work` and `/work/[slug]` are primary theme routes used in nav (`Examples`). `/writing` and `/writing/[slug]` remain available theme routes but are not top-nav items in this demo. `/about`, `/contact`, and `/resume` are also injected by the theme for downstream-consumer capability demonstration and are hidden from top navigation here.                                                                                                                                                                                          |
| Consumer-local registry routes                              | [`/vision`](https://portfolio-engine-demo-site.vercel.app/vision), [`/workflow`](https://portfolio-engine-demo-site.vercel.app/workflow), [`/architecture`](https://portfolio-engine-demo-site.vercel.app/architecture), [`/features`](https://portfolio-engine-demo-site.vercel.app/features), [`/contribute`](https://portfolio-engine-demo-site.vercel.app/contribute) — declared in [`src/registry/portfolio-engine.registry.json`](src/registry/portfolio-engine.registry.json), source under [`src/pages-local/`](src/pages-local/). |
| All five named override surfaces                            | [`src/overrides/Hero.astro`](src/overrides/Hero.astro), [`FeaturedWriting.astro`](src/overrides/FeaturedWriting.astro), [`TestimonialSection.astro`](src/overrides/TestimonialSection.astro), [`CollaborationSection.astro`](src/overrides/CollaborationSection.astro), [`Footer.astro`](src/overrides/Footer.astro). `TestimonialSection` is wired but the homepage section is disabled via `features.testimonials: false` — the demo does not ship fake customer proof.                                                                  |
| Style override appended after `global.css`                  | [`src/overrides/styles/showcase.css`](src/overrides/styles/showcase.css), wired via `overrides.styles` in [`astro.config.mjs`](astro.config.mjs).                                                                                                                                                                                                                                                                                                                                                                                          |
| `theme.json` design tokens (semantic colors + Google Fonts) | [`src/config/theme.json`](src/config/theme.json) — Cormorant Garamond + Inter on a warm earth palette.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `IframeEmbed` security-vetted component                     | [`src/pages-local/architecture.astro`](src/pages-local/architecture.astro) embeds [`public/assets/demos/architecture/`](public/assets/demos/architecture/) via the typed wrapper.                                                                                                                                                                                                                                                                                                                                                          |
| Admin tools (`@portfolio-engine/admin-tools`)               | [`/admin`](https://portfolio-engine-demo-site.vercel.app/admin) with `devBypass: true`. Site-config link label set in `site.json`.                                                                                                                                                                                                                                                                                                                                                                                                         |
| Registry metadata (`agentGuidance`, `guidance`, `docsUrl`)  | [`astro.config.mjs`](astro.config.mjs) — the demo wraps `DEFAULT_ROUTE_REGISTRY` and `DEFAULT_OVERRIDE_SURFACES` to exercise the manifest contract.                                                                                                                                                                                                                                                                                                                                                                                        |
| Content collections                                         | [`src/content/profile`](src/content/profile/), [`projects`](src/content/projects/), [`writing`](src/content/writing/), [`testimonials`](src/content/testimonials/). The `testimonials` collection schema is preserved by [`src/content.config.ts`](src/content.config.ts), with a single non-featured placeholder entry so the glob loader has a concrete file even though testimonials are disabled.                                                                                                                                      |

The four packages are all published as `@portfolio-engine/*` on npm. This demo consumes them as `workspace:*` because it lives inside the engine repo, but a downstream consumer installs them from npm exactly the same way.

## What the demo is _not_

- Not a generated personal website. No résumé tab, no contact funnel, no booking widget, no Calendly. `/about`, `/resume`, and `/contact` exist as theme-route capability demos but are hidden from the top navigation.
- Not a sales site. There is no "book a 15-minute walkthrough" CTA. The hero, footer, and collaboration sections all route to the public GitHub repository or the issue tracker.
- Not a personal portfolio for `portfolio-engine` as if it were a person or company. The site name, copy, and pillars all describe an open-source project: Apache-2.0 licensed, contributor-onboarding, agent-safe workflow.

## Use this site as your starting point

The recommended path is **not** to copy this folder. Instead, paste [`docs/downstream/setup-with-claude.md`](../../docs/downstream/setup-with-claude.md) into Claude Code in an empty repo and answer a handful of questions. The agent runs numbered phase scripts with `DRY_RUN` and `SKIP_*` flags and provisions a working consumer site in minutes.

If you'd rather wire the integration manually, [`docs/downstream/consumption.md`](../../docs/downstream/consumption.md) walks through the consumer-side contract.

## Run it locally

From the **repo root** (`portfolio-engine/`), not this folder:

```bash
pnpm install
pnpm --filter demo-site dev
```

Open `http://localhost:4321`. The `/admin` route is reachable in dev with no GitHub OAuth (the integration runs with `devBypass: true`).

Each build also writes a `.portfolio-engine/manifest.json` in this folder, recording the resolved route registry, the override surfaces and which ones are overridden, and the design-token snapshot. The file is regenerated on every build and is `.gitignore`d here, so it won't appear in the repo until you run a build locally. See [`docs/packages/engine-core.md`](../../docs/packages/engine-core.md) for the schema.

## Build it

```bash
pnpm --filter demo-site build       # → dist/ (and .vercel/output for the adapter)
pnpm --filter demo-site check       # astro check
```

<details>
<summary><strong>Contributor notes</strong> — deployment, Windows, and the SSR mirror</summary>

### Vercel (option A — pnpm-workspace-friendly)

1. Create a Vercel project linked to **`rainonej/portfolio-engine`**.
2. **Root Directory:** repository root (`.`), _not_ only `examples/demo-site`, so `workspace:*` resolves during install.
3. **Install Command:** `pnpm install` (or `pnpm install --frozen-lockfile` to match [`vercel.json`](../../vercel.json)).
4. **Build Command:** `pnpm --filter "./packages/*" run build && pnpm --filter demo-site build && node scripts/lift-vercel-output.mjs` — workspace packages must emit `dist/` before Astro loads `astro.config.mjs`. The final `node scripts/lift-vercel-output.mjs` lifts the Build Output API tree that `@astrojs/vercel` hard-codes under the Astro project root (`examples/demo-site/.vercel/output/`) up to `<repo-root>/.vercel/output/`, where Vercel's Build Output API auto-detection actually looks. Pure-Node `fs.rmSync` + `fs.renameSync` so it works on Vercel's Linux builders, local `vercel build` on Windows, and any environment without coreutils (see [`vercel.json`](../../vercel.json) and [`scripts/lift-vercel-output.mjs`](../../scripts/lift-vercel-output.mjs)).
5. **Output Directory:** `.vercel/output` — the canonical Build Output API location at the repo root. Pointing Vercel at the nested `examples/demo-site/.vercel/output/` directly does **not** work: Vercel ignores the adapter-generated `config.json` and serves no routes (every path returns a bare-text `NOT_FOUND`).
6. **Production branch:** `main`. **Preview:** all other branches and PRs.

If you instead set Root Directory to `examples/demo-site`, you must run install from the monorepo root via a custom install command; option A avoids that foot-gun.

**Standalone downstream repo** (separate Git project): Vercel root is that repo's root, `pnpm build`, branch rules are the same idea. See [`docs/downstream/consumption.md` § Vercel (standalone consumer repo)](../../docs/downstream/consumption.md#vercel-standalone-consumer-repo).

### Windows: `astro build` and symlinks

`@astrojs/vercel` may create symlinks under `.vercel/output/`. If `astro build` fails with `EPERM` on `symlink`, enable **Developer Mode** (Settings → System → For developers) or run the build in **WSL** / **CI (Linux)** where symlinks are allowed.

### Node-SSR mirror

For a **Node SSR** mirror of this site (standalone server bundle, useful for Docker / custom VPS deployments), see [`examples/node-ssr-demo`](../node-ssr-demo/). It uses `@astrojs/node` with `output: 'server'` instead of static + Vercel.

### Prerequisites

Node **≥ 24**, **pnpm ≥ 10**. See root [`package.json` engines](../../package.json).

### What you own vs the theme (for orientation when adapting this folder)

| Yours (edit freely)                                                 | From the theme (via integration)                                                  |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `src/config/*.json`                                                 | Layouts, pages, components, `global.css`                                          |
| `src/content/**`, `src/content.config.ts`                           | Routes injected by `@portfolio-engine/engine-core`                                |
| `src/overrides/**`                                                  | Tailwind + PostCSS setup inside `editorialTheme()`                                |
| `src/pages-local/**`, `src/registry/portfolio-engine.registry.json` | Virtual modules `@portfolio-engine:config`, `:overrides`, optional `adminTools()` |
| `public/**`                                                         |                                                                                   |
| `astro.config.mjs`                                                  |                                                                                   |

Architecture detail: [`docs/packages/editorial-theme.md`](../../docs/packages/editorial-theme.md).

</details>
