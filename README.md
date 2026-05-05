# portfolio-engine

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://portfolio-engine-demo-site.vercel.app)

An Astro theme for personal portfolio sites. It provides routes, layouts, and styles so you focus on your content — and it's designed to be set up entirely through Claude prompts.

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
Your repo (e.g. jordan-site)        This repo (portfolio-engine)
────────────────────────────        ──────────────────────────────
src/
  config/    ← your JSON config     @portfolio-engine/editorial-theme
  content/   ← your writing/work      layouts, components, routes
  context/   ← your identity (AI)   @portfolio-engine/engine-core
  overrides/ ← component swaps        config loader, route registry
                                    @portfolio-engine/schema
                                       Zod schemas
```

The three **required** packages are published to npm — your repo installs them. **`@portfolio-engine/admin-tools`** is optional (also on npm). **`@portfolio-engine/workflow-kit`** is scaffold-stage (not a production MCP toolkit yet).

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

| Package                                                    | Description                                                                |
| ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| [`@portfolio-engine/admin-tools`](packages/admin-tools/)   | Admin/reviewer UI + `/api/content` + OAuth support (Node adapter required) |
| [`@portfolio-engine/workflow-kit`](packages/workflow-kit/) | Reserved package for future workflow automation (currently scaffold)       |

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
