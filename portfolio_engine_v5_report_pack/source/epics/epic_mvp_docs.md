# MVP documentation (README, CONTRIBUTING, downstream)

**Phase:** Phase 3  
**MVP relevance:** ★ Required for Backbone MVP  
**Products touched:** A, B, C, D, G  
**Labels:** `type:epic`, `area:docs`, `source:human`

## Summary

Ship the documentation layer required for Backbone MVP: clear required vs optional packages, downstream consumption paths, two development modes (workspace link vs semver), and CONTRIBUTING basics so contributors and consumers do not guess.

## Why this matters

Backbone MVP is not only code — it is an understandable contract. Without aligned README and consumption docs, workspace-only workflows get confused with production semver consumption, and Product MVP (Phase 4) cannot be validated.

## Tickets

### README rewrite: required vs optional

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `agent:approved`

**Acceptance criteria**

- [ ] Required runtime packages listed first; optional admin-tools and workflow-kit clearly separated.
- [ ] Backbone MVP vs Product MVP pointers link to roadmap/product tracks sections.

### Downstream consumption documentation

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `agent:approved`

**Acceptance criteria**

- [ ] `docs/downstream/consumption.md` (or equivalent) describes install, layout, and package wiring for separate repos.
- [ ] Product MVP expectation: semver/npm unless a documented exception applies.

### Two-mode documentation (workspace vs semver)

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `agent:approved`

**Acceptance criteria**

- [ ] Workspace-link mode documented for monorepo contributors (allowed for Backbone MVP when docs are explicit).
- [ ] Semver mode documented as the target for agreni-site and jordan-site at Product MVP.

### CONTRIBUTING basics

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `agent:approved`

**Acceptance criteria**

- [ ] Branch/PR expectations and AI-assisted contribution pointers align with governance docs.
- [ ] Where to file consumer vs upstream issues is clear.
