/**
 * check-theme-token-boundaries.mjs
 *
 * Enforces the single-authority theme model: color values belong only in
 * src/config/theme.json. Everything else must consume semantic tokens via
 * var(--color-*).
 *
 * Usage:
 *   node scripts/check-theme-token-boundaries.mjs
 *
 * Config: theme-token-boundaries.config.mjs (optional, auto-detected).
 * Copy theme-token-boundaries.config.example.mjs → theme-token-boundaries.config.mjs
 * in your project root to customise.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_CONFIG = {
  tokenAuthority: ['src/config/theme.json'],

  tokenConsumers: [
    'public/**/*.html',
    'public/**/*.svg',
    'src/content/**/*.{md,mdx,html}',
    'src/pages-local/**/*.{astro,html,css}',
    'src/overrides/**/*.{astro,html,css}',
    'src/components/**/*.{astro,html,css,ts,tsx}',
    'src/templates/**/*.{astro,html,css,ts,tsx}',
    'src/context/**/*.{json,md}',
  ],

  ignore: [
    'node_modules/**',
    'dist/**',
    '.astro/**',
    '.vercel/**',
    'coverage/**',
    'public/**/*.png',
    'public/**/*.jpg',
    'public/**/*.jpeg',
    'public/**/*.webp',
    'public/**/*.gif',
    'public/**/*.ico',
  ],

  allowedTokenPrefixes: ['--color-', '--font-', '--text-', '--space-', '--shadow-'],
};

// ---------------------------------------------------------------------------
// Config loading
// ---------------------------------------------------------------------------

async function loadConfig() {
  const configPath = path.join(cwd, 'theme-token-boundaries.config.mjs');
  if (fs.existsSync(configPath)) {
    const mod = await import(pathToFileURL(configPath).href);
    return { ...DEFAULT_CONFIG, ...mod.default };
  }
  return DEFAULT_CONFIG;
}

// ---------------------------------------------------------------------------
// Glob expansion (minimal, no extra deps)
// ---------------------------------------------------------------------------

function matchesGlob(filePath, pattern) {
  let re = '';
  let i = 0;
  while (i < pattern.length) {
    const ch = pattern[i];
    if (ch === '*' && pattern[i + 1] === '*') {
      re += pattern[i + 2] === '/' ? '(?:.+/)?' : '.*';
      i += pattern[i + 2] === '/' ? 3 : 2;
    } else if (ch === '*') {
      re += '[^/]*';
      i++;
    } else if (ch === '?') {
      re += '[^/]';
      i++;
    } else if (ch === '{') {
      const end = pattern.indexOf('}', i);
      if (end === -1) {
        re += '\\{';
        i++;
        continue;
      }
      const alts = pattern
        .slice(i + 1, end)
        .split(',')
        .map((s) => s.trim().replace(/[.+^${}()|[\]\\]/g, '\\$&'));
      re += `(?:${alts.join('|')})`;
      i = end + 1;
    } else if (/[.+^$()|[\]\\]/.test(ch)) {
      re += '\\' + ch;
      i++;
    } else {
      re += ch;
      i++;
    }
  }
  return new RegExp(`^${re}$`).test(filePath.replace(/\\/g, '/'));
}

function walkDir(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, out);
    else out.push(full);
  }
  return out;
}

function expandGlobs(patterns, ignorePatterns) {
  const allFiles = walkDir(cwd);
  const matched = new Set();

  for (const file of allFiles) {
    const rel = path.relative(cwd, file).replace(/\\/g, '/');
    const isIgnored = ignorePatterns.some((p) => matchesGlob(rel, p));
    if (isIgnored) continue;
    const isIncluded = patterns.some((p) => matchesGlob(rel, p));
    if (isIncluded) matched.add(file);
  }

  return [...matched];
}

// ---------------------------------------------------------------------------
// Violation detection
// ---------------------------------------------------------------------------

// Matches hex color values: #rgb, #rrggbb, #rgba, #rrggbbaa
const HEX_COLOR = /#([0-9a-fA-F]{3,8})\b/;

