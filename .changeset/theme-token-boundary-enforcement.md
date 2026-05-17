---
'@portfolio-engine/schema': minor
'@portfolio-engine/workflow-kit': patch
'@portfolio-engine/editorial-theme': patch
---

Add strict theme-token boundary enforcement, structured color token schema, and `DEFAULT_THEME_CONFIG`.

**Breaking changes in `@portfolio-engine/schema`:**

- `SemanticColorsSchema` color slots now require structured token objects (`value`, `name`, `cssVar`, `role`, `usage`, `avoid`, `examples`) instead of plain hex strings. Update `src/config/theme.json` in downstream sites.
- `cssVar` is validated with `z.literal(...)` per semantic slot — arbitrary names are rejected.
- Flat `colors` (`primary`, `secondary`, `background`, `text`) removed from `ThemeConfigSchema`. Use `semanticColors` only.
- `design-resolve.ts` reads `semanticColors.*.*.value` — the legacy `theme.colors.*` fallback is gone.
- Source labels in `design-snapshot.json` now include `.value` suffix (e.g. `theme.semanticColors.accent.primary.value`).

**New in `@portfolio-engine/schema`:**

- `DEFAULT_THEME_CONFIG` — complete structured default theme for downstream scaffolding.
- `ThemeColorToken` type export.
- `guidance` field on `ThemeConfigSchema` for design principles and agent guidance.

**New in `@portfolio-engine/workflow-kit`:**

- `templates/scripts/check-theme-token-boundaries.mjs` — reusable downstream guardrail script. Fails on literal hex, rgb, hsl, oklch, private palettes, and canonical token redefinition outside `src/config/theme.json`.
- `templates/scripts/theme-token-boundaries.config.example.mjs` — config template.
- `TEMPLATE_PATHS.scripts.checkThemeTokenBoundaries` and `themeTokenBoundariesConfigExample` exports.

**Upstream:**

- Root `check:theme-token-boundaries` script scans `examples/demo-site` and workflow-kit templates.
- Wired into root `pnpm check`.
- Failing fixture (`scripts/fixtures/theme-token-boundaries/failing-private-palette.html`) and passing fixture for regression testing.
