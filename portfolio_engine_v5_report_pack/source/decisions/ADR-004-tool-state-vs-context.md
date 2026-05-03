# ADR-004 — Tool state lives in `.portfolio-engine`, not `src/context`

## Decision

Use `src/context` for site-owner/brand/agent context.

Use `.portfolio-engine` for generated/tool state.

## Examples

```text
src/context/site-owner.json
src/context/brand-voice.json
src/context/agent-rules.md

.portfolio-engine/manifest.json
.portfolio-engine/upstream-tracking.json
.portfolio-engine/patch-ledger.json
```
