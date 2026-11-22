"""Nov 22 check-3: summarise results/place.jsonl per case and variant. A 'flash' is a timeline state where the grid is visible with
more cards shown than at the end (all cards painted, then dropped to the place's)."""
import json, os, re, collections, statistics as S
R = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov22/check-3/results'
rows = [json.loads(l) for l in open(os.path.join(R, 'place.jsonl'))]
G = collections.defaultdict(list)
for r in rows: G[(r['name'], r['v'])].append(r)
names = []
for r in rows:
    if r['name'] not in names: names.append(r['name'])
out = []
for n in names:
    for v in ('live', 'base', 'br'):
        L = G.get((n, v)) or []
        if not L: continue
        agg = dict(case=n, v=v, n=len(L), endVisible=0, flash=0, offBeforePress=0, errs=0, cons=0, nav=0, nonGet=0, cls=[], clsLoad=[], pressed=set(), shown=set(), dclMinusChunk=[], offMinusDcl=[], hold=[])
        for r in L:
            a = r.get('act') or {}
            if not isinstance(a, dict): agg['nav'] += 1; continue
            pw = a.get('pw') or {}
            agg['endVisible'] += 1 if a.get('gridVis') == 'visible' and not a.get('mark') else 0
            fin = a.get('shown')
            fl = False
            for t in pw.get('tl', []):
                p = t.split(' ')
                if len(p) >= 4 and p[2] == 'visible' and p[3].isdigit() and int(p[3]) > fin: fl = True
            agg['flash'] += 1 if fl else 0
            if pw.get('off') is not None and pw.get('pressedAt') is not None and pw['off'] < pw['pressedAt'] - 120: agg['offBeforePress'] += 1
            agg['errs'] += len(r['errs']); agg['cons'] += len(r['cons']); agg['nonGet'] += r.get('nonGet', 0); agg['nav'] += 1 if r.get('navErr') else 0
            agg['cls'].append(r['perf']['cls']); agg['clsLoad'].append(r['perfLoad']['cls'])
            agg['pressed'].add(','.join(a.get('pressed') or []) or 'none'); agg['shown'].add(fin)
            ch = (a.get('chunkEnd') or [None])[0]
            if ch is not None and pw.get('dcl') is not None: agg['dclMinusChunk'].append(pw['dcl'] - ch)
            if pw.get('off') is not None and pw.get('dcl') is not None: agg['offMinusDcl'].append(pw['off'] - pw['dcl'])
            agg['hold'].append(r.get('hold', 0))
        agg['pressed'] = sorted(agg['pressed']); agg['shown'] = sorted(x for x in agg['shown'] if x is not None)
        agg['clsMax'] = max(agg['cls']) if agg['cls'] else None
        out.append(agg)
json.dump(out, open(os.path.join(R, 'place-summary.json'), 'w'), indent=1, default=list)
for a in out:
    print('%-32s %-4s n=%d endVis %d flash %d offBeforePress %d errs %d cons %d nonGet %d cls %s load %s pressed %s shown %s dcl-chunk %s off-dcl %s' % (
        a['case'], a['v'], a['n'], a['endVisible'], a['flash'], a['offBeforePress'], a['errs'], a['cons'], a['nonGet'], a['cls'], a['clsLoad'], a['pressed'], a['shown'], a['dclMinusChunk'], a['offMinusDcl']))
