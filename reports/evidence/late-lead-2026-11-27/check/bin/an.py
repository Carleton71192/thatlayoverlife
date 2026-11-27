"""27 Nov late-lead-check: summarise results/<set>.jsonl (load, click, brk) per case and variant.
ok: the lead rule holds (one lead mark, on the first visible grid item; no mark when nothing is visible).
end ok: at the end of the load (after the scroll and any clicks). badFr: loads with an animation frame where the grid is visible and the
rule does not hold. hidFr: loads with a frame where the grid is visible and the mark is on a hidden item. inClick: chip clicks where the
rule holds at the end of the click event (after every document listener); at50: the same 50 ms later. leads: final lead items (hashed).
CLS: after the scroll to the bottom and back (and after the clicks in act; the clicks are input, so a shift within 500 ms is excluded)."""
import json, os, sys, collections, statistics as S
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'results')
med = lambda xs: round(S.median(xs), 4) if xs else None
def okst(s): return bool(s) and (s['onFirst'] if s['nVis'] else s['nLead'] == 0)
def summ(setname):
    p = os.path.join(R, setname + '.jsonl')
    if not os.path.exists(p): return []
    rows = [json.loads(l) for l in open(p)]
    G = collections.defaultdict(list); names = []
    for r in rows:
        G[(r['name'], r['v'])].append(r)
        if r['name'] not in names: names.append(r['name'])
    out = []
    for n in names:
        for v in ('old', 'new'):
            L = G.get((n, v)) or []
            a = dict(case=n, v=v, n=len(L), endOk=0, endHidden=0, badFr=0, hidFr=0, clicks=0, inClick=0, at50=0, cardShift=0, errs=0, cons=set(), nonGet=0, miss=0, guard=0, navs=0, nav=0,
                     cls=[], clsLoad=[], leads=collections.Counter(), pressed=collections.Counter(), shown=collections.Counter(), shows=collections.Counter(), extra=[])
            for r in L:
                a['navs'] += r.get('navs') or 0
                act = r.get('act')
                if not isinstance(act, dict) or r.get('navErr'): a['nav'] += 1; a['extra'].append(str(act)[:120] + ' ' + str(r.get('navErr'))); continue
                end = act.get('end') or act.get('back2') or act
                s = end.get('s') if isinstance(end, dict) else None
                if okst(s): a['endOk'] += 1
                if s and s['leadHidden']: a['endHidden'] += 1
                if s: a['leads'][s['lid'] + ('(noimg)' if s['noimg'] else '')] += 1; a['pressed'][s['pressed']] += 1; a['shown'][s['nVis']] += 1
                pws = [x.get('pw') for x in ([act.get(k) for k in ('before', 'back1', 'back2')] if 'back2' in act else [end]) if isinstance(x, dict) and x.get('pw')]
                bf = hf = False
                for pw in pws:
                    for t in pw.get('fr', []):
                        q = t.split(' ')
                        if len(q) < 8 or q[2] != 'visible': continue
                        if q[6] == 'BAD': bf = True
                        if q[5].endswith('*'): hf = True
                    for c in pw.get('clicks', []):
                        a['clicks'] += 1; a['inClick'] += bool(c.get('inClick') and c['inClick'].get('ok')); a['at50'] += bool(c.get('at50') and c['at50'].get('ok'))
                    for sh in pw.get('shows', []): a['shows'][sh.split(' ')[0]] += 1
                a['badFr'] += bf; a['hidFr'] += hf
                if 'burst' in act:
                    a['extra'].append('burst ' + ' '.join(('ok' if okst(x) else 'BAD') if isinstance(x, dict) else str(x) for x in act['burst']))
                if 'steps' in act:
                    a['extra'].append('steps ' + ' '.join('%s:%s/%s%s' % (x['s']['pressed'], x['s']['nVis'], x['s']['nLead'], '' if okst(x['s']) else '(BAD)') for x in act['steps'] if x.get('s')))
                for k in ('before', 'back1', 'back2'):
                    if isinstance(act.get(k), dict) and act[k].get('s'):
                        x = act[k]; a['extra'].append('%s %s %s:%s/%s%s shows=%s' % (k, x['url'], x['s']['pressed'], x['s']['nVis'], x['s']['nLead'], '' if okst(x['s']) else '(BAD)', (x.get('pw') or {}).get('shows')))
                if any('tll-lib-card' in x[2] for x in r['perf']['shifts']): a['cardShift'] += 1
                a['errs'] += len(r['errs']); a['cons'].update(r['cons']); a['nonGet'] += r.get('nonGet', 0); a['miss'] += r.get('miss', 0) or 0; a['guard'] += r.get('guardHit', 0) or 0
                a['cls'].append(r['perf']['cls']); a['clsLoad'].append(r['perfLoad']['cls'])
            out.append(a)
    return out
def fmt(a):
    c, cl = a['cls'], a['clsLoad']
    s = '%-46s %-3s n=%d | end ok %d hidden %d | badFr %d hidFr %d | clicks %d inClick ok %d at50 ok %d | CLS %s [%s..%s] load %s | cardShift %d | leads %s | pressed %s shown %s | errs %d cons %d nonGet %d miss %d guard %d navs %d navErr %d%s' % (
        a['case'], a['v'], a['n'], a['endOk'], a['endHidden'], a['badFr'], a['hidFr'], a['clicks'], a['inClick'], a['at50'], med(c), min(c) if c else '-', max(c) if c else '-', med(cl),
        a['cardShift'], dict(a['leads']), dict(a['pressed']), dict(a['shown']), a['errs'], len(a['cons']), a['nonGet'], a['miss'], a['guard'], a['navs'], a['nav'], (' | shows ' + str(dict(a['shows']))) if a['shows'] else '')
    return s
if __name__ == '__main__':
    allr = {}
    for st in (sys.argv[1:] or ['load', 'click', 'brk']):
        res = summ(st); allr[st] = res
        lines = [fmt(a) for a in res if a['n']]
        ex = []
        for a in res:
            for e in sorted(set(a['extra'])): ex.append('  %s %s: %s' % (a['case'], a['v'], e))
        txt = '\n'.join(lines) + ('\n' + '\n'.join(ex) if ex and st == 'brk' else '') + '\n'
        open(os.path.join(R, st + '-summary.txt'), 'w').write(txt); print('==', st); print(txt)
    json.dump(allr, open(os.path.join(R, 'summary.json'), 'w'), indent=1, default=lambda o: dict(o) if isinstance(o, collections.Counter) else sorted(o) if isinstance(o, set) else str(o))
