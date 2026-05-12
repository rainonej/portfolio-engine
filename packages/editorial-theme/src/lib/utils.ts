/** Strip trailing slash from Astro BASE_URL */
export const getBase = () => import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Prefix root-relative asset paths with the site base (for non-root `base` deploys).
 * Leaves `http(s):`, `data:`, and protocol-relative URLs unchanged.
 */
export function resolveAssetUrl(
  src: string | null | undefined,
  base: string
): string | null {
  if (src == null || src === '') return null;
  if (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:') ||
    src.startsWith('//')
  ) {
    return src;
  }
  if (src.startsWith('/')) return `${base}${src}`;
  return `${base}/${src}`;
}

/** Format a date for display. 'short' = "Apr 2025", 'long' = "April 28, 2025" */
export const formatDate = (date: Date, style: 'short' | 'long' = 'long') =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: style === 'short' ? 'short' : 'long',
    ...(style === 'long' && { day: 'numeric' }),
  });

/**
 * Sort a content collection by date descending (newest first).
 *
 * Items must have a `data.date: Date` field.  The first overload enforces
 * this constraint at compile time for well-typed callers (e.g. the typed
 * wrappers in `collections.ts`).  A second unconstrained overload is
 * provided as a fallback for contexts where the element type cannot be
 * properly inferred (e.g. IDE sessions where the consumer's
 * `astro:content` types are not in scope and `getCollection(...)` returns
 * `any`); without it, the constraint's upper bound would be substituted for
 * `T`, stripping every other field and producing spurious
 * "Property 'X' does not exist" errors.
 *
 * A runtime guard inspects the first item and throws early if it lacks
 * `data.date: Date`, providing a fast-fail signal for misuse in
 * non-TypeScript call sites.  The check is a heuristic (first-item only)
 * since all items are expected to share the same shape.
 */
export function sortByDateDesc<T extends { data: { date: Date } }>(items: readonly T[]): T[];
export function sortByDateDesc<T>(items: readonly T[]): T[];
export function sortByDateDesc<T>(items: readonly T[]): T[] {
  type WithDate = { data: { date: Date } };
  if (items.length > 0 && !((items[0] as WithDate)?.data?.date instanceof Date)) {
    throw new TypeError('sortByDateDesc: each item must have a `data.date` property of type Date');
  }
  return [...items].sort(
    (a, b) => (b as WithDate).data.date.getTime() - (a as WithDate).data.date.getTime()
  );
}
