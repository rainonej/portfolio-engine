---
title: 'The four-layer architecture'
date: 2026-04-01
description: 'Schema → engine-core → editorial-theme → consumer. Why every dependency only points downward, and why that boundary is the whole product.'
tags: ['Architecture', 'Engine-core', 'Layering']
---

## The layers

`portfolio-engine` is split into four packages, each one a layer in a strict downward dependency graph:

1. **`@portfolio-engine/schema`** — pure Zod schemas. No Astro, no Vite, no framework dependencies. The canonical shape of every config file, content entry, and route registry record lives here.
2. **`@portfolio-engine/engine-core`** — the Astro integration. Loads JSON config, validates against the schema package, exposes virtual modules (`@portfolio-engine:config`, `:context`, `:routes`, `:overrides`), discovers routes, and writes the build manifest. Consumers never import this directly — the theme imports it.
3. **`@portfolio-engine/editorial-theme`** — the first-party theme. Owns layouts, components, the global stylesheet, and the named override surfaces. Exports `editorialTheme()` which wraps engine-core and configures Tailwind v4 via PostCSS.
4. **Your consumer site** — content collections, config JSON, optional overrides, optional consumer-local registry routes. Depends on the theme; never on engine-core or schema directly.

## Why strict downward dependencies

Most theme systems fail in two ways. Either the theme reaches into the consumer (think `astro-theme-provider`, where the consumer's `src/pages/` shadows the theme's), or the consumer reaches into the theme (forking the theme to add one feature). Both make upgrades terrifying.

portfolio-engine bans both. The theme exposes named override surfaces. The consumer adds local routes through a registry. No file shadowing, no fork-and-merge. Upgrade story: bump `@portfolio-engine/*` to `@latest`, run the build, read the changelog.

## A picture

<!--
  Relative URLs are used below so this post works under non-root deployments
  (Astro `base` / `BASE_URL`). The post is rendered at /writing/<slug>/, so
  `../../` reaches the site root. Astro components can call `resolveAssetUrl`
  to get the same result programmatically — see /architecture.
-->
<figure style="margin: 2rem 0;">
  <iframe
    src="../../assets/demos/architecture/"
    title="Interactive diagram: portfolio-engine's four-layer architecture"
    loading="lazy"
    sandbox="allow-scripts"
    style="display:block; width:100%; height:560px; border:1px solid var(--color-border-default); border-radius:1rem; background: var(--color-surface-wash);"
  ></iframe>
  <figcaption style="margin-top: 0.5rem; color: var(--color-text-muted); font-size: 0.85rem;">Click any layer to highlight its direct dependency. The same diagram is also rendered on <a href="../../architecture">the architecture page</a>, where it's embedded via the theme's typed <code>&lt;IframeEmbed&gt;</code> component (with HTTPS-only validation and an optional host allowlist).</figcaption>
</figure>

## The banned-dependencies list

`docs/architecture/dependencies.md` records three packages that we deliberately do not use: `astro-theme-provider`, `astro-pages`, and `astro-public`. Each one solves a real problem but introduces invisible coupling between theme and consumer. We re-implemented the parts we actually need (route injection, virtual modules) first-party, so the contract is legible and the version surface is small.
