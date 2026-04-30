
# Current Repo Audit Against Target

## Executive summary

The current repo already has the correct core runtime idea: npm/TypeScript/Astro packages for schema, engine-core, and editorial-theme; route injection; virtual modules; config loading; demo-site reference consumer; named override configuration; CI and Vercel/demo-site planning.

It does not yet reflect v3 decisions:

- `workflow-kit` is still documented as reusable GitHub workflows / AI classifier.
- consumer config currently lives at top-level `config/*.json`.
- consumer context/registry folders do not exist.
- `.portfolio-engine` tool state does not exist.
- consumer registry support does not exist.
- demo-site does not showcase the final customization ladder.

## Current strengths worth preserving

### Four-layer runtime model

The root README already explains the core layers. Keep and update this, do not throw it away.

### Runtime package direction

Preserve the current dependency direction:

```text
editorial-theme depends on engine-core
engine-core depends on schema
```

Python workflow-kit should be optional and not required for rendering.

### Demo-site as reference consumer

Keep demo-site as canonical reference, but migrate it to v3 layout when runtime supports it.

### Existing override config concepts

Keep component overrides and style overrides, but clarify that override surface name may not equal upstream implementation filename.

## Current mismatches

| Area | Current | Target |
|---|---|---|
| workflow-kit | deferred GitHub workflows / AI classifier | optional Python/MCP package |
| config | `config/*.json` | `src/config/*.json` |
| context | absent | `src/context/site-owner.json`, `brand-voice.json`, `agent-rules.md` |
| registry | absent | `src/registry/portfolio-engine.registry.ts` |
| tool state | absent | `.portfolio-engine/*.json` |
| demo-site | basic reference consumer | customization showcase + v3 layout |

## Things current repo may do better

Current layout is easier technically because it already works. The target `src/config` layout is semantically cleaner but needs a migration/refactor.

Recommendation: support a compatibility window or explicit migration task rather than breaking demo-site immediately.
