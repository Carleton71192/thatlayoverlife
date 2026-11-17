"""Jobs for /account and /submit with the core after the nav piece was rewritten (core-b15). python3 mk15.py  writes out/n-<set>.json"""
import json, os
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NEW = 'b16'
def core(c): return 'core=%s/var/core-%s.js' % (B, c)
def H(w): return 900 if w >= 800 else (800 if w == 360 else 844)
def cells(pages, widths, n, extra=''):
    return [dict(page=p, w=w, h=H(w), v=core(c) + extra, n=n) for p in pages for w in widths for c in ('1666', NEW)]
P2 = ['account', 'submit']; EV = '+eval=%s/var/ev-dom.js' % B
def P(k): return '+html=%s/var/p-%s.json' % (B, k)
sets = {}
# first: the page as a member's browser has it when the page is parsed (the members wrapper, the tab rail, html.a3-on), control against new
sets['a3'] = cells(P2, [390, 1440], 1, '+init=%s/var/init-a3.js' % B) + cells(P2, [390, 1440], 1, '+init=%s/var/init-a3.js+slow=jquery-3.5.1@600' % B)
sets['std'] = cells(P2, [390, 1440], 5)
sets['cpu'] = cells(P2, [390, 1440], 3, '+cpu=4')
sets['slow'] = cells(P2, [390, 1440], 3, '+slow=jquery-3.5.1@600')
sets['dom'] = cells(P2, [390, 1440], 1, EV)
sets['split'] = cells(['account'], [390, 1440], 1, EV + P('split-account-a')) + cells(['submit'], [390, 1440], 1, EV + P('split-submit-a'))
F = []
for p in P2: F += cells([p], [390, 1440], 1, EV + P('parity-throw')) + cells([p], [390, 1440], 1, EV + P('parity-missing'))
F += cells(['submit'], [390], 1, EV + P('menu-throw'))
sets['fail'] = F
S = []
for p in P2:
    for (w, h) in ((360, 800), (412, 915), (390, 1100), (768, 1024), (1440, 1200)):
        for c in ('1666', NEW): S.append(dict(page=p, w=w, h=h, v=core(c), n=1))
sets['sizes'] = S
sets['fcp'] = cells(['submit'], [390], 8) + cells(['account'], [1440], 8)
for k, j in sets.items():
    json.dump(j, open(B + '/out/n-%s.json' % k, 'w')); print(k, len(j), 'jobs', sum(x['n'] for x in j), 'loads')
