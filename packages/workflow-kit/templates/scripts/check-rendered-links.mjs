#!/usr/bin/env node
/**
 * Check rendered HTML for stale internal links and placeholder content.
 *
 * Run after `pnpm build`. Reads HTML files from the dist/ directory.
 *
 * Checks:
 * - All internal href values resolve to a file in dist/
 * - No placeholder strings appear in public HTML
 * - No stale /work/ or /writing/ links if those routes were renamed
 *
 * Copy this script to scripts/check-rendered-links.mjs in your downstream repo.
 * Edit RENAMED_ROUTES and PLACEHOLDER_STRINGS to match your site.
 *
 * Usage: node scripts/check-rendered-links.mjs [--dist=dist] [--warn-only]
 *
 * --warn-only  Downgrade dead-link findings to warnings (exits 0) instead of
 *              failing the build. Useful during initial adoption or when
 *              external links are expected to be temporarily unavailable.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, process.argv.find((a) => a.startsWith('--dist='))?.slice(7) ?? 'dist');
const WARN_ONLY = process.argv.includes('--warn-only');

// Routes that were renamed in this downstream site.
// Format: ['/old-route', '/new-route']
// If you renamed /work to /projects, add ['/work', '/projects'].
const RENAMED_ROUTES = [
  // ['/work', '/projects'],
];

// Strings that must not appear in public HTML.
const PLACEHOLDER_STRINGS = [
  'TODO',
  'PLACEHOLDER',
  'Lorem ipsum',
  'Your Name Here',
  'example@example.com',
];

if (!existsSync(DIST)) {
  console.error(`check-rendered-links: dist directory not found at ${DIST}. Run pnpm build first.`);
  process.exit(1);
}

const htmlFiles = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (entry.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(DIST);

const errors = [];
const warnings = [];

for (const htmlFile of htmlFiles) {
  const src = readFileSync(htmlFile, 'utf8');
  const rel = relative(ROOT, htmlFile);

  // Check for stale renamed routes
  for (const [oldRoute] of RENAMED_ROUTES) {
    const pattern = new RegExp(`href=["']${oldRoute}["'/]`);
    if (pattern.test(src)) {
      errors.push(`  ${rel}  [stale-route]  Found href to "${oldRoute}" which was renamed`);
    }
  }

  // Check for placeholder strings
  for (const placeholder of PLACEHOLDER_STRINGS) {
    if (src.includes(placeholder)) {
      warnings.push(`  ${rel}  [placeholder]  Found "${placeholder}" in rendered HTML`);
    }
  }

  // Check internal hrefs resolve
  const hrefMatches = src.matchAll(/href="(\/[^"#?]+)"/g);
  for (const m of hrefMatches) {
    const href = m[1];
    const candidate1 = join(DIST, href, 'index.html');
    const candidate2 = join(DIST, href.replace(/\/$/, '') + '.html');
    const candidate3 = join(DIST, href);
    if (!existsSync(candidate1) && !existsSync(candidate2) && !existsSync(candidate3)) {
      const msg = `  ${rel}  [dead-link]  href="${href}" does not resolve in dist/`;
      if (WARN_ONLY) warnings.push(msg);
      else errors.push(msg);
    }
  }
}

let exitCode = 0;

if (errors.length > 0) {
  console.error(`check-rendered-links: ${errors.length} error(s):\n`);
  errors.forEach((e) => console.error(e));
  exitCode = 1;
}

if (warnings.length > 0) {
  console.warn(`\ncheck-rendered-links: ${warnings.length} warning(s):\n`);
  warnings.forEach((w) => console.warn(w));
}

if (errors.length === 0 && warnings.length === 0) {
  console.log(`check-rendered-links: no issues found (checked ${htmlFiles.length} HTML files).`);
}

process.exit(exitCode);
