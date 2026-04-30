# Dependency Policy

This document records the approved and banned external dependencies for portfolio-engine packages. All new dependencies must be reviewed against this policy before being added.

## Approved

| Package                                            | Used in                         | Reason                                                                                                                                                                         |
| -------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `astro`                                            | all packages (peerDep)          | Core framework                                                                                                                                                                 |
| `zod`                                              | `@portfolio-engine/schema`      | Schema validation and type inference                                                                                                                                           |
| Native `AstroIntegration` + Vite (virtual modules) | `@portfolio-engine/engine-core` | First-party integration per [Astro Integration Kit migration](https://astro-integration-kit.netlify.app/migration-guide/) — the `astro-integration-kit` package is deprecated. |
| `@changesets/cli`                                  | workspace root (devDep)         | Release automation                                                                                                                                                             |
| `typescript`                                       | all packages (devDep)           | Type checking                                                                                                                                                                  |

## Banned

| Package                | Reason                                                                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `astro-theme-provider` | Would be a long-term trust dependency we cannot control. engine-core implements its own route injection and virtual modules first-party.       |
| `astro-pages`          | Route injection is implemented first-party in engine-core (Task 3.4). A third-party dependency here creates version coupling we cannot absorb. |
| `astro-public`         | Packaged public-dir support is an explicit v1 non-goal (Task 3.9). Consumers manage their own public assets.                                   |

## Adding new dependencies

Before adding any new external dependency:

1. Check whether it can be implemented simply first-party.
2. Evaluate maintenance status, license (MIT/Apache-2.0 preferred), and size.
3. Consider whether a future version bump could break our API contract with downstream.
4. Add an entry to this document explaining the decision.
