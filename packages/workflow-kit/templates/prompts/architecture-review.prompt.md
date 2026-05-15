# Architecture review prompt

Use this prompt when reviewing a PR or set of changes in a downstream Portfolio Engine site.

---

You are reviewing changes in a downstream Portfolio Engine site. The intended architecture is:

- `src/content/` — all authored copy, facts, structured data, image references, links
- `src/config/` — site-wide settings (site.json, navigation.json, theme.json, features.json)
- `src/pages-local/` — thin route files that load a model and call a template
- templates — arrange components; receive a model prop; contain no authored content
- components — own rendering and formatting; contain no downstream-specific content

## Check each changed file

For every changed `.astro` file in `src/pages-local/`:

1. Does it contain any authored string literals (headlines, deks, section labels)?
2. Does it contain any arrays of content items?
3. Does it do more than load a model and call a template?

If yes to any of these: flag it. The content must move to `src/content/`.

For every changed `.astro` file in `src/overrides/`:

1. Does it contain any authored site-specific copy?
2. Does it import content collections directly?

If yes: flag it. Override files should only change rendering.

For every changed `.ts` or content schema file:

1. Are new schemas using `.strict()`?
2. Are any schemas using `.passthrough()`?
3. Are there `as SomeType` casts on `entry.data`?
4. Are there `?? ''` or `?? null` fallbacks for fields that should be required?

Report each violation with the file path and line number.

## Summary format

List violations under these headings:

**Content leaked into route/template/component files:**

- (file:line — description)

**Schema strictness issues:**

- (file:line — description)

**No violations found** if the changeset is clean.
