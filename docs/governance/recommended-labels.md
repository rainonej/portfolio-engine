# Recommended labels

This starter taxonomy supports the governance foundation and v5 board migration.

## Source

- `source:human`
- `source:vercel`
- `source:cms`
- `source:downstream`
- `source:agent`
- `source:workflow-kit`

## Task kind

- `type:epic`
- `task:feat`
- `task:bug-fix`
- `task:chore`
- `task:decision`
- `task:content`
- `task:docs`
- `task:research`
- `task:design`
- `task:migration`
- `task:release`

## Owner

- `owner:simple-ai`
- `owner:agentic-ai`
- `owner:human-dev`
- `owner:site-owner`

Rule: every task issue should have exactly one `owner:*` label.

## Agent state

- `agent:approved`
- `agent:needs-human-review`
- `agent:blocked`

Deprecated:

- `claude-ready` → use `agent:approved`

## Areas

- `area:schema`
- `area:engine-core`
- `area:editorial-theme`
- `area:admin-tools`
- `area:workflow-kit`
- `area:demo-site`
- `area:consumer-layout`
- `area:consumer-registry`
- `area:docs`
- `area:governance`
- `area:safety`
- `area:ci`
- `area:release`
- `area:downstream`
- `area:vercel`

## MVP

- `mvp:backbone`
- `mvp:product`
- `mvp:post-product`

## Lifecycle

- `lifecycle:blocked`
- `lifecycle:deferred`
- `lifecycle:needs-decision`
- `lifecycle:ready-for-review`
- `lifecycle:breaking-change`
- `lifecycle:migration`
