---
title: 'Why Astro, Zod, and Tailwind v4'
date: 2026-01-20
description: 'The stack picks for portfolio-engine, and what got ruled out.'
tags: ['Stack', 'Astro', 'Decisions']
---

## Astro 6

We picked Astro for three reasons.

**Static-first, with islands when you need them.** Most content pages are pure markup. Astro renders them as static HTML by default and lets specific components opt into client-side hydration. The home page of this demo ships almost zero JavaScript — but the `/admin` dashboard runs as an SSR route in the same project, no second framework required.

**The integration API is composable.** `editorialTheme()` is itself an Astro integration that internally mounts another integration (`engine-core`) and configures Vite virtual modules, PostCSS, and route injection. The consumer's `astro.config.mjs` stays small, the engine does the work.

**Content collections are native.** `defineCollection({ schema, loader })` is already the right shape. We didn't have to invent a content layer, just declare the schemas and let Astro index them.

## Zod 4

Schema validation is the gravity that holds the engine's public surface in place. Zod 4 gives us:

- **One source of truth.** Every config file, every content entry, every registry record has a Zod schema in `@portfolio-engine/schema`. The consumer site, the admin tools, and the doctor command all read the same types.
- **Friendly errors at build time.** A typo in `site.json` produces a precise, path-pointing error from Zod rather than a stack trace from inside Astro.
- **Framework-free.** `@portfolio-engine/schema` has no Astro, no Vite, no React dependency. It's a leaf package, and that's what lets engine-core depend on it cleanly.

## Tailwind v4

Tailwind v4 wires through PostCSS with no `tailwind.config.js` required. The theme registers it inside `editorialTheme()` and the consumer doesn't have to think about it. Semantic colors and typography presets resolve to CSS custom properties; Tailwind classes use those properties through `var(...)`. A site can rebrand by editing `theme.json` only — no Tailwind config rebuild needed.

## What got ruled out

- **`astro-theme-provider`.** Solves shadowing by letting consumer `src/pages/` override theme files. Trades invisible coupling for visible overrides. Our named-surface model is the opposite trade.
- **`astro-pages`.** Useful for some projects but duplicates work Astro 6's `injectRoute` does first-class.
- **`astro-public`.** Lets a theme ship a `public/` directory. We deliberately don't — engine packages are code-only, and CI enforces it.
- **MDX by default.** Astro's `@astrojs/mdx` is great but adds a peer dependency. We made it a downstream choice; the iframe-embed docs explain the wiring if you want it.
- **React.** No client-framework requirement — `/admin` is plain Astro + a tiny amount of inline `<script>` for interactivity. Smaller bundle, fewer breakage modes.

## What this means for upgrades

The stack is intentionally narrow. Astro, Zod, Tailwind — three dependencies, each maintained by serious teams with clear release cadences. When one of them ships a major version, we bump in lockstep across all four `@portfolio-engine/*` packages. The consumer sees a single coordinated release.
