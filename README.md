# portfolio-engine

A first-party Astro engine for building personal portfolio sites. Opinionated, not generic — built for one downstream consumer (`agreni-site`) and open-sourced so the design decisions are transparent.

## Four-Layer Model

```
┌─────────────────────────────────────────────────────────┐
│  Consumer site (agreni-site)                            │
│  Content, config, overrides — private                   │
├─────────────────────────────────────────────────────────┤
│  @portfolio-engine/editorial-theme                      │
│  Layouts, components, routes, styles                    │
├─────────────────────────────────────────────────────────┤
│  @portfolio-engine/engine-core                          │
│  Config loader, virtual modules, route registry,        │
│  override resolution                                    │
├─────────────────────────────────────────────────────────┤
│  @portfolio-engine/schema                               │
│  Shared Zod schemas for content + config                │
└─────────────────────────────────────────────────────────┘
```

## Packages

| Package | Description |
|---------|-------------|
| [`@portfolio-engine/engine-core`](packages/engine-core/) | Route registry, config loader, virtual modules, override resolution |
| [`@portfolio-engine/editorial-theme`](packages/editorial-theme/) | The Astro theme: layouts, components, page routes |
| [`@portfolio-engine/schema`](packages/schema/) | Shared Zod schemas for content and configuration |
| [`@portfolio-engine/admin-tools`](packages/admin-tools/) | Admin/reviewer UI, site map from route registry *(Epic 7)* |
| [`@portfolio-engine/workflow-kit`](packages/workflow-kit/) | Reusable GitHub workflows and AI change classifier *(Epic 8)* |

## Consuming the theme

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import { editorialTheme } from "@portfolio-engine/editorial-theme";

export default defineConfig({
  integrations: [
    editorialTheme({
      config: "./config/site.json",
    }),
  ],
});
```

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup and the dual-mode workflow.

## Status

Under active development. Packages are not yet published to npm.

## Consumer repos

- [`agreni-site`](https://github.com/rainonej/agreni-site) (private) — reference downstream consumer
