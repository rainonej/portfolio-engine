/**
 * Generate static HTML under report/ from Markdown sources (no duplicated epic HTML).
 * Run from repo root: pnpm run build:audit-report
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const packRoot = path.dirname(fileURLToPath(import.meta.url));
const reportDir = path.join(packRoot, 'report');
const cssPath = path.join(reportDir, 'assets', 'styles.css');

marked.setOptions({ gfm: true });

function readGeneratedDate() {
  const manifestPath = path.join(packRoot, 'pack_manifest.json');
  try {
    const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (m.generated && typeof m.generated === 'string') return m.generated;
  } catch {
    /* ignore */
  }
  return new Date().toISOString().slice(0, 10);
}

function readCssBlock() {
  const css = fs.readFileSync(cssPath, 'utf8');
  if (css.includes('</style>')) {
    throw new Error('assets/styles.css must not contain the literal </style>');
  }
  return `    <style id="audit-pack-inlined-css">
/* Inlined from assets/styles.css — edit that file, then pnpm run build:audit-report */
${css}
    </style>`;
}

function mdToHtml(md) {
  return marked.parse(md);
}

function navItems(activeFile) {
  const items = [
    ['index.html', 'Overview'],
    ['00_patch_notes.html', 'Patch notes'],
    ['01_target_architecture.html', 'Target architecture'],
    ['02_current_repo_audit.html', 'Current repo audit'],
    ['03_gap_plan.html', 'Gap plan'],
    ['04_epic_roadmap.html', 'Epic roadmap'],
    ['05_ticket_backlog.html', 'Ticket backlog'],
    ['06_decisions.html', 'Decisions'],
  ];
  return items
    .map(([href, label]) => {
      const current = href === activeFile ? ' aria-current="page"' : '';
      return `        <a href="${href}"${current}>${label}</a>`;
    })
    .join('\n');
}

function pageShell({ title, activeFile, mainHtml }) {
  const gen = readGeneratedDate();
  const cssBlock = readCssBlock();
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${title}</title>
${cssBlock}
  </head>
  <body>
    <div class="layout">
      <aside class="sidebar">
        <h1>Portfolio Engine v3 Audit</h1>
        <div class="small">Generated ${gen}</div>
        <hr>
${navItems(activeFile)}
        <hr>
        <div class="small">
          Context pack for Claude/GitHub board reconciliation. Issue numbers are placeholders.
        </div>
      </aside>
      <main>
${mainHtml}
      </main>
    </div>
  </body>
</html>
`;
}

function readMd(...segments) {
  return fs.readFileSync(path.join(packRoot, ...segments), 'utf8');
}

function prependMuted(text, md) {
  if (!text) return md;
  return `<div class="muted">${text}</div>\n\n${md}`;
}

function sortedMdFiles(dir, pred = (n) => n.endsWith('.md')) {
  return fs.readdirSync(path.join(packRoot, dir)).filter(pred).sort();
}

function buildEpicRoadmapMd() {
  const epicFiles = sortedMdFiles('epics');
  const bodies = epicFiles.map((f) => readMd('epics', f).trim());
  const intro = `# Rewritten Epic Roadmap\n\n`;
  return intro + bodies.join('\n\n---\n\n');
}

function buildDecisionsMd() {
  const files = sortedMdFiles('decisions', (n) => n.startsWith('ADR-') && n.endsWith('.md'));
  const bodies = files.map((f) => readMd('decisions', f).trim());
  return `# Decisions\n\n` + bodies.join('\n\n---\n\n');
}

const pages = [
  {
    file: 'index.html',
    title: 'Overview',
    activeFile: 'index.html',
    muted: null,
    mdPath: ['markdown', 'index.md'],
  },
  {
    file: '00_patch_notes.html',
    title: 'Patch notes',
    activeFile: '00_patch_notes.html',
    muted: 'What changed since v2',
    mdPath: ['markdown', '00_patch_notes.md'],
  },
  {
    file: '01_target_architecture.html',
    title: 'Target architecture',
    activeFile: '01_target_architecture.html',
    muted: 'North star',
    mdPath: ['markdown', '01_target_architecture.md'],
  },
  {
    file: '02_current_repo_audit.html',
    title: 'Current repo audit',
    activeFile: '02_current_repo_audit.html',
    muted: 'As-is snapshot',
    mdPath: ['markdown', '02_current_repo_audit.md'],
  },
  {
    file: '03_gap_plan.html',
    title: 'Gap plan',
    activeFile: '03_gap_plan.html',
    muted: 'How to get there',
    mdPath: ['markdown', '03_gap_plan.md'],
  },
  {
    file: '04_epic_roadmap.html',
    title: 'Epic roadmap',
    activeFile: '04_epic_roadmap.html',
    muted: 'Rewritten epics',
    mdPath: null,
    mdFactory: buildEpicRoadmapMd,
  },
  {
    file: '05_ticket_backlog.html',
    title: 'Ticket backlog',
    activeFile: '05_ticket_backlog.html',
    muted: 'Ticket backlog',
    mdPath: ['tickets', 'tickets_by_epic.md'],
  },
  {
    file: '06_decisions.html',
    title: 'Decisions',
    activeFile: '06_decisions.html',
    muted: 'ADRs',
    mdPath: null,
    mdFactory: buildDecisionsMd,
  },
];

for (const p of pages) {
  const rawMd = p.mdFactory != null ? p.mdFactory() : readMd(...p.mdPath);
  const withMuted = prependMuted(p.muted, rawMd);
  const mainHtml = mdToHtml(withMuted);
  const indent = '        ';
  const mainIndented =
    mainHtml
      .trimEnd()
      .split('\n')
      .map((line) => {
        const trimmed = line.trimEnd();
        return trimmed ? indent + trimmed : '';
      })
      .join('\n') + '\n';
  let html = pageShell({
    title: p.title,
    activeFile: p.activeFile,
    mainHtml: mainIndented,
  });
  html = html.replace(/^[ \t]+$/gm, '').replace(/[ \t]+(\r?\n)/g, '$1');
  fs.writeFileSync(path.join(reportDir, p.file), html);
}

console.log(`Wrote ${pages.length} pages to ${path.relative(process.cwd(), reportDir)}`);
