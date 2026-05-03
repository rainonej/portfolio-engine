# New consumer site setup

Step-by-step guide for bootstrapping a new standalone portfolio site (like `jordan-site`) that consumes `@portfolio-engine/editorial-theme` from npm.

---

## Prerequisites

- **Node.js 22** and **pnpm 9+** (`npm i -g pnpm`)
- A new empty GitHub repo (clone it locally before starting)
- A Vercel account (for deployment)

---

## 1 — Scaffold the Astro project

Run this in the root of your empty repo:

```bash
pnpm create astro@latest . --template minimal --install --typescript strict --git false
```

Accept all prompts. This drops in `astro.config.mjs`, `tsconfig.json`, `package.json`, and a minimal `src/` skeleton.

---

## 2 — Install the theme

```bash
pnpm add @portfolio-engine/editorial-theme @astrojs/vercel
```

---

## 3 — Replace `astro.config.mjs`

```js
// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import { editorialTheme } from '@portfolio-engine/editorial-theme';

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
  ],
});
```

---

## 4 — Create the `src/` directory layout

```bash
mkdir -p src/config src/content/projects src/content/writing src/content/profile src/content/testimonials src/context src/overrides
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
  schema: z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    email: z.string().optional(),
  }),
});

export const collections = { projects, writing, testimonials, profile };
```

---

## 7 — Add placeholder content

Drop at least one entry in each enabled collection so Astro doesn't error on empty globs.

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

---

## 8 — Fill in `src/context/` (your identity layer)

These files are **never read by the Astro build** — they exist for AI assistants (like Claude) working on your site. Take ten minutes to fill them in honestly; the more accurate they are, the better AI output you'll get.

**`src/context/site-owner.json`** — who you are:

```json
{
  "name": "Your Full Name",
  "role": "Your title or discipline",
  "location": "City, Country",
  "website": "https://yoursite.com"
}
```

**`src/context/brand-voice.json`** — how you write:

```json
{
  "tone": "describe your tone (e.g. warm and direct, precise and minimal)",
  "audience": "who you're writing for (e.g. design-minded engineers, nonprofit hiring managers)",
  "avoid": ["jargon words or phrases you dislike"],
  "examples": ["a sentence that sounds like you"]
}
```

**`src/context/agent-rules.md`** — standing instructions for AI:

```md
# Agent rules

- Write in first person unless asked otherwise.
- Keep descriptions under 100 words unless asked for long-form.
- Do not invent credentials or project details — ask me if unsure.
- Prefer concrete, specific language over abstract or corporate-speak.
```

**`src/context/README.md`**:

```md
# context/

Site-owner identity and brand guidance for AI-assisted workflows.
These files are read by agents, not by the Astro build.
```

---

## 9 — Add `src/overrides/README.md`

```md
# overrides/

Drop component overrides here, then wire them in astro.config.mjs via
editorialTheme({ overrides: { components: { Hero: './src/overrides/Hero.astro' } } }).
Only named surfaces are stable. See docs/downstream/consumption.md.
```

---

## 10 — Verify locally

```bash
pnpm dev        # Should open on http://localhost:4321
pnpm check      # Astro type-check
pnpm build      # Full build (catches SSR/adapter issues)
```

---

## 11 — Deploy to Vercel

1. Push to GitHub.
2. In Vercel: **Add New → Project** → import your repo.
3. **Root Directory:** `.` (repo root).
4. **Build Command:** `pnpm build` — **Output Directory:** leave default.
5. **Node.js version:** 22.x (Settings → General).
6. **Environment variable:** `SITE_URL` = `https://your-custom-domain.com` (Production only; leave unset for Previews).
7. **Production Branch:** `main`. Keep `dev` for staging previews.

After the first deploy succeeds, update `src/config/site.json` `baseUrl` to the real production URL.

---

## Bootstrap with Claude

If you'd rather have an AI do the scaffolding, create a fresh repo, clone it, and paste this into a Claude Code session:

```
I'm setting up a new standalone portfolio site called [SITE_NAME] that consumes
@portfolio-engine/editorial-theme from npm. The monorepo that publishes this package
is at https://github.com/rainonej/portfolio-engine — read its README and
docs/downstream/new-site-setup.md for the expected file layout and config shapes.

Please scaffold everything: astro.config.mjs, src/config/*.json, src/content.config.ts,
placeholder content, and src/context/ files using the details below.

About me:
- Name: [YOUR NAME]
- Role/discipline: [WHAT YOU DO]
- Location: [CITY, COUNTRY]
- Tagline: [PUNCHY ONE-LINER]
- Audience: [WHO YOU'RE WRITING FOR]
- Tone: [HOW YOU WRITE]
- Website I want to deploy to: [https://yoursite.com]

Navigation I want: [list the pages — Work / Writing / About / Contact or your own]

For content, create placeholder entries I can replace — do not invent real projects.
For src/context/, fill in site-owner.json and brand-voice.json from the details above.
Leave agent-rules.md as a template I can edit.

After scaffolding, tell me exactly which files I still need to fill in myself.
```

Fill in the bracketed fields, paste, and Claude will set up the full structure. Then go back and fill in `src/content/` with your real work.
