#!/usr/bin/env python3
import sys, re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
t = pathlib.Path(root/'styles.css').read_text(encoding='utf-8')
t = re.sub(r'/\*.*?\*/', '', t, flags=re.S)
t = re.sub(r'"[^"\n]*"|\'[^\'\n]*\'', '""', t)
d = 0; line = 1
for ch in t:
    if ch == '\n': line += 1
    if ch == '{': d += 1
    if ch == '}':
        d -= 1
        if d < 0: print('extra } near line', line); sys.exit(1)
if d: print('unbalanced braces, depth', d); sys.exit(1)
if t.count('(') != t.count(')'): print('unbalanced parentheses'); sys.exit(1)
print('OK')
