# New consumer site setup

Step-by-step guide for bootstrapping a new standalone portfolio site (like `jordan-site`) that consumes `@portfolio-engine/editorial-theme` from npm.

---

## Prerequisites

- **Node.js 22** and **pnpm 9+** (`npm i -g pnpm`)
- A new empty GitHub repo (clone it locally before starting)
- A Vercel account (for deployment)

---


## 0 — Fast path (recommended for non-technical users)

If you are using Claude Code, do this first:

1. Copy `docs/downstream/setup-with-claude.md` and paste it into Claude.
2. If you already have source material, paste your resume and design brief in the same chat.
3. Ask Claude to run `docs/downstream/setup.sh` (macOS/Linux) or `docs/downstream/setup.ps1` (Windows) first, then continue with manual file wiring.

This reduces typing mistakes and keeps a machine-readable friction log in `src/docs/setup-feedback.md`.

The setup scripts are intentionally split into a **master orchestrator** + **small numbered phase scripts** in `docs/downstream/scripts/` so Claude can skip or edit phases safely.

---

Script controls:
- Bash dry-run preview: `DRY_RUN=1 ./docs/downstream/setup.sh`
- PowerShell dry-run preview: `./docs/downstream/setup.ps1 -DryRun`
- Bash skip phase: `SKIP_INSTALL=1 ./docs/downstream/setup.sh`
- PowerShell skip phase: `./docs/downstream/setup.ps1 -SkipInstall`

## 1 — Scaffold the Astro project

Run this in the root of your empty repo:

```bash
pnpm create astro@latest . --template minimal --install --typescript strict --git false
rm -f src/pages/index.astro
```

The scaffold's default `src/pages/index.astro` conflicts with the theme's `/` route, so remove it immediately.

---

## 2 — Install packages

```bash
pnpm add @portfolio-engine/editorial-theme @portfolio-engine/admin-tools @astrojs/vercel
```

---

## 3 — Replace `astro.config.mjs`

```js
// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import { editorialTheme } from '@portfolio-engine/editorial-theme';
import { adminTools } from '@portfolio-engine/admin-tools';

// Production sets SITE_URL in Vercel env vars. Previews fall back to VERCEL_URL.
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
  'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  adapter: vercel(),
  integrations: [
    editorialTheme({
      siteConfigPath: './src/config/site.json',
      navigationConfigPath: './src/config/navigation.json',
      themeConfigPath: './src/config/theme.json',
      featuresConfigPath: './src/config/features.json',
    }),
    adminTools({ devBypass: true }),
  ],
});
```

Use `output: 'static'` for Astro 6 compatibility with both theme routes and admin API routes (`prerender = false` on admin endpoints handles SSR where needed).

---

## 4 — Create the `src/` directory layout

```bash
mkdir -p src/config src/content/projects src/content/writing src/content/profile src/content/testimonials src/context src/overrides src/docs
```

---

## 5 — Create your config files

**`src/config/site.json`**

```json
{
  "title": "Your Name",
  "description": "One sentence describing your work and who you do it for.",
  "baseUrl": "http://localhost:4321",
  "tagline": "short, punchy tagline",
  "contact": {
    "heading": "Let's work together",
    "body": "Reach out — I'd love to hear from you."
  }
}
```

**`src/config/navigation.json`**

```json
{
  "items": [
    { "label": "Work", "href": "/work", "order": 1, "visible": true },
    { "label": "Writing", "href": "/writing", "order": 2, "visible": true },
    { "label": "About", "href": "/about", "order": 3, "visible": true },
    { "label": "Contact", "href": "/contact", "order": 4, "visible": true }
  ]
}
```

**`src/config/theme.json`** — leave empty for now:

```json
{}
```

**`src/config/features.json`**

```json
{
  "blog": true,
  "work": true,
  "contact": true,
  "testimonials": false,
  "pillars": [
    {
      "heading": "Pillar one",
      "body": "One sentence description of what you do."
    },
    {
      "heading": "Pillar two",
      "body": "One sentence description of what you do."
    },
    {
      "heading": "Pillar three",
      "body": "One sentence description of what you do."
    }
  ],
  "ctaBody": "Whether you need X, Y, or Z — let's talk."
}
```

---

## 6 — Wire up content collections

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    featured: z.boolean().optional().default(false),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    link: z.string().url().optional(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
  }),
});

const profile = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/profile' }),
  schema: z
    .object({
      name: z.string().optional(),
      bio: z.string().optional(),
      email: z.string().optional(),
    })
    .passthrough(),
});

export const collections = { projects, writing, testimonials, profile };
```

---

## 7 — Add placeholder content

Drop at least one entry in each enabled collection so Astro doesn't error on empty globs.

Also add required profile files used by `/about`.

**`src/content/projects/hello-world.md`**

```md
---
title: 'Hello World'
description: 'First project placeholder.'
featured: true
date: 2025-01-01
---

Replace this with a real project.
```

**`src/content/writing/first-post.md`**

```md
---
title: 'First post'
date: 2025-01-01
description: 'Writing placeholder.'
---

Replace this with a real post.
```

**`src/content/profile/person.json`**

```json
{
  "name": "Your Full Name",
  "bio": "One paragraph about you.",
  "email": "you@example.com"
}
```

**`src/content/profile/cv.json`**

```json
{
  "awards": [{ "title": "...", "context": "...", "description": "..." }],
  "education": [{ "degree": "...", "institution": "...", "location": "...", "year": "..." }]
}
```


---

## 8 — Verify locally

```bash
pnpm dev
pnpm check
pnpm build
```

Add this to `.gitignore`:

```gitignore
.portfolio-engine/
.vercel/
```

---

## 9 — Deploy to Vercel

1. Push to GitHub.
2. In Vercel: **Add New → Project** → import your repo.
3. **Root Directory:** `.` (repo root).
4. **Build Command:** `pnpm build` — **Output Directory:** leave default.
5. **Node.js version:** 22.x (Settings → General).
6. **Environment variable:** `SITE_URL` = `https://your-custom-domain.com` (Production only; leave unset for Previews).
7. **Production Branch:** `main`. Keep `dev` for staging previews.

`SITE_URL` powers canonical URLs, Open Graph links, and sitemap URLs.



---

## 10 — Troubleshooting quick hits

- `/` route collision warning: delete `src/pages/index.astro`.
- `/about` build error for missing profile entries: add `profile/person.json` and `profile/cv.json`.
- `/admin` production 500 "server misconfiguration": verify all required OAuth env vars are present.
- Canonical URL points to localhost: set `SITE_URL` in Vercel production env vars and redeploy.
- Work detail pages 404: keep `output: 'static'` (do not switch to `server` for this setup).
