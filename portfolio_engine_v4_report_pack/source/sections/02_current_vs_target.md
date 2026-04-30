# Current Repo vs Target

## What the current repo already does well

The current root README already has the right runtime mental model: consumer site, editorial-theme, engine-core, and schema. That should be preserved and refined, not discarded.

The demo-site is already the canonical reference consumer. That should remain true. The demo-site should eventually become both a working example and a customization showcase.

The engine already has an override-resolution concept. It validates supported component surfaces and style override paths. That is a strong starting point.

The existing GitHub issues already cover useful CI, Vercel, Copilot, docs, and demo work. Claude should reconcile those before creating new issues.

## Main mismatches

### Mismatch 1 — workflow-kit description is obsolete

Current docs describe workflow-kit as reusable GitHub Actions workflows and an AI classifier. The new target is an optional Python/MCP package exposing real tools to Claude/Copilot.

### Mismatch 2 — config path needs migration

Current docs and demo-site use:

```text
config/*.json
src/content/**
public/**
```

Target layout uses:

```text
src/config/*.json
src/content/**
src/context/**
src/registry/**
src/overrides/**
public/**
```

Migration should be deliberate and ideally compatibility-aware.

### Mismatch 3 — no formal context layer

Target adds structured context:

```text
src/context/site-owner.json
src/context/brand-voice.json
src/context/agent-rules.md
```

`site-owner.json` and `brand-voice.json` should be admin-renderable and AI-readable.

### Mismatch 4 — no consumer registry yet

Target adds:

```text
src/registry/portfolio-engine.registry.ts
```

This is post-MVP. It allows local pages and embeds without editing upstream packages.

### Mismatch 5 — no `.portfolio-engine` tool state yet

Target adds:

```text
.portfolio-engine/manifest.json
.portfolio-engine/state.json
.portfolio-engine/upstream-tracking.json
.portfolio-engine/patch-ledger.json
```

This keeps machine/tool state out of `src/context`.

### Mismatch 6 — override rendering needs audit

The repo validates override names. The theme must also actually render consumer overrides instead of directly rendering only default components. If that bridge is missing, it is MVP-relevant.

## Where the current repo may be better

The current layout is simpler for classic Astro users. The target layout is cleaner for long-term AI and admin tooling, but the migration should not break the currently working demo-site.

The README should not bury new users under all optional features. It should lead with the runtime MVP and then explain optional admin/MCP layers.
