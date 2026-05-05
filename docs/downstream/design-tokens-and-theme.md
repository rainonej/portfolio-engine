# Design tokens and `theme.json`

The editorial theme exposes a warm neutral palette and type scale as **CSS custom properties** in `@portfolio-engine/editorial-theme/styles/design-tokens.css`. Optional overrides come from **`src/config/theme.json`**, validated by `ThemeConfigSchema` in `@portfolio-engine/schema`.

## Resolution pipeline

1. **Defaults** — `design-tokens.css` sets `--paper`, `--ink`, `--text-*`, font stacks, and admin aliases (`--adm-*`).
2. **Theme overrides** — At runtime, `ThemeTokenOverrides.astro` injects a `:root` block built with `buildThemeOverrideCss()` from `@portfolio-engine/schema`. Only variables that differ from defaults are emitted.
3. **Semantic vs legacy colors** — Prefer **`semanticColors`** (roles such as `surface.page`, `text.primary`). Legacy flat **`colors`** (`background`, `text`, `primary`, …) still work and map into the same CSS variables when semantic roles are absent.
4. **Build artifact** — On `astro build`, the engine integration writes **`.portfolio-engine/design-snapshot.json`**: every canonical variable with its **computed value** and **source** (`theme.semanticColors…`, `theme.colors…`, `preset:comfortable`, or `default`). Use this for tooling, reviews, and the admin Design section.

## `theme.json` shape (high level)

- **`semanticColors`** — `surface` (`page`, `elevated`, `wash`), `text` (`primary`, `muted`), `accent` (`primary`, `secondary`, `muted`), `border` (`default`). Values are CSS colors (e.g. hex).
- **`typography`** — `fonts.heading`, `fonts.body`, `fonts.mono`; optional **`preset`**: `comfortable` | `compact`; optional **`scale`**: `display`, `title`, `heading`, `subheading`, `body`, `small`, `label` (CSS lengths). Legacy **`fontFamily`** and **`fontSize`** on `:root` are still supported.
- **`colors`** — Legacy `primary`, `secondary`, `background`, `text`.

## Admin preview

The admin UI imports the same `global.css` as the public site and runs **`ThemeTokenOverrides`**. Token cards expose **`data-pe-token`** (the variable name without `--`) and show the resolver **source** line when a snapshot is available.

## Example

```json
{
  "semanticColors": {
    "surface": { "page": "#f5f2ec", "wash": "#efe6da" },
    "text": { "primary": "#1a1714", "muted": "#5c534c" },
    "accent": { "primary": "#8b4d28", "secondary": "#a66f4d" },
    "border": { "default": "#e0d8ce" }
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
