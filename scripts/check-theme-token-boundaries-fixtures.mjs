/**
 * Regression tests for check-theme-token-boundaries.mjs.
 *
 * Asserts:
 *   - failing-private-palette.html exits nonzero (violations detected)
 *   - passing-token-consumer.html exits 0 (no violations)
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd = path.join(__dirname, '..');
const checker = path.join(__dirname, 'check-theme-token-boundaries.mjs');
const fixturesDir = path.join(__dirname, 'fixtures', 'theme-token-boundaries');

let failed = false;

function run(configFile) {
  return spawnSync(process.execPath, [checker, '--config', path.join(fixturesDir, configFile)], {
    cwd,
    encoding: 'utf8',
  });
}

// Test 1: failing fixture must produce violations (exit nonzero)
const failingResult = run('config-failing.mjs');
if (failingResult.status === 0) {
  console.error('FAIL: failing-private-palette.html — checker exited 0 (expected violations)');
  console.error(failingResult.stdout.trim());
  failed = true;
} else {
  console.log('PASS: failing-private-palette.html correctly triggers violations');
}

// Test 2: passing fixture must produce no violations (exit 0)
const passingResult = run('config-passing.mjs');
if (passingResult.status !== 0) {
  console.error(
    'FAIL: passing-token-consumer.html — checker exited nonzero (unexpected violations)',
  );
  console.error(passingResult.stderr.trim());
  failed = true;
} else {
  console.log('PASS: passing-token-consumer.html correctly has no violations');
}

if (failed) {
  console.error('\ncheck:theme-token-boundaries-fixtures FAILED');
  process.exit(1);
}

console.log('check:theme-token-boundaries-fixtures OK');
