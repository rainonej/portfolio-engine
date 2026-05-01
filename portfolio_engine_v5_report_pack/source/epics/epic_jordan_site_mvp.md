# jordan-site Product MVP

**Phase:** Phase 4  
**MVP relevance:** ★ Required for Product MVP  
**Products touched:** D  
**Labels:** `type:epic`, `area:downstream`, `source:human`

## Summary

Deliver **jordan-site** as a clean private consumer repo on the target layout, with fresh content/config/context appropriate to Jordan’s brand and goals, consuming published packages. Validates that the engine is not overfit to a single consumer’s use case.

## Why this matters

Two distinct products at Product MVP reduce the risk that the backbone only works for one site shape or content model.

## Tickets

### Scaffold consumer layout

**Labels:** `task:feat`, `owner:agentic-ai`, `area:downstream`, `agent:approved`

Set up `src/config`, `src/content`, `src/context`, `src/overrides`, `public`, `.portfolio-engine`.

**Acceptance criteria**

- [ ] No upstream package source copied.
- [ ] Site builds using installed packages (semver) or documented interim exception.

### Create content, config, and context

**Labels:** `task:content`, `owner:agentic-ai`, `area:downstream`, `agent:approved`

Author consumer-owned files distinct from agreni-site’s migration path.

**Acceptance criteria**

- [ ] Brand and editorial goals reflected without copying private Agreni-specific assets inappropriately.
- [ ] Content renders correctly.

### Wire to published packages

**Labels:** `task:feat`, `owner:agentic-ai`, `area:downstream`, `agent:approved`

**Acceptance criteria**

- [ ] `package.json` uses semver dependencies for engine packages at Product MVP, consistent with [Package publishing](#epic-package-publishing).

### Verify build and preview

**Labels:** `task:chore`, `owner:agentic-ai`, `area:downstream`, `agent:approved`

**Acceptance criteria**

- [ ] Local build and preview succeed.

### Optional MCP setup (post–workflow-kit)

**Labels:** `task:chore`, `owner:human-dev`, `area:workflow-kit`, `mvp:post`

Add `.mcp.json` when workflow-kit is available.

**Acceptance criteria**

- [ ] Documented optional path; not blocking Product MVP.
