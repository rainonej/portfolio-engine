# Release Workflow

portfolio-engine uses [Changesets](https://github.com/changesets/changesets) for version management and npm publishing.

## Normal release cycle

1. **During development** — every PR that changes a publishable package adds a changeset: `pnpm changeset`
2. **Changesets bot** — automatically opens a "Version Packages" PR accumulating all changesets
3. **Merge to main** — merging the version PR triggers `.github/workflows/release.yml`, which publishes all bumped packages to npm

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
