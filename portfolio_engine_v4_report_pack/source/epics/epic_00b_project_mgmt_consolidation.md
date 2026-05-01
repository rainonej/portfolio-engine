# Epic 0b — Board reconciliation and project management

**Phase:** Phase 0b (immediately after governance; before any implementation)
**MVP relevance:** Required prerequisite — ensures the team has a single agreed path before committing effort
**Labels:** `type:epic`, `area:governance`, `source:human`

## Summary

Before any implementation begins, reconcile the live GitHub board with the v4 audit report. Tickets on the board may be stale, differently scoped, or duplicated relative to what the report describes. This epic produces a single authoritative path forward.

## Why this matters

The v4 report was built from the existing codebase and design intent, but the live GitHub board reflects work that has been attempted, partially completed, or re-scoped in the meantime. Acting on either source alone risks duplicated effort or contradictory decisions. The output of this epic — a cleaned and reconciled board — is the prerequisite for all subsequent phases.

## Tickets

### T0b.1 — Audit live GitHub board

**Labels:** `task:research`, `owner:human-dev`, `area:governance`

List all open issues on the GitHub board. For each issue, map it to the closest report epic or section. Flag orphans (no matching epic), duplicates (same work tracked twice), and gaps (report epics with no board representation).

**Acceptance criteria**

- [ ] All open issues are listed with their current labels.
- [ ] Each issue is mapped to a report epic or flagged as orphan/stale.
- [ ] Gaps between board and report are identified.
- [ ] Summary document or comment exists for handoff.

### T0b.2 — Reconcile and decide path forward

**Labels:** `task:decision`, `owner:human-dev`, `area:governance`

For each mismatch identified in T0b.1, make a decision: close the board issue, update the report epic, split or merge scope, or add a missing ticket. Produce an agreed path that both the report and the board reflect.

**Acceptance criteria**

- [ ] Every orphan/stale issue has a disposition (close, update, or keep with rationale).
- [ ] Every report epic has at least one board issue or a decision to defer.
- [ ] Phase ordering from the report is validated or adjusted.
- [ ] Decision summary is written (comment, doc, or board milestone description).

### T0b.3 — Update GitHub board to reflect agreed path

**Labels:** `task:chore`, `owner:agentic-ai`, `area:governance`, `agent:approved`

Execute the decisions from T0b.2: close stale issues, update labels and milestones, create missing issues, and add cross-references between related issues and epics.

**Acceptance criteria**

- [ ] Stale/closed issues are closed with a closing comment.
- [ ] All remaining open issues have correct `area:*` and `agent:*` labels.
- [ ] Missing issues from the report are created with correct labels and acceptance criteria.
- [ ] Board milestone or project view reflects current phase ordering.
