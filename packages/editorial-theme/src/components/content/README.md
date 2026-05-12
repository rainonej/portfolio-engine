# What this folder contains

Universal, reusable editorial pieces — cards, grids, headers, and tag chips — that downstream screens can import directly without copying markup. Every component is generic by design (no consumer-specific names, brand strings, or one-off values) and styles itself only with CSS custom properties from `../../styles/design-tokens.css`, so a consumer's `theme.json` overrides apply automatically.

| Component                  | One-line purpose                                                                |
| -------------------------- | ------------------------------------------------------------------------------- |
| `ContentSectionHeader.astro` | Section-level intro with eyebrow, heading, description, and optional link.    |
| `LinkCard.astro`           | Clickable card that routes readers to another screen.                           |
| `FeatureCard.astro`        | Large highlighted card for featured or pinned items, with optional image.       |
| `EvidenceCard.astro`       | Compact proof block: claim → evidence → outcome, with optional caveat.          |
| `MetricCard.astro`         | Single metric or status marker (value, label, optional note).                   |
| `MetricStrip.astro`        | Responsive row of `MetricCard` items.                                           |
| `QuoteCard.astro`          | Testimonial or reference card with attribution and optional related link.       |
| `CardGrid.astro`           | Responsive grid container (2 or 3 columns) for any cards in this folder.        |
| `ArticlePreviewCard.astro` | Long-form preview card with date in monospace and tags via `TagList`.           |
| `RelatedLinkCard.astro`    | Compact sibling/"see also" link for sidebars and rails.                         |
| `TagList.astro`            | Chip renderer for tag arrays — consistent styling across every screen.          |

## Component usage map

### ContentSectionHeader

Use anywhere a screen needs a titled section intro — keeps eyebrow, heading, and "View all →" alignment consistent.
Good for: Work list intros, writing list intros, about-page sub-sections, custom landing screens.
Do not copy this header's markup into downstream screens — import the component and pass props.

### LinkCard

Use when a screen needs a card that routes the reader somewhere else — a sibling section, a deep link, an external resource.
Good for: Hub pages, "explore more" rails, deep-link panels on a detail screen.
Do not copy this card's markup into downstream screens — import the component and pass props.

### FeatureCard

Use when a card needs more visual weight than `LinkCard` — typically the first item in a list, a pinned project, or a "featured" callout.
Good for: Featured work or writing on the home screen, hero-adjacent callouts, "selected work" rails.
Do not copy this card's markup into downstream screens — import the component and pass props.

### EvidenceCard

Use when a screen needs to show a claim, the evidence behind it, and the result.
Good for: Work item summaries, individual work detail screens, research note sidebars.
Do not copy this card's markup into downstream screens — import the component and pass props.

### MetricCard

Use for a single metric or status marker — a number, a status label, a key value.
Good for: "By the numbers" rows on a project page, KPIs on a case study, status callouts.
Do not copy this card's markup into downstream screens — import the component and pass props.

### MetricStrip

Use when you have an array of metrics that should render as a responsive row.
Good for: Project impact rows, "at a glance" stripes above the fold on a case study.
Do not copy this strip's markup into downstream screens — import the component and pass props.

### QuoteCard

Use for a single quote with attribution — testimonial or reference.
Good for: Testimonial sections, "what the team said" sidebars, inline pull-quotes on long-form content.
Do not copy this card's markup into downstream screens — import the component and pass props.

### CardGrid

Use as the container around any combination of cards in this folder.
Good for: Work lists, writing lists, related-content grids, anywhere a 2-or-3 column grid is needed.
Do not copy this grid's markup into downstream screens — import the component and place card children in the default slot.

### ArticlePreviewCard

Use for long-form content previews — essays, posts, notes.
Good for: Writing list screens, article cross-link rails, "more from this author" sections.
Do not copy this card's markup into downstream screens — import the component and pass props.

### RelatedLinkCard

Use for compact "see also" links — smaller and lighter than `LinkCard`.
Good for: Sidebars, "up next" footers on detail screens, related-reading rails.
Do not copy this card's markup into downstream screens — import the component and pass props.

### TagList

Use anywhere a tag array needs to render consistently across screens.
Good for: Article headers, work detail screens, filter strips, any chip group.
Do not copy this list's markup into downstream screens — import the component and pass the `tags` array.
