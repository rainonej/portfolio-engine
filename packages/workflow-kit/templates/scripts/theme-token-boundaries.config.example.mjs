/**
 * theme-token-boundaries.config.example.mjs
 *
 * Copy this file to your project root as theme-token-boundaries.config.mjs
 * and customise it for your downstream site.
 *
 * The check enforces: color values belong only in tokenAuthority files.
 * Everything else must consume semantic tokens via var(--color-*).
 */

export default {
  /**
   * Files that are allowed to contain literal color values.
   * Only src/config/theme.json should be here.
   */
  tokenAuthority: ['src/config/theme.json'],

  /**
   * Files that must NOT define literal color values.
   * These files must use var(--color-*) for all color references.
   */
  tokenConsumers: [
    'public/**/*.html',
    'public/**/*.svg',
    'src/content/**/*.{md,mdx,html}',
    'src/pages-local/**/*.{astro,html,css}',
    'src/overrides/**/*.{astro,html,css}',
    'src/components/**/*.{astro,html,css,ts,tsx}',
    'src/templates/**/*.{astro,html,css,ts,tsx}',
    'src/context/**/*.{json,md}',
  ],

  /**
   * Paths to skip entirely (build artifacts, images, dependencies).
   */
  ignore: [
    'node_modules/**',
    'dist/**',
    '.astro/**',
    '.vercel/**',
    'coverage/**',
    'public/**/*.png',
    'public/**/*.jpg',
    'public/**/*.jpeg',
    'public/**/*.webp',
    'public/**/*.gif',
    'public/**/*.ico',
  ],

  /**
   * CSS variable prefixes that are considered canonical token references.
   * Variables with these prefixes are allowed to be consumed (via var()) but
   * must not be redefined with literal values outside tokenAuthority.
   */
  allowedTokenPrefixes: ['--color-', '--font-', '--text-', '--space-', '--shadow-'],
};
