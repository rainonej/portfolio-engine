---
'@portfolio-engine/editorial-theme': minor
---

Add a reusable `PdfViewer.astro` component that renders same-origin PDFs with PDF.js instead of browser-native iframe plugins. The viewer provides continuous pages, selectable text, current-page status, responsive zoom and fit controls, open/download fallbacks, lazy canvas rendering, and accessible loading/error states.

#### Agent migration

- **Packages:** `@portfolio-engine/editorial-theme`
- **Consumer paths:** consumer-owned Astro pages that currently embed PDFs with `IframeEmbed` or raw `<iframe>` elements
- **Actions:**
  - Upgrade `@portfolio-engine/editorial-theme` to the release containing this changeset.
  - Import `PdfViewer` from `@portfolio-engine/editorial-theme/components/PdfViewer.astro`.
  - Replace the PDF iframe with `<PdfViewer src="/documents/example.pdf" title="Example document" />`.
  - Keep any important open/download action outside the viewer when the document is a primary page action.
