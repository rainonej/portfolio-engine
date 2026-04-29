# @portfolio-engine/editorial-theme

The first-party Astro theme built on `engine-core`.

## Contents

### Layouts
- `Layout.astro` — base page wrapper

### Components
- `Nav.astro` — site navigation
- `SectionIntro.astro` — section header with title and description
- `FeaturePillars.astro` — services/feature grid
- `WritingList.astro` — writing index
- `TestimonialBlock.astro` — testimonial display
- `CollaborationCTA.astro` — collaboration call-to-action
- `AmbientBackground.astro` — decorative background
- `Reveal.astro` — scroll reveal wrapper

### Routes
| Path | Description |
|------|-------------|
| `/` | Home page |
| `/about` | About page |
| `/work` | Work index |
| `/work/[slug]` | Work detail |
| `/writing` | Writing index |
| `/writing/[slug]` | Writing detail |
| `/contact` | Contact page |

Admin route handled separately in `@portfolio-engine/admin-tools` (Epic 7).

### Override surfaces

Named override points are explicit and stable. Consumers can override individual components by placing a file in their `src/overrides/components/` directory. The exact surface list is defined in Task 4.4.

## Implementation

Epic 4 tasks: 4.1–4.5. See [../../packages/editorial-theme/](../../packages/editorial-theme/).
