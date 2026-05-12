# What this folder controls

This folder contains the global visual rules for the theme.

| File                | What it controls                                                        |
| ------------------- | ----------------------------------------------------------------------- |
| `global.css`        | Base styles applied to every screen: resets, body defaults, typography  |
| `design-tokens.css` | CSS custom properties (variables) for colors, spacing, and font weights |

## Changing colors, fonts, or spacing

A downstream site controls visual appearance through `config/theme.json` — not by editing these files directly.

The values in `theme.json` are read by the engine and injected as CSS variables at build time, overriding the defaults in `design-tokens.css`.

To add custom CSS that is not covered by the theme config, a downstream site places a `.css` file in its `src/overrides/` folder. Those files are injected globally by the layout.
