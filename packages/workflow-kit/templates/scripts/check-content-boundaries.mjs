#!/usr/bin/env node
/**
 * Check that content has not leaked into route or template files.
 *
 * Heuristics — not exhaustive, but catches the most common violations:
 * 1. Long prose-like string literals in checked directories
 * 2. Inline arrays of content strings in route files
 * 3. Hard-coded fallback authored copy (?? 'some text') in route files
 *
 * NOTE: getCollection/getEntry in route files is intentional for the thin-host
 * pattern (route loads data, passes to template). This script does NOT flag it.
 *
 * Copy this script to scripts/check-content-boundaries.mjs in your downstream repo.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();

// Scan these directories for boundary violations.
// Expand or trim to match your project structure.
const TARGET_DIRS = [
  join(ROOT, 'src', 'pages-local'),
  join(ROOT, 'src', 'pages'),
  join(ROOT, 'src', 'templates'),
  join(ROOT, 'src', 'components'),
  join(ROOT, 'src', 'overrides'),
];

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

/**
 * Return true when a string literal looks like authored prose (not code/config).
 * False positives to exclude:
 *   - import paths and module specifiers
 *   - absolute URLs (https://, http://)
 *   - Tailwind utility class lists: if ≥65% of space-separated tokens contain
 *     CSS-utility signals (hyphens, bracket notation, pseudo-class colons) the
 *     string is almost certainly a class attribute, not prose — even when tokens
 *     include complex values like var(--color-…), color-mix(…), or percentages.
 *   - Single-token CSS expressions (complex arbitrary Tailwind values)
 *   - Error/guard messages referencing file paths
 *   - TypeScript template literal types and code patterns
 */
function looksLikeAuthoredCopy(str) {
  if (str.length < 40) return false;
  // Import paths, relative paths, module specifiers
  if (/^[@./]/.test(str)) return false;
  // Absolute URLs
  if (/^https?:\/\//.test(str)) return false;
  // Error guards referencing source file paths (e.g. "vision.astro: required")
  if (/\.(astro|yaml|json|ts|mjs):/.test(str)) return false;
  // Content-boundary script itself, technical identifiers
  if (/getCollection|getEntry|defineCollection|astro:content/.test(str)) return false;
  // CSS utility class lists: check what fraction of space-separated tokens carry
  // CSS signals (hyphen, bracket notation, or variant colon). Tailwind strings
  // are almost entirely composed of such tokens; prose strings are not.
  const tokens = str.split(' ');
  if (tokens.length >= 2) {
    const cssLike = tokens.filter((t) => /[-[:]/.test(t)).length;
    if (cssLike / tokens.length >= 0.65) return false;
  }
  // Single-token CSS expression (e.g. bg-[color-mix(in_srgb,var(--…)_15%,…)])
  if (tokens.length === 1 && /^[\w/[\]:!.()\-,%#_]+$/.test(str)) return false;
  return true;
}

function check(filePath) {
  if (!filePath.endsWith('.astro') && !filePath.endsWith('.ts') && !filePath.endsWith('.mjs'))
    return;
  const src = readFileSync(filePath, 'utf8');
  const rel = relative(ROOT, filePath);
  const lines = src.split('\n');

  lines.forEach((line, i) => {
    const lineNum = i + 1;

    // 1. Long string literals that look like authored prose
    const stringMatches = line.matchAll(/"([^"]{40,})"|'([^']{40,})'/g);
    for (const m of stringMatches) {
      const str = m[1] ?? m[2];
      // ARIA labels are accessibility metadata, not authored content
      if (/\baria-(?:label|description)=/.test(line)) continue;
      if (!looksLikeAuthoredCopy(str)) continue;
      violations.push({
        file: rel,
        line: lineNum,
        rule: 'long-string',
        detail: `"${str.slice(0, 60)}…"`,
      });
    }

    // 2. Inline arrays of prose strings (e.g. const items = ['paragraph one', 'paragraph two'])
    // Only flag when the array contains multiple string literals that look like prose.
    if (/\[['"]/.test(line) && !/import|from|require|z\.|enum|validate/.test(line)) {
      const inlineStrings = [...line.matchAll(/['"]([^'"]{15,})['"]/g)].map((m) => m[1]);
      const proseStrings = inlineStrings.filter(looksLikeAuthoredCopy);
      if (proseStrings.length >= 2) {
        violations.push({
          file: rel,
          line: lineNum,
          rule: 'inline-array',
          detail: line.trim().slice(0, 80),
        });
      }
    }

    // 3. Fallback authored copy (?? 'non-empty string')
    const fallbackMatch = line.match(/\?\?\s*['"]([^'"]{5,})['"]/);
    if (fallbackMatch && looksLikeAuthoredCopy(fallbackMatch[1] + ' padding')) {
      violations.push({
        file: rel,
        line: lineNum,
        rule: 'authored-fallback',
        detail: `?? '${fallbackMatch[1].slice(0, 50)}'`,
      });
    }
  });
}

for (const dir of TARGET_DIRS) {
  walk(dir, check);
}

if (violations.length === 0) {
  console.log('check-content-boundaries: no violations found.');
  process.exit(0);
}

console.error(`check-content-boundaries: ${violations.length} violation(s) found.\n`);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  [${v.rule}]  ${v.detail}`);
}
process.exit(1);
