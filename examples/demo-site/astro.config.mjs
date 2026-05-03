// @ts-check
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';
import { adminTools } from '@portfolio-engine/admin-tools';
import { DEFAULT_OVERRIDE_SURFACES, DEFAULT_ROUTE_REGISTRY, editorialTheme } from '@portfolio-engine/editorial-theme';

const routeRegistry = DEFAULT_ROUTE_REGISTRY.map((route) => ({
  ...route,
  agentGuidance: `Prefer ${route.label} for ${route.visibility === 'public' ? 'public-facing' : 'internal'} navigation tasks.`,
}));

const overrideRegistry = DEFAULT_OVERRIDE_SURFACES.map((surface) => ({
  ...surface,
  docsUrl: '/admin',
  guidance: `Use ${surface.name} for downstream customization before proposing upstream edits.`,
}));

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    editorialTheme({
      siteConfigPath: './src/config/site.json',
      navigationConfigPath: './src/config/navigation.json',
      themeConfigPath: './src/config/theme.json',
      featuresConfigPath: './src/config/features.json',
      overrides: {
        components: {
          Hero: './src/overrides/Hero.astro',
        },
      },
      registries: {
        routes: routeRegistry,
        overrideSurfaces: overrideRegistry,
      },
    }),
    adminTools({ devBypass: true }),
  ],
});
