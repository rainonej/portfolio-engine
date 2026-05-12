import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Stage `client.d.ts` so the published package exposes it via
 *   /// <reference types="@portfolio-engine/engine-core/client" />
 *
 * IMPORTANT: the file must sit at the *package root* (sibling to `package.json`),
 * not nested under `dist/`. When TypeScript resolves a `<reference types>` to a
 * .d.ts file under a `dist/` subpath via `exports.types`, it marks the lookup as
 * `primary: false` and the `declare module 'X'` blocks inside fail to register
 * as ambient module declarations (downstream IDEs then surface
 * "Cannot find module '@portfolio-engine:config'" even though `astro check`
 * keeps passing because Vite resolves the virtual modules at build time).
 *
 * This mirrors Astro's own pattern (`node_modules/astro/client.d.ts` at root,
 * plain `"./client": "./client.d.ts"` in `exports`).
 */
const scriptDir = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(scriptDir, '..');
const dist = join(pkgRoot, 'dist');
mkdirSync(dist, { recursive: true });
const src = join(pkgRoot, 'src', 'client.d.ts');
copyFileSync(src, join(pkgRoot, 'client.d.ts'));
copyFileSync(src, join(dist, 'client.d.ts'));
