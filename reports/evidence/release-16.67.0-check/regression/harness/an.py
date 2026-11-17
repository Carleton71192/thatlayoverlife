#!/usr/bin/env python3
"""Analysis for the 16.67.0 regression check. Reads results/<set>.jsonl, writes out/table.md, out/summary.json, out/loads.csv.
No page text, no box lists, no member data: only numbers, hashes and masked paths."""
import json, os, sys, csv, statistics as stt
from collections import defaultdict
D = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov17/check1667-regression'
SETS = ['story', 'slow', 'signedin', 'fail', 'stq', 'reload', 'tap', 'consent', 'rm', 'jsoff', 'back', 'resize', 'w320']
os.makedirs(D + '/out', exist_ok=True)
med = lambda a: round(stt.median(a), 4) if a else None
def stage_cls(rec):
    """per stage: CLS of that stage alone (entries since the previous probe of the same document)"""
    out, prev = [], None
    for s in rec['stages']:
        sh = s['sh']
        if prev is not None and prev['timeOrigin'] == s['timeOrigin']:
            sh = sh[prev['nSh']:]
        out.append((round(sum(e['v'] for e in sh), 5), round(sum(e['v'] for e in sh if not e['inp']), 5), sh))
        prev = s
    return out
rows, cells = [], defaultdict(lambda: defaultdict(list))
for st in SETS:
    p = f'{D}/results/{st}.jsonl'
    if not os.path.exists(p): continue
    for l in open(p):
        if not l.strip(): continue
        r = json.loads(l)
        if not r.get('ok'):
            cells[(st, r['cell'], 'FAILED')][r['host']].append({'fail': r.get('fail', '')[:80]}); continue
        sc = stage_cls(r)
        for k, s in enumerate(r['stages']):
            c, ni, sh = sc[k]
            if r.get('tl') is not None and k == len(r['stages']) - 1:
                c = round(sum(x[0] for x in r['tl']), 5); ni = round(sum(x[0] for x in r['tl'] if not x[1]), 5)
            big = sorted(sh, key=lambda e: -e['v'])[:2]
            row = dict(set=st, cell=r['cell'], page=r['page'], w=r['w'], host=r['host'], i=r['i'], stage=s['stage'], cls=c, clsNI=ni, fcp=s.get('fcp'), lcp=s.get('lcp'), dcl=s.get('dcl'), load=s.get('loadT'),
                       box=s['boxHash'], text=s['textHash'], nBox=s['nBox'], docH=s['docH'], sy=s['sy'], wantY=s.get('wantY'), navType=s.get('navType'), persisted=s.get('persisted'),
                       left='|'.join(s['left']), focus=s.get('focus'), core='|'.join(r['core']), coreTag=s.get('coreTag'), selfDoc=s.get('selfDoc'), errN=r['errN'], errs=' / '.join(r['errs'][:3]), consN=r['consN'],
                       hooked='|'.join(r.get('hooked', [])), htmlMod=r.get('htmlMod'), nonGet=r['nonGet'], ads=';'.join(f'{a[0]}:{a[1]}' for a in r['ads']), docN=r['docN'], copyN=r['copyN'], docBytes=r['docBytes'],
                       wfMediaN=r['wfMediaN'], abortedN=r['abortedN'], navAborted='|'.join(r['navAborted']), imgBad=s.get('imgBad'), consent=s.get('consent'),
                       sel=json.dumps({k2: v for k2, v in s['sel'].items() if k2 != 'mapBoot'}), mapBoot=(s['sel'].get('mapBoot') or '')[:60], tap=json.dumps(r.get('tap')) if r.get('tap') else '',
                       top=' ; '.join(f"{e['v']:.4f}@{e['t']}{'i' if e['inp'] else ''} {e['src'][0][0][-60:] if e['src'] else ''}" for e in big))
            rows.append(row); cells[(st, r['cell'], s['stage'])][r['host']].append(row)
