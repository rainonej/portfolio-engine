# Portfolio Engine v4 Report Pack

This pack replaces the rejected v3 report.

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
scripts/build_report.mjs
```

Do not edit `report/index.html` directly unless you are intentionally patching the rendered artifact.

## Validation

Run:

```text
scripts/validate_report.mjs
```

Validation output is stored in:

```text
validation/validation_log.txt
```

## What this version fixes

- One coherent source-driven folder structure.
- More detail in big-picture goals, target layouts, current-vs-target audit, MVP definition, and epics.
- Required runtime packages vs optional packages clearly labeled.
- Dependency graph with ★ MVP marker.
- Rewritten epics and atomic tickets from scratch.
- HTML generated from source files instead of hand-maintained separately.
