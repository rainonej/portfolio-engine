# Product tracks, MVP milestones, and epic coverage

## Seven product tracks (A–G)

| Track | Product | Purpose | Role at MVP |
| --- | --- | --- | --- |
| **A** | Runtime engine | `schema`, `engine-core`, `editorial-theme` — the shared Astro/npm backbone | **Backbone MVP:** stable builds, path contracts, override bridge (if advertised), publishable packages |
| **B** | Demo-site | Reference consumer in-repo; CI and teaching surface | **Backbone MVP:** proves layout + build; **post–Product-MVP:** full showcase pages |
| **C** | agreni-site | Real private consumer; nontechnical site-owner workflow | **Product MVP:** clean repo consuming published packages |
| **D** | jordan-site | Second real consumer; different content/brand goals | **Product MVP:** validates engine is not overfit to one site |
| **E** | admin-tools | Optional UI for editing content/config/context/registry | Post–Product-MVP extraction and polish |
| **F** | workflow-kit | Optional Python/MCP tools for agents | Post–Product-MVP |
| **G** | Governance, labels, safety, docs | Legal, board, contribution safety, taxonomy | Phase 0+; enables confident execution |

## Backbone MVP vs Product MVP

**Backbone MVP** is reached after **Phase 3** (Phases 1–3 complete). The engine is stable enough to serve real consumer repos:

- Runtime packages build and can be consumed (workspace-link is allowed for Backbone MVP if docs are explicit; semver/npm consumption is required by **Product MVP** unless a documented exception applies).
- Consumer layout contract is implemented; demo-site proves it.
- Override bridge delivers Hero + custom CSS **if** overrides are advertised in v0.1 docs; if not advertised, scope is explicitly excluded in docs.
- MVP documentation epic complete: README, CONTRIBUTING basics, downstream consumption, two-mode docs (workspace vs semver).

**Product MVP** is reached after **Phase 4**. Two real products exist as clean private consumer repos:

- **agreni-site** (Product C) and **jordan-site** (Product D) are scaffolded on the target layout, wired to **published** packages (semver) or an explicit documented exception, build and preview successfully.

## Product × Epic matrix (v5)

| Epic | Phase | A | B | C | D | E | F | G | MVP role |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 — v5 meta | 0 | — | — | — | — | — | — | ✓ | Required before confident execution |
| 1 — Labels | 0 | — | — | — | — | — | — | ✓ | Phase 0 prerequisite |
| 2 — Governance | 0 | — | — | — | — | — | — | ✓ | Phase 0 parallel |
| 3 — Runtime buildability | 1 | ✓ | ✓ | — | — | — | — | — | ★ Backbone MVP |
| 4 — Package publishing | 1/2 | ✓ | — | ✓ | ✓ | — | — | — | ★ Backbone (builds); ★ Product (publish+consume) |
| 5 — Consumer layout | 2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ★ Backbone MVP |
| 6 — Override bridge | 3 | ✓ | ✓ | — | — | — | — | — | ★ Backbone MVP (if overrides advertised) |
| 7 — MVP docs | 3 | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ★ Backbone MVP |
| 8 — agreni-site | 4 | — | — | ✓ | — | — | — | — | ★ Product MVP |
| 9 — jordan-site | 4 | — | — | — | ✓ | — | — | — | ★ Product MVP |
| 10 — Registries / manifest | 5 | ✓ | ✓ | — | — | ✓ | ✓ | — | post–Product-MVP |
| 11 — Consumer registry | 6 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | post–Product-MVP |
| 12 — Admin-tools | 7 | — | — | ✓ | — | ✓ | — | — | post–Product-MVP |
| 13 — Workflow-kit | 8 | — | — | ✓ | ✓ | — | ✓ | ✓ | post–Product-MVP |
| 14 — Bootstrap | 9 | — | — | ✓ | ✓ | — | ✓ | ✓ | post–Product-MVP |
| 15 — Demo showcase | 10 | — | ✓ | — | — | ✓ | ✓ | — | post–Product-MVP |
| 16 — Safety / automation | 11 | — | — | — | — | — | — | ✓ | Phase 0 basics; advanced post-MVP |
| 17 — Admin publishing | 11 | — | — | ✓ | ✓ | ✓ | — | — | post–Product-MVP |

## How agreni-site and jordan-site evolve (Phases 5–11)

After **Product MVP**, both sites continue as first-class consumers:

- **Phase 5–6 (registries, consumer registry):** richer manifest and local extensions; both sites benefit from declared routes and embeds without upstream forks.
- **Phase 7 (admin-tools):** Product C and E — editing flows for agreni-site; jordan-site may adopt selectively.
- **Phase 8 (workflow-kit):** agent tooling across Products C, D, F, G.
- **Phase 9 (bootstrap):** onboarding for new consumers; C and D validate real-world templates.
- **Phase 10 (demo showcase):** Product B teaches patterns; admin + workflow surfaces align.
- **Phase 11 (safety, admin publishing):** contribution guardrails (G); preview/publishing automation for C, D, E.

Maps to board issues: agreni-site #1–#7 and profesional_site #219 (switch to semver) align with Epics 4, 8, and 17 as the program matures.
