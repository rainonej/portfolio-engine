# MVP Roadmap and Dependency Strategy

## ★ MVP stable backbone

The MVP is reached when the required runtime backbone is stable enough to support separate downstream repos, and the consumer layout contract is established so consumers do not need to restructure immediately after starting.

```text
@portfolio-engine/schema
  ↓
@portfolio-engine/engine-core
  ↓
@portfolio-engine/editorial-theme
  ↓
examples/demo-site (target consumer layout)
  ↓
private consumer repos (agreni-site, jordan-site)
```

MVP requires:

- schema validation;
- engine-core config loading and route injection;
- editorial-theme pages/components/styles;
- consumer layout contract (`src/config`, `src/content`, `src/context`, `src/overrides`, `public`, `.portfolio-engine`);
- demo-site migrated to target consumer layout;
- demo-site build/check/deploy reliability;
- basic named override bridge;
- clear README and downstream consumption docs;
- enough stability to create `agreni-site` and `jordan-site` as clean private repos.

MVP excludes:

- consumer registry;
- Python/MCP workflow-kit;
- admin-tools;
- explicit registries and manifest;
- full patch/upstream automation;
- advanced AI contribution workflows;
- setup/bootstrap script;
- demo-site product showcase pages.

## Phase 0 — Governance and legal

Can be done anytime. Not blocking runtime MVP.

Includes license, governance, AI_USAGE, PR template, SECURITY, CITATION, DCO/notice decisions.

## Phase 0b — Board reconciliation and project management

Runs alongside or immediately after Phase 0. Required before committing effort to any implementation phase.

Audit the live GitHub board, reconcile open issues against report epics, decide which tickets to close/update/create, then update the board to reflect the agreed path forward.

See: `epic_00b_project_mgmt_consolidation.md`

## Phase 1 — Runtime package reliability

Required. Stabilize schema, engine-core, editorial-theme, CI, Vercel docs, and basic overrides.

## Phase 2 — Consumer layout contract and demo-site migration

Required for MVP. Establish the preferred consumer layout shape (`src/config`, `src/content`, `src/context`, `src/overrides`, `public`, `.portfolio-engine`). Migrate demo-site to this layout. Preserve compatibility if needed during transition.

## ★ MVP stable backbone

Reached after Phase 1 + Phase 2. See definition above.

## Phase 3 — Manifest and explicit registries

Add machine-readable route/override/path/capability registries and `.portfolio-engine/manifest.json`. Add default registry folders to `schema`, `engine-core`, and `editorial-theme`.

See: `epic_12_explicit_registries.md`

## Phase 4 — Admin-tools UI

Post-MVP optional UI for nontechnical editing. Prioritized here because the majority of MVP admin-tools features are already substantially built, and because non-developer consumers (e.g. agreni-site) benefit from this before the more complex extension registry or workflow-kit layers.

See: `epic_07_admin_tools.md`

## Phase 5 — Consumer extension registry

Post-MVP middle ground. Allows local pages, local embeds, and local components without editing upstream packages.

## Phase 6 — Python/MCP workflow-kit

Post-MVP optional AI tool layer for Claude/Copilot/OpenHands and other agents.

## Phase 7 — Consumer bootstrap/setup script

Post-MVP onboarding automation. A setup script creates the consumer repo structure, installs runtime packages, and optionally configures AI/MCP tooling and prints Vercel/Git setup steps.

See: `epic_13_consumer_bootstrap.md`

## Phase 8 — Demo-site as product showcase

Post-MVP educational showcase. Demo-site adds pages that teach consumers and agents how each layer (config, content, context, overrides, registry, MCP) works, with rendered results alongside source snippets.

See: `epic_08_demo_showcase.md` (post-MVP showcase tickets)

## Phase 9 — Advanced publishing and preview workflows

Post-MVP. Admin-tools exposes preview link reveal, public/preview site concepts, branch promotion guidance, and optional publishing cadence settings.

See: `epic_14_admin_tools_publishing.md`
