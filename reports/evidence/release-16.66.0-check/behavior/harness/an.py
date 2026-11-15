import json, sys, os, statistics as S, collections
B = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov15/check1666-behavior/'
files = sys.argv[1:] or ['phone.jsonl', 'desk.jsonl', 'restore.jsonl', 'other.jsonl', 'seeded.jsonl']
NAME = {'balkans': 'Balkans', 'croatia': 'Croatia', 'safrica': 'Southern Africa', 'madrid': 'Madrid', 'vietnam': 'Vietnam', 'phuket': 'Phuket', 'lisbon': 'Lisbon', 'home': 'Home', 'stories': '/stories'}
ORDER = list(NAME)
G = collections.defaultdict(list); rows = []
for f in files:
    p = B + 'out/' + f
    if not os.path.exists(p): continue
    for l in open(p):
        d = json.loads(l); rows.append(d)
        G[(d['page'], d['w'], d['mode'], d['host'])].append(d)
BOX = {}
def boxes(h):
    if h not in BOX: BOX[h] = [tuple(map(int, x.split(','))) for x in open(B + 'boxes/' + h + '.txt').read().split('\n') if x]
    return BOX[h]
def race(a, b):
    """same length, differences in one contiguous run of boxes, the run holds the same (left, width, height) multiset and spans the same band"""
    A, Bb = boxes(a), boxes(b)
    if len(A) != len(Bb): return False
    idx = [i for i in range(len(A)) if A[i] != Bb[i]]
    if not idx: return True
    i0, i1 = idx[0], idx[-1] + 1
    if i1 - i0 > 40: return False
    ra, rb = A[i0:i1], Bb[i0:i1]
    if sorted((x[0], x[2], x[3]) for x in ra) != sorted((x[0], x[2], x[3]) for x in rb): return False
    ba = (min(x[1] for x in ra), max(x[1] + x[3] for x in ra)); bb = (min(x[1] for x in rb), max(x[1] + x[3] for x in rb))
    return abs(ba[0] - bb[0]) <= 2 and abs(ba[1] - bb[1]) <= 2
LBL = {'fresh': '', 'restore': ' reload', 'seeded': ' seeded'}; LBL2 = {'fresh': '', 'restore': ' reload at 2,500', 'seeded': ' (Math.random seeded)'}
med = lambda a: round(S.median(a), 4) if a else None
cells = []; summ = {}
keys = sorted(set((k[0], k[1], k[2]) for k in G), key=lambda k: (k[2] != 'fresh', ORDER.index(k[0]), k[1]))
for (pg, w, mode) in keys:
    for host in ('www', 'test'):
        L = [d for d in G.get((pg, w, mode, host), []) if not d.get('err')]
        if not L: continue
        cls = [d['cls'] for d in L]; cls4 = [d['cls4'] for d in L]
        want = '3df16988' if host == 'test' else '6ec769bb'
        coreOk = sum(1 for d in L if d['coreResp'] == [want + ':200'] and len(d['core']) == 1 and d['core'][0].startswith(want) and d['selfDoc'] != 'undefined')
        www = set(d['bh'] for d in G.get((pg, w, mode, 'www'), []) if not d.get('err'))
        exact = sum(1 for d in L if d['bh'] in www)
        rc = sum(1 for d in L if d['bh'] not in www and any(race(d['bh'], x) for x in www))
        story = pg not in ('home', 'stories')
        r = dict(page=NAME[pg], w=w, mode=mode, host=host, loads=len(L), coreOk=coreOk,
                 clsMed=med(cls), clsMax=round(max(cls), 4), over=sum(1 for x in cls if x > 0.1), cls4Med=med(cls4),
                 fcpMed=med([d['fcp'] for d in L if d['fcp'] is not None]), lcpMed=med([d['lcpT'] for d in L if d['lcpT'] is not None]),
                 lcpEl=dict(collections.Counter(d['lcpEl'] for d in L)),
                 pageErrors=sum(len(d['errs']) for d in L), scriptBad=sum(len(d['scriptBad']) for d in L),
                 holdsSeen=sum(1 for d in L if d['waitSeen']), holdsLeft=sum(1 for d in L if d['waitEnd']),
                 standinSeen=sum(1 for d in L if d['ph']['seen'] is not None), standinLeft=sum(1 for d in L if d['phEnd']),
                 earlySeen=sum(1 for d in L if d['es']['seen']), earlyLeft=sum(1 for d in L if d['esEnd']), hiddenInHero=sum(1 for d in L if d['hidHero']),
                 boxExact=exact, boxRace=rc, boxOther=len(L) - exact - rc, layouts=len(set(d['bh'] for d in L)),
                 yEnd=sorted(set(d['y'] for d in L)), heroLoaded=sum(1 for d in L if d.get('heroVis') and d['heroVis']['vis'] and d['heroVis']['nw'] > 0),
                 blocked=sorted(set(b for d in L for b in d['blocked'])), flagPh=sum(d['flagPh'] for d in L), bad=sum(1 for d in L if d['bad']),
                 cls=cls, fcp=[d['fcp'] for d in L], lcp=[d['lcpT'] for d in L])
        cells.append(r); summ[f"{NAME[pg]} {w}{LBL[mode]} {host}"] = r
