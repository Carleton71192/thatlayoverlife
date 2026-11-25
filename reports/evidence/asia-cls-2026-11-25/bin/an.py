"""Nov 25 asia-cls-check: summarise results/place.jsonl per case and variant (old = 16.69.0, new = 2c51cda).
flash: a frame where the grid is visible with more cards shown than at the end (all cards painted, then the place's).
leadMove: a frame where the grid is visible and its lead item is not the final one (the lead moved while the grid could be seen).
cardShift: a layout shift whose sources include a story card (a.tll-lib-card), the 0.0292 shift of check 3 note 1."""
import json, os, sys, collections, statistics as S
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'results')
rows = [json.loads(l) for l in open(os.path.join(R, 'place.jsonl'))]
G = collections.defaultdict(list)
for r in rows: G[(r['name'], r['v'])].append(r)
names = []
for r in rows:
    if r['name'] not in names: names.append(r['name'])
order = lambda n: (['Asia', 'Europe', 'Nowhere', 'none'].index(n.split()[1]), int(n.split()[2]), ['normal', 'late3s', 'hold5s'].index(n.split()[0]))
names.sort(key=order)
med = lambda xs: round(S.median(xs), 4) if xs else None
out = []
for n in names:
    for v in ('old', 'new'):
        L = G.get((n, v)) or []
        if not L: continue
        a = dict(case=n, v=v, n=len(L), endOK=0, flash=0, leadMove=0, cardShift=0, cardShiftVals=[], errs=0, cons=[], nav=0, nonGet=0, miss=0,
                 cls=[], clsLoad=[], pressed=set(), shown=set(), leadVisEnd=0, offMinusPress=[], offMinusDcl=[], hold=[], markOn=0)
        for r in L:
            s = r.get('act') or {}
            if not isinstance(s, dict) or r.get('navErr'): a['nav'] += 1; continue
            pw = s.get('pw') or {}
            a['endOK'] += 1 if s.get('gridVis') == 'visible' and not s.get('mark') else 0
            a['leadVisEnd'] += 1 if s.get('leadVis') else 0
            fin, flead = s.get('shown'), s.get('lead')
            fl = lm = False; seen = False
            for t in pw.get('fr', []):
                p = t.split(' ')  # time mark vis shown lead pressed
                if len(p) < 6 or p[2] != 'visible': continue
                seen = True
                if p[3].isdigit() and fin is not None and int(p[3]) > fin: fl = True
                if p[4].rstrip('*') != (flead or 'x'): lm = True
            a['flash'] += fl; a['leadMove'] += lm
            cs = [x for x in r['perf']['shifts'] if 'tll-lib-card' in x[2]]
            if cs: a['cardShift'] += 1; a['cardShiftVals'] += [x[1] for x in cs]
            a['errs'] += len(r['errs']); a['cons'] += [c for c in r['cons'] if c != 'Failed to load resource: net::ERR_FAILED']
            a['nonGet'] += r.get('nonGet', 0); a['miss'] += r.get('miss', 0) or 0
            a['cls'].append(r['perf']['cls']); a['clsLoad'].append(r['perfLoad']['cls'])
            a['pressed'].add(','.join(s.get('pressed') or []) or 'none'); a['shown'].add(fin)
            if pw.get('on') is not None: a['markOn'] += 1
            if pw.get('off') is not None and pw.get('pressedAt') is not None: a['offMinusPress'].append(pw['off'] - pw['pressedAt'])
            if pw.get('off') is not None and pw.get('dcl') is not None: a['offMinusDcl'].append(pw['off'] - pw['dcl'])
            a['hold'].append(r.get('hold', 0))
        a['pressed'] = sorted(a['pressed']); a['shown'] = sorted(x for x in a['shown'] if x is not None)
        a['clsMed'], a['clsMin'], a['clsMax'], a['clsLoadMed'] = med(a['cls']), min(a['cls']), max(a['cls']), med(a['clsLoad'])
        out.append(a)
json.dump(out, open(os.path.join(R, 'place-summary.json'), 'w'), indent=1, default=list)
lines = []
for a in out:
    rng = lambda xs: '%d..%d' % (min(xs), max(xs)) if xs else '-'
    lines.append('%-20s %-3s n=%d CLS med %.4f [%.4f..%.4f] atLoad %.4f | cardShift %d %s | flash %d | leadMove %d | end ok %d leadVis %d | markOn %d off-press %s off-dcl %s | pressed %s shown %s | errs %d cons %d nonGet %d miss %d nav %d' % (
        a['case'], a['v'], a['n'], a['clsMed'], a['clsMin'], a['clsMax'], a['clsLoadMed'], a['cardShift'], sorted(set(a['cardShiftVals'])), a['flash'], a['leadMove'],
        a['endOK'], a['leadVisEnd'], a['markOn'], rng(a['offMinusPress']), rng(a['offMinusDcl']), a['pressed'], a['shown'], a['errs'], len(a['cons']), a['nonGet'], a['miss'], a['nav']))
open(os.path.join(R, 'place-summary.txt'), 'w').write('\n'.join(lines) + '\n')
print('\n'.join(lines))
