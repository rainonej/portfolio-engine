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

Both checks run as the first CI job (before typecheck and build), so a formatting or lint failure blocks the whole pipeline fast. Fix locally before pushing:

```bash
pnpm lint:fix && pnpm format:write
```
