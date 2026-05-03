# portfolio-engine

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://portfolio-engine-demo-site.vercel.app)

An Astro theme for personal portfolio sites. It provides routes, layouts, and styles so you focus on your content — and it's designed to be set up entirely through Claude prompts.

---

## Get your site live

**You need:**

|                    |                                             |
| ------------------ | ------------------------------------------- |
| **Node.js 22**     | [nodejs.org](https://nodejs.org)            |
| **pnpm**           | `npm install -g pnpm` after installing Node |
| **GitHub account** | [github.com](https://github.com)            |
| **Vercel account** | [vercel.com](https://vercel.com)            |
| **Claude Code**    | [claude.ai/code](https://claude.ai/code)    |

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

The three **required** packages are published to npm — your repo installs them. `@portfolio-engine/admin-tools` is an optional UI layer; `@portfolio-engine/workflow-kit` exists but is currently scaffold-stage (not a production MCP toolkit yet).

---

## Updating the theme

```bash
pnpm update @portfolio-engine/editorial-theme
pnpm build   # make sure it still builds
```

Check the [releases](https://github.com/rainonej/portfolio-engine/releases) before upgrading across a minor version.

---

## More docs

| Topic                                                   | Link                                                                         |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Setup with Claude (paste whole file, Claude guides you) | [docs/downstream/setup-with-claude.md](docs/downstream/setup-with-claude.md) |
| New site setup (full manual reference)                  | [docs/downstream/new-site-setup.md](docs/downstream/new-site-setup.md)       |
| Semver vs. workspace-link, overrides, Vercel detail     | [docs/downstream/consumption.md](docs/downstream/consumption.md)             |
| Lint, format, CI                                        | [docs/contributing/linting.md](docs/contributing/linting.md)                 |

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

| Package                                                   | Description                                         |
| --------------------------------------------------------- | --------------------------------------------------- |
| [`@portfolio-engine/admin-tools`](packages/admin-tools/)  | Admin/reviewer UI + `/api/content` + OAuth support (Node adapter required) |
| [`@portfolio-engine/workflow-kit`](packages/workflow-kit/) | Reserved package for future workflow automation (currently scaffold) |

### CI

GitHub Actions runs **lint → typecheck → Astro check → build** on every push to `main` / `dev` and on pull requests. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

### Runtime requirements

- Node **≥ 18**, pnpm **≥ 9** — see [`engines`](package.json) in root `package.json`
- CI uses Node 20; Vercel serverless uses Node 22
- Astro 5 — bump deliberately across the workspace when upgrading

### Vercel (demo site)

Connect **`rainonej/portfolio-engine`** in Vercel: root = repo root, build = `pnpm --filter demo-site run build`, output = `examples/demo-site/dist`. Production on `main`; `dev` and PRs get previews. Details: [examples/demo-site/README.md](examples/demo-site/README.md#vercel).

### Publishing

Packages are published with [Changesets](CONTRIBUTING.md#changesets). See [CONTRIBUTING.md](CONTRIBUTING.md) for branch flow, changesets, and local linking.

### Issues and project board

[`docs/project-management.md`](docs/project-management.md) · [GitHub Project 2](https://github.com/users/rainonej/projects/2)

</details>
