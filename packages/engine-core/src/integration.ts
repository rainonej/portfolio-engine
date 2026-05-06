import type { AstroIntegration } from 'astro';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import type { EngineConfig } from './config-loader.js';
import { loadConfig } from './config-loader.js';
import { discoverRoutes, resolveThemePagesDir } from './route-discovery.js';
import { applyRouteOverrides } from './route-remap.js';
import type { RouteOverrides } from './route-remap.js';
import { resolveOverrides } from './override-resolution.js';
import type { OverrideConfig } from './override-resolution.js';
import { createVirtualModulesPlugin } from './virtual-modules.js';
import type { BuildContext } from './types.js';
import { writeManifest } from './manifest.js';
import {
  CONSUMER_REGISTRY_DEFAULT_RELATIVE_PATH,
  buildDesignSnapshot,
  type ManifestRouteEntry,
  type OverrideSurfaceEntry,
  type RouteRegistryEntry,
} from '@portfolio-engine/schema';
import {
  assertNoThemeLocalRouteCollision,
  buildConsumerLocalDiscoveredRoutes,
  DEFAULT_PAGES_LOCAL_RELATIVE_DIR,
  loadConsumerRegistryFromDisk,
} from './consumer-local-routes.js';

export interface DiagnosticsOptions {
  /**
   * When true, nav items that cannot be matched to an active route cause a build error.
   * Default: false (warnings only).
   */
  strictNavRoutes?: boolean;
}

export interface EngineIntegrationOptions extends EngineConfig {
  /** Remap or disable individual routes before injection. */
  routes?: RouteOverrides;
  /** Component and style overrides — downstream paths replace theme defaults. */
  overrides?: OverrideConfig;
  registries?: {
    routes: RouteRegistryEntry[];
    overrideSurfaces: OverrideSurfaceEntry[];
  };
  /**
   * Relative path to consumer registry JSON (declares local routes).
   * Defaults to `src/registry/portfolio-engine.registry.json`. When omitted and that file is absent, no local routes load.
   * When set explicitly, the file must exist.
   */
  consumerRegistryPath?: string;
  /** Relative directory for registry-backed Astro pages. Defaults to `src/pages-local`. */
  consumerPagesLocalDir?: string;
  /** Diagnostic and validation options. */
  diagnostics?: DiagnosticsOptions;
}

/** Read a package.json version from a directory, returning 'unknown' on any failure. */
function tryReadVersion(pkgDir: string): string {
  const pkgPath = resolve(pkgDir, 'package.json');
  if (!existsSync(pkgPath)) return 'unknown';
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { version?: string };
    return pkg.version ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

// engine-core's own package root: src/ (or dist/) → one level up
const _engineCoreDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE_CORE_VERSION = tryReadVersion(_engineCoreDir);

/**
 * Resolve nav warnings: returns a list of human-readable warning strings for
 * nav items whose hrefs don't match any active injected route.
 * External URLs and hash-only links are skipped.
 */
/** Strip trailing slash, fragment, and query string from an internal href for route comparison. */
function normalizeNavHref(href: string): string {
  // Remove fragment and query string, then strip trailing slash (but keep root "/")
  const clean = href.split('#')[0].split('?')[0];
  return clean.length > 1 ? clean.replace(/\/$/, '') : clean;
}

function buildNavWarnings(
  navItems: { label: string; href: string; visible?: boolean }[],
  activeResolvedPaths: Set<string>,
): string[] {
  const warnings: string[] = [];
  for (const item of navItems) {
    if (item.visible === false) continue;
    const href = item.href;
    if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) continue;
    if (href.startsWith('#')) continue;
    if (!activeResolvedPaths.has(normalizeNavHref(href))) {
      warnings.push(
        `Nav item "${item.label}" → "${href}" does not match any active injected route. ` +
          `For replacing a theme route such as /about, /writing, or /contact, prefer consumer-local registry routes under src/pages-local and disable the theme route first. ` +
          `Use ordinary src/pages only when you deliberately want an Astro-owned route that Portfolio Engine does not inject or diagnose. ` +
          `Also verify the href is not disabled in astro.config.mjs.`,
      );
    }
  }
  return warnings;
}

