"""fill-auto.json for fill_manual.py and assemble.py: the placeholder texts of fix.md part B whose numbers come straight from the result files.
python3 mkfill.py <head commit>"""
import json, os, re, sys, gzip, hashlib, base64, statistics as st
from collections import defaultdict
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEAD = sys.argv[1]
core = open(os.path.join(B, 'var', 'core-b16.js'), 'rb').read(); corea = open(os.path.join(B, 'var', 'core-a.js'), 'rb').read()
def n(x): return format(x, ',')
def rows(f):
    R = []
    p = os.path.join(B, 'out', f)
    if not os.path.exists(p): return R
    for l in open(p):
        try: r = json.loads(l)
        except Exception: continue
        if r.get('err'): continue
        r['k'] = 'ctl' if 'core-1666' in r['v'] else 'new'; r['all'] = round(sum(e['v'] for e in r['sh']), 4); R.append(r)
    return R
F = {}
F['SIZE'] = n(len(core)); F['GZ'] = n(len(gzip.compress(core, 9, mtime=0))); F['LAYER'] = n(len(core) - len(corea))
F['SRI'] = 'sha384-' + base64.b64encode(hashlib.sha384(core).digest()).decode()
F['HEAD'] = HEAD

# first paint, pooled over the standard, finished-page, other-pages and first-paint sets
C = defaultdict(lambda: defaultdict(list))
for s in ('std', 'fcp', 'other', 'dom'):
    for r in rows('m-%s.jsonl' % s):
        if r['fcp'] is not None: C[(r['page'], r['w'])][r['k']].append(r['fcp'])
d = {k: st.median(C[k]['new']) - st.median(C[k]['ctl']) for k in C}
alla = [x for k in C for x in C[k]['ctl']]; allb = [x for k in C for x in C[k]['new']]
lo, hi = min(d.values()), max(d.values())
scope = {k: v for k, v in d.items() if k[0] in ('account', 'submit', 'profile', 'stories')}
print('FCP', len(C), 'cells', lo, hi, max(d, key=d.get), len(alla), len(allb), st.median(alla), st.median(allb))
print('FCP scope', {k: v for k, v in sorted(scope.items())})
G = defaultdict(lambda: defaultdict(list))
for r in rows('g-cpufcp2.jsonl'): G[(r['page'], r['w'])][r['k']].append(r['fcp'])
cp = {k: (st.median(G[k]['ctl']), st.median(G[k]['new']), len(G[k]['new'])) for k in sorted(G)}
print('CPU FCP', cp)
NM = {'profile': 'the profile', 'stories': '/stories'}
CPUF = ('At CPU 4x the three-load sets scatter too much to read. Six more loads a core on the three cells that looked later (core 951b08c): '
        + '; '.join('%s at %d: %d ms against %d (%+d)' % (NM[k[0]], k[1], cp[k][1], cp[k][0], cp[k][1] - cp[k][0]) for k in cp)
        + '. So on a slow phone the first paint of the profile and of /stories at phone width is about 30 to 40 ms later, out of about 450 ms. The next point says where that goes.')
F['FCPNOTE'] = ('at normal speed no cell is more than %d ms later. Medians per cell over the standard, finished-page, other-pages and first-paint sets (%d to %d loads a cell and core, %d cells): between %d ms earlier and %d ms later than the control; '
                'the eight cells in scope between %d ms earlier and %d ms later. Over all %d loads a core the median is %d ms with the control and %d ms with the new core. '
                'Single sets of 5 loads scatter by about 30 ms either way with the same core (a frame is 16 ms), which is why the per-set columns above show differences of that size in both directions. '
                % (hi, min(len(C[k]['new']) for k in C), max(len(C[k]['new']) for k in C), len(C), -lo, hi, -min(scope.values()), max(scope.values()), len(alla), st.median(alla), st.median(allb))) + CPUF

# work per run of the layer (core of bdc6d21 with a timer around the layer's tick)
T = defaultdict(list)
for r in rows('g-tt.jsonl'):
    try: e = json.loads(r['ev'])
    except Exception: continue
    T[(r['page'], r['w'], 'cpu' if '+cpu=4' in r['v'] else 'std')].append(e)
def grp(pages, kind):
    L = [e for k in T if k[0] in pages and k[2] == kind for e in T[k]]
    return (min(e['ms'] for e in L), max(e['ms'] for e in L), max(e['max'] for e in L)) if L else (0, 0, 0)
LIGHT = ('account', 'submit', 'home', 'balkans')
runs = [e['n'] for v in T.values() for e in v]
F['TICKNOTE'] = ('the layer runs once for each batch of nodes the parser adds (%d to %d runs a load), until its pieces are in. Measured with a timer around each run (core bdc6d21 with the timer added, %d loads): '
                 '/account, /submit, home and a story %.1f to %.1f ms a load in total (up to %.1f ms at CPU 4x); the profile %.1f to %.1f ms (%.1f to %.1f at CPU 4x); '
                 '/stories %.0f to %.0f ms, the longest single run %.0f ms (at CPU 4x %.0f to %.0f ms, longest %.0f). '
                 'On /stories nearly all of it is two steps that ask the browser for computed styles (the title\'s font, and whether a card is shown, once the whole grid has arrived); each makes the browser work out the styles of everything parsed so far. '
                 'The browser has to do that work for its next frame in any case, so only part of it is added, but it is done earlier and in one piece. That is the likely source of the later first paint on /stories at CPU 4x (on the profile the stand-in itself has to be styled and painted). Not made lighter in this round. '
                 'On a page with none of its pieces the layer sets up nothing. With the Menu piece alone it watches until the page is parsed, and each run is one check that the stand-in is still last in its row.'
                 % ((min(runs), max(runs), len(runs)) + grp(LIGHT, 'std')[:2] + (grp(LIGHT, 'cpu')[1],) + grp(('profile',), 'std')[:2] + grp(('profile',), 'cpu')[:2] + grp(('stories',), 'std') + grp(('stories',), 'cpu')))

# counts
def cnt(sets, k='new'): return sum(1 for s in sets for r in rows('m-%s.jsonl' % s) if r['k'] == k)
big = ('std', 'cpu', 'slow', 'other', 'fcp'); small = ('dom', 'split', 'fail', 'sizes')
over = [(s, r['page'], r['w'], r['h'], re.sub(r'/tmp/claude-0/[^+]*/', '', r['v']), r['all']) for s in big + small for r in rows('m-%s.jsonl' % s) if r['k'] == 'new' and r['all'] > 0.1]
print('OVER 0.1 new:', over); print('loads new: big', cnt(big), 'small', cnt(small), 'ctl big', cnt(big, 'ctl'), 'small', cnt(small, 'ctl'))
F['NBIG'] = str(cnt(big)); F['NSMALL'] = str(cnt(small))
F['NALL'] = str(cnt(big) + cnt(small) + cnt(big, 'ctl') + cnt(small, 'ctl'))
json.dump(F, open(os.path.join(B, 'fill-auto.json'), 'w'), indent=1)
for k in ('SIZE', 'GZ', 'LAYER', 'SRI', 'NBIG', 'NSMALL', 'NALL'): print(k, F[k])
print(F['FCPNOTE']); print(); print(F['TICKNOTE'])
