# Target Upstream Repo Layout

```text
portfolio-engine/
  README.md                     # public project overview, required vs optional packages, quick start
  CONTRIBUTING.md                # branch flow, changesets, local linking, review rules
  AGENTS.md                      # public agent instructions for contributors working in upstream repo
  CLAUDE.md                      # thin pointer to AGENTS.md plus Claude-specific notes
  LICENSE                        # open-source license
  GOVERNANCE.md                  # maintainer and contribution model
  AI_USAGE.md                    # rules for AI-assisted contributions
  SECURITY.md                    # vulnerability/private issue reporting
  CITATION.cff                   # citation metadata
  NOTICE                         # attribution/notice file if needed
  package.json                   # workspace scripts and Node tooling
  pnpm-workspace.yaml            # includes packages/* and examples/*
  pnpm-lock.yaml                 # exact JS dependency lockfile

  .github/
    workflows/                   # CI, branch checks, optional automation
    ISSUE_TEMPLATE/              # feature/bug/patch/downstream-origin templates
    pull_request_template.md     # layer, AI, privacy, changeset checklist
    copilot-instructions.md      # Copilot wrapper pointing to AGENTS.md

  docs/
    architecture/
      layer-boundaries.md        # canonical layer definitions
      downstream-consumer-model.md
      extension-registries.md
      workflow-kit-mcp.md
      dependency-graph.md
    packages/
      schema.md
      engine-core.md
      editorial-theme.md
      admin-tools.md
      workflow-kit.md
    issue-labels.md
    project-management.md

  packages/
    schema/                      # REQUIRED runtime package
      package.json
      src/
        config.ts                # schemas for src/config/*.json
        content.ts               # schemas for content collections
        context.ts               # schemas for structured site-owner/brand context
        registry.ts              # future schemas for consumer registry
        index.ts

    engine-core/                 # REQUIRED runtime package
      package.json
      src/
        integration.ts           # Astro integration internals
        config-loader.ts         # loads/validates config paths
        route-discovery.ts       # route injection/discovery
        override-resolution.ts   # component/style override resolution
        manifest.ts              # generates .portfolio-engine/manifest.json
        virtual-modules.ts       # exposes @portfolio-engine:* modules
        types.ts

    editorial-theme/             # REQUIRED runtime package
      package.json
      src/
        index.ts                 # public exports
        integration.ts           # editorialTheme(...)
        registry/
          routes.ts              # built-in route metadata
          override-surfaces.ts   # supported override surfaces and props
        layouts/
        pages/
        components/
        styles/

    admin-tools/                 # OPTIONAL UI package
      package.json
      src/
        pages/
        components/
        editors/
        schemas/

    workflow-kit/                # OPTIONAL Python/MCP package
      pyproject.toml
      README.md
      tools/
        inspect_site.py
        plan_request.py
        validate_plan.py
        plan_upstream.py
        patch_ledger.py
      mcp_server.py

  examples/
    demo-site/                   # reference consumer and showcase
      src/
        config/
        content/
        context/
        registry/
        overrides/
        components/
        pages-local/
      public/
      .portfolio-engine/
```

## Key boundary rules

`engine-core` must not import `editorial-theme`. The dependency direction is schema → engine-core → editorial-theme.

`workflow-kit` must not be needed to render the site. It is optional Python/MCP tooling.

`admin-tools` must also be optional. It is UI for editing, not runtime rendering infrastructure.
