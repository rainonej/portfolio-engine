# node-ssr-demo

**SSR reference** for portfolio-engine: same content and theme wiring as [`demo-site`](../demo-site/), but uses **`@astrojs/node`** with **`output: 'server'`** instead of static + `@astrojs/vercel`.

Use this when you want a **standalone Node** deployment (Docker, custom VPS) or to debug SSR-only behavior. For **Vercel** and the recommended downstream path, use **`demo-site`** (`output: 'static'` + `@astrojs/vercel`).

## Prerequisites

From the monorepo root: Node **≥ 24**, **pnpm ≥ 10** (see root [`package.json`](../../package.json) `engines`).

## Commands

```bash
cd portfolio-engine
pnpm install
pnpm --filter node-ssr-demo run check
pnpm --filter node-ssr-demo run build
pnpm --filter node-ssr-demo dev
```

Workspace packages must be built first (root `pnpm check` runs `pnpm --filter "./packages/*" run build` before checks).
