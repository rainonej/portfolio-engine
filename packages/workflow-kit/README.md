# @portfolio-engine/workflow-kit

Reusable downstream tooling for Portfolio Engine sites.

## What's included

```
templates/
  agent/
    CLAUDE.md                       Claude Code instructions for downstream sites
    copilot-instructions.md         GitHub Copilot instructions for downstream sites

  github/
    ci.yml                          GitHub Actions CI template
    pull_request_template.md        PR checklist for content/schema discipline
    issue_template.md               Issue template

  vscode/
    extensions.json                 Recommended extensions (Astro, MDX, YAML, ESLint, Prettier, Tailwind)
    settings.json                   Format-on-save, file nesting, rulers
    tasks.json                      Dev, check, build, boundary-check, and upgrade tasks

  cursor/
    mcp.example.json                MCP server config (Vercel, Context7, Playwright)
    rules/
      portfolio-engine-boundaries.md  Architecture boundary rules for AI agents
      downstream-agent-rules.md       Rules for AI agents making changes to downstream sites

  prompts/
    architecture-review.prompt.md          Review changed files for content/schema/template separation
    downstream-upgrade.prompt.md           How to apply a new Portfolio Engine release
    content-boundary-review.prompt.md      Detailed content boundary check for a PR
    visual-review.prompt.md                Visual design review (avoids content authoring)
    rendered-interaction-review.prompt.md  Browser interaction review: CTAs, cards, nav, overlays

  husky/
    pre-commit                      Git pre-commit hook — runs lint-staged (auto-fix before commit)
    lint-staged.config.mjs          lint-staged config (eslint --fix + prettier --write on staged files)

  scripts/
    check-content-boundaries.mjs             Fail when content leaks into route/template/component files
    check-rendered-links.mjs                 Fail on stale internal links or placeholder content (static only)
    check-rendered-interactions.mjs          Browser interaction smoke-test (Playwright — see below)
    rendered-interactions.config.example.mjs Example config for check-rendered-interactions
    check-schema-strictness.mjs              Fail on .passthrough(), type casts; warn on null fallbacks
    check-unused.mjs                         Knip wrapper for unused files, exports, and dependencies
    check-tooling-version.mjs                Warn when upstream templates may have changed
```

## How to use

Downstream repos **copy** templates intentionally. They are not auto-applied.

### First-time setup

Copy the files you want into your downstream repo:

```bash
# Example: copy the check scripts
cp node_modules/@portfolio-engine/workflow-kit/templates/scripts/check-content-boundaries.mjs scripts/
cp node_modules/@portfolio-engine/workflow-kit/templates/scripts/check-schema-strictness.mjs scripts/

# Example: copy VS Code settings
cp node_modules/@portfolio-engine/workflow-kit/templates/vscode/extensions.json .vscode/
cp node_modules/@portfolio-engine/workflow-kit/templates/vscode/settings.json .vscode/

# Example: copy Cursor rules
mkdir -p .cursor/rules
cp node_modules/@portfolio-engine/workflow-kit/templates/cursor/rules/portfolio-engine-boundaries.md .cursor/rules/
cp node_modules/@portfolio-engine/workflow-kit/templates/cursor/rules/downstream-agent-rules.md .cursor/rules/
```

### Staying up to date

When workflow-kit releases a new version, the changeset will include an **Agent update note**
listing which templates changed. Compare your local copies against the new templates and copy
updates intentionally — do not blindly overwrite local customizations.

Track your synced version in `package.json`:

```json
{
  "portfolio-engine": {
    "workflowKitSyncedVersion": "0.1.0"
  }
}
```

Then run `node scripts/check-tooling-version.mjs` to detect when you fall behind.

### Setting up pre-commit hooks

Pre-commit hooks run ESLint auto-fix and Prettier format on every staged file before it lands in the repo.
This catches issues before CI and auto-corrects most of them without a second commit.

```bash
# 1. Install husky and lint-staged
pnpm add -D husky lint-staged

# 2. Copy the templates
mkdir -p .husky
cp node_modules/@portfolio-engine/workflow-kit/templates/husky/pre-commit .husky/pre-commit
cp node_modules/@portfolio-engine/workflow-kit/templates/husky/lint-staged.config.mjs .

# 3. Add "prepare": "husky" to your package.json scripts, then:
pnpm exec husky init  # or: git config core.hooksPath .husky
```

