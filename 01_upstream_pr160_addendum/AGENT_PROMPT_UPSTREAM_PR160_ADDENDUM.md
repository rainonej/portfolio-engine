# Agent prompt: address review feedback on Portfolio Engine PR #160

You are working in `rainonej/portfolio-engine` on PR #160, branch `feat/project-visibility-for-work-items`, base `dev`.

## Context

The PR adds canonical `visibility: published | unlisted | draft` support to project/work entries.

The direction is right, but automated review caught an important upgrade-window bug:

- Existing downstream sites may upgrade `@portfolio-engine/editorial-theme` before adding `visibility` to their local project schema/frontmatter.
- In that case, `entry.data.visibility` can be `undefined`.
- Current PR code checks `entry.data.visibility === 'published'`, which hides all legacy projects from public lists.
- That contradicts the PR description: “Missing `visibility` field defaults to `published` — no migration needed.”

## Required fix

Update `packages/editorial-theme/src/lib/collections.ts` so the runtime behavior treats missing visibility as `published`.

Use a helper like:

```ts
export function getProjectVisibility(entry: ProjectEntry): ProjectVisibility {
  return entry.data.visibility ?? 'published';
}

export function isProjectListed(entry: ProjectEntry): boolean {
  return getProjectVisibility(entry) === 'published';
}

export function isProjectBuildable(entry: ProjectEntry): boolean {
  return getProjectVisibility(entry) !== 'draft';
}
```

Also change:

```ts
visibility: ProjectVisibility;
```

to:

```ts
visibility?: ProjectVisibility;
```

Reason: the structural type should accurately represent consumers during the upgrade window, where the local schema may not yet populate this field.

## Tests / verification to add

Do not rely only on the demo-site schema that already includes `visibility`. That does not catch the compatibility bug.

Add at least one of the following:

1. A small unit-style test for the predicate helpers using mocked `ProjectEntry` objects:
   - `visibility: undefined` => listed true, buildable true
   - `visibility: 'published'` => listed true, buildable true
   - `visibility: 'unlisted'` => listed false, buildable true
   - `visibility: 'draft'` => listed false, buildable false

2. A legacy fixture consumer whose project schema does not define `visibility`, then verify published/default projects still appear on public work pages.

The direct helper test is probably easiest and should live near existing package tests if there is an established place. If not, create a minimal test under the relevant package and wire it into the existing package test command only if the repo already has test conventions.

## Documentation fix

In `docs/downstream/project-visibility.md`, change the recommended workflow wording from “stories” to “projects” or “work entries.” This doc is about projects/work entries, not writing/blog stories.

Suggested wording:

```md
## Recommended workflow

1. Start unfinished work entries as `draft`.
2. Move to `unlisted` when you want a review link.
3. Move to `published` when the project is ready for public indexes.
```

## Validation

Run:

```bash
pnpm format:write
pnpm lint
pnpm check
```

Also verify build output / preview behavior:

- published work item appears in `/work` and has detail route
- unlisted work item does not appear in `/work` but has detail route
- draft work item does not appear in `/work` and has no detail route
- legacy project entry with omitted `visibility` behaves as published

## PR comment after changes

Leave a PR comment summarizing:

- missing visibility now normalizes to `published`
- `ProjectData.visibility` is optional for upgrade compatibility
- test/fixture added for omitted visibility
- docs wording fixed
