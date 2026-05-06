import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { EngineManifest, ManifestRouteEntry, OverrideSurfaceEntry } from '@portfolio-engine/schema';

export interface ManifestMeta {
  engineCoreVersion: string;
  editorialThemeVersion: string;
  consumerRegistry: { path: string; loaded: boolean; routeCount: number };
  routeOverrides: { disabled: string[]; remapped: Record<string, string> };
  navWarnings?: string[];
}

export function writeManifest(
  rootDir: string,
  routes: ManifestRouteEntry[],
  overrideSurfaces: OverrideSurfaceEntry[],
  meta: ManifestMeta,
): void {
  const manifest: EngineManifest = {
    generatedAt: new Date().toISOString(),
    rootDir: '.',
    portfolioEngine: {
      engineCoreVersion: meta.engineCoreVersion,
      editorialThemeVersion: meta.editorialThemeVersion,
    },
    consumerRegistry: meta.consumerRegistry,
    routeOverrides: meta.routeOverrides,
    routes,
    overrideSurfaces,
    capabilities: {
      routeRemap: true,
      routeDisable: true,
      namedOverrides: true,
      consumerLocalRoutes: routes.some((r) => r.routeOrigin === 'consumer-local'),
    },
    ...(meta.navWarnings && meta.navWarnings.length > 0 ? { navWarnings: meta.navWarnings } : {}),
  };
  const dir = join(rootDir, '.portfolio-engine');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}
