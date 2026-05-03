# Product tracks, MVP milestones, and epic coverage

## Seven product tracks (A–G)

| Track | Product                          | Purpose                                                                    | Role at MVP                                                                                            |
| ----- | -------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **A** | Runtime engine                   | `schema`, `engine-core`, `editorial-theme` — the shared Astro/npm backbone | **Backbone MVP:** stable builds, path contracts, override bridge (if advertised), publishable packages |
| **B** | Demo-site                        | Reference consumer in-repo; CI and teaching surface                        | **Backbone MVP:** proves layout + build; **post–Product-MVP:** full showcase pages                     |
| **C** | agreni-site                      | Real private consumer; nontechnical site-owner workflow                    | **Product MVP:** clean repo consuming published packages                                               |
| **D** | jordan-site                      | Second real consumer; different content/brand goals                        | **Product MVP:** validates engine is not overfit to one site                                           |
| **E** | admin-tools                      | Optional UI for editing content/config/context/registry                    | Post–Product-MVP extraction and polish                                                                 |
| **F** | workflow-kit                     | Optional Python/MCP tools for agents                                       | Post–Product-MVP                                                                                       |
| **G** | Governance, labels, safety, docs | Legal, board, contribution safety, taxonomy                                | Phase 0+; enables confident execution                                                                  |

## Backbone MVP vs Product MVP

**Backbone MVP** is reached after **Phase 3** (Phases 1–3 complete). The engine is stable enough to serve real consumer repos:

- Runtime packages build and can be consumed (workspace-link is allowed for Backbone MVP if docs are explicit; semver/npm consumption is required by **Product MVP** unless a documented exception applies).
- Consumer layout contract is implemented; demo-site proves it.
- Override bridge delivers Hero + custom CSS **if** overrides are advertised in v0.1 docs; if not advertised, scope is explicitly excluded in docs.
- MVP documentation epic complete: README, CONTRIBUTING basics, downstream consumption, two-mode docs (workspace vs semver).

**Product MVP** is reached after **Phase 4**. Two real products exist as clean private consumer repos:

- **agreni-site** (Product C) and **jordan-site** (Product D) are scaffolded on the target layout, wired to **published** packages (semver) or an explicit documented exception, build and preview successfully.

## Product × Epic matrix (v5)

| Epic                                               | Phase | A   | B   | C   | D   | E   | F   | G   | MVP role                                         |
| -------------------------------------------------- | ----- | --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------ |
| [Meta roadmap](#epic-meta-roadmap)                 | 0     | —   | —   | —   | —   | —   | —   | ✓   | Required before confident execution              |
| [Label taxonomy](#epic-label-taxonomy)             | 0     | —   | —   | —   | —   | —   | —   | ✓   | Phase 0 prerequisite                             |
| [Governance, legal](#epic-governance-legal)        | 0     | —   | —   | —   | —   | —   | —   | ✓   | Phase 0 parallel                                 |
| [Runtime buildability](#epic-runtime-buildability) | 1     | ✓   | ✓   | —   | —   | —   | —   | —   | ★ Backbone MVP                                   |
| [Package publishing](#epic-package-publishing)     | 1/2   | ✓   | —   | ✓   | ✓   | —   | —   | —   | ★ Backbone (builds); ★ Product (publish+consume) |
| [Consumer layout](#epic-consumer-layout)           | 2     | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | —   | ★ Backbone MVP                                   |
| [Override bridge](#epic-override-bridge)           | 3     | ✓   | ✓   | —   | —   | —   | —   | —   | ★ Backbone MVP (if overrides advertised)         |
| [MVP docs](#epic-mvp-docs)                         | 3     | ✓   | ✓   | ✓   | ✓   | —   | —   | ✓   | ★ Backbone MVP                                   |
| [agreni-site MVP](#epic-agreni-site-mvp)           | 4     | —   | —   | ✓   | —   | —   | —   | —   | ★ Product MVP                                    |
| [jordan-site MVP](#epic-jordan-site-mvp)           | 4     | —   | —   | —   | ✓   | —   | —   | —   | ★ Product MVP                                    |
| [Registries / manifest](#epic-registries-manifest) | 5     | ✓   | ✓   | —   | —   | ✓   | ✓   | —   | post–Product-MVP                                 |
| [Admin-tools](#epic-admin-tools)                   | 6     | —   | —   | ✓   | —   | ✓   | —   | —   | post–Product-MVP                                 |
| [Consumer registry](#epic-consumer-registry)       | 7     | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | —   | post–Product-MVP                                 |
| [Workflow-kit](#epic-workflow-kit)                 | 8     | —   | —   | ✓   | ✓   | —   | ✓   | ✓   | post–Product-MVP                                 |
| [Consumer bootstrap](#epic-consumer-bootstrap)     | 9     | —   | —   | ✓   | ✓   | —   | ✓   | ✓   | post–Product-MVP                                 |
| [Demo showcase](#epic-demo-showcase)               | 10    | —   | ✓   | —   | —   | ✓   | ✓   | —   | post–Product-MVP                                 |
| [Contribution safety](#epic-contribution-safety)   | 11    | —   | —   | —   | —   | —   | —   | ✓   | Phase 0 basics; advanced post-MVP                |
| [Admin publishing](#epic-admin-publishing)         | 11    | —   | —   | ✓   | ✓   | ✓   | —   | —   | post–Product-MVP                                 |

## How agreni-site and jordan-site evolve (Phases 5–11)

After **Product MVP**, both sites continue as first-class consumers:

- **Phase 5 (registries / manifest):** richer manifest and registry-driven contracts; both sites benefit from declared routes and surfaces without upstream forks.
- **Phase 6 (admin-tools):** Product C and E — editing flows for agreni-site; jordan-site may adopt selectively.
- **Phase 7 (consumer registry):** local pages and embeds without editing upstream; C, D, E, F all benefit.
- **Phase 8 (workflow-kit):** agent tooling across Products C, D, F, G.
- **Phase 9 (bootstrap):** onboarding for new consumers; C and D validate real-world templates.
- **Phase 10 (demo showcase):** Product B teaches patterns; admin + workflow surfaces align.
- **Phase 11 (safety, admin publishing):** contribution guardrails (G); preview/publishing automation for C, D, E.

Maps to board issues: agreni-site #1–#7 and profesional_site #219 (switch to semver) align with [Package publishing](#epic-package-publishing), [agreni-site MVP](#epic-agreni-site-mvp), and [Admin publishing](#epic-admin-publishing) as the program matures.
