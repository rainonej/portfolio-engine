# ADR-003: generated/tool state lives in `.portfolio-engine`

## Decision
Tool state is not site-owner context.

Use `.portfolio-engine/manifest.json`, `.portfolio-engine/state.json`, `.portfolio-engine/upstream-tracking.json`, `.portfolio-engine/patch-ledger.json`.

Use `src/context` for `site-owner.json`, `brand-voice.json`, and `agent-rules.md`.
