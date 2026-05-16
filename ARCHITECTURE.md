# Architecture

Portfolio Engine has two architectures:

1. A software architecture: schema → engine-core → editorial-theme → consumer site.
2. A contribution architecture: site-owner request → scoped issue → agent/human PR → review → shared engine.

The software architecture keeps generated changes from spreading everywhere. The contribution architecture keeps cheap implementation from becoming unreviewed chaos.

## System map

```text
Downstream consumer repo
────────────────────────────────────────────────────────
src/config/*.json                site, nav, theme, features
src/content/**                   profile, work, writing, etc.
src/context/**                   identity, brand voice, agent context
src/overrides/**                 named component/style overrides
src/pages-local/**               local pages not owned by theme
src/registry/*.json              local route registry
public/**                        consumer-owned static assets

Consumes:

@portfolio-engine/editorial-theme
@portfolio-engine/engine-core
@portfolio-engine/schema
(optional) @portfolio-engine/admin-tools
(optional) @portfolio-engine/workflow-kit
```

## Package layers

### `@portfolio-engine/schema`

Owns the framework-free contracts:

- site config shape;
- navigation config shape;
- theme config shape;
- feature flags;
- content entry types;
- route registry records;
- override-surface metadata.

Rules:

- no Astro dependency;
- no Vite dependency;
- no theme markup;
- no downstream-specific content.

### `@portfolio-engine/engine-core`

Owns the Astro integration mechanics:

- load config;
- validate against schemas;
- expose virtual modules;
- resolve route registries;
- resolve override maps;
- inject routes;
- write build manifests.

Rules:

- no private downstream assumptions;
- no theme-specific copy;
- no design decisions beyond technical contracts.

### `@portfolio-engine/editorial-theme`

Owns the default user-facing site surface:

- layouts;
- theme routes;
- default pages;
- components;
- global CSS;
- design token resolution;
- named override surfaces;
- safe embed components.

Rules:

- expose explicit override surfaces;
- avoid arbitrary file-path overrides;
- keep prop contracts stable across compatible releases;
- do not hard-code a real downstream user's private data.

### `@portfolio-engine/admin-tools`

Optional package for admin/reviewer surfaces.

Owns:

- `/admin`;
- content inventory;
- optional GitHub-backed editing;
- local `devBypass` behavior.

Rules:

- optional, not required for basic static sites;
- security-sensitive changes require human review.

### `@portfolio-engine/workflow-kit`

Workflow scaffolding for downstream repos.

May own:

- check scripts;
- GitHub Actions templates;
- issue templates;
- AI prompts;
- editor/MCP templates;
- visual QA helpers.

Rules:

- must distinguish shipped behavior from planned automation;
- must not imply fully autonomous merge/deploy unless implemented and tested.

## Route ownership

Portfolio Engine supports three route ownership modes:

1. Theme-injected routes.
2. Consumer-local registry routes.
3. Ordinary downstream `src/pages` routes.

Use the narrowest mode that solves the problem.

Theme routes are for common portfolio/professional site screens.

Consumer-local registry routes are for site-specific screens that still want to participate in the engine manifest/registry model.

Ordinary `src/pages` routes are for full downstream ownership.

## Override surfaces

Consumers should override named surfaces, not arbitrary internal files.

A named surface has:

- a stable name;
- documented props;
- a default implementation;
- a known host page or layout;
- compatibility expectations.

This prevents silent breakage when internal theme files move.

## Design tokens

Consumer sites own their own visual identity through config and safe overrides.

The theme should expose semantic tokens, not require consumers to chase arbitrary class names.

Recommended token categories:

- surface;
- text;
- accent;
- border;
- typography.

## Why this architecture matters for agents

Agents are most useful when the repo makes wrong changes hard.

Layer rules help an agent choose the right place:

- content changes belong in `src/content`;
- brand/config changes belong in `src/config`;
- local pages belong in `src/pages-local` and the registry;
- site-specific component changes belong in `src/overrides`;
- reusable behavior belongs upstream in `@portfolio-engine/*`.

That boundary is what makes the project safe for consumer-contributors. A nontechnical person can request a feature; an agent can implement the narrowest valid layer; a maintainer can review whether the work belongs downstream or upstream.

## Downstream-to-upstream promotion

A downstream workaround should become upstream only when it is:

- recurring;
- generalizable;
- compatible with existing contracts;
- free of private content;
- documented;
- tested or visually verified;
- useful to multiple consumer sites.

The upstream PR should explain:

- what downstream need triggered it;
- why content/config/override was insufficient;
- what new contract is added;
- how downstream workarounds can be removed after release.

## Non-goals

Portfolio Engine is not:

- a universal CMS;
- a fully autonomous AI-maintained app;
- a no-code SaaS builder;
- a plugin marketplace;
- a reason to accept unreviewed AI-generated code.