The `lint-staged.config.mjs` auto-fixes `.ts`/`.mjs`/`.astro` files with ESLint and Prettier,
and formats `.md`/`.json`/`.yml`/`.yaml` with Prettier.

### Adding check scripts to CI

The `templates/github/ci.yml` already includes ESLint, Prettier, type-check, content boundary, and schema
strictness steps in the correct order. Copy it to `.github/workflows/ci.yml` and you're done.

If you're adding individual steps to an existing workflow:

```yaml
- name: ESLint
  run: pnpm lint

- name: Prettier (check)
  run: pnpm format:check

- name: Type check
  run: pnpm check

- name: Content boundary check
  run: node scripts/check-content-boundaries.mjs

- name: Schema strictness check
  run: node scripts/check-schema-strictness.mjs
```

## Content format guidance

### Use MDX for long-form content that needs components

```mdx
---
title: My Research Note
date: 2026-05-01
tags:
  - research
---

import MyDemo from '../../components/demos/MyDemo.astro';

Regular Markdown here.

<MyDemo />
```

### Use YAML for structured records and page copy

```yaml
title: Work
dek: >
  Selected case studies.
topics:
  - Engineering
  - Research
```

Keep structured records in `src/content/**/*.yaml`.
Keep long-form essays in `src/content/**/*.mdx`.
Do not mix large structured frontmatter with a long hidden body in the same `.mdx` file.

## Schema primitives

Upstream exports generic schema primitives from `@portfolio-engine/schema`:

```ts
import {
  MetricSchema,
  EvidenceItemSchema,
  RelatedLinkSchema,
  ImageAssetSchema,
  PageHeaderSchema,
  CardSummarySchema,
  TagListSchema,
  CalloutSchema,
  ContentBlockSchema,
  TemplateContractSchema,
} from '@portfolio-engine/schema';
```

Compose these into site-specific schemas in your downstream `src/content.config.ts`.
Do not use `.passthrough()` on first-class content schemas.

## Static rendered links vs browser interactions

`check-rendered-links` verifies that `href` values in built HTML point to generated files in
`dist/`. It does not verify that a user can click the element in a browser.

A downstream refactor can pass static link checks while still breaking real click behavior if
an overlay, nested anchor, z-index layer, or preview toolbar intercepts interaction. This gap
was exposed by downstream PR #60 in `jordan-site`:
<https://github.com/rainonej/jordan-site/pull/60>

**Concrete case study:** In that PR, all hrefs were correct and static link checks passed.
But `.ambient-bg` — the decorative background component from `editorial-theme` — was
`aria-hidden` and visually behind the page (`-z-10`), yet still intercepted clicks and text
selection because it lacked `pointer-events: none`. Adding `pointer-events: none` to the
ambient background layer restored all interactions. This bug is now fixed upstream in
`@portfolio-engine/editorial-theme`.

Use `check-rendered-interactions` (or equivalent Playwright tests) when a change affects:

- CTAs, buttons, or primary links
- Cards (project, research, writing)
- Header or footer navigation
- Overlays, hover layers, or layout wrappers
- Links inside complex components
- Vercel preview behavior

### Setting up Playwright for interaction checks

Copy the interaction smoke template from workflow-kit:

```bash
cp node_modules/@portfolio-engine/workflow-kit/templates/scripts/check-rendered-interactions.mjs scripts/
cp node_modules/@portfolio-engine/workflow-kit/templates/scripts/rendered-interactions.config.example.mjs scripts/rendered-interactions.config.mjs
```

Install Playwright:

```bash
pnpm add -D @playwright/test
pnpm exec playwright install --with-deps chromium
```

Edit `scripts/rendered-interactions.config.mjs` to match your site's routes and interactions,
then run:

```bash
SITE_URL=https://your-preview.vercel.app node scripts/check-rendered-interactions.mjs
```

Add `check:rendered-interactions` to your `package.json` scripts and run it after deploying
Vercel preview builds for changes that touch CTAs, cards, or navigation.

## Changeset policy

When workflow-kit templates change, the changeset will include:

```md
### Agent update note

Workflow-kit templates changed.

Downstream agents should compare and update:

- `.github/workflows/ci.yml`
- `.vscode/extensions.json`
- `.vscode/settings.json`
- `.cursor/rules/portfolio-engine-boundaries.md`
- `scripts/check-content-boundaries.mjs`
- `scripts/check-schema-strictness.mjs`

Do not blindly overwrite downstream customizations. Copy the new checks intentionally.
```
