# Copilot instructions (portfolio-engine)

Read [`AGENTS.md`](../AGENTS.md) first. That file is the source of truth for how agents work in this repo: package boundaries, safe/unsafe tasks, hard prohibitions, required checks, visual QA, PR expectations, and stop conditions.

This file adds Copilot-specific operational notes that supplement `AGENTS.md`.

## Code review

Automatic Copilot code review is intended to be configured via repository rulesets for PRs into `dev` and `epic/**`; it is not defined in workflow YAML. Until issue #36 is completed and the rulesets are verified, request Copilot review manually on each PR.

After a review, apply inline suggestions or comment `@copilot` on the PR to have the coding agent push commits. There is no supported fully hands-off "review then auto-commit everything" mode.

## PR workflow

- Do not merge directly from an agent session.
- Open PRs against `dev` unless a human explicitly requests a different base branch.
- After opening a PR, request review from `copilot-pull-request-reviewer` or trigger `@copilot review` before merge.
