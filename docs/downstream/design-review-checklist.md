# Design review checklist

Use this checklist before calling a portfolio site visually ready.

## Brand fit

- Does the page feel like the person described in `src/context/site-owner.json`?
- Does the tone match `src/context/brand-voice.json`?
- Does the design fit the audience?
- Does the hero section immediately explain who this person is and why they matter?

## Layout

- Is there a clear visual hierarchy?
- Is the hero section balanced?
- Are sections visually distinct without feeling noisy?
- Is there enough whitespace?
- Are headings, body text, and metadata consistently sized?
- Does the layout work on mobile without awkward stacking?

## Typography

- Are line lengths readable?
- Are heading sizes intentional?
- Is body copy comfortable to read?
- Are links visually recognizable?
- Are labels, dates, tags, and metadata visually subordinate?

## Color

- Are colors drawn from the site’s theme/config?
- Is contrast sufficient?
- Are accent colors used sparingly?
- Do hover/focus states exist where needed?
- Does the palette feel coherent across pages?

## Content

- Is the copy specific rather than generic?
- Are claims supported by provided source material?
- Are placeholders clearly marked or removed?
- Are CTAs concrete and appropriate?
- Is anything invented?

## Navigation

- Does the primary nav work?
- Is the active/current page state clear?
- Are links descriptive?
- Do external links open appropriately?
- Is the contact path obvious?

## Accessibility

- Is there one logical `h1` per page?
- Are headings nested sensibly?
- Are images given useful alt text?
- Are interactive elements keyboard reachable?
- Are focus states visible?
- Are link labels meaningful outside visual context?
- Does the page avoid click-only interactions?

## Performance and build hygiene

- Does `pnpm check` pass?
- Does `pnpm build` pass?
- Are images reasonably sized?
- Are unused scripts avoided?
- Are console errors resolved?

## Final review statement

Before marking complete, write:

```md
I checked [routes] at [viewports].
Build status: [pass/fail].
Known remaining issues: [...]
```
