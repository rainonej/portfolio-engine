import { resolve } from 'node:path';
import type { OverrideMap } from './types.js';

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
const SUPPORTED_COMPONENT_SURFACES = new Set<string>([
  // Populated by Task 4.4 (define override points). Empty in v1 until theme exists.
]);

export function resolveOverrides(config: OverrideConfig, projectRootDir: string): OverrideMap {
  const overrideMap: OverrideMap = {};

  const components = config.components ?? {};
  for (const [surface, relativePath] of Object.entries(components)) {
    if (!SUPPORTED_COMPONENT_SURFACES.has(surface)) {
      throw new Error(
        `[portfolio-engine] Unknown component override surface: "${surface}".\n` +
          `  Supported surfaces: ${SUPPORTED_COMPONENT_SURFACES.size > 0 ? [...SUPPORTED_COMPONENT_SURFACES].join(', ') : '(none declared yet — override surfaces are defined in Task 4.4)'}`,
      );
    }
    overrideMap[surface] = resolve(projectRootDir, relativePath);
  }

  const styles = config.styles ?? [];
  if (styles.length > 0) {
    // JSON-encoded array — avoids ambiguity since file paths can legally contain ';'.
    overrideMap['__styles__'] = JSON.stringify(styles.map((p) => resolve(projectRootDir, p)));
  }

  return overrideMap;
}
