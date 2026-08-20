# @portfolio-engine/admin-tools

## 0.0.27

### Patch Changes

- Updated dependencies [6451311]
  - @portfolio-engine/editorial-theme@0.8.1

## 0.0.26

### Patch Changes

- Updated dependencies [5fc2bcf]
  - @portfolio-engine/schema@0.8.0
  - @portfolio-engine/editorial-theme@0.8.0
  - @portfolio-engine/engine-core@0.3.6

## 0.0.25

### Patch Changes

- Updated dependencies [fa1558a]
  - @portfolio-engine/schema@0.7.1
  - @portfolio-engine/editorial-theme@0.7.5
  - @portfolio-engine/engine-core@0.3.5

## 0.0.24

### Patch Changes

- Updated dependencies [3556096]
  - @portfolio-engine/schema@0.7.0
  - @portfolio-engine/editorial-theme@0.7.4
  - @portfolio-engine/engine-core@0.3.4

## 0.0.23

### Patch Changes

- Updated dependencies [b341c26]
  - @portfolio-engine/editorial-theme@0.7.3

## 0.0.22

### Patch Changes

- Updated dependencies [9259505]
  - @portfolio-engine/editorial-theme@0.7.2

## 0.0.21

### Patch Changes

- Updated dependencies [4ff12a1]
  - @portfolio-engine/engine-core@0.3.3
  - @portfolio-engine/schema@0.6.0
  - @portfolio-engine/editorial-theme@0.7.1

## 0.0.20

### Patch Changes

- Updated dependencies [4094a9d]
- Updated dependencies [b7c2c97]
- Updated dependencies [d623afc]
  - @portfolio-engine/editorial-theme@0.7.0
  - @portfolio-engine/engine-core@0.3.2

## 0.0.19

### Patch Changes

- 9c2486a: Admin design preview now reflects the consumer's actual theme:
  - Typography panel labels (`font-serif — …`, `font-sans — …`) read the first family from the resolved `--font-serif-stack` / `--font-sans-stack` in the design snapshot, instead of hardcoded `Cormorant Garamond` / `Inter`. Custom `theme.typography.fonts.heading` / `body` are now visible at a glance.
  - Token groups expose the full editorial type scale (`--text-display`, `--text-heading`, `--text-subheading`, `--text-small`, `--text-label`) and `--color-text-inverse`. Coverage went from 13 → 21 of the variables present in `.portfolio-engine/design-snapshot.json`.
  - Replaced two hardcoded color literals in the admin shell (`rgb(154 90 46 / 0.25)` focus outline, `rgb(30 26 23 / 0.04)` card shadow) with `color-mix(...)` over `--color-accent-primary` / `--color-text-primary` so consumer themes propagate.

  #### Agent migration
  - **Packages:** `@portfolio-engine/admin-tools`. No content / schema / public-import / CSS-variable contract changes — this is an admin UI honesty fix.
  - **Consumer paths:** none required. No edits to `src/content/**`, `src/config/**`, `src/registry/**`, or `astro.config.*`.
  - **Actions:**
    - **No-op for upgrades.** Run `pnpm install` and the new admin behavior ships with the package.
    - When verifying / reviewing theme work, expect the `/admin` Design section to now show **all 7** scale tokens (`display`, `title`, `heading`, `subheading`, `body`, `small`, `label`), the inverse text token, and the **actual** heading/body family names from `theme.json` (not the editorial defaults).
    - If a previous local patch overrode `packages/admin-tools/src/routes/admin.astro` or `src/lib/design-token-groups.ts` to work around the hardcoded labels, drop that patch — it is now redundant and may conflict on `pnpm install`.
  - **CSS:** No new or renamed editorial CSS variables. Two admin-internal color literals were replaced with `color-mix()` over existing `--color-accent-primary` / `--color-text-primary`; pages and overrides outside the admin shell are unaffected.

- Updated dependencies [f99591c]
  - @portfolio-engine/editorial-theme@0.6.0

## 0.0.18

### Patch Changes

- Updated dependencies [0ee8cc1]
  - @portfolio-engine/editorial-theme@0.5.1

## 0.0.17

### Patch Changes

- 96f0133: **Breaking (schema):** `ProfilePersonSchema` drops `bio` and is now `.strict()` — use `shortBio`, `summary`, and `longBio` only. Editorial theme resolvers and admin settings UI follow the same model; TypeScript `ProfilePerson` keeps `@deprecated bio?` as a compile-time warning only (never read).

  **Breaking (editorial-theme):** Import the Astro integration from `@portfolio-engine/editorial-theme/integration` (not the package root). The root entry no longer exports `editorialTheme`, so SSR bundles do not pull Tailwind’s native Oxide binaries — fixes Vercel/Linux builds with `@astrojs/vercel`.

