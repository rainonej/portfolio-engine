#!/usr/bin/env node
/**
 * Browser interaction smoke-test for downstream Portfolio Engine sites.
 *
 * This is browser interaction verification.
 * It complements, but does not replace, check-rendered-links.
 *
 * check-rendered-links verifies that href values in built HTML point to generated
 * files. This script verifies that users can actually click CTAs, cards, and
 * navigation in a real browser — catching issues like invisible overlays, nested
 * anchors, z-index conflicts, and Vercel toolbar interception that static checks
 * cannot detect.
 *
 * Requirements:
 *   pnpm add -D @playwright/test
 *   pnpm exec playwright install --with-deps chromium
 *
 * Usage:
 *   node scripts/check-rendered-interactions.mjs
 *   SITE_URL=https://my-preview.vercel.app node scripts/check-rendered-interactions.mjs
 *
 * Copy this script to scripts/check-rendered-interactions.mjs in your downstream repo.
 * Copy rendered-interactions.config.example.mjs to scripts/rendered-interactions.config.mjs
 * and edit it to match your site's routes and interactions.
 */

import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const configPath = join(ROOT, 'scripts', 'rendered-interactions.config.mjs');

if (!existsSync(configPath)) {
  console.error(
    'check-rendered-interactions: config not found.\n' +
      '  Copy rendered-interactions.config.example.mjs to\n' +
      '  scripts/rendered-interactions.config.mjs and edit it for your site.',
  );
  process.exit(1);
}

const { default: config } = await import(pathToFileURL(configPath).href);

const { baseUrl, routes = [], viewports = [], clickChecks = [] } = config;

if (!baseUrl) {
  console.error('check-rendered-interactions: config must export a baseUrl.');
  process.exit(1);
}

const errors = [];
const passes = [];

const browser = await chromium.launch();

for (const viewport of viewports.length > 0
  ? viewports
  : [{ name: 'default', width: 1280, height: 800 }]) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await context.newPage();

  // Route reachability checks — assert h1 is visible on each route.
  for (const route of routes) {
    const url = baseUrl.replace(/\/$/, '') + route;
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      const h1 = page.locator('h1').first();
      const visible = await h1.isVisible().catch(() => false);
      if (visible) {
        passes.push({ viewport: viewport.name, route, check: 'h1 visible', result: 'PASS' });
      } else {
        errors.push({
          viewport: viewport.name,
          route,
          check: 'h1 visible',
          result: 'FAIL',
          detail: 'No visible <h1> found on page.',
        });
      }
    } catch (err) {
      errors.push({
        viewport: viewport.name,
        route,
        check: 'page load',
        result: 'FAIL',
        detail: String(err.message),
      });
    }
  }

  // Click interaction checks.
  for (const check of clickChecks) {
    const { from, role, name, expectedUrl, allowNewPage = false, note } = check;
    const url = baseUrl.replace(/\/$/, '') + from;
    try {
      await page.goto(url, { waitUntil: 'networkidle' });

      const locator = page.getByRole(role, { name });
      const isVisible = await locator
        .first()
        .isVisible()
        .catch(() => false);

      if (!isVisible) {
        errors.push({
          viewport: viewport.name,
          route: from,
          check: `${role}[name=${name}] clickable`,
          result: 'FAIL',
          detail: `Element not visible. Check for overlay, z-index, or pointer-events issues.${note ? ' Note: ' + note : ''}`,
        });
        continue;
      }

      // Playwright actionability check: click() will throw if the element is
      // obscured, disabled, or not stable — this catches overlay interception.
      if (allowNewPage) {
        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          locator.first().click(),
        ]);
        await newPage.waitForLoadState('networkidle');
        const finalUrl = newPage.url();
        if (expectedUrl && !expectedUrl.test(finalUrl)) {
          errors.push({
            viewport: viewport.name,
            route: from,
            check: `${role}[name=${name}] → ${String(expectedUrl)}`,
            result: 'FAIL',
            detail: `Opened new page at ${finalUrl}, expected ${String(expectedUrl)}.${note ? ' Note: ' + note : ''}`,
          });
        } else {
          passes.push({
            viewport: viewport.name,
            route: from,
            check: `${role}[name=${name}] → ${String(expectedUrl)}`,
            result: 'PASS',
          });
        }
        await newPage.close();
      } else {
        await locator.first().click();
        await page.waitForLoadState('networkidle');
        const finalUrl = page.url();
        if (expectedUrl && !expectedUrl.test(finalUrl)) {
          errors.push({
            viewport: viewport.name,
            route: from,
            check: `${role}[name=${name}] → ${String(expectedUrl)}`,
            result: 'FAIL',
            detail: `Navigated to ${finalUrl}, expected ${String(expectedUrl)}.${note ? ' Note: ' + note : ''}`,
          });
        } else {
          passes.push({
            viewport: viewport.name,
            route: from,
            check: `${role}[name=${name}] → ${String(expectedUrl)}`,
            result: 'PASS',
          });
        }
      }
    } catch (err) {
      errors.push({
        viewport: viewport.name,
        route: from,
        check: `${role}[name=${name}] clickable`,
        result: 'FAIL',
        detail: `${err.message}${note ? ' Note: ' + note : ''}`,
      });
    }
  }

  await context.close();
}

await browser.close();

// Report results.
const allResults = [...passes, ...errors];

console.log('\ncheck-rendered-interactions results:\n');
console.log(['Viewport', 'Route', 'Check', 'Result', 'Detail'].map((h) => h.padEnd(18)).join('  '));
console.log('-'.repeat(100));

for (const r of allResults) {
  console.log(
    [r.viewport, r.route, r.check, r.result, r.detail ?? '']
      .map((v) => String(v).padEnd(18))
      .join('  '),
  );
}

if (errors.length > 0) {
  console.error(`\ncheck-rendered-interactions: ${errors.length} failure(s). See table above.`);
  process.exit(1);
}

console.log(`\ncheck-rendered-interactions: all ${passes.length} check(s) passed.`);
