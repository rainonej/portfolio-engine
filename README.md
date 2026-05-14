# portfolio-engine

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://portfolio-engine-demo-site.vercel.app)

An Astro theme for personal portfolio sites. It provides routes, layouts, and styles so you focus on your content — and it's designed to be set up entirely through Claude prompts.

**[`examples/demo-site`](examples/demo-site/) is the only canonical example.** It is also the live advertising and showcase site for Portfolio Engine. Internal validation fixtures live under `tests/fixtures/` and are not user-facing examples.

---

## Get your site live

**You need:**

|                    |                                                                           |
| ------------------ | ------------------------------------------------------------------------- |
| **Node.js 24+**    | [nodejs.org](https://nodejs.org) — matches root [`engines`](package.json) |
| **pnpm 10+**       | `npm install -g pnpm` after installing Node                               |
| **GitHub account** | [github.com](https://github.com)                                          |
| **Vercel account** | [vercel.com](https://vercel.com)                                          |
| **Claude Code**    | [claude.ai/code](https://claude.ai/code)                                  |

**Then open [`docs/downstream/setup-with-claude.md`](docs/downstream/setup-with-claude.md), copy the whole file, and paste it into Claude Code.** Claude will ask for your details, build the project, and tell you exactly when to go click something in Vercel. One conversation, start to finish.

---

## What lives where

Your portfolio is its own private repo. This repo is the engine it consumes.

```
Your repo (e.g. my-portfolio)       This repo (portfolio-engine)
────────────────────────────        ──────────────────────────────
src/
  config/    ← your JSON config     @portfolio-engine/editorial-theme
  content/   ← your writing/work      layouts, components, routes
  context/   ← your identity (AI)   @portfolio-engine/engine-core
  overrides/ ← component swaps        config loader, route registry
                                    @portfolio-engine/schema
                                       Zod schemas
```

The three **required** packages are published to npm — your repo installs them. **`@portfolio-engine/admin-tools`** is optional (also on npm). **`@portfolio-engine/workflow-kit`** provides reusable downstream tooling: boundary-check scripts, AI prompts, GitHub Actions templates, and VS Code/Cursor setup.

---

## Where to change things

| Goal                                              | Change this                                                     |
| ------------------------------------------------- | --------------------------------------------------------------- |
| Change colors or fonts                            | `src/config/theme.json` in the downstream site                  |
| Change site-wide CSS                              | A `.css` file in `src/overrides/` in the downstream site        |
| Change the shared outer frame (nav, footer, head) | `packages/editorial-theme/src/layouts/Layout.astro`             |
| Change the home screen                            | `packages/editorial-theme/src/pages/index.astro`                |
| Change the default work list screen               | `packages/editorial-theme/src/pages/work.astro`                 |
| Change the default individual work screen         | `packages/editorial-theme/src/pages/work/[slug].astro`          |
| Change the default writing list screen            | `packages/editorial-theme/src/pages/writing/index.astro`        |
| Change the default individual writing screen      | `packages/editorial-theme/src/pages/writing/[slug].astro`       |
| Replace Hero, Footer, or another override surface | `src/overrides/` in the downstream site + the consumer registry |
| Add a custom downstream screen                    | The downstream site's `src/pages-local/` and consumer registry  |
| Change what screens are listed in navigation      | `src/config/navigation.json` in the downstream site             |

---

## Updating the theme

```bash
pnpm update @portfolio-engine/editorial-theme
pnpm build   # make sure it still builds
```

Check the [releases](https://github.com/rainonej/portfolio-engine/releases) before upgrading across a minor version.

---

## More docs

| Topic                                                   | Link                                                                                       |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Setup with Claude (paste whole file, Claude guides you) | [docs/downstream/setup-with-claude.md](docs/downstream/setup-with-claude.md)               |
| New site setup (full manual reference)                  | [docs/downstream/new-site-setup.md](docs/downstream/new-site-setup.md)                     |
| Semver vs. workspace-link, overrides, Vercel detail     | [docs/downstream/consumption.md](docs/downstream/consumption.md)                           |
| Agent tooling for downstream vibe-coding                | [docs/downstream/agent-tooling.md](docs/downstream/agent-tooling.md)                       |
| Visual QA prompt                                        | [docs/downstream/visual-qa-prompt.md](docs/downstream/visual-qa-prompt.md)                 |
| Design review checklist                                 | [docs/downstream/design-review-checklist.md](docs/downstream/design-review-checklist.md)   |
| Lint, format, CI                                        | [docs/contributing/linting.md](docs/contributing/linting.md)                               |
| Gitignored local files (MCP, smoke test, `.vercel`)     | [docs/contributing/gitignored-local-files.md](docs/contributing/gitignored-local-files.md) |

---

## For contributors to this repo

<details>
<summary>Expand</summary>

### Install and develop

```bash
git clone https://github.com/rainonej/portfolio-engine
cd portfolio-engine
pnpm install
pnpm check    # Typecheck all packages
pnpm build    # Build all packages
pnpm lint     # ESLint
pnpm format   # Prettier check
```

### Packages

**Required runtime** (every consumer installs these):

| Package                                                          | Description                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| [`@portfolio-engine/editorial-theme`](packages/editorial-theme/) | Astro theme: layouts, components, page routes                       |
| [`@portfolio-engine/engine-core`](packages/engine-core/)         | Config loader, virtual modules, route registry, override resolution |
| [`@portfolio-engine/schema`](packages/schema/)                   | Shared Zod schemas for content and configuration                    |

**Optional** (post-MVP add-ons, not required to run a site):

| Package                                                    | Description                                                                   |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`@portfolio-engine/admin-tools`](packages/admin-tools/)   | Admin/reviewer UI + `/api/content` + OAuth support (Node adapter required)    |
| [`@portfolio-engine/workflow-kit`](packages/workflow-kit/) | Reusable downstream tooling: check scripts, AI prompts, CI + editor templates |

### CI

GitHub Actions runs **lint → check (packages build + typecheck + `astro check`) → full build → packed tarball smoke test** on pushes to `main` / `dev` and on PRs. Uses **Node 24** and **pnpm 10**. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

### Runtime requirements

- Node **≥ 24**, pnpm **≥ 10** — see [`engines`](package.json) in root `package.json`.
- Match CI locally when possible so `astro build` with **`@astrojs/vercel`** behaves the same (Windows may need **Developer Mode** for symlinks during that step; see [examples/demo-site/README.md](examples/demo-site/README.md)).
- **Astro 6** — bump deliberately across the workspace when upgrading.

### Vercel (demo site)

Connect **`rainonej/portfolio-engine`** in Vercel: root = repo root, install `pnpm install`, build `pnpm --filter demo-site run build`; follow the adapter output layout from **`@astrojs/vercel`** (do not assume a flat `dist/` only). Production on `main`; `dev` and PRs get previews. Details: [examples/demo-site/README.md](examples/demo-site/README.md#vercel).

### Local-only / gitignored files

MCP config (`.mcp.json`, `.cursor/mcp.json`), smoke-test dirs, and local `.vercel` output are gitignored. See **[`docs/contributing/gitignored-local-files.md`](docs/contributing/gitignored-local-files.md)** so you do not commit them by mistake.

### Publishing

Packages are published with [Changesets](CONTRIBUTING.md#changesets). See [CONTRIBUTING.md](CONTRIBUTING.md) for branch flow, changesets, and local linking.

### Issues and project board

[`docs/project-management.md`](docs/project-management.md) · [GitHub Project 2](https://github.com/users/rainonej/projects/2)

</details>