with open(D + '/out/loads.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); [w.writerow(r) for r in rows]
summ, lines = {}, []
lines.append('| set | cell | stage | www CLS median (max, over 0.1) | test CLS median (max, over 0.1) | input-excluded www / test median | FCP www / test | test finished page equals www | notes |')
lines.append('|---|---|---|---|---|---|---|---|---|')
for (st, cid, stg), hh in cells.items():
    if stg == 'FAILED':
        lines.append(f'| {st} | {cid} | FAILED | {len(hh.get("www", []))} | {len(hh.get("test", []))} | | | | |'); continue
    W, T = hh.get('www', []), hh.get('test', [])
    def d(a):
        c = [x['cls'] for x in a]; return dict(n=len(c), med=med(c), max=round(max(c), 4) if c else None, over=sum(1 for x in c if x > 0.1), niMed=med([x['clsNI'] for x in a]), fcp=med([x['fcp'] for x in a if x['fcp'] is not None]),
                                               lcp=med([x['lcp'] for x in a if x['lcp'] is not None]), boxes=sorted(set(x['box'] for x in a)))
    dw, dt = d(W), d(T)
    eq = sum(1 for x in T if x['box'] in set(y['box'] for y in W))
    notes = []
    lefts = sorted(set(x['left'] for x in T if x['left'])); notes += ['test left: ' + l for l in lefts]
    lw = sorted(set(x['left'] for x in W if x['left'])); notes += ['www left: ' + l for l in lw]
    ew, et = sum(x['errN'] for x in W), sum(x['errN'] for x in T)
    if ew or et: notes.append(f'page errors www {ew} / test {et}')
    if st in ('reload', 'back', 'stq') and stg in ('reloaded', 'back', 'back2'):
        notes.append('scroll www ' + ','.join(str(x['sy'] - (x['wantY'] or 0)) for x in W) + ' / test ' + ','.join(str(x['sy'] - (x['wantY'] or 0)) for x in T) + ' px from wanted')
    if st == 'consent':
        for h, a in (('www', W), ('test', T)):
            pre = [x['ads'] for x in a]; notes.append(h + ' ads: ' + ' || '.join(pre))
    if st == 'signedin':
        for h, a in (('www', W), ('test', T)):
            notes.append(h + ' sel: ' + ' || '.join(sorted(set(x['sel'] for x in a))))
    if st == 'tap':
        for h, a in (('www', W), ('test', T)):
            notes.append(h + ' tap: ' + ' || '.join(x['tap'] for x in a))
    if st == 'fail':
        for h, a in (('www', W), ('test', T)):
            mb = sorted(set(x['mapBoot'] for x in a if x['mapBoot']))
            if mb: notes.append(h + ' map line: ' + ' | '.join(mb))
    pins = sorted(set(x['core'] for x in T)) + ['www:'] + sorted(set(x['core'] for x in W))
    summ[f'{st}/{cid}/{stg}'] = dict(www=dw, test=dt, equal=f'{eq} of {len(T)}', pins=pins, notes=notes,
                                    topTest=[x['top'] for x in T], topWww=[x['top'] for x in W])
    lines.append(f"| {st} | {cid} | {stg} | {dw['med']} ({dw['max']}, {dw['over']} of {dw['n']}) | {dt['med']} ({dt['max']}, {dt['over']} of {dt['n']}) | {dw['niMed']} / {dt['niMed']} | {dw['fcp']} / {dt['fcp']} | {eq} of {len(T)} | {'; '.join(n for n in notes if not n.startswith(('www ads', 'test ads', 'www sel', 'test sel', 'www tap', 'test tap')))[:160]} |")
open(D + '/out/table.md', 'w').write('\n'.join(lines) + '\n')
json.dump(summ, open(D + '/out/summary.json', 'w'), indent=1)
print(len(rows), 'rows,', len(summ), 'cells')
