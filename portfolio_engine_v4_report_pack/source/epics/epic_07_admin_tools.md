# Epic 7 — Optional admin-tools UI

**Phase:** Phase 6  
**MVP relevance:** Post-MVP  
**Labels:** `type:epic`, `area:admin-tools`, `source:human`

## Summary

Build an optional UI layer for nontechnical users to edit/render content, config, context, assets, and registry state.

## Why this matters

Admin-tools is the direct UI for people who do not want to edit code. It should eventually expose site-owner context and brand voice as structured, editable forms.

## Tickets

### T7.1 — Update admin-tools docs for target layout

**Labels:** `task:docs`, `owner:agentic-ai`, `area:admin-tools`, `agent:approved`

Document how admin-tools will read `src/config`, `src/content`, `src/context`, `src/registry`, `public`, and `.portfolio-engine/manifest.json`.

**Acceptance criteria**

- [ ] Docs distinguish admin-tools from workflow-kit.
- [ ] Docs identify admin-editable vs tool-state files.

### T7.2 — Design admin information architecture

**Labels:** `task:design`, `owner:human-dev`, `area:admin-tools`

Design admin sections for theme/config, sitemap/routes, content, context, assets, registry, and upstream blockers.

**Acceptance criteria**

- [ ] IA sketch documented.
- [ ] MVP admin scope separated from future scope.

### T7.3 — Define admin-editable context fields

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

See also: `epic_14_admin_tools_publishing.md` for the publishing/preview management epic.
