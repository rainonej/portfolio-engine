#!/usr/bin/env node
/**
 * Check downstream content schemas for common strictness violations.
 *
 * Flags:
 * - .passthrough() on content schemas
 * - z.any() / z.unknown() for fields that likely have a known shape
 * - `entry.data as SomeType` casts
 * - `?? null` / `?? ''` fallbacks that paper over missing schema fields
 * - Too many optional fields (warn only)
 *
 * Copy this script to scripts/check-schema-strictness.mjs in your downstream repo.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

const errors = [];
const warnings = [];

function walk(dir, cb) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist' || entry === '.astro') continue;
      walk(full, cb);
    } else {
      cb(full);
    }
  }
}

function checkFile(filePath) {
  const ext = filePath.split('.').pop();
  if (!['ts', 'mjs', 'js', 'astro'].includes(ext)) return;
  const src = readFileSync(filePath, 'utf8');
  const rel = relative(ROOT, filePath);
  const lines = src.split('\n');
  let optionalCount = 0;

  lines.forEach((line, i) => {
    const lineNum = i + 1;

    if (line.includes('.passthrough()')) {
      errors.push(
        `  ${rel}:${lineNum}  [passthrough]  Remove .passthrough() — use .strict() for content schemas`,
      );
    }

    if (/z\.(any|unknown)\(\)/.test(line)) {
      errors.push(
        `  ${rel}:${lineNum}  [any/unknown]  Replace z.any()/z.unknown() with a concrete schema`,
      );
    }

    if (/entry\.data\s+as\s+\w/.test(line)) {
      errors.push(
        `  ${rel}:${lineNum}  [type-cast]  Avoid \`entry.data as Type\` — let Zod infer the type`,
      );
    }

    if (/\?\?\s*(null|''|"")/.test(line)) {
      warnings.push(
        `  ${rel}:${lineNum}  [null-fallback]  ?? null / ?? '' may hide a missing required field`,
      );
    }

    if (/\.optional\(\)/.test(line)) {
      optionalCount++;
    }
  });

  if (optionalCount > 8) {
    warnings.push(
      `  ${rel}  [many-optional]  ${optionalCount} optional fields — consider making some required`,
    );
  }
}

walk(SRC, checkFile);

let exitCode = 0;

if (errors.length > 0) {
  console.error(`check-schema-strictness: ${errors.length} error(s):\n`);
  errors.forEach((e) => console.error(e));
  exitCode = 1;
}

if (warnings.length > 0) {
  console.warn(`\ncheck-schema-strictness: ${warnings.length} warning(s):\n`);
  warnings.forEach((w) => console.warn(w));
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('check-schema-strictness: no issues found.');
}

process.exit(exitCode);
