import type { AstroIntegration } from 'astro';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
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
}

export function createEngineIntegration(options: EngineIntegrationOptions): AstroIntegration {
  /** Resolved site config from setup — reused when emitting design snapshot after builds. */
  let cachedResolvedConfig: Awaited<ReturnType<typeof loadConfig>> | undefined;
  let cachedRootDir: string | undefined;

  return {
    name: '@portfolio-engine/engine-core',
    hooks: {
      'astro:config:setup': async ({ config, command, injectRoute, updateConfig }) => {
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
        const { routes: activeRoutes } = applyRouteOverrides(discovered, options.routes ?? {});

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
        // Use routeRecord.resolved (the post-remap injected path) rather than
        // route.pattern (canonical name), so remapped routes are injected at
        // their new URL.
        for (const route of injectedRoutes) {
          injectRoute({ pattern: route.routeRecord.resolved, entrypoint: route.entrypoint });
        }

        // 5. Resolve component and style overrides
        const overrides = resolveOverrides(options.overrides ?? {}, rootDir, registries.overrideSurfaces);

        // Build manifest route entries from the active (post-remap) route set.
        // Start from routeRecord (which already has all required fields), then
        // layer in any optional metadata (agentGuidance, adminDescription) from
        // the canonical registry entry if it exists.
        const registryMap = new Map(registries.routes.map((r) => [r.pattern, r]));
        const consumerLocalEntrypoints = new Set(localRoutes.map((lr) => lr.entrypoint));
        const manifestRoutes: ManifestRouteEntry[] = injectedRoutes.map((r) => {
          const registryEntry = registryMap.get(r.routeRecord.pattern);
          const entry: ManifestRouteEntry = { ...r.routeRecord };
          if (registryEntry?.agentGuidance !== undefined) entry.agentGuidance = registryEntry.agentGuidance;
          if (registryEntry?.adminDescription !== undefined) entry.adminDescription = registryEntry.adminDescription;
          if (consumerLocalEntrypoints.has(r.entrypoint)) entry.routeOrigin = 'consumer-local';
          return entry;
        });
        writeManifest(rootDir, manifestRoutes, registries.overrideSurfaces);

        // 6. Build context for virtual modules
        const context: BuildContext = {
          env: command === 'build' ? 'production' : 'development',
          mode: command === 'build' ? 'production' : 'development',
          base: config.base,
        };

        // 7. Register virtual modules plugin
        // Cast needed: our local VitePlugin is a structural subset of Vite's Plugin
        // type; the shapes are compatible at runtime but TypeScript can't verify
        // this across the astro/vite type boundary without adding vite as a dep.
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
        // Inject the virtual module type declarations into the consumer's TS
        // environment automatically — no manual reference directive needed.
        injectTypes({
          filename: 'types/portfolio-engine.d.ts',
          content: '/// <reference types="@portfolio-engine/engine-core/client" />\n',
        });
      },
    },
  };
}
