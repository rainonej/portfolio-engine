# Project visibility

Project/work entries support:

```yaml
visibility: published | unlisted | draft
```

## Published

Appears in public lists and generates a detail page.

```yaml
title: Finished Case Study
visibility: published
featured: true
```

## Unlisted

Hidden from public lists but generates a detail page.

```yaml
title: Review Link Only
visibility: unlisted
featured: false
```

## Draft

Hidden from public lists and does not generate a detail page.

```yaml
title: Unfinished Case Study
visibility: draft
featured: false
```

## Recommended workflow

1. Start new stories as `draft`.
2. Move to `unlisted` for review links.
3. Move to `published` when ready.
