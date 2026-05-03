---
'@portfolio-engine/engine-core': patch
'@portfolio-engine/editorial-theme': patch
---

Fix override bridge for Windows SSG builds. Replace `@vite-ignore` dynamic
imports (which bypassed Vite's compiler and broke Node's ESM loader on Windows)
with per-surface virtual modules that emit static imports — Vite now processes
consumer override `.astro` files through its normal pipeline.

`engine-core` adds `@portfolio-engine:override/<Surface>` virtual modules (one
per supported surface) that export the consumer component or `null`. `editorial-
theme` updates all five override-capable components to use these static imports
instead of dynamic `await import()`.

Also adds `Footer` as a new supported override surface.
