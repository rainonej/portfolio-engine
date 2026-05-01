# Epic 4 — Runtime manifest and explicit registries

**Phase:** Phase 3  
**MVP relevance:** Post-MVP infrastructure, but useful for admin/workflow tooling  
**Labels:** `type:epic`, `area:engine-core`, `area:editorial-theme`, `source:human`

## Summary

Expose routes, override surfaces, paths, and capabilities as explicit registries/manifests for workflow-kit, admin-tools, consumer registry, and safety checks.

## Why this matters

Agents and admin UI should not have to inspect arbitrary source code to understand what the engine supports.

## Tickets

### T4.1 — Move route metadata to explicit registry

**Labels:** `task:feat`, `owner:agentic-ai`, `area:editorial-theme`, `agent:approved`

Create a built-in route registry with labels, paths, visibility, remappable/disableable flags, and agent/admin metadata.

**Acceptance criteria**

- [ ] Routes still inject correctly.
- [ ] Registry exported to manifest.

### T4.2 — Move override surfaces to explicit registry

**Labels:** `task:feat`, `owner:agentic-ai`, `area:editorial-theme`, `agent:approved`

Declare supported surfaces with props, default component, page, docs, and guidance.

**Acceptance criteria**

- [ ] Override validation uses registry.
- [ ] Registry includes docs/guidance fields.

### T4.3 — Generate `.portfolio-engine/manifest.json`

**Labels:** `task:feat`, `owner:agentic-ai`, `area:engine-core`, `agent:approved`

Generate consumer-local manifest with paths, active routes, override surfaces, content collections, package versions, and capabilities.

**Acceptance criteria**

- [ ] Manifest generated.
- [ ] Manifest includes paths/capabilities.
- [ ] Manifest does not include private content bodies.

### T4.4 — Define manifest privacy policy

**Labels:** `task:decision`, `owner:human-dev`, `area:safety`

Decide exactly what the manifest may include and what it must not include.

**Acceptance criteria**

- [ ] Privacy policy documented.
- [ ] Workflow-kit/admin-tools implications considered.
