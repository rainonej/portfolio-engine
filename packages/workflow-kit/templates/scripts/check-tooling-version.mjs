#!/usr/bin/env node
/**
 * Compare local workflow-kit scripts against upstream templates.
 *
 * This is a lightweight drift detector. It fetches the upstream
 * package.json for @portfolio-engine/workflow-kit, compares the
 * published version against the version this downstream repo was
 * last synced with, and warns if templates may have changed.
 *
 * Usage: node scripts/check-tooling-version.mjs
 *
 * For an exact file-by-file comparison, use:
 *   pnpm portfolio-engine sync-tools --check  (planned future command)
 *
 * Copy this script to scripts/check-tooling-version.mjs in your downstream repo.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const PKG_PATH = join(ROOT, 'package.json');

const pkg = JSON.parse(readFileSync(PKG_PATH, 'utf8'));

// The version of workflow-kit that this downstream repo's scripts were last
// synced from. Update this when you intentionally copy new templates.
const SYNCED_VERSION = pkg['portfolio-engine']?.workflowKitSyncedVersion ?? null;

if (!SYNCED_VERSION) {
  console.warn(
    'check-tooling-version: no "portfolio-engine.workflowKitSyncedVersion" in package.json.\n' +
      '  Add it to track which version of workflow-kit templates you are using:\n' +
      '    "portfolio-engine": { "workflowKitSyncedVersion": "0.1.0" }',
  );
  process.exit(0);
}

// Fetch the latest published version from npm registry
let latestVersion;
try {
  const res = await fetch('https://registry.npmjs.org/@portfolio-engine/workflow-kit/latest');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  latestVersion = data.version;
} catch (err) {
  console.warn(
    `check-tooling-version: could not fetch latest version from npm (${err.message}). Skipping.`,
  );
  process.exit(0);
}

if (latestVersion === SYNCED_VERSION) {
  console.log(`check-tooling-version: workflow-kit scripts are up to date (${SYNCED_VERSION}).`);
  process.exit(0);
}

console.warn(
  `check-tooling-version: workflow-kit templates may have changed.\n` +
    `  Your synced version: ${SYNCED_VERSION}\n` +
    `  Latest published:    ${latestVersion}\n\n` +
    `  Review the changelog and intentionally copy any updated templates:\n` +
    `    npx -y @portfolio-engine/workflow-kit@${latestVersion} --list-templates`,
);
process.exit(0); // warn only, do not fail CI
