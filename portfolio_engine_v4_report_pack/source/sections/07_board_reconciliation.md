# Board Reconciliation Snapshot

This section is the output of Epic 0b — reconciling the live GitHub project board with the v4 audit report. The board (https://github.com/users/rainonej/projects/2) spans three repos and 282 total items (61 open as of 2026-04-30).

## The three-repo structure

| Repo | Open issues | What they represent |
|---|---|---|
| `rainonej/portfolio-engine` | 14 | Phase 1 sprint tail — Epic 4 extraction follow-through |
| `rainonej/agreni-site` | 7 | Phase 2/10 — consumer repo scaffolding and content migration |
| `rainonej/profesional_site` | 40 | Origin repo: old epics, done tasks, content blockers, governance |

The `profesional_site` repo is the origin monorepo. It predates the portfolio-engine split and contains parent epics (4–10) that generated the work now tracked in `portfolio-engine`. It also holds content-only tasks blocked on the site owner.

## portfolio-engine issues — disposition

| # | Title | Phase | Disposition |
|---|---|---|---|
| #16 | Fix editorial-theme pnpm check + TypeScript | Phase 1 ★ | Keep — critical blocker |
| #28 | CI: Staged workflow lint → check → build | Phase 1 ★ | Keep |
| #29 | CI: astro check + demo-site build in pipeline | Phase 1 ★ | Keep |
| #30 | ESLint + Prettier + lint:fix docs | Phase 1 ★ | Keep |
| #31 | Vercel: Connect portfolio-engine repo | Phase 1 ★ | Keep — human required |
| #32 | Docs: Root README + board links | Phase 1 ★ | Keep |
| #33 | editorial-theme: PostCSS Tailwind migration | Phase 1 ★ | Keep |
| #34 | Vercel: Optional CLI deploy / preview bot | Phase 9 | Defer — add mvp:post |
| #35 | Docs: GitHub Project docs + project-views ported | Phase 0 | Verify done → close |
| #36 | Copilot: Rulesets for PRs into dev and epic/* | Phase 7 | Defer — add mvp:post |
| #37 | Copilot: Document PR feedback loop | Phase 7 | Defer — add mvp:post |
| #38 | theme: PR #17 follow-ups (base URL + schema) | Phase 1 ★ | Keep |
| #40 | Vercel: Update demo-site config/site.json baseUrl | Phase 1 ★ | Keep |
| #41 | Docs: Add live demo badge/link to README | Phase 1 ★ | Keep |

## agreni-site issues — disposition

All 7 issues map to report Epic 10 (consumer migration). They should wait until the Phase 2 consumer layout contract is established and the packages are published.

| # | Title | Phase | Notes |
|---|---|---|---|
| #2 | Epic 5 — Scaffold and Populate agreni-site | Phase 2+ | Parent epic |
| #1 | Task 5.5 — Reconnect secrets and deployments | Phase 2+ | Human required (Vercel/GitHub secrets) |
| #3 | Task 5.3 — Wire to local workspace/path packages | Phase 2+ | — |
| #4 | Task 5.1 — Scaffold agreni-site repo structure | Phase 2+ | — |
| #5 | Task 5.6 — Post-split parity verification | Phase 2+ | — |
| #6 | Task 5.4 — Preserve preview/auth/admin behavior | Phase 2+ | — |
| #7 | Task 5.2 — Migrate all Agreni content/config/media | Phase 2+ | Depends on consumer layout finalized |

## profesional_site issues — old epic mapping

### Epic 4 tasks — DONE, should close

All Epic 4 extraction tasks are complete. The editorial-theme package has 13 components, 5 page types, layouts, and CSS. The demo-site builds and deploys. These should be closed with a comment linking to the portfolio-engine repo.

| # | Title | Status |
|---|---|---|
| #175 | Epic 4 — Extract editorial-theme | Done — close or archive |
| #209 | Task 4.1 — Port layouts/components/styles | Done |
| #210 | Task 4.2 — Port page routes | Done |
| #211 | Task 4.3 — Theme consumes engine-core | Done |
| #212 | Task 4.4 — Define first-party override points | Done |
| #213 | Task 4.5 — Create examples/demo-site | Done |

### Epic 6 — Package publishing (CRITICAL GAP, no report equivalent until epic_15)

| # | Title | Report epic | Phase |
|---|---|---|---|
| #177 | Epic 6 — Publish and Stabilize Package Consumption | Epic 15 | Phase 1/2 ★ |
| #219 | Task 6.1 — Publish first engine packages to npm | Epic 15 | Phase 1/2 ★ |
| #220 | Task 6.2 — Switch agreni-site to semver packages | Epic 10/15 | Phase 2 |
| #221 | Task 6.3 — Document two development modes | Epic 1/15 | Phase 1/2 |
| #222 | Task 6.4 — Add basic package upgrade workflow | Epic 10/15 | Phase 2 |

### Epic 7 — Admin-tools extraction (report Epic 7, Phase 4)

Important: admin-tools is an EXTRACTION from the existing profesional_site/agreni-site admin UI, not a greenfield build. The functionality exists; it needs to be packaged.

| # | Title | Phase |
|---|---|---|
| #178 | Epic 7 — Extract Admin Tools + Generated Site Map | Phase 4 |
| #223 | Task 7.1 — Extract admin/reviewer UI into admin-tools package | Phase 4 |
| #224 | Task 7.2 — Generate site map from route registry | Phase 3/4 |
| #225 | Task 7.3 — Add content/config inspection panels | Phase 4 |

### Epic 8 — Old workflow-kit (OBSOLETE — must re-scope)

These tickets describe a GitHub Actions-based workflow classifier. ADR-002 replaced this approach with Python/MCP. Tasks #227 and #228 should be closed. Tasks #226 and #229 should be re-scoped to reference the Python/MCP approach.

| # | Title | Disposition |
|---|---|---|
| #179 | Epic 8 — Build workflow-kit MVP | Re-scope to reference ADR-002 and report Epic 6 |
| #226 | Task 8.1 — Define workflow classification contract | Re-scope as MCP tool contracts |
| #227 | Task 8.2 — Package reusable GitHub workflow templates | Close — old approach |
| #228 | Task 8.3 — Add engine-aware classifier | Close — old approach |
| #229 | Task 8.4 — Add downstream-to-upstream routing contract | Re-scope — concept valid, implementation is Python/MCP |

### Epics 9 and 10 — Patch lifecycle (report Epic 9, Phase 7)

These remain valid. Note that Task 9.2 (create local patch + upstream PR) was scoped for GitHub Actions; it should now be scoped for Python/MCP tooling instead.

| # | Title | Phase |
|---|---|---|
| #180 | Epic 9 — Local Patch + Upstream PR Lifecycle | Phase 7 |
| #181 | Epic 10 — Release Reconciliation / Patch Cleanup | Phase 7 |
| #230–#235 | Tasks 9.1–10.3 | Phase 7 |

### Governance and provisioning

| # | Title | Phase | Notes |
|---|---|---|---|
| #270 | Epic 1.5 — Provision Repositories, Ownership, Privacy | Phase 0 | Maps to report Epic 0/0b |
| #272 | Task 1.13 — Verify Agreni GitHub account and grant access | Phase 0 | Human required |
| #282 | Task CI.1 — Expand CI for portfolio-engine monorepo | Phase 1 | Maps to #28/#29 |
| #78 | Add ANTHROPIC_API_KEY secret to GitHub Actions | Phase 6 | Needed for workflow-kit |

### Site owner content — separate launch track

These are not engineering tasks. They are blocked on the site owner (Agreni) providing real copy and a booking URL. They should be tracked separately from the engineering roadmap.

- profesional_site #35: Site owner positioning and copy
- profesional_site #36: Blog and testimonials content
- profesional_site #37: Replace placeholder copy and booking URL
- profesional_site #40: Provide real booking URL
- profesional_site #41: Launch content approval
- profesional_site #238: Mobile home page bug (address during agreni-site migration)
- profesional_site #153: Wire content editing in /admin (depends on Epic 7 extraction)
- profesional_site #82: Screenshots for CONTRIBUTING.md (low priority docs)

## Missing from both board and report (must create tickets)

All Phase 2 work has no board representation. These tickets need to be created:

1. Config path migration: `config/*.json` → `src/config/*.json`
2. Add `src/context/` layer with schemas and demo placeholder files
3. Add override demo example to demo-site (prove bridge works end-to-end)
4. Formalize consumer layout contract in docs
5. Migrate demo-site to full target layout
6. Write real package build scripts (currently all no-ops)
7. Publish packages to npm (or document workspace-link-only as the MVP mode)
8. Create GitHub milestones for Phase 1 and Phase 2
9. Create `area:*` and `agent:*` labels (rename `area:theme` → `area:editorial-theme`, `area:demo` → `area:demo-site`, deprecate `claude-ready`)
