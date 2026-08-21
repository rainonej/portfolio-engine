---
'@portfolio-engine/editorial-theme': patch
---

Fix PDF.js page and selectable-text layout by making styles for dynamically created viewer nodes global. Prevent repeated page sets when multiple viewer component scripts are present by initializing each viewer exactly once. Together, these changes stop visible overlapping text and documents restarting after their final page.
