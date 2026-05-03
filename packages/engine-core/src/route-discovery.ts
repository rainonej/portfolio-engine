import { readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import type { Dirent } from 'node:fs';
import type { RouteRecord } from './types.js';
import type { RouteRegistryEntry } from '@portfolio-engine/schema';

export interface DiscoveredRoute {
  /** Canonical URL pattern, e.g. /work/[slug] */
  pattern: string;
  /** Absolute path to the .astro source file */
  entrypoint: string;
  routeRecord: RouteRecord;
}

// Static metadata for the v1 route surface. resolved is omitted — it is
// seeded to equal pattern at discovery time and updated by applyRouteOverrides.
function fileToPattern(relativePath: string): string {
  let p = relativePath.replace(/\\/g, '/').replace(/\.astro$/, '');
  if (p === 'index' || p.endsWith('/index')) {
    p = p.slice(0, -'index'.length);
  }
  p = p.replace(/\/$/, '') || '/';
  return p.startsWith('/') ? p : `/${p}`;
}

// Manual recursive readdir — Node 18 doesn't support readdirSync({ recursive: true }).
function walkAstroFiles(dir: string, base = ''): string[] {
  let entries: Dirent[];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? (error as NodeJS.ErrnoException).code
        : undefined;
    if (code === 'ENOENT' || code === 'ENOTDIR') return [];
    throw error;
  }
  const results: string[] = [];
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const rel = base ? join(base, entry.name) : entry.name;
    if (entry.isDirectory()) {
      results.push(...walkAstroFiles(join(dir, entry.name), rel));
    } else if (entry.name.endsWith('.astro')) {
      results.push(rel);
    }
  }
  return results;
}

/**
 * Scans pagesDir for .astro files and returns one DiscoveredRoute per file.
 * Returns an empty array only if the directory does not exist (ENOENT/ENOTDIR).
 * Other filesystem errors (permissions, I/O) are rethrown.
 */
export function discoverRoutes(
  pagesDir: string,
  routeRegistry: RouteRegistryEntry[] = [],
): DiscoveredRoute[] {
  let files: string[];
  try {
    files = walkAstroFiles(pagesDir);
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? (error as NodeJS.ErrnoException).code
        : undefined;
    if (code === 'ENOENT' || code === 'ENOTDIR') return [];
    throw error;
  }

  const routeMetadata = new Map(routeRegistry.map((route) => [route.pattern, route]));
  return files.map((f) => {
    const pattern = fileToPattern(f);
    const candidate = routeMetadata.get(pattern);
    const meta: Omit<RouteRecord, 'pattern' | 'resolved'> = candidate ?? {
      label: pattern,
      section: null,
      visibility: 'public' as const,
      remappable: true,
      disableable: true,
    };
    return {
      pattern,
      entrypoint: join(pagesDir, f),
      // resolved starts equal to pattern; applyRouteOverrides may update it
      routeRecord: { ...meta, pattern, resolved: pattern },
    };
  });
}

/**
 * Resolve the editorial-theme pages directory from a given project root.
 * Uses createRequire to respect non-standard layouts (workspaces, pnpm, etc.)
 * and falls back to the conventional node_modules path.
 */
export function resolveThemePagesDir(projectRootDir: string): string {
  try {
    const req = createRequire(join(projectRootDir, 'package.json'));
    const entry = req.resolve('@portfolio-engine/editorial-theme');
    // entry resolves to the package's exports entrypoint:
    //   workspace: .../editorial-theme/src/index.ts  → one up = src/ → pages/
    //   published:  .../editorial-theme/dist/index.js → one up = dist/ → pages/
    // This intentionally uses the entry's own directory so that the pages
    // directory is co-located with the entrypoint (src/pages or dist/pages).
    return resolve(entry, '..', 'pages');
  } catch {
    // Fallback for unusual layouts — assumes a normally-built published package.
    return resolve(
      projectRootDir,
      'node_modules',
      '@portfolio-engine',
      'editorial-theme',
      'dist',
      'pages',
    );
  }
}
