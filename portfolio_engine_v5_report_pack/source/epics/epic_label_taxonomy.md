# Label taxonomy and area/agent standards

**Phase:** Phase 0 (immediately usable; does not block other phases)  
**MVP relevance:** Phase 0 prerequisite — required before AI automation workflows proceed safely  
**Products touched:** G  
**Labels:** `type:epic`, `area:governance`, `area:docs`, `source:human`

## Summary

Standardize the two label groups that are prerequisites for AI-assisted work: `area:*` (package/domain axis) and `agent:*` (approval and automation state). Deprecate the provider-specific legacy “ready” label and replace it with the provider-neutral `agent:approved`.

The full label taxonomy (source, task-kind, owner, lifecycle, MVP labels) is deferred to a future epic. This epic covers only what is needed now.

## Why this matters

Without consistent `area:*` labels, it is impossible to filter issues by package or domain — critical for any agent or automation that needs to act on a scoped set of issues. Without `agent:*` labels, there is no machine-readable approval gate between human oversight and AI execution.

The legacy provider-specific ready label is being deprecated because the workflow-kit is provider-neutral Python/MCP tooling that should support Claude, Copilot, OpenHands, and future agents equally.

## Label groups to standardize

### area labels

One primary `area:*` label per issue. Epics may carry multiple if genuinely cross-cutting.

```text
area:schema
area:engine-core
area:editorial-theme
area:admin-tools
area:workflow-kit
area:demo-site
area:consumer-layout
area:consumer-registry
area:docs
area:governance
area:safety
area:ci
area:release
area:downstream
area:vercel
```

### agent labels

```text
agent:approved          — human has approved an AI agent to act on this issue
agent:needs-human-review — agent may plan/summarize but must not implement
agent:blocked           — agent cannot continue without human input
```

Deprecate: legacy ready label (alias to `agent:approved` during transition period, then remove).

## Tickets

### Create area and agent labels in GitHub

**Labels:** `task:chore`, `owner:human-dev`, `area:governance`

Create all `area:*` and `agent:*` labels in the GitHub repo. Mark the legacy ready label as deprecated (rename or add deprecation note to description).

**Acceptance criteria**

- [ ] All 15 `area:*` labels exist in GitHub.
- [ ] `agent:approved`, `agent:needs-human-review`, `agent:blocked` exist in GitHub.
- [ ] Legacy ready label is deprecated or aliased.
- [ ] Label colors are consistent within each group.

### Document area and agent label rules

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `agent:approved`

Update or create `docs/issue-labels.md` with rules for `area:*` and `agent:*` labels. Include examples for runtime, workflow-kit, admin-tools, consumer-registry, and downstream issues.

**Acceptance criteria**

- [ ] `docs/issue-labels.md` documents all `area:*` labels with meanings.
- [ ] `docs/issue-labels.md` documents all `agent:*` labels with meanings.
- [ ] Examples given for each major package area.
- [ ] Legacy ready label is listed as deprecated with migration path.

### Retag open issues with correct area and agent labels

**Labels:** `task:chore`, `owner:agentic-ai`, `area:governance`, `agent:approved`

Review all open issues. Apply the correct primary `area:*` label to each. Apply `agent:approved` to issues that were previously tagged with the legacy ready label and are still scoped for agent execution.

**Acceptance criteria**

- [ ] Every open issue has exactly one primary `area:*` label.
- [ ] All legacy ready labels are replaced with `agent:approved` or another appropriate `agent:*` label.
- [ ] Issues that are not agent-ready have no `agent:*` label or have `agent:needs-human-review`.
