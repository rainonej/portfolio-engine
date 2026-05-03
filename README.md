# portfolio-engine

A first-party Astro engine for building personal portfolio sites. Opinionated, not generic — the shared backbone for private consumer repos (**[agreni-site](https://github.com/rainonej/agreni-site)** and **jordan-site**), open-sourced so design decisions stay transparent.

## Four-layer model

```
┌─────────────────────────────────────────────────────────┐
│  Consumer site (agreni-site, jordan-site)               │
│  Content, config, overrides — private                   │
├─────────────────────────────────────────────────────────┤
│  @portfolio-engine/editorial-theme                      │
│  Layouts, components, routes, styles                    │
├─────────────────────────────────────────────────────────┤
│  @portfolio-engine/engine-core                          │
│  Config loader, virtual modules, route registry,         │
│  override resolution                                     │
├─────────────────────────────────────────────────────────┤
│  @portfolio-engine/schema                               │
│  Shared Zod schemas for content + config                │
└─────────────────────────────────────────────────────────┘
```

## Packages

| Package                                                          | Description                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| [`@portfolio-engine/engine-core`](packages/engine-core/)         | Route registry, config loader, virtual modules, override resolution |
| [`@portfolio-engine/editorial-theme`](packages/editorial-theme/) | The Astro theme: layouts, components, page routes                   |
| [`@portfolio-engine/schema`](packages/schema/)                   | Shared Zod schemas for content and configuration                    |
| [`@portfolio-engine/admin-tools`](packages/admin-tools/)         | Admin/reviewer UI, site map from route registry _(Epic 7)_          |
| [`@portfolio-engine/workflow-kit`](packages/workflow-kit/)       | Reusable GitHub workflows and AI change classifier _(Epic 8)_       |

## Dependencies and versions

- **Where versions live:** each package declares its own `dependencies` / `devDependencies` / `peerDependencies` in its `package.json`. The monorepo root [`package.json`](package.json) lists workspace tooling; **[`pnpm-lock.yaml`](pnpm-lock.yaml)** is the lockfile of record for exact resolved versions (similar to a single-environment lock in other ecosystems).
- **Workspace layout:** [`pnpm-workspace.yaml`](pnpm-workspace.yaml) includes `packages/*` and `examples/*`.
- **Runtime:** Node **≥ 18** and **pnpm ≥ 9** ([`engines`](package.json) on the root). CI uses Node **20**.
- **Astro:** consumer sites and this repo’s packages target **Astro 5** (`peerDependencies` / devDependencies use a current 5.x line). Bump Astro deliberately across the workspace when upgrading.
- **Publishing:** packages are published with [Changesets](CONTRIBUTING.md#changesets); consumers pin semver in their own repos.

## Install and develop

```bash
git clone https://github.com/rainonej/portfolio-engine
cd portfolio-engine
pnpm install
pnpm check    # Typecheck all packages
pnpm build    # Run each package’s build script
pnpm lint     # ESLint (TypeScript sources)
pnpm format   # Prettier check (Markdown, YAML, JSON, …)
```

## Example consumer (`examples/demo-site`)

[`examples/demo-site/`](examples/demo-site/) is the canonical **reference Astro app**: workspace `workspace:*` deps, `editorialTheme({ ... })` in `astro.config.mjs`, config JSON, and content collections. See **[examples/demo-site/README.md](examples/demo-site/README.md)** for run instructions, Vercel layout, and what files are yours vs. the theme.

## Consuming the theme (downstream repo)

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { editorialTheme } from '@portfolio-engine/editorial-theme';

export default defineConfig({
  integrations: [
    editorialTheme({
      siteConfigPath: './src/config/site.json',
      navigationConfigPath: './src/config/navigation.json',
      themeConfigPath: './src/config/theme.json',
      featuresConfigPath: './src/config/features.json',
    }),
  ],
});
```

See [`packages/editorial-theme/README.md`](packages/editorial-theme/README.md) for required config, collections, and overrides.

**Setting up a new consumer site from scratch?** See **[`docs/downstream/new-site-setup.md`](docs/downstream/new-site-setup.md)** — step-by-step commands, all config file templates, content collection setup, Vercel wiring, and a ready-to-paste Claude bootstrap prompt.

For **separate-repo** layout, semver vs. workspace-link, overrides, and **Vercel (production on `main`, previews on `dev`)**, see **[`docs/downstream/consumption.md`](docs/downstream/consumption.md)** — especially [§ Vercel (standalone consumer repo)](docs/downstream/consumption.md#vercel-standalone-consumer-repo).

## CI

GitHub Actions runs **lint → typecheck → Astro check → build** on pushes to `main` / `dev` and on pull requests targeting `main`, `dev`, or `epic/*`. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Vercel

- **This monorepo (`examples/demo-site`):** connect **`rainonej/portfolio-engine`**, root = repo root, `pnpm install`, `pnpm --filter demo-site run build`, output `examples/demo-site/dist`. Production on **`main`**; **`dev`** and PRs → previews. Details: [examples/demo-site/README.md](examples/demo-site/README.md#vercel).
- **A sibling consumer repo** (standalone site): follow **[`docs/downstream/consumption.md` § Vercel](docs/downstream/consumption.md#vercel-standalone-consumer-repo)** — root = that repo’s root, `pnpm build`, adapter/output as documented there.

## Issues and project board

Planning conventions, labels, and GitHub Project views are documented in **[`docs/github-project-board.md`](docs/github-project-board.md)** and **[`docs/project-management.md`](docs/project-management.md)**. Work for this codebase is tracked on **[GitHub Project 2](https://github.com/users/rainonej/projects/2)**.

## Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for branch flow, changesets, local linking to consumer repos, **lint / format**, and **Copilot** / review expectations.

## Status

Under active development. Packages may be consumed via `workspace:*`, `link:`, or npm once published.
