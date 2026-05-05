#!/usr/bin/env node
/**
 * Packs @portfolio-engine/* packages, installs them into a temp Astro consumer
 * cloned from examples/demo-site, then runs pnpm check + pnpm build.
 *
 * The consumer lives under OS tmpdir (not inside this repo) so `pnpm install`
 * does not attach to the parent workspace and `astro` resolves from devDependencies.
 */
import { execSync } from 'node:child_process';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packsDir = path.join(root, '.smoke-packs');
const demoSite = path.join(root, 'examples', 'demo-site');

const PACKAGES = ['schema', 'engine-core', 'editorial-theme', 'admin-tools'];

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: 'inherit', cwd: root, ...opts });
}

function findTarball(shortName) {
  const files = readdirSync(packsDir).filter(
    (f) => f.startsWith(`portfolio-engine-${shortName}-`) && f.endsWith('.tgz'),
  );
  if (files.length !== 1) {
    throw new Error(`Expected one tarball for ${shortName}, got: ${files.join(', ') || '(none)'}`);
  }
  return path.join(packsDir, files[0]);
}

try {
  rmSync(packsDir, { recursive: true, force: true });
} catch {
  /* Windows may hold a handle briefly (EBUSY); stale tgz names are overwritten by pack). */
}
mkdirSync(packsDir, { recursive: true });

run('pnpm --filter "./packages/*" run build');

for (const pkg of PACKAGES) {
  run(`pnpm pack --pack-destination "${packsDir}"`, {
    cwd: path.join(root, 'packages', pkg),
  });
}

function tarballPath(scopePkg) {
  const short = scopePkg.replace('@portfolio-engine/', '');
  return findTarball(short);
}

const consumerDir = mkdtempSync(path.join(tmpdir(), 'portfolio-engine-smoke-'));

try {
  cpSync(demoSite, consumerDir, {
    recursive: true,
    filter: (src) =>
      !src.includes(`${path.sep}node_modules${path.sep}`) &&
      !src.includes(`${path.sep}dist${path.sep}`) &&
      !src.includes(`${path.sep}.astro${path.sep}`) &&
      !src.includes(`${path.sep}.portfolio-engine${path.sep}`),
  });

  const demoPkg = JSON.parse(readFileSync(path.join(demoSite, 'package.json'), 'utf8'));
  const workspaceDeps = [
    '@portfolio-engine/schema',
    '@portfolio-engine/engine-core',
    '@portfolio-engine/editorial-theme',
    '@portfolio-engine/admin-tools',
  ];

  const deps = { ...demoPkg.dependencies };
  for (const name of workspaceDeps) {
    const abs = tarballPath(name);
    deps[name] = `file:${abs.replaceAll('\\', '/')}`;
  }

  const overrides = {};
  for (const name of workspaceDeps) {
    overrides[name] = deps[name];
  }

  const consumerPkg = {
    name: 'smoke-packed-consumer',
    private: true,
    version: '0.0.0',
    type: 'module',
    scripts: demoPkg.scripts,
    dependencies: deps,
    devDependencies: demoPkg.devDependencies,
    pnpm: {
      overrides,
    },
  };

  writeFileSync(
    path.join(consumerDir, 'package.json'),
    `${JSON.stringify(consumerPkg, null, 2)}\n`,
    'utf8',
  );

  /** Demo-site tsconfig points at monorepo `packages/*` for editorials source; remove for tarball smoke. */
  writeFileSync(
    path.join(consumerDir, 'tsconfig.json'),
    `${JSON.stringify(
      {
        extends: 'astro/tsconfigs/strict',
        include: ['.astro/types.d.ts', 'src/**/*'],
        exclude: ['dist', 'node_modules'],
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  run(`pnpm install`, { cwd: consumerDir });
  run(`pnpm run check`, { cwd: consumerDir });
  if (process.platform === 'win32') {
    console.warn(
      '\nSkipping `astro build` in smoke test on Windows (@astrojs/vercel symlinks often require Developer Mode). CI (Linux) runs the full build.',
    );
  } else {
    run(`pnpm run build`, { cwd: consumerDir });
  }

  console.log('\nPacked-package smoke test passed.');
} finally {
  rmSync(consumerDir, { recursive: true, force: true });
}
