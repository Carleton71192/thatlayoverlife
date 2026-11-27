"""27 Nov late-lead: summarise results/lead.jsonl per case and variant (old = core 16.70.0 at a2ad2ad, new = claude/late-lead-2026-11-27).
lead first: the lead mark is on the first visible grid item at the end (one mark). lead hidden: the mark is on a hidden item at the end.
hidFr: loads with a frame where the grid is visible and the lead mark is on a hidden item (sampled every animation frame up to 12 s).
leadMove: loads with a frame where the grid is visible and the lead mark is not yet on its final item.
cardShift: loads with a layout shift whose source is a story card. CLS: after a scroll to the bottom and back (click cases: also after the click)."""
import json, os, sys, collections, statistics as S
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'results')
rows = [json.loads(l) for l in open(os.path.join(R, 'lead.jsonl'))]
G = collections.defaultdict(list); names = []
for r in rows:
    G[(r['name'], r['v'])].append(r)
    if r['name'] not in names: names.append(r['name'])
med = lambda xs: round(S.median(xs), 4) if xs else None
out = []
for n in names:
    for v in ('old', 'new'):
        L = G.get((n, v)) or []
        a = dict(case=n, v=v, n=len(L), first=0, hidden=0, none=0, multi=0, hidFr=0, leadMove=0, cardShift=0, errs=0, nonGet=0, nav=0, miss=0, cls=[], clsAfter=[], shown=set(), pressed=set(), wf=0)
        for r in L:
            s = r.get('act') or {}
            if not isinstance(s, dict) or r.get('navErr'): a['nav'] += 1; continue
            lp = s.get('leadPos') or {}
            if lp.get('nLead', 0) > 1: a['multi'] += 1
            if lp.get('nLead') == 0: a['none'] += 1
            elif lp.get('pos') == 0: a['first'] += 1
            elif lp.get('pos') == -1: a['hidden'] += 1
            fin = s.get('lead'); hf = lm = False
            for t in (s.get('pw') or {}).get('fr', []):
                p = t.split(' ')
                if len(p) < 6 or p[2] != 'visible': continue
                if p[4].endswith('*'): hf = True
                if p[4].rstrip('*') != (fin or 'x'): lm = True
            a['hidFr'] += hf; a['leadMove'] += lm
            if any('tll-lib-card' in x[2] for x in r['perf']['shifts']): a['cardShift'] += 1
            a['errs'] += len(r['errs']); a['nonGet'] += r.get('nonGet', 0); a['miss'] += r.get('miss', 0) or 0
            a['cls'].append(r['perf']['cls'])
            if s.get('clsNow') is not None: a['clsAfter'].append(s['clsNow'])
            a['shown'].add(s.get('shown')); a['pressed'].add(','.join(s.get('pressed') or []) or 'none')
        a['shown'] = sorted(x for x in a['shown'] if x is not None); a['pressed'] = sorted(a['pressed'])
        out.append(a)
json.dump(out, open(os.path.join(R, 'lead-summary.json'), 'w'), indent=1, default=list)
lines = []
for a in out:
    if not a['n']: continue
    c = a['cls']; ca = a['clsAfter']
    lines.append('%-22s %-3s n=%d | lead first %d hidden %d none %d multi %d | hidFr %d leadMove %d | CLS med %s [%s..%s] after-act med %s [%s..%s] | cardShift %d | shown %s pressed %s | errs %d nonGet %d miss %d nav %d' % (
        a['case'], a['v'], a['n'], a['first'], a['hidden'], a['none'], a['multi'], a['hidFr'], a['leadMove'], med(c), min(c) if c else '-', max(c) if c else '-',
        med(ca), min(ca) if ca else '-', max(ca) if ca else '-', a['cardShift'], a['shown'], a['pressed'], a['errs'], a['nonGet'], a['miss'], a['nav']))
open(os.path.join(R, 'lead-summary.txt'), 'w').write('\n'.join(lines) + '\n')
print('\n'.join(lines))
