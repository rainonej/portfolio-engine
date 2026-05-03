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

// Per-surface override modules — export the consumer component or null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OverrideComponent = ((...args: any[]) => any) | null;
declare module '@portfolio-engine:override/Hero' {
  const Override: OverrideComponent; export default Override;
}
declare module '@portfolio-engine:override/FeaturedWriting' {
  const Override: OverrideComponent; export default Override;
}
declare module '@portfolio-engine:override/TestimonialSection' {
  const Override: OverrideComponent; export default Override;
}
declare module '@portfolio-engine:override/CollaborationSection' {
  const Override: OverrideComponent; export default Override;
}
declare module '@portfolio-engine:override/Footer' {
  const Override: OverrideComponent; export default Override;
}
