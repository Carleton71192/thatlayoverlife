"""Final result files, out/m-<set>.jsonl. Start: out/f-<set>.jsonl (every cell, core of bdc6d21). Rows are replaced by later loads where a set has finished:
   s-<set>  /stories again after the lead card change (core 951b08c; rows of the core before that change are left out)      flag out/final4.flag
   t-<set>  /account and /submit again after the nav piece was rewritten (final core)                                       flag out/final5.flag
   u-scope  profile and /stories, standard, final core;  u-cpu  the same at CPU 4x;  u-rest  home and the three stories     flag out/final6.flag
python3 merge.py   prints, per set, which build each page's rows are from"""
import json, os
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def flag(f):
    p = os.path.join(B, 'out', f); return open(p).read().split() if os.path.exists(p) else []
D4, D5, D6 = flag('final4.flag'), flag('final5.flag'), flag('final6.flag')
def src(s):
    L = []  # (file, pages or None for all in the file, drop rows whose variant has this text)
    if s in D4: L.append(('s-%s.jsonl' % s, None, 'core-b11'))
    if s in D5: L.append(('t-%s.jsonl' % s, None, None))
    if s == 'std' and 'scope' in D6: L.append(('u-scope.jsonl', None, None))
    if s == 'std' and 'rest' in D6: L.append(('u-rest.jsonl', None, None))
    if s == 'cpu' and 'cpu' in D6: L.append(('u-cpu.jsonl', None, None))
    return [x for x in L if os.path.exists(os.path.join(B, 'out', x[0]))]
BUILD = {}
for s in ['std', 'cpu', 'slow', 'other', 'dom', 'split', 'fail', 'sizes', 'fcp']:
    rows = {}  # page -> (source, [lines])
    for l in open(os.path.join(B, 'out', 'f-%s.jsonl' % s)):
        rows.setdefault(json.loads(l)['page'], ('f', []))[1].append(l.rstrip('\n'))
    for f, _, drop in src(s):
        new = {}
        for l in open(os.path.join(B, 'out', f)):
            r = json.loads(l)
            if drop and drop in r['v']: continue
            new.setdefault(r['page'], []).append(l.rstrip('\n'))
        for p, L in new.items(): rows[p] = (f[0], L)
    out = [l for p in rows for l in rows[p][1]]
    open(os.path.join(B, 'out', 'm-%s.jsonl' % s), 'w').write('\n'.join(out) + '\n')
    BUILD[s] = {p: {'f': 'bdc6d21', 's': '951b08c', 't': 'final', 'u': 'final'}[rows[p][0]] for p in rows}
    print(s, len(out), 'rows;', ', '.join('%s: %s' % (b, ' '.join(sorted(p for p in BUILD[s] if BUILD[s][p] == b))) for b in ('final', '951b08c', 'bdc6d21') if b in BUILD[s].values()))
json.dump(BUILD, open(os.path.join(B, 'out', 'builds.json'), 'w'), indent=1)
