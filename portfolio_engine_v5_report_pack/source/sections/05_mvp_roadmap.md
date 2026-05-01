# MVP roadmap and dependency strategy (v5)

## Two MVP milestones

v5 uses two nested milestones:

1. **★ Backbone MVP** — after **Phase 3**. The runtime backbone is stable: buildable packages, consumer layout contract, override proof (when advertised), and MVP documentation.
2. **★ Product MVP** — after **Phase 4**. **agreni-site** and **jordan-site** exist as real private consumer repos on the target layout, validating the engine with two distinct products.

```text
@portfolio-engine/schema
  ↓
@portfolio-engine/engine-core
  ↓
@portfolio-engine/editorial-theme
  ↓
examples/demo-site (reference consumer)
  ↓
★ Backbone MVP (Phases 1–3)
  ↓
agreni-site + jordan-site (Phase 4)
  ↓
★ Product MVP
```

## Backbone MVP scope

Reached after Phases 1–3:

- Schema validation; engine-core config loading and route injection; editorial-theme pages/components/styles.
- Consumer layout contract (`src/config`, `src/content`, `src/context`, `src/overrides`, `public`, `.portfolio-engine`).
- Demo-site on target layout; build/check/deploy reliability.
- Named override bridge when overrides are advertised in docs; otherwise document the exclusion.
- README, CONTRIBUTING basics, downstream consumption docs, workspace vs semver modes.
- **Backbone MVP** allows **workspace-link** development if documentation is clear. **Product MVP** requires **semver/npm** consumption (or an explicit documented exception).

## Product MVP scope

Reached when Phase 4 completes:

- **agreni-site** and **jordan-site** are clean private repos consuming published packages (unless an explicit exception is documented).
- Both build and preview successfully; content/config/context owned in-consumer only.

## Phase timeline

The collapsible timeline below is generated from `source/project_model.json` (`phases[]`) plus each epic's frontmatter. Click a phase to inspect its description, motivation, products, owners, areas, and the epics scoped to it. Epic links jump to the corresponding card in the **Epics and Atomic Tickets** section.

<!-- phase-timeline -->
