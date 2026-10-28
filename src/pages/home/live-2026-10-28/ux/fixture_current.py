"""Offline stand-in of today's home page (28 Oct 2026) for the UX brief. Run from the repo root:
python3 -I src/pages/home/live-2026-10-28/ux/fixture_current.py
Base: the 13 Oct export. Swapped for today's copies: every home embed that can be matched (src/pages/home/live-2026-10-28/embeds),
the site head and footer code (src/seo/live-2026-10-28/site-code-*.html), and the home page head and footer code (page-code-*.html).
The nav and footer components stay as exported on 13 Oct."""
import re, pathlib, json
ROOT = pathlib.Path(__file__).resolve().parents[5]
E = ROOT / 'handoff/claude-design-source/webflow-export-2026-10-13/pages/index.html'
H = E.read_text()
H = re.sub(r'href="\.\./css/([^"]+)"', r'href="http://tll.test/css/\1"', H)
D = ROOT / 'src/pages/home/live-2026-10-28'
site_head = (ROOT / 'src/seo/live-2026-10-28/site-code-head.html').read_text()
site_foot = (ROOT / 'src/seo/live-2026-10-28/site-code-footer.html').read_text()
page_head = (D / 'ux/page-code-head.html').read_text(); page_foot = (D / 'ux/page-code-footer.html').read_text()
i = H.find('<style id="tll-embed-mode">'); k = H.find('<style id="tll-home-search-v3">'); j = H.find('</head>')
H = H[:i] + site_head + '\n' + page_head + '\n<!--BUNDLE-->\n' + H[j:]
fi = H.find('<script src="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.umd.js"></script>')
fj = H.rfind('</body>')
H = H[:fi] + (D / 'ux/note-markup.html').read_text() + '\n' + site_foot + '\n' + page_foot + '\n<!--LAYER-->\n' + H[fj:]
# embeds
def embeds(h):
    out = []; pos = 0
    while True:
        s = h.find('<div class="w-embed', pos)
        if s < 0: return out
        a = h.find('>', s) + 1; depth = 1; q = a
        while depth:
            o = h.find('<div', q); c = h.find('</div>', q)
            if o != -1 and o < c: depth += 1; q = o + 4
            else: depth -= 1; q = c + 6
        out.append((s, a, q - 6, q)); pos = q
def marks(code):
    s = set(re.findall(r'(?:id|aria-labelledby)="([^"]+)"', code)) | set(re.findall(r'data-h3[-a-z0-9]*(?:="[^"]*")?', code))
    for c in re.findall(r'class="([^"]*)"', code): s |= {x for x in c.split() if x.startswith(('h3-', 'tll-'))}
    return s
cur = {p.stem: p.read_text() for p in sorted((D / 'embeds').glob('*.html'))}
EMB = embeds(H); pairs = []
for name, code in cur.items():
    m = marks(code)
    for n, (s, a, b, e) in enumerate(EMB):
        sc = len(m & marks(H[a:b]))
        if sc: pairs.append((sc, name, n))
pairs.sort(reverse=True); take = {}; got = set()
for sc, name, n in pairs:
    if name in take or n in got or sc < 2: continue
    take[name] = (n, sc); got.add(n)
for name, (n, sc) in sorted(take.items(), key=lambda x: -x[1][0]):
    s, a, b, e = EMB[n]; H = H[:a] + cur[name] + H[b:]
close = cur.get('77041b08')
if close and 'data-h3-close' not in H:
    f = H.find('<footer'); H = H[:f] + '<div class="w-embed">' + close + '</div>\n' + H[f:]
report = [(k, take.get(k, ('-', 'NOT MATCHED'))[1]) for k in cur]
(D / 'ux/fixture-home-current.html').write_text(H)
print(json.dumps(report)); print('embeds in fixture', len(embeds(H)), 'size KB', len(H) // 1024)
