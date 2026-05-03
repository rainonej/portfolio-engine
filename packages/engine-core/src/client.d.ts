// Ambient type declarations for @portfolio-engine virtual modules.
// Reference this file in consuming packages:
//   /// <reference types="@portfolio-engine/engine-core/client" />

import type { ResolvedConfig } from './config-loader.js';
import type { BuildContext, OverrideMap, RouteRegistry } from './types.js';

declare module '@portfolio-engine:config' {
  export const config: ResolvedConfig;
}

declare module '@portfolio-engine:context' {
  export const context: BuildContext;
}

declare module '@portfolio-engine:routes' {
  export const routes: RouteRegistry;
}

declare module '@portfolio-engine:overrides' {
  export const overrides: OverrideMap;
}

// Per-surface override modules. Each exports the consumer's override component,
// or null when no override is configured for that surface.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OverrideComponent = ((...args: any[]) => any) | null;

declare module '@portfolio-engine:override/Hero' {
  const Override: OverrideComponent;
  export default Override;
}
declare module '@portfolio-engine:override/FeaturedWriting' {
  const Override: OverrideComponent;
  export default Override;
}
declare module '@portfolio-engine:override/TestimonialSection' {
  const Override: OverrideComponent;
  export default Override;
}
declare module '@portfolio-engine:override/CollaborationSection' {
  const Override: OverrideComponent;
  export default Override;
}
declare module '@portfolio-engine:override/Footer' {
  const Override: OverrideComponent;
  export default Override;
}
