# Claude instructions for this portfolio site

This is a consumer site built on `@portfolio-engine/editorial-theme` and optionally `@portfolio-engine/admin-tools`.

The upstream engine lives at:

```text
https://github.com/rainonej/portfolio-engine
```

## Ownership model

The site owner controls:

- `src/content/` — projects, writing, profile, testimonials
- `src/config/` — site, navigation, theme, features
- `src/context/` — AI-readable identity, tone, brand, and agent rules
- `src/overrides/` — local component overrides
- `public/` — images and assets

Do not modify upstream package code from this repo unless explicitly asked.

Prefer consumer-site configuration, content, context, or override changes first.

## Package upgrades (`@portfolio-engine/*`)

When `package.json` or the lockfile changes versions for **`@portfolio-engine/*`**, or when the user asks to upgrade engine packages:

1. Follow **`docs/downstream/upgrade-path.md`** in this repo (if missing, use the same path in the upstream [portfolio-engine](https://github.com/rainonej/portfolio-engine) repo).
2. For each touched package, read **`CHANGELOG.md`** for the full semver window (previous version → new version), **oldest to newest**. Prefer **`#### Agent migration`** sections for actionable steps; merge them into one checklist. If two releases disagree, **follow the newer release**.
3. Read changelogs from `node_modules/@portfolio-engine/<pkg>/CHANGELOG.md` when present; otherwise use GitHub `rainonej/portfolio-engine` → `packages/<pkg>/CHANGELOG.md`.

Then run `pnpm install` (if needed), `pnpm check`, and `pnpm build`.

## Required reading before content/design work

Before writing copy or changing design direction, read:

- `src/context/site-owner.json`, if present
- `src/context/brand-voice.json`, if present
- `src/context/agent-rules.md`, if present
- `src/docs/design-brief.md`, if present
- `src/docs/resume.md`, if present
- `docs/downstream/agent-tooling.md`, if present
- `docs/downstream/design-review-checklist.md`, if present

Do not invent credentials, jobs, awards, publications, client names, degrees, or biographical details.

If source material is missing, use placeholders and mark them clearly.

## Content boundary rules

Authored content — headlines, deks, section labels, structured data, copy — belongs in `src/content/` and `src/config/`. Never in route files, templates, or components.

Before any change:

- Text or data change → edit `src/content/`
- Color, font, spacing → edit `src/config/theme.json`
- Navigation items → edit `src/config/navigation.json`
- Component rendering → edit `src/overrides/`

Do not add fallback strings (`?? 'some text'`) in route or template files.
Do not use `.passthrough()` in content collection schemas.

## Tooling policy

Use Context7 for current docs before implementing package-specific APIs or configuration.

Use the Vercel Plugin for Vercel-aware implementation guidance.

Use Vercel MCP for live Vercel state:

- deployments
- build logs
- runtime logs
- project settings
- domains
- env var names
- protected preview URLs

Use Playwright MCP or Playwright CLI after meaningful UI changes.

Prefer read-only MCP actions first.

Do not mutate production Vercel settings without explicit human confirmation.

Do not commit secrets.

## Local validation

Before considering work done:

```bash
pnpm check
pnpm build
```

If linting is configured:

```bash
pnpm lint
```

If boundary-check scripts are present:

```bash
node scripts/check-content-boundaries.mjs
node scripts/check-schema-strictness.mjs
```

After build, run the static rendered-link check:

```bash
node scripts/check-rendered-links.mjs
```

This check validates that internal hrefs resolve to files in `dist/`. It does **not** prove
that elements are visible, clickable, or free of overlay/z-index/nested-anchor issues.

For changes that affect CTAs, cards, navigation, overlays, or layout wrappers, also run
browser interaction verification:

```bash
SITE_URL=https://your-preview.vercel.app node scripts/check-rendered-interactions.mjs
```

If `scripts/check-rendered-interactions.mjs` is not present, follow the setup instructions
in `node_modules/@portfolio-engine/workflow-kit/README.md`.

When reporting work done in a PR, distinguish:

- **Static rendered HTML verified** — output of `check-rendered-links` or equivalent
- **Browser interaction verified** — Playwright output, Vercel preview URL, or manual steps

Do not claim browser interactions were verified unless you actually clicked or ran Playwright.

## Visual QA

After layout/style changes, inspect the site in a browser.

Check the routes that are active for this site (see `src/config/features.json` and `src/config/navigation.json`). Default routes are:

- `/`
- `/work`
- `/writing`
- `/about`
- `/contact`
- `/admin`, if enabled

Routes may be disabled or renamed in your site's configuration; only check routes that are active.

Check desktop and mobile.

Report what was actually inspected.

Do not claim a visual issue is fixed unless you inspected the page or clearly state it was code-only review.

## Content style

Prefer:

- concrete claims
- specific examples
- short paragraphs
- human voice
- clear section hierarchy

Avoid:

- generic startup language
- unexplained jargon
- fake polish
- invented detail
- corporate filler
- long walls of text
