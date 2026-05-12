# Iframe embeds and static interactive demos

Use this guide when a content page (work entry, writing entry, or a custom local route) needs to embed an external interactive page — for example a self-contained HTML / Plotly / D3 demo, a public dashboard, or a third-party widget.

Portfolio Engine ships a reusable **`IframeEmbed`** component in `@portfolio-engine/editorial-theme` that wraps an `<iframe>` with the safety defaults the engine expects: HTTPS-only for absolute URLs, opt-in `sandbox` / `allow` / `referrerpolicy`, optional host allowlist, lazy loading, required `title` for accessibility, and a `<figure>` / `<figcaption>` shell that respects the consumer's theme tokens (`--color-border-default`, `--color-surface-elevated`, `--color-text-muted`).

## When to use this vs. the alternatives

| Surface                                                              | Recommended approach                                                                                                                         |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `.astro` page (theme route, `src/pages-local/**`, or `src/pages/**`) | `IframeEmbed` component. Imports the validated component; nothing else to wire up.                                                           |
| `.mdx` content collection entry                                      | `IframeEmbed` component. Requires the consumer to install `@astrojs/mdx` first (see "Optional: enable MDX content" below).                   |
| `.md` content collection entry                                       | Raw inline `<iframe>` HTML, validated by hand. Astro renders raw HTML in `.md`, but content collections cannot import components from `.md`. |
| Provider-specific scheduling embed (Calendly, etc.)                  | `SchedulingBlock`, not `IframeEmbed`. See [`scheduling-calendly.md`](./scheduling-calendly.md).                                              |

## 1. Place the static demo under `public/`

Anything dropped under your consumer site's `public/` directory is served at the site root verbatim. The recommended layout for self-contained interactive demos:

```text
your-site/
  public/
    assets/
      demos/
        <topic-or-source>/
          <demo>.html
```

For example, `public/assets/demos/orbital/transfer-simulator.html` is served at `/assets/demos/orbital/transfer-simulator.html`.

No engine configuration is required — `public/` is Astro's standard static-asset pipeline and works identically in `output: 'static'` and SSR.

## 2. Embed it from an `.astro` page

The most common case: a custom page under `src/pages-local/` or a fully custom `src/pages/` route.

```astro
---
import Layout from '@portfolio-engine/editorial-theme/layouts/Layout.astro';
import IframeEmbed from '@portfolio-engine/editorial-theme/components/IframeEmbed.astro';
---

<Layout title="Interactive demo">
  <main class="mx-auto max-w-3xl px-6 pb-24 pt-40">
    <h1>Interactive demo</h1>

    <IframeEmbed
      src="/assets/demos/orbital/transfer-simulator.html"
      title="Low-thrust transfer simulator with live audit-equation readout"
      height={820}
      caption="Real velocity-Verlet integration in the browser. Diagnostics under the plot show conservation residuals."
    />
  </main>
</Layout>
```

Defaults you get for free:

- `loading="lazy"` (override with `loading="eager"` if the iframe is above the fold).
- Fixed 720px height when neither `height` nor `aspectRatio` is set.
- A `<figure>` wrapper with a rounded, themed border around the frame, and an optional `<figcaption>` rendered when `caption` is provided.

### Sizing

`height` wins (fixed CSS length) — best for non-responsive embedded content like Plotly dashboards that pick a layout size on load and do not reflow:

```astro
<IframeEmbed src="..." title="..." height={820} />
<IframeEmbed src="..." title="..." height="60vh" />
```

If `height` is not set and `aspectRatio` is, the frame sizes responsively using the modern CSS `aspect-ratio` property — best for content that scales (videos, image-style canvases):

```astro
<IframeEmbed src="..." title="..." aspectRatio="16/9" />
```

If neither is set, the frame falls back to a fixed 720px height (matches `SchedulingBlock`).

### Security props (opt-in)

`IframeEmbed` does **not** apply a `sandbox`, `allow`, or `referrerpolicy` by default. The component instead validates the `src` (HTTPS-only for absolute URLs, no `http://` / `javascript:` / `data:` / protocol-relative URLs) and gives you typed slots for each of those attributes so you can choose the right posture per embed:

