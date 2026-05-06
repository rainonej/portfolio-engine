import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const SRC = path.join(ROOT, 'source');
const REPORT = path.join(ROOT, 'report');

function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[`*_]+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function isTableSeparatorRow(line) {
  const t = line.trim();
  if (!t.startsWith('|') || !t.endsWith('|')) return false;
  const inner = t.slice(1, -1).split('|');
  return inner.length > 0 && inner.every((c) => /^[\s\-:]+$/.test(c));
}

function parseMarkdownTable(lines, start) {
  if (!lines[start] || !lines[start].trimStart().startsWith('|')) return null;
  const rows = [];
  let j = start;
  while (j < lines.length && lines[j].trimStart().startsWith('|')) {
    const raw = lines[j].trim();
    if (isTableSeparatorRow(raw)) {
      j++;
      continue;
    }
    const parts = raw.split('|');
    if (parts.length < 3) break;
    rows.push(parts.slice(1, -1).map((c) => c.trim()));
    j++;
  }
  if (rows.length === 0) return null;
  return { rows, end: j };
}

function tableToHtml(rows) {
  if (rows.length === 0) return '';
  let h = '<table class="md-table"><thead><tr>';
  rows[0].forEach((c) => {
    h += '<th>' + inline(c) + '</th>';
  });
  h += '</tr></thead><tbody>';
  for (let r = 1; r < rows.length; r++) {
    h += '<tr>';
    rows[r].forEach((c) => {
      h += '<td>' + inline(c) + '</td>';
    });
    h += '</tr>';
  }
  return h + '</tbody></table>';
}

function mdToHtml(md, opts = {}) {
  const { anchorPrefix } = opts;
  const lines = md.split(/\r?\n/);
  const out = [];
  let inCode = false;
  let code = [];
  let inUl = false;
  const closeUl = () => {
    if (inUl) {
      out.push('</ul>');
      inUl = false;
    }
  };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      if (!inCode) {
        closeUl();
        inCode = true;
        code = [];
      } else {
        out.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>');
        inCode = false;
      }
      i++;
      continue;
    }
    if (inCode) {
      code.push(line);
      i++;
      continue;
    }
    const tbl = parseMarkdownTable(lines, i);
    if (tbl) {
      closeUl();
      out.push(tableToHtml(tbl.rows));
      i = tbl.end;
      continue;
    }
    if (!line.trim()) {
      closeUl();
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      closeUl();
      out.push('<h1>' + inline(line.slice(2)) + '</h1>');
    } else if (line.startsWith('## ')) {
      closeUl();
      out.push('<h2>' + inline(line.slice(3)) + '</h2>');
    } else if (line.startsWith('### ')) {
      closeUl();
      const txt = line.slice(4);
      if (anchorPrefix) {
        const id = anchorPrefix + '__' + slugify(txt);
        out.push(`<h3 id="${id}">${inline(txt)}</h3>`);
      } else {
        out.push('<h3>' + inline(txt) + '</h3>');
      }
    } else if (line.startsWith('#### ')) {
      closeUl();
      out.push('<h4>' + inline(line.slice(5)) + '</h4>');
    } else if (line.startsWith('- ')) {
      if (!inUl) {
        out.push('<ul>');
        inUl = true;
      }
      out.push('<li>' + inline(line.slice(2)) + '</li>');
    } else if (line.startsWith('> ')) {
      closeUl();
      out.push('<blockquote>' + inline(line.slice(2)) + '</blockquote>');
    } else {
      closeUl();
      out.push('<p>' + inline(line) + '</p>');
    }
    i++;
  }
  closeUl();
  return out.join('\n');
}

function parseEpic(filename, md) {
  const lines = md.split(/\r?\n/);
  const title = (lines[0] || '').replace(/^#\s+/, '').trim();
  const slug = filename
    .replace(/^epic_/, '')
    .replace(/\.md$/, '')
    .replace(/_/g, '-');
  const grab = (re) => {
    for (const l of lines.slice(0, 30)) {
      const m = l.match(re);
      if (m) return m[1].trim();
    }
    return '';
  };
  const phaseLine = grab(/^\*\*Phase:\*\*\s*(.+?)\s*$/);
  const phaseNumbers = [...phaseLine.matchAll(/Phase\s+(\d+)/gi)].map((m) => Number(m[1]));
  const minPhase = phaseNumbers.length ? Math.min(...phaseNumbers) : 99;
  const mvpRelevance = grab(/^\*\*MVP relevance:\*\*\s*(.+?)\s*$/);
  const productsTouched = grab(/^\*\*Products touched:\*\*\s*(.+?)\s*$/);
  const labelsRaw = grab(/^\*\*Labels:\*\*\s*(.+?)\s*$/);
  return {
    filename,
    slug,
    title,
    phaseLine,
    phaseNumbers,
    minPhase,
    mvpRelevance,
    productsTouched,
    labelsRaw,
    md,
  };
}

function buildPhaseTimeline(model, epicsBySlug) {
  const phases = Array.isArray(model.phases) ? model.phases : [];
  if (phases.length === 0) {
    return '<p class="muted">Phase timeline data missing in <code>project_model.json</code>.</p>';
  }
  const parts = ['<div class="phase-timeline">'];
  for (const entry of phases) {
    if (entry.milestone) {
      parts.push(
        `<div class="milestone-banner"><span class="milestone-star">★</span>` +
          `<div><div class="milestone-title">${esc(entry.milestone)} <span class="milestone-after">after Phase ${esc(entry.after)}</span></div>` +
          `<div class="milestone-summary">${inline(entry.summary || '')}</div></div></div>`,
      );
      continue;
    }
    const epicItems = (entry.epics || [])
      .map((ref) => {
        const e = epicsBySlug[ref.slug];
        const title = e ? e.title : ref.slug;
        const scope = ref.scope
          ? ` <span class="phase-epic-scope">(${inline(ref.scope)})</span>`
          : '';
        return `<li><a href="#epic-${esc(ref.slug)}">${esc(title)}</a>${scope}</li>`;
      })
      .join('');
    const badges = (arr, cls) =>
      (arr || []).map((v) => `<span class="badge ${cls}">${esc(v)}</span>`).join(' ');
    parts.push(
      `<details class="phase" open>` +
        `<summary><span class="phase-number">Phase ${esc(entry.number)}</span> <span class="phase-title">${esc(entry.title)}</span></summary>` +
        `<div class="phase-body">` +
        `<p class="phase-description">${inline(entry.description || '')}</p>` +
        `<p class="phase-motivation"><em>Why now:</em> ${inline(entry.motivation || '')}</p>` +
        `<div class="phase-meta">` +
        `<div><strong>Products:</strong> ${badges(entry.products, 'badge-product')}</div>` +
        `<div><strong>Owners:</strong> ${badges(entry.owners, 'badge-owner')}</div>` +
        `<div><strong>Areas:</strong> ${badges(entry.areas, 'badge-area')}</div>` +
        `</div>` +
        `<div class="phase-epics"><strong>Epics in this phase:</strong><ul>${epicItems}</ul></div>` +
        `</div></details>`,
    );
  }
  parts.push('</div>');
  return parts.join('\n');
}

function renderRoadmapSection(md, timelineHtml) {
  const sentinel = 'XPHASETIMELINESENTINELX';
  const replaced = (md || '').replace(/<!--\s*phase-timeline\s*-->/g, sentinel);
  const html = mdToHtml(replaced);
  return html
    .replace(new RegExp(`<p>${sentinel}</p>`, 'g'), timelineHtml)
    .replaceAll(sentinel, timelineHtml);
}

function depSvg() {
  return `<svg class="depgraph" viewBox="0 0 920 430" role="img" aria-label="Dependency graph"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#334155"></path></marker></defs><rect x="50" y="50" width="170" height="70" rx="16" class="node required"></rect><text x="135" y="82" text-anchor="middle" class="node-title">schema</text><text x="135" y="104" text-anchor="middle" class="node-sub">required</text><rect x="310" y="50" width="190" height="70" rx="16" class="node required"></rect><text x="405" y="82" text-anchor="middle" class="node-title">engine-core</text><text x="405" y="104" text-anchor="middle" class="node-sub">required</text><rect x="600" y="50" width="220" height="70" rx="16" class="node required"></rect><text x="710" y="82" text-anchor="middle" class="node-title">editorial-theme</text><text x="710" y="104" text-anchor="middle" class="node-sub">required</text><rect x="600" y="185" width="220" height="70" rx="16" class="node consumer"></rect><text x="710" y="217" text-anchor="middle" class="node-title">consumer site</text><text x="710" y="239" text-anchor="middle" class="node-sub">agreni / jordan</text><rect x="300" y="300" width="230" height="70" rx="16" class="node optional"></rect><text x="415" y="332" text-anchor="middle" class="node-title">admin-tools</text><text x="415" y="354" text-anchor="middle" class="node-sub">optional UI</text><rect x="600" y="300" width="250" height="70" rx="16" class="node optional"></rect><text x="725" y="332" text-anchor="middle" class="node-title">workflow-kit</text><text x="725" y="354" text-anchor="middle" class="node-sub">optional Python/MCP</text><line x1="220" y1="85" x2="310" y2="85" class="edge"></line><line x1="500" y1="85" x2="600" y2="85" class="edge"></line><line x1="710" y1="120" x2="710" y2="185" class="edge"></line><line x1="610" y1="235" x2="500" y2="300" class="edge optional-edge"></line><line x1="725" y1="300" x2="725" y2="255" class="edge optional-edge"></line><text x="460" y="160" text-anchor="middle" class="mvp-star">★ Backbone MVP: engine stable after Phases 1–3</text></svg>`;
}

