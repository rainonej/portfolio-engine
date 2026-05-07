/// <reference types="@portfolio-engine/engine-core/client" />

// Utility exports
export { getBase, formatDate, sortByDateDesc, resolveAssetUrl } from './lib/utils.js';
export {
  editorialGoogleFontsStylesheetHref,
  EDITORIAL_GOOGLE_FONTS_STYLESHEET_HREF,
} from './lib/google-fonts.js';
export {
  resolveLongBioParagraphs,
  resolveHeroBio,
  type ProfilePerson,
} from './lib/profile-person.js';

export { DEFAULT_OVERRIDE_SURFACES, DEFAULT_ROUTE_REGISTRY } from './registry.js';

/** Default relative path for consumer registry JSON — same default used by engine-core. */
export { CONSUMER_REGISTRY_DEFAULT_RELATIVE_PATH } from '@portfolio-engine/schema';
