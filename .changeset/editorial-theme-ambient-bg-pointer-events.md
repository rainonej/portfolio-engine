---
'@portfolio-engine/editorial-theme': patch
---

Prevent the decorative ambient background from intercepting pointer interactions.

`AmbientBackground.astro` is `aria-hidden` and visually behind the page (`-z-10`), but
lacked explicit `pointer-events: none`. This allowed the layer to intercept clicks and text
selection in rendered sites, causing CTAs and cards to fail in real browser interaction even
when their `href` values were correct.

This was the root cause of the downstream click failures reported in `jordan-site` PR #60:
static rendered-link checks passed because hrefs existed, but actual browser clicks were
blocked until pointer events were disabled on `.ambient-bg`.

#### Agent migration

- **Packages:** `@portfolio-engine/editorial-theme`
- **Consumer paths:** no consumer action required — this is fixed upstream
- **Actions:**
  - If a downstream site added a local CSS workaround like `.ambient-bg { pointer-events: none }`,
    that workaround is now redundant and can be removed after upgrading.
