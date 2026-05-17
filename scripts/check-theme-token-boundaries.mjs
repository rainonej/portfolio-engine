/**
 * Upstream self-check: enforces theme-token boundaries across demo-site and
 * workflow-kit templates. Mirrors the downstream check distributed via workflow-kit.
 *
 * Usage:
 *   node scripts/check-theme-token-boundaries.mjs
 *   node scripts/check-theme-token-boundaries.mjs --config path/to/config.mjs
 *
 * Config is read from theme-token-boundaries.config.mjs in the project root,
 * or from the path provided via --config.
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const cwd = process.cwd();

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const configArgIdx = args.indexOf('--config');
const configArgPath = configArgIdx !== -1 ? args[configArgIdx + 1] : null;

// ---------------------------------------------------------------------------
// Config loading
// ---------------------------------------------------------------------------

const configPath = configArgPath
  ? path.resolve(cwd, configArgPath)
  : path.join(cwd, 'theme-token-boundaries.config.mjs');

if (!fs.existsSync(configPath)) {
  console.error('check:theme-token-boundaries: config file not found.');
  console.error(`  Expected: ${path.relative(cwd, configPath)}`);
  process.exit(1);
}

const { default: config } = await import(pathToFileURL(configPath).href);

// ---------------------------------------------------------------------------
// Glob expansion
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
    if (ignorePatterns.some((p) => matchesGlob(rel, p))) continue;
    if (patterns.some((p) => matchesGlob(rel, p))) matched.add(file);
  }
  return [...matched];
}

// ---------------------------------------------------------------------------
// Violation detection
// ---------------------------------------------------------------------------

const HEX_COLOR = /#([0-9a-fA-F]{3,8})\b/;
const COLOR_FUNC = /\b(rgba?|hsla?|oklch|color)\s*\(/;

const FILE_IGNORE_DIRECTIVE = 'portfolio-engine-theme-token-boundary-ignore-file';
const LINE_IGNORE_DIRECTIVE = 'portfolio-engine-theme-token-boundary-ignore-next-line';

function isCssRelevantFile(filePath) {
  return /\.(css|astro|html|svg|tsx?|jsx?)$/.test(filePath);
}

function stripSimpleVarReferences(line) {
  return line.replace(/var\s*\(--[\w-]+\s*\)/g, 'var(TOKEN)');
}

function stripInlineComments(line) {
  return line.replace(/\/\*.*?\*\//g, '').replace(/\/\/.*$/, '');
}

function buildPatterns(allowedTokenPrefixes) {
  const escapedPrefixes = (allowedTokenPrefixes ?? ['--color-']).map(
    (p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\w-]+',
  );
  const prefixUnion = escapedPrefixes.join('|');

  const CANONICAL_REDEF = new RegExp(
    `(?:${prefixUnion})\\s*:\\s*(?:#[0-9a-fA-F]{3,8}|rgba?\\s*\\(|hsla?\\s*\\(|oklch\\s*\\()`,
  );

  const PRIVATE_PALETTE = new RegExp(
    `--(?!(?:${prefixUnion}))(?!-)(?=[a-zA-Z])([\\w-]+)\\s*:\\s*(?:#[0-9a-fA-F]{3,8}|rgba?\\s*\\(|hsla?\\s*\\(|oklch\\s*\\()`,
  );

  return { CANONICAL_REDEF, PRIVATE_PALETTE };
}

function checkLine(rawLine, lineNum, cssRelevant, patterns) {
  const { CANONICAL_REDEF, PRIVATE_PALETTE } = patterns;
  const violations = [];
  const line = stripInlineComments(stripSimpleVarReferences(rawLine));

  if (CANONICAL_REDEF.test(line)) {
    violations.push({
      type: 'canonical-token-redef',
      line: lineNum,
      excerpt: rawLine.trim(),
      message: 'Canonical token variable redefined with a literal value outside tokenAuthority',
    });
    return violations;
  }

  if (PRIVATE_PALETTE.test(line)) {
    violations.push({
      type: 'private-palette',
      line: lineNum,
      excerpt: rawLine.trim(),
      message: 'Private CSS variable assigned a literal color value',
    });
    return violations;
  }

  if (cssRelevant) {
    if (HEX_COLOR.test(line)) {
      violations.push({
        type: 'literal-hex',
        line: lineNum,
        excerpt: rawLine.trim(),
        message: 'Literal hex color — use var(--color-*) instead',
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
  }

  return violations;
}

function checkFile(filePath, patterns) {
  const rel = path.relative(cwd, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const cssRelevant = isCssRelevantFile(filePath);

  if (content.includes(FILE_IGNORE_DIRECTIVE)) {
    const directiveLine = lines.find((l) => l.includes(FILE_IGNORE_DIRECTIVE)) ?? '';
    const reason = directiveLine.split(FILE_IGNORE_DIRECTIVE)[1]?.trim();
    if (!reason) {
      return [
        {
          file: rel,
          type: 'ignore-without-reason',
          line: lines.findIndex((l) => l.includes(FILE_IGNORE_DIRECTIVE)) + 1,
          excerpt: directiveLine.trim(),
          message: 'File-level ignore requires a reason after the directive text',
        },
      ];
    }
    return [];
  }

  const fileViolations = [];
  let skipNext = false;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const rawLine = lines[i];

    if (skipNext) {
      skipNext = false;
      continue;
    }

    if (rawLine.includes(LINE_IGNORE_DIRECTIVE)) {
      const reason = rawLine.split(LINE_IGNORE_DIRECTIVE)[1]?.trim();
      if (!reason) {
        fileViolations.push({
          file: rel,
          type: 'ignore-without-reason',
          line: lineNum,
          excerpt: rawLine.trim(),
          message: 'Line-level ignore requires a reason after the directive text',
        });
      }
      skipNext = true;
      continue;
    }

    for (const v of checkLine(rawLine, lineNum, cssRelevant, patterns)) {
      fileViolations.push({ file: rel, ...v });
    }
  }

  return fileViolations;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const patterns = buildPatterns(config.allowedTokenPrefixes);

const authorityFiles = new Set(
  expandGlobs(config.tokenAuthority ?? [], config.ignore).map((f) =>
    path.resolve(f).replace(/\\/g, '/'),
  ),
);

const consumerFiles = expandGlobs(config.tokenConsumers, config.ignore);
const allViolations = [];

for (const file of consumerFiles) {
  if (authorityFiles.has(path.resolve(file).replace(/\\/g, '/'))) continue;
  allViolations.push(...checkFile(file, patterns));
}

if (allViolations.length === 0) {
  console.log(`check:theme-token-boundaries OK (${consumerFiles.length} file(s) scanned)`);
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
  `${allViolations.length} violation(s). Color values belong only in tokenAuthority files.\n` +
    'Use var(--color-*) everywhere else.\n',
);
process.exit(1);
