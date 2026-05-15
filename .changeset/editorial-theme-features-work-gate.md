---
'@portfolio-engine/editorial-theme': patch
---

Fix FeaturedWork section on homepage to respect `features.work` flag. Previously, setting `features.work: false` in `features.json` had no effect — the section gated only on `featured.length > 0`. Now the section (and the underlying `getProjects()` call) is skipped entirely when `features.work` is `false`, consistent with how `features.testimonials` already gates its section.
