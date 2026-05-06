---
'@portfolio-engine/schema': minor
'@portfolio-engine/editorial-theme': patch
'@portfolio-engine/admin-tools': patch
---

**Breaking (schema):** `ProfilePersonSchema` drops `bio` and is now `.strict()` — use `shortBio`, `summary`, and `longBio` only. Editorial theme resolvers and admin settings UI follow the same model; TypeScript `ProfilePerson` keeps `@deprecated bio?` as a compile-time warning only (never read).
