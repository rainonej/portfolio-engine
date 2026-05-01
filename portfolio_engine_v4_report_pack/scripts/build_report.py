#!/usr/bin/env python3
from pathlib import Path
import json, html, re
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'source'
REPORT=ROOT/'report'

def inline(s):
    s=html.escape(s)
    s=re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    s=re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
    return s

def md_to_html(md):
    out=[]; code=[]; in_code=False; in_ul=False
    def close_ul():
        nonlocal in_ul
        if in_ul:
            out.append('</ul>'); in_ul=False
    for line in md.splitlines():
        if line.startswith('```'):
            if not in_code:
                close_ul(); in_code=True; code=[]
            else:
                out.append('<pre><code>'+html.escape('\n'.join(code))+'</code></pre>'); in_code=False
            continue
        if in_code:
            code.append(line); continue
        if not line.strip():
            close_ul(); continue
        if line.startswith('# '):
            close_ul(); out.append('<h1>'+inline(line[2:])+'</h1>')
        elif line.startswith('## '):
            close_ul(); out.append('<h2>'+inline(line[3:])+'</h2>')
        elif line.startswith('### '):
            close_ul(); out.append('<h3>'+inline(line[4:])+'</h3>')
        elif line.startswith('#### '):
            close_ul(); out.append('<h4>'+inline(line[5:])+'</h4>')
        elif line.startswith('- '):
            if not in_ul:
                out.append('<ul>'); in_ul=True
            out.append('<li>'+inline(line[2:])+'</li>')
        elif line.startswith('> '):
            close_ul(); out.append('<blockquote>'+inline(line[2:])+'</blockquote>')
        else:
            close_ul(); out.append('<p>'+inline(line)+'</p>')
    close_ul()
    return '\n'.join(out)

def dep_svg():
    return r'''<svg class="depgraph" viewBox="0 0 920 430" role="img" aria-label="Dependency graph">
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#334155"></path></marker></defs>
<rect x="50" y="50" width="170" height="70" rx="16" class="node required"></rect><text x="135" y="82" text-anchor="middle" class="node-title">schema</text><text x="135" y="104" text-anchor="middle" class="node-sub">required</text>
<rect x="310" y="50" width="190" height="70" rx="16" class="node required"></rect><text x="405" y="82" text-anchor="middle" class="node-title">engine-core</text><text x="405" y="104" text-anchor="middle" class="node-sub">required</text>
<rect x="600" y="50" width="220" height="70" rx="16" class="node required"></rect><text x="710" y="82" text-anchor="middle" class="node-title">editorial-theme</text><text x="710" y="104" text-anchor="middle" class="node-sub">required</text>
<rect x="600" y="185" width="220" height="70" rx="16" class="node consumer"></rect><text x="710" y="217" text-anchor="middle" class="node-title">consumer site</text><text x="710" y="239" text-anchor="middle" class="node-sub">agreni / jordan</text>
<rect x="300" y="300" width="230" height="70" rx="16" class="node optional"></rect><text x="415" y="332" text-anchor="middle" class="node-title">admin-tools</text><text x="415" y="354" text-anchor="middle" class="node-sub">optional UI</text>
<rect x="600" y="300" width="250" height="70" rx="16" class="node optional"></rect><text x="725" y="332" text-anchor="middle" class="node-title">workflow-kit</text><text x="725" y="354" text-anchor="middle" class="node-sub">optional Python/MCP</text>
<line x1="220" y1="85" x2="310" y2="85" class="edge"></line><line x1="500" y1="85" x2="600" y2="85" class="edge"></line><line x1="710" y1="120" x2="710" y2="185" class="edge"></line><line x1="610" y1="235" x2="500" y2="300" class="edge optional-edge"></line><line x1="725" y1="300" x2="725" y2="255" class="edge optional-edge"></line><text x="460" y="160" text-anchor="middle" class="mvp-star">★ MVP after required runtime + demo + CI + docs</text></svg>'''

