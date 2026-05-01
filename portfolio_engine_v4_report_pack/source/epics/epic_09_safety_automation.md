# Epic 9 — Contribution safety and GitHub automation

**Phase:** Phase 7  
**MVP relevance:** Post-MVP / parallel support  
**Labels:** `type:epic`, `area:safety`, `area:ci`, `source:human`

## Summary

Protect the upstream repo once consumers and their agents start contributing.

## Why this matters

The consumer-to-contributor flywheel only works if upstream PRs are generalized, safe, and reviewable.

## Tickets

### T9.1 — Reconcile existing CI/Copilot issues

**Labels:** `task:chore`, `owner:human-dev`, `area:ci`

Review issues #28, #29, #30, #36, #37 before creating new workflow issues.

**Acceptance criteria**

- [ ] Duplicates avoided.
- [ ] Existing issues linked or superseded intentionally.

### T9.2 — Add layer-boundary guard

**Labels:** `task:feat`, `owner:agentic-ai`, `area:safety`, `agent:approved`

Check PR diffs for private consumer content, media under packages, forbidden imports, and patch files submitted upstream.

**Acceptance criteria**

- [ ] Guard runs in CI.
- [ ] Maintainer override documented.

### T9.3 — Add AI review prompt/check

**Labels:** `task:chore`, `owner:agentic-ai`, `area:safety`, `agent:approved`

Prompt/check should ask whether the PR should have been config/content/context/registry instead of upstream code.

**Acceptance criteria**

- [ ] Prompt exists.
- [ ] Checklist references consumer-specific hacks and private data leakage.

### T9.4 — Add public-safe planner/Claude workflows

**Labels:** `task:feat`, `owner:agentic-ai`, `area:ci`, `agent:approved`

Automation must be gated and should not run untrusted implementation tasks automatically.

**Acceptance criteria**

- [ ] No untrusted auto-execution.
- [ ] `agent:approved` or maintainer approval required.
