# Copilot instructions (portfolio-engine)

## Scope

This monorepo ships **`@portfolio-engine/*`** packages and a reference app under **`examples/demo-site/`**. Prefer small, focused changes; match existing patterns in the touched package.

## Reviews and follow-ups

- **Automatic Copilot code review** is enabled via **repository rulesets** for PRs into **`dev`** and **`epic/**`\*\* (GitHub Settings → Rules → Rulesets). That behavior is not defined in workflow YAML.
- After a review, **apply** inline suggestions or comment **`@copilot`** on the PR if you want the coding agent to push commits. There is no supported fully hands-off “review then auto-commit everything” mode.

## Agent PR workflow

- Do not merge directly from an agent session.
- Open PRs against **`dev`** unless a human explicitly requests a different base branch.
- After opening a PR, request review from **`copilot-pull-request-reviewer`** (or trigger `@copilot review`) before merge.

## Quality bar

- Run **`pnpm lint`**, **`pnpm check`**, and **`pnpm --filter demo-site run build`** (or full **`pnpm build`**) before considering work done.
- Theme URLs: respect **`getBase()`** / **`resolveAssetUrl()`** for root-relative paths; do not prefix absolute `http(s)` links with `base`.

## Docs

Board and label conventions: **`docs/github-project-board.md`**, **`docs/project-management.md`**.

## Downstream agent tooling

When editing downstream setup docs, keep the setup model aligned with:

- `docs/downstream/setup-with-claude.md`
- `docs/downstream/new-site-setup.md`
- `docs/downstream/setup.sh`
- `docs/downstream/setup.ps1`
- `docs/downstream/agent-tooling.md`

Do not introduce a parallel setup flow. Prefer adding small numbered scripts under `docs/downstream/scripts/`.

## Vercel MCP vs Vercel Plugin

Use Vercel MCP for live Vercel state:

- deployments
- build logs
- runtime logs
- project settings
- domains
- environment variable names
- protected preview URLs

Use the Vercel Plugin for Vercel-aware implementation guidance:

- Astro/Vercel adapter setup
- build commands
- env-var conventions
- preview vs production behavior
- deployment docs
- Vercel best practices

Prefer read-only MCP operations first.

Do not mutate production Vercel settings without explicit human confirmation.

## Context7

Use Context7 for current package docs and API examples before implementing package-specific setup involving Astro, Vercel, Tailwind, Playwright, TypeScript, or OAuth libraries.

## Visual QA

For UI/design changes, add or update docs that require browser-based verification with Playwright MCP or Playwright CLI.

Do not treat code inspection as visual verification.
