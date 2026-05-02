# Big Picture Goals

Work is organized into **seven product tracks (A–G)**: the runtime engine (A), demo-site reference (B), **agreni-site** (C) and **jordan-site** (D) as first consumer products, optional **admin-tools** (E) and **workflow-kit** (F), and **governance, labels, and safety** (G). The roadmap uses two gates — **Backbone MVP** after Phase 3 and **Product MVP** after Phase 4 — detailed in the MVP roadmap and product tracks sections.

## Executive purpose

`portfolio-engine` is meant to become a reusable open-source backbone for personal, portfolio, and editorial websites. It should let Jordan maintain one shared engine while keeping `agreni-site`, `jordan-site`, and future consumer sites cleanly separated.

The project is not merely an Astro theme. It is a layered system:

- required runtime packages that render the site;
- private consumer repos that own content/config/context/assets;
- optional admin UI so nontechnical people can edit the site without touching code;
- optional Python/MCP workflow-kit so Claude/Copilot can inspect, plan, validate, and escalate site changes;
- an open-source contribution protocol where consumer needs can become upstream feature requests or PRs.

## Goal 1 — Stable reusable backbone

The first priority is making the required runtime packages stable enough that private consumer repos can use them without copying package source.

The MVP backbone is:

```text
@portfolio-engine/schema
@portfolio-engine/engine-core
@portfolio-engine/editorial-theme
examples/demo-site
CI/build/check/docs
```

At **Backbone MVP**, a downstream repo should be able to install or link the theme, provide config/content/assets, build locally, and deploy to Vercel. The consumer extension registry, admin UI, and Python/MCP tools are valuable but not required for that first stable backbone.

## Goal 2 — Clear consumer repo model

A consumer repo should be easy for a person or agent to understand:

```text
src/config       website settings
src/content      rendered site content
src/context      site-owner and brand context
src/registry     local extension declarations
src/overrides    named theme overrides
src/components   local reusable widgets/components
src/pages-local  local full pages
public           public assets, served from site root
.portfolio-engine generated state and tool metadata
```

This layout keeps `config` and `content` as siblings, but preserves Astro's normal `src/` and `public/` concepts.

## Goal 3 — Vibe-coder and nontechnical usability

A consumer should be able to use Claude/Copilot without learning the whole codebase. The agent should inspect available levers, plan changes, validate layer boundaries, and escalate upstream only when necessary.

Example request:

```text
Rewrite this post in my brand voice, change the global font, and add an interactive Snake game.
```

The expected decomposition is:

- post rewrite → `src/content`;
- global font → `src/config/theme.json`;
- Snake game → local registry/component if supported, otherwise upstream feature request.

## Goal 4 — Consumer-to-contributor feedback loop

Consumers are also potential contributors.

The desired flywheel:

```text
consumer asks for feature
→ agent tries local levers
→ missing reusable capability identified
→ upstream issue or PR proposed
→ maintainer reviews/generalizes
→ package releases
→ consumer updates dependency and removes workaround
```

This is how the project can crowdsource consumer-agent compute without merging one-off consumer hacks into the upstream engine.

## Goal 5 — Optional admin UI

`admin-tools` is optional. Its purpose is to expose the site model in a UI:

- sitemap/routes;
- content collections;
- config/theme/navigation;
- public assets;
- site-owner context;
- brand voice;
- registry entries;
- upstream blockers and patches.

It is not needed for Backbone MVP, but the data model should be admin-friendly from the beginning.

## Goal 6 — Optional Python/MCP workflow-kit

`workflow-kit` is optional Python tooling. It exposes MCP tools to Claude/Copilot:

```text
inspect_site
plan_request
validate_plan
plan_upstream
patch_ledger
```

It should not be required for rendering. It is an agent-facing product layer.
