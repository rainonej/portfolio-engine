# Packet 01 — Upstream Portfolio Engine changes

Repository: `rainonej/portfolio-engine`

## Goal

Add canonical project/story visibility support to Portfolio Engine so downstream consumer sites can keep unfinished or not-yet-public work in the repository without exposing it on public pages.

## Required field

```yaml
visibility: published | unlisted | draft
```

Default: `published`.

## Semantics

| State       | Public lists | Homepage featured work | Detail route | Use case                |
| ----------- | -----------: | ---------------------: | -----------: | ----------------------- |
| `published` |          yes |       yes, if selected |          yes | finished public stories |
| `unlisted`  |           no |                     no |          yes | review/share links      |
| `draft`     |           no |                     no |           no | unfinished work         |

## Why upstream

Portfolio Engine is an upstream/downstream architecture. Downstream consumers should not need local one-off filtering to keep unfinished work out of public routes.

## Included files

- `AGENT_PROMPT_UPSTREAM.md`
- `PROJECT_VISIBILITY_SPEC.md`
- `IMPLEMENTATION_GUIDE.md`
- `TEST_PLAN.md`
- `proposed-files/packages/editorial-theme/src/lib/collections.ts`
- `proposed-files/packages/schema/src/content-primitives.project-visibility.snippet.ts`
- `proposed-files/examples/demo-site/src/content.config.project-schema.snippet.ts`
- `proposed-files/packages/editorial-theme/src/pages/work/[slug].astro.patch.md`
- `proposed-files/packages/editorial-theme/src/pages/index.astro.patch.md`
- `proposed-files/docs/downstream/project-visibility.md`

Suggested branch: `feat/project-visibility-for-work-items`.
