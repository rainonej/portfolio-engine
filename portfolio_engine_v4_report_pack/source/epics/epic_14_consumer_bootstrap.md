# Epic 14 — Consumer bootstrap/setup script

**Phase:** Phase 9  
**MVP relevance:** Post–Product-MVP — helpful for adoption  
**Products touched:** C, D, F, G  
**Labels:** `type:epic`, `area:downstream`, `area:workflow-kit`, `area:docs`, `source:human`

## Summary

Provide a setup script that bootstraps a consumer repo from scratch. Nontechnical users should not have to manually wire a multi-language project spanning Node/pnpm/Astro plus optional Python/MCP tooling.

## Why this matters

The target system requires multiple files across several directories. A new consumer who is not a developer will struggle to set up correctly. A bootstrap script reduces the barrier to adoption and ensures the consumer layout contract is followed from day one.

## Setup script target locations

```text
scripts/setup-consumer.sh
packages/workflow-kit/tools/init_consumer_repo.py
templates/consumer/
```

## What the script does

### Required runtime setup

- Create `package.json` if missing.
- Install `astro` and `@portfolio-engine/editorial-theme`.
- Create `astro.config.mjs`.
- Create `tsconfig.json`.
- Create `src/config`, `src/content`, `src/context`, `src/overrides`.
- Create `public/media`.
- Add README files to each folder.
- Add placeholder/example JSON and content files.
- Create `.gitignore`.

### Optional MCP setup

- Install or document Python workflow-kit.
- Create `.mcp.json` if the user opts in.
- Create or patch `AGENTS.md`.
- Explain Claude/Copilot MCP setup.

### Optional Git/Vercel guidance (printed steps only)

The script cannot complete dashboard steps. It prints human instructions for:

- Creating and connecting a GitHub repo.
- Connecting Vercel.
- Choosing production branch.
- Choosing preview branch.
- Configuring domain.
- Configuring environment variables/secrets if needed.

## Tickets

### T14.1 — Design setup script UX

**Labels:** `task:design`, `owner:human-dev`, `area:downstream`, `mvp:post`

Decide command name and distribution method, prompts and questions, and non-overwrite behavior.

**Acceptance criteria**

- [ ] Command name and distribution method decided.
- [ ] User prompts and questions documented.
- [ ] Behavior when files already exist is specified.

### T14.2 — Add setup templates

**Labels:** `task:feat`, `owner:agentic-ai`, `area:downstream`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] Template `astro.config.mjs` exists.
- [ ] Template `AGENTS.md` exists.
- [ ] Template `.mcp.json` exists.
- [ ] Template folder READMEs exist.
- [ ] Placeholder content, config, and context examples exist.

### T14.3 — Add setup script dry-run mode

**Labels:** `task:feat`, `owner:agentic-ai`, `area:workflow-kit`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] Dry-run mode prints planned file changes without writing them.
- [ ] Existing files trigger a warning and are not overwritten without explicit confirmation.

### T14.4 — Add human setup checklist

**Labels:** `task:docs`, `owner:agentic-ai`, `area:docs`, `agent:approved`, `mvp:post`

**Acceptance criteria**

- [ ] GitHub repo creation steps documented.
- [ ] Vercel connection steps documented.
- [ ] Domain configuration guidance documented.
- [ ] Preview/production branch guidance documented.
