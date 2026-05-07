#!/usr/bin/env node
/**
 * portfolio-engine doctor
 *
 * Reads .portfolio-engine/manifest.json from the current working directory
 * and prints a structured diagnostic report.
 *
 * Usage (from a consumer site root):
 *   pnpm pe:doctor
 *   portfolio-engine
 *   node node_modules/@portfolio-engine/engine-core/dist/doctor.js
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { EngineManifest } from '@portfolio-engine/schema';

const cwd = process.cwd();
const manifestPath = resolve(cwd, '.portfolio-engine', 'manifest.json');

if (!existsSync(manifestPath)) {
  console.error(
    '\n  ✗ .portfolio-engine/manifest.json not found.\n' +
      '    Run `pnpm build` (or `astro build`) first to generate it.\n',
  );
  process.exit(1);
}

let manifest: EngineManifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as EngineManifest;
} catch (err) {
  console.error(`\n  ✗ Failed to parse manifest: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
}

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';

function col(text: string, width: number): string {
  return text.length >= width ? text : text + ' '.repeat(width - text.length);
}

console.log(`\n${BOLD}Portfolio Engine Doctor${RESET}`);
console.log(DIM + `  Generated: ${manifest.generatedAt}` + RESET);

// Package versions
console.log(`\n${BOLD}Package versions:${RESET}`);
const pe = manifest.portfolioEngine ?? {};
console.log(`  @portfolio-engine/engine-core:      ${pe.engineCoreVersion ?? 'unknown'}`);
console.log(`  @portfolio-engine/editorial-theme:  ${pe.editorialThemeVersion ?? 'unknown'}`);

// Consumer registry
console.log(`\n${BOLD}Consumer registry:${RESET}`);
const cr = manifest.consumerRegistry ?? { path: '?', loaded: false, routeCount: 0 };
const loadedStr = cr.loaded ? GREEN + 'loaded' + RESET : DIM + 'not found' + RESET;
console.log(`  ${cr.path}  [${loadedStr}]  ${cr.routeCount} local route(s)`);

// Route overrides
const ro = manifest.routeOverrides ?? { disabled: [], remapped: {} };
const disabledCount = ro.disabled.length;
const remappedCount = Object.keys(ro.remapped).length;
if (disabledCount > 0 || remappedCount > 0) {
  console.log(`\n${BOLD}Route overrides:${RESET}`);
  for (const d of ro.disabled) {
    console.log(`  ${YELLOW}disabled${RESET}  ${d}`);
  }
  for (const [from, to] of Object.entries(ro.remapped)) {
    console.log(`  ${CYAN}remapped${RESET}  ${from}  →  ${to}`);
  }
}

// Routes
console.log(`\n${BOLD}Routes:${RESET}`);
console.log(
  DIM +
    '  Note: URLs implemented only under src/pages/ are Astro-owned and usually absent from this list.' +
    RESET,
);
for (const route of manifest.routes ?? []) {
  const origin = route.routeOrigin ?? 'unknown';
  const originLabel =
    origin === 'theme'
      ? DIM + 'theme' + RESET
      : origin === 'consumer-local'
        ? CYAN + 'consumer-local' + RESET
        : origin === 'consumer-pages'
          ? GREEN + 'consumer-pages' + RESET
          : YELLOW + origin + RESET;

  const resolved = route.resolved !== route.pattern ? ` → ${route.resolved}` : '';
  const entryHint = route.entrypoint ? `  ${DIM}${route.entrypoint}${RESET}` : '';
  console.log(`  ${col(route.pattern + resolved, 36)} ${originLabel}${entryHint}`);
}

// Navigation warnings
const navWarnings = manifest.navWarnings;
if (navWarnings && navWarnings.length > 0) {
  console.log(`\n${BOLD}${YELLOW}Navigation warnings:${RESET}`);
  for (const w of navWarnings) {
    console.log(`  ${YELLOW}⚠${RESET}  ${w}`);
  }
} else {
  console.log(`\n${BOLD}Navigation:${RESET}`);
  console.log(`  ${GREEN}✓${RESET}  No nav warnings.`);
}

// Capabilities
console.log(`\n${BOLD}Capabilities:${RESET}`);
const caps = manifest.capabilities ?? {};
for (const [key, val] of Object.entries(caps)) {
  console.log(`  ${val ? GREEN + '✓' : DIM + '·'}${RESET}  ${key}`);
}

console.log('');
