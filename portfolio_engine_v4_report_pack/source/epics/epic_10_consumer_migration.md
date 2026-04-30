# Epic 10 — Migrate agreni-site and jordan-site to clean consumer repos

**Phase:** After MVP  
**MVP relevance:** Proves MVP, but should wait until runtime is stable  
**Labels:** `type:epic`, `area:downstream`, `source:human`

## Summary

Create private consumer repos that consume the runtime packages without copying upstream source.

## Why this matters

This is the practical payoff of the backbone. The private sites should own only content/config/context/assets/local overrides, while the reusable engine remains upstream.

## Tickets

### T10.1 — Create or finalize private consumer repos

**Labels:** `task:chore`, `owner:human-dev`, `area:downstream`

Create/finalize `agreni-site` and `jordan-site` as private repos.

**Acceptance criteria**

- [ ] Repo visibility confirmed.
- [ ] Access configured.

### T10.2 — Scaffold target consumer layout

**Labels:** `task:feat`, `owner:agentic-ai`, `area:downstream`, `claude-ready`

Set up `src/config`, `src/content`, `src/context`, `src/overrides`, `public`, `.portfolio-engine`.

**Acceptance criteria**

- [ ] No package source copied.
- [ ] Site builds using installed/linked packages.

### T10.3 — Migrate private content/config/assets

**Labels:** `task:content`, `owner:agentic-ai`, `area:downstream`, `claude-ready`

Move only consumer-owned files from predecessor repos.

**Acceptance criteria**

- [ ] No private data enters upstream portfolio-engine.
- [ ] Content renders correctly.

### T10.4 — Add structured context

**Labels:** `task:feat`, `owner:agentic-ai`, `area:downstream`, `claude-ready`

Create `site-owner.json`, `brand-voice.json`, and `agent-rules.md`.

**Acceptance criteria**

- [ ] Context is structured and admin-ready.
- [ ] Agent rules are thin and repo-mode-specific.

### T10.5 — Optional MCP setup

**Labels:** `task:chore`, `owner:human-dev`, `area:workflow-kit`

Add `.mcp.json` once workflow-kit exists.

**Acceptance criteria**

- [ ] Claude can discover tools.
- [ ] No manual terminal-command workflow required.
