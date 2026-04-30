# Contributing to portfolio-engine

## Prerequisites

- Node.js ≥ 18
- pnpm ≥ 9 (`npm install -g pnpm`)

## Local setup

```bash
git clone https://github.com/rainonej/portfolio-engine
cd portfolio-engine
pnpm install
```

## Two development modes

### Installed mode (normal consumption)

`agreni-site` installs `@portfolio-engine/*` packages from npm at a pinned semver version.

```bash
# In agreni-site
pnpm add @portfolio-engine/editorial-theme@0.1.0
```

### Local-dev mode (working across repos simultaneously)

Use `pnpm link` or `workspace:*` references in `agreni-site`'s `package.json` to point directly at local packages:

```json
{
  "dependencies": {
    "@portfolio-engine/editorial-theme": "link:../portfolio-engine/packages/editorial-theme"
  }
}
```

Changes in `portfolio-engine` packages reflect immediately in `agreni-site` without publishing.

## Making changes

1. Create a branch: `task/<issue-number>-<slug>`
2. Make changes in the relevant `packages/` directory
3. Add a changeset: `pnpm changeset`
4. Open a PR targeting `dev` (or an `epic/*` branch if part of a larger epic)

## Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

- `pnpm changeset` — add a changeset describing your change
- `pnpm changeset version` — bump versions and update changelogs (done by the release PR bot)
- `pnpm release` — publish packages to npm (runs in CI on merge to `main`)

## PR conventions

```
task/<N>-<slug>  →  epic/<N>-<slug>  →  dev  →  main
```

- One logical change per PR
- All PRs must include a changeset (for publishable packages)
- Check that `pnpm lint`, `pnpm check`, and `pnpm build` pass locally before opening a PR

## Versioning policy

- Follows semantic versioning
- `engine-core` and `schema` have stable APIs once v1 is published
- `admin-tools` and `workflow-kit` are experimental in v1 — minor bumps may include breaking changes
- We do not accept third-party theme PRs in v1; this project is intentionally first-party

## Lint and format

- **`pnpm lint`** — ESLint on TypeScript sources under `packages/**` and `examples/**` (from repo root).
- **`pnpm lint:fix`** — Apply ESLint fixes where safe.
- **`pnpm format`** — Prettier check on Markdown, YAML, JSON, and config files.
- **`pnpm format:write`** — Write Prettier formatting.

CI **fails** on lint/format violations; it does not auto-commit fixes. Fix locally before pushing.

## GitHub Project and labels

Issue and board conventions (Status field, views, label taxonomy) live in **[docs/github-project-board.md](docs/github-project-board.md)** and **[docs/project-management.md](docs/project-management.md)**. Work is tracked on **[Project 2](https://github.com/users/rainonej/projects/2)**.

## Copilot code review

Automatic **Copilot code review** on pull requests is configured with **repository rulesets** (GitHub **Settings → Rules → Rulesets**): target base branches **`dev`** and **`epic/**`**, rule **Automatically request Copilot code review\*\*. That is a product setting, not a file in this repo. See GitHub’s docs: [Configure automatic code review](https://docs.github.com/copilot/how-tos/use-copilot-agents/request-a-code-review/configure-automatic-review).

Copilot does **not** silently commit every suggestion after a review. Use **Apply suggestion** on the PR, or comment **`@copilot`** on the PR to ask the coding agent to push follow-up commits. When Copilot pushes, GitHub may require **Approve and run workflows** unless you change [Copilot cloud agent / Actions settings](https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/reviewing-a-pull-request-created-by-copilot).

Repository guidance for Copilot lives in **[`.github/copilot-instructions.md`](.github/copilot-instructions.md)**.

## Support

This project is maintained by Jordan Rainone. Issues welcome for bugs and feature requests; see the issue templates.
