---
'@portfolio-engine/schema': minor
'@portfolio-engine/editorial-theme': minor
'@portfolio-engine/engine-core': patch
'@portfolio-engine/admin-tools': patch
---

**Breaking (CSS):** Legacy palette variables (`--ink`, `--paper`, `--copper`, etc.) are removed. Use semantic tokens (`--color-text-primary`, `--color-surface-page`, …) in custom CSS and overrides. `resolveCssVariables` / design snapshots now emit `--color-*` keys only.

**Breaking (editorial-theme):** Import `editorialTheme` from `@portfolio-engine/editorial-theme/integration` (not the package root). The root entry no longer exports `editorialTheme`, so SSR bundles do not pull Tailwind’s native Oxide binaries — fixes Vercel/Linux CI builds with `@astrojs/vercel`.

**Schema:** `theme.json` may set `semanticColors.text.inverse`, `semanticColors.border.strong`, and `site.json` may set optional `admin.showPublicLink` / `admin.publicLinkLabel` for the public footer admin link (still independent of OAuth).

**Docs:** Route ownership, scheduling/Calendly, token checker (`pnpm check:tokens`), and upgrade guidance for bumping all `@portfolio-engine/*` packages together.
