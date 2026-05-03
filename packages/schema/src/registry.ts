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

/**
 * A route entry as it appears in the generated manifest: the canonical registry
 * entry plus the `resolved` path that was actually injected (which may differ
 * when a consumer has remapped the route to a different URL).
 */
export interface ManifestRouteEntry extends RouteRegistryEntry {
  /** Actual injected URL pattern after any consumer remap (equals `pattern` when not remapped) */
  resolved: string;
}

export interface EngineManifest {
  generatedAt: string;
  rootDir: string;
  /** Active route set after applying consumer remaps/disables — not the raw canonical registry */
  routes: ManifestRouteEntry[];
  overrideSurfaces: OverrideSurfaceEntry[];
  capabilities: {
    routeRemap: boolean;
    routeDisable: boolean;
    namedOverrides: boolean;
  };
}
