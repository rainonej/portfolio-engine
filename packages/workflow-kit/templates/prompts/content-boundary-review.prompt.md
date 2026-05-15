# Content boundary review prompt

Use this prompt to check a set of changed files for content/schema/model/template/component separation violations.

---

Review the following changed files for content boundary violations.

The rule is: **authored content belongs in `src/content/` and `src/config/`. Nowhere else.**

## What to look for in each changed file

### In `src/pages-local/**/*.astro`

Flag any:

- String literals longer than ~30 characters that look like authored copy (headlines, deks, descriptions)
- Arrays declared inline that hold content items
- Section titles, labels, or marketing copy defined directly in the file
- Import of a content collection (`getCollection`, `getEntry`) — this belongs in a model loader, not in a route file
- `?? 'some fallback text'` where the fallback is authored copy

### In `src/overrides/**/*.astro`

Flag any:

- Authored copy in component JSX/template markup
- Hard-coded marketing claims or personal details
- Import of content collections

### In content schema files (`src/content.config.ts`, local schema files)

Flag any:

- `.passthrough()` on a first-class content collection schema
- `z.any()` or `z.unknown()` used for fields that have a known shape
- `as SomeType` casts in the schema definition

### In `src/pages-local/**/*.astro` or template files

Flag any:

- `(entry.data as SomeType)` casts
- `entry.data.someField ?? 'fallback string'` where the fallback is authored copy rather than a safe empty state

## Output format

For each violation, write:

```
FILE: src/pages-local/work/index.astro
LINE: 42
ISSUE: Authored string literal ("Selected case studies on ML evaluation...") should be in src/content/pages/work.yaml
```

If no violations: write "No boundary violations found."
