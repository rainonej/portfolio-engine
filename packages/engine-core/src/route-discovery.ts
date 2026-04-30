import { readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import type { Dirent } from 'node:fs';
import type { RouteRecord } from './types.js';

export interface DiscoveredRoute {
  /** Canonical URL pattern, e.g. /work/[slug] */
  pattern: string;
  /** Absolute path to the .astro source file */
  entrypoint: string;
  routeRecord: RouteRecord;
}

// Static metadata for the v1 route surface. resolved is omitted — it is
// seeded to equal pattern at discovery time and updated by applyRouteOverrides.
const ROUTE_METADATA: Record<string, Omit<RouteRecord, 'pattern' | 'resolved'>> = {
  '/': {
    label: 'Home',
    section: null,
    visibility: 'public',
    remappable: true,
    disableable: false,
  },
  '/about': {
    label: 'About',
    section: null,
    visibility: 'public',
    remappable: true,
    disableable: true,
  },
  '/work': {
    label: 'Work',
    section: null,
    visibility: 'public',
    remappable: true,
    disableable: true,
  },
  '/work/[slug]': {
    label: 'Work detail',
    section: null,
    visibility: 'hidden',
    remappable: false,
    disableable: false,
  },
  '/writing': {
    label: 'Writing',
    section: null,
    visibility: 'public',
    remappable: true,
    disableable: true,
  },
  '/writing/[slug]': {
    label: 'Writing detail',
    section: null,
    visibility: 'hidden',
    remappable: false,
    disableable: false,
  },
  '/contact': {
    label: 'Contact',
    section: null,
    visibility: 'public',
    remappable: true,
    disableable: true,
  },
  '/admin': {
    label: 'Admin',
    section: null,
    visibility: 'admin-only',
    remappable: false,
    disableable: false,
  },
};

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
  } catch {
    return [];
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
export function discoverRoutes(pagesDir: string): DiscoveredRoute[] {
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

  return files.map((f) => {
    const pattern = fileToPattern(f);
    const meta: Omit<RouteRecord, 'pattern' | 'resolved'> = ROUTE_METADATA[pattern] ?? {
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
    // entry = .../editorial-theme/src/index.ts (or .js)
    // Walk up to find the directory that contains src/pages.
    // We go two levels up: index.ts → src/ → package root, then append src/pages.
    return resolve(entry, '..', '..', '..', 'src', 'pages');
  } catch {
    return resolve(
      projectRootDir,
      'node_modules',
      '@portfolio-engine',
      'editorial-theme',
      'src',
      'pages',
    );
  }
}
