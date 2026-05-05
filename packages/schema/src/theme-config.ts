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

export const ThemeConfigSchema = z.object({
  typography: z
    .object({
      /** Legacy: serif / heading stack (prefer `fonts.heading`). */
      fontFamily: z.string().optional(),
      /** Legacy root font-size. */
      fontSize: z.string().optional(),
      fonts: z
        .object({
          heading: z.string().optional(),
          body: z.string().optional(),
          mono: z.string().optional(),
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
