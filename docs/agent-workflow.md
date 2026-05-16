# Agent workflow

Portfolio Engine is designed for reviewable AI-assisted development.

The goal is not "AI can do everything." The goal is to make scoped implementation cheaper while keeping human review, architecture, accessibility, and maintainability central.

## Standard flow

1. A user, maintainer, or site owner opens an issue.
2. The issue describes the need, context, examples, and acceptance criteria.
3. A maintainer classifies it by source, owner, risk, and area.
4. If narrow and safe, it may be labeled agent-ready.
5. An AI agent or human contributor creates a branch and PR.
6. CI and build checks run.
7. Visual QA runs for UI changes.
8. A human reviews before merge.
9. Reusable improvements land in the shared engine.

## Issue ownership

Suggested owner labels:

- `owner:site-owner` — content, approval, or product/taste decision;
- `owner:simple-ai` — mechanical, narrow, well-specified task;
- `owner:agentic-ai` — multi-file or exploratory task still approved for agent execution;
- `owner:human-dev` — requires human judgment, credentials, UI access, architecture decision, or security review.

Every task should have exactly one owner label.

## Agent readiness

A good agent-ready issue has:

- one clear outcome;
- acceptance criteria;
- target layer;
- affected files or package;
- non-goals;
- validation commands;
- visual QA routes if applicable;
- clear stop conditions.

Bad agent issue:

> Make the site better.

Good agent issue:

> On the demo-site homepage, replace the primary CTA text with "Read the vision" linking to `/vision`, and add a secondary CTA "See the workflow" linking to `/workflow`. Do not add booking/scheduling CTAs. Run `pnpm --filter demo-site check` and visually inspect `/` on mobile and desktop.

## Safe for agents

- docs edits;
- small UI copy changes;
- scoped layout fixes;
- test/check additions;
- issue-template improvements;
- agent-prompt improvements;
- small downstream content/config changes;
- narrow component variants behind existing contracts.

## Not safe without human approval

- dependency changes;
- schema changes;
- package export changes;
- broad refactors;
- security-sensitive code;
- auth/admin changes;
- governance/license/security changes;
- release/publishing changes;
- production Vercel mutations;
- changes that affect all consumers.

## PR review checklist

A reviewer should check:

- Is the target layer correct?
- Is any private downstream data included?
- Are contracts changed?
- Are docs updated?
- Did checks run?
- Was visual QA needed and performed?
- Is the change reusable enough for upstream?
- Is AI assistance disclosed when material?
- Is the PR small enough to review?

## Human accountability

A human owns every merged PR.

AI assistance does not remove responsibility for correctness, licensing, security, accessibility, or maintainability.
