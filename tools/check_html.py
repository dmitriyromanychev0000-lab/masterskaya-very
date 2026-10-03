#!/usr/bin/env python3
import sys, pathlib
from html.parser import HTMLParser
root = pathlib.Path(__file__).resolve().parent.parent
VOID = {'meta','link','img','br','hr','input','source','area','base','col','embed','track','wbr'}
class P(HTMLParser):
    def __init__(s): super().__init__(); s.st=[]; s.ids=set(); s.err=[]
    def handle_starttag(s, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            if a['id'] in s.ids: s.err.append(f"duplicate id {a['id']}")
            s.ids.add(a['id'])
        if tag == 'img' and 'alt' not in a: s.err.append(f"img without alt: {a.get('src')}")
        if tag not in VOID: s.st.append((tag, s.getpos()[0]))
    def handle_endtag(s, tag):
        if tag in VOID: return
        if not s.st or s.st[-1][0] != tag:
            s.err.append(f"unexpected </{tag}> line {s.getpos()[0]} (open: {s.st[-1] if s.st else None})")
            for i in range(len(s.st)-1, -1, -1):
                if s.st[i][0] == tag: del s.st[i:]; break
        else: s.st.pop()
fail = 0
for f in sorted(root.glob('*.html')):
    p = P(); p.feed(f.read_text(encoding='utf-8'))
    for left in p.st: p.err.append(f'unclosed <{left[0]}> from line {left[1]}')
    for e in p.err: print(f'{f.name}: {e}')
    fail += len(p.err)
print('OK' if not fail else f'FAIL ({fail})'); sys.exit(1 if fail else 0)
