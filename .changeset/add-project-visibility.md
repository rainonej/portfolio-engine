---
'@portfolio-engine/schema': minor
'@portfolio-engine/editorial-theme': minor
---

Add canonical project visibility support (`published | unlisted | draft`).

**`@portfolio-engine/schema`**

- `ProjectVisibilitySchema` — Zod enum for the three visibility states
- `ProjectVisibility` — inferred TypeScript type

**`@portfolio-engine/editorial-theme`**

- `ProjectData.visibility` field added (structurally required; defaults to `published` at runtime for legacy entries without the field)
- `getProjectVisibility(entry)` — normalizer that treats missing/undefined visibility as `published`
- `isProjectListed(entry)` — true for `published` entries only
- `isProjectBuildable(entry)` — true for `published` and `unlisted`; false for `draft`
- `getProjects()` now accepts `opts.visibility`:
  - `'listed'` (default) — published only; safe for all public list pages
  - `'buildable'` — published + unlisted; use in `getStaticPaths` for detail routes
  - `'all'` — every entry including drafts; for admin/editorial tools
- `getProjectById()` now accepts `opts.visibility` and defaults to `buildable` (direct links to drafts return `undefined`)

**Behavior change:** `getProjects()` with no arguments now returns only `published` entries (previously returned all). Public pages are unaffected. Any custom page that previously relied on `getProjects()` returning draft or unlisted entries should switch to `getProjects({ visibility: 'all' })`.

#### Agent migration

- **Packages:** `@portfolio-engine/schema`, `@portfolio-engine/editorial-theme`
- **Consumer paths:** `src/content.config.ts`
- **Actions:**
  1. Add `ProjectVisibilitySchema` to your schema imports from `@portfolio-engine/schema`.
  2. Add `visibility: ProjectVisibilitySchema.optional().default('published')` to your `projects` collection schema.
  3. Existing project entries without a `visibility` field continue to behave as published — no frontmatter migration required.
  4. See `docs/downstream/project-visibility.md` for full usage and workflow guidance.
