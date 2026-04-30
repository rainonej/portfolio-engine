# Epic 1 — Runtime MVP: schema, engine-core, editorial-theme, demo-site

**Phase:** Phase 1  
**MVP relevance:** ★ Required for MVP  
**Labels:** `type:epic`, `area:schema`, `area:engine-core`, `area:theme`, `area:demo`, `source:human`

## Summary

Make the required runtime packages stable enough to serve as the reusable backbone for `agreni-site`, `jordan-site`, and future consumer sites.

## Why this matters

This is the core product. The optional workflow-kit and admin-tools do not matter if the runtime backbone is not stable.

## Existing issues to reconcile

- #16 editorial-theme check and Astro/editor TypeScript
- #28 staged CI workflow
- #29 astro check + demo-site build
- #30 ESLint/Prettier docs
- #33 PostCSS Tailwind
- #38 theme PR follow-ups
- #31/#40/#41 Vercel/demo docs

## Tickets

### T1.1 — Reconcile existing runtime and CI issues

**Labels:** `task:chore`, `owner:human-dev`, `area:ci`

Review existing issues before creating duplicates.

**Acceptance criteria**

- [ ] Existing issues linked from this epic.
- [ ] Duplicate issues avoided.
- [ ] Open/closed state respected.

### T1.2 — Fix editorial-theme typecheck/build reliability

**Labels:** `task:bug`, `owner:agentic-ai`, `area:theme`, `claude-ready`

Resolve TypeScript/Astro check failures and virtual module editor issues.

**Acceptance criteria**

- [ ] `pnpm --filter @portfolio-engine/editorial-theme check` passes.
- [ ] Demo-site `astro check` runs non-interactively.
- [ ] Virtual module imports resolve consistently.

### T1.3 — Verify demo-site build/deploy path

**Labels:** `task:chore`, `owner:agentic-ai`, `area:demo`, `claude-ready`

Ensure demo-site can build locally and deploy via Vercel with documented settings.

**Acceptance criteria**

- [ ] `pnpm --filter demo-site build` passes.
- [ ] Vercel output directory docs are correct.
- [ ] Demo README is accurate.

### T1.4 — Rewrite README around required vs optional packages

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `claude-ready`

Explain required runtime packages first, then optional admin-tools and workflow-kit.

**Acceptance criteria**

- [ ] Required runtime packages are clearly labeled.
- [ ] workflow-kit is optional Python/MCP tooling.
- [ ] admin-tools is optional UI.

### T1.5 — Define MVP marker in project docs

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `claude-ready`

Add a visible MVP definition so optional bells and whistles are not confused with the stable backbone.

**Acceptance criteria**

- [ ] MVP star/definition appears in docs.
- [ ] Post-MVP items are listed.
