import type { ResolvedConfig } from './config-loader.js';
import type { BuildContext, OverrideMap, RouteRecord } from './types.js';

// Minimal subset of the Vite Plugin interface — avoids a direct vite dep
// while preserving correctness for the hooks engine-core actually uses.
interface VitePlugin {
  name: string;
  resolveId?: (id: string) => string | null | undefined;
  load?: (id: string) => string | null | undefined;
}

const VIRTUAL_MODULE_IDS = [
  '@portfolio-engine:config',
  '@portfolio-engine:context',
  '@portfolio-engine:routes',
  '@portfolio-engine:overrides',
] as const;

type VirtualModuleId = (typeof VIRTUAL_MODULE_IDS)[number];

function isVirtualModuleId(id: string): id is VirtualModuleId {
  return (VIRTUAL_MODULE_IDS as readonly string[]).includes(id);
}

// Vite convention: prefix resolved virtual IDs with \0 to avoid filesystem lookups
function resolve(id: VirtualModuleId): string {
  return `\0${id}`;
}

function unresolve(id: string): VirtualModuleId | undefined {
  const candidate = id.slice(1); // strip leading \0
  return isVirtualModuleId(candidate) ? candidate : undefined;
}

export interface VirtualModulePluginOptions {
  resolvedConfig: ResolvedConfig;
  context: BuildContext;
  routes?: RouteRecord[];
  overrides?: OverrideMap;
}

export function createVirtualModulesPlugin(options: VirtualModulePluginOptions): VitePlugin {
  const { resolvedConfig, context, routes = [], overrides = {} } = options;

  return {
    name: '@portfolio-engine/virtual-modules',

    resolveId(id) {
      if (isVirtualModuleId(id)) return resolve(id);
    },

    load(id) {
      const moduleId = unresolve(id);
      if (!moduleId) return;

      switch (moduleId) {
        case '@portfolio-engine:config':
          return `export const config = ${JSON.stringify(resolvedConfig)};`;
        case '@portfolio-engine:context':
          return `export const context = ${JSON.stringify(context)};`;
        case '@portfolio-engine:routes':
          return `export const routes = ${JSON.stringify(routes)};`;
        case '@portfolio-engine:overrides':
          return `export const overrides = ${JSON.stringify(overrides)};`;
      }
    },
  };
}
