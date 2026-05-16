---
'@portfolio-engine/workflow-kit': patch
---

Fix `check-rendered-interactions.mjs` bugs and add CI template improvements.

#### Bug fixes

- **Route reachability:** replace `h1` visibility check with `<main>` presence. Visually-hidden `h1`s (`clip-path: inset(50%)`) return `false` from `isVisible()` even when the page rendered correctly; some templates emit no `h1` at all. Every template wraps content in `<main>`, making it the universal render signal.
- **Safe error serialization:** both catch blocks now use `err instanceof Error ? err.message : String(err)` so non-Error throws (string rejects, `null`) produce accurate diagnostics instead of `"undefined"`.

#### New template

- **`rendered-interactions.yml`:** deployment_status-triggered GitHub Actions workflow that runs `pnpm check:rendered-interactions` against Vercel preview URLs automatically, with no polling or manual URL wiring.

#### CI template improvements (`ci.yml`)

- Add `check:tooling-version` as a blocking step in the `check` job so workflow-kit version drift is caught in CI rather than at runtime.
- Add non-blocking `unused` job (`continue-on-error: true`) for knip dead-code auditing — visible signal without hard-blocking merges on false positives.
- Add descriptive `name:` fields to all jobs (`Format & lint`, `Types, docs & schema`, `Build, smoke & links`) so GitHub Actions failure notices are unambiguous.

#### Agent update note

Workflow-kit templates changed. Downstream repos should re-copy:

- `scripts/check-rendered-interactions.mjs` — pick up the `<main>` check and safe error serialization
- `.github/workflows/rendered-interactions.yml` — new file; add to enable deployment-triggered interaction checks
- `.github/workflows/ci.yml` — pick up tooling-version step, unused job, and job names
