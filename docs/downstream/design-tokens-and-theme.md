# Design tokens and `theme.json`

The editorial theme exposes a **semantic** palette and type scale as CSS custom properties in **`@portfolio-engine/editorial-theme/styles/design-tokens.css`**. Optional overrides come from **`src/config/theme.json`**, validated by `ThemeConfigSchema` in `@portfolio-engine/schema`.

Also documented from the package angle in **[`docs/packages/editorial-theme.md`](../packages/editorial-theme.md)** (consumer overview).

## Canonical color variables

Use only semantic tokens such as:

- `--color-surface-page`, `--color-surface-elevated`, `--color-surface-wash`
- `--color-text-primary`, `--color-text-muted`, `--color-text-inverse`
- `--color-accent-primary`, `--color-accent-secondary`, `--color-accent-muted`
- `--color-border-default`, `--color-border-strong`

Component-level aliases (for example `--nav-background`, `--card-border`) are defined in `design-tokens.css` and **reference** semantic tokens; prefer semantic names in new consumer CSS.

The monorepo runs **`pnpm check:tokens`** to guard against legacy palette names, raw Tailwind `stone`/`amber`/`white` utilities in reusable theme/admin source, and stray hex outside approved token files.

## Resolution pipeline

1. **Defaults** — `design-tokens.css` sets semantic `--color-*`, `--text-*`, font stacks, and admin aliases (`--adm-*`).
2. **Theme overrides** — At runtime, `ThemeTokenOverrides.astro` injects a `:root` block built with `buildThemeOverrideCss()` from `@portfolio-engine/schema`. Only variables that differ from defaults are emitted.
3. **Semantic vs legacy colors** — Prefer **`semanticColors`** (roles such as `surface.page`, `text.primary`, `border.strong`). Legacy flat **`colors`** (`background`, `text`, `primary`, …) still map into the same **semantic** CSS variables when semantic roles are absent.
4. **Build artifact** — On `astro build`, the engine integration writes **`.portfolio-engine/design-snapshot.json`**: canonical variables with **computed value** and **source** (`theme.semanticColors…`, `theme.colors…`, `preset:comfortable`, or `default`). Use this for tooling, reviews, and the admin Design section.

## Google Fonts

Public **`Layout.astro`** and the admin shell load **`editorialGoogleFontsStylesheetHref(theme)`** from `@portfolio-engine/editorial-theme`. It derives a Google Fonts CSS2 URL from the first concrete family in `typography.fonts.heading` (or legacy `fontFamily`), `fonts.body`, and optional **`fonts.mono`**, and skips generic CSS keywords (`serif`, `system-ui`, …). Families **must exist on Google Fonts** for that stylesheet to apply; self-hosted or proprietary fonts still require your own `@font-face` / link tags in addition to `theme.json`.

## `theme.json` shape (high level)

- **`semanticColors`** — `surface` (`page`, `elevated`, `wash`), `text` (`primary`, `muted`, `inverse`), `accent` (`primary`, `secondary`, `muted`), `border` (`default`, `strong`). Values are CSS colors (e.g. hex).
- **`typography`** — `fonts.heading`, `fonts.body`, `fonts.mono`; optional **`preset`**: `comfortable` | `compact`; optional **`scale`**: `display`, `title`, `heading`, `subheading`, `body`, `small`, `label` (CSS lengths). Legacy **`fontFamily`** and **`fontSize`** on `:root` are still supported.
- **`colors`** — Legacy `primary`, `secondary`, `background`, `text` (mapped into semantic variables by `design-resolve.ts`).

## Admin preview

The admin UI imports the same `global.css` as the public site and runs **`ThemeTokenOverrides`**. Token cards expose **`data-pe-token`** (the variable name without `--`) and show the resolver **source** line when a snapshot is available.

## Example

```json
{
  "semanticColors": {
    "surface": { "page": "#f5f2ec", "wash": "#efe6da" },
    "text": { "primary": "#1a1714", "muted": "#5c534c", "inverse": "#fafaf9" },
    "accent": { "primary": "#8b4d28", "secondary": "#a66f4d" },
    "border": { "default": "#e0d8ce", "strong": "#cfc6bb" }
  },
  "typography": {
    "preset": "comfortable",
    "fonts": {
      "heading": "Cormorant Garamond",
      "body": "Inter"
    },
    "scale": {
      "body": "1.0625rem"
    }
  }
}
```

An empty `{}` theme file is valid: the site uses editorial defaults only.
