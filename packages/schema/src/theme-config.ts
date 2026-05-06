import { z } from 'zod';

/** Semantic palette roles → editorial CSS variables (`design-resolve.ts`). */
export const SemanticColorsSchema = z
  .object({
    surface: z
      .object({
        page: z.string().optional(),
        elevated: z.string().optional(),
        /** Warm section fills (maps to `--pale-sand`). */
        wash: z.string().optional(),
      })
      .optional(),
    text: z
      .object({
        primary: z.string().optional(),
        muted: z.string().optional(),
      })
      .optional(),
    accent: z
      .object({
        primary: z.string().optional(),
        secondary: z.string().optional(),
        /** Supporting accent / tags (maps to `--olive`). */
        muted: z.string().optional(),
      })
      .optional(),
    border: z
      .object({
        default: z.string().optional(),
      })
      .optional(),
  })
  .optional();

/**
 * Structured font definition that includes an explicit fallback stack and provider hint.
 * Accepts either a plain family-name string (legacy) or a structured object.
 *
 * @example
 * // Legacy string (still supported)
 * { "heading": "Newsreader" }
 *
 * // Structured object (preferred)
 * { "heading": { "family": "Newsreader", "fallback": "Georgia, serif", "provider": "google" } }
 */
export const FontEntrySchema = z.union([
  z.string(),
  z.object({
    /** Primary font family name (e.g. "Newsreader"). */
    family: z.string(),
    /** Explicit fallback stack appended after the primary family (e.g. "Georgia, serif"). */
    fallback: z.string().optional(),
    /** Hint for automatic stylesheet loading; currently only "google" is acted on. */
    provider: z.enum(['google', 'system', 'custom']).optional(),
  }),
]);

export type FontEntry = z.infer<typeof FontEntrySchema>;

/** Extract the family name string from a FontEntry (string or object). */
export function resolveFontFamily(entry: FontEntry | undefined): string | undefined {
  if (!entry) return undefined;
  if (typeof entry === 'string') return entry || undefined;
  return entry.family || undefined;
}

/** Extract the explicit fallback stack from a FontEntry, or undefined if none. */
export function resolveFontFallback(entry: FontEntry | undefined): string | undefined {
  if (!entry || typeof entry === 'string') return undefined;
  return entry.fallback || undefined;
}

export const ThemeConfigSchema = z.object({
  typography: z
    .object({
      /** Legacy: serif / heading stack (prefer `fonts.heading`). */
      fontFamily: z.string().optional(),
      /** Legacy root font-size. */
      fontSize: z.string().optional(),
      fonts: z
        .object({
          heading: FontEntrySchema.optional(),
          body: FontEntrySchema.optional(),
          mono: FontEntrySchema.optional(),
        })
        .optional(),
      /** Named sizes (CSS lengths). Omit keys to use preset defaults. */
      scale: z
        .object({
          display: z.string().optional(),
          title: z.string().optional(),
          heading: z.string().optional(),
          subheading: z.string().optional(),
          body: z.string().optional(),
          small: z.string().optional(),
          label: z.string().optional(),
        })
        .optional(),
      preset: z.enum(['comfortable', 'compact']).optional(),
    })
    .optional(),
  /** Semantic roles — override legacy flat `colors` when both set. */
  semanticColors: SemanticColorsSchema,
  colors: z
    .object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      background: z.string().optional(),
      text: z.string().optional(),
    })
    .optional(),
  layout: z
    .object({
      maxWidth: z.string().optional(),
    })
    .optional(),
});

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
export type SemanticColors = z.infer<typeof SemanticColorsSchema>;
