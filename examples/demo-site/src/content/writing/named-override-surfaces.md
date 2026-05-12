---
title: 'Named override surfaces'
date: 2026-02-22
description: 'Customizing the theme without forking it. Five surfaces, typed props, versioned across releases.'
tags: ['Theme', 'Overrides', 'Customization']
---

## The contract

The editorial theme declares exactly five override-able components in `packages/editorial-theme/src/registry.ts`:

- `Hero` — props: `person`, `bookingUrl`, `pillars`, `base`, `tagline`, `ctas`.
- `FeaturedWriting` — props: `posts`, `base`.
- `TestimonialSection` — props: `testimonials`.
- `CollaborationSection` — props: `base`, `ctaBody`.
- `Footer` — props: `adminHref`, `siteTitle`, `adminLinkLabel`.

Trying to override any other component is a build-time error. Trying to override a removed surface is a build-time error. The set is small on purpose.

## Why "named", not "file-path"

Most theme systems let consumers override arbitrary files by mirroring the theme's directory tree. This sounds great until you upgrade and a file you were shadowing got renamed — your override silently stops applying, and you find out by reading a bug report.

Named surfaces make the public contract explicit. Each surface has documented props, a default implementation, and a host page where it renders. If a surface is removed, that's a breaking change called out in the changelog and surfaced by the doctor command.

## How it works under the hood

Engine-core resolves the override map at build time and exposes per-surface virtual modules:

```typescript
// Inside editorial-theme/src/components/sections/HeroSection.astro
import Override from '@portfolio-engine:override/Hero';
// ...
{Override ? <Override person={person} bookingUrl={bookingUrl} pillars={pillars} base={base} tagline={tagline} ctas={effectiveCtas} /> : <DefaultHero ... />}
```

If the consumer wired an override for `Hero`, the virtual module resolves to their component. If not, it resolves to `null` and the theme renders its default.

## Style overrides

CSS files passed to `overrides.styles` are appended after `global.css`, so consumer styles always win without `!important`. This site uses `src/overrides/styles/showcase.css` to add subtle gradient flourishes and a callout style for inline notes.

## Where to look in this demo

All five surfaces are wired in [`examples/demo-site/src/overrides/`](https://github.com/rainonej/portfolio-engine/tree/main/examples/demo-site/src/overrides). Each file starts with a header comment naming the surface and linking to the relevant doc.
