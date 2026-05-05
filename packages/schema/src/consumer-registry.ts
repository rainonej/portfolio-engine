import { z } from 'zod';

/** Default location (relative to Astro project root) for the consumer registry JSON file. */
export const CONSUMER_REGISTRY_DEFAULT_RELATIVE_PATH = 'src/registry/portfolio-engine.registry.json';

/** Supported `version` field in consumer registry JSON — bump only when the format is intentionally extended. */
export const CONSUMER_REGISTRY_SUPPORTED_VERSION = 1 as const;

function pathHasParentDirSegment(posixPath: string): boolean {
  return posixPath.split('/').some((segment) => segment === '..');
}

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
    return;
  }
  const normalized = val.replace(/\\/g, '/');
  // UNC / “protocol-relative” roots become //… after normalization — never allowed for pages-local entries.
  if (normalized.startsWith('//')) {
    ctx.addIssue({
      code: 'custom',
      message: 'page must be a relative path under pages-local (not UNC or URL-like)',
    });
    return;
  }
  // Windows absolute paths (e.g. D:/outside.astro) — resolve() would ignore pages-local and escape the sandbox.
  if (/^[a-zA-Z]:/.test(normalized)) {
    ctx.addIssue({
      code: 'custom',
      message: 'page must not be an absolute Windows path',
    });
    return;
  }
  if (pathHasParentDirSegment(normalized)) {
    ctx.addIssue({
      code: 'custom',
      message: 'page must not contain parent-directory segments ("..")',
    });
    return;
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
  version: z.literal(CONSUMER_REGISTRY_SUPPORTED_VERSION).default(CONSUMER_REGISTRY_SUPPORTED_VERSION),
  localRoutes: z.array(ConsumerLocalRouteEntrySchema).default([]),
});

export type ConsumerPortfolioEngineRegistry = z.infer<typeof ConsumerPortfolioEngineRegistrySchema>;

export function parseConsumerPortfolioEngineRegistry(raw: unknown): ConsumerPortfolioEngineRegistry {
  return ConsumerPortfolioEngineRegistrySchema.parse(raw);
}
