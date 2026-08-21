---
'@portfolio-engine/schema': minor
'@portfolio-engine/engine-core': minor
'@portfolio-engine/editorial-theme': minor
---

Add a validated résumé PDF URL, a built-in download action, and a backward-compatible `resumePage` route flag.

#### Agent migration

- Packages: `@portfolio-engine/schema`, `@portfolio-engine/engine-core`, `@portfolio-engine/editorial-theme`
- Consumer paths: `src/config/site.json`, `src/config/features.json`, and the consumer `public/` directory
- Actions: place the public PDF under `public/`, set `site.resumePdfUrl` to its root-relative path, and keep or add a `/resume` navigation item. Existing consumers need no change because `features.resumePage` defaults to `true`.
