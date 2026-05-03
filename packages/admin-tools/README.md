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
    editorialTheme({ /* engine paths */ }),
    adminTools({ devBypass: true }),
  ],
});
```

With `devBypass: true`, `pnpm astro dev` skips GitHub login and opens a **read-only** overview (site config, route tree, content counts). Remove `devBypass` for real OAuth.

## Production OAuth

Set:

| Variable | Purpose |
|----------|---------|
| `GITHUB_CLIENT_ID` | OAuth app |
| `GITHUB_CLIENT_SECRET` | OAuth app |
| `SESSION_SECRET` | HMAC key for session cookie |
| `ADMIN_TOOLS_GITHUB_REPO_OWNER` | Repo for collaborator check |
| `ADMIN_TOOLS_GITHUB_REPO_NAME` | Repo name (falls back to `REPO_*` if set) |

Register the OAuth callback URL: `https://<your-host>/api/auth/callback`.

## Content collections

The default dashboard expects collections named **`writing`**, **`projects`**, **`testimonials`**, and **`profile`** (same shape as `examples/demo-site`). Sites with different names will need a tailored admin page in a follow-up.

## Status

Read-only overview and auth plumbing ship first; GitHub Contents editing (drawers, `/api/content`) is the next extraction step from `professional_site`.
