import { z } from 'zod';

export const SiteConfigSchema = z.object({
  title: z.string(),
  description: z.string(),
  baseUrl: z.url(),
  tagline: z.string(),
  bookingUrl: z.url().optional(),
  contact: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  social: z
    .object({
      github: z.url().optional(),
      twitter: z.url().optional(),
      linkedin: z.url().optional(),
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
  pillars: z
    .array(
      z.object({
        heading: z.string(),
        body: z.string(),
        image: z.string().optional(),
      }),
    )
    .optional(),
  ctaBody: z.string().optional(),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
export type NavigationConfig = z.infer<typeof NavigationConfigSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
export type FeaturesConfig = z.infer<typeof FeaturesConfigSchema>;
export type { EngineManifest, ManifestRouteEntry, OverrideSurfaceEntry, RouteRegistryEntry } from './registry.js';
