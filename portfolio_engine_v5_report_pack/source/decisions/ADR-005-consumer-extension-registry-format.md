# ADR-005 — Consumer extension registry: JSON on disk + Zod in `@portfolio-engine/schema`

## Decision

The consumer extension registry is a **JSON file** at the default path `src/registry/portfolio-engine.registry.json` (configurable via integration options). **Validation and TypeScript types** come from **Zod** schemas exported by `@portfolio-engine/schema` (`ConsumerPortfolioEngineRegistrySchema`, `parseConsumerPortfolioEngineRegistry`).

We intentionally use a **hybrid** shape: human-editable JSON for the contract on disk; machine-checked parsing at build time in `engine-core` and optional reuse in consumer tooling.

## Rationale

- **Safety without executing consumer code** — the Astro integration can validate structure without loading arbitrary TypeScript from the consumer repo at integration setup time.
- **Admin-tools readability** — `@portfolio-engine/admin-tools` already treats `src/registry` as an allowed edit root; JSON is straightforward to load, diff, and save in the admin file editor and in GitHub Contents API flows.
- **Version gate** — the top-level `version` field (currently literal `1`) allows coordinated format evolution alongside engine releases.

## Non-goals (for this ADR)

- Registry-authored **local components/embeds** (separate epic tasks).
- Replacing JSON with a TypeScript-only registry module (rejected for the reasons above; consumers may still wrap `parseConsumerPortfolioEngineRegistry` in their own scripts).

## Consequences

- New fields require bumping `CONSUMER_REGISTRY_SUPPORTED_VERSION` / schema literals and engine handling in lockstep.
- Downstream docs: `docs/downstream/custom-page-via-registry.md`.
