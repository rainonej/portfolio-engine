#!/usr/bin/env node
/**
 * Fail if known downstream-specific brand copy appears in upstream-facing paths.
 * Maintainer/legal files and governance copy are excluded; see SKIP_PREFIXES.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const FORBIDDEN = [
  'Jordan Rainone',
  'rainonej@gmail.com',
  'jordan-site-kappa',
  'Research Mathematician · Applied ML Scientist · Independent Advisor',
  'I turn hand-wavy technical ideas',
  'Future advisory layer',
  'Prepared Expert Consult',
  'AI/ML Audit Lite',
  'BigBio is the strongest external reference',
  'Quanta Magazine meets high-end independent advisory',
];

const SKIP_DIR_NAMES = new Set(['node_modules', 'dist', '.git', '.astro', '.vercel', 'coverage']);

const TEXT_EXT = new Set([
  '.md',
  '.mdx',
  '.txt',
  '.astro',
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.cjs',
  '.json',
  '.yml',
  '.yaml',
]);

/** Paths under repo root that should not be scanned (maintainer / legal / archived). */
const SKIP_PREFIXES = [path.join('docs', 'governance') + path.sep];

function shouldSkipDir(relPath) {
  const base = path.basename(relPath);
  if (SKIP_DIR_NAMES.has(base)) return true;
  const norm = relPath.replaceAll(path.sep, '/') + '/';
  return SKIP_PREFIXES.some((p) => norm.startsWith(p.replaceAll(path.sep, '/')));
}

async function* walk(dirAbs, relBase = '') {
  const entries = await fs.readdir(dirAbs, { withFileTypes: true });
  for (const ent of entries) {
    const rel = relBase ? path.join(relBase, ent.name) : ent.name;
    const abs = path.join(dirAbs, ent.name);
    if (ent.isDirectory()) {
      if (shouldSkipDir(rel)) continue;
      yield* walk(abs, rel);
    } else if (ent.isFile()) {
      yield { abs, rel };
    }
  }
}

async function checkFile(rel) {
  const ext = path.extname(rel).toLowerCase();
  if (!TEXT_EXT.has(ext)) return [];
  const abs = path.join(REPO_ROOT, rel);
  let text;
  try {
    text = await fs.readFile(abs, 'utf8');
  } catch {
    return [];
  }
  const hits = [];
  for (const needle of FORBIDDEN) {
    if (text.includes(needle)) hits.push(needle);
  }
  return hits;
}

async function main() {
  const roots = [
    ['docs', path.join(REPO_ROOT, 'docs')],
    ['packages', path.join(REPO_ROOT, 'packages')],
    ['examples', path.join(REPO_ROOT, 'examples')],
  ];
  const failures = [];

  for (const [label, dirAbs] of roots) {
    try {
      await fs.access(dirAbs);
    } catch {
      continue;
    }
    for await (const { rel } of walk(dirAbs, '')) {
      const repoRel = path.join(label, rel).split(path.sep).join('/');
      // Skip governance subtree explicitly (path may vary on Windows)
      if (repoRel.startsWith('docs/governance/')) continue;
      const hits = await checkFile(path.join(label, rel));
      for (const h of hits) failures.push({ file: repoRel, needle: h });
    }
  }

  const readme = path.join(REPO_ROOT, 'README.md');
  try {
    const text = await fs.readFile(readme, 'utf8');
    for (const needle of FORBIDDEN) {
      if (text.includes(needle)) failures.push({ file: 'README.md', needle });
    }
  } catch {
    /* ignore */
  }

  if (failures.length) {
    console.error('check-docs-hygiene: forbidden downstream-specific strings found:\n');
    for (const { file, needle } of failures) {
      console.error(`  ${file}: contains ${JSON.stringify(needle)}`);
    }
    process.exit(1);
  }
  console.log('check-docs-hygiene: OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
