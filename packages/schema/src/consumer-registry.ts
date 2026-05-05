import { z } from 'zod';

/** Default location (relative to Astro project root) for the consumer registry JSON file. */
export const CONSUMER_REGISTRY_DEFAULT_RELATIVE_PATH = 'src/registry/portfolio-engine.registry.json';

const routePatternSchema = z.string().superRefine((val, ctx) => {
  if (val.length === 0) {
    ctx.addIssue({ code: 'custom', message: 'Route pattern must be non-empty' });
    return;
  }
  if (!val.startsWith('/')) {
    ctx.addIssue({ code: 'custom', message: 'Route pattern must start with "/"' });
  }
  if (val.includes('//')) {
    ctx.addIssue({ code: 'custom', message: 'Route pattern must not contain "//"' });
  }
});

const pagesLocalRelativeSchema = z.string().superRefine((val, ctx) => {
  if (val.length === 0) {
    ctx.addIssue({ code: 'custom', message: 'page must be a non-empty path relative to src/pages-local' });
    return;
  }
  if (val.startsWith('/') || val.startsWith('\\')) {
    ctx.addIssue({
      code: 'custom',
      message: 'page must be relative (no leading slash or backslash)',
    });
  }
  const normalized = val.replace(/\\/g, '/');
  if (normalized.includes('..')) {
    ctx.addIssue({ code: 'custom', message: 'page must not contain ".."' });
  }
  if (!normalized.endsWith('.astro')) {
    ctx.addIssue({ code: 'custom', message: 'page must end with ".astro"' });
  }
});

/**
 * One consumer-declared route backed by a file under `src/pages-local`.
 */
export const ConsumerLocalRouteEntrySchema = z.object({
  pattern: routePatternSchema,
  page: pagesLocalRelativeSchema,
  label: z.string().optional(),
  section: z.string().nullable().optional(),
  visibility: z.enum(['public', 'admin-only', 'hidden']).optional(),
});

export type ConsumerLocalRouteEntry = z.infer<typeof ConsumerLocalRouteEntrySchema>;

/**
 * Consumer-owned portfolio-engine extension registry (JSON on disk).
 */
export const ConsumerPortfolioEngineRegistrySchema = z.object({
  version: z.number().int().positive().default(1),
  localRoutes: z.array(ConsumerLocalRouteEntrySchema).default([]),
});

export type ConsumerPortfolioEngineRegistry = z.infer<typeof ConsumerPortfolioEngineRegistrySchema>;

export function parseConsumerPortfolioEngineRegistry(raw: unknown): ConsumerPortfolioEngineRegistry {
  return ConsumerPortfolioEngineRegistrySchema.parse(raw);
}
