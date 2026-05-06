# Repository Audit — May 6, 2026

This audit was run across the full monorepo with a focus on build correctness, tooling consistency, and documentation clarity.

## What was checked

- Workspace linting (`pnpm lint`)
- Workspace build + checks (`pnpm check`)
- Root script inventory in `package.json`
- Editorial theme profile API consistency across pages/utilities
- Contributor command discoverability (`test`, `typecheck`, `check`)

## Issues found and resolved

### 1) Broken root npm script reference

Root `package.json` previously included:

- `build:audit-report-shells`: `node portfolio_engine_v3_audit_pack/write-report-shells.mjs`

That path does not exist.

**Resolution:** removed the script.

### 2) Inconsistent bio-field strategy across editorial theme pages

Different pages mixed `shortBio`, `summary`, `longBio`, and deprecated legacy-string fallback behavior.

**Resolution:** one biography model everywhere (see `ProfilePersonSchema` + `ProfilePerson` in editorial-theme):

- `shortBio` for hero/meta
- `summary` as second hero/meta fallback
- `longBio[]` for about/resume paragraphs
- the old `bio` string is not in the Zod schema (`.strict()` rejects it). The TS type keeps `@deprecated bio?` so agents get a warning if code still references it; the theme never reads it.

### 3) Missing conventional root scripts

The repo lacked root-level `typecheck`/`test` commands, which can surprise contributors.

**Resolution:** added:

- `typecheck`: `pnpm -r run check`
- `test`: `pnpm -r --if-present run test`

## Additional noteworthy findings (easy to overlook)

1. `packages/workflow-kit` still has placeholder scripts (`build`/`dev` output `not yet configured`), which can look like a successful workflow without producing artifacts.
2. CI/checks currently pass under Node 22 in this environment, but the repo requires Node `>=24 <25`; contributors may miss this mismatch unless they read warnings.
3. Several docs files describe historical/report-pack context; there is still value in a short “current vs archived docs” index if the repo keeps growing.
