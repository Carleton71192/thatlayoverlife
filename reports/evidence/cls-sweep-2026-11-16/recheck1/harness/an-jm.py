#!/usr/bin/env python3
"""Judge-measure analysis: reads results/<set>.jsonl and boxes/, writes cells.json, loads.csv and table.md into the output folder.
Usage: python3 an.py <outdir>   (sets std, cpu, lay and trav8 are read if present)"""
import json, gzip, os, sys, statistics, difflib, collections, csv
J = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'jm')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(J, 'out')
os.makedirs(OUT, exist_ok=True)
NAME = {'home': '/', 'stories': '/stories', 'travelers': '/travelers', 'layovers': '/layovers', 'map': '/the-map', 'expats': '/for-expats',
        'paw': '/the-paw-passport', 'about': '/about', 'cookies': '/cookies', 'account': '/account', 'submit': '/submit', 'login': '/login',
        'signup': '/signup', 'profile': '/contributors/<profile>', 'balkans': 'Balkans story', 'lisbon': 'Lisbon story', 'safrica': 'Southern Africa story'}
CLAIMED = {(p, w) for p in ['travelers', 'map', 'expats', 'about', 'account', 'submit', 'profile', 'stories'] for w in (390, 1440)}
med = lambda a: statistics.median(a) if a else None

def load(setname):
    p = os.path.join(J, 'results', setname + '.jsonl'); rows = {}
    if not os.path.exists(p): return []
    for l in open(p):
        l = l.strip()
        if not l: continue
        try: r = json.loads(l)
        except Exception: continue
        if r.get('ok'): rows[(r['page'], r['w'], r['arm'], r['i'])] = r
    return list(rows.values())

def gz(setname, r, ext):
    p = os.path.join(J, 'boxes', '-'.join([setname, r['page'], str(r['w']), r['arm'], str(r['i'])]) + '.' + ext + '.gz')
    return gzip.open(p, 'rt', encoding='utf-8').read() if os.path.exists(p) else ''

def norm_tree(t):
    """head children as a sorted list (insert order of injected styles and scripts varies with timing); body in order,
    without the direct-child iframes that the consent and ad scripts add at a time of their own."""
    tree = t.split('\n--styles--\n')[0].split('\n'); head, body, where = [], [], None
    for l in tree:
        d = len(l) - len(l.lstrip(' '))
        if d == 1: where = 'head' if l.strip().startswith('head') else 'body'
        if where == 'head': head.append(l)
        elif where == 'body':
            if d == 2 and l.strip().startswith('iframe'): continue
            body.append(l)
    return sorted(head), body

def styles_of(t):
    parts = t.split('\n--styles--\n')
    if len(parts) < 2: return []
    return sorted(parts[1].split('\n--text--\n')[0].split('\n'))

