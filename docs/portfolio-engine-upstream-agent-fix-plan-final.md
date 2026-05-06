# Upstream Agent Plan — `rainonej/portfolio-engine`

## Mission

Fix the reusable engine/theme issues exposed by the live `jordan-site-kappa.vercel.app` audit. Do **not** hard-code Jordan-specific content upstream. The upstream work should make `@portfolio-engine/editorial-theme` and `@portfolio-engine/engine-core` more robust for all downstream sites, especially sites that mix:

- theme-injected routes,
- disabled/remapped theme routes,
- consumer-local registry routes under `src/pages-local`,
- ordinary Astro file routes under `src/pages`,
- package-based Tailwind/global CSS,
- structured profile/resume content.

The live Jordan site is now much better than the first audit suggested, but it exposed two reusable engine problems:

1. The top nav can render as glued text (`Jordan Rainone, PhDWorkResearch & IdeasHow I ThinkResumeContact`) when the expected flex/gap styling is not applied.
2. Route/deployment debugging is too opaque: the repo may have correct route disabling + local route registry, while production still appears to serve stale/default route content.

## External docs to keep in mind

- Astro pages/routing: `src/pages` files become endpoints through Astro’s file-based routing.  
  https://docs.astro.build/en/basics/astro-pages/
- Vercel deployments can be filtered/redeployed from the Deployments UI, and redeploy can choose whether to use the existing build cache.  
  https://vercel.com/docs/deployments/managing-deployments
- Vercel environment-variable changes apply only to new deployments.  
  https://vercel.com/docs/environment-variables

## Current upstream state observed during audit

The current engine has already improved a lot:

- `@portfolio-engine/editorial-theme` changelog says `0.3.1` added structured profile/typography work, a resume page, hero CTA improvements, Google Fonts provider handling, sanitized font fallback stacks, and review follow-ups.
- `engine-core` already loads consumer registry routes, applies route overrides/disables, builds consumer-local routes, checks theme/local collisions, injects active routes, writes `.portfolio-engine/manifest.json`, and emits a design snapshot.
- `editorial-theme` has a `Nav.astro` using Tailwind utility classes for `fixed`, `flex`, `gap-8`, etc.
- `Footer.astro` now hides Admin in production unless `PUBLIC_SHOW_ADMIN_LINK=true`.
- `profile-person.ts` now contains a better structured model with `shortBio`, `summary`, `longBio`, `values`, `workingPrinciples`, and `credentials`.

But the current upstream still needs hardening.

---

# P0 — Fix nav rendering robustness

## Problem

The live screenshot shows the nav rendered as glued text:

```text
Jordan Rainone, PhDWorkResearch & IdeasHow I ThinkResumeContact
```

That means the browser is not receiving or applying the intended layout rules for `Nav.astro`. The current upstream nav depends heavily on Tailwind utility classes in package source. That should work, but the downstream production screenshot proves we need a more defensive baseline.

## Required change

Add stable semantic classes/data attributes to `packages/editorial-theme/src/components/Nav.astro`, and add explicit non-Tailwind CSS rules in `packages/editorial-theme/src/styles/global.css`.

Do not rely only on Tailwind utilities for the nav’s structural layout.

### Proposed markup direction

In `Nav.astro`, keep Tailwind if desired, but add stable classes:

```astro
<header class="pe-site-header ...">
  <nav class="pe-site-nav ...">
    <a class="pe-site-brand ..." href={`${base}/`}>
      {config.site.title}
    </a>

    <ul class="pe-site-nav-list ...">
      {links.map(({ href, label }) => (
        <li class="pe-site-nav-item">
          <a class="pe-site-nav-link ..." href={href}>
            {label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
</header>
```

### Proposed CSS baseline

Add explicit CSS to `global.css`:

```css
.pe-site-header {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--warm-line);
  background: var(--paper);
}

.pe-site-nav {
  max-width: 64rem;
  min-height: 4rem;
  margin-inline: auto;
  padding-inline: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.pe-site-brand {
  white-space: nowrap;
  text-decoration: none;
}

.pe-site-nav-list {
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.pe-site-nav-link {
  text-decoration: none;
  white-space: nowrap;
}

@media (max-width: 720px) {
  .pe-site-nav {
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    padding-block: 0.75rem;
  }

  .pe-site-nav-list {
    flex-wrap: wrap;
    gap: 0.75rem 1rem;
  }
}
```

## Acceptance criteria

- On a production build of `examples/demo-site`, nav items are visibly separated even if Tailwind utilities fail to apply.
- On a downstream consumer build, nav does not collapse into glued inline text.
- Add a minimal visual/snapshot test or at least a fixture build that confirms `.pe-site-nav-list` CSS appears in the final CSS/HTML.
- No Jordan-specific names/content appear in upstream code.

---

# P0 — Add route/nav diagnostics so stale route ownership is obvious

## Problem

Downstream `jordan-site` can have:

- default theme route `/writing` disabled,
- local registry route `/writing` declared,
- nav item `/writing` visible,
- production still apparently serving old/default `/writing`.

