"""classb-check: compare page signatures (before vs each variant, and before vs before for noise), plus CLS, errors and misses."""
import json, os, sys, collections
R = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'results')
rows = [json.loads(l) for l in open(os.path.join(R, 'sig.jsonl'))]
def sig(p, v, w, s, run):
    f = os.path.join(R, f'sig_{p}_{v}_{w}_{s}_{run}.json')
    return json.load(open(f)) if os.path.exists(f) else None
def cmp(a, b):
    out = collections.Counter(); ex = []
    for k in set(a) | set(b):
        if k not in a: out['added'] += 1; ex.append(('+', k, b[k]['b'], b[k]['t'])); continue
        if k not in b: out['removed'] += 1; ex.append(('-', k, a[k]['b'], a[k]['t'])); continue
        x, y = a[k], b[k]
        if any(abs(i - j) > 1 for i, j in zip(x['b'], y['b'])): out['box'] += 1; ex.append(('box', k, x['b'], y['b']))
        if x['s'] != y['s']: out['style'] += 1; ex.append(('style', k, x['s'], y['s']))
        if x['t'] != y['t']: out['text'] += 1; ex.append(('text', k, x['t'], y['t']))
        if x['a'] != y['a']: out['attr'] += 1; ex.append(('attr', k, x['a'], y['a']))
    return dict(out), ex
by = {(r['page'], r['v'], r['w'], r['signed'], r['run']): r for r in rows}
VARS = {'submit': ['B02', 'B15', 'B0215', 'B18', 'all'], 'my-pets': ['B08'], 'edit-profile': ['B17']}
for p, vs in VARS.items():
    for w in (390, 1440):
        for s in ('in', 'out'):
            b0 = sig(p, 'before', w, s, 0); b1 = sig(p, 'before', w, s, 1)
            if not b0: continue
            n, _ = cmp(b0, b1) if b1 else ({}, [])
            cl = [by[(p, 'before', w, s, r)]['perf']['cls'] for r in (0, 1) if (p, 'before', w, s, r) in by]
            print(f'\n== {p} {w} signed {s}: before run0 vs run1 noise {n}; before CLS {cl}; errs {[len(by[(p,"before",w,s,r)]["errs"]) for r in (0,1) if (p,"before",w,s,r) in by]}')
            for v in vs:
                for run in (0, 1):
                    a = sig(p, v, w, s, run)
                    if not a: continue
                    c, ex = cmp(sig(p, 'before', w, s, run), a); r = by[(p, v, w, s, run)]
                    print(f'  {v} run{run}: {c} CLS {r["perf"]["cls"]} errs {len(r["errs"])} cons {len(r["cons"])} nonGet {r["nonGet"]} miss {len(r["miss"])}')
                    if '-v' in sys.argv and run == 0:
                        for e in ex[:14]: print('     ', str(e)[:230])
