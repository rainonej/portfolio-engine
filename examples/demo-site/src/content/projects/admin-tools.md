---
title: 'Admin Tools'
description: 'A drop-in /admin dashboard with GitHub OAuth, content inventory, and a public-asset uploader — or local-only direct-to-disk writes via devBypass.'
featured: true
date: 2026-04-12
tags: ['Admin', 'OAuth', 'SSR']
image: '/assets/work/admin-tools.svg'
link: 'https://github.com/rainonej/portfolio-engine/tree/main/packages/admin-tools'
---

## What it does

`@portfolio-engine/admin-tools` is an optional Astro integration. Add it to your `astro.config.mjs` after `editorialTheme(...)` and it injects:

- `/admin` — a dashboard that lists every content collection entry and the public assets you've uploaded.
- `/api/auth/{github,callback,session,logout}` — GitHub OAuth (`read:user`, `repo` scopes) with HMAC-signed session cookies.
- `/api/content` — inventory, read, and save endpoints for collection entries.

In `devBypass: true` mode, auth is skipped and saves go straight to disk. In production, saves go through the GitHub Contents API, so every edit is a real commit on the configured branch.

## How to enable it

```javascript
import { adminTools } from '@portfolio-engine/admin-tools';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [
    editorialTheme({
      /* ... */
    }),
    adminTools({ devBypass: true }),
  ],
});
```

This demo runs with `devBypass: true`. Visit [`/admin`](/admin) to see the dashboard.

## Why it matters

A portfolio site is only useful if non-engineers can keep it up to date. Admin tools means the people who own the content can edit it without touching code — and every change is recorded as a commit in your private content repo, no separate CMS database required.
