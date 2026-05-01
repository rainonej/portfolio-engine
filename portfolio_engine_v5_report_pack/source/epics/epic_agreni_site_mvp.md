# agreni-site Product MVP

**Phase:** Phase 4  
**MVP relevance:** ★ Required for Product MVP  
**Products touched:** C  
**Labels:** `type:epic`, `area:downstream`, `source:human`

## Summary

Deliver **agreni-site** as a clean private consumer repo on the target layout, consuming published engine packages (semver), with migrated content/config/assets and a structured context layer. Validates that the backbone supports a real nontechnical site-owner workflow.

## Why this matters

Product MVP is defined by two real products; agreni-site is the first. Success proves the engine and docs work outside the monorepo.

## Board mapping

- agreni-site GitHub issues #1–#7  
- profesional_site #219 (switch to semver packages) — coordinates with [Package publishing](#epic-package-publishing)

## Tickets

### Scaffold consumer layout

**Labels:** `task:feat`, `owner:agentic-ai`, `area:downstream`, `agent:approved`

Set up `src/config`, `src/content`, `src/context`, `src/overrides`, `public`, `.portfolio-engine`.

**Acceptance criteria**

- [ ] No upstream package source copied into the consumer repo.
- [ ] Site builds using installed packages (semver) or documented interim workspace exception.

### Migrate content, config, and assets

**Labels:** `task:content`, `owner:agentic-ai`, `area:downstream`, `agent:approved`

Move only consumer-owned files from predecessor repos.

**Acceptance criteria**

- [ ] No private data enters upstream portfolio-engine.
- [ ] Content renders correctly.

### Add structured context layer

**Labels:** `task:feat`, `owner:agentic-ai`, `area:downstream`, `agent:approved`

Create `site-owner.json`, `brand-voice.json`, and `agent-rules.md` as appropriate.

**Acceptance criteria**

- [ ] Context is structured and admin-ready.
- [ ] Agent rules are thin and repo-specific.

### Wire to published packages

**Labels:** `task:feat`, `owner:agentic-ai`, `area:downstream`, `agent:approved`

Align `package.json` with [Package publishing](#epic-package-publishing) publishing; target semver consumption for Product MVP.

**Acceptance criteria**

- [ ] Dependencies reference published versions unless an explicit documented exception exists.

### Verify build and preview

**Labels:** `task:chore`, `owner:agentic-ai`, `area:downstream`, `agent:approved`

**Acceptance criteria**

- [ ] Local build and preview succeed.
- [ ] Parity checklist vs pre-split behavior (preview/auth/admin) tracked.

### Reconnect secrets and deployments (human)

**Labels:** `task:chore`, `owner:human-dev`, `area:downstream`

Vercel/GitHub secrets and integrations — human-operated task.

**Acceptance criteria**

- [ ] Deployments and integrations documented as restored or intentionally deferred.
