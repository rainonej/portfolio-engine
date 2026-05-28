# Patch: packages/editorial-theme/src/pages/work/[slug].astro

Change static path generation from all projects to buildable projects.

```ts
export async function getStaticPaths() {
  const projects = await getProjects({ visibility: 'buildable' });
  return projects.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}
```

This allows `unlisted` projects to generate detail pages while excluding `draft` projects.
