"""Job files for the part B measurement. python3 mkfinal.py <new core tag>   writes out/j-<set>.json"""
import json, re, sys, os
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NEW = sys.argv[1]
def core(c): return 'core=%s/var/core-%s.js' % (B, c)
def H(w): return 900 if w >= 800 else (800 if w == 360 else 844)
def cells(pages, widths, n, extra=''):
    out = []
    for p in pages:
        for w in widths:
            for c in ('1666', NEW):
                out.append(dict(page=p, w=w, h=H(w), v=core(c) + extra, n=n))
    return out
SCOPE = ['account', 'submit', 'profile', 'stories']
STORIES3 = ['balkans', 'lisbon', 'safrica']
PARTA = ['travelers', 'map', 'expats', 'about']
OTHER = ['layovers', 'paw', 'cookies', 'login', 'signup']
EV = '+eval=%s/var/ev-dom.js' % B
sets = {}
sets['std'] = cells(SCOPE + ['home'], [390, 1440], 5) + cells(STORIES3, [360, 390, 1440], 5)
sets['cpu'] = cells(SCOPE, [390, 1440], 3, '+cpu=4')
sets['slow'] = cells(SCOPE, [390, 1440], 3, '+slow=jquery-3.5.1@600')
sets['other'] = cells(PARTA + OTHER, [390, 1440], 3)
sets['dom'] = cells(SCOPE + ['home'] + PARTA + OTHER, [390, 1440], 1, EV) + cells(STORIES3, [360, 390, 1440], 1, EV)
# parser held for 350 ms at one point
BL = '<script src="/__lab_block.js?ms=350"></script>'
s = open(B + '/html/stories.html').read()
ids = re.findall(r'<div role="listitem" class="w-dyn-item"><a id="([^"]+)"', s)
SPLIT = {'split-stories-a': '<section data-tll-filter-bar=""', 'split-stories-b': '<section class="tllvb-bar">', 'split-stories-c': '<div role="listitem" class="w-dyn-item"><a id="%s"' % ids[30],
         'split-stories-d': '<script id="tll-lib-chips-v1">', 'split-stories-e': '<div role="listitem" class="w-dyn-item"><a id="%s"' % ids[3],
         'split-profile-a': '<section data-pf5="about">', 'split-profile-b': '<section data-pf5="stories">', 'split-profile-c': '<div data-pf5="id">',
         'split-account-a': '<div class="w-embed w-script"><!-- TLL member bar v1', 'split-submit-a': '<section class="tll-section-dark tll-share-hero">'}
html = {p: open(B + '/html/%s.html' % p).read() for p in SCOPE}
sets['split'] = []
for k, a in SPLIT.items():
    pg = k.split('-')[1]; assert html[pg].count(a) == 1, (k, html[pg].count(a))
    json.dump([a, BL + a], open(B + '/var/p-%s.json' % k, 'w'))
    sets['split'] += cells([pg], [390, 1440], 1, EV + '+html=%s/var/p-%s.json' % (B, k))
# failure cases
def P(k): return '+html=%s/var/p-%s.json' % (B, k)
F = []
for p in ('account', 'submit'):
    F += cells([p], [390, 1440], 1, EV + P('parity-throw')) + cells([p], [390, 1440], 1, EV + P('parity-missing'))
F += cells(['submit'], [390], 1, EV + P('menu-throw')) + cells(['stories'], [390], 1, EV + P('menu-missing'))
F += cells(['stories'], [390, 1440], 1, EV + P('lead-throw')) + cells(['stories'], [390, 1440], 1, EV + P('lead-missing')) + cells(['stories'], [390, 1440], 1, EV + P('chips-missing')) + cells(['stories'], [390, 1440], 1, EV + '+nochunk')
F += cells(['profile'], [390, 1440], 1, EV + P('pf5-throw')) + cells(['profile'], [390, 1440], 1, EV + P('pf5-missing')) + cells(['profile'], [1440], 1, EV + P('pf5n-missing'))
sets['fail'] = F
json.dump(['<script id="tll-lib-chips-v1">', '<script type="text/plain" id="x-chips">'], open(B + '/var/p-chips-missing.json', 'w'))
# other screens
S = []
for p in SCOPE:
    for (w, h) in ((360, 800), (412, 915), (390, 1100), (768, 1024), (1440, 1200)):
        for c in ('1666', NEW): S.append(dict(page=p, w=w, h=h, v=core(c), n=1))
sets['sizes'] = S
# first paint, 8 more loads a cell
sets['fcp'] = cells(['profile', 'stories'], [390, 1440], 8) + cells(['submit', 'balkans'], [390], 8)
for k, j in sets.items():
    json.dump(j, open(B + '/out/j-%s.json' % k, 'w')); print(k, len(j), 'jobs', sum(x['n'] for x in j), 'loads')
