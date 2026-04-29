import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'node:url';
import type { EngineConfig } from './config-loader.js';
import { loadConfig } from './config-loader.js';
import { discoverRoutes, resolveThemePagesDir } from './route-discovery.js';
import { createVirtualModulesPlugin } from './virtual-modules.js';
import type { BuildContext } from './types.js';

export interface EngineIntegrationOptions extends EngineConfig {
  // Extended by Task 3.5 (route overrides) and Task 3.7 (component overrides)
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

        // 3. Inject each discovered route into the consumer's Astro config
        for (const route of discovered) {
          injectRoute({ pattern: route.pattern, entrypoint: route.entrypoint });
        }

        // 4. Build context for virtual modules
        const context: BuildContext = {
          env: command === 'build' ? 'production' : 'development',
          mode: command === 'build' ? 'production' : 'development',
          base: config.base,
        };

        // 5. Register virtual modules plugin
        // Cast needed: our local VitePlugin is a structural subset of Vite's Plugin
        // type; the shapes are compatible at runtime but TypeScript can't verify
        // this across the astro/vite type boundary without adding vite as a dep.
        updateConfig({
          vite: {
            plugins: [
              createVirtualModulesPlugin({
                resolvedConfig,
                context,
                routes: discovered.map((r) => r.routeRecord),
              }) as Parameters<typeof updateConfig>[0]['vite'] extends {
                plugins?: (infer P)[] | undefined;
              }
                ? P
                : never,
            ],
          },
        });
      },
    },
  };
}
