import type { ThemeConfig } from '@portfolio-engine/schema';

const GENERIC_FAMILIES = new Set([
  'serif',
  'sans-serif',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'monospace',
  'cursive',
  'fantasy',
  'emoji',
]);

/** Default editorial pairing — matches legacy `design-tokens.css` stacks. */
const SPEC_SERIF = 'ital,wght@0,400;0,500;0,700;1,400;1,700';
const SPEC_SANS = 'wght@300;400;500;600';
const SPEC_MONO = 'wght@400;600';

function firstFontFamily(stack: string | undefined | null): string | null {
  if (!stack?.trim()) return null;
  const raw = stack.split(',')[0].trim().replace(/^["']|["']$/g, '').trim();
  if (!raw || GENERIC_FAMILIES.has(raw.toLowerCase())) return null;
  return raw;
}

/**
 * Google Fonts CSS2 URL for families referenced in `theme.typography.fonts` / `fontFamily`.
 * Uses sensible default weights; unknown families still resolve via Google when hosted there.
 */
export function editorialGoogleFontsStylesheetHref(theme?: ThemeConfig): string {
  const typo = theme?.typography;
  const serifName = firstFontFamily(typo?.fonts?.heading ?? typo?.fontFamily) ?? 'Cormorant Garamond';
  const sansName = firstFontFamily(typo?.fonts?.body) ?? 'Inter';
  const monoName = firstFontFamily(typo?.fonts?.mono);

  /** Prefer heading stack first so duplicate font names keep display-oriented axis specs. */
  const slots: { name: string; spec: string }[] = [
    { name: serifName, spec: SPEC_SERIF },
    { name: sansName, spec: SPEC_SANS },
  ];
  if (monoName) slots.push({ name: monoName, spec: SPEC_MONO });

  const seen = new Set<string>();
  const parts: string[] = [];
  for (const { name, spec } of slots) {
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const enc = encodeURIComponent(name).replace(/%20/g, '+');
    parts.push(`family=${enc}:${spec}`);
  }

  return `https://fonts.googleapis.com/css2?${parts.join('&')}&display=swap`;
}

/** Same as `editorialGoogleFontsStylesheetHref(undefined)` — stable default editorial pairing. */
export const EDITORIAL_GOOGLE_FONTS_STYLESHEET_HREF = editorialGoogleFontsStylesheetHref(undefined);
