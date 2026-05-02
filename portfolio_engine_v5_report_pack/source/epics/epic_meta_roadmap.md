# v5 meta roadmap, board reconciliation, and technical debt

**Phase:** Phase 0  
**MVP relevance:** Required prerequisite — single agreed path before implementation  
**Products touched:** G  
**Labels:** `type:epic`, `area:governance`, `source:human`

## Summary

Coordinate the v5 audit framing (Backbone MVP vs Product MVP, product tracks A–G, phases 0–11), reconcile the live GitHub board with this report, and maintain a visible technical debt register so scope stays honest.

## v5 audit framing

- **Two MVP milestones:** Backbone MVP after Phase 3; Product MVP after Phase 4 (agreni-site + jordan-site as real products).
- **Product tracks A–G** map every epic to concrete products; see [Product tracks and MVP coverage](#products).
- **Phase-ordered epics:** 18 epic files; filenames have no numeric prefix. Render order is driven by each epic's `Phase` frontmatter, then filename.
- **Consumer sites promoted:** agreni-site and jordan-site are Phase 4 ★ Product MVP, not "after MVP" migration only.

## Technical debt register

Each row points to the ticket that closes the debt. "Debt-only" rows are accepted technical debt with no current ticket; if the cost shifts, promote them to tickets in the appropriate phase.

| Item                                                                   | Where it lives                                                                     | Tracked by                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hardcoded route metadata                                               | `packages/engine-core/src/route-discovery.ts` (`ROUTE_METADATA`)                   | [Move route metadata to explicit registry](#epic-registries-manifest__move-route-metadata-to-explicit-registry)                                                                                                                                                                         |
| Hardcoded supported component surfaces                                 | `packages/engine-core/src/override-resolution.ts` (`SUPPORTED_COMPONENT_SURFACES`) | [Move override surfaces to explicit registry](#epic-registries-manifest__move-override-surfaces-to-explicit-registry)                                                                                                                                                                   |
| No real package build scripts                                          | All required packages have `echo 'build not yet configured'`                       | [Write real package build scripts](#epic-runtime-buildability__write-real-package-build-scripts) and [Write real build scripts for required packages](#epic-package-publishing__write-real-build-scripts-for-required-packages)                                                         |
| Override bridge end-to-end not verified                                | `engine-core` validates names but render path not confirmed                        | [Audit current override rendering path](#epic-override-bridge__audit-current-override-rendering-path), [Implement component override bridge](#epic-override-bridge__implement-component-override-bridge), [Add demo override example](#epic-override-bridge__add-demo-override-example) |
| No `.portfolio-engine/manifest.json` generation                        | Engine-core has no manifest writer                                                 | [Generate `.portfolio-engine/manifest.json`](#epic-registries-manifest__generate-portfolio-engine-manifest-json)                                                                                                                                                                        |
| Issue label migration (legacy `area:*`, provider-specific ready label) | GitHub repo labels                                                                 | [Create area and agent labels in GitHub](#epic-label-taxonomy__create-area-and-agent-labels-in-github), [Retag open issues](#epic-label-taxonomy__retag-open-issues-with-correct-area-and-agent-labels)                                                                                 |
| Folder READMEs missing in consumer-owned dirs                          | `src/config`, `src/content`, etc. (demo-site + scaffolds)                          | [Add folder README templates](#epic-consumer-layout__add-folder-readme-templates), [Add folder READMEs to demo-site](#epic-demo-showcase__add-folder-readmes-to-demo-site)                                                                                                              |
| `public/` semantics undocumented                                       | `docs/downstream/consumption.md` and folder READMEs                                | [Document `public/` semantics](#epic-consumer-layout__document-public-semantics)                                                                                                                                                                                                        |
| Config path migration (`config/*.json` → `src/config/*.json`)          | Demo-site + engine-core config loader                                              | [Decide config path migration strategy](#epic-consumer-layout__decide-config-path-migration-strategy), [Add path options to `editorialTheme(...)`](#epic-consumer-layout__add-path-options-to-editorialtheme)                                                                           |
| Sparse automated tests                                                 | All packages                                                                       | Debt-only — TypeScript + Astro check act as proxy quality gates; revisit post-Product-MVP if regressions appear.                                                                                                                                                                        |

## Why this matters

The live board and the report must not diverge. Acting on either alone risks duplicate or contradictory work.

## Tickets

### Create v5 branch and audit artifacts

**Labels:** `task:chore`, `owner:human-dev`, `area:governance`

**Acceptance criteria**

- [ ] Work proceeds on `feat/v5-audit-update` (or successor) from the agreed base branch.
- [ ] Report pack sources updated; `node scripts/build_report.mjs` regenerates HTML.

### Audit live GitHub board (was T0b.2 scope)

**Labels:** `task:research`, `owner:human-dev`, `area:governance`

List open issues; map to report epics; flag orphans, duplicates, gaps.

**Acceptance criteria**

- [ ] Each issue mapped or flagged.
- [ ] Gaps documented.

### Reconcile and update board (was T0b.3 scope)

**Labels:** `task:decision`, `owner:human-dev`, `area:governance`

Close stale issues, update labels/milestones, create missing tickets per agreed path.

**Acceptance criteria**

- [ ] Dispositions recorded.
- [ ] Phase ordering reflected on the board.

### Technical debt register visibility

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `agent:approved`

Keep debt register synced with reality (README or `docs/` pointer).

**Acceptance criteria**

- [ ] Debt items above tracked or superseded with rationale.