- c7c0ba8: **Breaking (CSS):** Legacy palette variables (`--ink`, `--paper`, `--copper`, etc.) are removed. Use semantic tokens (`--color-text-primary`, `--color-surface-page`, …) in custom CSS and overrides. `resolveCssVariables` / design snapshots now emit `--color-*` keys only.

  **Breaking (editorial-theme):** Import `editorialTheme` from `@portfolio-engine/editorial-theme/integration` (not the package root). The root entry no longer exports `editorialTheme`, so SSR bundles do not pull Tailwind’s native Oxide binaries — fixes Vercel/Linux CI builds with `@astrojs/vercel`.

  **Schema:** `theme.json` may set `semanticColors.text.inverse`, `semanticColors.border.strong`, and `site.json` may set optional `admin.showPublicLink` / `admin.publicLinkLabel` for the public footer admin link (still independent of OAuth).

  **Docs:** Route ownership, scheduling/Calendly, token checker (`pnpm check:tokens`), and upgrade guidance for bumping all `@portfolio-engine/*` packages together.

- Updated dependencies [96f0133]
- Updated dependencies [c7c0ba8]
  - @portfolio-engine/schema@0.5.0
  - @portfolio-engine/editorial-theme@0.5.0
  - @portfolio-engine/engine-core@0.3.1

## 0.0.16

### Patch Changes

- Updated dependencies [cde901a]
  - @portfolio-engine/editorial-theme@0.4.0
  - @portfolio-engine/engine-core@0.3.0
  - @portfolio-engine/schema@0.4.0

## 0.0.15

### Patch Changes

- 51c8a0c: Improve admin route ergonomics for consumers: extensionless client script import, `@ts-nocheck` on the published route, and README guidance for tsconfig `exclude` and tarball patching workflows.
- Updated dependencies [51ed888]
  - @portfolio-engine/schema@0.3.1
  - @portfolio-engine/editorial-theme@0.3.1
  - @portfolio-engine/engine-core@0.2.2

## 0.0.13

### Patch Changes

- Fix token swatch rendering for modern CSS color functions (`color(srgb…)`, `oklch(…)`): prefer server-side design-token snapshot when available so swatches display correct colors regardless of how `getComputedStyle` serializes them.

## 0.0.12

### Patch Changes

- Fix release workflow: add `contents: write` permission and push git tags after `changeset publish` so `@portfolio-engine/*@x.y.z` tags appear in Git history even when publish no-ops.
- Fix promote script: queue a follow-up `workflow_dispatch` Release after the dev→main merge so npm publish always runs (default `GITHUB_TOKEN` does not re-trigger workflows on push).

## 0.0.11

### Patch Changes

- Fix broken `/admin` client script: replace invalid `define:vars` + ESM `import` combination (which Astro wraps in an IIFE, making `import` illegal) with a plain module `<script>` that reads `contentApiUrl` from `#admin-root`'s `data-content-api` dataset attribute.
- Fix missing `dist/client/` in published npm tarball: add `'client'` to the `copyAstroAndApiTree` directory list in `tsup.config.ts` so `dist/client/admin-app.ts`, `content-api.ts`, and `yaml-frontmatter.ts` are included on publish.

## 0.0.10

### Patch Changes

- Updated dependencies [777d3da]
  - @portfolio-engine/schema@0.3.0
  - @portfolio-engine/editorial-theme@0.3.0
  - @portfolio-engine/engine-core@0.2.1

## 0.0.9

### Patch Changes

- Updated dependencies [0aca192]
  - @portfolio-engine/schema@0.2.0
  - @portfolio-engine/engine-core@0.2.0
  - @portfolio-engine/editorial-theme@0.2.0

## 0.0.8

### Patch Changes

- b10cfd6: Republish all core packages after release pipeline hardening so tarballs consistently include built dist artifacts.
- Updated dependencies [b10cfd6]
  - @portfolio-engine/engine-core@0.1.5

## 0.0.7

### Patch Changes

- c84249e: Ship `dist/` package exports, real `admin-tools` build (Astro routes + API copied to `dist`), Astro peer `^6.0.0`, and publishable `@portfolio-engine/admin-tools` with `publishConfig.access: public`.
- Updated dependencies [c84249e]
  - @portfolio-engine/engine-core@0.1.4

## 0.0.5

### Minor Changes

- Ship `adminTools()` Astro integration: injects `/admin` read-only dashboard (engine virtual modules + content collections) and `/api/auth/*` GitHub OAuth routes. Optional `devBypass` for local `astro dev` without OAuth.

### Patch Changes

- Enforce authentication in `/admin` server render before emitting dashboard HTML; remove client-only gate.
- OAuth: use `read:user repo`; validate token exchange responses; respect Astro `base` for callback, post-login redirect, and logout.
- Logout is `POST` only (`GET` returns 405) to avoid cross-site forced logout.
- Harden `getCollection` usage when optional collections are missing; expand `tsconfig` `include` for route TypeScript.

## 0.0.4

### Patch Changes

- Updated dependencies [a6e295c]
  - @portfolio-engine/engine-core@0.1.2

## 0.0.3

### Patch Changes

- Updated dependencies
  - @portfolio-engine/engine-core@0.1.1

## 0.0.2

### Patch Changes

- Updated dependencies [4c8ff7a]
- Updated dependencies [1e2155e]
  - @portfolio-engine/engine-core@0.1.0
