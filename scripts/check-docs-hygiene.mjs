#!/usr/bin/env node
/**
 * Fail if known downstream-specific brand copy appears in upstream-facing paths.
 * Maintainer identity strings may appear only in allow-listed paths (see MAINTAINER_STRING_ALLOW_FILES).
 * docs/governance/ is skipped entirely (templates/legal bundles live there).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

/** Banned everywhere maintainer strings appear outside explicit repo identity docs. */
const MAINTAINER_STRINGS = ['Jordan Rainone', 'rainonej@gmail.com'];

/** Ban downstream persona/service-catalog leakage repo-wide (excluding governance subtree scan). */
const DOWNSTREAM_BRAND_STRINGS = [
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

/** Repo-relative POSIX paths where maintainer name/email are expected (metadata only). */
const MAINTAINER_STRING_ALLOW_FILES = new Set([
  'SECURITY.md',
  'TRADEMARK.md',
  'GOVERNANCE.md',
  'CITATION.cff',
  'docs/contributing/package-metadata-checklist.md',
]);

function toPosix(rel) {
  return rel.split(path.sep).join('/');
}

function shouldSkipDir(rootLabel, relPath) {
  const base = path.basename(relPath);
  if (SKIP_DIR_NAMES.has(base)) return true;
  if (rootLabel === 'docs') {
    const norm = toPosix(relPath);
    if (norm === 'governance' || norm.startsWith('governance/')) return true;
  }
  return false;
}

async function* walk(dirAbs, relBase, rootLabel) {
  const entries = await fs.readdir(dirAbs, { withFileTypes: true });
  for (const ent of entries) {
    const rel = relBase ? path.join(relBase, ent.name) : ent.name;
    const abs = path.join(dirAbs, ent.name);
    if (ent.isDirectory()) {
      if (shouldSkipDir(rootLabel, rel)) continue;
      yield* walk(abs, rel, rootLabel);
    } else if (ent.isFile()) {
      yield { abs, rel };
    }
  }
}

function hitsForContent(repoRelPosix, text) {
  const hits = [];
  for (const needle of DOWNSTREAM_BRAND_STRINGS) {
    if (text.includes(needle)) hits.push(needle);
  }
  const maintainerOk = MAINTAINER_STRING_ALLOW_FILES.has(repoRelPosix);
  if (!maintainerOk) {
    for (const needle of MAINTAINER_STRINGS) {
      if (text.includes(needle)) hits.push(needle);
    }
  }
  return hits;
}

async function checkTreeFile(repoRel) {
  const ext = path.extname(repoRel).toLowerCase();
  if (!TEXT_EXT.has(ext)) return [];
  const posixRel = toPosix(repoRel);
  let text;
  try {
    text = await fs.readFile(path.join(REPO_ROOT, repoRel), 'utf8');
  } catch {
    return [];
  }
  return hitsForContent(posixRel, text).map((needle) => ({ file: posixRel, needle }));
}

async function scanRepoRootMarkdown(failures) {
  let entries;
  try {
    entries = await fs.readdir(REPO_ROOT, { withFileTypes: true });
  } catch {
    return;
  }
  for (const ent of entries) {
    if (!ent.isFile()) continue;
    const name = ent.name;
    const ext = path.extname(name).toLowerCase();
    if (!['.md', '.mdx', '.txt'].includes(ext)) continue;
    const posixRel = name;
    let text;
    try {
      text = await fs.readFile(path.join(REPO_ROOT, name), 'utf8');
    } catch {
      continue;
    }
    for (const needle of hitsForContent(posixRel, text)) {
      failures.push({ file: posixRel, needle });
    }
  }
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
    for await (const { rel } of walk(dirAbs, '', label)) {
      const repoRel = path.join(label, rel);
      const batch = await checkTreeFile(repoRel);
      for (const b of batch) failures.push(b);
    }
  }

  await scanRepoRootMarkdown(failures);

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
