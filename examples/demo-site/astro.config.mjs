// @ts-check
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';
import { adminTools } from '@portfolio-engine/admin-tools';
import { editorialTheme } from '@portfolio-engine/editorial-theme';

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
    }),
    adminTools({ devBypass: true }),
  ],
});
