# @portfolio-engine/admin-tools

Optional Astro integration that injects a **private `/admin` dashboard** and **GitHub OAuth** API routes (`/api/auth/*`).

## Requirements

- Use together with `@portfolio-engine/editorial-theme` (or any setup that registers `@portfolio-engine/engine-core` virtual modules: `config`, `routes`, …).
- **`adminTools()` must appear after `editorialTheme([...])`** in `astro.config` so injected routes resolve engine virtual modules and your content collections.
- **SSR**: set `output: 'server'` (or hybrid) and add a Node (or other) adapter. Admin API routes do not run in static export.

## Quick start (local)

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import { editorialTheme } from '@portfolio-engine/editorial-theme';
import { adminTools } from '@portfolio-engine/admin-tools';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    editorialTheme({
      /* engine paths */
    }),
    adminTools({ devBypass: true }),
  ],
});
```

With `devBypass: true`, `pnpm astro dev` skips GitHub login and opens the dashboard with **local file writes enabled** — you can load/save files in `src/content`, `src/config`, `src/context`, `src/registry`, and `public/` directly. Remove `devBypass` for real OAuth (writes go through the GitHub Contents API in that mode).

## Production OAuth

Set:

| Variable                        | Purpose                                   |
| ------------------------------- | ----------------------------------------- |
| `GITHUB_CLIENT_ID`              | OAuth app                                 |
| `GITHUB_CLIENT_SECRET`          | OAuth app                                 |
| `SESSION_SECRET`                | HMAC key for session cookie               |
| `ADMIN_TOOLS_GITHUB_REPO_OWNER` | Repo for collaborator check               |
| `ADMIN_TOOLS_GITHUB_REPO_NAME`  | Repo name (falls back to `REPO_*` if set) |

Register the OAuth **callback URL** to match your deployed origin **and** Astro `base` (if any), e.g. `https://<host>/api/auth/callback` or `https://<host>/<base>/api/auth/callback`.

The authorize request uses scope **`read:user repo`** so the collaborator check and future GitHub Contents API calls work on private repositories.

### Session cookie

The signed session cookie follows the same MVP shape as `professional_site` (GitHub access token is embedded in the signed payload). Prefer an opaque server-side session if you need stronger protection against cookie leakage.

## Content collections

The default dashboard expects collections named **`writing`**, **`projects`**, **`testimonials`**, and **`profile`** (same shape as `examples/demo-site`). Sites with different names will need a tailored admin page in a follow-up.

## Status

MVP overview, auth plumbing, and a basic in-browser file editor are shipped. `/api/content` now supports inventory + file reads and saves (local writes in `devBypass`, GitHub Contents API writes in OAuth mode) across content/config/context/registry/public paths. Includes drag-and-drop/browse upload for `public/` assets (with optional subfolder target) so non-technical users can add images/files and reference them in pages. Rich schema-aware drawers and polished editing UX remain a follow-up extraction step from `professional_site`.
