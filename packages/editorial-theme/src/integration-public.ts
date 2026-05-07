/**
 * Astro config entry only — imports Tailwind PostCSS and must not be bundled with theme runtime
 * (`resolveHeroBio`, components, etc.). Use `import { editorialTheme } from '@portfolio-engine/editorial-theme/integration'`.
 */
export { editorialTheme } from './integration.js';
export type { EditorialThemeOptions } from './integration.js';
