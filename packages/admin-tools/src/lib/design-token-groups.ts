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
        cssVar: '--color-text-primary',
        label: 'Primary text',
        usage: 'Headings, primary body text, primary buttons, key UI emphasis',
      },
      {
        cssVar: '--color-text-inverse',
        label: 'Inverse text',
        usage: 'Text on solid primary surfaces (e.g. primary button label, dark toast body)',
      },
      {
        cssVar: '--color-accent-primary',
        label: 'Accent',
        usage: 'Links, eyebrow labels, featured badges, primary interactive highlights',
      },
    ],
  },
  {
    id: 'secondary',
    title: 'Secondary text & accents',
    tokens: [
      {
        cssVar: '--color-text-muted',
        label: 'Muted text',
        usage: 'Supporting copy, captions, dates, metadata, navigation hints',
      },
      {
        cssVar: '--color-accent-secondary',
        label: 'Secondary accent',
        usage: 'Warmer secondary accent next to the primary accent',
      },
      {
        cssVar: '--color-accent-muted',
        label: 'Muted accent',
        usage: 'Tags, subtle decorative accents, secondary labels',
      },
    ],
  },
  {
    id: 'surfaces',
    title: 'Surfaces & backgrounds',
    tokens: [
      { cssVar: '--color-surface-page', label: 'Page surface', usage: 'Default page background' },
      {
        cssVar: '--color-surface-elevated',
        label: 'Elevated surface',
        usage: 'Cards, inset panels, elevated sections',
      },
      {
        cssVar: '--color-surface-wash',
        label: 'Wash surface',
        usage: 'Soft section fills (e.g. testimonials, callouts)',
      },
    ],
  },
  {
    id: 'structure',
    title: 'Borders & dividers',
    tokens: [
      {
        cssVar: '--color-border-default',
        label: 'Default border',
        usage: 'Borders, dividers, table rules, card outlines',
      },
      {
        cssVar: '--color-border-strong',
        label: 'Strong border',
        usage: 'Higher-contrast rules when default is too quiet',
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
        cssVar: '--text-display',
        label: 'Display size',
        usage: 'Hero / display type (theme.typography.scale.display or preset)',
      },
      {
        cssVar: '--text-title',
        label: 'Title size',
        usage: 'Page titles (theme.typography.scale.title or preset)',
      },
      {
        cssVar: '--text-heading',
        label: 'Heading size',
        usage: 'Section headings (theme.typography.scale.heading or preset)',
      },
      {
        cssVar: '--text-subheading',
        label: 'Subheading size',
        usage: 'Sub-section headings, card titles (theme.typography.scale.subheading or preset)',
      },
      {
        cssVar: '--text-body',
        label: 'Body size',
        usage: 'Base reading size (theme.typography.scale.body or preset)',
      },
      {
        cssVar: '--text-small',
        label: 'Small size',
        usage: 'Captions, metadata, small print (theme.typography.scale.small or preset)',
      },
      {
        cssVar: '--text-label',
        label: 'Label size',
        usage: 'Eyebrows, micro labels (theme.typography.scale.label or preset)',
      },
    ],
  },
];
