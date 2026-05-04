# Portfolio site setup — paste this into Claude Code

Copy this whole file into Claude Code as your first message.

---

You are helping me set up a new personal portfolio site from scratch using
`@portfolio-engine/editorial-theme` + `@portfolio-engine/admin-tools`.

Operate in phases. Keep a running friction log in `src/docs/setup-feedback.md` during setup.
If I provide a resume and/or design doc, save them to `src/docs/resume.md` and `src/docs/design-brief.md` first, then use them as source-of-truth.

## Phase 1 — intake

Ask once for missing items only:

- name, role, tagline, one-line description, location
- tone, audience
- pages (Work/Writing/About/Contact)
- social links + booking URL (optional)
- repo name

If resume/design docs were provided, do **not** re-ask obvious info; infer carefully and only confirm ambiguities.

## Phase 2 — scaffold + configure

Follow:
https://github.com/rainonej/portfolio-engine/blob/main/docs/downstream/new-site-setup.md

Also:

- run `docs/downstream/setup.sh` (macOS/Linux) or `docs/downstream/setup.ps1` (Windows) if present to automate standard setup
- ensure `adminTools({ devBypass: true })` is configured after `editorialTheme(...)`
- ensure Astro output is `static`
- create placeholder `src/content/profile/person.json` and `src/content/profile/cv.json`
- set `.gitignore` entries for `.portfolio-engine/` and `.vercel/`
- seed agent tooling unless I explicitly opt out:
  - `CLAUDE.md`
  - `.github/copilot-instructions.md`
  - `.cursor/mcp.example.json`
  - `src/docs/agent-tooling.md`
  - `src/docs/visual-qa-prompt.md`
  - `src/docs/design-review-checklist.md`
- read `src/docs/agent-tooling.md` before using MCP/plugin/browser tools

Write each confusion/error/contradiction to `src/docs/setup-feedback.md` as you go.

Before running setup scripts, read them first and execute a dry-run preview (`DRY_RUN=1` or `-DryRun`). If a phase is unnecessary, skip it using script flags/environment variables rather than hand-editing unrelated files.

## Phase 3 — git + GitHub

- create `main` (production) and `dev` (preview/staging) branches
- set default branch to `main`
- push both branches
- use branch protections if available

## Phase 4 — Vercel setup (guided)

Guide manual import and set:

- Production branch: `main`
- Preview branches: `dev` + PRs
- Node 22
- `SITE_URL` as production-only env var

If available, use the tool split documented in `src/docs/agent-tooling.md`:

- Vercel Plugin for implementation guidance.
- Vercel MCP for live Vercel state.
- Context7 for current package docs.
- Playwright for browser-based verification.

If those tools are unavailable, provide click-by-click fallback instructions.

## Phase 5 — admin + branch behavior verification

Verify:

- `/admin` works in local dev with `devBypass: true`
- admin/auth routes are not main-branch-only and work on preview deployments too
- OAuth env vars are documented (all required vars listed)
- run the visual QA checklist in `src/docs/visual-qa-prompt.md` after deployment or meaningful UI changes

## Phase 6 — CI

Ensure CI runs on pushes/PRs for both `main` and `dev`.

## Phase 7 — wrap-up + feedback ticket

At end:

1. summarize live URL, repo URL, branch strategy, and where to edit content
2. sanitize `src/docs/setup-feedback.md` (no personal data, no secrets)
3. open a GitHub issue in `portfolio-engine` titled
   `Setup friction report from [repo-name]` and paste sanitized feedback
4. include issue URL in final summary
