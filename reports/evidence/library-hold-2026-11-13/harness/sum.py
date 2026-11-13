import json, sys, glob, statistics as S, collections
files = sys.argv[1:] or glob.glob('../out/g*.jsonl')
rows = [json.loads(l) for f in files for l in open(f)]
by = collections.defaultdict(list)
for r in rows: by[(r['case'], r['v'])].append(r)
def key(c):
    w, m, y = (c.split(':') + ['0'])[:3]
    return (-int(w.split('x')[0]), m, int(y))
cases = sorted({r['case'] for r in rows}, key=key)
vs = [v for v in ['base', 'fix', 'fix2', 'baseN9', 'fixN9', 'fix2N9'] if any(r['v'] == v for r in rows)]
BAR = 'fix2N9' if 'fix2N9' in vs else 'fixN9'
med = lambda l: S.median(l) if l else None
print('Median restored-reload shift (sum of layout-shift values after the reload), runs per cell in brackets')
print('%-24s' % 'case' + ''.join('%14s' % v for v in vs) + '   %s-base  bar' % BAR)
fails = 0; done = 0
for c in cases:
    M = {v: med([r['cls'] for r in by[(c, v)]]) for v in vs}
    cells = ''.join('%14s' % ('-' if M[v] is None else '%.4f [%d]' % (M[v], len(by[(c, v)]))) for v in vs)
    d = None if M.get(BAR) is None or M.get('base') is None else M[BAR] - M['base']
    ok = '' if d is None else ('PASS' if d <= 0.02 else 'FAIL')
    if d is not None and len(by[(c, BAR)]) >= 5 and len(by[(c, 'base')]) >= 5:
        done += 1; fails += ok == 'FAIL'
    print('%-24s' % c + cells + '   %s  %s' % ('' if d is None else '%+.4f' % d, ok))
print('complete cases %d, fails %d' % (done, fails))
print('\nRuns')
for c in cases:
    print(c, ' | '.join('%s %s' % (v, [round(r['cls'], 3) for r in sorted(by[(c, v)], key=lambda r: r['run'])]) for v in vs))
tot = collections.Counter();
for r in rows: tot['loads'] += 1; tot['miss'] += r['miss']; tot['hit'] += r['hit']; tot['errs'] += len(r['errs']); tot['aborted'] += r['aborted']
print('\nloads %(loads)d, Webflow cache hits %(hit)d, Webflow misses aborted (not fetched) %(miss)d, page errors %(errs)d, non-GET aborted %(aborted)d' % tot)
th = collections.defaultdict(set)
for r in rows: th[(r['case'].split(':')[0], r['v'])].add(r['trackH'])
print('final rail height per width and variant:', {'%s %s' % k: sorted(v) for k, v in sorted(th.items())})
