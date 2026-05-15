---
'@portfolio-engine/engine-core': patch
'@portfolio-engine/schema': minor
'@portfolio-engine/workflow-kit': minor
---

Add generic schema primitives and build out workflow-kit templates.

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
