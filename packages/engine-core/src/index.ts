export { loadConfig } from './config-loader.js';
export type { EngineConfig, ResolvedConfig } from './config-loader.js';

export { createVirtualModulesPlugin } from './virtual-modules.js';
export type { VirtualModulePluginOptions } from './virtual-modules.js';

export type { BuildContext, OverrideMap, RouteRecord } from './types.js';

export { createEngineIntegration } from './integration.js';
export type { EngineIntegrationOptions } from './integration.js';

export { discoverRoutes, resolveThemePagesDir } from './route-discovery.js';
export type { DiscoveredRoute } from './route-discovery.js';
