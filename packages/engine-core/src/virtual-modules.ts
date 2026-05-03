import type { ResolvedConfig } from './config-loader.js';
import type { BuildContext, OverrideMap, RouteRecord } from './types.js';

// Minimal subset of the Vite Plugin interface — avoids a direct vite dep
// while preserving correctness for the hooks engine-core actually uses.
// `this: any` matches Vite/Rollup's PluginContext without importing rollup types.
/* eslint-disable @typescript-eslint/no-explicit-any -- structural match to vite.Plugin hooks */
interface VitePlugin {
  name: string;
  resolveId?(this: any, id: string): string | null | undefined;
  load?(this: any, id: string): string | null | undefined;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const VIRTUAL_MODULE_IDS = [
  '@portfolio-engine:config',
  '@portfolio-engine:context',
  '@portfolio-engine:routes',
  '@portfolio-engine:overrides',
  '@portfolio-engine:override/Hero',
  '@portfolio-engine:override/FeaturedWriting',
  '@portfolio-engine:override/TestimonialSection',
  '@portfolio-engine:override/CollaborationSection',
  '@portfolio-engine:override/Footer',
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
  const candidate = id.startsWith('\0') ? id.slice(1) : id;
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
        case '@portfolio-engine:override/Hero':
          return overrides.Hero
            ? `import _default from ${JSON.stringify(overrides.Hero)}; export default _default;`
            : `export default null;`;
        case '@portfolio-engine:override/FeaturedWriting':
          return overrides.FeaturedWriting
            ? `import _default from ${JSON.stringify(overrides.FeaturedWriting)}; export default _default;`
            : `export default null;`;
        case '@portfolio-engine:override/TestimonialSection':
          return overrides.TestimonialSection
            ? `import _default from ${JSON.stringify(overrides.TestimonialSection)}; export default _default;`
            : `export default null;`;
        case '@portfolio-engine:override/CollaborationSection':
          return overrides.CollaborationSection
            ? `import _default from ${JSON.stringify(overrides.CollaborationSection)}; export default _default;`
            : `export default null;`;
        case '@portfolio-engine:override/Footer':
          return overrides.Footer
            ? `import _default from ${JSON.stringify(overrides.Footer)}; export default _default;`
            : `export default null;`;
      }
    },
  };
}
