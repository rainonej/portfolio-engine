export interface BuildContext {
  env: 'development' | 'production';
  mode: string;
  base: string;
}

export interface RouteRecord {
  pattern: string;
  label: string;
  section: string | null;
  visibility: 'public' | 'admin-only' | 'hidden';
  remappable: boolean;
  disableable: boolean;
}

export type OverrideMap = Record<string, string>;
