# Upstream Agent Prompt — Add project visibility support

You are working in `rainonej/portfolio-engine`.

## Objective

Add canonical visibility support for work/project content.

```yaml
visibility: published | unlisted | draft
```

Default: `published`.

## Behavior

- `published`: appears in homepage/work indexes and generates a detail page.
- `unlisted`: hidden from homepage/work indexes but generates a detail page.
- `draft`: hidden from homepage/work indexes and does not generate a detail page.

## Required changes

1. Add `ProjectVisibilitySchema` to `@portfolio-engine/schema`.
2. Update demo-site project schema to include the field with default.
3. Update `packages/editorial-theme/src/lib/collections.ts`:
   - add `ProjectData.visibility`
   - add helper predicates
   - make `getProjects()` support `visibility: listed | buildable | all`
4. Update default work detail static paths to use `getProjects({ visibility: 'buildable' })`.
5. Homepage/index work lists should use `listed` projects only.
6. Add downstream docs.
7. Add demo/fixture content for `unlisted` and `draft`.

## Suggested API

```ts
export type ProjectVisibility = 'published' | 'unlisted' | 'draft';
export type ProjectVisibilityFilter = 'listed' | 'buildable' | 'all';

export async function getProjects(opts?: {
  visibility?: ProjectVisibilityFilter;
}): Promise<ProjectEntry[]>;
```

Filter meanings:

- `listed`: only `published`
- `buildable`: `published` + `unlisted`
- `all`: every entry, including drafts

Default should be `listed`.

## Acceptance criteria

- Existing projects without `visibility` behave as published.
- Draft projects do not appear on homepage/work index and do not generate detail routes.
- Unlisted projects do not appear on homepage/work index but do generate detail routes.
- Writing draft behavior is unchanged.
- `pnpm lint`, `pnpm check`, and `pnpm build` pass.
