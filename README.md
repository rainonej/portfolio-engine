# portfolio-engine

An Astro theme for personal portfolio sites. It provides routes, layouts, and styles so you focus on your content — and it's designed to be set up entirely through Claude prompts.

---

## Get your site live

### What you need first

| Tool           | Where to get it                          |
| -------------- | ---------------------------------------- |
| GitHub account | [github.com](https://github.com)         |
| Vercel account | [vercel.com](https://vercel.com)         |
| Node.js 22     | [nodejs.org](https://nodejs.org)         |
| Claude Code    | [claude.ai/code](https://claude.ai/code) |

Once you have those, open a new empty folder in your terminal and work through the steps below. Each step is a prompt to paste into Claude Code.

---

### Step 1 — Scaffold your site

Open Claude Code in a new empty folder and paste this, filling in your details:

```
I'm setting up a new personal portfolio site using @portfolio-engine/editorial-theme from npm.
Read the setup guide at:
https://github.com/rainonej/portfolio-engine/blob/main/docs/downstream/new-site-setup.md

My details:
  Name:        [YOUR FULL NAME]
  Role:        [WHAT YOU DO — e.g. "product designer", "educator", "software engineer"]
  Tagline:     [SHORT PUNCHY LINE — e.g. "designs for clarity"]
  Description: [ONE SENTENCE — your work and who you do it for]
  Location:    [CITY, COUNTRY]
  Tone:        [HOW YOU WRITE — e.g. "warm and direct", "precise and minimal"]
  Audience:    [WHO READS YOUR SITE — e.g. "hiring managers in education nonprofits"]

Create placeholder entries in src/content/ that I can swap out for real work later.
Fill in src/context/ using my details above.
When you're done, list exactly which files I still need to edit myself.
```

---

### Step 2 — Push to GitHub

```
Please push this project to GitHub.
  1. Run git init if there's no repo here yet.
  2. Create a new GitHub repo called [YOUR-REPO-NAME] — use the GitHub CLI if available,
     otherwise walk me through creating it manually.
  3. Commit everything and push to main.
```

---

### Step 3 — Connect to Vercel

Do this yourself in the Vercel dashboard (takes 2 minutes):

1. **Add New → Project** → import your GitHub repo
2. **Root Directory:** `.` (the repo root — don't change this)
3. **Build Command:** `pnpm build`
4. **Node.js:** set to **22.x** under Settings → General
5. Click **Deploy** and wait for it to go green

Note your deployment URL (looks like `your-repo.vercel.app`).

---

### Step 4 — Make it real

Come back to Claude Code with your live URL:

```
My site is live at [https://your-site.vercel.app].

Please:
  1. Update src/config/site.json baseUrl to the live URL.
  2. Help me add my first real project to src/content/projects/.
  3. Help me add my first real writing piece to src/content/writing/.
  4. Ask me the questions needed to fill in src/context/brand-voice.json
     with my actual tone, audience, and what language I want to avoid.
```

---

### Step 5 — Set your production URL in Vercel

In Vercel: **Project → Settings → Environment Variables**, add:

- **Name:** `SITE_URL`
- **Value:** your production URL (e.g. `https://yourname.com`)
- **Environment:** Production only

Trigger a redeploy after saving.

---

### Step 6 — Add a custom domain (optional)

In Vercel: **Project → Settings → Domains** → add your domain, follow the DNS instructions.
Then update the `SITE_URL` env var to match the new domain and redeploy.

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

The engine packages are published to npm. Your repo just installs them.

---

## Updating the theme

```bash
pnpm update @portfolio-engine/editorial-theme
pnpm build   # make sure it still builds
```

Check the [changelog](https://github.com/rainonej/portfolio-engine/releases) before upgrading across a minor version.

---

## More docs

| Topic                                               | Link                                                                   |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| New site setup (full step-by-step)                  | [docs/downstream/new-site-setup.md](docs/downstream/new-site-setup.md) |
| Semver vs. workspace-link, overrides, Vercel detail | [docs/downstream/consumption.md](docs/downstream/consumption.md)       |
| Lint, format, CI                                    | [docs/contributing/linting.md](docs/contributing/linting.md)           |

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

| Package                                                          | Description                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| [`@portfolio-engine/editorial-theme`](packages/editorial-theme/) | Astro theme: layouts, components, page routes                       |
| [`@portfolio-engine/engine-core`](packages/engine-core/)         | Config loader, virtual modules, route registry, override resolution |
| [`@portfolio-engine/schema`](packages/schema/)                   | Shared Zod schemas for content and configuration                    |
| [`@portfolio-engine/admin-tools`](packages/admin-tools/)         | Admin/reviewer UI _(Epic 7)_                                        |
| [`@portfolio-engine/workflow-kit`](packages/workflow-kit/)       | Reusable GitHub workflows and AI classifier _(Epic 8)_              |

### Runtime requirements

- Node **≥ 18**, pnpm **≥ 9** — see [`engines`](package.json) in root `package.json`
- CI uses Node 20; Vercel serverless uses Node 22
- Astro 5 — bump deliberately across the workspace when upgrading

### Vercel (demo site)

Connect **`rainonej/portfolio-engine`** in Vercel with root = repo root, install `pnpm install`, build `pnpm --filter demo-site run build`, output `examples/demo-site/dist`. Production on `main`; `dev` and PRs get previews. Details: [examples/demo-site/README.md](examples/demo-site/README.md#vercel).

### Publishing

Packages are published with [Changesets](CONTRIBUTING.md#changesets). See [CONTRIBUTING.md](CONTRIBUTING.md) for branch flow, changesets, local linking, and Copilot review expectations.

### Issues and project board

[`docs/project-management.md`](docs/project-management.md) · [GitHub Project 2](https://github.com/users/rainonej/projects/2)

</details>
