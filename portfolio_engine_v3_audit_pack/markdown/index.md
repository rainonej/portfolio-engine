<div class="muted">Start here</div>

# Portfolio Engine v3 Audit and Roadmap Pack

This pack updates the previous v2 pack after several design decisions.

<div class="grid">
  <div class="card">
    <strong>Runtime stays Astro/npm.</strong><br>
    <code>schema</code>, <code>engine-core</code>, and <code>editorial-theme</code> remain
    npm/TypeScript/Astro packages.
  </div>
  <div class="card">
    <strong>Workflow-kit becomes Python/MCP.</strong><br>
    <code>packages/workflow-kit</code> is an optional Python package exposing MCP tools to
    Claude/Copilot.
  </div>
  <div class="card">
    <strong>Consumer layout uses <code>src</code>.</strong><br>
    Consumer site layers live under <code>src/config</code>, <code>src/content</code>,
    <code>src/context</code>, <code>src/registry</code>, <code>src/overrides</code>, etc.
  </div>
  <div class="card">
    <strong>Tool state moves to <code>.portfolio-engine</code>.</strong><br>
    Manifest, patch ledger, and upstream tracking are generated/tool state.
  </div>
</div>

## How to use this pack

1. Read Patch notes.
2. Read Target architecture.
3. Read Current repo audit.
4. Read Gap plan.
5. Reconcile Epics and Tickets against the live GitHub project board.

## Instruction for Claude

Do not blindly create every issue. Inspect current board, open/closed issues, linked PRs, and existing labels first.
