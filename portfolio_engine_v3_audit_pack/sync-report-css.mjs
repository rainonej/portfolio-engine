/**
 * Inlines report/assets/styles.css into each report/*.html so IDE/preview webviews
 * still get styles when relative <link> URLs do not resolve. Edit the .css file, then run:
 *   node portfolio_engine_v3_audit_pack/sync-report-css.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const reportDir = path.join(root, 'report');
const cssPath = path.join(reportDir, 'assets', 'styles.css');
const css = fs.readFileSync(cssPath, 'utf8');
if (css.includes('</style>')) {
  throw new Error('CSS contains </style> sequence; escape before inlining.');
}

const styleBlock = `    <style id="audit-pack-inlined-css">
/* Inlined from assets/styles.css — run: node portfolio_engine_v3_audit_pack/sync-report-css.mjs */
${css}
    </style>`;

const linkRe = /\s*<link rel="stylesheet" href="(?:\.\/)?assets\/styles\.css">\s*/;

for (const name of fs.readdirSync(reportDir)) {
  if (!name.endsWith('.html')) continue;
  const fp = path.join(reportDir, name);
  let html = fs.readFileSync(fp, 'utf8');
  const styleRe = /<style id="audit-pack-inlined-css">[\s\S]*?<\/style>\s*/;
  if (styleRe.test(html)) {
    html = html.replace(styleRe, `${styleBlock}\n`);
  } else if (linkRe.test(html)) {
    html = html.replace(linkRe, `\n${styleBlock}\n`);
  } else {
    throw new Error(`${name}: expected stylesheet link or existing inline block`);
  }
  fs.writeFileSync(fp, html);
}

console.log('Updated', fs.readdirSync(reportDir).filter((n) => n.endsWith('.html')).length, 'HTML files');
