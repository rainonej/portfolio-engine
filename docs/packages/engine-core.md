# @portfolio-engine/engine-core

The Astro integration at the heart of portfolio-engine.

## Responsibilities

- **Config loader + schema bridge** — reads and validates `config/site.json`, `config/navigation.json`, `config/theme.json`, `config/features.json` against `@portfolio-engine/schema` Zod schemas. Produces a typed `ResolvedConfig`.
- **Virtual modules** — exposes resolved config and build context to theme components via `@portfolio-engine:config`, `@portfolio-engine:context`, `@portfolio-engine:routes`, `@portfolio-engine:overrides`. Implemented with native Vite `resolveId`/`load` hooks.
- **Route discovery + injection** — scans the `editorial-theme` pages directory and injects routes via Astro's `injectRoute` hook.
- **Consumer registry (MVP)** — reads `src/registry/portfolio-engine.registry.json`, injects extra routes from `src/pages-local`, rejects URL collisions with theme routes, and records local routes in `.portfolio-engine/manifest.json`. See [../downstream/custom-page-via-registry.md](../downstream/custom-page-via-registry.md).
- **Route remap / enable / disable** — consumers can disable or remap individual routes via config.
- **Route registry** — exports a typed `RouteRegistry` covering all active (post-override) public + admin routes.
- **Override resolution** — resolves named component override surfaces declared by `editorial-theme`.
- **Type injection** — provides TypeScript types for all virtual modules.

## Non-goals (v1)

- Packaged `public/` directory assets (Task 3.9)
- Generic multi-theme support
- Content collection management — Astro's native content collections handle all content; `@portfolio-engine/admin-tools` handles editing
- Runtime API routes
- Arbitrary ecosystem plugin compatibility
- Multi-theme marketplace abstractions

## Integration entry point

Consumers never call engine-core directly. The public API is `editorialTheme()` from `@portfolio-engine/editorial-theme`. The theme mounts engine-core internally.

## Virtual modules

Implemented via native Vite `resolveId`/`load` plugin hooks. The `\0` prefix on resolved IDs is the Vite convention for virtual modules — it tells Vite not to look for the ID as a real file.

| Module ID                     | Export      | Type             | Contents                                                                                                                                                                                |
| ----------------------------- | ----------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@portfolio-engine:config`    | `config`    | `ResolvedConfig` | Validated site + navigation + theme + features config                                                                                                                                   |
| `@portfolio-engine:context`   | `context`   | `BuildContext`   | Env, mode, base URL                                                                                                                                                                     |
| `@portfolio-engine:routes`    | `routes`    | `RouteRegistry`  | Active route registry — editorial-theme routes after remap/disable **plus** consumer-local routes from the registry                                                                     |
| `@portfolio-engine:overrides` | `overrides` | `OverrideMap`    | Component override map (component name → absolute path). Reserved key `__styles__` holds a JSON-encoded `string[]` of absolute CSS paths to append after the theme's global stylesheet. |

Consumer packages (e.g. `editorial-theme`) get full TypeScript types automatically — the integration calls Astro's `injectTypes()` hook to inject a reference directive into the consumer's TypeScript environment. No manual setup is needed.

The plugin is created with `createVirtualModulesPlugin()` from `@portfolio-engine/engine-core` and passed to `updateConfig({ vite: { plugins: [...] } })` inside the `astro:config:setup` hook.

## Route registry shape

```typescript
interface RouteRecord {
  pattern: string; // e.g. /work/[slug]
  resolved: string; // actual injected path after any remap (equals pattern when not remapped)
  label: string; // human-readable
  section: string | null; // nav group
  visibility: 'public' | 'admin-only' | 'hidden';
  remappable: boolean;
  disableable: boolean;
}
```

## Config files

Engine-core reads only `config/*.json` files. Content files (`content/`) are Astro content collections territory — not engine-core's concern.

| File                     | Schema                   | Notes                                                    |
| ------------------------ | ------------------------ | -------------------------------------------------------- |
| `config/site.json`       | `SiteConfigSchema`       | Title, description, base URL, social links               |
| `config/navigation.json` | `NavigationConfigSchema` | Nav items, order, visibility                             |
| `config/theme.json`      | `ThemeConfigSchema`      | Typography, color, layout preferences                    |
| `config/features.json`   | `FeaturesConfigSchema`   | Feature flags (blog enabled, testimonials enabled, etc.) |

## Implementation

Part of Epic 3 (Tasks 3.1–3.9). See [../../packages/engine-core/](../../packages/engine-core/).
