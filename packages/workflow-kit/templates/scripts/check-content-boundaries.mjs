#!/usr/bin/env node
/**
 * Check that content has not leaked into route or template files.
 *
 * Heuristics — not exhaustive, but catches the most common violations:
 * 1. Long string literals in src/pages-local/**\/*.astro
 * 2. Inline arrays of content strings in route files
 * 3. Direct content collection imports in template/route files
 * 4. Hard-coded fallback authored copy (?? 'some text') in route files
 *
 * Copy this script to scripts/check-content-boundaries.mjs in your downstream repo.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const PAGES_LOCAL = join(ROOT, 'src', 'pages-local');
const OVERRIDES = join(ROOT, 'src', 'overrides');

const violations = [];

function walk(dir, cb) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

function check(filePath) {
  if (!filePath.endsWith('.astro')) return;
  const src = readFileSync(filePath, 'utf8');
  const rel = relative(ROOT, filePath);
  const lines = src.split('\n');

  lines.forEach((line, i) => {
    const lineNum = i + 1;

    // 1. Long string literals that look like authored copy (40+ chars)
    const stringMatches = line.matchAll(/"([^"]{40,})"|'([^']{40,})'/g);
    for (const m of stringMatches) {
      const str = m[1] ?? m[2];
      // Ignore import paths, class lists, URL strings
      if (/^[@./]|tailwind|class|href|src|url/i.test(str)) continue;
      violations.push({
        file: rel,
        line: lineNum,
        rule: 'long-string',
        detail: `"${str.slice(0, 60)}…"`,
      });
    }

    // 2. Inline arrays of content strings (e.g. const items = ['a', 'b', 'c'])
    if (/\[['"]/.test(line) && !/import|from|require/.test(line)) {
      violations.push({
        file: rel,
        line: lineNum,
        rule: 'inline-array',
        detail: line.trim().slice(0, 80),
      });
    }

    // 3. Direct content collection access in route files (should go through a model)
    if (/getCollection\(|getEntry\(/.test(line) && filePath.includes('pages-local')) {
      violations.push({
        file: rel,
        line: lineNum,
        rule: 'direct-collection',
        detail: 'getCollection/getEntry in route file — use a model loader',
      });
    }

    // 4. Fallback authored copy (?? 'non-empty string')
    const fallbackMatch = line.match(/\?\?\s*['"]([^'"]{5,})['"]/);
    if (fallbackMatch) {
      violations.push({
        file: rel,
        line: lineNum,
        rule: 'authored-fallback',
        detail: `?? '${fallbackMatch[1].slice(0, 50)}'`,
      });
    }
  });
}

walk(PAGES_LOCAL, check);
walk(OVERRIDES, check);

if (violations.length === 0) {
  console.log('check-content-boundaries: no violations found.');
  process.exit(0);
}

console.error(`check-content-boundaries: ${violations.length} violation(s) found.\n`);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  [${v.rule}]  ${v.detail}`);
}
process.exit(1);
