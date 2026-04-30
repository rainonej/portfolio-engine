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
  // 1. Reject unknown keys in override entries
  const unsupportedKeys = Object.keys(overrides).flatMap((pattern) => {
    const entry = overrides[pattern];
    if (
      entry === null ||
      entry === undefined ||
      typeof entry !== 'object' ||
      Array.isArray(entry)
    ) {
      const entryType =
        entry === null ? 'null' : Array.isArray(entry) ? 'array' : typeof entry;
      throw new Error(
        `[portfolio-engine] Invalid route override for pattern "${pattern}": expected an object with optional "enabled" and "path" properties, received ${entryType}.`,
      );
    }
    return Object.keys(entry)
      .filter((k) => k !== 'enabled' && k !== 'path')
      .map((k) => `${pattern}.${k}`);
  });
  if (unsupportedKeys.length > 0) {
    throw new Error(
      `[portfolio-engine] Unsupported route override option(s): ${unsupportedKeys.join(', ')}\n` +
        `  Only "enabled" and "path" are supported in v1.`,
    );
  }

  // 2. Validate types of enabled/path values
  for (const [pattern, entry] of Object.entries(overrides)) {
    if ('enabled' in entry && typeof entry.enabled !== 'boolean') {
      throw new Error(
        `[portfolio-engine] Route override "${pattern}.enabled" must be a boolean, got ${typeof entry.enabled}.`,
      );
    }
    if ('path' in entry && typeof entry.path !== 'string') {
      throw new Error(
        `[portfolio-engine] Route override "${pattern}.path" must be a string, got ${typeof entry.path}.`,
      );
    }
    if (
      'path' in entry &&
      typeof entry.path === 'string' &&
      (entry.path.length === 0 || !entry.path.startsWith('/'))
    ) {
      throw new Error(
        `[portfolio-engine] Route override "${pattern}.path" must be a non-empty string starting with "/", got "${entry.path}".`,
      );
    }
    if ('enabled' in entry && entry.enabled === false && 'path' in entry) {
      throw new Error(
        `[portfolio-engine] Route override "${pattern}" has both enabled: false and path — these are contradictory.`,
      );
    }
  }

  // 3. Reject overrides that target unknown patterns (catches typos)
  if (discovered.length > 0) {
    const known = new Set(discovered.map((r) => r.pattern));
    const unknown = Object.keys(overrides).filter((p) => !known.has(p));
    if (unknown.length > 0) {
      throw new Error(
        `[portfolio-engine] Route override(s) target pattern(s) not in the registry: ${unknown.join(', ')}\n` +
          `  Available patterns: ${[...known].join(', ')}`,
      );
    }
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
        routeRecord: { ...route.routeRecord, resolved: override.path },
      });
      continue;
    }

    routes.push(route);
  }

  // 4. Detect duplicate injected patterns after applying overrides
  // Use routeRecord.resolved (the actual injected path) rather than route.pattern
  // (canonical), since two different canonical routes could remap to the same target.
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const r of routes) {
    const injected = r.routeRecord.resolved;
    if (seen.has(injected)) duplicates.add(injected);
    else seen.add(injected);
  }
  if (duplicates.size > 0) {
    throw new Error(
      `[portfolio-engine] Duplicate injected route patterns after applying overrides: ${[...duplicates].join(', ')}`,
    );
  }

  return { routes, disabled, remapped };
}
