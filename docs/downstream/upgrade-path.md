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

1. Check the [changelog](../../packages/editorial-theme/CHANGELOG.md) for breaking changes.
2. Bump the version in `agreni-site/package.json`.
3. Run `pnpm install`.
4. Run `pnpm check` and `pnpm build` to catch type errors early.
5. Test the site locally.

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
