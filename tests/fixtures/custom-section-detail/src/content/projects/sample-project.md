---
title: 'Sample project'
description: 'Single content fixture used to exercise the consumer-local /work and /work/[slug] replacement routes.'
date: 2026-03-01
featured: true
tags: ['Demo', 'Routing']
---

This project entry only exists so the replacement `/work` and `/work/[slug]` pages have real content to render.

The interesting part is in `src/pages-local/work/index.astro` and `src/pages-local/work/[slug].astro` — both use `Layout` from the editorial theme and import components from `@portfolio-engine/editorial-theme/components/content/*`.
