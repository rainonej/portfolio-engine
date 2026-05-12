// Ambient type declarations for @portfolio-engine virtual modules.
// Reference this file in consuming packages:
//   /// <reference types="@portfolio-engine/engine-core/client" />
//
// IMPORTANT: this file must remain a SCRIPT (no top-level `import` /
// `export`). The moment it has a top-level import, TypeScript reclassifies
// it as a module, and every `declare module 'X'` block below is then
// interpreted as *module augmentation* rather than *ambient module
// declaration* — meaning the virtual module names (`@portfolio-engine:config`,
// etc.) never actually get declared, and downstream IDEs surface
// "Cannot find module '@portfolio-engine:config'" errors. Vite's
// virtual-modules plugin still resolves them at build time, so consumer
// `astro check` keeps passing and the bug is invisible outside the IDE.
//
// To pull in named types without becoming a module we use inline
// `import(...)` type-only expressions below; these do not affect the
// script/module classification. We use the package self-reference
// '@portfolio-engine/engine-core' (rather than a relative path) so the
// same source file resolves correctly from each of the three locations
// it can live at after publishing: `src/client.d.ts` (during editing),
// `client.d.ts` at the package root (referenced via `exports."./client"`),
// and `dist/client.d.ts` (kept for backwards-compat).

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
