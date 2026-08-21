---
'@portfolio-engine/editorial-theme': patch
---

Fix PDF.js page and selectable-text layout by making styles for dynamically created viewer nodes global. This prevents text layers from rendering as visible, overlapping document text in Astro consumers, especially on narrow mobile screens.
