# AGENTS.md

This file defines how AI coding agents should work in `portfolio-engine`.

Agents are welcome, but they are not maintainers. An agent may draft a change. A human remains responsible for the PR.

## Read first

Before editing code, read:

1. The issue body and acceptance criteria.
2. `VISION.md`.
3. `ARCHITECTURE.md`.
4. `CONTRIBUTING.md`.
5. `AI_USAGE.md`.
6. `docs/project-management.md`.
7. `docs/issue-labels.md`.
8. Any package README for the package being changed.
9. Downstream context if the issue originated in a consumer site.

## Core rule

Prefer the narrowest valid layer.

For downstream/site requests, try this order:

1. content;
2. config;
3. context;
4. supported override;
5. consumer registry/local route;
6. temporary downstream workaround;
7. upstream feature request;
8. upstream package change.

Do not add consumer-specific hacks to upstream packages.

## Safe agent tasks

Agents may attempt these when the issue is scoped and labeled appropriately:

- documentation improvements;
- setup friction fixes;
- small bug fixes with reproduction steps;
- small layout fixes;
- adding examples;
- updating issue templates;
- adding visual QA guidance;
- writing tests/checks for existing behavior;
- adding a component variant behind an existing schema;
- implementing a well-specified downstream content/config change;
- fixing TypeScript, lint, or formatting errors.

## Tasks requiring human approval

Do not attempt these without explicit maintainer approval:

- changing `packages/schema` public contracts;
- changing route ownership conventions;
- changing override-surface contracts;
- adding dependencies;
- changing build/deploy behavior;
- changing package exports;
- changing governance, license, security, or DCO docs;
- broad refactors;
- changes affecting all consumer sites;
- adding or changing authentication/security-sensitive code;
- mutating production Vercel settings;
- changing release or publishing workflows.

## Hard prohibitions

Agents must not:

- commit secrets, tokens, private keys, or credentials;
- put private downstream content into public repo paths;
- edit `node_modules`;
- vendor package source into downstream consumer repos;
- bypass CI or checks;
- fabricate tests or claim tests passed if they did not run;
- claim visual QA was performed unless a browser was actually inspected;
- invent credentials, users, testimonials, customer proof, or project adoption claims;
- add fake testimonials;
- claim full automation that is not implemented.

## Package boundaries

| Layer                      | Owns                                                                          | Avoid                                             |
| -------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------- |
| `packages/schema`          | Zod schemas and shared types                                                  | Astro/Vite/runtime concerns                       |
| `packages/engine-core`     | Astro integration, config loading, route registry, virtual modules, manifests | Theme markup/design                               |
| `packages/editorial-theme` | Layouts, routes, components, default design, override surfaces                | Private downstream data                           |
| `packages/admin-tools`     | Optional admin/reviewer UI and content editing surfaces                       | Required runtime assumptions                      |
| `packages/workflow-kit`    | Reusable downstream workflow tooling and templates                            | Product-specific policy hidden from docs          |
| `examples/demo-site`       | Canonical public showcase                                                     | Fake customer proof or personal-site sales funnel |
| downstream repos           | content, identity, brand, config, overrides, local pages                      | upstream package internals                        |

## Required checks

Before marking a code change complete, run the relevant subset:

```bash
pnpm lint
pnpm check
pnpm build
```

For demo-site work:

```bash
pnpm --filter demo-site check
pnpm --filter demo-site build
```

For package changes, run package-local checks if available.

If a command cannot be run, say exactly why.

## Visual QA

For UI/design/layout changes, inspect the affected routes in a browser.

Default routes to check for demo-site work:

- `/`
- `/vision`
- `/workflow`
- `/architecture`
- `/features`
- `/work`
- `/contribute`

Check at least:

- desktop;
- mobile;
- navigation;
- console errors;
- overflow/clipping;
- focus and link states;
- obvious contrast issues.

Do not treat code inspection as visual QA.

## Vercel and external services

Use read-only inspection first.

Do not mutate:

- production branch;
- domains;
- environment variables;
- deployment protection;
- production settings;
- OAuth app settings;

without explicit human confirmation.

## AI disclosure

If AI materially drafted a PR, the PR should say so.

Example:

> This PR was drafted with assistance from an AI coding agent and reviewed by me.

The human submitter is responsible for the code.

## Stop conditions

Stop and ask for human review when:

- requirements are ambiguous;
- the issue requires a product decision;
- multiple layers could reasonably own the change;
- the change touches security, auth, publishing, or governance;
- the change requires secrets or UI access;
- tests fail and the fix is not obvious;
- the agent would need to rewrite broad areas to proceed.

## PR expectations

Every PR should include:

- summary;
- linked issue;
- target layer;
- files changed;
- AI assistance disclosure if applicable;
- commands run;
- visual QA status if applicable;
- remaining risks or follow-ups.

Keep PRs small.
