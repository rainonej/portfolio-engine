export type RouteVisibility = 'public' | 'admin-only' | 'hidden';

export interface RouteRegistryEntry {
  pattern: string;
  label: string;
  section: string | null;
  visibility: RouteVisibility;
  remappable: boolean;
  disableable: boolean;
  agentGuidance?: string;
  adminDescription?: string;
}

export interface OverrideSurfaceEntry {
  name: string;
  props: string[];
  defaultComponentPath: string;
  hostPage: string;
  docsUrl?: string;
  guidance?: string;
}

export interface EngineManifest {
  generatedAt: string;
  rootDir: string;
  routes: RouteRegistryEntry[];
  overrideSurfaces: OverrideSurfaceEntry[];
  capabilities: {
    routeRemap: boolean;
    routeDisable: boolean;
    namedOverrides: boolean;
  };
}
