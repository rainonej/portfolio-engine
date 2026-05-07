/**
 * CI guard: semantic tokens only in reusable packages; no legacy palette aliases;
 * no raw Tailwind stone/amber/white utilities in theme + admin source.
 */
import fs from 'node:fs';
import path from 'node:path';

const roots = [
  ['packages/editorial-theme/src', { scanHex: true }],
  ['packages/admin-tools/src', { scanHex: true }],
];

const LEGACY_VAR = /\b--(ink|paper-light|paper|stone-soft|copper|clay|warm-line|pale-sand|olive)\b/;

const FORBIDDEN_TW =
  /\b(text|bg|border|from|to|via|ring|outline|divide|decoration|fill|stroke)-(stone|amber)-|(?:^|[\s"'`])text-white\b|(?:^|[\s"'`])bg-white\b/;

const HEX = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/;

const HEX_ALLOWLIST_SUFFIXES = ['/design-tokens.css', '/design-resolve.ts'];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.name === 'node_modules') continue;
    if (e.isDirectory()) walk(p, out);
    else if (/\.(astro|css|ts|tsx|js|mjs)$/.test(p)) out.push(p);
  }
  return out;
}

function allowHex(rel) {
  return HEX_ALLOWLIST_SUFFIXES.some((s) => rel.replace(/\\/g, '/').endsWith(s));
}

const errors = [];

for (const [relRoot, opts] of roots) {
  const abs = path.join(process.cwd(), relRoot);
  for (const file of walk(abs)) {
    const rel = path.relative(process.cwd(), file);
    const text = fs.readFileSync(file, 'utf8');

    if (LEGACY_VAR.test(text)) {
      errors.push(`${rel}: legacy CSS variable alias (use semantic --color-* tokens)`);
    }

    if (/\.(astro|css)$/.test(file) && FORBIDDEN_TW.test(text)) {
      errors.push(`${rel}: forbidden Tailwind palette / white utility`);
    }

    if (opts.scanHex && !allowHex(rel) && HEX.test(text)) {
      errors.push(`${rel}: raw hex color (use semantic tokens or theme.json)`);
    }
  }
}

if (errors.length) {
  console.error('\ncheck:tokens failed:\n');
  for (const e of errors) console.error('  •', e);
  console.error('');
  process.exit(1);
}

console.log('check:tokens OK');
