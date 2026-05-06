# Consuming portfolio-engine

## Consumer site layout

The canonical `src/` directory contract for any consumer site:

```
your-site/
  src/
    config/       JSON config files consumed by editorialTheme()
    content/      Astro content collections
    context/      Site-owner identity and brand voice (agent use)
    overrides/    Component overrides (named surfaces only)
    pages-local/  Consumer-local pages (registry-backed, optional)
    registry/     portfolio-engine.registry.json (optional)
    pages/        Ordinary Astro file routes (optional)
```

These directories are contract-stable. The build always reads `config/` and `content/`. Files under `src/overrides/` change the site **when** you wire them through `editorialTheme({ overrides })` (the integration resolves paths at config time and theme components load them at render time). `context/` is not read by the build—it is for AI-assisted workflows only.

## Route ownership modes

Portfolio Engine supports three route ownership modes:

1. **Theme-injected routes** — `/`, `/work`, `/work/[slug]`, `/writing`,
   `/writing/[slug]`, `/about`, `/contact`, `/resume`. You supply content;
   the theme renders the page.

2. **Consumer-local registry routes** — declare in
   `src/registry/portfolio-engine.registry.json`; page files live under
   `src/pages-local/`. Useful for replacing a theme page while keeping the
   theme shell (Layout, Nav, styles). Disable the corresponding theme route
   first so there is no collision.

3. **Ordinary Astro file routes** — page files under `src/pages/`. Astro
   owns these via file-based routing. Useful for fully custom pages that
   don't need to replace a theme route (e.g. `src/pages/resume.astro`).
   The engine does not inject these — Astro discovers them automatically.
   The engine cannot verify nav items pointing at ordinary Astro routes;
   it will warn but not fail unless `diagnostics.strictNavRoutes: true`.

After every build, `.portfolio-engine/manifest.json` lists all active routes
with their `routeOrigin` (`"theme"` or `"consumer-local"`) and the relative
`entrypoint` path, so you can immediately see which file owns each URL.
Ordinary `src/pages` routes are not injected by the engine and do not appear
in the manifest. (`"consumer-pages"` and `"unknown"` are reserved type values
for future use.)

For **`theme.json`** (colors, typography, tokens) and how they map to CSS variables, see **[`design-tokens-and-theme.md`](design-tokens-and-theme.md)**.

For a concise comparison of **`src/pages-local`** vs **`src/pages`**, nav warnings, and `/resume` visibility, see **[`route-ownership.md`](route-ownership.md)**. For Calendly-style scheduling URLs and **`SchedulingBlock`**, see **[`scheduling-calendly.md`](scheduling-calendly.md)**.

There are two modes for consuming portfolio-engine packages, depending on whether you are a downstream site owner or an engine contributor.

## Semver mode (separate consumer repo)

The production mode for `agreni-site` and `jordan-site`. Your consumer repo is a standalone Astro project with no direct knowledge of the monorepo.

**Install from npm:**

```bash
pnpm add @portfolio-engine/editorial-theme@latest
```

**`astro.config.mjs`:**

```js
import { defineConfig } from 'astro/config';
import { editorialTheme } from '@portfolio-engine/editorial-theme';

export default defineConfig({
  integrations: [
    editorialTheme({
      siteConfigPath: './src/config/site.json',
      navigationConfigPath: './src/config/navigation.json',
      themeConfigPath: './src/config/theme.json',
      featuresConfigPath: './src/config/features.json',
    }),
  ],
});
```

**Upgrade:** bump the version in `package.json` and run `pnpm install`. Pin to a specific minor to control when you pick up changes.

## Vercel (standalone consumer repo)

