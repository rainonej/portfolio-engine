/**
 * Upstream self-check config for check-theme-token-boundaries.mjs.
 *
 * Scope: workflow-kit templates (must ship clean) and the passing fixture.
 * Demo-site public assets (SVGs, existing HTML demos) contain pre-existing
 * literal colors baked into static presentation files and are excluded here.
 * Downstream sites are responsible for running their own boundary check with
 * a config scoped to their src/ and public/ trees.
 */

export default {
  tokenAuthority: ['examples/demo-site/src/config/theme.json'],

  tokenConsumers: [
    // workflow-kit templates must not ship literal color values
    'packages/workflow-kit/templates/**/*.{css,md}',
    // passing fixture must stay clean
    'scripts/fixtures/theme-token-boundaries/passing-*.html',
  ],

  ignore: ['node_modules/**', 'dist/**', '.astro/**', '.vercel/**', 'coverage/**'],

  allowedTokenPrefixes: ['--color-', '--font-', '--text-', '--space-', '--shadow-'],
};
