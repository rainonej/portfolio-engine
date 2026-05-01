# Epic 2 — Governance, legal, and open-source contribution foundation

**Phase:** Phase 0  
**MVP relevance:** Parallel — not required for Backbone MVP runtime work  
**Products touched:** G  
**Labels:** `type:epic`, `area:governance`, `area:docs`, `source:human`

## Summary

Set the legal and contribution foundation for a real open-source project that welcomes AI-assisted and vibe-coded contributions while preserving maintainer control and upstream quality.

## Why this matters

The project is explicitly open source. Consumers may become contributors. That means the repo needs a license, AI contribution policy, security policy, PR template, and issue templates before outside contributions become noisy or risky.

## Tickets

### T0.1 — Decide license strategy

**Labels:** `task:decision`, `owner:human-dev`, `area:governance`

Decide whether to keep MIT, move to Apache-2.0, or dual-license MIT/Apache-2.0.

**Acceptance criteria**

- [ ] Decision recorded.
- [ ] LICENSE/package metadata follow-up created if needed.

### T0.2 — Add governance and AI contribution docs

**Labels:** `task:chore`, `owner:agentic-ai`, `area:governance`, `agent:approved`

Add `GOVERNANCE.md` and `AI_USAGE.md`.

**Acceptance criteria**

- [ ] Maintainer authority is clear.
- [ ] AI-assisted contributions are allowed but must be reviewed.
- [ ] Consumer-originated contributions are explicitly supported.

### T0.3 — Add citation, security, DCO, trademark, notice files

**Labels:** `task:chore`, `owner:agentic-ai`, `area:governance`, `agent:approved`

Add `CITATION.cff`, `SECURITY.md`, `DCO.md`, `TRADEMARK.md`, and `NOTICE` as appropriate.

**Acceptance criteria**

- [ ] Security reports do not go through public issues.
- [ ] Citation metadata is valid.
- [ ] DCO/sign-off expectations are documented.

### T0.4 — Add PR and issue templates

**Labels:** `task:chore`, `owner:agentic-ai`, `area:safety`, `agent:approved`

Templates must ask about target layer, downstream origin, AI usage, private data, changeset need, and whether content/config/registry would have sufficed.

**Acceptance criteria**

- [ ] PR template exists.
- [ ] Upstream feature request template exists.
- [ ] Temporary patch tracking template exists.
- [ ] Downstream-originated PR template exists.
