## What changed

<!-- Describe the change in one or two sentences. -->

## Checklist

- [ ] Content changes are in `src/content/` or `src/config/` — not in route, template, or component files
- [ ] No site-specific copy was added to `src/pages-local/**/*.astro`
- [ ] No fallback strings (`?? ''`, `?? null`) were added for fields that belong in a schema
- [ ] Schema changes use `.strict()` — no `.passthrough()` for first-class content
- [ ] `pnpm check:rendered-links` passed after build (static href validation)
- [ ] `pnpm check` passes
- [ ] `pnpm build` passes

## Interaction verification

<!-- Static link checks verify hrefs exist. They do NOT verify that elements are clickable. -->
<!-- Complete this section whenever the change affects CTAs, cards, navigation, overlays, or layout wrappers. -->

- [ ] Browser interaction smoke was performed for changed CTAs / cards / navigation
- [ ] Vercel preview was checked, or PR explains why only local preview was available
- [ ] PR body lists the routes and interactions verified

**Static rendered HTML verified** (check-rendered-links output or equivalent):

```
<!-- paste output or note "N/A – no interactive changes" -->
```

**Browser interaction verified** (Playwright output, Vercel preview URL, or manual steps):

```
<!-- paste output, preview URL, or describe what was clicked and what happened -->
```

## Portfolio Engine version

Consuming `@portfolio-engine/editorial-theme` version: <!-- e.g. 1.4.2 -->
