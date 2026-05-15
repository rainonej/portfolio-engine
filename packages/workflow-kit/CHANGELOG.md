# @portfolio-engine/workflow-kit

## 0.2.0

### Minor Changes

- b4c88b6: Add rendered interaction verification templates and prompts for downstream sites.

  This complements static rendered-link checks with browser-level smoke testing for CTAs, cards, navigation, and PDF/external links. The docs now distinguish static href validation from Playwright/browser interaction verification and update downstream PR checklist guidance.

  #### Agent update note

  Workflow-kit templates changed.

  Downstream agents should compare and update:
  - `.github/workflows/ci.yml` — add static rendered-link check step; optionally enable rendered interaction smoke
  - `scripts/check-rendered-links.mjs` — hardened: supports single-quoted hrefs, normalizes leading slashes, documents static-only scope
  - `scripts/check-content-boundaries.mjs` — hardened: fixed brittle CSS regex, added heuristic-limitation header comment
  - `.github/pull_request_template.md` — add interaction verification section distinguishing static vs browser checks
  - `CLAUDE.md` — add rendered-link and interaction check steps to local validation
  - `.github/copilot-instructions.md` — same additions
  - `.cursor/rules/downstream-agent-rules.md` — add interaction verification requirements

  New templates to copy (optional but recommended):
  - `scripts/check-rendered-interactions.mjs` — Playwright browser interaction smoke runner
  - `scripts/rendered-interactions.config.mjs` — copy from `rendered-interactions.config.example.mjs` and edit
  - prompts/`rendered-interaction-review.prompt.md` — browser interaction review prompt

  Setup for interaction smoke (if adopting):

  ```bash
  pnpm add -D @playwright/test
  pnpm exec playwright install --with-deps chromium
  ```

  Do not blindly overwrite downstream customizations. Copy new checks intentionally.

## 0.1.0

### Minor Changes

- 4ff12a1: Add generic schema primitives and build out workflow-kit templates.

  **`@portfolio-engine/engine-core`** — updated `client.d.ts` header comment with detailed
  explanation of the script vs. module classification constraint.

  **`@portfolio-engine/schema`** — new `content-primitives` exports:

  `MetricSchema`, `EvidenceItemSchema`, `RelatedLinkSchema`, `ImageAssetSchema`,
  `TagListSchema`, `PageHeaderSchema`, `CalloutSchema`, `ContentBlockSchema`,
  `CardSummarySchema`, `TemplateContractSchema`. Object schemas use `.strict()`;
  `TagListSchema` is `z.array(z.string())` (array schemas do not use `.strict()`).
  Downstream repos compose these into site-specific schemas instead of defining
  generic shapes from scratch.

  **`@portfolio-engine/workflow-kit`** — templates directory built out:
  - `templates/github/` — CI workflow, PR template, issue template
  - `templates/vscode/` — extensions, settings (format-on-save, file nesting, rulers), tasks
  - `templates/cursor/rules/` — architecture boundary rules and downstream agent rules for AI tools
  - `templates/prompts/` — four AI review prompts (architecture-review, downstream-upgrade, content-boundary-review, visual-review)
  - `templates/scripts/` — five check scripts (check-content-boundaries, check-schema-strictness, check-rendered-links, check-unused, check-tooling-version)

  ### Agent update note

  Workflow-kit templates changed.

  Downstream agents should compare and update:
  - `.github/workflows/ci.yml`
  - `.vscode/extensions.json`
  - `.vscode/settings.json`
  - `.cursor/rules/portfolio-engine-boundaries.md`
  - `.cursor/rules/downstream-agent-rules.md`
  - `scripts/check-content-boundaries.mjs`
  - `scripts/check-schema-strictness.mjs`
  - `scripts/check-rendered-links.mjs`
  - `scripts/check-unused.mjs`
  - `scripts/check-tooling-version.mjs`

  Do not blindly overwrite downstream customizations. Copy the new checks intentionally.
