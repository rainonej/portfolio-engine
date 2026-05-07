# Changesets (portfolio-engine)

This directory holds **pending** release notes. When `dev` is merged into `main`, CI runs `changeset version`, which **consumes** these files, bumps package versions, and merges the prose into each package’s `CHANGELOG.md`.

## Authoring

1. After your change lands on **`dev`**, run `pnpm changeset` (or `pnpm exec changeset add`) and follow the prompts.
2. Pick the correct semver bump for each affected `@portfolio-engine/*` package.
3. In the **summary body**, write a short human-facing description, then add consumer-facing migration text when needed (see below).

**Promotion flow:** feature branches → `dev` → `main`. Releases apply on **`main`** only. See [`docs/workflows/release-workflow.md`](../docs/workflows/release-workflow.md).

## Agent migration block (required when consumers are affected)

If your change touches **content shape**, **config keys**, **public imports**, **CSS variables**, **registry/manifest contracts**, or anything else a consumer repo must update, add a `#### Agent migration` section to the changeset body with a **checklist** (packages, consumer paths, imperative actions). Omit this section only when there is **no** consumer migration surface (internal refactors, tests, CI-only changes).

Full rules, multi-version reading order for agents, and a worked example: **[`docs/workflows/changelog-agent-migration.md`](../docs/workflows/changelog-agent-migration.md)**.

## Minimal template

Copy and edit (frontmatter package names and bump types must match your change):

```markdown
---
'@portfolio-engine/schema': patch
'@portfolio-engine/editorial-theme': patch
---

Short summary of what changed and why (human readers).

#### Agent migration

- **Packages:** …
- **Consumer paths:** … (e.g. `src/content/...`, `src/config/...`)
- **Actions:**
  - …
- **Supersedes:** … (optional; if this release overrides earlier migration advice)
```

Only `README.md` in this folder is ignored by the Release workflow’s “pending changesets” scan; all other `*.md` files here are treated as pending changesets.
