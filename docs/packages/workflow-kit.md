# @portfolio-engine/workflow-kit

Reusable GitHub Actions workflow templates and AI change classifier for portfolio-engine downstream sites.

## Planned capabilities

**Workflow classification contract** — classifies changes in a consumer site into one of:
- `local-content` — content/media edited by the site owner
- `local-config` — site config changes (nav, features, bookingUrl)
- `local-override` — overriding a named theme component
- `engine-change` — feature needed in a shared engine package
- `engine-bug` — defect in a shared engine package
- `human-review` — requires human judgment

**Reusable workflow templates** — packaged `.github/workflows/` for common downstream tasks.

**Engine-aware classifier** — understands the route registry and override surfaces to distinguish local changes from shared engine changes.

**Downstream-to-upstream routing contract** — knows when a change should generate an upstream PR in `portfolio-engine` vs stay local.

## Status

Deferred — Epic 8. Requires:
- Epic 3 (route registry — Task 3.6)
- Epic 4 (override surfaces — Task 4.4)
