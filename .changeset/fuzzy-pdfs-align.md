---
'@portfolio-engine/editorial-theme': patch
---

Fix PDF.js page and selectable-text layout by making styles for dynamically created viewer nodes global. Prevent repeated page sets when multiple viewer component scripts are present by initializing each viewer exactly once. Together, these changes stop visible overlapping text and documents restarting after their final page.

#### Agent migration

- **Package:** `@portfolio-engine/editorial-theme`
- **Consumer paths:** pages that render one or more `PdfViewer` components
- **Actions:** upgrade to the patched release; remove any temporary global styles or duplicate-page cleanup added downstream for these viewer defects
