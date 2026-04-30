
# Target Architecture

## Big picture goals, in priority order

### Goal 1 — Reusable portfolio-site backbone

Build an open-source backbone for multiple personal/portfolio/editorial websites.

### Goal 2 — Nontechnical and vibe-coder usability

A consumer should be able to create and edit a site without understanding Astro internals.

### Goal 3 — AI-agent-native workflow

Claude/Copilot should use MCP tools to inspect, plan, validate, and escalate changes.

### Goal 4 — Consumer-to-contributor feedback loop

Consumers are potential contributors. When local levers are insufficient, their agents can create upstream issues or PRs against the shared engine.

### Goal 5 — Maintainer-safe open source

The project should welcome AI-assisted contributions while preventing private data leaks and consumer-specific hacks.

## Target upstream repo structure

```text
portfolio-engine/
  README.md
  CONTRIBUTING.md
  AGENTS.md
  CLAUDE.md
  package.json
  pnpm-workspace.yaml
  pnpm-lock.yaml

  docs/
    architecture/
      layer-boundaries.md
      downstream-consumer-model.md
      extension-registries.md
      workflow-kit-mcp.md

  packages/
    schema/               # npm/TypeScript package
    engine-core/          # npm/TypeScript/Astro integration package
    editorial-theme/      # npm/Astro/TypeScript theme package
    admin-tools/          # npm/Astro/TypeScript package, deferred
    workflow-kit/         # Python/MCP package
      pyproject.toml
      tools/
        inspect_site.py
        plan_request.py
        validate_plan.py
        plan_upstream.py
        patch_ledger.py
      mcp_server.py
      README.md

  examples/
    demo-site/
      src/config/
      src/content/
      src/context/
      src/registry/
      src/overrides/
      src/components/
      src/pages-local/
      public/
      .portfolio-engine/
```

## Target consumer repo structure

```text
agreni-site/
  README.md
  AGENTS.md
  .mcp.json
  package.json
  pnpm-lock.yaml
  astro.config.mjs
  tsconfig.json
  .gitignore

  src/
    README.md
    config/
      README.md
      site.json
      navigation.json
      theme.json
      features.json
    content/
      README.md
      profile/
        person.json
        cv.json
      writing/
        retro-games.md
      projects/
        sample-project.md
      testimonials/
        testimonials.json
    context/
      README.md
      site-owner.json
      brand-voice.json
      agent-rules.md
    registry/
      README.md
      portfolio-engine.registry.ts
    overrides/
      README.md
      Hero.astro
      custom.css
    components/
      README.md
      embeds/
        FramedYouTube.astro
        SnakeGame.astro
    pages-local/
      README.md
      ReadingRoomPage.astro
      TestimonialsPage.astro

  public/
    README.md
    media/
      headshot.jpg
      resume.pdf
      project-images/

  .portfolio-engine/
    README.md
    manifest.json
    state.json
    upstream-tracking.json
    patch-ledger.json
```

## Consumer repo folder meanings

- `src/config`: site-wide settings.
- `src/content`: rendered website content.
- `src/context`: site-owner/brand/agent context.
- `src/registry`: local extension declarations.
- `src/overrides`: supported theme-surface replacements and custom CSS.
- `src/components`: local reusable UI components.
- `src/pages-local`: local pages with their own URLs.
- `public`: public static assets served from site root.
- `.portfolio-engine`: generated/tool state.
