# Portfolio Engine v5 Report Pack

Source-driven HTML audit for the portfolio-engine roadmap (v5: product tracks A–G, Backbone MVP, Product MVP, epics 00–17).

This pack replaces the rejected v3 report. The on-disk folder name still contains `v4` for historical continuity; the **content and generated HTML are v5** (`project_model.json` version, `<title>`, sidebar).

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

The `scripts/build_report.py` script is **unmaintained** (old section filenames and v4-era shell). Use **`build_report.mjs`** only.

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

- Phases 0–11 with ★ Backbone MVP and ★ Product MVP gates.
- Product tracks A–G and product × epic matrix (`source/sections/08_product_tracks_and_mvp.md`).
- Board reconciliation and gap sections wired into the HTML report.
- Eighteen epics (`epic_00` … `epic_17`) with filename order matching render order.
