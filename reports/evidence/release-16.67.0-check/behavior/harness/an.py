"""Analysis of the 16.67.0 behavior check. python3 -I an.py <dir>   writes <dir>/out/summary.json, table.md, loads.csv, boxdiff.txt"""
import json, sys, os, gzip, statistics as S, collections, csv
D = sys.argv[1]; OUT = os.path.join(D, 'out'); os.makedirs(OUT, exist_ok=True)
rows = []
for s in ['A', 'B', 'C']:
    p = os.path.join(D, 'results', s + '.jsonl')
    if os.path.exists(p):
        for l in open(p):
            if l.strip(): rows.append(json.loads(l))
rows = [r for r in rows if r.get('ok')]
LAB = {('travelers', 390): (0.124, 0.010), ('travelers', 1440): (0.091, 0.006), ('map', 390): (0.140, 0.000), ('map', 1440): (0.108, 0.011),
       ('expats', 390): (0.077, 0.005), ('expats', 1440): (0.039, 0.0001), ('about', 390): (0.025, 0.0003), ('about', 1440): (0.057, 0.0005),
       ('account', 390): (0.012, 0.012), ('account', 1440): (0.301, 0.004), ('submit', 390): (0.144, 0.000), ('submit', 1440): (0.055, 0.0002),
       ('profile', 390): (0.076, 0.0004), ('profile', 1440): (0.118, 0.0008), ('stories', 390): (0.029, 0.007), ('stories', 1440): (0.050, 0.030)}
PIN = {'www': '3df16988', 'test': 'a254306f'}; SRI = {'www': 'sha384-trfI5wIn', 'test': 'sha384-2Bc75us2'}
order = ['travelers', 'map', 'expats', 'about', 'account', 'submit', 'profile', 'stories', 'home', 'layovers', 'login', 'balkans', 'lisbon', 'safrica']
cells = sorted({(r['page'], r['w']) for r in rows}, key=lambda c: (order.index(c[0]), c[1]))
med = lambda a: S.median(a) if a else None
def tb(r):
    f = os.path.join(D, 'boxes', '-'.join(map(str, [r['set'], r['page'], r['w'], r['host'], r['i']])) + '.tbox.gz')
    return gzip.open(f, 'rt').read().split('\n') if os.path.exists(f) else None
def trav_ok(a, b):
    """test list a against www list b: equal except the /travelers title height, everything under it moved by the same amount"""
    if len(a) != len(b): return False, 'count %d vs %d' % (len(a), len(b))
    dh = None; bad = []
    for x, y in zip(a, b):
        if x == y: continue
        nx, bx = x.rsplit(' ', 1); ny, by = y.rsplit(' ', 1)
        if nx != ny: bad.append('node ' + nx[:40] + ' vs ' + ny[:40]); continue
        X = list(map(int, bx.split(','))); Y = list(map(int, by.split(',')))
        if 'tll-travelers-title' in nx and X[0] == Y[0] and X[1] == Y[1] and X[2] == Y[2]:
            d = X[3] - Y[3]; dh = d if dh is None else dh; continue
        if dh is not None and X[0] == Y[0] and X[2] == Y[2] and X[3] == Y[3] and X[1] - Y[1] == dh: continue
        if dh is not None and X[0] == Y[0] and X[1] == Y[1] and X[2] == Y[2] and X[3] - Y[3] == dh: continue  # containers of the title grow by the same amount
        bad.append(nx[:50] + ' ' + bx + ' vs ' + by)
    return (not bad), ('title %+d px' % dh if dh is not None else '') + ('; ' + '; '.join(bad[:4]) if bad else '')
res = {}; diffs = []
for c in cells:
    R = {h: [r for r in rows if (r['page'], r['w']) == c and r['host'] == h] for h in ['www', 'test']}
    o = {}
    for h, L in R.items():
        cl = [r['cls'] for r in L]; ni = [r['clsNI'] for r in L]
        o[h] = dict(n=len(L), cls_med=med(cl), cls_max=max(cl) if cl else None, over=sum(x > 0.1 for x in cl), ni_med=med(ni), ni_max=max(ni) if ni else None, ni_over=sum(x > 0.1 for x in ni),
                    fcp=med([r['fcp'] for r in L if r['fcp'] is not None]), lcp=med([r['lcp'] for r in L if r['lcp'] is not None]),
                    core_ok=sum(r['core'] == [PIN[h] + ':200'] and r['selfDoc'] == 'function' and r['coreTag'] == PIN[h] + ' ' + SRI[h] for r in L),
                    left=collections.Counter(x for r in L for x in r['left']), errs=collections.Counter(e for r in L for e in r['errs']), errN=sum(r['errN'] for r in L),
                    cons=collections.Counter(e for r in L for e in r['cons']), consN=sum(r['consN'] for r in L),
                    doc1=sum(r['docN'] == 1 and r['status'] == 200 and r['endPath'] == 'same' for r in L), navAb=collections.Counter(x for r in L for x in r['navAborted']),
                    aborted=collections.Counter(x for r in L for x in r['aborted']), wfMedia=sum(r['wfMediaN'] for r in L), nonGet=sum(r['nonGet'] for r in L),
                    imgBad=med([r['imgBad'] for r in L]), hidHero=sum(r['hidHero'] for r in L), tries=sum(r['tries'] > 1 for r in L), othersAfter=sum(r['othersAfter'] for r in L),
                    holds=collections.Counter(x[0] + x[1] for r in L for x in r['holds']), titleH=collections.Counter(r['titleH'] for r in L), menuBtn=collections.Counter(r['menuBtn'] for r in L),
                    htmlClass=collections.Counter(r['htmlClass'] for r in L), docB=sum(r['docBytes'] for r in L), git=collections.Counter(x for r in L for x in r['git']))
        sw = [r for r in L if r['wait'].get('standIn', [None])[0] is not None]; o[h]['standIn'] = len(sw)
        o[h]['standInGone'] = sum(r['wait']['standIn'][1] is not None for r in sw)
    wb = {r['boxHash'] for r in R['www']}
    eq = sum(r['boxHash'] in wb for r in R['test']); o['boxEqual'] = eq; o['boxNote'] = ''
    if eq < len(R['test']):
        notes = []
        for r in R['test']:
            if r['boxHash'] in wb: continue
            a = tb(r); best = None
            for w in R['www']:
                b = tb(w)
                if a is None or b is None: continue
                if c[0] == 'travelers':
                    ok, why = trav_ok(a, b)
                    if ok: best = ('ok', why); break
                nd = sum(x != y for x, y in zip(a, b)) + abs(len(a) - len(b))
                if best is None or (best[0] != 'ok' and nd < best[1]): best = (nd, w['i'])
            notes.append(best)
            diffs.append([c, r['i'], best])
        o['boxNote'] = notes
        o['boxEqualTitle'] = eq + sum(1 for n in notes if n and n[0] == 'ok')
    o['wwwSame'] = len(wb); o['testSame'] = len({r['boxHash'] for r in R['test']})
    o['lab'] = LAB.get(c)
    res['%s %d' % c] = o
