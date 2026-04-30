import { z } from 'zod';

export const SiteConfigSchema = z.object({
  title: z.string(),
  description: z.string(),
  baseUrl: z.string().url(),
  social: z
    .object({
      github: z.string().url().optional(),
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
    })
    .optional(),
});

export const NavigationConfigSchema = z.object({
  items: z.array(
    z.object({
      label: z.string(),
      href: z.string(),
      order: z.number().int().optional(),
      visible: z.boolean().default(true),
    }),
  ),
});

export const ThemeConfigSchema = z.object({
  typography: z
    .object({
      fontFamily: z.string().optional(),
      fontSize: z.string().optional(),
    })
    .optional(),
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

export const FeaturesConfigSchema = z.object({
  blog: z.boolean().default(true),
  testimonials: z.boolean().default(false),
  work: z.boolean().default(true),
  contact: z.boolean().default(true),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
export type NavigationConfig = z.infer<typeof NavigationConfigSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
export type FeaturesConfig = z.infer<typeof FeaturesConfigSchema>;
