# Copilot instructions for this portfolio site

## Scope

This is a consumer site built on `@portfolio-engine/editorial-theme`.

The upstream engine lives in `rainonej/portfolio-engine`.

Prefer changes in:

- `src/content/`
- `src/config/`
- `src/context/`
- `src/overrides/`
- `public/`

Do not patch upstream package behavior in this consumer repo unless explicitly asked.

## Quality bar

Before considering work complete, run:

```bash
pnpm check
pnpm build
```

If linting is configured, also run:

```bash
pnpm lint
```

## Tooling rules

Use Context7 for current package docs and API examples.

Use the Vercel Plugin for Vercel-aware implementation guidance.

Use Vercel MCP only for live Vercel state:

- deployments
- build logs
- runtime logs
- project settings
- domains
- env var names
- protected preview URLs

Use Playwright MCP or Playwright CLI after meaningful UI changes.

Prefer read-only MCP operations first.

Do not mutate production settings without explicit human confirmation.

Do not commit secrets.

## Content rules

Read `src/context/` before writing copy.

Do not invent credentials, awards, jobs, publications, client names, or biographical details.

Prefer concrete, specific language over generic marketing language.

## Design rules

After UI changes, check desktop and mobile.

Look for:

- broken nav
- overflow
- clipping
- weak contrast
- bad spacing
- console errors
- generic or off-brand presentation

Report what was actually checked.
