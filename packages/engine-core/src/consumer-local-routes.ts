/**
 * This file lets a downstream site declare its own pages alongside the theme's pages.
 *
 * It loads `src/registry/portfolio-engine.registry.json`, validates each entry's
 * source file lives under `src/pages-local`, and produces injectable route
 * records that engine-core's main integration adds to Astro at build time.
 * It also guards against consumer-local routes colliding with the theme's
 * still-active routes.
 */
import { existsSync, readFileSync } from 'node:fs';
import { normalize, resolve, sep } from 'node:path';
import {
  CONSUMER_REGISTRY_DEFAULT_RELATIVE_PATH,
  parseConsumerPortfolioEngineRegistry,
  type ConsumerPortfolioEngineRegistry,
} from '@portfolio-engine/schema';
import type { DiscoveredRoute } from './route-discovery.js';

export const DEFAULT_PAGES_LOCAL_RELATIVE_DIR = 'src/pages-local';

/**
 * Ensure `resolvedFile` lies under `pagesLocalAbs` (defense in depth vs malicious / surprising registry paths).
 */
export function assertResolvedFileInsidePagesLocal(
  pagesLocalAbs: string,
  resolvedFile: string,
  pageFieldForMessage: string,
  pagesLocalRelativeDir: string,
): void {
  const root = normalize(resolve(pagesLocalAbs));
  const file = normalize(resolve(resolvedFile));
  const prefix = root.endsWith(sep) ? root : root + sep;
  const inside = file.toLowerCase().startsWith(prefix.toLowerCase());
  if (!inside || file === root) {
    throw new Error(
      `[portfolio-engine] Local page "${pageFieldForMessage}" resolves outside ${pagesLocalRelativeDir} (resolved: ${file}).`,
    );
  }
}

export interface LoadConsumerRegistryOptions {
  /** When true, a missing file is an error (used when `consumerRegistryPath` is set explicitly). */
  required?: boolean;
}

/**
 * Load and validate the consumer registry JSON file, or return null when the file is absent.
 */
export function loadConsumerRegistryFromDisk(
  projectRootDir: string,
  registryRelativePath: string = CONSUMER_REGISTRY_DEFAULT_RELATIVE_PATH,
  loadOptions: LoadConsumerRegistryOptions = {},
): ConsumerPortfolioEngineRegistry | null {
  const abs = resolve(projectRootDir, registryRelativePath);
  if (!existsSync(abs)) {
    if (loadOptions.required) {
      throw new Error(
        `[portfolio-engine] Consumer registry not found at "${registryRelativePath}" (resolved: ${abs}).`,
      );
    }
    return null;
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(abs, 'utf8')) as unknown;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `[portfolio-engine] Failed to parse consumer registry JSON at "${registryRelativePath}": ${detail}`,
    );
  }

  try {
    return parseConsumerPortfolioEngineRegistry(raw);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`[portfolio-engine] Invalid consumer registry "${registryRelativePath}": ${detail}`);
  }
}

/**
 * Build injectable routes from validated registry entries under `src/pages-local`.
 */
export function buildConsumerLocalDiscoveredRoutes(
  projectRootDir: string,
  registry: ConsumerPortfolioEngineRegistry,
  pagesLocalRelativeDir: string = DEFAULT_PAGES_LOCAL_RELATIVE_DIR,
): DiscoveredRoute[] {
  const pagesLocalAbs = resolve(projectRootDir, pagesLocalRelativeDir);
  const routes: DiscoveredRoute[] = [];
  const seenPatterns = new Set<string>();

  for (const entry of registry.localRoutes) {
    const pattern = entry.pattern;
    if (seenPatterns.has(pattern)) {
      throw new Error(
        `[portfolio-engine] Duplicate local route pattern "${pattern}" in consumer registry.`,
      );
    }
    seenPatterns.add(pattern);

    const entrypoint = resolve(pagesLocalAbs, entry.page.replace(/\\/g, '/'));
    assertResolvedFileInsidePagesLocal(pagesLocalAbs, entrypoint, entry.page, pagesLocalRelativeDir);
    if (!existsSync(entrypoint)) {
      throw new Error(
        `[portfolio-engine] Consumer registry references missing page file for "${pattern}": expected ${entrypoint}`,
      );
    }

    routes.push({
      pattern,
      entrypoint,
      routeRecord: {
        pattern,
        resolved: pattern,
        label: entry.label ?? pattern,
        section: entry.section ?? null,
        visibility: entry.visibility ?? 'public',
        remappable: false,
        disableable: false,
      },
    });
  }

  return routes;
}

/**
 * Ensure no consumer-local URL matches an injected editorial-theme URL (after theme remaps).
 */
export function assertNoThemeLocalRouteCollision(
  themeRoutes: DiscoveredRoute[],
  localRoutes: DiscoveredRoute[],
): void {
  const themeResolved = new Set(themeRoutes.map((r) => r.routeRecord.resolved));
  for (const local of localRoutes) {
    const target = local.routeRecord.resolved;
    if (themeResolved.has(target)) {
      throw new Error(
        `[portfolio-engine] Consumer registry route "${local.pattern}" (${target}) conflicts with an injected editorial-theme route ` +
          `(same URL after theme route remaps). Change the local pattern or remap/disable the theme route.`,
      );
    }
  }
}
