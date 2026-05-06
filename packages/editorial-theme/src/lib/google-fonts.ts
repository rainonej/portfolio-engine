import type { FontEntry, ThemeConfig } from '@portfolio-engine/schema';
import { resolveFontFamily } from '@portfolio-engine/schema';

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

/** Structured entries with `provider: system | custom` are omitted from the Google Fonts URL. */
function googleFontFamilyOrSkip(
  entry: FontEntry | undefined,
  legacy: string | undefined,
  fallbackDefault: string,
): string | null {
  if (entry === undefined) {
    return firstFontFamily(legacy) ?? fallbackDefault;
  }
  if (typeof entry === 'string') {
    return firstFontFamily(entry) ?? fallbackDefault;
  }
  const p = entry.provider;
  if (p === 'system' || p === 'custom') return null;
  return firstFontFamily(resolveFontFamily(entry)) ?? fallbackDefault;
}

function googleFontFamilyOptional(entry: FontEntry | undefined): string | null {
  if (entry === undefined) return null;
  if (typeof entry === 'string') {
    return firstFontFamily(entry);
  }
  const p = entry.provider;
  if (p === 'system' || p === 'custom') return null;
  return firstFontFamily(resolveFontFamily(entry));
}

/**
 * Google Fonts CSS2 URL for families referenced in `theme.typography.fonts` / `fontFamily`.
 * Uses sensible default weights; unknown families still resolve via Google when hosted there.
 */
export function editorialGoogleFontsStylesheetHref(theme?: ThemeConfig): string {
  const typo = theme?.typography;
  const serifName = googleFontFamilyOrSkip(typo?.fonts?.heading, typo?.fontFamily, 'Cormorant Garamond');
  const sansName = googleFontFamilyOrSkip(typo?.fonts?.body, undefined, 'Inter');
  const monoName = googleFontFamilyOptional(typo?.fonts?.mono);

  /** Prefer heading stack first so duplicate font names keep display-oriented axis specs. */
  const slots: { name: string; spec: string }[] = [];
  if (serifName) slots.push({ name: serifName, spec: SPEC_SERIF });
  if (sansName) slots.push({ name: sansName, spec: SPEC_SANS });
  if (monoName) slots.push({ name: monoName, spec: SPEC_MONO });

  if (slots.length === 0) {
    const encSerif = encodeURIComponent('Cormorant Garamond').replace(/%20/g, '+');
    const encSans = encodeURIComponent('Inter').replace(/%20/g, '+');
    return `https://fonts.googleapis.com/css2?family=${encSerif}:${SPEC_SERIF}&family=${encSans}:${SPEC_SANS}&display=swap`;
  }

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