def package_cards(model):
    cards=[]
    for p in model['packages']:
        cls='required' if p['mvp'] else 'optional'
        deps=', '.join(p['dependsOn']) if p['dependsOn'] else 'none'
        cards.append(f"""<div class='package-card {cls}'><div class='package-kind'>{html.escape(p['kind'])}</div><h3>{html.escape(p['name'])}</h3><p><strong>Language:</strong> {html.escape(p['language'])}</p><p>{html.escape(p['purpose'])}</p><p class='muted'><strong>Depends on:</strong> {html.escape(deps)}</p></div>""")
    return '<div class="package-grid">'+'\n'.join(cards)+'</div>'

def page(body):
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Portfolio Engine v4 Audit</title><link rel="stylesheet" href="assets/styles.css"></head><body><div class="app"><aside class="sidebar"><div class="brand">Portfolio Engine<br><span>v4 audit pack</span></div><nav><a href="#goals">Goals</a><a href="#packages">Packages</a><a href="#graph">Dependency graph</a><a href="#upstream">Upstream repo</a><a href="#consumer">Consumer repo</a><a href="#audit">Current vs target</a><a href="#roadmap">MVP roadmap</a><a href="#epics">Epics & tickets</a><a href="#sources">Source files</a></nav></aside><main>{body}</main></div><script>function filterEpics(){{const q=document.getElementById('epicSearch').value.toLowerCase();document.querySelectorAll('.epic-card').forEach(c=>{{c.style.display=c.innerText.toLowerCase().includes(q)?'':'none';}});}}</script></body></html>'''

def main():
    model=json.loads((SRC/'project_model.json').read_text())
    sections={p.stem:p.read_text() for p in sorted((SRC/'sections').glob('*.md'))}
    epics=sorted((SRC/'epics').glob('*.md'))
    epic_html=[]
    for p in epics:
        md=p.read_text(); title=md.splitlines()[0].replace('# ','')
        is_mvp='★ Required' in md or '★ Reference' in md
        epic_html.append(f"""<details class='epic-card {'mvp' if is_mvp else 'post'}' open><summary>{html.escape(title)} <span>{'★ MVP-related' if is_mvp else 'post-MVP / support'}</span></summary><div class='source-link'>Source: <code>source/epics/{p.name}</code></div>{md_to_html(md)}</details>""")
    source_files=''.join(f'<li><code>{html.escape(str(p.relative_to(ROOT)))}</code></li>' for p in sorted(SRC.rglob('*')) if p.is_file())
    body=f"""
<section class='hero'><div class='eyebrow'>Source-driven architecture report</div><h1>{html.escape(model['title'])}</h1><p>{html.escape(model.get('summary',''))}</p><div class='hero-badges'><span>Required Astro/npm runtime</span><span>Optional Python/MCP workflow-kit</span><span>Optional admin UI</span><span>★ MVP marker</span></div></section>
<section id='goals' class='panel'>{md_to_html(sections['01_big_picture_goals'])}</section>
<section id='packages' class='panel'>{md_to_html(sections['02_required_vs_optional_packages'])}{package_cards(model)}</section>
<section id='graph' class='panel'><h1>Dependency Graph and MVP Marker</h1>{dep_svg()}</section>
<section id='upstream' class='panel'>{md_to_html(sections['03_target_upstream_repo_layout'])}</section>
<section id='consumer' class='panel'>{md_to_html(sections['04_target_consumer_repo_layout'])}</section>
<section id='audit' class='panel'>{md_to_html(sections['05_current_vs_target_audit'])}</section>
<section id='roadmap' class='panel'>{md_to_html(sections['06_mvp_and_roadmap'])}</section>
<section id='epics' class='panel'><h1>Epics and Atomic Tickets</h1><p>Generated from <code>source/epics/*.md</code>. Do not blindly create all issues. Reconcile against the live GitHub board first.</p><input id='epicSearch' class='search' oninput='filterEpics()' placeholder='Filter epics/tickets...'>{''.join(epic_html)}</section>
<section id='sources' class='panel'><h1>Canonical Source Files</h1><p>The report is generated from these files. Edit <code>source/</code>, then rerun <code>python scripts/build_report.py</code>.</p><ul>{source_files}</ul></section>"""
    (REPORT/'index.html').write_text(page(body))
if __name__=='__main__': main()