export function createEngineIntegration(options: EngineIntegrationOptions): AstroIntegration {
  /** Resolved site config from setup — reused when emitting design snapshot after builds. */
  let cachedResolvedConfig: Awaited<ReturnType<typeof loadConfig>> | undefined;
  let cachedRootDir: string | undefined;

  return {
    name: '@portfolio-engine/engine-core',
    hooks: {
      'astro:config:setup': async ({ config, command, injectRoute, updateConfig, logger }) => {
        const rootDir = fileURLToPath(config.root);
        cachedRootDir = rootDir;
        const registries = options.registries ?? { routes: [], overrideSurfaces: [] };

        // 1. Load and validate config files
        const resolvedConfig = await loadConfig(
          {
            siteConfigPath: options.siteConfigPath,
            navigationConfigPath: options.navigationConfigPath,
            themeConfigPath: options.themeConfigPath,
            featuresConfigPath: options.featuresConfigPath,
          },
          config.root,
        );
        cachedResolvedConfig = resolvedConfig;

        // 2. Discover routes from editorial-theme pages directory
        const pagesDir = resolveThemePagesDir(rootDir);
        const discovered = discoverRoutes(pagesDir, registries.routes);

        // 3. Apply route remaps / disables from downstream config
        const { routes: activeRoutes, disabled, remapped } = applyRouteOverrides(discovered, options.routes ?? {});

        const registryRelative =
          options.consumerRegistryPath ?? CONSUMER_REGISTRY_DEFAULT_RELATIVE_PATH;
        const consumerRegistry = loadConsumerRegistryFromDisk(rootDir, registryRelative, {
          required: options.consumerRegistryPath !== undefined,
        });
        const pagesLocalDir = options.consumerPagesLocalDir ?? DEFAULT_PAGES_LOCAL_RELATIVE_DIR;
        const localRoutes =
          consumerRegistry !== null
            ? buildConsumerLocalDiscoveredRoutes(rootDir, consumerRegistry, pagesLocalDir)
            : [];
        assertNoThemeLocalRouteCollision(activeRoutes, localRoutes);

        const injectedRoutes = [...activeRoutes, ...localRoutes];

        // 4. Inject each active route into the consumer's Astro config.
        for (const route of injectedRoutes) {
          injectRoute({ pattern: route.routeRecord.resolved, entrypoint: route.entrypoint });
        }

        // 5. Resolve component and style overrides
        const overrides = resolveOverrides(options.overrides ?? {}, rootDir, registries.overrideSurfaces);

        // Build manifest route entries: include explicit routeOrigin and entrypoint for every route.
        const registryMap = new Map(registries.routes.map((r) => [r.pattern, r]));
        const consumerLocalEntrypoints = new Set(localRoutes.map((lr) => lr.entrypoint));
        const manifestRoutes: ManifestRouteEntry[] = injectedRoutes.map((r) => {
          const registryEntry = registryMap.get(r.routeRecord.pattern);
          const isConsumerLocal = consumerLocalEntrypoints.has(r.entrypoint);
          const entry: ManifestRouteEntry = {
            ...r.routeRecord,
            routeOrigin: isConsumerLocal ? 'consumer-local' : 'theme',
            entrypoint: relative(rootDir, r.entrypoint).replace(/\\/g, '/'),
          };
          if (registryEntry?.agentGuidance !== undefined) entry.agentGuidance = registryEntry.agentGuidance;
          if (registryEntry?.adminDescription !== undefined) entry.adminDescription = registryEntry.adminDescription;
          return entry;
        });

        // 6. Nav validation — warn (or fail) for nav items that point at unknown routes.
        const activeResolvedPaths = new Set(injectedRoutes.map((r) => r.routeRecord.resolved));
        const navWarnings = buildNavWarnings(resolvedConfig.navigation.items, activeResolvedPaths);
        if (navWarnings.length > 0) {
          for (const warning of navWarnings) {
            logger.warn(`[portfolio-engine] ${warning}`);
          }
          if (options.diagnostics?.strictNavRoutes) {
            throw new Error(
              `[portfolio-engine] strictNavRoutes: ${navWarnings.length} nav item(s) could not be matched to an active route. See warnings above.`,
            );
          }
        }

        // 7. Resolve editorial-theme version from consumer context
        let editorialThemeVersion = 'unknown';
        try {
          const req = createRequire(resolve(rootDir, 'package.json'));
          const themeEntry = req.resolve('@portfolio-engine/editorial-theme');
          const themePkgDir = resolve(themeEntry, '..', '..');
          editorialThemeVersion = tryReadVersion(themePkgDir);
        } catch {
          // Version resolution is best-effort
        }

        writeManifest(rootDir, manifestRoutes, registries.overrideSurfaces, {
          engineCoreVersion: ENGINE_CORE_VERSION,
          editorialThemeVersion,
          consumerRegistry: {
            path: registryRelative,
            loaded: consumerRegistry !== null,
            routeCount: consumerRegistry?.localRoutes.length ?? 0,
          },
          routeOverrides: { disabled, remapped },
          navWarnings: navWarnings.length > 0 ? navWarnings : undefined,
        });

        // 8. Build context for virtual modules
        const context: BuildContext = {
          env: command === 'build' ? 'production' : 'development',
          mode: command === 'build' ? 'production' : 'development',
          base: config.base,
        };

        // 9. Register virtual modules plugin
        updateConfig({
          vite: {
            plugins: [
              createVirtualModulesPlugin({
                resolvedConfig,
                context,
                routes: injectedRoutes.map((r) => r.routeRecord),
                overrides,
              }) as Parameters<typeof updateConfig>[0]['vite'] extends {
                plugins?: (infer P)[] | undefined;
              }
                ? P
                : never,
            ],
          },
        });
      },

      'astro:build:done': async () => {
        const root = cachedRootDir;
        const resolved = cachedResolvedConfig;
        if (!root || !resolved) return;

        const peDir = resolve(root, '.portfolio-engine');
        await mkdir(peDir, { recursive: true });
        const snapshot = buildDesignSnapshot(resolved.theme);
        await writeFile(resolve(peDir, 'design-snapshot.json'), `${JSON.stringify(snapshot, null, 2)}\n`, 'utf-8');
      },

      'astro:config:done': ({ injectTypes }) => {
        injectTypes({
          filename: 'types/portfolio-engine.d.ts',
          content: '/// <reference types="@portfolio-engine/engine-core/client" />\n',
        });
      },
    },
  };
}
