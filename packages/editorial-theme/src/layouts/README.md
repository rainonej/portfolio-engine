# What this folder controls

This folder contains the shared outer frame that wraps every visitor-facing screen.

| File           | What it controls                                                         |
|----------------|--------------------------------------------------------------------------|
| `Layout.astro` | The HTML shell: head metadata, nav, footer, global styles, and the slot where page content goes |

Every page on the site is wrapped in `Layout.astro`. It handles:
- SEO metadata (title, description, Open Graph, Twitter Card)
- Google Fonts loading
- Navigation bar and footer
- Global CSS and theme token overrides
- The inline JavaScript for scroll-reveal animations

To change the shared outer frame for a downstream site, edit `Layout.astro` here (if contributing to the theme) or replace the `Footer` override surface from a downstream site.
