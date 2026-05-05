/**
 * Grouped CSS custom properties for the editorial palette (labels + usage copy for the admin UI).
 * Variable names match `design-tokens.css` in `@portfolio-engine/editorial-theme` — keep names in sync.
 */
export type DesignToken = { cssVar: string; label: string; usage: string };

export type DesignTokenGroup = { id: string; title: string; tokens: DesignToken[] };

export const EDITORIAL_THEME_TOKEN_GROUPS: DesignTokenGroup[] = [
  {
    id: 'primary',
    title: 'Primary colors',
    tokens: [
      {
        cssVar: '--ink',
        label: 'Ink',
        usage: 'Headings, primary text, primary buttons, key UI emphasis',
      },
      {
        cssVar: '--copper',
        label: 'Accent',
        usage: 'Links, eyebrow labels, featured badges, primary interactive highlights',
      },
    ],
  },
  {
    id: 'secondary',
    title: 'Secondary text & warmth',
    tokens: [
      {
        cssVar: '--stone-soft',
        label: 'Muted text',
        usage: 'Supporting copy, captions, dates, metadata, navigation hints',
      },
      {
        cssVar: '--clay',
        label: 'Clay',
        usage: 'Warmer hover states and secondary accent next to copper',
      },
      {
        cssVar: '--olive',
        label: 'Olive',
        usage: 'Tags, subtle decorative accents, secondary labels',
      },
    ],
  },
  {
    id: 'surfaces',
    title: 'Surfaces & backgrounds',
    tokens: [
      { cssVar: '--paper', label: 'Paper', usage: 'Default page background' },
      {
        cssVar: '--paper-light',
        label: 'Paper light',
        usage: 'Cards, inset panels, elevated sections',
      },
      {
        cssVar: '--pale-sand',
        label: 'Pale sand',
        usage: 'Soft section fills (e.g. testimonials, callouts)',
      },
    ],
  },
  {
    id: 'structure',
    title: 'Borders & dividers',
    tokens: [
      {
        cssVar: '--warm-line',
        label: 'Warm line',
        usage: 'Borders, dividers, table rules, card outlines',
      },
    ],
  },
  {
    id: 'typography',
    title: 'Typography tokens',
    tokens: [
      {
        cssVar: '--font-serif-stack',
        label: 'Serif stack',
        usage: 'Headings and display type (theme.typography.fonts.heading or fontFamily)',
      },
      {
        cssVar: '--font-sans-stack',
        label: 'Sans stack',
        usage: 'Body UI (theme.typography.fonts.body)',
      },
      {
        cssVar: '--font-mono-stack',
        label: 'Mono stack',
        usage: 'Code / monospace (theme.typography.fonts.mono)',
      },
      {
        cssVar: '--text-body',
        label: 'Body size',
        usage: 'Base reading size (theme.typography.scale.body or preset)',
      },
      {
        cssVar: '--text-title',
        label: 'Title size',
        usage: 'Page titles (theme.typography.scale.title or preset)',
      },
    ],
  },
];
