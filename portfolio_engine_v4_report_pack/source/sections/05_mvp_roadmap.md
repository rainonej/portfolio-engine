# MVP Roadmap and Dependency Strategy

## ★ MVP stable backbone

The MVP is reached when the required runtime backbone is stable enough to support separate downstream repos.

```text
@portfolio-engine/schema
  ↓
@portfolio-engine/engine-core
  ↓
@portfolio-engine/editorial-theme
  ↓
examples/demo-site and private consumer repos
```

MVP includes:

- schema validation;
- engine-core config loading and route injection;
- editorial-theme pages/components/styles;
- demo-site build/check/deploy reliability;
- clear README and downstream consumption docs;
- supported named overrides if they are advertised;
- enough stability to create `agreni-site` and `jordan-site` as clean private repos.

MVP excludes:

- consumer registry;
- Python/MCP workflow-kit;
- admin-tools;
- full patch/upstream automation;
- advanced AI contribution workflows.

## Phase 0 — Governance and legal

Can be done anytime. Not blocking runtime MVP.

Includes license, governance, AI_USAGE, PR template, SECURITY, CITATION, DCO/notice decisions.

## Phase 1 — Runtime MVP

Required. Stabilize schema, engine-core, editorial-theme, demo-site, CI, Vercel docs, and basic overrides.

## Phase 2 — Consumer layout cleanup

Move preferred consumer shape to `src/config`, `src/content`, `src/context`, `src/overrides`, `public`, `.portfolio-engine`. Preserve compatibility if needed while migrating the demo-site.

## Phase 3 — Manifest and explicit registries

Add machine-readable route/override/path/capability registries and `.portfolio-engine/manifest.json`.

## Phase 4 — Consumer extension registry

Post-MVP middle ground. Allows local pages, local embeds, and local components without editing upstream packages.

## Phase 5 — Python/MCP workflow-kit

Post-MVP optional AI tool layer for Claude/Copilot.

## Phase 6 — Admin-tools

Post-MVP optional UI for nontechnical editing.

## Phase 7 — Mature contribution flywheel

Safety gates, patch lifecycle, upstream tracking, and public-safe GitHub automation.
