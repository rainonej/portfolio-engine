# Consuming portfolio-engine

There are two modes for consuming portfolio-engine packages, depending on whether you are editing the engine or just using it.

## Installed mode (normal consumption)

Install from npm at a pinned version. This is the production mode for `agreni-site`.

```bash
pnpm add @portfolio-engine/editorial-theme@0.1.0
```

```js
// astro.config.mjs
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
```

Upgrade by bumping the version in `package.json` and running `pnpm install`.

## Local-dev mode (cross-repo development)

When making changes to engine packages and testing them in `agreni-site` simultaneously, use `pnpm link` or `workspace:*` references.

```json
{
  "dependencies": {
    "@portfolio-engine/editorial-theme": "link:../portfolio-engine/packages/editorial-theme"
  }
}
```

Run `pnpm install` in `agreni-site` after changing the reference. Changes in `portfolio-engine` packages reflect immediately.

## Overrides

Place override files in `src/overrides/components/` in your consumer site. The exact named surfaces are defined by `@portfolio-engine/editorial-theme` (Task 4.4). Do not override arbitrary internal files — only named surfaces are stable.

```
agreni-site/
  src/
    overrides/
      components/
        Nav.astro         ← replaces the theme's Nav
```
