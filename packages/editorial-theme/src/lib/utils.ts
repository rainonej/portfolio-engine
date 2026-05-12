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
 * Items must have a `data.date: Date` field — this is enforced by an
 * in-body assertion rather than a `T extends { data: { date: Date } }`
 * constraint. Using a constraint here causes a TS quirk: when the IDE's
 * Astro language server can't see a consumer's generated `astro:content`
 * types (e.g. when editing pages inside this package directly), the input
 * to this function is `any[]`, and the compiler then pins `T` to the
 * constraint's upper bound `{ data: { date: Date } }`, stripping every
 * other field off the inferred element type and producing spurious
 * "Property 'X' does not exist" errors on later `.title` / `.image` /
 * `.tags` accesses. The build itself is unaffected — see `astro check`.
 */
export function sortByDateDesc<T>(items: readonly T[]): T[] {
  type WithDate = { data: { date: Date } };
  return [...items].sort(
    (a, b) => (b as WithDate).data.date.getTime() - (a as WithDate).data.date.getTime()
  );
}
