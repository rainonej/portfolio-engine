// @ts-check
import { defineConfig } from 'astro/config';
import { editorialTheme } from '@portfolio-engine/editorial-theme';

export default defineConfig({
  integrations: [
    editorialTheme({
      siteConfigPath: './config/site.json',
      navigationConfigPath: './config/navigation.json',
      themeConfigPath: './config/theme.json',
      featuresConfigPath: './config/features.json',
    }),
  ],
});
