# overrides/

Put optional override components and styles here, then **wire them in `astro.config.mjs`** via `editorialTheme({ overrides: { components, styles } })`. Files in this folder are not auto-discovered.

Supported component surfaces: `Hero`, `FeaturedWriting`, `TestimonialSection`, `CollaborationSection`, `Footer`.

`Hero.astro` in this folder is a live demo override — it proves the override bridge works end-to-end and shows the expected props contract. Remove or replace it in a real consumer site.

See `docs/downstream/consumption.md` for the full surface table, props, and wiring example.
