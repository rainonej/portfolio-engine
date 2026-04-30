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

/** Sort a content collection by date descending (newest first) */
export const sortByDateDesc = <T extends { data: { date: Date } }>(
  items: T[]
): T[] =>
  [...items].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
