---
'@portfolio-engine/workflow-kit': minor
---

Add rendered interaction verification templates and prompts for downstream sites.

This complements static rendered-link checks with browser-level smoke testing for CTAs, cards, navigation, and PDF/external links. The docs now distinguish static href validation from Playwright/browser interaction verification and update downstream PR checklist guidance.

#### Agent update note

Workflow-kit templates changed.

Downstream agents should compare and update:

- `.github/workflows/ci.yml` — add static rendered-link check step; optionally enable rendered interaction smoke
- `scripts/check-rendered-links.mjs` — hardened: supports single-quoted hrefs, normalizes leading slashes, documents static-only scope
- `scripts/check-content-boundaries.mjs` — hardened: fixed brittle CSS regex, added heuristic-limitation header comment
- `.github/pull_request_template.md` — add interaction verification section distinguishing static vs browser checks
- `.claude/CLAUDE.md` — add rendered-link and interaction check steps to local validation
- `.github/copilot-instructions.md` — same additions
- `.cursor/rules/downstream-agent-rules.md` — add interaction verification requirements

New templates to copy (optional but recommended):

- `scripts/check-rendered-interactions.mjs` — Playwright browser interaction smoke runner
- `scripts/rendered-interactions.config.mjs` — copy from `rendered-interactions.config.example.mjs` and edit
- prompts/`rendered-interaction-review.prompt.md` — browser interaction review prompt

Setup for interaction smoke (if adopting):

```bash
pnpm add -D @playwright/test
pnpm exec playwright install --with-deps chromium
```

Do not blindly overwrite downstream customizations. Copy new checks intentionally.
