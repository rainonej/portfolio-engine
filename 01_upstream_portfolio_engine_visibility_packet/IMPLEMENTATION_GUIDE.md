# Implementation guide

## 1. Schema primitive

Add to `packages/schema/src/content-primitives.ts`:

```ts
export const ProjectVisibilitySchema = z.enum(['published', 'unlisted', 'draft']);
export type ProjectVisibility = z.infer<typeof ProjectVisibilitySchema>;
```

Export it through the package public API.

## 2. Demo-site content config

In `examples/demo-site/src/content.config.ts`, add:

```ts
visibility: ProjectVisibilitySchema.optional().default('published'),
```

inside the projects schema.

## 3. Editorial-theme wrappers

Use the full proposed replacement file:

`proposed-files/packages/editorial-theme/src/lib/collections.ts`

## 4. Work detail route

Update `packages/editorial-theme/src/pages/work/[slug].astro` so static paths use:

```ts
const projects = await getProjects({ visibility: 'buildable' });
```

## 5. Homepage and work indexes

Use `getProjects()` or `getProjects({ visibility: 'listed' })` for public lists.

## 6. Docs and fixtures

Add docs and demo entries for `unlisted` and `draft`.
