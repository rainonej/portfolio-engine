# @portfolio-engine/engine-core

The Astro integration at the heart of portfolio-engine. Consumed internally by `@portfolio-engine/editorial-theme` — consumers never import this package directly.

## Integration entry point

Consumers call `editorialTheme()` only. Engine-core is mounted internally by the theme:

```js
// astro.config.mjs — what the consumer writes
import { editorialTheme } from '@portfolio-engine/editorial-theme';
export default defineConfig({
  integrations: [
    editorialTheme({
      siteConfig: './config/site.json',
      navigationConfig: './config/navigation.json',
      themeConfig: './config/theme.json',
      featuresConfig: './config/features.json',
    }),
  ],
});
```

Engine-core is an implementation detail of the theme. Its internal API is not public.

## Responsibilities

### Config loader + schema bridge

Reads and validates the consumer's JSON config files against `@portfolio-engine/schema` Zod schemas. Produces a typed `ResolvedConfig` object.

| File | Schema |
|------|--------|
| `config/site.json` | `SiteConfigSchema` |
| `config/navigation.json` | `NavigationConfigSchema` |
| `config/theme.json` | `ThemeConfigSchema` |
| `config/features.json` | `FeaturesConfigSchema` |

Content files (`content/profile/person.json`, blog posts, testimonials, etc.) are **not** read by engine-core. They are handled by Astro's content collections and edited via `@portfolio-engine/admin-tools`.

### Virtual modules

Exposes resolved config and build context to theme components without filesystem coupling. Implemented via native Vite `resolveId`/`load` plugin hooks — no third-party virtual module library is used.

| Module ID | Contents |
|-----------|----------|
| `@portfolio-engine:config` | Resolved site + navigation + theme + features config |
| `@portfolio-engine:context` | Build-time context (env, mode, base URL) |
| `@portfolio-engine:routes` | Queryable route registry (`RouteRecord[]`) |
| `@portfolio-engine:overrides` | Resolved override map (component → downstream path) |

### Route discovery + injection

Scans the `editorial-theme` package's pages directory and injects those routes into the consumer project via Astro's `injectRoute` integration hook.

### Route remap / enable / disable

Consumers can disable or remap individual routes via config. Semantics defined in Task 3.5.

### Route registry

Typed, queryable list of all registered public + admin routes.

```typescript
interface RouteRecord {
  pattern: string;           // e.g. /work/[slug]
  label: string;             // human-readable
  section: string | null;    // nav group
  visibility: 'public' | 'admin-only' | 'hidden';
  remappable: boolean;
  disableable: boolean;
}
```

Routes registered in v1:

| Pattern | Label | Visibility |
|---------|-------|------------|
| `/` | Home | public |
| `/about` | About | public |
| `/work` | Work | public |
| `/work/[slug]` | Work detail | hidden |
| `/writing` | Writing | public |
| `/writing/[slug]` | Writing detail | hidden |
| `/contact` | Contact | public |
| `/admin` | Admin | admin-only |

API routes (`/api/auth/*`) are excluded — they are infrastructure, not site routes.

### Override resolution

Resolves named override surfaces: consumer-provided components take precedence over theme defaults. Override surfaces are declared and named by `editorial-theme`.

### Type injection

Provides TypeScript types for all virtual modules so theme and consumer code has full type coverage with no `any`.

## Non-goals (v1)

- **Packaged `public/` directory assets** — static assets are managed by the consumer (see v1 constraints below)
- **Generic multi-theme support** — engine-core is first-party, built for one theme
- **Content collection management** — Astro's native content collections handle all content files
- **Runtime API routes** — out of scope
- **Arbitrary ecosystem plugin compatibility**
- **Multi-theme marketplace abstractions**

## v1 Constraints

### No packaged `public/` directory

Theme packages use **imported assets only**. No `public/` directory is shipped inside any package.

| Asset type | Location | How it works |
|---|---|---|
| Theme CSS, fonts, inline SVGs | Imported inside theme components | Bundled by Vite at build time |
| Site media (photos, project images) | `agreni-site/public/media/` | Served by Astro from consumer's public dir |
| Theme-owned decorative assets | Imported inside theme components | Not placed in any `public/` dir |

**Why:** Packaged `public/` directory merging requires `astro-public` or equivalent hacks. `astro-public` is not an approved dependency. This is a deliberate v1 non-goal.

**Enforced by:** No `public/` directories are allowed inside any `packages/` subdirectory. CI will fail if one is introduced (see `docs/architecture/README.md`).

If this constraint needs to be revisited, open a new issue referencing this decision (Task 3.9 — #208).

## Implementation

Epic 3 tasks: 3.1–3.9. See [`docs/packages/engine-core.md`](../../docs/packages/engine-core.md) for architecture detail.
