# Consuming portfolio-engine

## Consumer site layout

The canonical `src/` directory contract for any consumer site:

```
your-site/
  src/
    config/     JSON config files consumed by editorialTheme()
    content/    Astro content collections
    context/    Site-owner identity and brand voice (agent use)
    overrides/  Component overrides (named surfaces only)
```

These directories are contract-stable. The build always reads `config/` and `content/`. Files under `src/overrides/` change the site **when** you wire them through `editorialTheme({ overrides })` (the integration resolves paths at config time and theme components load them at render time). `context/` is not read by the build—it is for AI-assisted workflows only.

There are two modes for consuming portfolio-engine packages, depending on whether you are a downstream site owner or an engine contributor.

## Semver mode (separate consumer repo)

The production mode for `agreni-site` and `jordan-site`. Your consumer repo is a standalone Astro project with no direct knowledge of the monorepo.

**Install from npm:**

```bash
pnpm add @portfolio-engine/editorial-theme@latest
```

**`astro.config.mjs`:**

```js
import { defineConfig } from 'astro/config';
import { editorialTheme } from '@portfolio-engine/editorial-theme';

export default defineConfig({
  integrations: [
    editorialTheme({
      siteConfigPath: './src/config/site.json',
      navigationConfigPath: './src/config/navigation.json',
      themeConfigPath: './src/config/theme.json',
      featuresConfigPath: './src/config/features.json',
    }),
  ],
});
```

**Upgrade:** bump the version in `package.json` and run `pnpm install`. Pin to a specific minor to control when you pick up changes.

## Workspace-link mode (monorepo contributor)

Use this when you need to change engine packages and see results in a consumer site at the same time, without publishing to npm.

**Option A — `link:` in the consumer repo** (cross-repo, most common for agreni-site):

```json
{
  "dependencies": {
    "@portfolio-engine/editorial-theme": "link:../portfolio-engine/packages/editorial-theme"
  }
}
```

Run `pnpm install` in the consumer repo after changing the reference. Source changes in the monorepo reflect on the next consumer build without reinstalling.

**Option B — add the consumer to the monorepo workspace** (for demo-site and integration testing):

In `pnpm-workspace.yaml` include the consumer path, then use `workspace:*` in `package.json`:

```json
{
  "dependencies": {
    "@portfolio-engine/editorial-theme": "workspace:*"
  }
}
```

Run `pnpm install` from the monorepo root. `pnpm -r run build` will include the consumer.

## Switching between modes

To switch a consumer repo from workspace-link to semver:

1. Replace `"link:..."` or `"workspace:*"` with the published semver version (e.g., `"^0.2.0"`) in the consumer's `package.json`.
2. Run `pnpm install` in the consumer repo.
3. Verify the build still passes: `pnpm build`.

To switch from semver back to workspace-link:

1. Replace the semver version with `"link:../portfolio-engine/packages/editorial-theme"`.
2. Run `pnpm install`.
3. Any source changes in the monorepo now take effect on the next build.

## Overrides

Overrides are **not** picked up from disk automatically. Pass an `overrides` object to `editorialTheme()` with paths **relative to the consumer project root**. Only named surfaces declared by the engine are valid; unsupported names fail at build time.

**Supported component surfaces (v1):** `Hero`, `FeaturedWriting`, `TestimonialSection`, `CollaborationSection`. You may also pass `styles` for extra CSS files merged after the theme’s global styles.

**Example — `astro.config.mjs`:**

```js
import { defineConfig } from 'astro/config';
import { editorialTheme } from '@portfolio-engine/editorial-theme';

export default defineConfig({
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
        styles: ['./src/overrides/custom.css'],
      },
    }),
  ],
});
```

By convention, keep those files under `src/overrides/` (any layout under that folder is fine as long as the paths in `overrides` match). Do not point at arbitrary internal theme files—only the supported surface keys above are stable.

```
your-site/
  src/
    overrides/
      Hero.astro        ← example: wired via overrides.components.Hero
      custom.css        ← example: wired via overrides.styles
```
