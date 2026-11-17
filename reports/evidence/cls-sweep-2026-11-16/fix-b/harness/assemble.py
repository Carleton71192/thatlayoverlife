"""fix.md, part B: head draft + result tables + tail draft, placeholders filled from fill.json.
python3 assemble.py <tables dir> [<path to fix.md>]   writes out/fix-b.md; with a path, part B in that fix.md is replaced (or added after part A)."""
import json, os, re, sys
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = sys.argv[1]
fill = json.load(open(os.path.join(B, 'fill.json')))
cells = json.load(open(os.path.join(T, 'cells.json')))
NAME = {'account': '/account', 'submit': '/submit', 'profile': '/contributors/<profile>', 'stories': '/stories'}
one = ['| cell | control | new | loads over 0.1, control / new | CPU 4x: control | CPU 4x: new |', '|---|---|---|---|---|---|']
for p in NAME:
    for w in (390, 1440):
        s, c = cells['std|%s|%d' % (p, w)], cells['cpu|%s|%d' % (p, w)]
        one.append('| %s %d | %.4f (%.4f) | %.4f (%.4f) | %d of %d / %d of %d | %.4f (%.4f) | %.4f (%.4f) |' % (NAME[p], w, s['ctl']['median'], s['ctl']['max'], s['new']['median'], s['new']['max'],
                   s['ctl']['over'], s['ctl']['n'], s['new']['over'], s['new']['n'], c['ctl']['median'], c['ctl']['max'], c['new']['median'], c['new']['max']))
fill['ONE'] = '\n'.join(one)
table = open(os.path.join(T, 'table.md')).read().strip()
status = fill.pop('STATUS', '')
res = '## Results\n\n' + status + fill.pop('RESNOTE') + '\n\n' + table + '\n\n' + fill.pop('RESAFTER') + '\n'
txt = open(os.path.join(B, 'fix-b-head.md')).read().rstrip() + '\n\n' + res + '\n' + open(os.path.join(B, 'fix-b-tail.md')).read()
for k, v in fill.items(): txt = txt.replace('@@%s@@' % k, v)
left = sorted(set(re.findall(r'@@[A-Z]+@@', txt)))
assert not left, left
bad = [w for w in re.findall(r'[A-Za-z]+', txt) if 'ship' in w.lower() or w.lower() in ('ledger', 'filed')]
assert not bad, bad
assert '—' not in txt and '!' not in txt.replace('!important', ''), 'dash or exclamation mark'
open(os.path.join(B, 'out', 'fix-b.md'), 'w').write(txt)
print(len(txt), 'chars,', txt.count('\n'), 'lines')
if len(sys.argv) > 2:
    p = sys.argv[2]; a = open(p).read(); M = '\n# Layout shift sweep, part B'
    i = a.find(M)
    if i >= 0: a = a[:i]
    open(p, 'w').write(a.rstrip() + '\n\n' + txt)
    print('written into', p)
