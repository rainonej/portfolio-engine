# Portfolio Engine

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://portfolio-engine-psi.vercel.app)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)

Portfolio Engine is an Apache-2.0 Astro/Tailwind backbone for agent-native personal and professional websites.

The idea is simple: site owners contribute needs, examples, feedback, and acceptance criteria; AI agents implement scoped issues; humans review the shared foundation; reusable improvements flow back into the engine.

It is not a one-off portfolio template. It is an open-source commons for building serious personal/professional sites without every user starting from scratch.

- **Live demo:** [https://portfolio-engine-psi.vercel.app](https://portfolio-engine-psi.vercel.app)
- **Repository:** [https://github.com/rainonej/portfolio-engine](https://github.com/rainonej/portfolio-engine)

---

## Why this exists

AI coding agents have made small implementation tasks much cheaper. A site owner can now describe a feature like:

- add a publications page;
- fix this mobile layout;
- create a case-study template;
- add a project gallery;
- embed a safe interactive demo;
- add a reusable visual section;
- turn this preview comment into a scoped task.

But cheap implementation is not the same thing as good software. If every person vibe-codes a website from scratch, the result is thousands of brittle one-off codebases with inconsistent components, inaccessible markup, hard-coded assumptions, no upgrade path, and no shared maintenance.

Portfolio Engine tries a different model:

1. One open-source Astro/Tailwind backbone.
2. Many downstream consumer sites.
3. Typed content/config contracts.
4. Explicit package and override boundaries.
5. AI-agent-friendly issues.
6. CI, build checks, visual QA, and human review.
7. Reusable improvements that flow back into the shared engine.

The goal is not to remove developers. The goal is to make human judgment more leveraged.

---

## Who this is for

### Site owners and vibe coders

You know what you want your site to do, even if you do not want to become an Astro/Tailwind expert. Portfolio Engine gives your agent a typed content model, stable override surfaces, visual QA prompts, CI checks, and a shared engine to build against.

### AI-agent users

Use Claude Code, Cursor, Copilot, ChatGPT, Codex-style agents, or another coding workflow. The repo is designed around scoped issues, explicit package boundaries, and reviewable PRs instead of one giant prompt that generates an unmaintainable site.

### Human contributors

Astro developers, Tailwind/design-system reviewers, accessibility reviewers, open-source maintainers, and agent-workflow people can help make the shared backbone safer, more flexible, and easier to contribute to.

---

## Use it

### Fast path: agent-assisted setup

The most documented setup path today is Claude Code:

1. Open [`docs/downstream/setup-with-claude.md`](docs/downstream/setup-with-claude.md).
2. Paste the whole file into Claude Code.
3. Answer the intake questions.
4. Let the agent scaffold the downstream repo, run checks, and guide the Vercel setup.

Claude Code is the best-documented path today, not a hard dependency of the architecture.

### Manual path

Use:

- [`docs/downstream/new-site-setup.md`](docs/downstream/new-site-setup.md)
- [`docs/downstream/consumption.md`](docs/downstream/consumption.md)

to wire the packages yourself.

### Other agents

Cursor, Copilot, ChatGPT, Codex-style agents, and other coding agents can use the same docs, issue templates, package boundaries, and visual QA prompts. See:

- [`AGENTS.md`](AGENTS.md)
- [`docs/agent-workflow.md`](docs/agent-workflow.md)
- [`docs/downstream/agent-tooling.md`](docs/downstream/agent-tooling.md)

---

## What lives where

Your portfolio is its own repo. This repo is the engine it consumes.

```text
Your repo (for example, my-portfolio)       This repo (portfolio-engine)
────────────────────────────────────        ──────────────────────────────
src/
  config/    ← your JSON config             @portfolio-engine/editorial-theme
  content/   ← your writing/work              layouts, components, routes
  context/   ← your identity/context        @portfolio-engine/engine-core
  overrides/ ← component swaps                config loader, route registry
  pages-local/ ← local screens              @portfolio-engine/schema
  registry/    ← local route registry          Zod schemas
```

The three required runtime packages are published as `@portfolio-engine/*` packages:

| Package                             | Role                                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| `@portfolio-engine/schema`          | Framework-free Zod schemas for config/content contracts                                 |
| `@portfolio-engine/engine-core`     | Astro integration, config loading, virtual modules, route registry, override resolution |
| `@portfolio-engine/editorial-theme` | Layouts, routes, components, theme defaults, override surfaces                          |

Optional packages:

| Package                          | Role                                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| `@portfolio-engine/admin-tools`  | Admin/reviewer UI and GitHub-backed content editing surfaces                                   |
| `@portfolio-engine/workflow-kit` | Reusable downstream tooling, prompts, GitHub Actions templates, and agent-workflow scaffolding |

---

## Where to change things

| Goal                              | Change this                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------- |
| Change content                    | downstream `src/content/**`                                                     |
| Change colors or fonts            | downstream `src/config/theme.json`                                              |
| Change navigation                 | downstream `src/config/navigation.json`                                         |
| Change site metadata              | downstream `src/config/site.json`                                               |
| Add a custom local page           | downstream `src/pages-local/` and `src/registry/portfolio-engine.registry.json` |
| Replace a supported section       | downstream `src/overrides/`                                                     |
| Add a reusable engine capability  | upstream package in this repo, after an issue/PR review                         |
| Change schemas                    | `packages/schema`                                                               |
| Change route/config loading       | `packages/engine-core`                                                          |
| Change default screens/components | `packages/editorial-theme`                                                      |
| Change agent/workflow scaffolding | `packages/workflow-kit`, `.github/`, and `docs/`                                |

---

## Contribute

Portfolio Engine needs both users and contributors.

Useful contributions include:

- test the setup flow on a clean machine;
- open a feature request for a recurring site need;
- review the Astro package architecture;
- review Tailwind/theme-token boundaries;
- audit accessibility defaults;
- improve visual QA prompts;
- improve agent instructions;
- add a small reusable component;
- convert a downstream workaround into a generalized engine feature.

Good first contribution types:

- docs friction report;
- accessibility review;
- theme-token review;
- small bug fix;
- visual QA report;
- agent-readiness critique;
- issue-template improvement.

Start with:

- [`VISION.md`](VISION.md)
- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`AGENTS.md`](AGENTS.md)
- [`CONTRIBUTING.md`](CONTRIBUTING.md)
- [`GOVERNANCE.md`](GOVERNANCE.md)
- [`AI_USAGE.md`](AI_USAGE.md)
- [`docs/project-management.md`](docs/project-management.md)

---

## Agent-native contribution loop

A typical contribution loop should look like this:

1. A site owner reviews a preview deployment or local site.
2. They leave visual feedback or open a feature request.
3. The feedback becomes a GitHub issue.
4. A maintainer classifies the issue by source, owner, area, risk, and readiness.
5. A narrow issue may be labeled as safe for an AI agent.
6. An AI agent or human contributor opens a PR.
7. CI, type checks, build checks, and visual review run.
8. Humans review before merge.
9. Reusable improvements land in the shared engine.

This project is not trying to make a fully autonomous repo. It is trying to make AI-assisted changes boring, scoped, reviewable, and useful.

---

## Current status

Portfolio Engine is early but usable.

Shipped:

- Astro/Tailwind runtime packages;
- typed config/content schemas;
- theme routes;
- consumer-local routes;
- named override surfaces;
- visual QA prompts;
- design review checklist;
- CI and packed-consumer smoke test;
- canonical demo-site reference consumer;
- community docs (VISION.md, ARCHITECTURE.md, ROADMAP.md, AGENTS.md);
- docs/agent-workflow.md and docs/vercel-feedback-loop.md;
- issue templates for agent tasks, preview feedback, accessibility, architecture, design-system, and consumer features.

In progress:

- workflow-kit automation;
- more reference consumer sites.

Not claiming yet:

- fully autonomous merges;
- fully automatic Vercel-comment-to-agent-PR loop;
- stable 1.0 API guarantees.

---

## Install and develop

```bash
git clone https://github.com/rainonej/portfolio-engine
cd portfolio-engine
pnpm install
pnpm check
pnpm build
pnpm lint
pnpm format
```

CI runs lint, typecheck/check, build, and packed consumer smoke tests on pushes and PRs.

Runtime requirements:

- Node >= 24
- pnpm >= 10
- Astro 6
- Tailwind CSS v4
- TypeScript 6
- Zod 4

---

## License

Apache-2.0.
