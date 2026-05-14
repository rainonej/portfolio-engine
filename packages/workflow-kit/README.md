# @portfolio-engine/workflow-kit

Reusable downstream tooling for Portfolio Engine sites.

## What's included

```
templates/
  github/
    ci.yml                          GitHub Actions CI template
    pull_request_template.md        PR checklist for content/schema discipline
    issue_template.md               Issue template

  vscode/
    extensions.json                 Recommended extensions (Astro, MDX, YAML, ESLint, Prettier, Tailwind)
    settings.json                   Format-on-save, YAML schemas, file nesting
    tasks.json                      Dev, check, build, and boundary-check tasks

  cursor/
    mcp.example.json                Example MCP server config for Cursor
    rules/
      portfolio-engine-boundaries.md  Architecture boundary rules for AI agents
      downstream-agent-rules.md       Rules for AI agents making changes to downstream sites

  prompts/
    architecture-review.prompt.md     Review changed files for content/schema/template separation
    downstream-upgrade.prompt.md      How to apply a new Portfolio Engine release
    content-boundary-review.prompt.md Detailed content boundary check for a PR
    visual-review.prompt.md           Visual design review (avoids content authoring)

  scripts/
    check-content-boundaries.mjs    Fail when content leaks into route/template/component files
    check-rendered-links.mjs        Fail on stale internal links or placeholder content
    check-schema-strictness.mjs     Fail on .passthrough(), type casts, and null fallbacks
    check-unused.mjs                Knip wrapper for unused files, exports, and dependencies
    check-tooling-version.mjs       Warn when upstream templates may have changed
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

### Adding check scripts to CI

Add to your `.github/workflows/ci.yml`:

```yaml
- name: Content boundary check
  run: node scripts/check-content-boundaries.mjs

- name: Schema strictness check
  run: node scripts/check-schema-strictness.mjs

- name: Rendered link check
  run: node scripts/check-rendered-links.mjs
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

import MyDemo from "../../components/demos/MyDemo.astro";

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
