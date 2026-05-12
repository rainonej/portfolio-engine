# What this folder controls

This folder contains the internal machinery that makes the theme work.

Downstream sites and theme authors do not import from this package directly. Everything a consumer needs is re-exported through `@portfolio-engine/editorial-theme`.

## What each file does

| File                      | What it handles                                                         |
|---------------------------|-------------------------------------------------------------------------|
| `config-loader.ts`        | Reads and validates `config/*.json` files from the downstream site      |
| `virtual-modules.ts`      | Makes config and overrides available to Astro pages as virtual imports  |
| `integration.ts`          | The Astro integration entry point — wires config, routes, and overrides |
| `route-discovery.ts`      | Finds theme pages at build time                                         |
| `route-remap.ts`          | Applies route overrides from the downstream registry                    |
| `consumer-local-routes.ts`| Reads the downstream site's custom screen registry                      |
| `override-resolution.ts`  | Resolves which component (theme default or downstream override) to use  |
| `manifest.ts`             | Builds the engine manifest used by admin tools                          |
| `types.ts`                | Shared internal TypeScript types                                        |
| `doctor.ts`               | Diagnostic checks run at dev-server startup                             |
