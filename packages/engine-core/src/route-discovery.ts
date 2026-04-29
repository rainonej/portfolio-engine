import { readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import type { RouteRecord } from './types.js';

export interface DiscoveredRoute {
  /** Canonical URL pattern, e.g. /work/[slug] */
  pattern: string;
  /** Absolute path to the .astro source file */
  entrypoint: string;
  routeRecord: RouteRecord;
}

// Static metadata for the v1 route surface. Route files discovered on disk
// are looked up here; unknown files get sensible defaults.
const ROUTE_METADATA: Record<string, Omit<RouteRecord, 'pattern'>> = {
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

/**
 * Scans pagesDir for .astro files and returns one DiscoveredRoute per file.
 * Returns an empty array if the directory does not exist (expected before Epic 4).
 */
export function discoverRoutes(pagesDir: string): DiscoveredRoute[] {
  let entries: string[];
  try {
    entries = readdirSync(pagesDir, { recursive: true }) as string[];
  } catch {
    return [];
  }

  return entries
    .filter((f) => f.endsWith('.astro'))
    .map((f) => {
      const pattern = fileToPattern(f);
      const meta = ROUTE_METADATA[pattern] ?? {
        label: pattern,
        section: null,
        visibility: 'public' as const,
        remappable: true,
        disableable: true,
      };
      return {
        pattern,
        entrypoint: join(pagesDir, f),
        routeRecord: { pattern, ...meta },
      };
    });
}

/** Resolve the editorial-theme pages directory from a given project root. */
export function resolveThemePagesDir(projectRootDir: string): string {
  return resolve(
    projectRootDir,
    'node_modules',
    '@portfolio-engine',
    'editorial-theme',
    'src',
    'pages',
  );
}
