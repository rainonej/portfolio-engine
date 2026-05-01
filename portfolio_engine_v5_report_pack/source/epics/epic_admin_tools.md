# Epic 12 — Optional admin-tools UI

**Phase:** Phase 7  
**MVP relevance:** Post–Product-MVP  
**Products touched:** C, E  
**Labels:** `type:epic`, `area:admin-tools`, `source:human`

## Summary

Extract and package the existing admin UI from the profesional_site/agreni-site codebase into the `@portfolio-engine/admin-tools` package. This is not a greenfield build — the admin functionality exists and needs to be moved into a reusable, distributable package.

## Why this matters

Admin-tools is the intended content editing mechanism for agreni-site (replacing Pages CMS). The architecture decision is locked: content files are Astro content collections edited via admin-tools, not a third-party CMS. The majority of the MVP admin features are already built and just need extraction and packaging.

## Extraction source

The admin UI to extract is in the profesional_site/agreni-site codebase. See:
- profesional_site #178: Epic 7 — Extract Admin Tools + Generated Site Map
- profesional_site #223: Task 7.1 — Extract admin/reviewer UI into admin-tools package
- profesional_site #224: Task 7.2 — Generate site map from route registry
- profesional_site #225: Task 7.3 — Add content/config inspection panels

## Tickets

### T12.1 — Update admin-tools docs for target layout

**Labels:** `task:docs`, `owner:agentic-ai`, `area:admin-tools`, `agent:approved`

Document how admin-tools will read `src/config`, `src/content`, `src/context`, `src/registry`, `public`, and `.portfolio-engine/manifest.json`.

**Acceptance criteria**

- [ ] Docs distinguish admin-tools from workflow-kit.
- [ ] Docs identify admin-editable vs tool-state files.

### T12.2 — Design admin information architecture

**Labels:** `task:design`, `owner:human-dev`, `area:admin-tools`

Design admin sections for theme/config, sitemap/routes, content, context, assets, registry, and upstream blockers.

**Acceptance criteria**

- [ ] IA sketch documented.
- [ ] MVP admin scope separated from future scope.

### T12.3 — Define admin-editable context fields

**Labels:** `task:decision`, `owner:human-dev`, `area:admin-tools`

Finalize which `site-owner.json` and `brand-voice.json` fields admin-tools should render/edit.

**Acceptance criteria**

- [ ] Fields map to schema.
- [ ] Privacy/visibility documented.

## Future admin-tools modules (post-MVP)

These are not part of the initial admin-tools build. They clarify where the UI is headed.

### Site overview

- Site title, current public URL, preview URL, build/deploy status, package versions.

### Content editor

- Profile, CV, writing, projects, testimonials, assets.

### Brand/context editor

- Site owner, brand voice, audience, goals, tone settings.

### Theme/config editor

- Colors, fonts, navigation, features, booking/contact links.

### Registry/extensions viewer

- Local pages, local embeds, local components, unsupported upstream requests.

### Preview/public publishing panel

- Show public production site URL and dev/preview site URL.
- Reveal obfuscated Vercel preview link.
- Show branch mapping: `main` → public production; `dev` → preview.
- Create instructions for Vercel project setup.
- Optionally trigger or guide dev→main promotion.

### Publishing cadence

Future settings for manual, scheduled, or auto-approved publishing workflows.

See also: `epic_17_admin_publishing.md` for the publishing/preview management epic.
