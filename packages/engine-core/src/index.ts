export { loadConfig } from './config-loader.js';
export type { EngineConfig, ResolvedConfig } from './config-loader.js';

export { createVirtualModulesPlugin } from './virtual-modules.js';
export type { VirtualModulePluginOptions } from './virtual-modules.js';

export type { BuildContext, OverrideMap, RouteRecord, RouteRegistry } from './types.js';

export { createEngineIntegration } from './integration.js';
export type { EngineIntegrationOptions } from './integration.js';

export { applyRouteOverrides } from './route-remap.js';
export type { RouteOverrides, RouteOverrideEntry, RouteRemapResult } from './route-remap.js';

export { resolveOverrides } from './override-resolution.js';
export type { OverrideConfig } from './override-resolution.js';

export { discoverRoutes, resolveThemePagesDir } from './route-discovery.js';
export type { DiscoveredRoute } from './route-discovery.js';

export {
  assertNoThemeLocalRouteCollision,
  assertResolvedFileInsidePagesLocal,
  buildConsumerLocalDiscoveredRoutes,
  DEFAULT_PAGES_LOCAL_RELATIVE_DIR,
  loadConsumerRegistryFromDisk,
} from './consumer-local-routes.js';
export type { LoadConsumerRegistryOptions } from './consumer-local-routes.js';
