# @portfolio-engine/admin-tools

Optional Astro integration that injects a **private `/admin` dashboard** and **GitHub OAuth** API routes (`/api/auth/*`).

## Requirements

- Use together with `@portfolio-engine/editorial-theme` (or any setup that registers `@portfolio-engine/engine-core` virtual modules: `config`, `routes`, …).
- **`adminTools()` must appear after `editorialTheme([...])`** in `astro.config` so injected routes resolve engine virtual modules and your content collections.
- Use `output: 'static'` for Astro 6 consumer sites with the editorial theme; admin API routes opt into SSR individually via `prerender = false`.

## Quick start (local)

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import { editorialTheme } from '@portfolio-engine/editorial-theme';
import { adminTools } from '@portfolio-engine/admin-tools';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
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

## TypeScript / IDE configuration

The injected `dist/routes/admin.astro` file uses Astro virtual modules (`@portfolio-engine:config`, `@portfolio-engine:routes`) that are only resolvable at **Astro build time** via the integrations. If your `tsconfig.json` uses a glob that covers `node_modules`, the TypeScript language service may flag false positives for these imports.

**Recommended fix — exclude `node_modules` from your consumer `tsconfig.json`:**

```jsonc
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  // TypeScript does NOT merge `exclude` across `extends` — list everything you need here.
  "exclude": ["node_modules", "dist"]
}
```

> **Note:** `exclude` is not merged from `extends` presets. If you already have an `exclude` array, add `"node_modules"` to it rather than replacing it, to avoid accidentally re-including previously excluded paths (e.g. `dist`).

The `dist/routes/admin.astro` file also carries a `// @ts-nocheck` directive in its frontmatter so that IDEs that do include `node_modules` do not surface spurious errors from virtual module imports.

## Downstream patching

If you need to patch `dist/routes/admin.astro` via `pnpm patch` (or a plain `git apply` patch), keep in mind:

- The **exact lines** from the published tarball must appear in the unified diff.  Use `pnpm pack --pack-destination /tmp` to create the tarball, then `tar -tf <tarball>` to list its contents and `tar -xf <tarball> -C /tmp/pkg` to extract and inspect individual files before authoring the patch.
- Run `git apply --check` against the extracted file on both LF and CRLF checkouts before committing a patch file.
- Patches that mark a line as **context** (` ` prefix) but use the post-change content will be rejected by `git apply`.

## Status

MVP overview, auth plumbing, and a basic in-browser file editor are shipped. `/api/content` now supports inventory + file reads and saves (local writes in `devBypass`, GitHub Contents API writes in OAuth mode) across content/config/context/registry/public paths. Includes drag-and-drop/browse upload for `public/` assets (with optional subfolder target) so non-technical users can add images/files and reference them in pages. Rich schema-aware drawers and polished editing UX remain a follow-up extraction step from `professional_site`.

> `devBypass` only applies in local dev and is safe to leave configured; production behavior still requires OAuth env vars.
