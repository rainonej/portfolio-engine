# Upgrade Path

## One-click upgrade (VS Code task)

If you seeded agent tooling during setup, a **VS Code task** is already available at `.vscode/tasks.json`.

Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`), run **Tasks: Run Task**, and choose **Upgrade portfolio-engine packages**. The task discovers every `@portfolio-engine/*` entry in your `package.json` and upgrades each to `@latest`.

If you skipped agent-tooling seeding, copy the template manually:

```bash
mkdir -p .vscode
cp docs/downstream/templates/vscode/tasks.json .vscode/tasks.json
```

Or run the upgrade script directly:

```bash
# macOS / Linux
bash docs/downstream/scripts/upgrade-portfolio-engine.sh

# Windows
./docs/downstream/scripts/upgrade-portfolio-engine.ps1
```

To upgrade to the `@next` pre-release dist-tag instead:

```bash
DIST_TAG=next bash docs/downstream/scripts/upgrade-portfolio-engine.sh
# Windows: ./docs/downstream/scripts/upgrade-portfolio-engine.ps1 -DistTag next
```

## Normal upgrades

### Bump all `@portfolio-engine/*` packages together

Consumers should keep **`@portfolio-engine/schema`**, **`@portfolio-engine/engine-core`**, **`@portfolio-engine/editorial-theme`**, and (if installed) **`@portfolio-engine/admin-tools`** on **compatible versions**—the integration and virtual modules assume matching contracts.

From a consumer repo:

```bash
pnpm up "@portfolio-engine/*@latest"
pnpm install
pnpm run build
pnpm run check
```

Or use the VS Code / script flows in [One-click upgrade](#one-click-upgrade-vs-code-task) so every workspace dependency on `@portfolio-engine/*` moves in lockstep.

1. Check the [changelog](../../packages/editorial-theme/CHANGELOG.md) (and `engine-core` / `schema` / `admin-tools` changelogs) for breaking changes.
2. Bump versions in the consumer `package.json` (or use the command above).
3. Run `pnpm install`.
4. Run `pnpm check` and `pnpm build` to catch type errors early.
5. Test the site locally.

### AI / coding agents

When `@portfolio-engine/*` versions change (or the user asks to upgrade engine packages), agents should **not** infer new APIs from memory.

1. For **each** `@portfolio-engine/*` package in the consumer `package.json`, read that package’s **`CHANGELOG.md`** for every release **after** the version the site previously used **through** the version being installed, in **ascending semver order** (oldest first). After `pnpm install`, use `node_modules/@portfolio-engine/<pkg>/CHANGELOG.md`, or read the same file on GitHub from [`rainonej/portfolio-engine`](https://github.com/rainonej/portfolio-engine) (paths under `packages/<pkg>/CHANGELOG.md`).
2. Merge all **`#### Agent migration`** sections from that version window into **one** checklist before editing consumer files. If instructions conflict between releases, **follow the newer release**. Prefer explicit “Supersedes” lines in the changelog when present.
3. Apply migration steps, then run `pnpm check` and `pnpm build`.

Maintainers document the shape of **Agent migration** notes in the upstream repo: [`docs/workflows/changelog-agent-migration.md`](../workflows/changelog-agent-migration.md). Consumer repos that only vendor `docs/downstream/` can open that link on GitHub.

**Template refresh:** If this site was set up before upstream added the **Package upgrades** instructions to [`templates/agent/`](templates/agent/) (`CLAUDE.md`, `copilot-instructions.md`), merge that new section from the upstream portfolio-engine repo into your root `CLAUDE.md` and `.github/copilot-instructions.md` if you rely on agents for bumps. The setup seed scripts (`07-seed-agent-tooling.*`) only create those files when they are missing.

## Patch tracking

When `agreni-site` needs a fix that isn't yet in a portfolio-engine release:

1. Apply the fix locally in `agreni-site` using a patch file.
2. Open an upstream PR in `portfolio-engine` with the same fix.
3. Record the patch in the tracking artifact (Epic 9 — `engine_patches` in `package.json` or a dedicated tracking file).
4. When the fix ships in a portfolio-engine release, upgrade and remove the patch.

Epic 10 automation watches for upstream releases and opens a cleanup PR in `agreni-site` automatically when a patched issue is resolved.

## Breaking changes

`engine-core` and `schema` follow strict semver — breaking changes only in major versions.
`editorial-theme` follows semver — override surface removals or renames are breaking changes.
`admin-tools` and `workflow-kit` are experimental in v1 — minor bumps may include breaking changes.
