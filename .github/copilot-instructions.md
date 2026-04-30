# Copilot instructions (portfolio-engine)

## Scope

This monorepo ships **`@portfolio-engine/*`** packages and a reference app under **`examples/demo-site/`**. Prefer small, focused changes; match existing patterns in the touched package.

## Reviews and follow-ups

- **Automatic Copilot code review** is enabled via **repository rulesets** for PRs into **`dev`** and **`epic/**`\*\* (GitHub Settings → Rules → Rulesets). That behavior is not defined in workflow YAML.
- After a review, **apply** inline suggestions or comment **`@copilot`** on the PR if you want the coding agent to push commits. There is no supported fully hands-off “review then auto-commit everything” mode.

## Quality bar

- Run **`pnpm lint`**, **`pnpm check`**, and **`pnpm --filter demo-site run build`** (or full **`pnpm build`**) before considering work done.
- Theme URLs: respect **`getBase()`** / **`resolveAssetUrl()`** for root-relative paths; do not prefix absolute `http(s)` links with `base`.

## Docs

Board and label conventions: **`docs/github-project-board.md`**, **`docs/project-management.md`**.
