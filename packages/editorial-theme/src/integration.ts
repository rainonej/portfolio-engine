import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'node:url';
import tailwindcss from 'tailwindcss';
import { createEngineIntegration } from '@portfolio-engine/engine-core';
import type { EngineIntegrationOptions } from '@portfolio-engine/engine-core';

export type EditorialThemeOptions = EngineIntegrationOptions;

/**
 * Returns an array of integrations: Tailwind CSS (via PostCSS) + engine-core.
 * Astro accepts arrays in its integrations list and flattens them, so consumers
 * can use this exactly like a single integration:
 *   integrations: [editorialTheme({ ... })]
 */
export function editorialTheme(options: EditorialThemeOptions): AstroIntegration[] {
  const tailwindConfigPath = fileURLToPath(new URL('../tailwind.config.ts', import.meta.url));

  const tailwindIntegration: AstroIntegration = {
    name: '@portfolio-engine/editorial-theme/tailwind',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            css: {
              postcss: {
                // tailwindcss v3's PostCSS plugin type predates PostCSS 8's strict Plugin
                // type; the runtime contract is correct, so we narrow with `as never`.
                plugins: [tailwindcss({ config: tailwindConfigPath }) as never],
              },
            },
          },
        });
      },
    },
  };

  return [tailwindIntegration, createEngineIntegration(options)];
}