json.dump(summ, open(B + 'out/summary.json', 'w'), indent=1)
# table
P = {}
for r in cells: P.setdefault((r['page'], r['w'], r['mode']), {})[r['host']] = r
out = ['| cell | loads (www/test) | test core 3df16988 ok | CLS median www | CLS median test | CLS max www | CLS max test | loads > 0.1 www / test | FCP median ms www / test | LCP median ms www / test | page errors www / test | test holds seen / left | test stand-in seen / left | test early style seen / left | test finished page = www (exact + foot race) |',
       '|' + '---|' * 15]
for (pg, w, mode), h in P.items():
    a, b = h.get('www'), h.get('test')
    if not a or not b: continue
    out.append(f"| {pg} {w}{LBL2[mode]} | {a['loads']}/{b['loads']} | {b['coreOk']}/{b['loads']} | {a['clsMed']} | {b['clsMed']} | {a['clsMax']} | {b['clsMax']} | {a['over']} / {b['over']} | {a['fcpMed']} / {b['fcpMed']} | {a['lcpMed']} / {b['lcpMed']} | {a['pageErrors']} / {b['pageErrors']} | {b['holdsSeen']} / {b['holdsLeft']} | {b['standinSeen']} / {b['standinLeft']} | {b['earlySeen']} / {b['earlyLeft']} | {b['boxExact']} + {b['boxRace']} of {b['loads']} |")
open(B + 'out/table.md', 'w').write('\n'.join(out) + '\n')
print('\n'.join(out))
# totals
T = collections.Counter()
for r in cells:
    h = r['host']
    for k in ('loads', 'coreOk', 'over', 'pageErrors', 'scriptBad', 'holdsLeft', 'standinLeft', 'earlyLeft', 'hiddenInHero', 'boxExact', 'boxRace', 'boxOther', 'bad'): T[h + ' ' + k] += r[k]
print(dict(T))
ph = lambda host, mode='fresh': [x for r in cells if r['host'] == host and r['mode'] == mode and r['w'] < 800 and r['page'] not in ('Home', '/stories') for x in r['cls']]
for h in ('www', 'test'):
    a = ph(h); print(h, 'story phone fresh loads', len(a), 'median', med(a), 'max', max(a) if a else None, 'over', sum(1 for x in a if x > 0.1))
    cm = [r['clsMed'] for r in cells if r['host'] == h and r['mode'] == 'fresh' and r['w'] < 800 and r['page'] not in ('Home', '/stories')]; print(h, 'median phone cell', med(cm))
print('errors in loads', sum(1 for d in rows if d.get('err')), 'reruns', sum(d['tries'] - 1 for d in rows), 'waited s', sum(d.get('waited', 0) for d in rows))
nb = json.load(open(B + 'out/net-bytes.json')); print('bytes', {k: v for k, v in nb.items() if k not in ('wfu', 'jsdu', 'blocked', 'flagPh')}, 'blocked', nb['blocked'], 'flagPh', nb['flagPh'])