json.dump(res, open(os.path.join(OUT, 'summary.json'), 'w'), indent=1, default=lambda x: dict(x))
allrows = []
for s_ in ['A', 'B', 'C', 'F', 'G', 'H']:
    p_ = os.path.join(D, 'results', s_ + '.jsonl')
    if os.path.exists(p_): allrows += [json.loads(l) for l in open(p_) if l.strip()]
with open(os.path.join(OUT, 'loads.csv'), 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['set', 'page', 'width', 'host', 'round', 'at', 'cls', 'cls_input_excluded', 'shifts', 'fcp', 'lcp', 'dcl', 'load', 'core', 'core_tag', 'box', 'left_at_end', 'page_errors', 'console_errors', 'doc_bytes', 'img_not_drawn', 'doc_response_end'])
    for r in allrows: w.writerow([r['set'], 'contributor-profile' if r['page'] == 'profile' else r['page'], r['w'], r['host'], r['i'], r['at'], r['cls'], r['clsNI'], r['nSh'], r['fcp'], r['lcp'], r['dcl'], r['loadT'], ' '.join(r['core']), r['coreTag'], r['boxHash'][:10], ' '.join(r['left']), r['errN'], r['consN'], r['docBytes'], r['imgBad'], (r.get('nav') or [None, None])[1]])
f3 = lambda x: '-' if x is None else ('%.4f' % x if x < 0.01 else '%.3f' % x)
with open(os.path.join(OUT, 'table.md'), 'w') as f:
    f.write('| page | width | www CLS median / max / over 0.1 | test CLS median / max / over 0.1 | input excluded www / test (median) | lab median 16.66.0 to 16.67.0 | FCP www / test | LCP www / test | finished page equal to www |\n|---|---|---|---|---|---|---|---|---|\n')
    for c in cells:
        o = res['%s %d' % c]; a, b = o['www'], o['test']
        lab = '%s to %s' % (f3(o['lab'][0]), f3(o['lab'][1])) if o['lab'] else ''
        be = '%d of %d' % (o['boxEqual'], b['n']) + (' (%d with the title rule)' % o['boxEqualTitle'] if 'boxEqualTitle' in o else '')
        nm = {'map': '/the-map', 'expats': '/for-expats', 'profile': 'contributor profile', 'home': 'home', 'balkans': 'Balkans story', 'lisbon': 'Lisbon story', 'safrica': 'Southern Africa story'}.get(c[0], '/' + c[0])
        f.write('| %s | %d | %s / %s / %d of %d | %s / %s / %d of %d | %s / %s | %s | %s / %s | %s / %s | %s |\n' % (nm, c[1], f3(a['cls_med']), f3(a['cls_max']), a['over'], a['n'], f3(b['cls_med']), f3(b['cls_max']), b['over'], b['n'], f3(a['ni_med']), f3(b['ni_med']), lab, a['fcp'], b['fcp'], a['lcp'], b['lcp'], be))
with open(os.path.join(OUT, 'boxdiff.txt'), 'w') as f:
    for d in diffs: f.write(json.dumps(d) + '\n')
tot = {h: [r for r in rows if r['host'] == h] for h in ['www', 'test']}
print('loads', {h: len(v) for h, v in tot.items()}, 'over 0.1', {h: sum(r['cls'] > 0.1 for r in v) for h, v in tot.items()})
for c in cells:
    o = res['%s %d' % c]; a, b = o['www'], o['test']
    print('%-9s %4d www %s/%s/%d test %s/%s/%d ni %s/%s | fcp %s/%s lcp %s/%s | core %d/%d %d/%d | box %d/%d %s | left w%s t%s | err %d/%d cons %d/%d | doc1 %d/%d | si %d/%d gone %d' % (
        c[0], c[1], f3(a['cls_med']), f3(a['cls_max']), a['over'], f3(b['cls_med']), f3(b['cls_max']), b['over'], f3(a['ni_med']), f3(b['ni_med']), a['fcp'], b['fcp'], a['lcp'], b['lcp'],
        a['core_ok'], a['n'], b['core_ok'], b['n'], o['boxEqual'], b['n'], o.get('boxEqualTitle', ''), dict(a['left']), dict(b['left']), a['errN'], b['errN'], a['consN'], b['consN'], a['doc1'], b['doc1'], a['standIn'], b['standIn'], b['standInGone']))
