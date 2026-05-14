#!/usr/bin/env node
/**
 * Wrapper around Knip for downstream Portfolio Engine repos.
 *
 * Knip checks for unused files, exports, and dependencies.
 * This wrapper provides a conservative starter config so it
 * does not produce too many false positives in Astro projects.
 *
 * Prerequisites: pnpm add -D knip
 *
 * Usage: node scripts/check-unused.mjs
 *
 * Copy this script to scripts/check-unused.mjs in your downstream repo.
 * Edit KNIP_CONFIG as needed for your project.
 */

import { execSync } from 'node:child_process';
import { writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const KNIP_CONFIG_PATH = join(ROOT, '.knip-temp.json');

// Conservative starter config for Astro + Portfolio Engine projects.
// Astro pages and content.config.ts are treated as entry points.
// node_modules and dist are excluded.
const KNIP_CONFIG = {
  entry: [
    'astro.config.mjs',
    'src/content.config.ts',
    'src/pages-local/**/*.astro',
    'src/overrides/**/*.astro',
    'scripts/**/*.mjs',
  ],
  project: ['src/**/*.{ts,mjs,astro}', 'scripts/**/*.mjs'],
  ignore: ['src/env.d.ts', '**/*.d.ts'],
  ignoreDependencies: [
    // Astro peer deps loaded by the framework
    '@astrojs/check',
    'astro',
    'typescript',
  ],
  ignoreExportsUsedInFile: true,
};

let tempFileCreated = false;

try {
  // Write temp config so we don't conflict with any existing knip.json
  writeFileSync(KNIP_CONFIG_PATH, JSON.stringify(KNIP_CONFIG, null, 2));
  tempFileCreated = true;

  execSync(`npx knip --config ${KNIP_CONFIG_PATH}`, { stdio: 'inherit', cwd: ROOT });
  console.log('check-unused: no unused files or exports found.');
} catch {
  // Knip exits non-zero when it finds issues; output is already printed
  process.exit(1);
} finally {
  if (tempFileCreated && existsSync(KNIP_CONFIG_PATH)) {
    unlinkSync(KNIP_CONFIG_PATH);
  }
}
