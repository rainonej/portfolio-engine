# Linting and formatting

## ESLint

Runs on all TypeScript source files.

```bash
pnpm lint        # Check for lint errors
pnpm lint:fix    # Auto-fix lint errors where possible
```

Configuration: [`eslint.config.mjs`](../../eslint.config.mjs) at the monorepo root.

## Prettier

Runs on Markdown, JSON, YAML, and `.mjs` files. TypeScript (`.ts`) files are not covered by Prettier in this repo — ESLint handles lint rules only, not formatting, for those files.

```bash
pnpm format        # Check formatting
pnpm format:write  # Auto-fix formatting
```

Configuration: [`.prettierrc`](../../.prettierrc) and [`.prettierignore`](../../.prettierignore) at the monorepo root.

## CI enforcement

Lint and Prettier run first in CI, then **`pnpm check`** (builds all `packages/*`, then recursive typecheck / `astro check`), then a full **`pnpm build`**, **`pnpm --filter node-ssr-demo run build`**, and **`pnpm smoke:packed`** (packed tarball install smoke test). CI uses **Node 24** and **pnpm 10** (see [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)).

Fix locally before pushing:

```bash
pnpm lint:fix && pnpm format:write
```

For a full CI-like run locally (needs Node 24+ for a clean match with `engines`):

```bash
pnpm check
pnpm build
pnpm smoke:packed
```

On **Windows**, `pnpm smoke:packed` still validates **`astro check`** against packed tarballs but **skips `astro build`** (Vercel symlink limitation); use **WSL or CI** for the full build step inside smoke.
