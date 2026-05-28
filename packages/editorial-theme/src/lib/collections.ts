/**
 * Typed wrappers around `astro:content` for the editorial-theme's
 * built-in collections (`writing`, `projects`, `testimonials`).
 *
 * Why these exist
 * ---------------
 * The theme's page files (`src/pages/**\/*.astro`) are *injected* into the
 * consumer's Astro project at build time via `engine-core`. At that point,
 * the consumer's generated `.astro/content.d.ts` is in scope and
 * `getCollection<C>(...)` is strongly typed against the consumer's
 * `content.config.ts`. `astro check` from the consumer site is therefore
 * always clean.
 *
 * But when those same `.astro` files are opened *inside this package* in
 * the IDE, the Astro language server uses this package's `tsconfig.json`,
 * which has no consumer attached. In that context `astro:content` resolves
 * to Astro's default stub (`getCollection: (...args: any[]) => any`), so
 * `await getCollection('writing')` is typed `any` — and `any` flowed
 * through `<T>(items: readonly T[])` makes TS infer `T = unknown` (the
 * safer default), which then surfaces in `.astro` files as spurious
 * "'post' is of type 'unknown'" / "Property 'X' does not exist on
 * type '{ date: Date }'" errors.
 *
 * These wrappers short-circuit that: they bottle the `as unknown as ...`
 * cast in one place, return arrays with explicit element types, and let
 * the calling `.astro` files just see `WritingEntry[]` / `ProjectEntry[]`
 * / `TestimonialEntry[]` in both IDE and build contexts.
 *
 * The entry shapes must structurally match the consumer's
 * `content.config.ts` schemas — see `docs/downstream/` and the example
 * sites under `examples/`.
 */

import { getCollection, getEntry } from 'astro:content';
import type { ProjectVisibility } from '@portfolio-engine/schema';

export type { ProjectVisibility };
export type ProjectVisibilityFilter = 'listed' | 'buildable' | 'all';

/** Shape mirrors the `writing` collection schema in consumer `content.config.ts`. */
export interface WritingData {
  title: string;
  date: Date;
  description?: string;
  image?: string;
  /** Always set in output — schemas use `.optional().default(false)`. */
  draft: boolean;
  tags?: string[];
}

/** Shape mirrors the `projects` collection schema in consumer `content.config.ts`. */
export interface ProjectData {
  title: string;
  description: string;
  /** Always set in output — schemas use `.optional().default(false)`. */
  featured: boolean;
  image?: string;
  tags?: string[];
  link?: string;
  date: Date;
  visibility: ProjectVisibility;
}

/** Shape mirrors the `testimonials` collection schema in consumer `content.config.ts`. */
export interface TestimonialData {
  quote: string;
  author: string;
  role: string;
  /** Always set in output — schemas use `.optional().default(false)`. */
  featured: boolean;
}

/** Structurally compatible with Astro's `RenderedContent` (re-declared so it resolves without consumer types). */
export interface RenderedEntryContent {
  html: string;
  metadata?: { imagePaths: string[]; [key: string]: unknown };
}

/** Structurally compatible with `CollectionEntry<'writing'>` in a consumer's generated types. */
export interface WritingEntry {
  id: string;
  body?: string;
  collection: 'writing';
  data: WritingData;
  rendered?: RenderedEntryContent;
  filePath?: string;
}

/** Structurally compatible with `CollectionEntry<'projects'>` in a consumer's generated types. */
export interface ProjectEntry {
  id: string;
  body?: string;
  collection: 'projects';
  data: ProjectData;
  rendered?: RenderedEntryContent;
  filePath?: string;
}

/** Structurally compatible with `CollectionEntry<'testimonials'>` in a consumer's generated types. */
export interface TestimonialEntry {
  id: string;
  collection: 'testimonials';
  data: TestimonialData;
  filePath?: string;
}

/** All writing posts. Drafts are excluded by default; pass `{ includeDrafts: true }` to include them. */
export async function getWritingPosts(opts?: { includeDrafts?: boolean }): Promise<WritingEntry[]> {
  const entries = (await getCollection('writing')) as unknown as WritingEntry[];
  return opts?.includeDrafts ? entries : entries.filter((e) => e.data.draft !== true);
}

export function isProjectListed(entry: ProjectEntry): boolean {
  return entry.data.visibility === 'published';
}

export function isProjectBuildable(entry: ProjectEntry): boolean {
  return entry.data.visibility !== 'draft';
}

/** Project entries filtered by visibility. Default is `listed` (published only). */
export async function getProjects(opts?: {
  visibility?: ProjectVisibilityFilter;
}): Promise<ProjectEntry[]> {
  const entries = (await getCollection('projects')) as unknown as ProjectEntry[];
  const visibility = opts?.visibility ?? 'listed';
  if (visibility === 'all') return entries;
  if (visibility === 'buildable') return entries.filter(isProjectBuildable);
  return entries.filter(isProjectListed);
}

/** All testimonials. Pass `{ featuredOnly: true }` to only return featured entries. */
export async function getTestimonials(opts?: {
  featuredOnly?: boolean;
}): Promise<TestimonialEntry[]> {
  const entries = (await getCollection('testimonials')) as unknown as TestimonialEntry[];
  return opts?.featuredOnly ? entries.filter((e) => e.data.featured) : entries;
}

/** A single writing post by id. */
export async function getWritingPostById(id: string): Promise<WritingEntry | undefined> {
  return (await getEntry('writing', id)) as unknown as WritingEntry | undefined;
}

/** A single project entry by id. Defaults to `buildable` — drafts return undefined. */
export async function getProjectById(
  id: string,
  opts?: { visibility?: 'buildable' | 'all' },
): Promise<ProjectEntry | undefined> {
  const entry = (await getEntry('projects', id)) as unknown as ProjectEntry | undefined;
  if (!entry) return undefined;
  if (opts?.visibility === 'all') return entry;
  return isProjectBuildable(entry) ? entry : undefined;
}