function listFiles(dir) {
  let out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out = out.concat(listFiles(p));
    else out.push(p);
  }
  return out;
}

const model = JSON.parse(fs.readFileSync(path.join(SRC, 'project_model.json'), 'utf8'));
const sections = Object.fromEntries(
  fs
    .readdirSync(path.join(SRC, 'sections'))
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => [path.basename(f, '.md'), fs.readFileSync(path.join(SRC, 'sections', f), 'utf8')]),
);
const epicFiles = fs
  .readdirSync(path.join(SRC, 'epics'))
  .filter((f) => f.endsWith('.md'))
  .sort();
const epics = epicFiles.map((f) =>
  parseEpic(f, fs.readFileSync(path.join(SRC, 'epics', f), 'utf8')),
);
epics.sort((a, b) => a.minPhase - b.minPhase || a.filename.localeCompare(b.filename));
const epicsBySlug = Object.fromEntries(epics.map((e) => [e.slug, e]));

const cards = model.packages
  .map(
    (p) =>
      `<div class="package-card ${p.mvp ? 'required' : 'optional'}"><div class="package-kind">${esc(p.kind)}</div><h3>${esc(p.name)}</h3><p><strong>Language:</strong> ${esc(p.language)}</p><p>${esc(p.purpose)}</p><p class="muted"><strong>Depends on:</strong> ${esc(p.dependsOn.length ? p.dependsOn.join(', ') : 'none')}</p></div>`,
  )
  .join('\n');

