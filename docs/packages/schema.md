# @portfolio-engine/schema

Shared Zod schemas. No Astro dependency — pure TypeScript + Zod. Can be used in any environment.

## Content schemas

| Schema              | File                 |
| ------------------- | -------------------- |
| `PersonSchema`      | person.json / bio.md |
| `WritingSchema`     | writing/\*.md        |
| `ProjectSchema`     | projects/\*.md       |
| `TestimonialSchema` | testimonials/\*.md   |
| `CVSchema`          | cv.json              |

## Config schemas

| Schema                   | File                   |
| ------------------------ | ---------------------- |
| `SiteConfigSchema`       | config/site.json       |
| `NavigationConfigSchema` | config/navigation.json |
| `ThemeConfigSchema`      | config/theme.json      |
| `FeaturesConfigSchema`   | config/features.json   |

## Implementation

Part of Epic 3. See [../../packages/schema/](../../packages/schema/).
