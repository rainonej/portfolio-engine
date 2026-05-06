import type { ThemeConfig } from './theme-config.js';
import { resolveFontFamily, resolveFontFallback } from './theme-config.js';

export interface ResolvedCssVariable {
  value: string;
  source: string;
}

/** Default editorial palette — aligned with editorial-theme `design-tokens.css`. */
export const EDITORIAL_CSS_DEFAULTS: Record<string, string> = {
  '--color-surface-page': '#f7f4ef',
  '--color-surface-elevated': '#fcfbf8',
  '--color-surface-wash': '#efe6da',
  '--color-text-primary': '#1e1a17',
  '--color-text-muted': '#6b625b',
  '--color-text-inverse': '#fafaf9',
  '--color-accent-primary': '#9a5a2e',
  '--color-accent-secondary': '#b87c5a',
  '--color-accent-muted': '#5c6650',
  '--color-border-default': '#e6ded3',
};

const FONT_SANS_DEFAULT =
  '"Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const FONT_SERIF_DEFAULT =
  '"Cormorant Garamond", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
const FONT_MONO_DEFAULT =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

/** Comfortable type scale (CSS lengths). */
export const TYPO_SCALE_COMFORTABLE: Record<string, string> = {
  '--text-display': 'clamp(2.75rem, 6vw, 4rem)',
  '--text-title': 'clamp(2rem, 4vw, 3rem)',
  '--text-heading': 'clamp(1.5rem, 3vw, 2rem)',
  '--text-subheading': 'clamp(1.125rem, 2vw, 1.35rem)',
  '--text-body': '1rem',
  '--text-small': '0.875rem',
  '--text-label': '0.6875rem',
};

export const TYPO_SCALE_COMPACT: Record<string, string> = {
  '--text-display': 'clamp(2.25rem, 5vw, 3rem)',
  '--text-title': 'clamp(1.75rem, 3.5vw, 2.25rem)',
  '--text-heading': 'clamp(1.25rem, 2.5vw, 1.5rem)',
  '--text-subheading': 'clamp(1rem, 2vw, 1.125rem)',
  '--text-body': '0.9375rem',
  '--text-small': '0.8125rem',
  '--text-label': '0.625rem',
};

export function sanitizeCssValue(v: string): string {
  return v.replace(/[;{}<>]/g, '').trim();
}

function resolvedEntry(value: string, source: string): ResolvedCssVariable {
  return { value, source };
}

function pickColor(
  semantic: string | undefined,
  semanticSource: string,
  legacy: string | undefined,
  legacySource: string,
  defaultHex: string,
): ResolvedCssVariable {
  if (semantic) return resolvedEntry(sanitizeCssValue(semantic), semanticSource);
  if (legacy) return resolvedEntry(sanitizeCssValue(legacy), legacySource);
  return resolvedEntry(defaultHex, 'default');
}

/**
 * Merge theme.json into canonical CSS variables used by the editorial theme.
 * Precedence: semanticColors → legacy flat colors → defaults.
 */
