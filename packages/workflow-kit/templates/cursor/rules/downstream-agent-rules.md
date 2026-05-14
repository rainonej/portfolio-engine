# Downstream agent rules — Portfolio Engine sites

These rules apply when you are an AI agent making changes to a downstream Portfolio Engine site.

## Read before acting

1. Read `src/context/agent-rules.md` — site-specific instructions for this repo.
2. Read `src/context/brand-voice.json` — tone and voice guidance for copy changes.
3. Check `src/registry/portfolio-engine.registry.json` — active routes and overrides.

## Content changes (safe by default)

Adding or editing files under `src/content/` and `src/config/` is safe. These files do not
affect the engine or other downstream repos.

## Route/template/component changes (requires care)

Before editing `src/pages-local/`, `src/overrides/`, or package-level components:

- Confirm the change is to rendering logic, not to authored content.
- Authored content belongs in `src/content/`, not in Astro files.
- Run `node scripts/check-content-boundaries.mjs` after your change.

## Schema changes

- Use primitives from `@portfolio-engine/schema` (MetricSchema, EvidenceItemSchema, etc.).
- Keep schemas `.strict()`. Do not introduce `.passthrough()`.
- New required fields must also be added to all existing content files.

## Engine upgrades

When the upstream `CHANGELOG.md` says workflow-kit templates changed, compare your local
scripts and CI against the new templates before accepting the upgrade. Copy intentionally —
do not blindly overwrite local customizations.

## Do not

- Modify `node_modules/` or `packages/` (those are read-only upstream).
- Add content to route files or templates.
- Invent new schema fields without updating all content files.
- Use `as SomeType` casts on `entry.data` from content collections.
