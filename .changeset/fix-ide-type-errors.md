---
'@portfolio-engine/editorial-theme': patch
'@portfolio-engine/engine-core': patch
---

Fix IDE type errors in editorial-theme and engine-core: add typed collection wrappers (`getProjects`, `getWritingPosts`, `getTestimonials`), add constrained overload + runtime guard to `sortByDateDesc`, publish `client.d.ts` at package root for reliable IDE virtual-module resolution, and mark the root file as generated.
