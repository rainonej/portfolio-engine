# Agent tooling for portfolio-engine consumer sites

This repo is designed to work well with AI coding agents, but agents should use tools deliberately.

Use the smallest tool that answers the question:

| Tool                            | Use it for                                                                                                          | Do not use it for                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Vercel MCP                      | Inspecting real Vercel state: deployments, build logs, runtime logs, env var names, domains, protected preview URLs | Guessing how the code should be written                    |
| Vercel Plugin                   | Vercel-aware implementation guidance, deployment best practices, env-var workflow, Vercel CLI guidance              | Reading private project state unless MCP/CLI is configured |
| Context7                        | Current package docs and API examples for Astro, Vercel, Tailwind, Playwright, TypeScript, etc.                     | Project-specific state                                     |
| Playwright MCP / Playwright CLI | Browser-based QA, navigation checks, console errors, layout review, accessibility-tree inspection                   | Static code review                                         |
| Lighthouse CI                   | Optional performance, accessibility, SEO, and best-practice regression checks                                       | Replacing manual design review                             |
| Vale                            | Optional prose and tone linting                                                                                     | Deciding factual content                                   |

## Recommended install: Claude Code

Run from the consumer-site repo root.

```bash
npm install -g @anthropic-ai/claude-code

claude mcp add --transport http vercel https://mcp.vercel.com
claude mcp add --transport http context7 https://mcp.context7.com/mcp
claude mcp add playwright -- npx @playwright/mcp@0.0.73
```

Use a **pinned** Playwright MCP version (update deliberately when you upgrade). Avoid `@latest` in committed configs or anything loaded on startup.

Then enable the Vercel plugin from the Claude Code plugin marketplace (`/plugins` → search "vercel").

Start Claude Code and authenticate MCP servers when prompted:

```bash
claude
/mcp
```

## Recommended install: Cursor

Copy the template into **gitignored** `.cursor/mcp.json` (Cursor reads [project `mcp.json` under `.cursor/`](https://cursor.com/docs/context/mcp); it does **not** use repo-root `.mcp.json`).

```bash
# In portfolio-engine (template lives under docs/):
cp docs/downstream/templates/agent/mcp.example.json .cursor/mcp.json

# In a consumer site that already has `.cursor/mcp.example.json` from the agent-tooling seed:
# cp .cursor/mcp.example.json .cursor/mcp.json
```

Then restart Cursor and authenticate any MCP servers that ask for OAuth.

If **Installed MCP Servers** shows entries as **Disabled**, turn each toggle **on** in **Settings → Features → Model Context Protocol**. Cursor keeps that enable/disable state in the app (not in `.cursor/mcp.json`); the JSON file only declares servers. Restart Cursor after changing `mcp.json`.

Install the Vercel plugin from the Cursor plugin marketplace.

## Windows note

If an `npx`-based MCP server fails in Cursor/VS Code on Windows, wrap it with `cmd /c`.

Example:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "cmd",
      "args": ["/c", "npx", "@playwright/mcp@0.0.73"]
    }
  }
}
```

## Where MCP config lives (avoid double-loading)

Different tools read **different files**. Putting the same stdio server in every file does **not** help; it can spawn extra processes and makes debugging harder.

| Host                          | File for this repo                                                                                       | Notes                                                                                                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cursor** (Agent / chat MCP) | **`.cursor/mcp.json`** only for this workspace                                                           | Optional global: `%USERPROFILE%\.cursor\mcp.json`. Cursor does **not** read repo-root `.mcp.json`.                                                         |
| **Claude Code** (CLI / panel) | **`%USERPROFILE%\.claude.json`** under your project path when using **`claude mcp add … --scope local`** | Team-shared alternative: repo-root `.mcp.json` (`--scope project`). `claude mcp list` spawns stdio from `.mcp.json` for health checks—keep that file lean. |
| **Other**                     | `%USERPROFILE%\.claude\mcp.json` may exist for separate entries                                          | Do not assume it is merged with Cursor’s config; treat it as Claude Code–side only.                                                                        |

For **portfolio-engine**, use **`.cursor/mcp.json`** for Cursor and **repo-root `.mcp.json`** (gitignored) for **Claude Code** project MCP, or `claude mcp add --scope local` only—avoid duplicating the same stdio server in both `.claude.json` and `.mcp.json` unless you intend to.

Committed reference template: [`docs/downstream/templates/agent/mcp.example.json`](templates/agent/mcp.example.json). **Do not commit** active `.mcp.json` or `.cursor/mcp.json` (both are in [`.gitignore`](../../.gitignore)); see **[`docs/contributing/gitignored-local-files.md`](../contributing/gitignored-local-files.md)**.

## Agent operating rules

### Documentation and package APIs

Use Context7 whenever implementing or changing package-specific code involving:

- Astro
- Vercel
- Tailwind
- Playwright
- TypeScript
- npm packages
- OAuth/auth libraries
- deployment adapters

Do not guess package APIs from memory when a current-docs tool is available.

### Deployment

Use the Vercel Plugin for implementation guidance:

- Astro/Vercel adapter setup
- build command conventions
- output directory conventions
- preview vs production behavior
- environment-variable workflow
- Vercel CLI guidance
- deployment documentation

Use Vercel MCP for live account/project state:

- deployment status
- build logs
- runtime logs
- domains
- project settings
- environment variable names
- protected preview URLs

Prefer read-only MCP operations first.

Do not change production Vercel settings, production branch, domains, or environment variables without explicit human confirmation.

### Visual QA

After meaningful UI changes, use Playwright MCP or Playwright CLI.

Check the routes that are active for this site (see `src/config/features.json` and `src/config/navigation.json`). Default routes are:

- homepage desktop
- homepage mobile
- navigation links
- `/work`
- `/writing`
- `/about`
- `/contact`
- `/admin` in local dev if admin tools are enabled
- browser console errors
- obvious overflow or clipping
- obvious color-contrast problems

Routes may be disabled or renamed in your site's configuration; only check routes that are active.

Do not claim a visual bug is fixed unless the site was inspected in a browser, or explicitly say the review was code-only.

### Content and tone

Before writing copy, read:

- `src/context/site-owner.json`, if present
- `src/context/brand-voice.json`, if present
- `src/context/agent-rules.md`, if present
- `src/docs/design-brief.md`, if present
- `src/docs/resume.md`, if present

Do not invent credentials, awards, jobs, publications, client names, degrees, or personal details.

Prefer concrete language over generic marketing language.

Avoid phrases like:

- cutting-edge
- world-class
- innovative solutions
- passionate about
- unlock value
- leverage synergies
- results-driven
- thought leader

### Local validation

Before considering work done:

```bash
pnpm check
pnpm build
```

If linting is configured:

```bash
pnpm lint
```

For upstream `portfolio-engine` work, use the upstream quality bar in `.github/copilot-instructions.md`.
