"""Smaller sets for fix.md, part B. python3 extra.py <outdir>  reads out/f-dom.jsonl, f-split.jsonl, f-fail.jsonl, f-sizes.jsonl; writes extra.md"""
import json, sys, re, os
from collections import defaultdict
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = sys.argv[1]
PFX = sys.argv[2] if len(sys.argv) > 2 else 'f-'  # 'm-' for the merged files (merge.py)
NAME = {'account': '/account', 'submit': '/submit', 'profile': '/contributors/<profile>', 'stories': '/stories', 'home': '/', 'balkans': 'story: Balkans', 'lisbon': 'story: Lisbon', 'safrica': 'story: Southern Africa',
        'travelers': '/travelers', 'map': '/the-map', 'expats': '/for-expats', 'about': '/about', 'layovers': '/layovers', 'paw': '/the-paw-passport', 'cookies': '/cookies', 'login': '/login', 'signup': '/signup'}
def load(f):
    R = []
    p = os.path.join(B, 'out', f)
    if not os.path.exists(p): return R
    for l in open(p):
        r = json.loads(l)
        if r.get('err'): print('ERR', f, r['page'], r['w'], r['err']); continue
        r['k'] = 'ctl' if 'core-1666' in r['v'] else 'new'; r['all'] = round(sum(e['v'] for e in r['sh']), 4); R.append(r)
    return R
def variant(r):
    parts = [p for p in r['v'].split('+') if not p.startswith(('core=', 'eval='))]
    return '+'.join(re.sub(r'^.*/(p-)?', '', p).replace('.json', '') if '=' in p else p for p in parts) or 'base'
def body(r): return [x for x in r['ev'].split('\n')[2:] if not re.match(r'\s*<(iframe|script) ', x)]
def headset(r): return sorted(r['ev'].split('\n')[0].split(' '))
def htmlcls(r):  # the html element's classes without the font loader's wf-* classes (their order varies)
    m = re.search(r'class=([^|]*)', r['ev'].split('\n')[1]); return sorted(t for t in (m.group(1).split() if m else []) if not t.startswith('wf-'))
def floor(r):
    m = re.search(r'data-tll-floor=(\d+)', r['ev'].split('\n')[1]); return m.group(1) if m else '-'
def imgs(r): return set(x[1] for x in r['rt'] if x[0] == 'img' or re.search(r'\.(jpe?g|png|webp|avif|gif|svg)(\?|$)', x[1], re.I))
md = ['# Layout shift sweep, part B: the smaller sets (16 November 2026)', '', 'Same harness and rules as the tables in fix.md. Control = live 16.66.0 core routed from a local copy, new = the 16.67.0 core (parts A and B). CLS counts every entry. One load a cell and core unless a count is given.', '']
# the finished page
C = defaultdict(dict)
for r in load(PFX + 'dom.jsonl'): C[(r['page'], r['w'])][r['k']] = r
md += ['## The finished page: boxes, body tree, head, image files', '', 'Boxes: every laid-out box at the end of the load (position and size). Body tree: tags, attributes and text of everything in the body (script and iframe tags by name only). Head: the list of the head\'s children. Images: the image files asked for during the load.', '',
       '| cell | boxes equal | body tree equal | head equal | html classes equal | images: control / new / only new | control CLS | new CLS |', '|---|---|---|---|---|---|---|---|']
bad = []; floors = []
for p in NAME:
    for w in sorted(set(k[1] for k in C if k[0] == p)):
        c = C[(p, w)]
        if 'ctl' not in c or 'new' not in c: continue
        a, b = c['ctl'], c['new']; ia, ib = imgs(a), imgs(b)
        row = (a['bh'] == b['bh'], body(a) == body(b), headset(a) == headset(b), htmlcls(a) == htmlcls(b))
        if not all(row) or (ib - ia): bad.append((p, w, row, len(ib - ia)))
        if floor(a) != floor(b): floors.append('%s %d: %s / %s' % (NAME[p], w, floor(a), floor(b)))
        md.append('| %s %d | %s | %s | %s | %s | %d / %d / %d | %.4f | %.4f |' % (NAME[p], w, 'yes' if row[0] else 'no', 'yes' if row[1] else 'no', 'yes' if row[2] else 'no', 'yes' if row[3] else 'no', len(ia), len(ib), len(ib - ia), a['all'], b['all']))
