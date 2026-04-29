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
- Check that `pnpm check` and `pnpm build` pass locally before opening a PR

## Versioning policy

- Follows semantic versioning
- `engine-core` and `schema` have stable APIs once v1 is published
- `admin-tools` and `workflow-kit` are experimental in v1 — minor bumps may include breaking changes
- We do not accept third-party theme PRs in v1; this project is intentionally first-party

## Support

This project is maintained by Jordan Rainone. Issues welcome for bugs and feature requests; see the issue templates.
