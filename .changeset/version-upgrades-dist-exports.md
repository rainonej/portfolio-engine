---
'@portfolio-engine/schema': patch
'@portfolio-engine/engine-core': patch
'@portfolio-engine/editorial-theme': patch
'@portfolio-engine/admin-tools': patch
---

Ship `dist/` package exports, real `admin-tools` build (Astro routes + API copied to `dist`), Astro peer `^6.0.0`, and publishable `@portfolio-engine/admin-tools` with `publishConfig.access: public`.