```astro
<IframeEmbed
  src="https://example.com/widget"
  title="Third-party widget"
  sandbox="allow-scripts allow-same-origin"
  allow="clipboard-read; clipboard-write"
  referrerpolicy="strict-origin-when-cross-origin"
  allowedHosts={['example.com']}
/>
```

- **`sandbox`** — set when embedding code you do not fully trust. `"allow-scripts"` is usually the minimum a JS-driven demo needs; add `"allow-same-origin"` only if the demo legitimately needs same-origin access (note that the two together effectively defeat the sandbox for same-origin content). Omit entirely if the embed is your own static page from `public/` and you want full browser behavior.
- **`allow`** — Permissions Policy directives (e.g. `clipboard-read`, `fullscreen`). Omit unless an embed genuinely needs a non-default permission.
- **`referrerpolicy`** — typed to the standard values (`no-referrer`, `strict-origin-when-cross-origin`, etc.).
- **`allowedHosts`** — host-level allowlist enforced for absolute URLs. Same-origin paths starting with `/` are exempt (they cannot escape the consumer origin anyway). If `src` is an absolute URL whose host is not in `allowedHosts`, the build fails with a clear error. Use this when the `src` is supplied indirectly (e.g. from a content collection field or config) and you want to constrain it.

## 3. Embed from `.md` content (raw `<iframe>`)

Astro's Markdown renderer passes raw HTML through, so `<iframe>` works inside a content-collection `.md` file. You cannot use the `IframeEmbed` component from `.md` (content collections support component imports only in `.mdx`), so write the iframe by hand and apply the same hygiene `IframeEmbed` enforces:

```md
<iframe
  src="/assets/demos/orbital/transfer-simulator.html"
  title="Low-thrust transfer simulator with live audit-equation readout"
  loading="lazy"
  style="display:block;width:100%;height:820px;border:1px solid var(--color-border-default);border-radius:1rem;background:var(--color-surface-elevated);"
></iframe>
```

Notes:

- Always set `title` (screen-reader label).
- Always set `loading="lazy"` for embeds that aren't above the fold.
- Use a string `style="..."` attribute — JSX expression syntax (`style={{...}}`) is `.mdx`-only.
- Reference theme tokens (`--color-border-default`, `--color-surface-elevated`) so the embed picks up the consumer's theme.

## 4. Optional: enable MDX content (`@astrojs/mdx`)

If you want JSX expressions or to import `IframeEmbed` directly inside a content-collection entry, switch the entry from `.md` to `.mdx` and install the Astro MDX integration.

```bash
pnpm add @astrojs/mdx
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { editorialTheme } from '@portfolio-engine/editorial-theme/integration';

export default defineConfig({
  integrations: [
    mdx(),
    editorialTheme({
      // ...your usual config paths...
    }),
  ],
});
```

The default `content.config.ts` in the engine examples already globs `**/*.{md,mdx}`, so once the integration is added, `.mdx` entries compile automatically. Then:

```mdx
---
title: 'My research note'
date: 2026-01-01
---

import IframeEmbed from '@portfolio-engine/editorial-theme/components/IframeEmbed.astro';

# My research note

<IframeEmbed
  src="/assets/demos/orbital/transfer-simulator.html"
  title="Low-thrust transfer simulator"
  height={820}
  caption="Live audit-equation readout under the plot."
/>
```

MDX support is intentionally **not** auto-enabled by the engine — it pulls in additional build-time machinery and is a downstream choice, not an editorial-theme concern.

## 5. Verification

After embedding:

- Load the page in the browser, confirm the iframe paints and any interactive controls in the embedded page respond.
- Verify the validation paths: pass an `http://` URL or a `javascript:` URL in a scratch page and confirm the build fails with the IframeEmbed error message.
- For cross-origin embeds, watch the browser console for mixed-content or Permissions-Policy warnings and tune `allow` / `referrerpolicy` accordingly.

## Related

- Package export: `@portfolio-engine/editorial-theme/components/IframeEmbed.astro`
- Scheduling-specific embed (Calendly and other providers): [`scheduling-calendly.md`](./scheduling-calendly.md)
- Custom local routes via the consumer registry: [`custom-page-via-registry.md`](./custom-page-via-registry.md)
- Route ownership comparison (`src/pages-local` vs. `src/pages`): [`route-ownership.md`](./route-ownership.md)