The current engine has route injection and collision checks, but it does not make it easy enough for an agent/human to answer:

- Which route source owns `/writing`?
- Was the consumer registry loaded?
- Did a route come from theme, remap, local registry, or ordinary `src/pages`?
- Does nav point to an active route?
- Did a disabled route still appear somewhere?

## Required change

Improve `.portfolio-engine/manifest.json` and/or add a second diagnostic file.

### Add manifest fields

For each route entry, include:

```ts
{
  pattern: string;
  resolved: string;
  routeOrigin: "theme" | "consumer-local" | "consumer-pages" | "unknown";
  entrypoint: string;
  label?: string;
  visibility?: string;
}
```

If `routeOrigin` is absent today for theme routes, make it explicit as `"theme"`.

### Add build metadata

At top level:

```ts
{
  generatedAt: string;
  portfolioEngine: {
    engineCoreVersion: string;
    editorialThemeVersion: string;
  };
  consumerRegistry: {
    path: string;
    loaded: boolean;
    routeCount: number;
  };
  routeOverrides: {
    disabled: string[];
    remapped: Record<string, string>;
  };
}
```

### Add nav validation

After active routes are known, compare `config.navigation.items` to active routes.

Rules:

- External URLs are ignored.
- Hash-only links are ignored.
- Internal visible nav items must match:
  - an injected theme route,
  - a consumer-local route,
  - or an ordinary Astro route under `src/pages` if upstream can detect it.
- If the engine cannot confidently see ordinary `src/pages` routes, either:
  - add a documented `knownRoutes` option, or
  - warn that the nav item could not be verified rather than failing.
- In CI/production build, allow strict mode:
  ```js
  editorialTheme({
    diagnostics: {
      strictNavRoutes: true,
    },
  });
  ```

## Acceptance criteria

- A downstream build can inspect `.portfolio-engine/manifest.json` and immediately see whether `/about`, `/writing`, `/contact`, and `/resume` are theme, consumer-local, or ordinary Astro pages.
- A nav item pointing to a disabled theme route with no local replacement produces a clear warning or failure.
- The warning message tells the user exactly which config/registry/page file to check.
- Existing consumers without local routes continue to build.

---

# P1 — Update docs so the new route model is discoverable

## Problem

`packages/editorial-theme/README.md` still says:

> You write no page files yourself — every route comes from the theme.

That is now incomplete/misleading. The engine supports consumer-local pages via `src/pages-local` + registry. It also coexists with ordinary Astro `src/pages` file routes.

## Required change

Update:

- `packages/editorial-theme/README.md`
- `docs/downstream/consumption.md`
- `docs/downstream/custom-page-via-registry.md`

## Required content

Add a clear section:

```md
## Route ownership modes

Portfolio Engine supports three route ownership modes:

1. Theme-injected routes
   - `/`, `/work`, `/work/[slug]`, `/writing`, etc.
2. Consumer-local registry routes
   - declare in `src/registry/portfolio-engine.registry.json`
   - page files live under `src/pages-local`
   - useful for replacing a theme page while keeping the theme shell
3. Ordinary Astro file routes
   - page files under `src/pages`
   - Astro owns these via file-based routing
   - useful for fully custom pages like `src/pages/resume.astro`
```

Add a specific recipe:

```md
## Replacing a default theme page

To replace `/writing`:

1. Disable theme route in `astro.config.mjs`:
   routes: { "/writing": { enabled: false } }

2. Add registry route:
   {
   "pattern": "/writing",
   "page": "writing/index.astro",
   "label": "Research & Ideas",
   "visibility": "public"
   }

3. Add file:
   src/pages-local/writing/index.astro

4. Add or verify nav item:
   { "label": "Research & Ideas", "href": "/writing", "visible": true }

5. Build and inspect:
   .portfolio-engine/manifest.json
```

## Acceptance criteria

- No doc says “you write no page files yourself” without qualifying it.
- New route ownership model is clear to a downstream agent without reading engine source.
- Docs explain when to use `src/pages` vs `src/pages-local`.

---

# P1 — Formalize structured profile/resume schemas

## Problem

The type model in `profile-person.ts` is better, but consumers still frequently define loose `passthrough()` schemas or old minimal schemas with only `name`, `bio`, `photo`, `email`, etc. This allows mega-bio regressions and makes resume content inconsistent.

## Required change

Add exported Zod schemas in `@portfolio-engine/schema` for:

- `ProfilePersonSchema`
- `ProfileCvSchema`
- `ProfileExperienceSchema`
- `ProfileEducationSchema`
- `ProfileAwardSchema`
- `ValueCardSchema`
- `WorkingPrincipleSchema`

Then update:

- `examples/demo-site/src/content.config.ts`
- `packages/editorial-theme/README.md`
- `docs/downstream/consumption.md`

## Proposed fields

### `ProfilePerson`

```ts
{
  name: string;
  roleLine?: string;
  shortBio?: string;
  summary?: string;
  bio?: string; // legacy/deprecated
  longBio?: string[];
  values?: { title: string; body: string }[];
  workingPrinciples?: { title: string; body: string }[];
  credentials?: string[];
  email?: string;
  linkedin?: string;
  github?: string;
  photo?: string;
}
```