export function resolveCssVariables(theme: ThemeConfig | undefined): Map<string, ResolvedCssVariable> {
  const t = theme ?? {};
  const sem = t.semanticColors;
  const leg = t.colors;
  const out = new Map<string, ResolvedCssVariable>();
  const D = EDITORIAL_CSS_DEFAULTS;

  out.set(
    '--color-surface-page',
    pickColor(
      sem?.surface?.page,
      'theme.semanticColors.surface.page',
      leg?.background,
      'theme.colors.background',
      D['--color-surface-page'],
    ),
  );
  out.set(
    '--color-surface-elevated',
    sem?.surface?.elevated
      ? resolvedEntry(sanitizeCssValue(sem.surface.elevated), 'theme.semanticColors.surface.elevated')
      : resolvedEntry(D['--color-surface-elevated'], 'default'),
  );
  out.set(
    '--color-text-primary',
    pickColor(
      sem?.text?.primary,
      'theme.semanticColors.text.primary',
      leg?.text,
      'theme.colors.text',
      D['--color-text-primary'],
    ),
  );
  out.set(
    '--color-text-muted',
    sem?.text?.muted
      ? resolvedEntry(sanitizeCssValue(sem.text.muted), 'theme.semanticColors.text.muted')
      : resolvedEntry(D['--color-text-muted'], 'default'),
  );
  out.set(
    '--color-text-inverse',
    sem?.text?.inverse
      ? resolvedEntry(sanitizeCssValue(sem.text.inverse), 'theme.semanticColors.text.inverse')
      : resolvedEntry(D['--color-text-inverse'], 'default'),
  );
  out.set(
    '--color-accent-primary',
    pickColor(
      sem?.accent?.primary,
      'theme.semanticColors.accent.primary',
      leg?.primary,
      'theme.colors.primary',
      D['--color-accent-primary'],
    ),
  );
  out.set(
    '--color-accent-secondary',
    pickColor(
      sem?.accent?.secondary,
      'theme.semanticColors.accent.secondary',
      leg?.secondary,
      'theme.colors.secondary',
      D['--color-accent-secondary'],
    ),
  );
  out.set(
    '--color-border-default',
    sem?.border?.default
      ? resolvedEntry(sanitizeCssValue(sem.border.default), 'theme.semanticColors.border.default')
      : resolvedEntry(D['--color-border-default'], 'default'),
  );
  if (sem?.border?.strong) {
    out.set(
      '--color-border-strong',
      resolvedEntry(sanitizeCssValue(sem.border.strong), 'theme.semanticColors.border.strong'),
    );
  }
  out.set(
    '--color-surface-wash',
    sem?.surface?.wash
      ? resolvedEntry(sanitizeCssValue(sem.surface.wash), 'theme.semanticColors.surface.wash')
      : resolvedEntry(D['--color-surface-wash'], 'default'),
  );
  out.set(
    '--color-accent-muted',
    sem?.accent?.muted
      ? resolvedEntry(sanitizeCssValue(sem.accent.muted), 'theme.semanticColors.accent.muted')
      : resolvedEntry(D['--color-accent-muted'], 'default'),
  );

  return out;
}