const epicHtml = epics
  .map((e) => {
    const md = e.md;
    const mvp =
      md.includes('★ Required') ||
      md.includes('★ Reference') ||
      md.includes('★ Product MVP') ||
      md.includes('★ Required for Backbone MVP') ||
      md.includes('★ Required for Product MVP');
    const id = `epic-${e.slug}`;
    const summary = `${esc(e.title)} <span>${mvp ? '★ MVP milestone' : 'post-MVP / support'}</span>`;
    return `<details class="epic-card ${mvp ? 'mvp' : 'post'}" id="${id}" open><summary>${summary}</summary><div class="source-link">Source: <code>source/epics/${esc(e.filename)}</code></div>${mdToHtml(md, { anchorPrefix: id })}</details>`;
  })
  .join('\n');

const timelineHtml = buildPhaseTimeline(model, epicsBySlug);
const roadmapHtml = renderRoadmapSection(sections['05_mvp_roadmap'] || '', timelineHtml);

const statusMarkdown =
  sections['00_repo_status_checklist'] ||
  '# Repo status\n\nAdd `source/sections/00_repo_status_checklist.md` for a living checklist.';
const statusSection = `<section id="status" class="panel">${mdToHtml(statusMarkdown)}</section>`;

const sourceList = listFiles(SRC)
  .sort()
  .map((p) => `<li><code>${esc(path.relative(ROOT, p))}</code></li>`)
  .join('\n');

