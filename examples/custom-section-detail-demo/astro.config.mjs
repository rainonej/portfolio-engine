// @ts-check
import { defineConfig } from 'astro/config';
import { editorialTheme } from '@portfolio-engine/editorial-theme/integration';

/**
 * This example proves that all four replaceable editorial-theme screens
 * (`/work`, `/work/[slug]`, `/writing`, `/writing/[slug]`) can be disabled
 * together and replaced with consumer-local pages from
 * `src/pages-local/` declared in `src/registry/portfolio-engine.registry.json`.
 *
 * No Vercel adapter, no admin-tools — the goal here is to keep the
 * surface minimal so the route replacement story is the only thing being
 * exercised end-to-end.
 */
export default defineConfig({
  output: 'static',
  integrations: [
    editorialTheme({
      siteConfigPath: './src/config/site.json',
      navigationConfigPath: './src/config/navigation.json',
      themeConfigPath: './src/config/theme.json',
      featuresConfigPath: './src/config/features.json',
      routes: {
        '/work': { enabled: false },
        '/work/[slug]': { enabled: false },
        '/writing': { enabled: false },
        '/writing/[slug]': { enabled: false },
      },
    }),
  ],
});
