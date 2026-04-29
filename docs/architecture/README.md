# Architecture

portfolio-engine is organised into four layers. Each layer has a single responsibility and a strict dependency direction: layers only depend downward.

## Four-Layer Model

```
┌──────────────────────────────────────────────────────────────────┐
│  Layer 4 — Consumer site (agreni-site, private)                  │
│                                                                  │
│  What lives here: content files, site config, media, overrides   │
│  What it owns: nothing shared — all local to this site           │
│  Depends on: @portfolio-engine/editorial-theme                   │
└──────────────────────────────────────────────────────────────────┘
           ↓ depends on
┌──────────────────────────────────────────────────────────────────┐
│  Layer 3 — @portfolio-engine/editorial-theme                     │
│                                                                  │
│  What lives here: layouts, components, styles, page routes       │
│  Named override surfaces for consumer customisation              │
│  Depends on: @portfolio-engine/engine-core                       │
└──────────────────────────────────────────────────────────────────┘
           ↓ depends on
┌──────────────────────────────────────────────────────────────────┐
│  Layer 2 — @portfolio-engine/engine-core                         │
│                                                                  │
│  What lives here: Astro integration, config loader, virtual      │
│  modules, route registry, override resolution, type injection    │
│  Depends on: @portfolio-engine/schema                            │
└──────────────────────────────────────────────────────────────────┘
           ↓ depends on
┌──────────────────────────────────────────────────────────────────┐
│  Layer 1 — @portfolio-engine/schema                              │
│                                                                  │
│  What lives here: Zod schemas for all content and config types   │
│  No Astro dependency — pure TypeScript + Zod                     │
└──────────────────────────────────────────────────────────────────┘
```

## Design Principles

**First-party, not generic.** This engine is built for one consumer (`agreni-site`). It is not designed to support arbitrary third-party themes or infinite configuration surfaces. Being open-source is about transparency, not extensibility.

**Explicit override surfaces.** Consumers can override named components and styles. They cannot override arbitrary files — override points are declared by the theme and stable across versions.

**Two-repo model.** Engine packages live in the public `portfolio-engine` repo. Consumer content and config live in the private `agreni-site` repo. They share no git history.

**No packaged public-dir in v1.** Static assets are managed by the consumer, not the engine. This is a deliberate v1 non-goal.

See [dependencies.md](dependencies.md) for the approved and banned package list.
