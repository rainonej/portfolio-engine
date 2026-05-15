# @portfolio-engine/workflow-kit

Reusable downstream tooling for Portfolio Engine sites: boundary-check scripts,
AI prompts, GitHub Actions templates, and VS Code/Cursor setup.

See [`packages/workflow-kit/README.md`](../../packages/workflow-kit/README.md) for
usage instructions and the full template listing.

## What it provides

**Boundary-check scripts** (`templates/scripts/`) — copy into your downstream `scripts/` directory
and wire them into CI:

| Script                                     | What it catches                                                                  |
| ------------------------------------------ | -------------------------------------------------------------------------------- |
| `check-content-boundaries.mjs`             | Content leaked into route/template/component files                               |
| `check-schema-strictness.mjs`              | `.passthrough()`, type casts (errors); null fallbacks, many optionals (warnings) |
| `check-rendered-links.mjs`                 | Stale internal links, placeholder content (static hrefs only)                    |
| `check-rendered-interactions.mjs`          | Browser-level CTA/card/nav click verification (Playwright)                       |
| `rendered-interactions.config.example.mjs` | Example config for `check-rendered-interactions`                                 |
| `check-unused.mjs`                         | Unused files/exports (Knip wrapper)                                              |
| `check-tooling-version.mjs`                | Drift from upstream templates                                                    |

**AI prompts** (`templates/prompts/`) — copy-paste into Claude Code, Cursor, or a PR review workflow:

| Prompt                                  | Purpose                                                    |
| --------------------------------------- | ---------------------------------------------------------- |
| `architecture-review.prompt.md`         | Check changed files for content/schema/template separation |
| `downstream-upgrade.prompt.md`          | Apply a new Portfolio Engine release                       |
| `content-boundary-review.prompt.md`     | Detailed boundary check for a PR                           |
| `visual-review.prompt.md`               | Visual design review (avoids content authoring)            |
| `rendered-interaction-review.prompt.md` | Browser interaction review: CTAs, cards, nav, overlays     |

**GitHub Actions template** (`templates/github/ci.yml`) — starter CI with type check,
content boundary check, and build.

**VS Code setup** (`templates/vscode/`) — format-on-save, file nesting, rulers,
recommended extensions (Astro, MDX, YAML, ESLint, Prettier, Tailwind).

**Cursor/MCP setup** (`templates/cursor/`) — architecture boundary rules and downstream
agent rules for AI-assisted development.

## Static rendered links vs browser interactions

`check-rendered-links` verifies that `href` values in built HTML resolve to files in `dist/`.
It does not verify that a user can click the element in a browser.

`check-rendered-interactions` verifies that interactive elements — CTAs, cards, navigation —
are actually clickable using Playwright's actionability checks. This catches classes of issues
that static link checks cannot detect:

- An overlay or `position: fixed` element covering a CTA
- `pointer-events: none` on a link wrapper
- A `z-index` layer in front of the clickable area
- Nested anchors (`<a>` inside `<a>`) that produce undefined click behavior
- The Vercel preview toolbar intercepting interaction in preview URLs

A downstream refactor can pass static link checks while still breaking real click behavior
if any of the above issues are present. This gap was exposed by downstream PR #60 in
`jordan-site`:
<https://github.com/rainonej/jordan-site/pull/60>

Use `check-rendered-interactions` when a change affects:

- CTAs, buttons, or primary links
- Cards (project, research, writing)
- Navigation (header, footer, mobile menu)
- Overlays, hover layers, or layout wrappers
- Links inside complex components
- Vercel preview behavior

## Changeset policy for workflow-kit

When workflow-kit templates change, the changeset entry must include an **Agent update note**:

```md
### Agent update note

Workflow-kit templates changed.

Downstream agents should compare and update:

- `.github/workflows/ci.yml`
- `.vscode/extensions.json`
- `.vscode/settings.json`
- `.cursor/rules/portfolio-engine-boundaries.md`
- `scripts/check-content-boundaries.mjs`
- `scripts/check-schema-strictness.mjs`

Do not blindly overwrite downstream customizations. Copy the new checks intentionally.
```

This policy applies to any PR that modifies files under `packages/workflow-kit/templates/`.

## Downstream sync tracking

Downstream repos should track which version they synced from:

```json
// package.json
{
  "portfolio-engine": {
    "workflowKitSyncedVersion": "0.1.0"
  }
}
```

Run `node scripts/check-tooling-version.mjs` to detect drift.

## Future: sync-tools command

The design target (not yet implemented) is:

```bash
pnpm portfolio-engine sync-tools --check   # compare local scripts against templates
pnpm portfolio-engine sync-tools --write   # copy updated templates (does not overwrite customizations)
```

## Workflow classification (planned)

A future capability will classify changes in a consumer site into:

- `local-content` — content/media edited by the site owner
- `local-config` — site config changes (nav, features, bookingUrl)
- `local-override` — overriding a named theme component
- `engine-change` — feature needed in a shared engine package
- `engine-bug` — defect in a shared engine package
- `human-review` — requires human judgment