md.append('')
md += ['The html element: its classes are compared without the font loader\'s wf-* classes. Its `data-tll-floor` attribute is a counter the site\'s type floor script leaves (how many sizes it wrote in its last pass); it differs in these cells (control / new): ' + ('; '.join(floors) or 'none') + '.', '']
# the finished page again where one load differed
G = defaultdict(lambda: defaultdict(list))
for r in load('g-dom2.jsonl') if PFX else []: G[(r['page'], r['w'])][r['k']].append(r)
if G:
    md += ['### Four more loads a cell and core, for the three cells where one control load differed above (and home)', '',
           'In those three control loads the site\'s own type floor or touch target script had written one more inline size (a font size of 12px on album labels; a padding of 0.0002 to 0.0005 px on three links). Core of bdc6d21.', '',
           '| cell | loads control / new | box lists seen | body trees seen | control CLS | new CLS |', '|---|---|---|---|---|---|']
    for p in NAME:
        for k in sorted(k for k in G if k[0] == p):
            a, b = G[k]['ctl'], G[k]['new']
            md.append('| %s %d | %d / %d | %d | %d | %s | %s |' % (NAME[p], k[1], len(a), len(b), len(set(x['bh'] for x in a + b)), len(set('\n'.join(body(x)) for x in a + b)), ', '.join(sorted(set('%.4f' % x['all'] for x in a))), ', '.join(sorted(set('%.4f' % x['all'] for x in b)))))
    md.append('')
# parser held
SPL = {'stories-a': '/stories, after the hero, before the filter row', 'stories-b': '/stories, after the search bar, before the grid', 'stories-f': '/stories, inside the first card, after its place line (3 loads a core, median)', 'stories-e': '/stories, inside the grid after the third card', 'stories-c': '/stories, inside the grid after card 30',
       'stories-d': '/stories, after the page, before the page scripts', 'profile-c': 'profile, inside the hero before the text column', 'profile-a': 'profile, after the hero', 'profile-b': 'profile, before the story list',
       'account-a': '/account, after the nav', 'submit-a': '/submit, after the nav'}
C = defaultdict(dict)
for r in load(PFX + 'split.jsonl'):
    v = re.search(r'p-split-([\w-]+)\.json', r['v']).group(1); C[(v, r['w'])].setdefault(r['k'], []).append(r)
