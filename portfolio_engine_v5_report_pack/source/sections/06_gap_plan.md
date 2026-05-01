# Gap Plan: Where We Are vs Where We Need To Be

## Complete overhauls

### workflow-kit (description and package)

Current docs and stub comment describe workflow-kit as reusable GitHub Actions workflows plus an AI classifier. That is the old approach from before ADR-002. The target is an optional Python/MCP package.

The old Epic 8 tickets (#226–#229 in profesional_site) must be re-scoped or closed. Tickets #227 and #228 describe GitHub Actions packaging — close these. Tickets #226 and #229 describe contracts that are still valid in concept but must be re-framed as Python/MCP tool definitions.

Change type: complete rewrite of both docs and implementation.

### README package model

Current README lists workflow-kit as a package but does not clearly separate required runtime packages from optional tooling. Target README must lead with:

- Required runtime packages (schema, engine-core, editorial-theme).
- Optional admin-tools UI.
- Optional Python/MCP workflow-kit.

Change type: major docs rewrite.

## Critical new gap — package build scripts and npm publishing

All three required packages have `"build": "echo 'build not yet configured'"`. This means:

- The Changesets release workflow cannot publish built artifacts.
- Consumer repos cannot install packages from npm — they must live inside the monorepo.
- The Backbone/Product MVP definitions cannot be met without this.

**This is the highest-priority untracked gap.** See [Package publishing](#epic-package-publishing) for the plan.

Steps required:

1. Write real `tsc`-based build scripts for `@portfolio-engine/schema` and `@portfolio-engine/engine-core`.
2. Determine the right build output for `@portfolio-engine/editorial-theme` (Astro integration + components).
3. Ensure `package.json` exports fields are correct.
4. Trigger a Changesets publish for the first real release.
5. Validate that agreni-site can install packages from npm and build without the monorepo present.

## Medium refactors

### Config path layout

Current: `config/*.json` at top level of consumer/demo-site.

Target: `src/config/*.json` inside `src/`.

This is the number one Phase 2 task. It affects:

- demo-site directory structure;
- engine-core config-loader path wiring;
- all documentation referencing config paths;
- Vercel/baseUrl issue references;
- workflow-kit inspection logic (when it exists).

Decide whether to migrate cleanly or support both paths during a compatibility window. Either way, the decision must be made and documented before agreni-site is scaffolded.

### Context layer

Target adds `src/context/site-owner.json`, `src/context/brand-voice.json`, `src/context/agent-rules.md`. No schema types or placeholder files exist anywhere. The schema package must define these types; the demo-site must have placeholder files.

### Override bridge end-to-end verification

`override-resolution.ts` validates override names. But it is not confirmed whether the editorial-theme's page components actually consume the override map at render time. Before MVP is declared:

1. Verify (or fix) the render path in at least one editorial-theme page.
2. Add a working override example to demo-site (`src/overrides/Hero.astro` or similar).
3. Confirm the demo-site build uses the override.

### Manifest generation

No current `.portfolio-engine/manifest.json`. Target requires a generated manifest for tools, admin-tools, and the future consumer registry. This is post–Product-MVP and depends on Phase 5 ([Registries / manifest](#epic-registries-manifest)).

## Named technical debt

The full debt register with `Tracked by` links lives inside the [Meta roadmap epic](#epic-meta-roadmap). Headlines:

- Hardcoded route metadata in `packages/engine-core/src/route-discovery.ts` → tracked by [Move route metadata to explicit registry](#epic-registries-manifest__move-route-metadata-to-explicit-registry) (Phase 5).
- Hardcoded supported component surfaces in `packages/engine-core/src/override-resolution.ts` → tracked by [Move override surfaces to explicit registry](#epic-registries-manifest__move-override-surfaces-to-explicit-registry) (Phase 5).
- Override bridge end-to-end not verified → tracked by the override-bridge epic (Phase 3).
- No `.portfolio-engine/manifest.json` generation → tracked by the registries-manifest epic (Phase 5).

## Small tweaks (now explicitly ticketed)

- Folder READMEs in consumer-owned dirs → [Add folder README templates](#epic-consumer-layout__add-folder-readme-templates) and [Add folder READMEs to demo-site](#epic-demo-showcase__add-folder-readmes-to-demo-site).
- `public/` asset semantics → [Document `public/` semantics](#epic-consumer-layout__document-public-semantics).
- Issue label migration → [Create area and agent labels in GitHub](#epic-label-taxonomy__create-area-and-agent-labels-in-github) and [Retag open issues](#epic-label-taxonomy__retag-open-issues-with-correct-area-and-agent-labels).

## Acknowledged gap: no test suite

There are zero unit or integration tests across all packages. The project relies on TypeScript type-checking and Astro check as proxy quality gates. This is **debt-only**, intentionally not promoted to a ticket: it does not block MVP declaration if the type-check + build pipeline is clean. Promote to a ticket post-Product-MVP if regressions appear.

## Preserve

- Core package split and dependency direction (schema → engine-core → editorial-theme).
- Demo-site as canonical reference consumer.
- Named override concept and SUPPORTED_COMPONENT_SURFACES (temporarily hardcoded; move to registry in Phase 3).
- CI/check/build pipeline structure.
- Vercel deployment for demo-site.
- Changesets release workflow.
- docs/ governance files (issue-labels.md, architecture docs, downstream docs).
