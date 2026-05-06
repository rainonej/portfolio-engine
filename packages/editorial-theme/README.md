# @portfolio-engine/editorial-theme

The first-party portfolio theme built on `@portfolio-engine/engine-core`. A
batteries-included Astro integration that loads your config, registers
virtual modules, sets up Tailwind CSS, and injects every page route the
theme provides — all from one call in your `astro.config.mjs`.

## Quick start

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { editorialTheme } from '@portfolio-engine/editorial-theme';

export default defineConfig({
  integrations: [
    editorialTheme({
      siteConfigPath: './config/site.json',
      navigationConfigPath: './config/navigation.json',
      themeConfigPath: './config/theme.json',
      featuresConfigPath: './config/features.json',
    }),
  ],
});
```

That single call:

- Configures Tailwind via PostCSS (no separate `@astrojs/tailwind` install)
- Loads your config JSON files and exposes them via the
  `@portfolio-engine:config` virtual module
- Resolves any component/style overrides into the
  `@portfolio-engine:overrides` virtual module
- Injects all theme page routes (`/`, `/about`, `/contact`, `/work`,
  `/work/[slug]`, `/writing`, `/writing/[slug]`)

## Route ownership modes

Portfolio Engine supports three route ownership modes:

1. **Theme-injected routes** — the default. `/`, `/work`, `/work/[slug]`,
   `/writing`, `/writing/[slug]`, `/about`, `/contact`, `/resume` are all
   owned by the theme. You supply content; the theme renders the page.

2. **Consumer-local registry routes** — declare a route in
   `src/registry/portfolio-engine.registry.json` and put the page file under
   `src/pages-local/`. Useful for replacing a theme page while keeping the
   theme shell (Layout, Nav, styles). Disable the theme route first so there
   is no collision.

3. **Ordinary Astro file routes** — page files under your `src/pages/`
   directory. Astro owns these via its file-based routing. Useful for fully
   custom pages (e.g. `src/pages/resume.astro`) that don't need to replace a
   theme route. The engine does not inject these — Astro discovers them
   automatically.

## Required config files

The four config JSON files are validated by `@portfolio-engine/schema`.
See that package for the canonical Zod schemas. A minimal set:

```jsonc
// config/site.json
{
  "title": "Your Name",
  "description": "Personal portfolio.",
  "baseUrl": "https://example.com",
  "tagline": "designs for clarity",
  "contact": {
    "heading": "Let's work together",
    "body": "Reach out and let's find what's possible.",
  },
  "bookingUrl": "https://calendly.com/your-handle/30min",
}
```

```jsonc
// config/navigation.json
{
  "items": [
    { "label": "Work", "href": "/work", "order": 1, "visible": true },
    { "label": "Writing", "href": "/writing", "order": 2, "visible": true },
    { "label": "About", "href": "/about", "order": 3, "visible": true },
    { "label": "Contact", "href": "/contact", "order": 4, "visible": true },
  ],
}
```

```jsonc
// config/theme.json — leave {} for defaults; see "Overrides" below
{}
```

```jsonc
// config/features.json
{
  "blog": true,
  "work": true,
  "contact": true,
  "testimonials": true,
  "pillars": [{ "heading": "Product Design", "body": "Thoughtful interfaces." }],
  "ctaBody": "Let's talk.",
}
```

## Required content collections

Add `src/content.config.ts` with these four collections (the page routes
expect them):

| Collection     | Type      | Required entries / shape                                                                               |
| -------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| `profile`      | `data`    | `person` (`ProfilePersonSchema`) and `cv` (`ProfileCvSchema`) — import from `@portfolio-engine/schema` |
| `projects`     | `content` | title, description, featured?, image?, tags?, link?, date                                              |
| `writing`      | `content` | title, date, description?, image?, draft?, tags?                                                       |
| `testimonials` | `data`    | quote, author, role, featured?                                                                         |

For the `profile` collection, prefer `shortBio`/`summary`/`longBio` over
dumping everything into `bio`. The `bio` field is still accepted but deprecated:
it is split on blank lines into paragraphs when present. A hero that receives a
wall of bio text will look unpolished — use `shortBio` (one liner) for the hero
and `longBio` (array of paragraphs) for about/resume.

See [`examples/demo-site/src/content.config.ts`](../../examples/demo-site/src/content.config.ts)
for a working reference.

## Overrides

Two override surfaces let consumers customise the theme without forking
it. Both are configured by passing an `overrides` option to
`editorialTheme()` (or by setting them on the integration config):

### Component overrides

Replace one of the four named section blocks with your own Astro
component:

| Surface                | Page | Replaces                               | Props received                                   |
| ---------------------- | ---- | -------------------------------------- | ------------------------------------------------ |
| `Hero`                 | `/`  | The home-page hero (name, bio, CTAs)   | `{ person, bookingUrl, pillars, base, tagline }` |
| `FeaturedWriting`      | `/`  | The "Recent Writing" block on the home | `{ posts, base }`                                |
| `TestimonialSection`   | `/`  | The testimonials block on the home     | `{ testimonials }`                               |
| `CollaborationSection` | `/`  | The collaboration CTA at the bottom    | `{ base, ctaBody }`                              |

```js
editorialTheme({
  // ...config paths...
  overrides: {
    components: {
      Hero: './src/overrides/Hero.astro',
    },
  },
});
```

Paths are resolved relative to the consumer project root. Any surface
name not in the table above produces a build-time error.

### Style override (`styles[]`)

Append extra CSS files after the theme's `global.css`:

```js
editorialTheme({
  // ...config paths...
  overrides: {
    styles: ['./src/overrides/custom.css'],
  },
});
```

Each file is read at build time and inlined as a global stylesheet on
every page.

## Deploying (separate consumer repo)

For a **standalone** Astro repo that depends on this package from npm: Vercel import, `pnpm install` / `pnpm build`, **production branch `main`**, **`dev` and PRs for previews**, canonical `SITE_URL`, and OAuth callback notes are in **[`docs/downstream/consumption.md` § Vercel (standalone consumer repo)](../../docs/downstream/consumption.md#vercel-standalone-consumer-repo)**.

## Status

First public feature release — Epic 4. See
[`examples/demo-site`](../../examples/demo-site) for a complete working
consumer. Architecture detail lives in
[`docs/packages/editorial-theme.md`](../../docs/packages/editorial-theme.md).
