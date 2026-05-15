## What changed

<!-- Describe the change in one or two sentences. -->

## Checklist

- [ ] Content changes are in `src/content/` or `src/config/` — not in route, template, or component files
- [ ] No site-specific copy was added to `src/pages-local/**/*.astro`
- [ ] No fallback strings (`?? ''`, `?? null`) were added for fields that belong in a schema
- [ ] Schema changes use `.strict()` — no `.passthrough()` for first-class content
- [ ] Internal links resolve (run `node scripts/check-rendered-links.mjs` after build)
- [ ] `pnpm check` passes
- [ ] `pnpm build` passes

## Portfolio Engine version

Consuming `@portfolio-engine/editorial-theme` version: <!-- e.g. 1.4.2 -->
