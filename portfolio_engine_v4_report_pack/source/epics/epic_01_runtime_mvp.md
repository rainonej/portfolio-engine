# Epic 1 — Runtime MVP: schema, engine-core, editorial-theme, demo-site

**Phase:** Phase 1
**MVP relevance:** ★ Required for MVP
**Labels:** `type:epic`, `area:schema`, `area:engine-core`, `area:editorial-theme`, `area:demo-site`, `area:ci`, `source:human`

## Summary

Make the required runtime packages stable enough to serve as the reusable backbone for `agreni-site`, `jordan-site`, and future consumer sites. Phase 1 covers the remaining sprint work (the tail of the Epic 4 extraction) plus build infrastructure.

## Status note

The Epic 4 extraction from profesional_site is substantially complete. Tasks 4.1–4.5 are done: editorial-theme has 13 components and 5 page types, engine-core has ~1,000 LOC, the demo-site builds and deploys. The remaining open issues are the tail of that extraction sprint plus new infrastructure work needed for the backbone to be truly stable.

## Why this matters

This is the core product. The optional workflow-kit and admin-tools do not matter if the runtime backbone is not stable and cannot be consumed by separate repos.

## Existing issues to reconcile (portfolio-engine repo)

**Keep — Phase 1 sprint (active):**
- portfolio-engine #16: editorial-theme pnpm check and Astro/editor TypeScript ← critical blocker
- portfolio-engine #28: Staged CI workflow lint → check → build
- portfolio-engine #29: astro check + demo-site build in pipeline
- portfolio-engine #30: ESLint + Prettier + lint:fix docs
- portfolio-engine #31: Vercel connect (human task)
- portfolio-engine #32: Root README + board links
- portfolio-engine #33: PostCSS Tailwind migration (no @astrojs/tailwind)
- portfolio-engine #38: PR #17 base URL + schema follow-ups
- portfolio-engine #40: Update demo-site config/site.json baseUrl
- portfolio-engine #41: Add live demo badge/link to README

**Defer to post-MVP:**
- portfolio-engine #34: Vercel CLI deploy/preview bot → Phase 9 (Epic 14)
- portfolio-engine #36: Copilot rulesets for PRs into dev/epic/* → Phase 7 (Epic 9)
- portfolio-engine #37: Copilot document PR feedback loop → Phase 7 (Epic 9)

**Verify and close:**
- portfolio-engine #35: GitHub Project docs ported → likely done, verify and close

**Old Epic 4 tasks in profesional_site — DONE, close:**
- profesional_site #209–#213: All extraction tasks complete
- profesional_site #175: Parent Epic 4 — close or archive

## Tickets

### T1.1 — Reconcile existing runtime and CI issues

**Labels:** `task:chore`, `owner:human-dev`, `area:ci`

Review all open issues per the list above. Apply correct phase labels. Close done items. Defer post-MVP items.

**Acceptance criteria**

- [ ] Existing issues linked from this epic.
- [ ] Issues #34, #36, #37 deferred with `mvp:post` label.
- [ ] Issue #35 verified and closed if done.
- [ ] profesional_site #209–#213 and #175 closed with closing comment.

### T1.2 — Fix editorial-theme typecheck/build reliability

**Labels:** `task:bug-fix`, `owner:agentic-ai`, `area:editorial-theme`, `agent:approved`

Resolve TypeScript/Astro check failures and virtual module editor issues. Tracked by portfolio-engine #16.

**Acceptance criteria**

- [ ] `pnpm --filter @portfolio-engine/editorial-theme check` passes.
- [ ] Demo-site `astro check` runs non-interactively.
- [ ] Virtual module imports resolve consistently.

### T1.3 — Verify demo-site build/deploy path

**Labels:** `task:chore`, `owner:agentic-ai`, `area:demo-site`, `agent:approved`

Ensure demo-site can build locally and deploy via Vercel with documented settings. Tracked by #31, #40.

**Acceptance criteria**

- [ ] `pnpm --filter demo-site build` passes.
- [ ] Vercel output directory and baseUrl are correct.
- [ ] Demo README is accurate.

### T1.4 — Write real package build scripts

**Labels:** `task:feat`, `owner:agentic-ai`, `area:engine-core`, `area:editorial-theme`, `area:schema`, `agent:approved`

Replace `echo 'build not yet configured'` in all three required packages. See Epic 15 T15.1 for full acceptance criteria. This ticket is the Phase 1 prerequisite; publishing happens in Phase 2.

**Acceptance criteria**

- [ ] All three packages emit distributable output when `pnpm build` is run.
- [ ] `package.json` exports and types fields are correct.
- [ ] Changesets workflow can publish from the output.

### T1.5 — Rewrite README around required vs optional packages

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `agent:approved`

Explain required runtime packages first, then optional admin-tools and workflow-kit.

**Acceptance criteria**

- [ ] Required runtime packages clearly labeled.
- [ ] workflow-kit described as optional Python/MCP tooling.
- [ ] admin-tools described as optional UI.
- [ ] Two development modes documented (workspace link vs. semver).

### T1.6 — Define MVP marker in project docs

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `agent:approved`

Add a visible MVP definition so optional features are not confused with the stable backbone.

**Acceptance criteria**

- [ ] MVP definition appears in docs and README.
- [ ] Post-MVP items are listed explicitly.
- [ ] Package publishing included in MVP requirements.
