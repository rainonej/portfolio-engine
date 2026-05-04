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

## Required reading before content/design work

Before writing copy or changing design direction, read:

- `src/context/site-owner.json`
- `src/context/brand-voice.json`
- `src/context/agent-rules.md`
- `src/docs/design-brief.md`, if present
- `src/docs/resume.md`, if present
- `src/docs/agent-tooling.md`, if present
- `src/docs/design-review-checklist.md`, if present

Do not invent credentials, jobs, awards, publications, client names, degrees, or biographical details.

If source material is missing, use placeholders and mark them clearly.

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

## Visual QA

After layout/style changes, inspect the site in a browser.

Check:

- `/`
- `/work`
- `/writing`
- `/about`
- `/contact`
- `/admin`, if enabled

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
