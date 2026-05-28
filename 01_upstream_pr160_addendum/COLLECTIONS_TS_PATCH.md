# Patch guidance for `packages/editorial-theme/src/lib/collections.ts`

Current PR code is close but needs normalization.

## Replace the required visibility field

```ts
export interface ProjectData {
  title: string;
  description: string;
  /** Always set in output — schemas use `.optional().default(false)`. */
  featured: boolean;
  image?: string;
  tags?: string[];
  link?: string;
  date: Date;
  visibility?: ProjectVisibility;
}
```

## Add a normalizer

```ts
export function getProjectVisibility(entry: ProjectEntry): ProjectVisibility {
  return entry.data.visibility ?? 'published';
}
```

## Use it in predicates

```ts
export function isProjectListed(entry: ProjectEntry): boolean {
  return getProjectVisibility(entry) === 'published';
}

export function isProjectBuildable(entry: ProjectEntry): boolean {
  return getProjectVisibility(entry) !== 'draft';
}
```

## Keep `getProjects` semantics

```ts
export async function getProjects(opts?: {
  visibility?: ProjectVisibilityFilter;
}): Promise<ProjectEntry[]> {
  const entries = (await getCollection('projects')) as unknown as ProjectEntry[];
  const visibility = opts?.visibility ?? 'listed';
  if (visibility === 'all') return entries;
  if (visibility === 'buildable') return entries.filter(isProjectBuildable);
  return entries.filter(isProjectListed);
}
```

## Keep `getProjectById` semantics

```ts
export async function getProjectById(
  id: string,
  opts?: { visibility?: 'buildable' | 'all' },
): Promise<ProjectEntry | undefined> {
  const entry = (await getEntry('projects', id)) as unknown as ProjectEntry | undefined;
  if (!entry) return undefined;
  if (opts?.visibility === 'all') return entry;
  return isProjectBuildable(entry) ? entry : undefined;
}
```
