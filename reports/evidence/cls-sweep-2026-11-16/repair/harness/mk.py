#!/usr/bin/env python3
"""Writes out/loads.csv (one row per load of the repair run, no page text) and out/table.md (per scenario and arm). usage: mk.py"""
import json, re, os, collections, statistics, csv, subprocess
R = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov17/repair/'
os.makedirs(R + 'out', exist_ok=True)
SETS = ['n1', 'n2', 'n2c', 'n3', 'n7', 'xtra', 'xmap', 'xhome', 'reg']
rows = []
for st in SETS:
    for l in open(R + 'results/' + st + '.jsonl'):
        if not l.strip(): continue
        r = json.loads(l); e = r['stages'][-1]
        rel = {}
        for h in e.get('holds') or []:
            if h[1] == '-': rel[h[0]] = h[2]
        rows.append(dict(set=st, id=r['id'], arm=r['arm'], ok=r.get('ok'), cls=e['cls'], cls_late=round(sum(s['v'] for s in e['sh'] if e.get('loadT') and s['t'] > e['loadT'] + 1000), 5), fcp=e.get('fcp'), lcp=e.get('lcp'),
            box=e['box'], tree=e['tree'], focus=e['foc'], aria=e['aria'], want_y=e.get('wantY', ''), end_y=e['sy'] if e.get('wantY') is not None else '', doc_h=e['docH'],
            map_hold_gone_ms=rel.get('tll-fp-map-v1', ''), title_hold_gone_ms=rel.get('tll-es-libtitle-v1', ''), note_hold_gone_ms=rel.get('tll-fp-note-v1', ''),
            active=e.get('active', '') if (r.get('tap') or r.get('menu')) else '', menu_open=(r['tap'].get('end') or {}).get('open', '') if r.get('tap') else '', left=' '.join(e.get('left') or []), page_errors=r.get('errN'), non_get_aborted=r.get('nonGet')))
with open(R + 'out/loads.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); [w.writerow(x) for x in rows]
base = lambda i: re.sub(r'-r\d+$', '', i)
out = ['# Repair after the adversarial check: every scenario (17 November 2026)', '',
       'Arms: control = the live 16.66.0 core, before = the afe01e7 build, after = the repaired build. CLS = the sum of every layout-shift entry. One line per scenario and arm, loads in order of CLS. Rows per load: loads.csv.', '']
for st in SETS[:-1]:
    by = collections.defaultdict(lambda: collections.defaultdict(list))
    for x in rows:
        if x['set'] == st: by[base(x['id'])][x['arm']].append(x)
    out += ['## set ' + st, '', '| scenario | arm | loads | CLS | extra |', '|---|---|---|---|---|']
    for k in by:
        boxes = set()
        for arm, name in [('ctl', 'control'), ('old', 'before'), ('new', 'after')]:
            L = by[k].get(arm)
            if not L: continue
            ex = []
            if L[0]['want_y'] != '': ex.append('end position against the old one: ' + ', '.join('%+d' % (x['end_y'] - x['want_y']) for x in L))
            for key, nm in [('map_hold_gone_ms', 'map hold gone at'), ('title_hold_gone_ms', 'title hold gone at'), ('note_hold_gone_ms', 'note hold gone at')]:
                v = [x[key] for x in L if x[key] != '']
                if v: ex.append('%s %s ms' % (nm, ', '.join(str(a) for a in v)))
            if any(x['active'] for x in L): ex.append('focus ends on ' + ', '.join(sorted(set(x['active'] for x in L))))
            late = [x['cls_late'] for x in L if x['cls_late'] > 0.001]
            if late and st == 'n3': ex.append('late part ' + ', '.join('%.3f' % v for v in late))
            ex.append('finished page: ' + ', '.join(sorted(set(x['box'][:6] for x in L))))
            out.append('| %s | %s | %d | %s | %s |' % (k.replace('profile', 'contributors/<profile>'), name, len(L), ' '.join('%.3f' % v for v in sorted(x['cls'] for x in L)), '; '.join(ex)))
    out.append('')
out += ['## set reg (the regression table)', '']
out += subprocess.run(['python3', R + 'harness/reg.py'], capture_output=True, text=True).stdout.strip().split('\n')
open(R + 'out/table.md', 'w').write('\n'.join(out) + '\n')
print(len(rows), 'rows;', sum(1 for x in rows if not x['ok']), 'failed;', 'non-GET aborted', sum(x['non_get_aborted'] or 0 for x in rows), '; page errors by arm', {a: sum(x['page_errors'] or 0 for x in rows if x['arm'] == a) for a in ['ctl', 'old', 'new']})
print('left behind:', collections.Counter(x['arm'] + ' ' + x['left'] for x in rows if x['left']))
