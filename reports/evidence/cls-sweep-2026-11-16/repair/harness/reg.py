#!/usr/bin/env python3
"""The regression table of the repair run: reads results/reg.jsonl (20 cells, 3 loads a cell and arm) and prints a markdown table.
CLS = the sum of every layout-shift entry. No page text is read or written."""
import json, re, collections, statistics, sys
R = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov17/repair/results/'
rows = [json.loads(l) for l in open(R + 'reg.jsonl') if l.strip()]
NAME = {'travelers': '/travelers', 'map': '/the-map', 'expats': '/for-expats', 'about': '/about', 'account': '/account', 'submit': '/submit', 'profile': '/contributors/<profile>',
        'stories': '/stories', 'home': '/', 'lisbon': 'story: Lisbon'}
by = collections.defaultdict(lambda: collections.defaultdict(dict))
bad = 0; nonget = 0; left = collections.Counter(); errs = collections.Counter()
for r in rows:
    if not r.get('ok'): bad += 1; continue
    m = re.match(r'(\w+)-(\d+)-r(\d+)$', r['id']); e = r['stages'][-1]
    by[(m.group(1), int(m.group(2)))][r['arm']][int(m.group(3))] = e
    nonget += r.get('nonGet') or 0
    for x in e.get('left') or []: left[r['arm'] + ' ' + x] += 1
    errs[r['arm']] += r.get('errN') or 0
med = statistics.median
print('| cell | control median | control max | control over 0.1 | new median | new max | new over 0.1 | FCP control / new | boxes equal | tree equal |')
print('|---|---|---|---|---|---|---|---|---|---|')
tot = [0, 0, 0]; worse = []
for p in ['travelers', 'map', 'expats', 'about', 'account', 'submit', 'profile', 'stories', 'home', 'lisbon']:
    for w in [390, 1440]:
        c = by[(p, w)]['ctl']; n = by[(p, w)]['new']
        cv = [c[i]['cls'] for i in sorted(c)]; nv = [n[i]['cls'] for i in sorted(n)]
        rounds = sorted(set(c) & set(n))
        beq = sum(1 for i in rounds if c[i]['box'] == n[i]['box']); teq = sum(1 for i in rounds if c[i]['tree'] == n[i]['tree'])
        # a new load whose box list equals any control load of the cell also counts as an end state the control reaches
        cb = set(c[i]['box'] for i in c); beq2 = sum(1 for i in n if n[i]['box'] in cb)
        fc = med([c[i]['fcp'] for i in c if c[i]['fcp'] is not None]); fn = med([n[i]['fcp'] for i in n if n[i]['fcp'] is not None])
        print('| %s %d | %.4f | %.4f | %d of %d | %.4f | %.4f | %d of %d | %d / %d | %d of %d%s | %d of %d |' % (NAME[p], w, med(cv), max(cv), sum(v > 0.1 for v in cv), len(cv), med(nv), max(nv), sum(v > 0.1 for v in nv), len(nv), fc, fn,
              beq, len(rounds), '' if beq2 == beq else ' (%d of %d against any control load)' % (beq2, len(n)), teq, len(rounds)))
        tot[0] += len(cv); tot[1] += len(nv)
        if med(nv) > med(cv) + 0.01: worse.append((p, w, med(cv), med(nv)))
print()
print('loads: control %d, new %d; failed %d; non-GET requests aborted %d; left behind: %s; page errors: %s' % (tot[0], tot[1], bad, nonget, dict(left), dict(errs)))
print('cells where the new median is more than 0.01 over the control:', worse)
