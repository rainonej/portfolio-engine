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

**This is the highest-priority untracked gap.** See **Epic 4** for the plan.

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

No current `.portfolio-engine/manifest.json`. Target requires a generated manifest for tools, admin-tools, and the future consumer registry. This is post–Product-MVP and depends on Phase 5 (**Epic 10**).

## Named technical debt

### Hardcoded route metadata

`packages/engine-core/src/route-discovery.ts` hardcodes 9 routes as a static array. This works but is not machine-readable or extensible. Phase 5 (**Epic 10**) replaces this with file-based registries.

### Hardcoded override surfaces

`packages/engine-core/src/override-resolution.ts` hardcodes 4 component surface names. Same issue, same fix in Phase 3.

## Small tweaks

### Folder READMEs

Add small README files under consumer-owned demo-site folders (`src/config`, `src/content`, etc.) explaining what belongs and what does not.

### Public asset docs

Explain that `public/` is served from site root and everything inside is publicly accessible.

### Issue label migration

Rename legacy narrow `area:*` labels to the standard taxonomy (`area:editorial-theme`, `area:demo-site`, etc.) in GitHub. Add `area:*` and `agent:*` labels per **Epic 1**. Deprecate the legacy provider-specific ready label in favor of `agent:approved`.

### Acknowledged gap: no test suite

There are zero unit or integration tests across all packages. The project relies on TypeScript type-checking and Astro check as proxy quality gates. This is a known gap. It does not block MVP declaration if the type-check + build pipeline is clean, but it should be acknowledged and eventually addressed post-MVP.

## Preserve

- Core package split and dependency direction (schema → engine-core → editorial-theme).
- Demo-site as canonical reference consumer.
- Named override concept and SUPPORTED_COMPONENT_SURFACES (temporarily hardcoded; move to registry in Phase 3).
- CI/check/build pipeline structure.
- Vercel deployment for demo-site.
- Changesets release workflow.
- docs/ governance files (issue-labels.md, architecture docs, downstream docs).
