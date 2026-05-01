#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import json
ROOT=Path(__file__).resolve().parents[1]
class P(HTMLParser):
    def __init__(self): super().__init__(); self.ids=set(); self.hrefs=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if 'id' in d: self.ids.add(d['id'])
        if 'href' in d: self.hrefs.append(d['href'])
def main():
    msgs=[]; ok=True
    try:
        json.loads((ROOT/'source/project_model.json').read_text()); msgs.append('OK: source/project_model.json parses.')
    except Exception as e:
        ok=False; msgs.append(f'ERROR: JSON parse failed: {e}')
    p=P()
    try:
        p.feed((ROOT/'report/index.html').read_text()); msgs.append('OK: report/index.html parsed with Python HTMLParser.')
    except Exception as e:
        ok=False; msgs.append(f'ERROR: HTML parse failed: {e}')
    for href in p.hrefs:
        if href.startswith('#') and href[1:] and href[1:] not in p.ids:
            ok=False; msgs.append(f'ERROR: missing anchor target {href}')
        if href.startswith('assets/') and not (ROOT/'report'/href).exists():
            ok=False; msgs.append(f'ERROR: missing asset {href}')
    epics=list((ROOT/'source/epics').glob('*.md'))
    sections=list((ROOT/'source/sections').glob('*.md'))
    if len(epics)<8: ok=False; msgs.append(f'ERROR: expected >=8 epics, found {len(epics)}')
    else: msgs.append(f'OK: found {len(epics)} epic source files.')
    if len(sections)<6: ok=False; msgs.append(f'ERROR: expected >=6 sections, found {len(sections)}')
    else: msgs.append(f'OK: found {len(sections)} section source files.')
    msgs.append('NOTE: This is a structural/link check, not a full W3C validator.')
    (ROOT/'validation/validation_log.txt').write_text('\n'.join(msgs)+'\n')
    print('\n'.join(msgs))
    return 0 if ok else 1
if __name__=='__main__': raise SystemExit(main())
