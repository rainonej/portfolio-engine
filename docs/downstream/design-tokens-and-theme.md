# Design tokens and `theme.json`

The editorial theme exposes a **semantic** palette and type scale as CSS custom properties in **`@portfolio-engine/editorial-theme/styles/design-tokens.css`**. Downstream color values, roles, and usage guidance belong in **`src/config/theme.json`** — the single downstream theme authority.

Also documented from the package angle in **[`docs/packages/editorial-theme.md`](../packages/editorial-theme.md)** (consumer overview).

## Single-authority doctrine

```
src/config/theme.json   — the only downstream theme authority
                          owns: token values, names, CSS var mappings,
                          roles, usage guidance, and agent guidance

src/context/**          — identity, voice, route structure, agent process
                          NOT a color-token source

src/overrides/**        — consumes tokens and customises approved surfaces
                          must NOT define canonical --color-* values
                          must NOT define private literal palettes

public/**/*.html        — renders/consumed content, not a theme authority
                          must use var(--color-*), not local color values

Components, pages, MDX, SVGs, and iframe demos
                        — consume tokens only via var(--color-*)
```

## Canonical color variables

Use only semantic tokens:

- `--color-surface-page`, `--color-surface-elevated`, `--color-surface-wash`
- `--color-text-primary`, `--color-text-muted`, `--color-text-inverse`
- `--color-accent-primary`, `--color-accent-secondary`, `--color-accent-muted`
- `--color-border-default`, `--color-border-strong`

Component-level aliases (for example `--nav-background`, `--card-border`) are defined in `design-tokens.css` and reference semantic tokens; prefer semantic names in new consumer CSS.

The monorepo runs **`pnpm check:tokens`** to guard against legacy palette names and raw hex outside approved token files, and **`pnpm check:theme-token-boundaries`** to guard against literal color values in public HTML, overrides, context, and other consumer paths.

## Resolution pipeline

1. **Defaults** — `design-tokens.css` sets semantic `--color-*`, `--text-*`, font stacks, and admin aliases (`--adm-*`).
2. **Theme overrides** — At runtime, `ThemeTokenOverrides.astro` injects a `:root` block built with `buildThemeOverrideCss()` from `@portfolio-engine/schema`. Only variables that differ from defaults are emitted.
3. **Semantic colors** — `semanticColors` (roles such as `surface.page`, `text.primary`, `border.strong`) each hold a structured token object with `value`, `name`, `cssVar`, `role`, `usage`, `avoid`, and `examples`. The resolver reads `semanticColors.*.*.value` only.
4. **Build artifact** — On `astro build`, the engine integration writes **`.portfolio-engine/design-snapshot.json`**: canonical variables with **computed value** and **source** (`theme.semanticColors…`, `preset:comfortable`, or `default`). Use this for tooling, reviews, and the admin Design section.

## Google Fonts

Public `Layout.astro` and the admin shell load **`editorialGoogleFontsStylesheetHref(theme)`** from `@portfolio-engine/editorial-theme`. It derives a Google Fonts CSS2 URL from the first concrete family in `typography.fonts.heading`, `fonts.body`, and optional `fonts.mono`, and skips generic CSS keywords (`serif`, `system-ui`, …). Families must exist on Google Fonts for that stylesheet to apply; self-hosted or proprietary fonts still require your own `@font-face` / link tags.

## `theme.json` shape

- **`semanticColors`** — `surface` (`page`, `elevated`, `wash`), `text` (`primary`, `muted`, `inverse`), `accent` (`primary`, `secondary`, `muted`), `border` (`default`, `strong`). Each token is a structured object — see below.
- **`typography`** — `fonts.heading`, `fonts.body`, `fonts.mono`; optional **`preset`**: `comfortable` | `compact`; optional **`scale`**: `display`, `title`, `heading`, `subheading`, `body`, `small`, `label` (CSS lengths). Legacy `fontFamily` on `:root` is still supported.
- **`guidance`** — `principles`: array of design principles for human and agent reference.

### Required token object shape

Every `semanticColors` token must be a complete, self-documenting object:

```ts
{
  value: string;     // hex or CSS color, e.g. "#0f172a"
  name: string;      // human name, e.g. "Midnight Navy"
  cssVar: string;    // must match the semantic slot exactly, e.g. "--color-text-primary"
  role: string;      // one-line role description
  usage: string;     // when and where to use this color
  avoid: string[];   // anti-patterns
  examples: string[]; // concrete usage examples
}
```

`cssVar` is validated against the semantic slot with `z.literal(...)`. You cannot assign an arbitrary name.

