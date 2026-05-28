# Addendum for Portfolio Engine PR #160

This addendum updates the original upstream packet after reviewing `origin/dev` and PR #160.

PR #160 is directionally correct and should remain focused on canonical project/work visibility support:

- `published`: visible in public lists and detail route generated
- `unlisted`: hidden from public lists, detail route generated
- `draft`: hidden from public lists, detail route not generated

However, before merge, it needs a compatibility fix. The current implementation requires `ProjectData.visibility` and treats missing `visibility` as not listed. That contradicts the intended no-migration behavior for existing downstream consumers.

## Required before merge

1. Treat missing project visibility as `published` in runtime predicates.
2. Make `ProjectData.visibility` optional in `packages/editorial-theme/src/lib/collections.ts`.
3. Add a regression test or fixture proving a legacy consumer without `visibility` in frontmatter still shows existing projects.
4. Change doc wording from “stories” to “projects” / “work entries” in `docs/downstream/project-visibility.md`.
5. Only merge after review threads are resolved and the PR verifies both new-schema and legacy-schema behavior.
