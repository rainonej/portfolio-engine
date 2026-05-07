# Governance

Portfolio Engine is maintained as an open-source project with a maintainer-led governance model.

## Project purpose

Portfolio Engine is a reusable backbone for personal, portfolio, and editorial websites. It supports shared runtime packages, clean downstream consumer repos, nontechnical site-owner workflows, optional admin tooling, optional AI/MCP workflow tooling, and safe consumer-to-upstream contribution loops.

## Maintainer authority

Jordan Rainone is the initial project maintainer and final decision-maker for project direction, package boundaries, public API stability, release timing, triage, licensing, governance changes, trademark policy, and acceptance or rejection of contributions.

Maintainer authority is not intended to discourage contributions. It exists to keep the open-source backbone coherent, safe, and maintainable.

## Decision-making model

Most decisions happen in issues or pull requests.

Use:

- `task:decision` for explicit human decisions;
- `owner:human-dev` for work that cannot be completed purely by an agent;
- `agent:approved` for issues approved for AI-assisted execution;
- `area:*` labels to route work by package or domain.

Major architectural decisions should be captured in ADR-style files under `docs/` or in the audit/roadmap report.

## Product tracks

Portfolio Engine recognizes these product tracks:

- Runtime Backbone;
- Demo / Reference Consumer;
- Agreni Site;
- Jordan Site;
- Admin Tools;
- Workflow Kit;
- Open-source Contribution Loop.

Downstream consumer sites are not second-class examples. They are real products that validate the engine.

## Contributions

Contributions may come from human developers, downstream consumer repos, AI coding agents acting under human supervision, site owners, and users reporting bugs or proposing features.

All contributions are subject to maintainer review.

## AI-assisted contributions

AI-assisted contributions are allowed and expected, but they must follow `AI_USAGE.md`.

Contributors are responsible for what they submit, regardless of whether an AI system helped generate it.

## Downstream-originated contributions

Downstream consumers are encouraged to contribute generalized improvements upstream.

A downstream-originated feature should explain:

- What consumer need triggered this?
- Why is this a general engine capability rather than a site-specific workaround?
- Which layer does it belong to?
- Could content/config/context/registry/override have solved it?
- Does it introduce private data or consumer-specific assumptions?

## Releases

The maintainer controls releases. Release candidates should document package versions, migration notes, breaking changes, downstream impact, and changeset entries where applicable. Published changelogs should include **agent-oriented migration notes** (`#### Agent migration` in changeset bodies) when consumers must update content, config, or imports; see [`docs/workflows/changelog-agent-migration.md`](docs/workflows/changelog-agent-migration.md).

## Security

Security issues should follow `SECURITY.md`, not public issue discussion.

## Changes to governance

Governance changes require maintainer approval and should be documented in a pull request.
