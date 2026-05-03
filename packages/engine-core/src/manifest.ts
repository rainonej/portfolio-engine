import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { EngineManifest, ManifestRouteEntry, OverrideSurfaceEntry } from '@portfolio-engine/schema';

export function writeManifest(
  rootDir: string,
  routes: ManifestRouteEntry[],
  overrideSurfaces: OverrideSurfaceEntry[],
): void {
  const manifest: EngineManifest = {
    generatedAt: new Date().toISOString(),
    rootDir,
    routes,
    overrideSurfaces,
    capabilities: {
      routeRemap: true,
      routeDisable: true,
      namedOverrides: true,
    },
  };
  const dir = join(rootDir, '.portfolio-engine');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}