/** Typography-related CSS variables (font stacks + scale). */
export function resolveTypographyVariables(theme: ThemeConfig | undefined): Map<string, ResolvedCssVariable> {
  const out = new Map<string, ResolvedCssVariable>();
  const typo = theme?.typography;
  if (!typo) {
    out.set('--font-sans-stack', resolvedEntry(FONT_SANS_DEFAULT, 'default'));
    out.set('--font-serif-stack', resolvedEntry(FONT_SERIF_DEFAULT, 'default'));
    out.set('--font-mono-stack', resolvedEntry(FONT_MONO_DEFAULT, 'default'));
    for (const [k, v] of Object.entries(TYPO_SCALE_COMFORTABLE)) {
      out.set(k, resolvedEntry(v, 'default'));
    }
    return out;
  }

  // Resolve heading font — supports both legacy string and new structured FontEntry.
  const headingEntry = typo.fonts?.heading ?? typo.fontFamily;
  const rawHeadingFamily =
    typeof headingEntry === 'object' ? resolveFontFamily(headingEntry) : headingEntry;
  const headingFallbackRaw =
    typeof headingEntry === 'object'
      ? (resolveFontFallback(headingEntry) ?? 'ui-serif, Georgia, serif')
      : 'ui-serif, Georgia, serif';
  const headingFallback = sanitizeCssValue(headingFallbackRaw);

  const serifStack = rawHeadingFamily
    ? `${sanitizeCssValue(rawHeadingFamily)}, ${headingFallback}`
    : FONT_SERIF_DEFAULT;

  // Resolve body font
  const bodyEntry = typo.fonts?.body;
  const rawBodyFamily =
    typeof bodyEntry === 'object' ? resolveFontFamily(bodyEntry) : bodyEntry;
  const bodyFallbackRaw =
    typeof bodyEntry === 'object'
      ? (resolveFontFallback(bodyEntry) ?? 'ui-sans-serif, system-ui, sans-serif')
      : 'ui-sans-serif, system-ui, sans-serif';
  const bodyFallback = sanitizeCssValue(bodyFallbackRaw);

  const sansStack = rawBodyFamily
    ? `${sanitizeCssValue(rawBodyFamily)}, ${bodyFallback}`
    : FONT_SANS_DEFAULT;

  out.set(
    '--font-serif-stack',
    resolvedEntry(
      serifStack,
      rawHeadingFamily
        ? typo.fonts?.heading
          ? 'theme.typography.fonts.heading'
          : 'theme.typography.fontFamily'
        : 'default',
    ),
  );
  out.set(
    '--font-sans-stack',
    resolvedEntry(
      rawBodyFamily ? sansStack : FONT_SANS_DEFAULT,
      rawBodyFamily ? 'theme.typography.fonts.body' : 'default',
    ),
  );

  // Resolve mono font
  const monoEntry = typo.fonts?.mono;
  const rawMonoFamily =
    typeof monoEntry === 'object' ? resolveFontFamily(monoEntry) : monoEntry;
  const monoFallbackRaw =
    typeof monoEntry === 'object'
      ? (resolveFontFallback(monoEntry) ?? 'ui-monospace, monospace')
      : 'ui-monospace, monospace';
  const monoFallback = sanitizeCssValue(monoFallbackRaw);

  const monoStack = rawMonoFamily
    ? `${sanitizeCssValue(rawMonoFamily)}, ${monoFallback}`
    : FONT_MONO_DEFAULT;
  out.set(
    '--font-mono-stack',
    resolvedEntry(monoStack, rawMonoFamily ? 'theme.typography.fonts.mono' : 'default'),
  );

  const presetMap =
    typo.preset === 'compact' ? TYPO_SCALE_COMPACT : TYPO_SCALE_COMFORTABLE;
  const scaleKeys = [
    'display',
    'title',
    'heading',
    'subheading',
    'body',
    'small',
    'label',
  ] as const;
  const scale = typo.scale ?? {};

  for (const key of scaleKeys) {
    const cssVar = `--text-${key}`;
    const custom = scale[key];
    if (custom) {
      out.set(cssVar, resolvedEntry(sanitizeCssValue(custom), `theme.typography.scale.${key}`));
    } else {
      const presetVal = presetMap[cssVar];
      out.set(
        cssVar,
        resolvedEntry(
          presetVal,
          typo.preset === 'compact' ? 'preset:compact' : 'preset:comfortable',
        ),
      );
    }
  }

  if (typo.fontSize) {
    out.set('font-size', resolvedEntry(sanitizeCssValue(typo.fontSize), 'theme.typography.fontSize'));
  }

  return out;
}

/** `:root { ... }` block with non-default theme overrides only (colors + typography). */
export function buildThemeOverrideCss(theme: ThemeConfig | undefined): string {
  const colors = resolveCssVariables(theme);
  const typos = resolveTypographyVariables(theme);

  const lines: string[] = [];

  for (const [key, { value, source }] of colors) {
    if (source !== 'default') lines.push(`  ${key}: ${value};`);
  }
  for (const [key, { value, source }] of typos) {
    if (source !== 'default') {
      if (key === 'font-size') lines.push(`  font-size: ${value};`);
      else lines.push(`  ${key}: ${value};`);
    }
  }

  if (lines.length === 0) return '';
  return `:root {\n${lines.join('\n')}\n}`;
}

export interface DesignSnapshot {
  schemaVersion: 1;
  generatedAt: string;
  cssVariables: Record<string, ResolvedCssVariable>;
}

/** Flattened snapshot for agents / CI (colors + typography variables). */
export function buildDesignSnapshot(theme: ThemeConfig | undefined, generatedAt = new Date().toISOString()): DesignSnapshot {
  const merged = new Map<string, ResolvedCssVariable>();
  for (const [k, v] of resolveCssVariables(theme)) merged.set(k, v);
  for (const [k, v] of resolveTypographyVariables(theme)) merged.set(k, v);

  return {
    schemaVersion: 1,
    generatedAt,
    cssVariables: Object.fromEntries(merged),
  };
}