## Iframe and public HTML demos

Iframe documents do not automatically inherit parent CSS variables. The correct pattern is to load a generated theme CSS file:

```html
<link rel="stylesheet" href="/assets/portfolio-engine/theme.generated.css" />
```

Then use semantic tokens:

```css
body {
  background: var(--color-surface-page);
  color: var(--color-text-primary);
}
```

**Do not** define a local palette inside an iframe demo file:

```css
/* BAD — this is a private palette, not a token consumer */
:root {
  --bg: #f8f6f1;
  --ink: #101827;
  --accent: #0f766e;
}
```

## Theme boundary check

Install the workflow-kit check to guard against token boundary violations in CI:

```json
{
  "scripts": {
    "check:theme-token-boundaries": "node scripts/check-theme-token-boundaries.mjs"
  }
}
```

Copy `check-theme-token-boundaries.mjs` and `theme-token-boundaries.config.example.mjs` from `@portfolio-engine/workflow-kit` templates into your `scripts/` directory and rename the config example to `theme-token-boundaries.config.mjs`.

The check fails on:

- Literal hex colors (`#fff`, `#f8f6f1`) outside `src/config/theme.json`
- Literal color functions (`rgb(...)`, `rgba(...)`, `hsl(...)`, `oklch(...)`) outside `src/config/theme.json`
- Private variable definitions with literal values (`--bg: #f8f6f1`)
- Canonical token redefinition with literals (`--color-accent-primary: #0d6b65`)

The check passes:

- `background: var(--color-surface-page);`
- `color: var(--color-text-primary);`
- `background: color-mix(in srgb, var(--color-accent-primary) 8%, transparent);`

## Example `src/config/theme.json`

```json
{
  "semanticColors": {
    "surface": {
      "page": {
        "value": "#faf9f6",
        "name": "Warm Ivory",
        "cssVar": "--color-surface-page",
        "role": "Main page background",
        "usage": "Use for the body background and large quiet surfaces.",
        "avoid": ["Do not use for cards that need elevation."],
        "examples": ["body", "main page wrapper", "quiet full-width sections"]
      }
    },
    "text": {
      "primary": {
        "value": "#0f172a",
        "name": "Midnight Navy",
        "cssVar": "--color-text-primary",
        "role": "Primary text",
        "usage": "Use for headings, body text, and high-priority labels.",
        "avoid": [],
        "examples": ["h1", "body", "primary nav labels"]
      }
    },
    "accent": {
      "primary": {
        "value": "#0d6b65",
        "name": "Deep Teal",
        "cssVar": "--color-accent-primary",
        "role": "Primary action and proof accent",
        "usage": "Use for links, diagnostics, proof, icons, key callouts, metric badges, and CTAs.",
        "avoid": ["Do not flood large backgrounds with this color."],
        "examples": ["links", "CTA borders", "metric badges", "proof markers"]
      }
    },
    "border": {
      "default": {
        "value": "#e5e5e5",
        "name": "Default Border",
        "cssVar": "--color-border-default",
        "role": "Default structural border",
        "usage": "Use for cards, dividers, tables, and quiet boundaries.",
        "avoid": [],
        "examples": ["card border", "horizontal divider"]
      }
    }
  },
  "typography": {
    "preset": "comfortable",
    "fonts": {
      "heading": {
        "family": "Cormorant Garamond",
        "fallback": "Georgia, serif",
        "provider": "google",
        "usage": "Headings, hero text, pull quotes, and achievement titles."
      },
      "body": {
        "family": "Inter",
        "fallback": "ui-sans-serif, system-ui, sans-serif",
        "provider": "google",
        "usage": "Body text, labels, tags, metadata, and navigation."
      }
    }
  },
  "guidance": {
    "principles": [
      "Use semantic CSS variables, not hard-coded colors.",
      "Use primary accent for proof, diagnostics, links, icons, key callouts, and metric badges.",
      "Use secondary accent sparingly.",
      "For v0-generated UI, normalize colors back to semantic CSS variables before merging.",
      "Prefer shared component polish over page-local one-off styling."
    ]
  }
}
```

An empty `{}` theme file is valid: the site uses editorial defaults only. But a complete, self-documenting `theme.json` is strongly recommended — it makes the design contract explicit for both humans and AI agents.

## Admin preview

The admin UI imports the same `global.css` as the public site and runs `ThemeTokenOverrides`. Token cards expose `data-pe-token` (the variable name without `--`) and show the resolver source line when a snapshot is available. Sources now report `theme.semanticColors.*.*.value` for downstream overrides.
