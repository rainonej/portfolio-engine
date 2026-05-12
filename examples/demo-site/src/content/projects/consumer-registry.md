---
title: 'Consumer Registry'
description: "Add pages the theme doesn't know about — without forking the theme. A single JSON file declares the route; src/pages-local/ holds the .astro file."
featured: true
date: 2026-03-24
tags: ['Routing', 'Engine-core', 'Extensibility']
image: '/assets/work/consumer-registry.svg'
---

## The problem

Theme routes are great for the 90% case (home, about, work, writing, contact, résumé). But sometimes you need a page the theme doesn't ship — `/philosophy`, `/architecture`, `/colophon`, a campaign landing page. You don't want to fork the theme, and you don't want to add a runtime escape hatch that's hard to reason about.

## The solution

Declare consumer-local routes in `src/registry/portfolio-engine.registry.json` and put the actual `.astro` files in `src/pages-local/`. The engine picks them up, checks for collisions with theme routes, and injects them through Astro's `injectRoute` hook.

```json
{
  "version": 1,
  "localRoutes": [
    {
      "pattern": "/philosophy",
      "page": "philosophy.astro",
      "label": "Philosophy",
      "section": null,
      "visibility": "public"
    }
  ]
}
```

## How it appears in the manifest

Every build emits `.portfolio-engine/manifest.json` with the resolved route registry. Consumer-local routes are tagged with `routeOrigin: "consumer-local"` so the doctor command and admin tools can tell them apart from theme routes.

This site uses the consumer registry for three pages: `/philosophy`, `/architecture`, and `/features`. Each one demonstrates a different capability that's easier to express outside the theme's stable surface.
