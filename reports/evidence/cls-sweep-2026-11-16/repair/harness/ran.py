#!/usr/bin/env python3
"""Reads results/<set>.jsonl of the repair run and prints one line per scenario and arm (no page text).
usage: ran.py <set> [more]   more = also print the shift list of loads over 0.3"""
import json, sys, re, collections, statistics
R = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov17/repair/results/'
st = sys.argv[1]; more = len(sys.argv) > 2
rows = [json.loads(l) for l in open(R + st + '.jsonl') if l.strip()]
base = lambda i: re.sub(r'-r\d+$', '', i)
by = collections.defaultdict(lambda: collections.defaultdict(list))
for r in rows:
    if not r.get('ok'): print('FAILED', r['id'], r['arm'], r.get('fail')); continue
    e = r['stages'][-1]
    hold = {}
    for h in (e.get('holds') or []):
        hold.setdefault(h[0], []).append(h[1] + str(h[2]))
    d = dict(id=r['id'], arm=r['arm'], cls=e['cls'], late=round(sum(s['v'] for s in e['sh'] if e.get('loadT') and s['t'] > e['loadT'] + 1000), 4), sy=e['sy'], want=e.get('wantY'), docH=e['docH'],
             active=e.get('active'), left=e.get('left'), box=e['box'][:6], tree=e['tree'][:6], foc=e['foc'][:6], aria=e['aria'][:6], text=e['text'][:6], hold=hold, tap=r.get('tap'), menu=r.get('menu'),
             nonGet=r.get('nonGet'), errN=r.get('errN'), consN=r.get('consN'), fcp=e.get('fcp'), lcp=e.get('lcp'), stages=[(s['stage'], s['cls'], s.get('active')) for s in r['stages']], sh=e['sh'], marks=e.get('marks'))
    by[base(r['id'])][r['arm']].append(d)
for k in by:
    print('==', k)
    for arm in ['ctl', 'old', 'new']:
        L = by[k].get(arm) or []
        if not L: continue
        c = sorted(x['cls'] for x in L)
        print('  %-3s n=%d cls %s  median %.4f' % (arm, len(L), ' '.join('%.3f' % v for v in c), statistics.median(c)))
        for x in L:
            extra = []
            if x['want'] is not None: extra.append('want %s end %s (%+d) docH %s' % (x['want'], x['sy'], x['sy'] - x['want'], x['docH']))
            if x['hold']: extra.append('holds ' + ' '.join(k2.replace('tll-', '') + ':' + '/'.join(v) for k2, v in x['hold'].items()))
            if x['tap']: extra.append('tap ' + json.dumps(x['tap'].get('at')) + ' end ' + json.dumps(x['tap'].get('end')) + (' ERR ' + x['tap']['err'] if x['tap'].get('err') else ''))
            if x['tap'] or x['menu']: extra.append('active=' + str(x['active']) + ' stages ' + str(x['stages']))
            print('      %s cls %.4f late %.4f fcp %s box %s tree %s foc %s aria %s left %s err %s/%s nonGet %s %s' % (x['id'][-3:], x['cls'], x['late'], x['fcp'], x['box'], x['tree'], x['foc'], x['aria'], x['left'], x['errN'], x['consN'], x['nonGet'], ' | '.join(extra)))
            if more and x['cls'] > 0.3:
                for s in x['sh']:
                    if s['v'] > 0.01: print('          sh', s['t'], s['v'], s['rs'], [(a[0][-40:], a[1], a[2]) for a in s['src']])
