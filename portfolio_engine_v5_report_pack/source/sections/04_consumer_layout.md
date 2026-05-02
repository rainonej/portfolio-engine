# Target Consumer Repo Layout

```text
agreni-site/
  README.md                     # human-facing site repo overview
  AGENTS.md                     # thin agent rules: use MCP tools, respect layers
  .mcp.json                     # Claude MCP config pointing to installed workflow-kit server
  package.json                  # Astro/npm dependencies and scripts
  pnpm-lock.yaml                # JS dependency lockfile
  astro.config.mjs              # wires site to @portfolio-engine/editorial-theme
  tsconfig.json                 # TypeScript/editor config
  .gitignore

  src/
    README.md                   # explains editable source layers

    config/
      README.md
      site.json                 # site title, baseUrl, SEO/default owner display
      navigation.json           # nav items, order, visibility
      theme.json                # colors, fonts, typography, layout preferences
      features.json             # feature flags and section controls

    content/
      README.md
      profile/
        person.json             # rendered profile facts
        cv.json                 # education, experience, awards, publications
      writing/
        retro-games.md          # essay/blog/memo content
      projects/
        sample-project.md       # project/case study content
      testimonials/
        testimonials.json

    context/
      README.md
      site-owner.json           # structured owner goals/audience/positioning
      brand-voice.json          # structured tone/style/visual direction
      agent-rules.md            # consumer-specific instructions for agents

    registry/
      README.md
      portfolio-engine.registry.ts  # local extension declarations, post-MVP

    overrides/
      README.md
      Hero.astro                # replacement for named Hero surface
      custom.css                # CSS appended after theme global CSS

    components/
      README.md
      embeds/
        FramedYouTube.astro     # local reusable component used by registry/overrides/pages
        SnakeGame.astro

    pages-local/
      README.md
      ReadingRoomPage.astro     # whole local page registered in registry
      TestimonialsPage.astro

  public/
    README.md                   # explains public asset serving
    media/
      headshot.jpg              # referenced as /media/headshot.jpg
      resume.pdf                # referenced as /media/resume.pdf
      project-images/

  .portfolio-engine/
    README.md
    manifest.json               # generated capabilities/path snapshot
    state.json                  # tool state
    upstream-tracking.json      # upstream issue/PR blockers
    patch-ledger.json           # temporary package patch ledger
```

## Why `public/` stays top-level

Astro serves files in `public/` directly from the site root. A file at `public/media/headshot.jpg` is referenced as `/media/headshot.jpg`. Keeping `public/` top-level avoids fighting web framework conventions.

## Why config moves under `src/`

Top-level `config/` can be confused with editor/workspace/tool config. `src/config` makes clear this is website source data. It also makes config and content siblings.

## Why `.portfolio-engine` is separate

`.portfolio-engine` is generated/tooling state, not rendered site content and not human-authored brand context.
