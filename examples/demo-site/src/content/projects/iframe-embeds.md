---
title: 'IframeEmbed'
description: 'A security-vetted iframe wrapper for static demos and live tools. HTTPS-only, optional host allowlist, typed sandbox / allow / referrerpolicy.'
featured: true
date: 2026-02-18
tags: ['Components', 'Security', 'Embeds']
image: '/assets/work/iframe-embeds.svg'
---

## What it is

`<IframeEmbed>` is a small Astro component shipped by `@portfolio-engine/editorial-theme` for putting static interactive demos directly inside writing posts or pages. It enforces several rules at render time so a misconfigured embed fails the build instead of silently loading something unsafe.

## Validation rules

- `src` must either be a same-origin path starting with `/`, or an absolute `https://` URL. `http://`, `javascript:`, `data:`, and protocol-relative `//host` are all rejected.
- Backslashes in same-origin paths are rejected (WHATWG URL parsers normalize `\` to `/` and can redirect cross-origin).
- Control characters in the `src` are rejected.
- If `allowedHosts` is provided, absolute URLs must match the hostname (case-insensitive, port intentionally ignored).
- `height` and `aspectRatio` accept only narrow CSS forms — no semicolons, no whitespace, no escape sequences.

## How to use it

```astro
---
import IframeEmbed from '@portfolio-engine/editorial-theme/components/IframeEmbed.astro';
import { getBase, resolveAssetUrl } from '@portfolio-engine/editorial-theme';

// resolveAssetUrl prefixes the site's Astro `base` (BASE_URL) onto same-origin
// paths, so deployments under e.g. `/portfolio/` still resolve correctly.
const base = getBase();
const demoSrc =
  resolveAssetUrl('/assets/demos/architecture/', base) ??
  '/assets/demos/architecture/';
---

<IframeEmbed
  src={demoSrc}
  title="Four-layer architecture diagram"
  height={520}
  loading="lazy"
  sandbox="allow-same-origin"
  caption="Click any layer to highlight its dependencies."
/>
```

For Markdown posts that can't import a helper, write the path relative to the rendered page (e.g. `src="../../assets/demos/architecture/"` from `/writing/<slug>/`); same-origin path validation still applies.

This site embeds the self-contained interactive diagram on the [architecture page](/architecture) and inside the [four-layer architecture writing post](/writing/four-layer-architecture).
