---
'@portfolio-engine/editorial-theme': patch
---

Fix theme utility classes silently missing CSS when a component's classes aren't otherwise used in the consumer's own source (most visibly: the homepage hero rendering with no top offset, its heading/bio clipped behind the fixed nav).

`global.css` did `@import "tailwindcss"` with no explicit `@source`. Tailwind v4's automatic content detection respects `.gitignore`, which excludes `node_modules` in virtually every consumer project — so any utility class used only inside this package's own `components/`, `layouts/`, or `pages/` (and not coincidentally already used somewhere in the consumer's own `src/`) was silently generating zero CSS. The class still appeared in the rendered markup; it just did nothing.

This was most visible on `HeroSection`: `min-h-screen` and `pt-24` are not used elsewhere in a typical consumer, so they were dropped entirely, collapsing the hero to unpadded block flow — the `<h1>`/bio `<p>` rendered flush under the fixed nav (`Nav.astro`, `h-16`/`z-50`) regardless of viewport height or how short the tagline/bio copy was. Verified via computed-style/getBoundingClientRect inspection (not just visual comparison) that `paddingTop`/`minHeight` were literally `0px` before this fix and correct afterward, across viewport heights from 350px to 900px.

Added explicit `@source` directives in `global.css` covering `../components/**/*.astro`, `../layouts/**/*.astro`, and `../pages/**/*.astro` (paths are relative to the CSS file and resolve the same way in both `src/` and the published `dist/`, since `tsup`'s asset-copy step preserves the directory layout). This is a general content-detection fix, not Hero-specific — it makes _every_ editorial-theme utility class reliably generate, regardless of what the specific consumer's own pages happen to already use.

#### Agent migration

- **Packages:** `@portfolio-engine/editorial-theme`
- **Consumer paths:** no file changes required
- **Actions:**
  - No migration needed — pure CSS-generation bug fix, no API/schema/prop change.
  - If a consumer shortened hero copy (tagline/`shortBio`) specifically to work around clipped/overlapping hero text, that workaround is no longer necessary.
  - If a consumer added any local CSS override to compensate for a theme component rendering with missing spacing/sizing (anywhere in the theme, not just the hero), it's worth re-checking after upgrading — the underlying cause may now be fixed.
