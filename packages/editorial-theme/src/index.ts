/// <reference types="@portfolio-engine/engine-core/client" />

// Utility exports
export { getBase, formatDate, sortByDateDesc, resolveAssetUrl } from './lib/utils.js';
export {
  editorialGoogleFontsStylesheetHref,
  EDITORIAL_GOOGLE_FONTS_STYLESHEET_HREF,
} from './lib/google-fonts.js';

export { editorialTheme } from './integration.js';
export type { EditorialThemeOptions } from './integration.js';
export { DEFAULT_OVERRIDE_SURFACES, DEFAULT_ROUTE_REGISTRY } from './registry.js';
