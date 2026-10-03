#!/usr/bin/env python3
import re, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
bad = []
def exists(ref, base):
    ref = ref.split('#')[0].split('?')[0].strip()
    if not ref or '${' in ref or re.match(r'^(https?:|mailto:|tel:|data:|javascript:|//)', ref): return True
    p = (root / ref.lstrip('/')) if ref.startswith('/') else (base.parent / ref)
    return p.exists()
files = [p for p in root.glob('*.html')] + [root/'styles.css', root/'app.js']
for f in files:
    t = f.read_text(encoding='utf-8')
    refs = re.findall(r'(?:src|href|poster)=["\']([^"\']+)["\']', t)
    for s in re.findall(r'srcset=["\']([^"\']+)["\']', t):
        refs += [x.strip().split(' ')[0] for x in s.split(',')]
    refs += re.findall(r'url\(\s*["\']?([^)"\']+)["\']?\s*\)', t)
    refs += re.findall(r'["\'`]((?:\./)?assets/[^"\'`$]+\.(?:webp|jpg|jpeg|png|svg|woff2?))["\'`]', t)
    base = f if f.suffix == '.html' else (root / 'index.html')
    if f.name == 'styles.css': base = f
    for r in refs:
        if not exists(r, base): bad.append(f'{f.name}: {r}')
for b in sorted(set(bad)): print('BROKEN', b)
print('OK' if not bad else f'FAIL ({len(set(bad))})')
sys.exit(1 if bad else 0)
