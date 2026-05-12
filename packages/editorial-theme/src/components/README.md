# What this folder controls

This folder contains reusable visual pieces used across multiple screens.

A "component" is a self-contained piece of the screen — a navigation bar, a card, a section — that can appear in many places without being rewritten each time.

## Key components

| File / folder             | What it displays                                              |
|---------------------------|---------------------------------------------------------------|
| `Nav.astro`               | The top navigation bar shown on every screen                  |
| `Footer.astro`            | The footer shown at the bottom of every screen                |
| `sections/HeroSection.astro` | The large intro section on the home screen                |
| `sections/FeaturedWritingSection.astro` | The writing preview section on the home screen |
| `sections/TestimonialSection.astro`     | The testimonials section on the home screen    |
| `sections/CollaborationSection.astro`   | The call-to-action section on the home screen  |
| `ImageOrFallback.astro`   | Displays an image, or a letter placeholder if no image exists |
| `WritingList.astro`       | A list of writing cards                                       |

Some of these components (`Hero`, `FeaturedWriting`, `TestimonialSection`, `CollaborationSection`, `Footer`) can be replaced by a downstream site through the override surface system. See `../registry.ts`.
