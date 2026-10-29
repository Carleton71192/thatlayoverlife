"""Offline stand-ins of /for-expats, /stories, /travelers, /the-map and /about as they are today (29 Oct 2026).
Body from the live Webflow element tree (tree2html.py); nav and footer from the 13 Oct export; site and page code from today's reads."""
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from tree2html import render
import json
D = pathlib.Path(__file__).parent; ROOT = D.parents[2]
E = (ROOT / 'handoff/claude-design-source/webflow-export-2026-10-13/pages/stories.html').read_text()
E = E.replace('href="../css/', 'href="http://tll.test/css/')
hi = E.find('<style id="tll-embed-mode">'); head0 = E[:hi]
b = E.find('<body'); be = E.find('>', b) + 1; m = E.find('<main', be); nav = E[be:m]
f = E.find('<footer'); fe = E.find('</footer>', f) + 9; foot = E[f:fe]
site_head = (ROOT / 'src/seo/live-2026-10-28/site-code-head.html').read_text()
site_foot = (ROOT / 'src/seo/live-2026-10-28/site-code-footer.html').read_text()
note = (ROOT / 'src/pages/home/live-2026-10-28/ux/note-markup.html').read_text()
for page in ['for-expats', 'stories', 'travelers', 'the-map', 'about']:
    body = render(json.load(open(D / 'trees' / (page + '.json'))))
    body = body.replace('<!--NAV-->', nav).replace('<!--FOOTER-->', foot)
    ph = (D / 'code' / (page + '-head.html')).read_text(); pf = (D / 'code' / (page + '-footer.html')).read_text()
    out = head0 + site_head + '\n' + ph + '\n<!--BUNDLE-->\n</head>\n<body class="body">' + body + note + '\n' + site_foot + '\n' + pf + '\n<!--LAYER-->\n</body></html>'
    (D / 'fixtures').mkdir(exist_ok=True); (D / 'fixtures' / (page + '.html')).write_text(out)
    print(page, len(out) // 1024, 'KB')
