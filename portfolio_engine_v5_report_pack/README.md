# Portfolio Engine v5 Report Pack

Source-driven HTML audit for the portfolio-engine roadmap: product tracks A–G, Backbone MVP, Product MVP, eighteen epics organised across phases 0–11.

## Start here

Open:

```text
report/index.html
```

## Source of truth

Canonical content lives under:

```text
source/
```

The HTML report is generated from source files by:

```text
node scripts/build_report.mjs
```

Do not edit `report/index.html` directly unless you are intentionally patching the rendered artifact.

## Validation

Run:

```text
node scripts/validate_report.mjs
```

Validation output is stored in:

```text
validation/validation_log.txt
```

## What v5 includes

- Phases 0–11 with ★ Backbone MVP and ★ Product MVP gates rendered as a collapsible timeline.
- Product tracks A–G and product × epic matrix (`source/sections/08_product_tracks_and_mvp.md`).
- Board reconciliation, gap plan, and product-tracks sections wired into the HTML report.
- Eighteen epics under `source/epics/`, named without numeric prefixes; render order is driven by each epic's `Phase` frontmatter, then filename.
- Slug-based anchor IDs on epic cards and ticket headings so cross-references are clickable.
