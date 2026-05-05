# Release Workflow

portfolio-engine uses [Changesets](https://github.com/changesets/changesets) for version management and npm publishing.

## Normal release cycle

1. **During development** — every PR that changes a publishable package adds a changeset: `pnpm changeset`
2. **Changesets bot** — automatically opens a "Version Packages" PR accumulating all changesets
3. **Merge to main** — merging the version PR triggers `.github/workflows/release.yml`, which publishes all bumped packages to npm

### Critical: `[skip ci]` blocks npm publishing

GitHub Actions **does not run** on pushes whose **HEAD commit message/body** contains `[skip ci]` (case-insensitive). The Changesets CLI’s version commit can include that marker when `skipCI` is enabled for **version** commits.

This repo sets **`"commit": ["@changesets/cli/commit", { "skipCI": false }]`** in `.changeset/config.json` so `pnpm changeset version` commits **still trigger** the Release workflow.

If packages were version-bumped on `main` but never appeared on npm, check Actions for a missing Release run; you can re-run publishing via **Actions → Release → Run workflow** (`workflow_dispatch`).

## Packages published

- `@portfolio-engine/engine-core`
- `@portfolio-engine/editorial-theme`
- `@portfolio-engine/schema`
- `@portfolio-engine/admin-tools` _(when ready — Epic 7)_
- `@portfolio-engine/workflow-kit` _(when ready — Epic 8)_

## Required secrets

| Secret         | Where                            | Purpose              |
| -------------- | -------------------------------- | -------------------- |
| `NPM_TOKEN`    | GitHub repo → Settings → Secrets | Publishing to npm    |
| `GITHUB_TOKEN` | Auto-provided by Actions         | Creating version PRs |

## Patch reconciliation

When `agreni-site` applies a local patch to fix a bug before it's upstreamed, the patch tracking workflow (Epic 9) opens a PR in `portfolio-engine` automatically. When the fix ships in a new release, Epic 10 automation opens a cleanup PR in `agreni-site` to remove the patch.

See [../../docs/downstream/upgrade-path.md](../downstream/upgrade-path.md).
