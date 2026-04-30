export interface BuildContext {
  env: 'development' | 'production';
  mode: string;
  base: string;
}

export interface RouteRecord {
  /** Canonical URL pattern as declared by the theme, e.g. /work/[slug] */
  pattern: string;
  /** Actual injected URL path after any consumer remap (equals pattern when not remapped) */
  resolved: string;
  label: string;
  section: string | null;
  visibility: 'public' | 'admin-only' | 'hidden';
  remappable: boolean;
  disableable: boolean;
}

/** Stable public type: the full list of registered routes after override resolution. */
export type RouteRegistry = RouteRecord[];

export type OverrideMap = Record<string, string>;
