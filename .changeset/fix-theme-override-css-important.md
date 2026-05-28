---
'@portfolio-engine/schema': patch
---

Fix `ThemeTokenOverrides` CSS cascade: add `!important` to emitted custom properties.

In Astro SSG builds, Astro injects bundled CSS (`design-tokens.css`) as `<link>` tags at the end of `<head>`, after any inline `<style>` blocks. `ThemeTokenOverrides` emits an inline `:root { ... }` block, so the bundled stylesheet's default token values appeared later in the document and won the cascade — consumer-configured theme values were silently ignored.

`buildThemeOverrideCss` in `design-resolve.ts` now appends `!important` to every non-default custom property declaration it emits. `!important` on CSS custom properties is valid per spec and wins over normal declarations regardless of source order.

#### Agent migration

- **Packages:** `@portfolio-engine/schema`
- **Consumer paths:** no file changes required
- **Actions:**
  - No migration needed — this is a bug fix. Theme overrides configured in `src/config/theme.json` will now apply correctly in SSG builds without any changes to consumer repos.
  - If you added a manual workaround (e.g. a `<style>` block or a late-loading stylesheet that re-declared the same CSS custom properties to compensate for the broken cascade), remove those workarounds — the override mechanism now works as documented.
