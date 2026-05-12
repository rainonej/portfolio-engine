# What this folder controls

This folder contains the shared data shapes (schemas) used across all packages.

Schemas define what fields are required or optional in each config file, content entry, or registry entry, and what values are allowed. They are written with [Zod](https://zod.dev) so errors are caught at startup, not at runtime.

## What each file defines

| File                  | What it describes                                                   |
|-----------------------|---------------------------------------------------------------------|
| `index.ts`            | Exports everything — start here if you are looking for a type       |
| `registry.ts`         | Shape of the theme route registry and override surface entries      |
| `consumer-registry.ts`| Shape of the downstream site's custom screen registry file          |
| `profile.ts`          | Shape of the `content/profile/` data (person, CV, experience, etc.) |
| `theme-config.ts`     | Shape of `config/theme.json` (colors, fonts)                        |
| `design-resolve.ts`   | Helpers for resolving design token values from theme config         |
