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

/** Where the active route's page file came from. */
export type RouteOrigin = 'theme' | 'consumer-local' | 'consumer-pages' | 'unknown';

/**
 * A route entry as it appears in the generated manifest: the canonical registry
 * entry plus the resolved path, origin, and entrypoint so consumers/agents can
 * immediately see which file owns each URL.
 */
export interface ManifestRouteEntry extends RouteRegistryEntry {
  /** Actual injected URL pattern after any consumer remap (equals `pattern` when not remapped). */
  resolved: string;
  /** Source of the route's page file. */
  routeOrigin: RouteOrigin;
  /** Absolute path to the page file that serves this route. */
  entrypoint: string;
}

export interface EngineManifest {
  generatedAt: string;
  /** Consumer site root, always `.` (relative to the directory containing `.portfolio-engine/`). */
  rootDir: string;
  /** Versions of the engine packages that produced this manifest. */
  portfolioEngine: {
    engineCoreVersion: string;
    editorialThemeVersion: string;
  };
  /** State of the consumer registry loaded during this build. */
  consumerRegistry: {
    path: string;
    loaded: boolean;
    routeCount: number;
  };
  /** Route override config applied during this build. */
  routeOverrides: {
    disabled: string[];
    remapped: Record<string, string>;
  };
  /** Active route set after applying consumer remaps/disables — not the raw canonical registry. */
  routes: ManifestRouteEntry[];
  overrideSurfaces: OverrideSurfaceEntry[];
  capabilities: {
    routeRemap: boolean;
    routeDisable: boolean;
    namedOverrides: boolean;
    /** True when at least one `consumer-local` route was injected from the consumer registry. */
    consumerLocalRoutes: boolean;
  };
  /** Nav items that could not be matched to an active route. Present only when warnings exist. */
  navWarnings?: string[];
}
