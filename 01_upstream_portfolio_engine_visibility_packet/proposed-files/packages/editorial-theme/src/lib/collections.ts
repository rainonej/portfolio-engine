/**
 * Typed wrappers around `astro:content` for the editorial-theme's
 * built-in collections (`writing`, `projects`, `testimonials`).
 */

import { getCollection, getEntry } from 'astro:content';

export interface WritingData {
  title: string;
  date: Date;
  description?: string;
  image?: string;
  draft: boolean;
  tags?: string[];
}

export type ProjectVisibility = 'published' | 'unlisted' | 'draft';
export type ProjectVisibilityFilter = 'listed' | 'buildable' | 'all';

export interface ProjectData {
  title: string;
  description: string;
  featured: boolean;
  image?: string;
  tags?: string[];
  link?: string;
  date: Date;
  visibility: ProjectVisibility;
}

export interface TestimonialData {
  quote: string;
  author: string;
  role: string;
  featured: boolean;
}

export interface RenderedEntryContent {
  html: string;
  metadata?: { imagePaths: string[]; [key: string]: unknown };
}

export interface WritingEntry {
  id: string;
  body?: string;
  collection: 'writing';
  data: WritingData;
  rendered?: RenderedEntryContent;
  filePath?: string;
}

export interface ProjectEntry {
  id: string;
  body?: string;
  collection: 'projects';
  data: ProjectData;
  rendered?: RenderedEntryContent;
  filePath?: string;
}

export interface TestimonialEntry {
  id: string;
  collection: 'testimonials';
  data: TestimonialData;
  filePath?: string;
}

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

/**
 * Project entries with explicit visibility filtering.
 *
 * - `listed` (default): only public/indexed projects (`published`)
 * - `buildable`: projects that should get detail routes (`published` + `unlisted`)
 * - `all`: every project entry, including drafts
 */
export async function getProjects(opts?: {
  visibility?: ProjectVisibilityFilter;
}): Promise<ProjectEntry[]> {
  const entries = (await getCollection('projects')) as unknown as ProjectEntry[];
  const visibility = opts?.visibility ?? 'listed';

  if (visibility === 'all') return entries;
  if (visibility === 'buildable') return entries.filter(isProjectBuildable);
  return entries.filter(isProjectListed);
}

export async function getTestimonials(opts?: {
  featuredOnly?: boolean;
}): Promise<TestimonialEntry[]> {
  const entries = (await getCollection('testimonials')) as unknown as TestimonialEntry[];
  return opts?.featuredOnly ? entries.filter((e) => e.data.featured) : entries;
}

export async function getWritingPostById(id: string): Promise<WritingEntry | undefined> {
  return (await getEntry('writing', id)) as unknown as WritingEntry | undefined;
}

export async function getProjectById(
  id: string,
  opts?: { visibility?: 'buildable' | 'all' },
): Promise<ProjectEntry | undefined> {
  const entry = (await getEntry('projects', id)) as unknown as ProjectEntry | undefined;
  if (!entry) return undefined;
  if (opts?.visibility === 'all') return entry;
  return isProjectBuildable(entry) ? entry : undefined;
}
