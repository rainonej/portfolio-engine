# AI Workflow

This document describes how the AI-assisted development workflow operates for portfolio-engine and its downstream consumer `agreni-site`.

## Overview

Changes to `agreni-site` are classified by `@portfolio-engine/workflow-kit` into one of six categories. The category determines whether the change stays local, needs a shared engine fix, or requires human judgment.

See [../../docs/packages/workflow-kit.md](../packages/workflow-kit.md) for the classification contract.

## AI agents

- **Agentic AI** (`owner:agentic-ai`) — handles multi-step codebase-wide tasks
- **Simple AI** (`owner:simple-ai`) — handles targeted single-file or config changes

## Workflow triggers (in agreni-site)

| Trigger                          | Action                                    |
| -------------------------------- | ----------------------------------------- |
| `automation:plan` label on issue | Planner agent shapes the issue into tasks |
| `claude-ready` label on issue    | Claude agent executes the task            |
| `@claude` comment                | Claude agent responds to the comment      |

## Status

Stub — detailed workflow documented in Epic 8 (Task 8.1–8.4).
