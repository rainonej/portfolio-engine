# ADR-001 — Required runtime packages vs optional packages

## Decision

The required runtime backbone is:

```text
@portfolio-engine/schema
@portfolio-engine/engine-core
@portfolio-engine/editorial-theme
```

Optional packages are:

```text
@portfolio-engine/admin-tools
portfolio-engine-workflow-kit
```

## Rationale

The site must render without admin-tools or workflow-kit.

Admin-tools is optional UI for nontechnical editing.

Workflow-kit is optional Python/MCP tooling for Claude/Copilot.
