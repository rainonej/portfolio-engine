# Gap Plan: Where We Are vs Where We Need To Be

## Complete overhauls

### workflow-kit

Current docs describe workflow-kit as reusable GitHub workflows plus AI classifier. Target is an optional Python/MCP package.

Change type: complete rewrite.

### README package model

Current README lists workflow-kit as a package but does not explain required vs optional package classes. Target README must clearly separate:

- required runtime packages;
- optional admin-tools;
- optional workflow-kit.

Change type: major docs rewrite.

## Medium refactors

### Config path layout

Current: `config/*.json`.

Target: `src/config/*.json`.

This affects docs, demo-site, config loader, examples, Vercel/baseUrl issue references, and workflow-kit inspection logic.

### Override bridge

Current engine-core validates supported overrides. Need audit to confirm theme rendering actually uses override map at runtime.

Change type: implementation audit and likely theme refactor.

### Manifest generation

No current `.portfolio-engine/manifest.json`. Target requires generated manifest for tools/admin/future registry.

Change type: new engine-core feature.

## Small tweaks

### Folder READMEs

Add small README files under consumer-owned folders.

### Public asset docs

Explain that `public/` is served from site root and everything inside is public.

### Issue label docs

Add labels for workflow-kit, consumer-registry, safety, downstream, patch-lifecycle.

## Preserve

- core package split;
- dependency direction;
- demo-site as reference consumer;
- CI/check/build issues already open;
- Vercel demo deployment planning;
- named override concept.
