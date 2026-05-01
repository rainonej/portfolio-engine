# Epic 17 — Admin-tools publishing and preview management

**Phase:** Phase 11  
**MVP relevance:** Post–Product-MVP — does not block Backbone or Product MVP  
**Products touched:** C, D, E  
**Labels:** `type:epic`, `area:admin-tools`, `area:vercel`, `source:human`

## Summary

Expose preview and public site concepts clearly in admin-tools, and eventually provide nontechnical users with safe publishing workflows. This covers preview link reveal, branch model documentation, Vercel setup guidance, and optional publishing cadence settings.

## Why this matters

Nontechnical users currently cannot distinguish between their preview site (on the `dev` branch) and their public production site (on the `main` branch). Admin-tools can make this boundary explicit, reducing accidental public publishing and clarifying when/how to promote changes.

## Target modules

### Preview/public publishing panel

- Show current public production URL.
- Show dev/preview site URL.
- Reveal obfuscated Vercel preview link with explanation of who can access it.
- Show branch mapping: `main` → public production; `dev` → preview.
- Provide Vercel project setup instructions.
- Optionally trigger or guide dev→main promotion.

### Branch model documentation

Explain to nontechnical users what the branch model means in plain language:

- What the `dev` branch is and who sees it.
- What the `main` branch is and who sees it.
- How to promote from `dev` to `main` safely.
- Why auto-publish without approval is disabled by default.

### Publishing cadence settings

Future settings (disabled by default):

```json
{
  "publishing": {
    "mode": "manual",
    "previewBranch": "dev",
    "productionBranch": "main",
    "weeklyPromotion": {
      "enabled": false,
      "day": "Friday",
      "requiresApproval": true
    }
  }
}
```

Possible workflows:

- Manual PR from `dev` to `main`.
- Scheduled weekly PR.
- Scheduled auto-merge only after site-owner approval.
- Never auto-publish without explicit opt-in.

## Tickets

### T17.1 — Design preview/public publishing panel UI

**Labels:** `task:design`, `owner:human-dev`, `area:admin-tools`, `mvp:post`

**Acceptance criteria**

- [ ] Panel design shows public URL, preview URL, and branch mapping.
- [ ] Preview link reveal behavior is designed (who sees it, how it is shown).
- [ ] Vercel setup instructions are drafted.

### T17.2 — Implement branch model documentation in admin-tools

**Labels:** `task:docs`, `owner:agentic-ai`, `area:admin-tools`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] Plain-language explanation of dev/main branch model exists in UI or linked docs.
- [ ] Manual promotion steps are documented.

### T17.3 — Model publishing cadence settings schema

**Labels:** `task:feat`, `owner:agentic-ai`, `area:admin-tools`, `area:schema`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] Publishing cadence schema is defined.
- [ ] Settings are disabled by default.
- [ ] No auto-publish without explicit opt-in.
- [ ] Schema documented in `packages/schema`.

### T17.4 — Add Vercel setup guidance docs

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `area:vercel`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] Step-by-step Vercel project setup documented.
- [ ] Branch-to-URL mapping explained.
- [ ] Preview link access and obfuscation explained.
- [ ] Domain configuration guidance included.