const body = `<section class="hero"><div class="eyebrow">Source-driven architecture report</div><h1>${esc(model.title)}</h1><p>${esc(model.summary || '')}</p><div class="hero-badges"><span>Required Astro/npm runtime</span><span>Optional Python/MCP workflow-kit</span><span>Optional admin UI</span><span>★ Backbone / Product MVP markers</span></div></section>${statusSection}<section id="goals" class="panel">${mdToHtml(sections['01_big_picture_goals'])}</section><section id="packages" class="panel"><h1>Required vs Optional Packages</h1><p>The required runtime packages are schema, engine-core, and editorial-theme. The optional packages are admin-tools and workflow-kit.</p><div class="package-grid">${cards}</div></section><section id="graph" class="panel"><h1>Dependency Graph and Backbone MVP Marker</h1>${depSvg()}</section><section id="upstream" class="panel">${mdToHtml(sections['03_upstream_layout'])}</section><section id="consumer" class="panel">${mdToHtml(sections['04_consumer_layout'])}</section><section id="audit" class="panel">${mdToHtml(sections['02_current_vs_target'])}</section><section id="roadmap" class="panel">${roadmapHtml}</section><section id="board" class="panel">${mdToHtml(sections['07_board_reconciliation'] || '')}</section><section id="products" class="panel">${mdToHtml(sections['08_product_tracks_and_mvp'] || '')}</section><section id="gap" class="panel">${mdToHtml(sections['06_gap_plan'] || '')}</section><section id="epics" class="panel"><h1>Epics and Atomic Tickets</h1><p>Generated from <code>source/epics/*.md</code>. Sorted by phase, then filename. Do not blindly create all issues. Reconcile against the live GitHub board first.</p><input id="epicSearch" type="text" class="search" aria-label="Filter epics and tickets" oninput="filterEpics()" placeholder="Filter epics/tickets...">${epicHtml}</section><section id="sources" class="panel"><h1>Canonical Source Files</h1><p>The report is generated from these files. Edit <code>source/</code>, then rerun <code>node scripts/build_report.mjs</code>.</p><ul>${sourceList}</ul></section>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Portfolio Engine v5 Audit</title><link rel="stylesheet" href="assets/styles.css"></head><body><div class="app"><aside class="sidebar"><div class="brand">Portfolio Engine<br><span>v5 audit pack</span></div><nav><a href="#status">Status</a><a href="#goals">Goals</a><a href="#packages">Packages</a><a href="#graph">Dependency graph</a><a href="#upstream">Upstream repo</a><a href="#consumer">Consumer repo</a><a href="#audit">Current vs target</a><a href="#roadmap">MVP roadmap</a><a href="#board">Board reconciliation</a><a href="#products">Product tracks</a><a href="#gap">Gap plan</a><a href="#epics">Epics & tickets</a><a href="#sources">Source files</a></nav></aside><main>${body}</main></div><script>function filterEpics(){const q=document.getElementById('epicSearch').value.toLowerCase();document.querySelectorAll('.epic-card').forEach(c=>{c.style.display=c.innerText.toLowerCase().includes(q)?'':'none';});}</script></body></html>`;

fs.writeFileSync(path.join(REPORT, 'index.html'), html);
