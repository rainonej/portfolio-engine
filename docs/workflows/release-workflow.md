# Release workflow

portfolio-engine uses [Changesets](https://github.com/changesets/changesets) for versioning and npm publishing. Promotion stays **feature branches → `dev` → `main`** (squash merge is fine). Maintainers ship by merging **`dev` into `main`**; CI applies versions and publishes—there is no manual “Version packages” PR step.

## Ship checklist

1. Confirm `.changeset/*.md` files are on **`dev`** before promotion (see **Squash merges and changesets** below).
2. Open and merge a **`dev` → `main`** PR when ready to release.
3. Wait for **Actions → Release** on `main`:
   - First run with pending changesets: **`changeset version`** commits are pushed to `main`, then the workflow ends without publishing.
   - Next run (triggered by that push): **build** + **`pnpm release`** (`changeset publish`) publishes to npm when versions are new.
4. Confirm packages on npm (`npm view @portfolio-engine/<pkg> version`) after green Release runs.
5. **Sync main → dev**: after each successful Release, **Sync main into dev** merges `main` into `dev` so version bumps and changelogs flow back. Resolve conflicts locally if that job fails.

Manual rescue: **Actions → Release → Run workflow** (`workflow_dispatch`) on `main` re-runs versioning logic (if changesets remain) or publish (when none remain).

If **Apply changesets** fails with a **non-fast-forward** push, something else updated `main` while the job ran. The workflow now **resets to `origin/main` before versioning** and **rebases version commits before push**; re-run Release once `main` is calm.

The **Promote dev → main** VS Code task (`scripts/promote-dev-to-main.*`) merges the promotion PR and then **queues `Release` via `workflow_dispatch`**, so the npm publish phase always runs even when the automated `RELEASING` push does not start a follow-up workflow (default `GITHUB_TOKEN` limitation).

**Git tags:** `changeset publish` creates tags like `@portfolio-engine/schema@0.3.0`. The **Publish to npm** job uses **`contents: write`** so those tags can be pushed. After a release, refresh locally with `git fetch origin main --tags` if Git Graph does not show new tags.

## What runs on `main` (`.github/workflows/release.yml`)

Two-phase behavior:

| Phase   | Trigger                                                                      | What happens                                                                                                                                                                   |
| ------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Version | Push / dispatch on `main`, pending `.changeset/*.md` (excluding `README.md`) | Sync `HEAD` to remote tip, `pnpm exec changeset version`, lockfile refresh (`pnpm install --no-frozen-lockfile` + lockfile commit if needed), **rebase onto remote**, **push** |
| Publish | Next push on `main` when no pending changesets                               | `pnpm build`, verify `dist/`, then **`pnpm release`** with `NODE_AUTH_TOKEN`                                                                                                   |

`changeset publish` no-ops when local versions already match the registry.

Do **not** run `changeset version` locally for routine releases; CI owns version commits on `main`.

## Branch protection and bot pushes

The default **`GITHUB_TOKEN`** often **cannot push** to protected `main`, even with `permissions: contents: write`.

**Recommended:** add repository **Ruleset bypass** for **GitHub Actions** (narrowly if your plan allows), **or** store a **`RELEASE_BOT_TOKEN`** secret (fine-grained PAT or GitHub App installation token with **contents: write** on this repo). The Release workflow uses `RELEASE_BOT_TOKEN` when set; otherwise it falls back to `GITHUB_TOKEN`.

Use the same bypass pattern for **`dev`** if **Sync main into dev** must push merge commits through protection.

## Critical: `[skip ci]` blocks Actions

GitHub Actions skips workflows when the **HEAD** commit message/body contains `[skip ci]` (case-insensitive).

This repo sets **`"commit": ["@changesets/cli/commit", { "skipCI": false }]`** in `.changeset/config.json` so automated version commits **still trigger** the Release workflow.

## Squash merges and changesets

Squash-merging **`dev` → `main`** normally keeps `.changeset/*.md` files as long as they exist on the **`dev`** tip you squash. If the promotion PR omits those files (or `dev` never had them), the Release workflow will not version—verify the squash result includes `.changeset/` before merging.

## PR guard on `dev`

`.github/workflows/changeset-pr-guard.yml` runs on PRs targeting **`dev`**. File detection uses `git diff` **`base...head`** (merge-base range), so only changes introduced by the PR count—not unrelated drift on `dev`. If that scoped diff touches **`packages/`**, the PR must either:

- add or modify a **`.changeset/*.md`** entry (excluding `README.md`; config-only edits do not satisfy the guard), or
- carry the **`skip-changeset`** label (explicit opt-out).

## Packages published

- `@portfolio-engine/engine-core`
- `@portfolio-engine/editorial-theme`
- `@portfolio-engine/schema`
- `@portfolio-engine/admin-tools` _(when ready — Epic 7)_
- `@portfolio-engine/workflow-kit` _(when ready — Epic 8)_

## Required secrets

| Secret              | Where                                                      | Purpose                                                 |
| ------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| `NPM_TOKEN`         | Repo → Settings → Secrets and variables → Actions          | Publish to npm (automation token)                       |
| `RELEASE_BOT_TOKEN` | Same (optional but usually required on protected branches) | Push version commits to `main` and sync merges to `dev` |
| `GITHUB_TOKEN`      | Provided by Actions                                        | Fallback when `RELEASE_BOT_TOKEN` is not set            |

## Fork / dry-run verification

On a fork (with test npm scope or `publishConfig`/`--dry-run` adjustments if you need zero publishes):

1. Add **`NPM_TOKEN`** and **`RELEASE_BOT_TOKEN`** (or relax branch protection) so CI can push `main`.
2. Land a patch changeset on **`dev`**, merge **`dev` → `main`** (squash OK).
3. Confirm **Release** run #1 pushes version/changelog commits and **does not** publish yet.
4. Confirm **Release** run #2 builds and publishes (or no-ops if versions match registry).
5. Inspect commit messages: automated version commits must **not** contain `[skip ci]` (see `.changeset/config.json`).
6. Optionally run `npm view @portfolio-engine/<pkg> version` against your published tags.

## Patch reconciliation

When `agreni-site` applies a local patch before upstream lands the fix, patch tracking (Epic 9) opens a PR here. After a release ships, Epic 10 automation opens cleanup in `agreni-site`.

See [../downstream/upgrade-path.md](../downstream/upgrade-path.md).
