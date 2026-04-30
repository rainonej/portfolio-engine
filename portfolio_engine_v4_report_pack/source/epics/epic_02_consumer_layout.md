# Epic 2 — Consumer repo layout contract

**Phase:** Phase 2  
**MVP relevance:** ★ Required for clean consumer repos  
**Labels:** `type:epic`, `area:downstream`, `area:docs`, `area:engine-core`, `source:human`

## Summary

Define and implement the preferred consumer repo layout: `src/config`, `src/content`, `src/context`, `src/registry`, `src/overrides`, `src/components`, `src/pages-local`, top-level `public`, and `.portfolio-engine`.

## Why this matters

The repo layout is the interface for nontechnical people and AI agents. If the layout is confusing, the whole vibe-coder workflow becomes fragile.

## Tickets

### T2.1 — Decide config path migration strategy

**Labels:** `task:decision`, `owner:human-dev`, `area:engine-core`

Decide whether to immediately migrate from `config/*.json` to `src/config/*.json`, or support both during a compatibility window.

**Acceptance criteria**

- [ ] Decision recorded.
- [ ] Demo-site migration strategy documented.

### T2.2 — Add path options to `editorialTheme(...)`

**Labels:** `task:feat`, `owner:agentic-ai`, `area:theme`, `claude-ready`

Support paths for config, content, context, registry, overrides, local components, local pages, and public assets.

**Acceptance criteria**

- [ ] `paths.config` accepted.
- [ ] `paths.content` accepted.
- [ ] `paths.context` accepted.
- [ ] Existing demo can still build during transition.

### T2.3 — Add folder README templates

**Labels:** `task:docs`, `owner:agentic-ai`, `area:downstream`, `claude-ready`

Create small README templates for `src/config`, `src/content`, `src/context`, `src/registry`, `src/overrides`, `src/components`, `src/pages-local`, `public`, and `.portfolio-engine`.

**Acceptance criteria**

- [ ] Each README explains purpose.
- [ ] Each README says what does not belong.
- [ ] Each README gives a small example.

### T2.4 — Define structured context schemas

**Labels:** `task:decision`, `owner:human-dev`, `area:schema`

Define fields for `site-owner.json` and `brand-voice.json` so admin-tools can render/edit them later.

**Acceptance criteria**

- [ ] Site-owner fields drafted.
- [ ] Brand-voice fields drafted.
- [ ] Privacy expectations documented.

### T2.5 — Move tool state to `.portfolio-engine` docs

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `claude-ready`

Document that patch ledger and upstream tracking live in `.portfolio-engine`, not `src/context`.

**Acceptance criteria**

- [ ] `src/context` docs exclude tool state.
- [ ] `.portfolio-engine` docs include manifest, patch ledger, upstream tracking.
