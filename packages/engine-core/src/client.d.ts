// Ambient type declarations for @portfolio-engine virtual modules.
// Reference this file in consuming packages:
//   /// <reference types="@portfolio-engine/engine-core/client" />

import type { ResolvedConfig } from './config-loader.js';
import type { BuildContext, OverrideMap, RouteRecord } from './types.js';

declare module '@portfolio-engine:config' {
  export const config: ResolvedConfig;
}

declare module '@portfolio-engine:context' {
  export const context: BuildContext;
}

declare module '@portfolio-engine:routes' {
  export const routes: RouteRecord[];
}

declare module '@portfolio-engine:overrides' {
  export const overrides: OverrideMap;
}