// Matches rgb/rgba/hsl/hsla/oklch color functions
const COLOR_FUNC = /\b(rgba?|hsla?|oklch|color)\s*\(/;

// Private local palette: --non-color-var: <literal-color>
const PRIVATE_PALETTE =
  /--(?!color-)[\w-]+\s*:\s*(?:#[0-9a-fA-F]{3,8}|rgba?\s*\(|hsla?\s*\(|oklch\s*\()/;

// Canonical color token redefined with literal: --color-*: <literal-color>
const CANONICAL_REDEF =
  /--color-[\w-]+\s*:\s*(?:#[0-9a-fA-F]{3,8}|rgba?\s*\(|hsla?\s*\(|oklch\s*\()/;

const FILE_IGNORE_DIRECTIVE = 'portfolio-engine-theme-token-boundary-ignore-file';
const LINE_IGNORE_DIRECTIVE = 'portfolio-engine-theme-token-boundary-ignore-next-line';

function stripVarReferences(line) {
  // Remove var(--*) references — these are valid token consumption
  return line.replace(/var\s*\(--[\w-]+(?:\s*,\s*[^)]+)?\)/g, 'var(TOKEN)');
}

function stripComments(line) {
  // Remove inline /* */ comments and // comments
  return line.replace(/\/\*.*?\*\//g, '').replace(/\/\/.*$/, '');
}

function checkLine(rawLine, lineNum) {
  const violations = [];

  // Strip var() token references before checking
  const line = stripComments(stripVarReferences(rawLine));

  // Violation 1: canonical token redefinition (--color-*: literal)
  if (CANONICAL_REDEF.test(line)) {
    violations.push({
      type: 'canonical-token-redef',
      line: lineNum,
      excerpt: rawLine.trim(),
      message: 'Canonical --color-* token redefined with literal value outside theme.json',
    });
    return violations; // don't double-report
  }

  // Violation 2: private local palette (--private-var: literal)
  if (PRIVATE_PALETTE.test(line)) {
    violations.push({
      type: 'private-palette',
      line: lineNum,
      excerpt: rawLine.trim(),
      message: 'Private CSS variable assigned a literal color value',
    });
    return violations;
  }

  // Violation 3: bare literal color value in a style context
  if (HEX_COLOR.test(line)) {
    violations.push({
      type: 'literal-hex',
      line: lineNum,
      excerpt: rawLine.trim(),
      message: 'Literal hex color value — use var(--color-*) instead',
    });
  }

  if (COLOR_FUNC.test(line)) {
    violations.push({
      type: 'literal-color-func',
      line: lineNum,
      excerpt: rawLine.trim(),
      message: 'Literal color function (rgb/hsl/oklch) — use var(--color-*) instead',
    });
  }

  return violations;
}

function checkFile(filePath) {
  const rel = path.relative(cwd, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // File-level ignore
  if (content.includes(FILE_IGNORE_DIRECTIVE)) {
    const firstLine = lines[0] ?? '';
    // Require a reason after the directive
    const idx = firstLine.indexOf(FILE_IGNORE_DIRECTIVE);
    const reason = firstLine.slice(idx + FILE_IGNORE_DIRECTIVE.length).trim();
    if (!reason || reason === ':') {
      return [
        {
          file: rel,
          type: 'ignore-without-reason',
          line: 1,
          excerpt: firstLine.trim(),
          message: 'File-level ignore directive requires a reason',
        },
      ];
    }
    return [];
  }

  const fileViolations = [];
  let skipNextLine = false;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const rawLine = lines[i];

    // Line-level ignore (previous line had directive)
    if (skipNextLine) {
      skipNextLine = false;
      continue;
    }

    // Check if this line sets up a next-line ignore
    if (rawLine.includes(LINE_IGNORE_DIRECTIVE)) {
      const idx = rawLine.indexOf(LINE_IGNORE_DIRECTIVE);
      const reason = rawLine.slice(idx + LINE_IGNORE_DIRECTIVE.length).trim();
      if (!reason || reason === ':') {
        fileViolations.push({
          file: rel,
          type: 'ignore-without-reason',
          line: lineNum,
          excerpt: rawLine.trim(),
          message: 'Line-level ignore directive requires a reason',
        });
      }
      skipNextLine = true;
      continue;
    }

    const lineViolations = checkLine(rawLine, lineNum);
    for (const v of lineViolations) {
      fileViolations.push({ file: rel, ...v });
    }
  }

  return fileViolations;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const config = await loadConfig();
const consumerFiles = expandGlobs(config.tokenConsumers, config.ignore);

const allViolations = [];
for (const file of consumerFiles) {
  const violations = checkFile(file);
  allViolations.push(...violations);
}

if (allViolations.length === 0) {
  console.log('check:theme-token-boundaries OK');
  process.exit(0);
}

console.error('\ncheck:theme-token-boundaries failed:\n');
for (const v of allViolations) {
  console.error(`  ${v.file}:${v.line} [${v.type}]`);
  console.error(`    ${v.message}`);
  console.error(`    > ${v.excerpt}`);
  console.error('');
}
console.error(
  `${allViolations.length} violation(s) found.\n` +
    'Color values belong only in src/config/theme.json.\n' +
    'Use var(--color-*) everywhere else.\n',
);
process.exit(1);
