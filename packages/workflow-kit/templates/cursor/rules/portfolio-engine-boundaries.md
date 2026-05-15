# Portfolio Engine — architecture boundary rules

You are working in a downstream Portfolio Engine site.

## The architecture

```
src/content/          ← ALL authored copy, facts, claims, and structured data
src/config/           ← Site-wide settings (site.json, navigation.json, theme.json, features.json)
src/context/          ← Identity and brand voice for AI tools (agent-rules.md, brand-voice.json)
src/registry/         ← Route declarations (portfolio-engine.registry.json)
src/overrides/        ← Component replacements (must only change rendering, never add authored content)
src/pages-local/      ← Thin route files: load a model, call a template. Nothing else.
```

## Strict rules

1. **Content never lives in route files.** `src/pages-local/**/*.astro` files must not contain:
   - Long string literals that are site-specific copy
   - Arrays of content items
   - Hardcoded section labels, deks, or headlines
   - Conditional rendering based on site-specific content checks

2. **Route files are thin hosts.** They load a model and call a template. Nothing else.

3. **Templates arrange components.** Templates receive a model as a prop. They do not import
   content collections directly and do not contain authored site-specific content.

4. **Schemas must be strict.** Do not use `.passthrough()` for first-class content schemas.
   Do not use `as SomeType` casts on `entry.data`. Do not use `?? ''` for fields that should
   be required.

5. **Content primitives come from upstream.** Import `MetricSchema`, `EvidenceItemSchema`,
   `RelatedLinkSchema`, etc. from `@portfolio-engine/schema` and compose them into your
   site-specific schemas.

## Before making any change

- If the change is to authored text, headlines, or structured data → edit `src/content/`
- If the change is to colors, fonts, or spacing → edit `src/config/theme.json`
- If the change is to navigation items → edit `src/config/navigation.json`
- If the change is to component rendering → edit `src/overrides/`
- If you need a new page → add to `src/pages-local/` + `src/registry/`

## What to avoid

- Do not add fallback strings (`?? 'some hardcoded text'`) in route or template files
- Do not inline site-specific content into component `<slot>` calls
- Do not use `.passthrough()` in content collection schemas
- Do not import content collections in template files — receive data via props
