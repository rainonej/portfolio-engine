---
'@portfolio-engine/schema': minor
'@portfolio-engine/editorial-theme': minor
---

Support labeled additional profile emails and reusable accessible social-icon links across the built-in profile pages.

#### Agent migration

- Packages: `@portfolio-engine/schema`, `@portfolio-engine/editorial-theme`
- Consumer paths: `src/content/profile/person.json` and consumer-local pages that render profile links
- Actions: keep `email` as the primary address, add optional labeled entries under `emails`, and import `SocialLinks.astro` in custom pages that need the same LinkedIn/GitHub/Instagram icon treatment. Existing consumers need no change.