for k in C:
    for c in C[k]: L = sorted(C[k][c], key=lambda r: r['all']); m = L[len(L) // 2]; m['same'] = len(set(r['bh'] for r in L)) == 1; C[k][c] = m
md += ['## Parser held for 350 ms at one point of the page (a paint lands there)', '', '| point | width | control | new | boxes equal | body tree equal | html classes equal |', '|---|---|---|---|---|---|---|']
for v in SPL:
    for w in (390, 1440):
        c = C.get((v, w), {})
        if 'ctl' not in c or 'new' not in c: continue
        md.append('| %s | %d | %.4f | %.4f | %s | %s | %s |' % (SPL[v], w, c['ctl']['all'], c['new']['all'], 'yes' if c['ctl']['bh'] == c['new']['bh'] else 'no', 'yes' if body(c['ctl']) == body(c['new']) else 'no', 'yes' if htmlcls(c['ctl']) == htmlcls(c['new']) else 'no'))
        if htmlcls(c['ctl']) != htmlcls(c['new']): bad.append((v, w, 'html classes'))
md.append('')
# failure cases
FL = {'parity-throw': 'site head script tll-proto-parity-js-v1 throws when it starts', 'parity-missing': 'site head script tll-proto-parity-js-v1 not on the page',
      'menu-throw': 'site head script tll-mobile-nav-js-v1 throws when it starts', 'menu-missing': 'site head script tll-mobile-nav-js-v1 not on the page',
      'lead-throw': '/stories script tll-lib-lead-v1 throws when it starts', 'lead-missing': '/stories script tll-lib-lead-v1 not on the page', 'chips-missing': '/stories script tll-lib-chips-v1 not on the page', 'nochunk': 'our stories chunk does not load',
      'pf5-throw': 'profile script tll-pf5-profile-js-v1 throws when it starts', 'pf5-missing': 'profile script tll-pf5-profile-js-v1 not on the page', 'pf5n-missing': 'profile notes embed tll-pf5-n-v1 not on the page'}
C = defaultdict(dict)
for r in load(PFX + 'fail.jsonl'): C[(variant(r), r['page'], r['w'])][r['k']] = r
md += ['## Failure cases, control against new', '', 'What counts here is the finished page: with the page code broken it has to end as it does with the control. The CLS of a broken page is given for the record.', '',
       '| case | page | width | control CLS | new CLS | boxes equal | body tree equal | head equal | html classes equal |', '|---|---|---|---|---|---|---|---|---|']
for v in FL:
    for k in sorted(k for k in C if k[0] == v):
        c = C[k]
        if 'ctl' not in c or 'new' not in c: continue
        a, b = c['ctl'], c['new']
        row = (a['bh'] == b['bh'], body(a) == body(b), headset(a) == headset(b), htmlcls(a) == htmlcls(b))
        if not all(row): bad.append((v, k[1], k[2], row))
        md.append('| %s | %s | %d | %.4f | %.4f | %s | %s | %s | %s |' % (FL[v], NAME[k[1]], k[2], a['all'], b['all'], 'yes' if row[0] else 'no', 'yes' if row[1] else 'no', 'yes' if row[2] else 'no', 'yes' if row[3] else 'no'))
md.append('')
# other screens
C = defaultdict(lambda: defaultdict(list))
for r in load(PFX + 'sizes.jsonl'): C[(r['page'], r['w'], r['h'])][r['k']].append(r)
md += ['## Other screen sizes', '', '| page | screen | control | new | boxes equal |', '|---|---|---|---|---|']
for p in NAME:
    for k in sorted(k for k in C if k[0] == p):
        a, b = C[k]['ctl'], C[k]['new']
        if not a or not b: continue
        md.append('| %s | %dx%d | %s | %s | %s |' % (NAME[p], k[1], k[2], ', '.join('%.4f' % x['all'] for x in a), ', '.join('%.4f' % x['all'] for x in b), 'yes' if set(x['bh'] for x in a) == set(x['bh'] for x in b) else 'no'))
md.append('')
# the members wrapper when the page is parsed (init-a3.js), /account and /submit
def a3rows(f):
    R = defaultdict(dict)
    for r in load(f):
        ini = [x for x in (r.get('ini') or []) if x.startswith('parsed ')]
        if ini: R[(r['page'], r['w'], 'stress' if '+slow=' in r['v'] else 'standard')][r['k']] = dict(kv.split('=') for kv in ini[0].split(' ')[1:])
    return R
A3 = a3rows('t-a3.jsonl')
if A3:
    md += ['## The page as a member\'s browser has it when the page is parsed (/account, /submit)', '',
           'Read on the page right after its own page-parsed listeners have run (`var/init-a3.js`): the Account 3.0 class on `html`, the tab rail, its tabs and panel headings, where the nav is, and a hash of the markup of the members wrapper (scripts, styles and frames emptied). The lab is signed out, so this is the dashboard markup before Memberstack takes it away; a signed-in member keeps it. Final core against control.', '',
           '| page | width | load | html.a3-on control / new | tab rail | tabs | panel headings | nav parent | wrapper markup equal | layer\'s style or mark left |', '|---|---|---|---|---|---|---|---|---|---|']
    for k in sorted(A3):
        c = A3[k]
        if 'ctl' not in c or 'new' not in c: continue
        a, b = c['ctl'], c['new']
        if a['wrapHash'] != b['wrapHash'] or a['a3on'] != b['a3on']: bad.append(('a3',) + k)
        md.append('| %s | %d | %s | %s / %s | %s / %s | %s / %s | %s / %s | %s / %s | %s | %s |' % (NAME[k[0]], k[1], k[2], a['a3on'], b['a3on'], a['rail'], b['rail'], a['tabs'], b['tabs'], a['ph'], b['ph'], a['navParent'], b['navParent'],
                  'yes' if a['wrapHash'] == b['wrapHash'] and a['wrapLen'] == b['wrapLen'] else 'no', 'no' if b['sheet'] == '0' and b['mark'] == '0' else 'yes'))
    md.append('')
# uncached card photos answered by a local picture (ph=600x400), /stories
PH = defaultdict(dict)
for r in load('g-ph.jsonl'): PH[(r['w'], r['h'], 'tll-lib-lead-v1 throws' if 'lead-throw' in r['v'] else 'as served')][r['k']] = r
if PH:
    md += ['## /stories with uncached card photos answered by a local picture instead of aborted', '',
           'The three cells whose box lists differ above by cards with the no-photo panel. Core 951b08c (the /stories code of the final core).', '',
           '| screen | page code | boxes equal | body tree equal | pictures answered locally: control / new |', '|---|---|---|---|---|']
    for k in sorted(PH):
        c = PH[k]
        if 'ctl' not in c or 'new' not in c: continue
        a, b = c['ctl'], c['new']
        if a['bh'] != b['bh']: bad.append(('ph',) + k)
        md.append('| %dx%d | %s | %s | %s | %s / %s |' % (k[0], k[1], k[2], 'yes' if a['bh'] == b['bh'] else 'no', 'yes' if body(a) == body(b) else 'no', a.get('phN'), b.get('phN')))
    md.append('')
open(os.path.join(out, 'extra.md'), 'w').write('\n'.join(md) + '\n')
print('\n'.join(md)); print('NOT EQUAL:', bad)
