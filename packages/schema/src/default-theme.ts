import type { ThemeConfig } from './theme-config.js';

/**
 * Structured default theme — suitable for downstream scaffolding.
 * Copy this into `src/config/theme.json` and edit values, names, roles,
 * and usage guidance to match your site's visual identity.
 *
 * Every token is self-documenting: value, name, cssVar, role, usage, avoid, examples.
 * Downstream sites must NOT define color values anywhere else.
 */
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  semanticColors: {
    surface: {
      page: {
        value: '#f7f4ef',
        name: 'Editorial Page',
        cssVar: '--color-surface-page',
        role: 'Main page background',
        usage: 'Use for the body/page background and large quiet surfaces.',
        avoid: ['Do not use for cards that need elevation above the page.'],
        examples: ['body', 'main page wrapper', 'quiet full-width sections'],
      },
      elevated: {
        value: '#fcfbf8',
        name: 'Elevated Surface',
        cssVar: '--color-surface-elevated',
        role: 'Elevated surface background',
        usage: 'Use for cards, panels, callouts, and surfaces that need separation from the page.',
        avoid: [],
        examples: ['cards', 'modals', 'callout panels'],
      },
      wash: {
        value: '#efe6da',
        name: 'Warm Wash',
        cssVar: '--color-surface-wash',
        role: 'Warm section fill',
        usage: 'Use for alternating section backgrounds, skill chips, and tag fills.',
        avoid: ['Do not use for the primary page background.'],
        examples: ['section backgrounds', 'skill tags', 'quiet divider fills'],
      },
    },
    text: {
      primary: {
        value: '#1e1a17',
        name: 'Dark Ink',
        cssVar: '--color-text-primary',
        role: 'Primary text',
        usage: 'Use for headings, body text, and high-priority labels.',
        avoid: [],
        examples: ['h1', 'body', 'primary nav labels'],
      },
      muted: {
        value: '#6b625b',
        name: 'Muted Warm Grey',
        cssVar: '--color-text-muted',
        role: 'Secondary text',
        usage: 'Use for metadata, captions, helper text, and subdued descriptions.',
        avoid: ['Do not use for important claims or metrics.'],
        examples: ['date labels', 'descriptions', 'eyebrows'],
      },
      inverse: {
        value: '#fafaf9',
        name: 'Inverse Text',
        cssVar: '--color-text-inverse',
        role: 'Text on solid primary surfaces',
        usage: 'Use for text placed on dark or accent-filled backgrounds.',
        avoid: ['Do not use on light backgrounds.'],
        examples: ['primary button labels', 'dark hero text'],
      },
    },
    accent: {
      primary: {
        value: '#9a5a2e',
        name: 'Warm Copper',
        cssVar: '--color-accent-primary',
        role: 'Primary action and proof accent',
        usage: 'Use for links, diagnostics, proof, icons, key callouts, metric badges, and CTAs.',
        avoid: ['Do not flood large backgrounds with this color.'],
        examples: ['links', 'CTA borders', 'metric badges', 'proof markers'],
      },
      secondary: {
        value: '#b87c5a',
        name: 'Light Copper',
        cssVar: '--color-accent-secondary',
        role: 'Secondary editorial accent',
        usage: 'Use sparingly for contrast, secondary callouts, and warm emphasis.',
        avoid: ['Do not compete with the primary accent.'],
        examples: ['secondary badge', 'small highlight', 'editorial accent'],
      },
      muted: {
        value: '#5c6650',
        name: 'Olive Muted',
        cssVar: '--color-accent-muted',
        role: 'Supporting accent for tags and quiet highlights',
        usage: 'Use for skill tags, quiet pill labels, and tertiary icons.',
        avoid: ['Do not use where primary accent is expected.'],
        examples: ['skill tags', 'category pills', 'quiet icon fills'],
      },
    },
    border: {
      default: {
        value: '#e6ded3',
        name: 'Warm Border',
        cssVar: '--color-border-default',
        role: 'Default structural border',
        usage: 'Use for cards, dividers, tables, and quiet boundaries.',
        avoid: [],
        examples: ['card border', 'horizontal divider', 'table row separator'],
      },
    },
  },
  typography: {
    fonts: {
      heading: {
        family: 'Cormorant Garamond',
        fallback: 'Georgia, serif',
        provider: 'google',
        usage: 'Headings, hero text, pull quotes, and achievement titles.',
      },
      body: {
        family: 'Inter',
        fallback: 'ui-sans-serif, system-ui, sans-serif',
        provider: 'google',
        usage: 'Body text, labels, tags, metadata, and navigation.',
      },
    },
    preset: 'comfortable',
  },
  guidance: {
    principles: [
      'Use semantic CSS variables, not hard-coded colors.',
      'Use primary accent for proof, diagnostics, links, icons, key callouts, and metric badges.',
      'Use secondary accent sparingly.',
      'Make outcomes visually prominent.',
      'Cards should look obviously clickable: border, hover state, full-card link target.',
      'For v0-generated UI, normalize colors back to semantic CSS variables before merging.',
      'Prefer shared component polish over page-local one-off styling.',
    ],
  },
};
