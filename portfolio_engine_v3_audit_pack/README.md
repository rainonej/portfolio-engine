# Portfolio Engine v3 Audit Pack

Generated: 2026-04-30

This pack supersedes `portfolio_engine_context_pack_v2` where the two disagree.

## Key v3 decisions

- `workflow-kit` is an optional Python/MCP package.
- Claude/Copilot access tools through MCP.
- Runtime packages remain npm/Astro/TypeScript.
- Consumer layout uses `src/config`, `src/content`, `src/context`, `src/registry`, `src/overrides`, `src/components`, `src/pages-local`, plus top-level `public`.
- Tool state lives in `.portfolio-engine`.

## Start here

Open:

```text
report/index.html
```

## Instructions for Claude

1. Inspect the live GitHub Project board and open/closed issues first.
2. Do not blindly create every issue here.
3. Reconcile against existing issues, especially CI/Copilot/Vercel/docs issues.
4. Update existing issues where possible; create new epics/tickets only where missing.
