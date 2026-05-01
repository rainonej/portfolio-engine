# Consumer repo layout contract

**Phase:** Phase 2  
**MVP relevance:** ★ Required for Backbone MVP  
**Products touched:** A, B, C, D, E, F  
**Labels:** `type:epic`, `area:downstream`, `area:docs`, `area:engine-core`, `source:human`

## Summary

Define and implement the preferred consumer repo layout: `src/config`, `src/content`, `src/context`, `src/registry`, `src/overrides`, `src/components`, `src/pages-local`, top-level `public`, and `.portfolio-engine`.

## Why this matters

The repo layout is the interface for nontechnical people and AI agents. If the layout is confusing, the whole vibe-coder workflow becomes fragile.

## Tickets

### Decide config path migration strategy

**Labels:** `task:decision`, `owner:human-dev`, `area:engine-core`

Decide whether to immediately migrate from `config/*.json` to `src/config/*.json`, or support both during a compatibility window.

**Acceptance criteria**

- [ ] Decision recorded.
- [ ] Demo-site migration strategy documented.

### Add path options to `editorialTheme(...)`

**Labels:** `task:feat`, `owner:agentic-ai`, `area:editorial-theme`, `agent:approved`

Support paths for config, content, context, registry, overrides, local components, local pages, and public assets.

**Acceptance criteria**

- [ ] `paths.config` accepted.
- [ ] `paths.content` accepted.
- [ ] `paths.context` accepted.
- [ ] Existing demo can still build during transition.

### Add folder README templates

**Labels:** `task:docs`, `owner:agentic-ai`, `area:downstream`, `agent:approved`

Create small README templates for `src/config`, `src/content`, `src/context`, `src/registry`, `src/overrides`, `src/components`, `src/pages-local`, `public`, and `.portfolio-engine`.

**Acceptance criteria**

- [ ] Each README explains purpose.
- [ ] Each README says what does not belong.
- [ ] Each README gives a small example.

### Define structured context schemas

**Labels:** `task:decision`, `owner:human-dev`, `area:schema`

Define fields for `site-owner.json` and `brand-voice.json` so admin-tools can render/edit them later.

**Acceptance criteria**

- [ ] Site-owner fields drafted.
- [ ] Brand-voice fields drafted.
- [ ] Privacy expectations documented.

### Move tool state to `.portfolio-engine` docs

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `agent:approved`

Document that patch ledger and upstream tracking live in `.portfolio-engine`, not `src/context`.

**Acceptance criteria**

- [ ] `src/context` docs exclude tool state.
- [ ] `.portfolio-engine` docs include manifest, patch ledger, upstream tracking.

### Document `public/` semantics

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `area:downstream`, `agent:approved`

Add a short docs page (or section in `docs/downstream/consumption.md`) explaining that the consumer's top-level `public/` folder is served from the site root and that everything inside it is publicly accessible — so private assets, drafts, and tool state must live elsewhere.

**Acceptance criteria**

- [ ] Docs explain that `public/` contents are served at the site root URL.
- [ ] Docs list what does not belong in `public/` (private assets, drafts, tool state, secrets).
- [ ] Docs cross-reference the `.portfolio-engine` and `src/content` paths for non-public material.
- [ ] Folder README template for `public/` (from "Add folder README templates" above) cites this doc.
