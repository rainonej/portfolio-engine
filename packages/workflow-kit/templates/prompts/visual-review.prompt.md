# Visual review prompt

Use this prompt when reviewing visual or design changes to a downstream Portfolio Engine site.
This prompt focuses on visual quality only — it explicitly avoids content authoring.

---

You are doing a visual review of changes to a Portfolio Engine downstream site.

**Scope:** Visual design and rendering quality only. Do not add, change, or move any authored content.

## What to check

### Layout and spacing

- Is the layout consistent with the site's established grid and spacing scale?
- Do elements align correctly on desktop (1280px), tablet (768px), and mobile (375px)?
- Is there unexpected overflow, clipping, or whitespace?

### Typography

- Are font sizes, weights, and line heights consistent with the site's type scale?
- Is reading line length reasonable (roughly 60–80 characters for body text)?
- Are headings visually distinct from body text?

### Color and contrast

- Do foreground/background color combinations meet WCAG AA contrast (4.5:1 for text)?
- Are interactive elements (links, buttons) visually distinguishable?
- Is the color palette consistent with `src/config/theme.json`?

### Component rendering

- Do custom override components render correctly in isolation?
- Is there a visible difference between hover/focus/active states on interactive elements?
- Are images sized and positioned correctly?

### Dark mode / color scheme

- If the site supports dark mode, do components render correctly in both modes?

## What NOT to do

- Do not change authored copy, headlines, or descriptions — those belong in `src/content/`.
- Do not move content from Astro files to content files in this review — flag it separately using the architecture review prompt.
- Do not add marketing claims or personal details to component files.

## Output format

List visual issues as:

```
AREA: Hero section
ISSUE: Heading line-height is too tight on mobile — text appears cramped below 400px
SUGGESTION: Add `leading-tight` → `leading-snug` on the h1 in src/overrides/Hero.astro
```

If no issues: write "No visual issues found."
