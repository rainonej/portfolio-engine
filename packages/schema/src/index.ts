import { z } from 'zod';

export const SchedulingProviderSchema = z.enum([
  'calendly',
  'cal',
  'google-calendar',
  'microsoft-bookings',
  'custom',
]);

export const SchedulingModeSchema = z.enum(['button', 'link', 'embed']);

const SchedulingUrlSchema = z.url().refine((value) => value.startsWith('https://'), {
  message: 'Scheduling URL must be an absolute https:// URL.',
});

export const SchedulingConfigSchema = z
  .object({
    enabled: z.boolean().default(false),
    provider: SchedulingProviderSchema.default('custom'),
    mode: SchedulingModeSchema.default('button'),
    url: SchedulingUrlSchema.optional(),
    label: z.string().optional(),
    heading: z.string().optional(),
    eyebrow: z.string().optional(),
    description: z.string().optional(),
    height: z.number().int().positive().default(720),
    openInNewTab: z.boolean().default(true),
  })
  .superRefine((value, ctx) => {
    if (value.enabled && !value.url) {
      ctx.addIssue({
        code: 'custom',
        path: ['url'],
        message: 'Scheduling URL is required when scheduling is enabled.',
      });
    }
  });

export type SchedulingProvider = z.infer<typeof SchedulingProviderSchema>;
export type SchedulingMode = z.infer<typeof SchedulingModeSchema>;
export type SchedulingConfig = z.infer<typeof SchedulingConfigSchema>;

export const SiteConfigSchema = z.object({
  title: z.string(),
  description: z.string(),
  baseUrl: z.url(),
  tagline: z.string(),
  bookingUrl: z.url().optional(),
  contact: z.object({
    heading: z.string(),
    body: z.string(),
    scheduling: SchedulingConfigSchema.optional(),
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

export {
  ThemeConfigSchema,
  SemanticColorsSchema,
  FontEntrySchema,
  resolveFontFamily,
  resolveFontFallback,
  type ThemeConfig,
  type SemanticColors,
  type FontEntry,
} from './theme-config.js';

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
export type FeaturesConfig = z.infer<typeof FeaturesConfigSchema>;

export * from './design-resolve.js';
export type {
  EngineManifest,
  ManifestRouteEntry,
  OverrideSurfaceEntry,
  RouteOrigin,
  RouteRegistryEntry,
} from './registry.js';
export {
  ProfilePersonSchema,
  ProfileCvSchema,
  ProfileExperienceSchema,
  ProfileEducationSchema,
  ProfileAwardSchema,
  type ProfilePerson,
  type ProfileCv,
  type ProfileExperience,
  type ProfileEducation,
  type ProfileAward,
  type ValueCard,
  type WorkingPrinciple,
} from './profile.js';
export {
  CONSUMER_REGISTRY_DEFAULT_RELATIVE_PATH,
  CONSUMER_REGISTRY_SUPPORTED_VERSION,
  ConsumerLocalRouteEntrySchema,
  ConsumerPortfolioEngineRegistrySchema,
  parseConsumerPortfolioEngineRegistry,
  type ConsumerLocalRouteEntry,
  type ConsumerPortfolioEngineRegistry,
} from './consumer-registry.js';
