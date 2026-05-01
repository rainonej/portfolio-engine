# Epic 4 — Package build scripts and npm publishing

**Phase:** Phase 1 (build scripts) / Phase 2 (publish + switch agreni-site)  
**MVP relevance:** ★ Required for Backbone MVP (builds + docs); ★ Required for Product MVP (semver publish + consume)  
**Products touched:** A, C, D  
**Labels:** `type:epic`, `area:schema`, `area:engine-core`, `area:editorial-theme`, `area:release`, `source:human`

## Summary

All three required runtime packages currently have no-op build scripts (`echo 'build not yet configured'`). Before the packages can be consumed by truly separate consumer repos (agreni-site, jordan-site), they need real build scripts and a publishing strategy. This epic covers two distinct phases: getting builds working, then publishing and validating consumption.

## Why this matters

**Product MVP** requires agreni-site and jordan-site to consume versioned packages unless a documented exception applies. Without published packages, those repos can only consume via pnpm workspace links — acceptable for Backbone MVP only when documentation is explicit.

This epic also documents the two development modes so contributors know which to use.

## Maps to old Epic 6 (profesional_site)

This epic is the v5 equivalent of profesional_site issues:
- #177: Epic 6 — Publish and Stabilize Package Consumption
- #219: Task 6.1 — Publish first engine packages to npm
- #220: Task 6.2 — Switch agreni-site from local paths to semver packages
- #221: Task 6.3 — Document the two development modes
- #222: Task 6.4 — Add basic package upgrade workflow in agreni-site

## Two development modes

### Mode A: workspace link (development / monorepo contributor)

Consumer lives inside the portfolio-engine monorepo workspace. Packages are consumed via pnpm workspace protocol (`workspace:*`). No publishing required. Used for active engine development.

### Mode B: semver packages (production / separate consumer repo)

Consumer lives in a separate private repo. Packages are installed from npm as versioned dependencies. This is the target architecture for agreni-site and jordan-site.

## Tickets

### T4.1 — Write real build scripts for required packages

**Labels:** `task:feat`, `owner:agentic-ai`, `area:engine-core`, `area:editorial-theme`, `area:schema`, `agent:approved`, `mvp:required`

Replace `echo 'build not yet configured'` with working build scripts in all three required packages. Use `tsc` for schema and engine-core; use the Astro build or a dedicated bundler for editorial-theme.

**Acceptance criteria**

- [ ] `pnpm --filter @portfolio-engine/schema build` succeeds and emits `dist/`.
- [ ] `pnpm --filter @portfolio-engine/engine-core build` succeeds and emits `dist/`.
- [ ] `pnpm --filter @portfolio-engine/editorial-theme build` succeeds and emits distributable output.
- [ ] All three packages have correct `exports` and `main`/`types` fields in `package.json`.
- [ ] Changesets release workflow can publish from `dist/`.

### T4.2 — Document two development modes

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `agent:approved`, `mvp:required`

Update `docs/downstream/consumption.md` to clearly describe workspace-link mode vs. semver mode. Include when to use each and how to switch.

**Acceptance criteria**

- [ ] Workspace-link mode (monorepo contributor) is documented.
- [ ] Semver mode (separate consumer repo) is documented.
- [ ] Switch instructions from one mode to the other are included.
- [ ] `docs/downstream/consumption.md` is updated.

### T4.3 — Publish first engine packages to npm

**Labels:** `task:feat`, `owner:human-dev`, `area:release`, `mvp:required`

Trigger the Changesets release workflow to publish `@portfolio-engine/schema`, `@portfolio-engine/engine-core`, and `@portfolio-engine/editorial-theme` to the npm registry.

**Acceptance criteria**

- [ ] All three required packages are published at a stable version (at minimum `0.1.0`).
- [ ] npm package pages are accessible.
- [ ] Packages are installable via `npm install @portfolio-engine/editorial-theme`.

**Blocked by:** T4.1 (build scripts must work first)

### T4.4 — Validate agreni-site can consume published packages

**Labels:** `task:feat`, `owner:agentic-ai`, `area:downstream`, `agent:approved`, `mvp:required`

In the agreni-site repo, switch from pnpm workspace links to semver references. Confirm the site builds with the published packages.

**Acceptance criteria**

- [ ] `package.json` in agreni-site references published semver versions (not `workspace:*`).
- [ ] `pnpm install` and `pnpm build` succeed in agreni-site without the portfolio-engine monorepo present.
- [ ] Any monorepo-specific paths or assumptions are removed.

**Blocked by:** T4.3 (packages must be published first), agreni-site #1 (secrets/integrations reconnected)

### T4.5 — Add basic package upgrade workflow

**Labels:** `task:docs`, `owner:agentic-ai`, `area:downstream`, `area:docs`, `agent:approved`, `mvp:post`

Document the process for updating portfolio-engine package versions in a consumer repo. Include how to read the changelog, when to update, and how to handle breaking changes.

**Acceptance criteria**

- [ ] Upgrade process documented in `docs/downstream/upgrade-path.md`.
- [ ] Changelog reading and semver expectations explained.
- [ ] Breaking change handling noted.
