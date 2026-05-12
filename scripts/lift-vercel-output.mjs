/**
 * Lift the Astro Vercel adapter's Build Output API tree from
 * `examples/demo-site/.vercel/output/` (where `@astrojs/vercel` hard-codes
 * it, relative to the Astro project root) up to `<repo-root>/.vercel/output/`,
 * which is where Vercel's deployment runtime actually auto-detects the
 * Build Output API.
 *
 * Pointing Vercel at the nested path via `outputDirectory` does *not* work:
 * Vercel ignores the adapter-generated `config.json` and serves no routes
 * (every path returns a bare-text `NOT_FOUND`).
 *
 * Pure Node fs APIs — no shell utilities — so this works under Vercel's
 * Linux builders, local `vercel build` on Windows, and anywhere Node 18+
 * runs.
 */
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const repoRoot = process.cwd();
const src = resolve(repoRoot, 'examples/demo-site/.vercel/output');
const dest = resolve(repoRoot, '.vercel/output');

if (!existsSync(src)) {
  console.error(
    `[lift-vercel-output] source not found: ${src}\n` +
      `Did \`astro build\` run successfully under \`examples/demo-site\`?`,
  );
  process.exit(1);
}

mkdirSync(dirname(dest), { recursive: true });
rmSync(dest, { recursive: true, force: true });
renameSync(src, dest);

console.log(`[lift-vercel-output] moved ${src} -> ${dest}`);
