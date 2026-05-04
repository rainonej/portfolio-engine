import type { AstroIntegration } from 'astro';
import tailwindcss from '@tailwindcss/vite';
import { createEngineIntegration } from '@portfolio-engine/engine-core';
import type { EngineIntegrationOptions } from '@portfolio-engine/engine-core';
import { DEFAULT_OVERRIDE_SURFACES, DEFAULT_ROUTE_REGISTRY } from './registry.js';

export type EditorialThemeOptions = EngineIntegrationOptions;

/**
 * Returns an array of integrations: Tailwind CSS (via Vite plugin) + engine-core.
 * Astro accepts arrays in its integrations list and flattens them, so consumers
 * can use this exactly like a single integration:
 *   integrations: [editorialTheme({ ... })]
 */
export function editorialTheme(options: EditorialThemeOptions): AstroIntegration[] {
  const tailwindIntegration: AstroIntegration = {
    name: '@portfolio-engine/editorial-theme/tailwind',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [tailwindcss()],
          },
        });
      },
    },
  };

  return [
    tailwindIntegration,
    createEngineIntegration({
      ...options,
      registries: {
        routes: options.registries?.routes ?? DEFAULT_ROUTE_REGISTRY,
        overrideSurfaces: options.registries?.overrideSurfaces ?? DEFAULT_OVERRIDE_SURFACES,
      },
    }),
  ];
}
