# Epic 0 — v5 meta roadmap, board reconciliation, and technical debt

**Phase:** Phase 0  
**MVP relevance:** Required prerequisite — single agreed path before implementation  
**Products touched:** G  
**Labels:** `type:epic`, `area:governance`, `source:human`

## Summary

Coordinate the v5 audit framing (Backbone MVP vs Product MVP, product tracks A–G, phases 0–11), reconcile the live GitHub board with this report, and maintain a visible technical debt register so scope stays honest.

## v5 audit notes (why v5 differs from v4)

- **Two MVP milestones:** Backbone MVP after Phase 3; Product MVP after Phase 4 (agreni-site + jordan-site as real products).
- **Product tracks A–G** map every epic to concrete products; see `source/sections/08_product_tracks_and_mvp.md`.
- **Epic renumbering:** 18 epics (00–17) follow phase order; filenames sort to render order in the HTML report.
- **Consumer sites promoted:** agreni-site and jordan-site are Phase 4 ★ Product MVP, not “after MVP” migration only.

## Technical debt register (known)

| Item | Notes |
| --- | --- |
| Hardcoded route metadata | Should move toward explicit registries (**Epic 10**). |
| Hardcoded supported component surfaces | Same — registry-driven override surfaces. |
| No real package build scripts | **Epic 3** / **Epic 4** — replace no-op builds. |
| Sparse automated tests | Add over time; not blocking audit narrative. |

## Why this matters

The live board and the report must not diverge. Acting on either alone risks duplicate or contradictory work.

## Tickets

### T0.1 — Create v5 branch and audit artifacts

**Labels:** `task:chore`, `owner:human-dev`, `area:governance`

**Acceptance criteria**

- [ ] Work proceeds on `feat/v5-audit-update` (or successor) from the agreed base branch.
- [ ] Report pack sources updated; `node scripts/build_report.mjs` regenerates HTML.

### T0.2 — Audit live GitHub board (was T0b.2 scope)

**Labels:** `task:research`, `owner:human-dev`, `area:governance`

List open issues; map to report epics; flag orphans, duplicates, gaps.

**Acceptance criteria**

- [ ] Each issue mapped or flagged.
- [ ] Gaps documented.

### T0.3 — Reconcile and update board (was T0b.3 scope)

**Labels:** `task:decision`, `owner:human-dev`, `area:governance`

Close stale issues, update labels/milestones, create missing tickets per agreed path.

**Acceptance criteria**

- [ ] Dispositions recorded.
- [ ] Phase ordering reflected on the board.

### T0.4 — Technical debt register visibility

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `agent:approved`

Keep debt register synced with reality (README or `docs/` pointer).

**Acceptance criteria**

- [ ] Debt items above tracked or superseded with rationale.
