import type { AstroIntegration } from 'astro';
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

export interface EngineIntegrationOptions extends EngineConfig {
  /** Remap or disable individual routes before injection. */
  routes?: RouteOverrides;
  /** Component and style overrides — downstream paths replace theme defaults. */
  overrides?: OverrideConfig;
}

export function createEngineIntegration(options: EngineIntegrationOptions): AstroIntegration {
  return {
    name: '@portfolio-engine/engine-core',
    hooks: {
      'astro:config:setup': async ({ config, command, injectRoute, updateConfig }) => {
        const rootDir = fileURLToPath(config.root);

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

        // 2. Discover routes from editorial-theme pages directory
        const pagesDir = resolveThemePagesDir(rootDir);
        const discovered = discoverRoutes(pagesDir);

        // 3. Apply route remaps / disables from downstream config
        const { routes: activeRoutes } = applyRouteOverrides(discovered, options.routes ?? {});

        // 4. Inject each active route into the consumer's Astro config
        for (const route of activeRoutes) {
          injectRoute({ pattern: route.pattern, entrypoint: route.entrypoint });
        }

        // 5. Resolve component and style overrides
        const overrides = resolveOverrides(options.overrides ?? {}, rootDir);

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
                routes: activeRoutes.map((r) => r.routeRecord),
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
