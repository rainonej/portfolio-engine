import type { DiscoveredRoute } from './route-discovery.js';

export interface RouteOverrideEntry {
  /** false = exclude route from injection entirely */
  enabled?: boolean;
  /** Remap to a different URL path, e.g. '/essays' */
  path?: string;
}

export type RouteOverrides = Record<string, RouteOverrideEntry>;

export interface RouteRemapResult {
  /** Routes to inject, after applying enabled/path overrides */
  routes: DiscoveredRoute[];
  /** Patterns explicitly disabled by downstream config */
  disabled: string[];
  /** Map from original pattern → remapped path for routes that were remapped */
  remapped: Record<string, string>;
}

export function applyRouteOverrides(
  discovered: DiscoveredRoute[],
  overrides: RouteOverrides,
): RouteRemapResult {
  const unsupportedKeys = Object.keys(overrides).flatMap((pattern) => {
    const entry = overrides[pattern];
    return Object.keys(entry).filter((k) => k !== 'enabled' && k !== 'path').map((k) => `${pattern}.${k}`);
  });
  if (unsupportedKeys.length > 0) {
    throw new Error(
      `[portfolio-engine] Unsupported route override option(s): ${unsupportedKeys.join(', ')}\n` +
        `  Only "enabled" and "path" are supported in v1.`,
    );
  }

  const disabled: string[] = [];
  const remapped: Record<string, string> = {};
  const routes: DiscoveredRoute[] = [];

  for (const route of discovered) {
    const override = overrides[route.pattern];

    if (override?.enabled === false) {
      if (!route.routeRecord.disableable) {
        throw new Error(
          `[portfolio-engine] Route "${route.pattern}" cannot be disabled (disableable: false).`,
        );
      }
      disabled.push(route.pattern);
      continue;
    }

    if (override?.path !== undefined) {
      if (!route.routeRecord.remappable) {
        throw new Error(
          `[portfolio-engine] Route "${route.pattern}" cannot be remapped (remappable: false).`,
        );
      }
      remapped[route.pattern] = override.path;
      routes.push({
        ...route,
        pattern: override.path,
        routeRecord: { ...route.routeRecord, pattern: override.path },
      });
      continue;
    }

    routes.push(route);
  }

  return { routes, disabled, remapped };
}