def cell_stats(setname, rows):
    cells = collections.defaultdict(lambda: {'ctl': [], 'new': []})
    for r in rows: cells[(r['page'], r['w'])][r['arm']].append(r)
    out = []
    for (pg, w), arms in cells.items():
        c = {'set': setname, 'page': pg, 'name': NAME[pg], 'w': w, 'claimed': (pg, w) in CLAIMED}
        for a in ('ctl', 'new'):
            rs = sorted(arms[a], key=lambda r: r['i']); v = [r['cls'] for r in rs]
            c[a] = {'n': len(rs), 'cls': v, 'clsMed': med(v), 'clsMax': max(v) if v else None, 'over01': sum(1 for x in v if x > 0.1),
                    'clsNIMed': med([r['clsNI'] for r in rs]), 'fcp': [r['fcp'] for r in rs], 'lcp': [r['lcp'] for r in rs],
                    'fcpMed': med([r['fcp'] for r in rs if r['fcp'] is not None]), 'lcpMed': med([r['lcp'] for r in rs if r['lcp'] is not None]),
                    'dclMed': med([r['dcl'] for r in rs]), 'loadMed': med([r['loadT'] for r in rs]),
                    'boxHashes': collections.Counter(r['boxHash'] for r in rs), 'tboxHashes': collections.Counter(r['tboxHash'] for r in rs),
                    'textHashes': collections.Counter(r['textHash'] for r in rs), 'htmlClass': collections.Counter(r['htmlClass'] for r in rs),
                    'docH': collections.Counter(r['docH'] for r in rs), 'errN': sum(r['errN'] for r in rs), 'consErr': collections.Counter(r['consErr'] for r in rs),
                    'aborted': collections.Counter(r['abortedN'] for r in rs), 'imgReq': collections.Counter(r.get('imgReqHash') for r in rs),
                    'marks': sum(r['marks']['esGhost'] + r['marks']['esNav'] + r['marks']['holdAttrs'] for r in rs),
                    'selfDoc': collections.Counter(r['selfDoc'] for r in rs), 'coreN': collections.Counter(r['coreN'] for r in rs), 'nonGet': sum(r['nonGet'] for r in rs),
                    'lcpEl': collections.Counter((r['lcpEl'] or ['', ''])[1].split('>')[-1] for r in rs), 'others': sum(r.get('othersSeen', 0) for r in rs)}
        C, N = c['ctl'], c['new']
        if not C['n'] or not N['n']: out.append(c); continue
        c['dMed'] = N['clsMed'] - C['clsMed']; c['dFcp'] = N['fcpMed'] - C['fcpMed']; c['dLcp'] = N['lcpMed'] - C['lcpMed']
        # finished page: every new load must end on a box list that a control load of the same cell also ended on
        c['boxEqual'] = all(h in C['boxHashes'] for h in N['boxHashes']); c['boxNewOnly'] = sum(n for h, n in N['boxHashes'].items() if h not in C['boxHashes'])
        c['tboxEqual'] = all(h in C['tboxHashes'] for h in N['tboxHashes']); c['textEqual'] = all(h in C['textHashes'] for h in N['textHashes'])
        c['htmlClassEqual'] = set(N['htmlClass']) <= set(C['htmlClass'])
        c['imgReqEqual'] = set(N['imgReq']) <= set(C['imgReq'])
        # trees and style lists, normalized, first load of each arm plus any differing ones
        ct = {}; nt = {}
        for a, store in (('ctl', ct), ('new', nt)):
            for r in arms[a]:
                t = gz(setname, r, 'tree'); h, b = norm_tree(t); store[r['i']] = ('\n'.join(h), '\n'.join(b), '\n'.join(styles_of(t)))
        cb = {v[1] for v in ct.values()}; ch = {v[0] for v in ct.values()}; cs = {v[2] for v in ct.values()}
        c['bodyTreeEqual'] = all(v[1] in cb for v in nt.values()); c['headSetEqual'] = all(v[0] in ch for v in nt.values()); c['stylesEqual'] = all(v[2] in cs for v in nt.values())
        diffs = {}
        if not c['bodyTreeEqual']:
            a = next(iter(ct.values()))[1].split('\n'); b = next(v[1] for v in nt.values() if v[1] not in cb).split('\n')
            diffs['bodyTree'] = [l for l in difflib.unified_diff(a, b, lineterm='', n=0) if not l.startswith(('---', '+++', '@@'))][:12]
        if not c['headSetEqual']:
            a = next(iter(ct.values()))[0].split('\n'); b = next(v[0] for v in nt.values() if v[0] not in ch).split('\n')
            diffs['head'] = [l for l in difflib.unified_diff(a, b, lineterm='', n=0) if not l.startswith(('---', '+++', '@@'))][:12]
        if not c['stylesEqual']:
            a = next(iter(ct.values()))[2].split('\n'); b = next(v[2] for v in nt.values() if v[2] not in cs).split('\n')
            diffs['styles'] = [l for l in difflib.unified_diff(a, b, lineterm='', n=0) if not l.startswith(('---', '+++', '@@'))][:12]
        if not c['boxEqual'] or not c['tboxEqual']:
            rn = next(r for r in arms['new'] if r['tboxHash'] not in C['tboxHashes']); rc = sorted(arms['ctl'], key=lambda r: r['i'])[0]
            a = gz(setname, rc, 'tbox').split('\n'); b = gz(setname, rn, 'tbox').split('\n')
            d = [l for l in difflib.unified_diff(a, b, lineterm='', n=0) if not l.startswith(('---', '+++', '@@'))]
            diffs['boxes'] = {'ctlLoad': rc['i'], 'newLoad': rn['i'], 'linesCtl': len(a), 'linesNew': len(b), 'changed': len(d), 'first': [x[:150] for x in d[:14]]}
        c['diffs'] = diffs
        for a in ('ctl', 'new'):
            for k in ('boxHashes', 'tboxHashes', 'textHashes', 'htmlClass', 'docH', 'consErr', 'aborted', 'imgReq', 'selfDoc', 'coreN', 'lcpEl'):
                c[a][k] = dict(c[a][k]) if k != 'htmlClass' else len(c[a][k])
        out.append(c)
    return out

f4 = lambda x: '-' if x is None else ('%.4f' % x)
def table(cells, title):
    L = ['## ' + title, '', '| cell | control CLS median (max) | new CLS median (max) | change | over 0.1, control / new | input-excluded median, control / new | FCP ms, control / new (change) | LCP ms, control / new (change) | finished page |', '|---|---|---|---|---|---|---|---|---|']
    for c in cells:
        C, N = c['ctl'], c['new']
        if not C['n'] or not N['n']: L.append('| %s %d | incomplete (%d / %d loads) | | | | | | | |' % (c['name'], c['w'], C['n'], N['n'])); continue
        fin = 'equal' if c['boxEqual'] else 'DIFFERENT (%d of %d new loads)' % (c['boxNewOnly'], N['n'])
        L.append('| %s %d | %s (%s) | %s (%s) | %+.4f | %d of %d / %d of %d | %s / %s | %d / %d (%+d) | %d / %d (%+d) | %s |' % (
            c['name'], c['w'], f4(C['clsMed']), f4(C['clsMax']), f4(N['clsMed']), f4(N['clsMax']), c['dMed'], C['over01'], C['n'], N['over01'], N['n'],
            f4(C['clsNIMed']), f4(N['clsNIMed']), C['fcpMed'], N['fcpMed'], c['dFcp'], C['lcpMed'], N['lcpMed'], c['dLcp'], fin))
    return L

