"""Nov 22 check-2 summary (no page text): ab perf and errors for live, base, br; page equality base vs br and live vs br (counts and
element classes only); FCP reruns (fcp2, fcp3). Writes results/summary.json and prints the tables used in check-2.md."""
import json, os, collections, statistics as st
S = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov22/check-2/results'
rows = lambda f: [json.loads(l) for l in open(os.path.join(S, f))] if os.path.exists(os.path.join(S, f)) else []
ab = rows('ab.jsonl'); G = collections.defaultdict(list)
for r in ab: G[(r['file'], r['w'], r['signed'])].append(r)
out = {'perf': [], 'sig': {}, 'fcp_reruns': [], 'errors': {}}
med = lambda xs: st.median(xs) if xs else None
for (f, w, s), R in sorted(G.items(), key=lambda kv: (kv[0][0], kv[0][1])):
    p = {'page': f.replace('.html', ''), 'w': w}
    for v in ('live', 'base', 'br'):
        X = [x for x in R if x['v'] == v]
        p[v] = {'n': len(X), 'cls': med([x['perf']['cls'] for x in X]), 'cls_all': [x['perf']['cls'] for x in X], 'fcp': med([x['perfLoad']['fcp'] for x in X]), 'fcp_all': [x['perfLoad']['fcp'] for x in X],
                'pageErrors': sum(len(x['errs']) for x in X), 'console': sum(len(x['cons']) for x in X), 'nonGetAborted': sum(x['nonGet'] for x in X), 'nav': [x.get('navErr') for x in X if x.get('navErr')]}
    out['perf'].append(p)
for pair in ('base-br', 'live-br'):
    d = json.load(open(os.path.join(S, 'an-%s.json' % pair)))
    out['sig'][pair] = {k: {'elements': v['elements'], 'boxChanged': v['boxChanged'], 'onlyB': len(v['onlyBrEx']), 'onlyA': len(v['onlyLiveEx']),
                            'changed': [[c['field'], c['el'], c['n']] for c in v['changed']]} for k, v in d['sig'].items()}
F = collections.defaultdict(list)
for fn in ('fcp2.jsonl', 'fcp3.jsonl'):
    for r in rows(fn): F[(r['file'].replace('.html', ''), r['w'], r['v'])].append(r['perfLoad']['fcp']); out['errors'][fn] = out['errors'].get(fn, 0) + len(r['errs'])
for (f, w) in sorted({(a, b) for a, b, c in F}):
    out['fcp_reruns'].append({'page': f, 'w': w, **{v: {'n': len(F[(f, w, v)]), 'median': med(F[(f, w, v)])} for v in ('live', 'base', 'br')}})
json.dump(out, open(os.path.join(S, 'summary.json'), 'w'), indent=1)
for p in out['perf']:
    L, B, R = p['live'], p['base'], p['br']
    print('| %s | %d | %.4f | %.4f | %.4f | %+.4f | %d | %d | %d | %+d |' % (p['page'][:40], p['w'], L['cls'], B['cls'], R['cls'], R['cls'] - L['cls'], L['fcp'], B['fcp'], R['fcp'], R['fcp'] - L['fcp']))
print()
for x in out['fcp_reruns']: print('| %s | %d | %s |' % (x['page'][:40], x['w'], ' | '.join('%d (%d)' % (x[v]['median'], x[v]['n']) for v in ('live', 'base', 'br'))))
print(out['errors'])
