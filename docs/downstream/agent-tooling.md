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
claude mcp add playwright npx @playwright/mcp@latest

npx ctx7 setup
npx plugins add vercel/vercel-plugin
```

Then start Claude Code and authenticate MCP servers when prompted:

```bash
claude
/mcp
```

## Recommended install: Cursor

Copy:

```bash
cp .cursor/mcp.example.json .cursor/mcp.json
```

Then restart Cursor and authenticate any MCP servers that ask for OAuth.

Install Context7 and the Vercel Plugin:

```bash
npx ctx7 setup
npx plugins add vercel/vercel-plugin
```

## Windows note

If an `npx`-based MCP server fails in Cursor/VS Code on Windows, wrap it with `cmd /c`.

Example:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "cmd",
      "args": ["/c", "npx", "@playwright/mcp@latest"]
    }
  }
}
```

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
