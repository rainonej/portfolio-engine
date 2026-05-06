# Project status checklist

Last updated: **2026-05-05**. Verified against the `portfolio-engine` repo on branch **`dev`** (sample commit `4485cf9`). **✅** means implemented or verified in this tree; **⬜** means not done, not merged here, or still open; **🔄** means partially delivered (see sub-bullets).

## ★ Backbone MVP — reached (Phases 1–3)

Runtime packages build and publish; consumer layout contract is demonstrated on `examples/demo-site`; override bridge works; MVP-level docs and CI are in place. Published line today: `@portfolio-engine/schema@0.3.0`, `engine-core@0.2.1`, `editorial-theme@0.3.0` (npm `latest` matches workspace versions).

## Phase 0 — Planning, governance, and debt visibility

- ✅ Governance files: `GOVERNANCE.md`, `AI_USAGE.md`, `SECURITY.md`, `LICENSE` (Apache-2.0), `CITATION.cff`, `NOTICE`, `DCO.md`, `TRADEMARK.md`
- ✅ `CONTRIBUTING.md` and `docs/governance/` contributing guides
- ✅ PR template (`.github/PULL_REQUEST_TEMPLATE.md`) and issue templates
- ✅ `copilot-instructions.md` under `.github/`
- ✅ `docs/issue-labels.md` and `docs/governance/recommended-labels.md`
- ✅ This v5 report pack under `portfolio_engine_v5_report_pack/`
- ⬜ GitHub label migration — `area:*` and `agent:*` labels applied consistently on live issues (human / board hygiene)

## Phase 1 — Runtime backbone buildability

- ✅ `tsup` build scripts in `packages/schema`, `packages/engine-core`, `packages/editorial-theme`
- ✅ CI: lint → `pnpm check` → build (`.github/workflows/ci.yml`); packed smoke downstream of build
- ✅ `examples/demo-site` is the primary static + Vercel teaching consumer
- ✅ `examples/node-ssr-demo` — Astro `@astrojs/node` SSR fixture using workspace packages (including admin-tools) for server-output coverage
- ✅ ESLint + Prettier; guard against `public/` inside `packages/`
- ✅ Changesets + `release.yml` for package releases

## Phase 2 — Consumer layout contract, publish, demo migration

- ✅ Target layout on demo-site: `src/config/`, `src/content/`, `src/context/`, `src/overrides/`, `src/registry/`, `public/`, `.portfolio-engine/`
- ✅ Config under `src/config/` (not top-level `config/`)
- ✅ Context placeholders: `site-owner.json`, `brand-voice.json`, `agent-rules.md`
- ✅ Packages published to npm at current semver (see Backbone MVP banner)
- ✅ Downstream docs: `consumption.md`, `new-site-setup.md`, `setup-with-claude.md`, `upgrade-path.md`, `docs/packages/*`
- ⬜ Typed **context** layer in `@portfolio-engine/schema` — no Zod schemas yet for `site-owner.json` / `brand-voice.json` (files exist; validation is still a gap)
- ⬜ **agreni-site** / **jordan-site** as clean private repos on semver (Phase 4 / Product MVP)

## Phase 3 — Override proof and MVP documentation

- ✅ Override bridge: e.g. `Hero.astro` under `examples/demo-site/src/overrides/`
- ✅ `override-resolution.ts` driven from registries (not a hardcoded surface set)
- ✅ README separates required vs optional packages
- ✅ Per-package docs under `docs/packages/`
- ✅ Two-mode docs (workspace vs published) in consumption guides

## Phase 4 — First consumer products (★ Product MVP gate)

- ⬜ **agreni-site** — private consumer on target layout, building on published packages (tracked outside this repo)
- ⬜ **jordan-site** — same

_Product MVP is **not** reached until both consumers are real, buildable sites on the contract (or a documented exception is filed)._

## Phase 5 — Registries and manifest

- ✅ Schema: `RouteRegistryEntry`, `OverrideSurfaceEntry`, manifest types in `packages/schema/src/registry.ts`
- ✅ `engine-core`: `manifest.ts` writes `.portfolio-engine/manifest.json` at integration build time
- ✅ Route discovery and override surfaces sourced from typed registries (not ad-hoc lists)
- ✅ demo-site generates manifest at build

## Phase 6 — Admin-tools extraction

- ✅ `@portfolio-engine/admin-tools` integration (`integration.ts`), admin route, sitemap, `/api/content`, GitHub OAuth, file audit UI
- ✅ **Published to npm** — `@portfolio-engine/admin-tools@0.0.14` (`private` removed; `publishConfig.access: public`)
- ✅ `docs/packages/admin-tools.md` updated

## Phase 7 — Consumer extension registry

- 🔄 **Shipped for local routes:** JSON registry + Zod (`packages/schema/src/consumer-registry.ts`), load + inject in `engine-core` (`consumer-local-routes.ts`, `integration.ts` options), demo `src/registry/portfolio-engine.registry.json` + `src/pages-local/how-i-think.astro`
- ⬜ Registry entries for **local components/embeds** (epic tickets still open)
- ⬜ Framed YouTube / richer showcase (overlaps demo-site teaching goals)

## Phase 8 — Python / MCP workflow-kit

- ⬜ `packages/workflow-kit/src/index.ts` still describes the **old** GitHub Actions / classifier approach — should be updated before MCP implementation
- ⬜ Python package (`pyproject.toml`, MCP server) and tools: `inspect_site`, `plan_request`, `validate_plan`, `plan_upstream`, `patch_ledger`

## Phase 9 — Consumer bootstrap / setup script

- ⬜ Single bootstrap script (dry-run, optional MCP hints, printed Vercel/GitHub guidance)

## Phase 10 — Demo-site showcase expansion

- ⬜ Teaching pages per layer (config, content, context, overrides, registry, workflow-kit) with rendered output + source side-by-side

## Phase 11 — Contribution safety and admin publishing

- ⬜ Layer-boundary guards in CI / PR automation
- ⬜ AI review prompts for upstream-originated PRs
- ⬜ Admin-tools: preview vs production publishing semantics

## Gaps noticed while auditing (not all in original v5 text)

- **Context JSON untyped** — add Zod in `schema` when the context contract stabilizes.
- **workflow-kit stub** — comment drift vs ADR-002 / Phase 8 direction.
- **Product MVP** — engine ahead of schedule on registries, admin-tools, and consumer local routes; external consumer repos remain the gate.