### `ProfileCv`

```ts
{
  selectedEvidence?: string[];
  technicalRange?: { heading: string; items: string[] }[];
  experience?: {
    organization: string;
    title: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
    highlights?: string[];
  }[];
  education?: ...;
  awards?: ...;
}
```

## Acceptance criteria

- Demo site uses the exported schemas rather than duplicating minimal local schemas.
- Docs tell downstream sites to prefer `shortBio`/`summary`/`longBio` over dumping everything into `bio`.
- The default hero never renders a multi-section bio wall.
- TypeScript exports remain stable.

---

# P1 — Improve default page copy and empty-state behavior

## Problem

The stale live Jordan `/writing` route shows education/curriculum copy. Even if that came from an old package or old content, upstream defaults should avoid domain-specific persona copy.

## Required change

Audit upstream default pages for copy that assumes a particular profession/persona.

Pages to check:

- `packages/editorial-theme/src/pages/writing/index.astro`
- `packages/editorial-theme/src/pages/about.astro`
- `packages/editorial-theme/src/pages/contact.astro`
- `packages/editorial-theme/src/pages/resume.astro`
- demo content under `examples/demo-site`

Default copy should be generic but professional:

- Writing: “Essays, notes, and selected thinking.”
- Contact: no “Booking coming soon.”
- Resume: no generic “selected strengths” derived from full bio.
- About: do not repeat the same hero copy unless no structured content exists.

## Acceptance criteria

- No hard-coded education/curriculum/teacher-development copy in upstream unless in demo content clearly labelled as demo.
- No public placeholder like “Booking coming soon.”
- Missing booking/scheduling config falls back to email/contact, not a placeholder.

---

# P1 — Make fallback initials visual-only and accessible

## Problem

Live project/writing cards showed fallback initials like `M`, `R`, `B`, `W`, `T`, `E`. These may be visual fallbacks, but they are confusing when surfaced as text.

## Required change

Update fallback image/initial components so initials are:

- `aria-hidden="true"` when decorative,
- not read as meaningful content by screen readers,
- optionally replaced by a generic gradient/card placeholder with no text.

If the letter is retained visually, wrap it in an element with `aria-hidden="true"` and ensure the card title is the accessible label.

## Acceptance criteria

- Lighthouse/axe does not treat fallback initials as meaningful unlabeled content.
- No user-visible single-letter badge appears without context unless intentionally decorative.
- Cards remain visually balanced when no image exists.

---

# P2 — Add `portfolio-engine doctor`

## Goal

Create a simple diagnostic command/script that downstream agents can run.

Example:

```bash
pnpm portfolio-engine doctor
```

or:

```bash
pnpm pe:doctor
```

Output should include:

```text
Portfolio Engine Doctor

Package versions:
- @portfolio-engine/editorial-theme: 0.3.1
- @portfolio-engine/engine-core: 0.2.2

Routes:
- /                  theme
- /work              theme
- /writing           consumer-local -> src/pages-local/writing/index.astro
- /about             consumer-local -> src/pages-local/about.astro
- /resume            consumer-pages -> src/pages/resume.astro
- /contact           consumer-local -> src/pages-local/contact.astro

Navigation:
- Work               OK -> /work
- Research & Ideas   OK -> /writing
- How I Think        OK -> /about
- Resume             OK -> /resume
- Contact            OK -> /contact

Potential issues:
- none
```

## Acceptance criteria

- Works after build using `.portfolio-engine/manifest.json`.
- Fails clearly if manifest is missing and instructs user to run `pnpm build`.
- Can detect nav links to unknown routes.
- Useful enough for downstream agents to debug without reading engine internals.

---

# Test plan

## Required local checks

```bash
pnpm install
pnpm build
pnpm check
pnpm lint
pnpm format
```

## Fixture/demo checks

- Build `examples/demo-site`.
- Add a fixture consumer with:
  - `/writing` disabled in route overrides,
  - `/writing` reintroduced via consumer registry,
  - `/resume` supplied via ordinary `src/pages/resume.astro`,
  - nav entries for all of the above.
- Confirm manifest route origins and nav validation.

## Browser/visual checks

At minimum, manually inspect:

- homepage nav spacing,
- mobile nav wrapping,
- default writing page,
- default contact page,
- resume page with and without `profile/cv`.

## Final acceptance checklist

- [ ] Nav cannot collapse into glued text even if Tailwind utility generation is partial.
- [ ] Manifest clearly shows route origin and entrypoint.
- [ ] Nav-vs-route diagnostics exist.
- [ ] Docs explain theme routes vs consumer-local routes vs ordinary Astro routes.
- [ ] Structured profile/resume schemas are exported and documented.
- [ ] Default copy is persona-neutral.
- [ ] Contact page has no placeholder booking language.
- [ ] Fallback initials are decorative/accessibility-safe.
- [ ] Demo/fixture builds pass.
