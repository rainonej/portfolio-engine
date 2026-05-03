import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { OverrideMap } from './types.js';
import type { OverrideSurfaceEntry } from '@portfolio-engine/schema';

export interface OverrideConfig {
  /**
   * Named component overrides. Keys are the override surface names declared
   * by editorial-theme; values are paths relative to the consumer project root.
   *
   * Example: { Hero: './src/overrides/components/Hero.astro' }
   *
   * Only surfaces explicitly declared by the theme are supported. Unrecognized
   * surface names produce a build-time error.
   */
  components?: Record<string, string>;

  /**
   * CSS files to append after the theme's global.css.
   * Paths are relative to the consumer project root.
   *
   * Example: ['./src/overrides/styles/custom.css']
   */
  styles?: string[];
}

/**
 * Named override surfaces declared by editorial-theme in v1.
 * Attempting to override a surface not in this list is a build-time error.
 */
export function resolveOverrides(
  config: OverrideConfig,
  projectRootDir: string,
  overrideSurfaces: OverrideSurfaceEntry[] = [],
): OverrideMap {
  const overrideMap: OverrideMap = {};
  const supportedComponentSurfaces = new Set(overrideSurfaces.map((surface) => surface.name));

  const components = config.components ?? {};
  for (const [surface, relativePath] of Object.entries(components)) {
    if (typeof relativePath !== 'string' || relativePath.length === 0) {
      throw new Error(
        `[portfolio-engine] Component override for "${surface}" must be a non-empty string path, got ${relativePath === null ? 'null' : typeof relativePath}.`,
      );
    }
    if (!supportedComponentSurfaces.has(surface)) {
      throw new Error(
        `[portfolio-engine] Unknown component override surface: "${surface}".\n` +
          `  Supported surfaces: ${supportedComponentSurfaces.size > 0 ? [...supportedComponentSurfaces].join(', ') : '(none declared yet — override surfaces are defined in Task 4.4)'}`,
      );
    }
    overrideMap[surface] = pathToFileURL(resolve(projectRootDir, relativePath)).href;
  }

  const styles = config.styles ?? [];
  for (let i = 0; i < styles.length; i++) {
    const p = styles[i];
    if (typeof p !== 'string' || p.length === 0) {
      throw new Error(
        `[portfolio-engine] styles[${i}] must be a non-empty string path, got ${p === null ? 'null' : typeof p}.`,
      );
    }
  }
  if (styles.length > 0) {
    // JSON-encoded array — avoids ambiguity since file paths can legally contain ';'.
    overrideMap['__styles__'] = JSON.stringify(styles.map((p) => resolve(projectRootDir, p)));
  }

  return overrideMap;
}
