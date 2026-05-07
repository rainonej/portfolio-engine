# Changelog: Agent migration notes

Consumer repos and coding agents need **task-shaped** instructions when `@portfolio-engine/*` releases change content shape, config keys, imports, CSS variables, or integration entrypoints. This document defines how maintainers add those notes so they flow from **Changesets** into each package **`CHANGELOG.md`**.

## When to write Agent migration notes

Add an **Agent migration** block whenever a changeset can affect **consumer** repos:

- Content collection fields, Zod schemas mirrored in `src/content/`, or frontmatter keys
- `src/config/*.json` keys or `theme.json` / `site.json` shape
- Public import paths (e.g. integration moved out of package root)
- CSS variables, design tokens, or override surfaces agents might edit
- Registry or manifest contracts

**Skip** the block for internal-only changes (refactors, tests, CI) with **no** consumer-visible contract change.

## Where it appears

Write the block in the **body** of the same `.changeset/<name>.md` file as the summary. After `pnpm exec changeset version`, that text is merged into the relevant package(s) `CHANGELOG.md` under the new version.

### Format (required for consistency)

1. A short **human-facing** summary (what shipped and why).
2. A markdown heading **`#### Agent migration`** (level 4) so authors and agents can grep for it.
3. Under that heading, use **bullet checklists**, not prose paragraphs:
   - **Packages:** list affected `@portfolio-engine/*` packages.
   - **Consumer paths:** glob-style or concrete paths in a typical consumer repo (e.g. `src/content/profile/**/*.md`, `src/config/theme.json`), not only paths inside `packages/`.
   - **Actions:** imperative steps (remove field `bio`; add `shortBio`, `summary`, `longBio`; map old text to new fields with a one-line rule).
   - **Supersedes (optional):** if this release overrides earlier migration advice, add one line: `Supersedes: <short description of obsolete guidance>` so multi-version readers keep the latest intent only.

Do not rely on vague bullets like “update profile schema” without paths and field names.

## Multi-version upgrades (humans and agents)

When jumping several versions (e.g. `0.4.x` → `0.5.y`):

1. For **each** `@portfolio-engine/*` dependency you bump, open that package’s `CHANGELOG.md` (from `node_modules/@portfolio-engine/<pkg>/CHANGELOG.md` after install, or from the [upstream repo](https://github.com/rainonej/portfolio-engine)).
2. Collect every **version section** with a semver **strictly greater** than the version you had **through** the version you installed, in **ascending semver order** (oldest release notes first).
3. Build **one** merged checklist from all **Agent migration** blocks in that window.
4. If two blocks conflict, **the newer release wins**—drop or amend steps that older blocks implied. Use explicit **Supersedes** lines when you know a later release reverses earlier guidance.

This avoids “do X in vN, undo X in vN+1” double work when the agent merges instructions before editing files.

## Worked example (schema 0.5.0–style)

The following is **illustrative** text in the preferred shape (profile field split and integration import). Adapt to each real changeset.

```markdown
Refine profile copy fields and strict validation for person content.

#### Agent migration

- **Packages:** `@portfolio-engine/schema`, `@portfolio-engine/editorial-theme` (and `@portfolio-engine/admin-tools` if the site uses admin UI for the same model).
- **Consumer paths:** `src/content/profile/**/*.{md,mdx}` (or your collection path for person/profile entries); any local Zod or TypeScript mirroring `ProfilePerson`.
- **Actions:**
  - Remove frontmatter/content field **`bio`** wherever present.
  - Add **`shortBio`** (short lead), **`summary`** (one-line or card summary), and **`longBio`** (longer body). Split the old `bio` text across these three using judgment: put the essence in `shortBio`/`summary`, detail in `longBio`.
  - Ensure content validates against the published `ProfilePerson` schema (run `pnpm check` / `pnpm build`).
- **Imports:** In `astro.config.*`, import the Astro integration from `@portfolio-engine/editorial-theme/integration` (not the package root). Do not import `editorialTheme` from `@portfolio-engine/editorial-theme` root in SSR bundles.
- **CSS (if custom styles):** Legacy variables `--ink`, `--paper`, `--copper`, etc. are removed in the same release family; use semantic `--color-*` tokens per the editorial-theme changelog for that version.
```

## Downstream visibility

Consumer maintainers and agents should follow **[`docs/downstream/upgrade-path.md`](../downstream/upgrade-path.md)** (AI / coding agents subsection). That doc links here so agents know **what** these blocks mean.

Sites that were seeded with older agent templates may need to **merge** the **Package upgrades** section from upstream [`docs/downstream/templates/agent/`](../downstream/templates/agent/) into root `CLAUDE.md` and `.github/copilot-instructions.md` if they rely on agents for bumps; the seed scripts only create those files when missing.

## Future work (optional)

- **Custom Changesets changelog package** — normalize or inject headings if authors routinely miss `#### Agent migration`.
- **Machine-readable migration manifests** (YAML/JSON per version) plus a small CLI to squash operations deterministically — only if prose-first workflows prove insufficient.
