import type { AstroIntegration } from 'astro';
import tailwindcssPostcss from '@tailwindcss/postcss';
import { createEngineIntegration } from '@portfolio-engine/engine-core';
import type { EngineIntegrationOptions } from '@portfolio-engine/engine-core';
import { DEFAULT_OVERRIDE_SURFACES, DEFAULT_ROUTE_REGISTRY } from './registry.js';

export type EditorialThemeOptions = EngineIntegrationOptions;

/** Prevent Rollup from bundling Tailwind's toolchain + native Oxide addons for SSR (breaks Vercel/Linux builds). */
const TAILWIND_SSR_EXTERNAL = [
  '@tailwindcss/postcss',
  'tailwindcss',
  '@tailwindcss/node',
  '@tailwindcss/oxide',
  '@tailwindcss/oxide-android-arm64',
  '@tailwindcss/oxide-darwin-arm64',
  '@tailwindcss/oxide-darwin-x64',
  '@tailwindcss/oxide-freebsd-x64',
  '@tailwindcss/oxide-linux-arm64-gnu',
  '@tailwindcss/oxide-linux-arm-gnueabihf',
  '@tailwindcss/oxide-linux-arm64-musl',
  '@tailwindcss/oxide-linux-x64-musl',
  '@tailwindcss/oxide-linux-x64-gnu',
  '@tailwindcss/oxide-win32-x64-msvc',
  '@tailwindcss/oxide-win32-arm64-msvc',
  '@tailwindcss/oxide-wasm32-wasi',
] as const satisfies readonly string[];

/**
 * Returns an array of integrations: Tailwind CSS (PostCSS, via Vite `css.postcss`) + engine-core.
 * Astro accepts arrays in its integrations list and flattens them, so consumers
 * can use this exactly like a single integration:
 *   integrations: [editorialTheme({ ... })]  // import from `@portfolio-engine/editorial-theme/integration`
 *
 * Consumer-local routes: optional `src/registry/portfolio-engine.registry.json` +
 * `src/pages-local/*.astro` — see `docs/downstream/custom-page-via-registry.md`.
 */
export function editorialTheme(options: EditorialThemeOptions): AstroIntegration[] {
  const tailwindIntegration: AstroIntegration = {
    name: '@portfolio-engine/editorial-theme/tailwind',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            /**
             * PostCSS pipeline keeps Tailwind off Rollup's SSR JS graph. The Vite plugin pulls
             * `@tailwindcss/oxide` `.node` binaries into the server bundle and breaks Astro builds.
             */
            css: {
              postcss: {
                plugins: [tailwindcssPostcss()],
              },
            },
            ssr: {
              external: [...TAILWIND_SSR_EXTERNAL],
            },
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
