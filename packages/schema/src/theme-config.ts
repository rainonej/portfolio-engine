import { z } from 'zod';

/** Structured color token — all fields required so the token is self-documenting. */
const ThemeColorTokenSchema = (cssVar: string) =>
  z.object({
    /** Hex or CSS color value (e.g. "#0f172a"). */
    value: z.string(),
    /** Human-readable name for the swatch (e.g. "Midnight Navy"). */
    name: z.string(),
    /** CSS custom property name — must match the semantic slot exactly. */
    cssVar: z.literal(cssVar),
    /** One-line description of the semantic role. */
    role: z.string(),
    /** When and where to use this color. */
    usage: z.string(),
    /** Usage anti-patterns. */
    avoid: z.array(z.string()).default([]),
    /** Concrete application examples. */
    examples: z.array(z.string()).default([]),
  });

export type ThemeColorToken = {
  value: string;
  name: string;
  cssVar: string;
  role: string;
  usage: string;
  avoid: string[];
  examples: string[];
};

/** Semantic palette roles → editorial CSS variables (`design-resolve.ts`). */
export const SemanticColorsSchema = z
  .object({
    surface: z
      .object({
        page: ThemeColorTokenSchema('--color-surface-page').optional(),
        elevated: ThemeColorTokenSchema('--color-surface-elevated').optional(),
        /** Warm section fills (maps to `--color-surface-wash`). */
        wash: ThemeColorTokenSchema('--color-surface-wash').optional(),
      })
      .optional(),
    text: z
      .object({
        primary: ThemeColorTokenSchema('--color-text-primary').optional(),
        muted: ThemeColorTokenSchema('--color-text-muted').optional(),
        /** Text on solid primary surfaces (e.g. primary buttons). */
        inverse: ThemeColorTokenSchema('--color-text-inverse').optional(),
      })
      .optional(),
    accent: z
      .object({
        primary: ThemeColorTokenSchema('--color-accent-primary').optional(),
        secondary: ThemeColorTokenSchema('--color-accent-secondary').optional(),
        /** Supporting accent / tags (maps to `--color-accent-muted`). */
        muted: ThemeColorTokenSchema('--color-accent-muted').optional(),
      })
      .optional(),
    border: z
      .object({
        default: ThemeColorTokenSchema('--color-border-default').optional(),
        strong: ThemeColorTokenSchema('--color-border-strong').optional(),
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
    /**
     * Controls inclusion in the theme's automatic Google Fonts stylesheet (`editorialGoogleFontsStylesheetHref`).
     * `google` or omitted: eligible; `system` and `custom`: excluded from that URL (host loads fonts separately).
     */
    provider: z.enum(['google', 'system', 'custom']).optional(),
    /** When and where this font is used. */
    usage: z.string().optional(),
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

/** Design principles and usage guidance stored alongside tokens. */
const GuidanceSchema = z
  .object({
    principles: z.array(z.string()).default([]),
  })
  .optional();

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
  /** Semantic color roles — the only downstream color authority. */
  semanticColors: SemanticColorsSchema,
  layout: z
    .object({
      maxWidth: z.string().optional(),
    })
    .optional(),
  /** Design principles and agent guidance stored with the tokens. */
  guidance: GuidanceSchema,
});

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
export type SemanticColors = z.infer<typeof SemanticColorsSchema>;