Use this when the consumer site is its **own Git repository** (for example `agreni-site`), not `examples/demo-site` inside this monorepo. Monorepo demo deploy is documented in **[`examples/demo-site/README.md`](../../examples/demo-site/README.md#vercel)** instead.

### Connect the project

1. In the Vercel dashboard, **Add New → Project** and import the consumer repository.
2. **Root Directory:** the repository root (`.`). The Astro app, `package.json`, and `pnpm-lock.yaml` should live at that root.
3. **Framework Preset:** Astro when auto-detected; otherwise set commands manually:

   | Setting              | Typical value                                                                                                                                                                                                                                                                |
   | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Install Command**  | `pnpm install`                                                                                                                                                                                                                                                               |
   | **Build Command**    | `pnpm build`                                                                                                                                                                                                                                                                 |
   | **Output Directory** | Leave default when using [`@astrojs/vercel`](https://docs.astro.build/en/guides/integrations-guide/vercel/) — the adapter emits the correct serverless output. Do **not** point only at `dist` unless you know you are shipping a fully static export with no server routes. |

4. **Node.js version:** **22.x** in **Project → Settings → General** (matches common Vercel serverless runtimes and reduces "works on my machine" drift).

### Production on `main`, previews on `dev`

1. **Settings → Git → Production Branch** → set to **`main`**. Pushes to `main` update the **production** deployment and your production domain.
2. Keep a long-lived **`dev`** branch for staging. Pushes to **`dev`** (and to any other non-production branch, plus pull requests) create **Preview** deployments with their own `*.vercel.app` URLs.
3. Typical flow: feature branches → PR into **`dev`** (preview per PR) → merge **`dev` → `main`** when you are ready to ship to production. One Vercel project is enough; you do not need a second project for staging.

### Canonical site URL (`SITE_URL`)

Astro's top-level `site` option drives canonical URLs and Open Graph metadata. Recommended pattern in the consumer's `astro.config.mjs`:

```js
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
  'https://your-fallback.example';
```

Then in Vercel **Environment variables**:

- **Production:** set `SITE_URL` to the real public origin (for example `https://www.example.com` after you add a custom domain).
- **Preview:** omit `SITE_URL` so previews use `https://${VERCEL_URL}` from the snippet above, unless you use a fixed preview hostname.

Redeploy after changing environment variables so builds pick them up.

### OAuth and server routes

If the consumer exposes **GitHub OAuth**, **session cookies**, or **API routes** under `/api/*` or `/admin`, add [`@astrojs/vercel`](https://docs.astro.build/en/guides/integrations-guide/vercel/) (or your host's adapter) and configure `output` / adapter per Astro's hybrid/server docs.

**GitHub OAuth app:** register **authorization callback URLs** for every origin users will hit—at minimum production **and** preview origins (each preview deployment has its own hostname unless you use a stable preview domain). Without preview callbacks, sign-in from a Preview deployment will fail after redirect.

### Optional: branch-scoped CMS or content APIs

If your site uses environment variables such as `CONTENT_BRANCH` for GitHub Contents API writes, scope them in Vercel:

- **Production** env → branch that backs the live site (often `main`).
- **Preview** env → staging branch (often `dev`) so preview deployments do not edit production-tracked files.

Your consumer repo's own `README` or `docs/setup.md` should list the exact secrets and names for that deployment.

## Workspace-link mode (monorepo contributor)

Use this when you need to change engine packages and see results in a consumer site at the same time, without publishing to npm.

**Option A — `link:` in the consumer repo** (cross-repo, most common for agreni-site):

```json
{
  "dependencies": {
    "@portfolio-engine/editorial-theme": "link:../portfolio-engine/packages/editorial-theme"
  }
}
```

Run `pnpm install` in the consumer repo after changing the reference. Source changes in the monorepo reflect on the next consumer build without reinstalling.

**Option B — add the consumer to the monorepo workspace** (for demo-site and integration testing):

In `pnpm-workspace.yaml` include the consumer path, then use `workspace:*` in `package.json`:

```json
{
  "dependencies": {
    "@portfolio-engine/editorial-theme": "workspace:*"
  }
}
```

Run `pnpm install` from the monorepo root. `pnpm -r run build` will include the consumer.

## Scheduling / Booking Embeds

Portfolio Engine supports a provider-light scheduling block that renders a booking URL as a **button**, **link**, or **iframe embed**.

- Works well with Calendly for v1, while remaining compatible with other providers.
- Requires only a public HTTPS booking URL.
- Does **not** connect calendars directly, create events, or inject provider SDK scripts.

### Human setup

Portfolio Engine only renders your public booking URL. The scheduling provider controls availability, approvals, calendar sync, invites, reminders, and cancel/reschedule flows.

1. Create an account with a scheduling provider. Calendly is the easiest v1 path.
2. Connect your calendar inside the provider dashboard.
3. Create an event type.
4. Configure duration, availability, buffers, minimum notice, location, and intake questions.
5. Publish and copy your public booking URL.
6. Add that URL to downstream `src/config/site.json` under `contact.scheduling`.
7. Test end-to-end in incognito.

### Example config

```json
{
  "contact": {
    "heading": "Let's work together",
    "body": "Reach out and let's find what's possible.",
    "scheduling": {
      "enabled": true,
      "provider": "calendly",
      "mode": "button",
      "url": "https://calendly.com/example/intro-call",
      "label": "Book an intro call"
    }
  }
}
```

### Button vs embed

Use `mode: "button"` for compact contact sections and homepage CTAs.

Use `mode: "embed"` on pages dedicated to booking.

### Security note

Only use trusted HTTPS URLs. Portfolio Engine intentionally avoids provider SDKs and third-party script injection for v1.

### Legacy `bookingUrl`

Some older sites may still use top-level `bookingUrl` in `src/config/site.json`. The contact page continues to support it as a fallback, but new sites should prefer `contact.scheduling`.

## Switching between modes

To switch a consumer repo from workspace-link to semver:

1. Replace `"link:..."` or `"workspace:*"` with the published semver version (e.g., `"^0.2.0"`) in the consumer's `package.json`.
2. Run `pnpm install` in the consumer repo.
3. Verify the build still passes: `pnpm build`.

To switch from semver back to workspace-link:

1. Replace the semver version with `"link:../portfolio-engine/packages/editorial-theme"`.
2. Run `pnpm install`.
3. Any source changes in the monorepo now take effect on the next build.

## Overrides

Overrides are **not** picked up from disk automatically. Pass an `overrides` object to `editorialTheme()` with paths **relative to the consumer project root**. Only named surfaces declared by the engine are valid; unsupported names fail at build time.

### Supported surfaces

| Surface name           | Upstream implementation        | Props passed                                          |
| ---------------------- | ------------------------------ | ----------------------------------------------------- |
| `Hero`                 | `HeroSection.astro`            | `person`, `bookingUrl`, `pillars`, `base`, `tagline?` |
| `FeaturedWriting`      | `FeaturedWritingSection.astro` | `posts`, `base`                                       |
| `TestimonialSection`   | `TestimonialSection.astro`     | `testimonials`                                        |
| `CollaborationSection` | `CollaborationSection.astro`   | `base`, `ctaBody?`                                    |
| `Footer`               | `Footer.astro`                 | `adminHref`, `siteTitle`                              |

The surface **name** (e.g. `Hero`) is the stable contract key. The upstream implementation file it replaces (e.g. `HeroSection.astro`) is an internal detail that may be renamed. Your override file receives the props listed above and is rendered in place of the default implementation.

You may also pass `styles` (array of CSS file paths) to append extra CSS after the theme's global styles — useful for custom properties or utility overrides without replacing a component.

### Wiring overrides

**Example — `astro.config.mjs`:**

```js
import { defineConfig } from 'astro/config';
import { editorialTheme } from '@portfolio-engine/editorial-theme';

export default defineConfig({
  integrations: [
    editorialTheme({
      siteConfigPath: './src/config/site.json',
      navigationConfigPath: './src/config/navigation.json',
      themeConfigPath: './src/config/theme.json',
      featuresConfigPath: './src/config/features.json',
      overrides: {
        components: {
          Hero: './src/overrides/Hero.astro',
        },
        styles: ['./src/overrides/custom.css'],
      },
    }),
  ],
});
```

By convention, keep those files under `src/overrides/`. Do not point at arbitrary internal theme files — only the surface keys in the table above are stable.

```
your-site/
  src/
    overrides/
      Hero.astro        ← example: wired via overrides.components.Hero
      custom.css        ← example: wired via overrides.styles
```

A working demo override for `Hero` lives at [`examples/demo-site/src/overrides/Hero.astro`](../../examples/demo-site/src/overrides/Hero.astro).
