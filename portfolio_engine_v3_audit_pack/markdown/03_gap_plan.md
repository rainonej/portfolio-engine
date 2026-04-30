
# Gap Plan: Current Repo → Target Architecture

## Current → target map

| Area | Current | Target | Change type |
|---|---|---|---|
| Runtime packages | npm packages | same | preserve |
| Workflow-kit | deferred npm-ish docs package | Python/MCP package | overhaul |
| Config path | `config/*.json` | `src/config/*.json` | refactor/migrate |
| Content path | `src/content/**` | `src/content/**` | preserve |
| Context | absent | `src/context/*.json/.md` | add |
| Registry | absent | `src/registry/portfolio-engine.registry.ts` | add |
| Overrides | supported in config | `src/overrides` | preserve/clarify |
| Public assets | `public/**` | `public/**` | preserve/clarify |
| Tool state | absent | `.portfolio-engine/*.json` | add |
| Demo-site | reference consumer | reference + showcase | expand |

## What needs complete overhaul

- `packages/workflow-kit`
- workflow-kit docs
- README workflow-kit section

## What needs medium refactor

- config path loading
- demo-site layout
- override rendering bridge
- manifest generation

## What needs small tweaks

- folder READMEs
- public README
- label taxonomy
- contributor docs and PR templates

## Recommended order

1. Record decisions and update docs.
2. Add labels/governance/protocol.
3. Define layer-boundary docs and consumer layout.
4. Refactor config path support.
5. Add runtime registry/manifest contracts.
6. Implement consumer registry extension support.
7. Build Python/MCP workflow-kit read-only/planning tools.
8. Update demo-site.
9. Add contribution safety gates.
10. Migrate private agreni-site.
