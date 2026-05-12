---
'@portfolio-engine/admin-tools': patch
---

Admin design preview now reflects the consumer's actual theme:

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
