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

## Post–Product-MVP (Phases 5–11)

Not required for either MVP:

- Explicit registries and manifest (Phase 5).
- Consumer extension registry (Phase 6).
- Admin-tools extraction (Phase 7).
- Python/MCP workflow-kit (Phase 8).
- Consumer bootstrap script (Phase 9).
- Demo-site product showcase expansion (Phase 10).
- Contribution safety, advanced preview/publishing (Phase 11).

---

## Phase 0 — Planning, labels, board, governance, debt register

Includes label taxonomy (Epic 1), governance/legal (Epic 2), board reconciliation (Epic 0), and technical debt visibility. See **Epic 0**, **Epic 1**, **Epic 2**, and section **Board reconciliation**.

## Phase 1 — Runtime backbone buildability

Stabilize schema, engine-core, editorial-theme, CI, Vercel, and package build scripts. See **Epic 3**.

## Phase 2 — Consumer layout contract

Establish the preferred consumer layout; migrate demo-site. See **Epic 5**.

## Phase 3 — Override proof and MVP docs

Override bridge (Hero + custom CSS) for **Backbone MVP** when overrides are advertised; **Epic 7** covers README, CONTRIBUTING, downstream docs, two-mode documentation. See **Epic 6** and **Epic 7**.

## ★ Backbone MVP

**Engine stable enough to serve real consumer repos** — after Phases 1–3. See product tracks section for matrix.

## Phase 4 — First consumer products (agreni-site + jordan-site)

**Epic 8** and **Epic 9**: scaffold layout, migrate or create content/config/context, wire to published packages, verify build and preview.

## ★ Product MVP

**Two real products validate the engine** — after Phase 4.

## Phase 5 — Registries and manifest

Machine-readable routes, overrides, manifest. See **Epic 10**.

## Phase 6 — Consumer extension registry

Local pages, embeds, components without editing upstream. See **Epic 11**.

## Phase 7 — Admin-tools extraction

Optional UI from existing profesional_site/agreni codepaths. See **Epic 12**.

## Phase 8 — Python/MCP workflow-kit

See **Epic 13**.

## Phase 9 — Consumer bootstrap / setup script

See **Epic 14**.

## Phase 10 — Demo-site product showcase

Teaching pages beyond the reference consumer role. See **Epic 15**.

## Phase 11 — Advanced preview, publishing, contribution safety

See **Epic 16** and **Epic 17**.
