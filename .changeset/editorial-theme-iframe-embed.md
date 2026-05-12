---
'@portfolio-engine/editorial-theme': minor
---

Add `IframeEmbed.astro` — a generic, security-vetted iframe component for embedding static interactive demos (e.g. self-contained HTML/Plotly pages dropped under `public/assets/demos/...`) or trusted absolute https:// URLs inside content pages.

The component validates `src` (rejects `http://`, `javascript:`, `data:`, and protocol-relative URLs; accepts same-origin paths starting with `/` and absolute https:// URLs), enforces an optional host allowlist for absolute URLs, requires a `title` for accessibility, and exposes typed slots for `sandbox`, `allow`, and `referrerpolicy` so each consumer chooses the right posture per embed. Sizing falls back to a fixed 720px height to match `SchedulingBlock`, with `height` and `aspectRatio` overrides for fixed-pixel and responsive content respectively. Renders as a `<figure>` with an optional `<figcaption>` styled against the theme's existing `--color-border-default` / `--color-surface-elevated` / `--color-text-muted` / `--text-small` tokens.

New package export: `@portfolio-engine/editorial-theme/components/IframeEmbed.astro`.

Companion docs page: `docs/downstream/iframe-embeds-and-demos.md`, covering placement of static demos under `public/`, embedding from `.astro` pages, the raw-`<iframe>` path required for `.md` content collection entries (content collections can only import Astro components from `.mdx`), and the opt-in `@astrojs/mdx` setup that lets `.mdx` entries use the component directly.

#### Agent migration

- **Packages:** `@portfolio-engine/editorial-theme`. No content / schema / public-import / CSS-variable contract changes — purely additive.
- **Consumer paths:** none required for existing sites. No edits to `src/content/**`, `src/config/**`, `src/registry/**`, or `astro.config.*`.
- **Actions:**
  - **No-op for upgrades.** Run `pnpm install` (or bump the editorial-theme version in `package.json`) and the new component ships with the package.
  - To use it, import from `@portfolio-engine/editorial-theme/components/IframeEmbed.astro` inside an `.astro` page (theme route, `src/pages-local/**`, or `src/pages/**`). `.md` content collection entries should keep using raw `<iframe>` HTML; `.mdx` entries can import the component after the consumer installs and registers `@astrojs/mdx`.
- **CSS:** No new editorial CSS variables. The component uses scoped styles that read existing `--color-border-default` / `--color-surface-elevated` / `--color-text-muted` / `--text-small` tokens.
