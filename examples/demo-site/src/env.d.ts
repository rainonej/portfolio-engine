/// <reference types="astro/client" />

declare module '@portfolio-engine:config' {
  export const config: import('@portfolio-engine/engine-core').ResolvedConfig;
}

declare module '@portfolio-engine:context' {
  export const context: import('@portfolio-engine/engine-core').BuildContext;
}

declare module '@portfolio-engine:routes' {
  export const routes: import('@portfolio-engine/engine-core').RouteRegistry;
}

declare module '@portfolio-engine:overrides' {
  export const overrides: import('@portfolio-engine/engine-core').OverrideMap;
}