allc = {}; md = ['# Re-check 1, regression tables (generated by harness/an-jm.py)', '']
with open(os.path.join(OUT, 'loads.csv'), 'w', newline='') as fh:
    wr = csv.writer(fh); wr.writerow(['set', 'cell', 'width', 'arm', 'load', 'cpu', 'cls_all', 'cls_input_excluded', 'shifts', 'fcp_ms', 'lcp_ms', 'dcl_ms', 'load_ms', 'box_hash', 'tagged_box_hash', 'text_hash', 'doc_height', 'page_errors', 'console_errors', 'aborted_requests', 'non_get_aborted', 'image_requests', 'core_sha1_8', 'shift_list(t_ms:value:input_flag)'])
    for s in ('std', 'cpu', 'lay', 'trav8'):
        rows = load(s)
        if not rows: continue
        for r in sorted(rows, key=lambda r: (r['page'], r['w'], r['i'], r['arm'])):
            wr.writerow([s, NAME[r['page']], r['w'], r['arm'], r['i'], r['cpu'], r['cls'], r['clsNI'], r['nSh'], r['fcp'], r['lcp'], r['dcl'], r['loadT'], r['boxHash'], r['tboxHash'], r['textHash'], r['docH'], r['errN'], r['consErr'], r['abortedN'], r['nonGet'], r.get('imgReqN'), r['coreSha'],
                         ' '.join('%d:%.4f:%d' % (x['t'], x['v'], x['inp']) for x in r['sh'])])
        if s == 'trav8': continue
        cells = cell_stats(s, rows); allc[s] = cells
        order = {k: i for i, k in enumerate(NAME)}; cells.sort(key=lambda c: (order[c['page']], c['w']))
        md += table(cells, {'std': 'Standard speed, 5 loads a cell and arm', 'cpu': 'CPU 4x slower, 3 loads a cell and arm', 'lay': 'Follow-up: /layovers 1440, 15 more loads an arm (standard speed)'}[s]) + ['']
json.dump(allc, open(os.path.join(OUT, 'cells.json'), 'w'), indent=1)
open(os.path.join(OUT, 'table.md'), 'w').write('\n'.join(md) + '\n')

# checks, printed
for s, cells in allc.items():
    done = [c for c in cells if c['ctl']['n'] and c['new']['n']]
    print('==', s, len(done), 'cells', sum(c['ctl']['n'] + c['new']['n'] for c in done), 'loads')
    print(' worse than control by more than 0.01 (median):', [(c['name'], c['w'], round(c['dMed'], 4)) for c in done if c['dMed'] > 0.01] or 'none')
    print(' worse by max, more than 0.01:', [(c['name'], c['w'], round(c['new']['clsMax'] - c['ctl']['clsMax'], 4)) for c in done if c['new']['clsMax'] - c['ctl']['clsMax'] > 0.01] or 'none')
    print(' claimed cells with new median >= 0.05:', [(c['name'], c['w'], c['new']['clsMed']) for c in done if c['claimed'] and c['new']['clsMed'] >= 0.05] or 'none')
    print(' any cell with a new load over 0.1:', [(c['name'], c['w'], c['new']['over01'], c['new']['clsMax']) for c in done if c['new']['over01']] or 'none')
    print(' control loads over 0.1:', sum(c['ctl']['over01'] for c in done), 'new:', sum(c['new']['over01'] for c in done))
    for k in ('boxEqual', 'tboxEqual', 'textEqual', 'htmlClassEqual', 'bodyTreeEqual', 'headSetEqual', 'stylesEqual', 'imgReqEqual'):
        bad = [(c['name'], c['w']) for c in done if not c[k]]; print(' %s: %d of %d equal%s' % (k, len(done) - len(bad), len(done), '; not: ' + str(bad) if bad else ''))
    print(' leftover hold marks (new):', sum(c['new']['marks'] for c in done), ' page errors ctl/new:', sum(c['ctl']['errN'] for c in done), sum(c['new']['errN'] for c in done),
          ' other browsers seen:', sum(c['ctl']['others'] + c['new']['others'] for c in done), ' non-GET aborted:', sum(c['ctl']['nonGet'] + c['new']['nonGet'] for c in done))
    df = [c['dFcp'] for c in done]; dl = [c['dLcp'] for c in done]
    print(' FCP change per cell: median %+.0f, min %+.0f, max %+.0f; LCP change: median %+.0f, min %+.0f, max %+.0f' % (med(df), min(df), max(df), med(dl), min(dl), max(dl)))
    print(' FCP later by more than 30 ms:', [(c['name'], c['w'], c['dFcp']) for c in done if c['dFcp'] > 30] or 'none')
    print(' LCP later by more than 30 ms:', [(c['name'], c['w'], c['dLcp']) for c in done if c['dLcp'] > 30] or 'none')
