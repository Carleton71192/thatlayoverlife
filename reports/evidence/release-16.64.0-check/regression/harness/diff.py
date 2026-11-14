import json, sys
rows = [json.loads(l) for f in sys.argv[1:] for l in open(f)]
key = lambda r: (r['name'], r['path'], r['w'], tuple(r.get('fail') or []))
by = {}
for r in rows: by.setdefault(key(r), {})[r['host']] = r
F=['cls','sw','mag','magN','aboutMag','c22','hero','val','rail','bands','pawBg','pf','lcp','ev','wide']
for k, v in by.items():
    w, t = v.get('w'), v.get('t')
    print('==', k)
    if not w or not t: print('  missing', list(v)); continue
    for nm, f in [('errs', lambda r: r['errs']), ('cons', lambda r: sorted(set(c[:80] for c in r['cons'] if 'Memberstack' not in c))), ('ads', lambda r: len(r['ads'])), ('same', lambda r: sorted(r['same'])), ('imgsN', lambda r: len(r['imgs']))]:
        a, b = f(w), f(t)
        print('  %-6s %s' % (nm, json.dumps(a)[:300] if a == b else 'W ' + json.dumps(a)[:300] + '\n         T ' + json.dumps(b)[:300]))
    for pr in ['probe', 'probe2']:
        pw, pt = w.get(pr) or {}, t.get(pr) or {}
        for x in F:
            a, b = pw.get(x), pt.get(x)
            if a == b:
                if x in ('mag','aboutMag','magN','rail','val','pf','pawBg') and a: print('  %s.%s same %s' % (pr, x, json.dumps(a)[:200]))
            else: print('  %s.%s W %s\n  %s T %s' % (pr, x, json.dumps(a)[:260], ' ' * len(pr + x), json.dumps(b)[:260]))
