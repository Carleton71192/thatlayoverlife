"""Read-only: split a page's own custom code (page head and page footer) out of its published HTML, with no Webflow access.
Sweep of 21 Nov 2026, item A21 (reports/evidence/sweep-2026-11-21/defrag.md F13): 15 live page code blocks have no saved copy, so the
build's copy checks cannot see when they change. Webflow writes, in order: its own head tags, the site head code, the page head code,
</head> ... the page, jQuery and webflow.js, the site footer code, the page footer code, </body>. This script finds the saved site head
and site footer (src/site/live-2026-11-13/fonts/*.after.html, the same bytes as the live site code on 16 Nov) in the HTML and takes what
follows each, up to </head> and </body>, less the registered scripts Webflow writes after the code (a run of bare
<script src=...></script> tags; their names are listed, not saved). If the saved site code is not found byte for byte, it stops: the site code has changed and
must be saved first, or the split would be wrong.

Template pages (stories, contributors, pets, countries, pursuits) are refused: their page code can carry CMS fields, which may hold
member names, and nothing with member data is written to the repo.

Usage:
  python3 tools/page-code-from-html.py PAGE.html [PAGE.html ...]            print sizes and sha256 of each part (writes nothing)
  python3 tools/page-code-from-html.py --save DIR PAGE.html [PAGE.html ...]  also write DIR/<page>/page-head.html and page-footer.html
The page name is the file name without .html (the plain-GET cache names files that way). Get the HTML by plain GET only."""
import hashlib, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'src', 'site', 'live-2026-11-13', 'fonts')
TEMPLATE = ('stories__', 'contributors', 'profile', 'pets__', 'countries__', 'pursuits__')


REG = re.compile(r'<script src="([^"]+)"(?: type="text/javascript")?(?: integrity="[^"]*")?(?: crossorigin="[^"]*")?></script>\s*$')


def registered(code):
    """Take the trailing run of registered script tags off one part: (code, [script file names])."""
    names = []
    while True:
        m = REG.search(code)
        if not m: break
        names.insert(0, re.sub(r'^.*(?:%2F|/)', '', m.group(1))); code = code[:m.start()].rstrip()
    return code, names


def split(html, head, foot):
    """Return (page_head, page_footer) of one published page, or raise ValueError."""
    h, f = head.strip(), foot.strip()
    i = html.find(h)
    if i < 0 or html.find(h, i + 1) >= 0:
        raise ValueError('the saved site head is not in this HTML exactly once')
    j = html.find('</head>', i)
    k = html.rfind(f)
    if k < 0 or html.find(f) != k:
        raise ValueError('the saved site footer is not in this HTML exactly once')
    e = html.rfind('</body>')
    if j < 0 or e < 0 or not (i < j < k < e):
        raise ValueError('the parts are not in the order Webflow writes them')
    return registered(html[i + len(h):j].strip())[0], registered(html[k + len(f):e].strip())[0]


def main(argv):
    out = None
    if argv[:1] == ['--save']:
        out, argv = argv[1], argv[2:]
    head = open(os.path.join(SITE, 'site-head.after.html'), encoding='utf-8').read()
    foot = open(os.path.join(SITE, 'site-footer.after.html'), encoding='utf-8').read()
    rc = 0
    for p in argv:
        name = os.path.basename(p)[:-5] if p.endswith('.html') else os.path.basename(p)
        if name.startswith(TEMPLATE):
            print('%-24s refused: template page (CMS fields can carry member data)' % name); rc = 1; continue
        try:
            html = open(p, encoding='utf-8').read(); ph, pf = split(html, head, foot)
        except ValueError as err:
            print('%-24s %s' % (name, err)); rc = 1; continue
        for part, s in (('page-head', ph), ('page-footer', pf)):
            print('%-24s %-12s %7d chars  sha256 %s' % (name, part, len(s), hashlib.sha256(s.encode('utf-8')).hexdigest()[:16]))
            if out and s:
                d = os.path.join(out, name); os.makedirs(d, exist_ok=True)
                open(os.path.join(d, part + '.html'), 'w', encoding='utf-8').write(s + '\n')
        i = html.find(head.strip()) + len(head.strip()); k = html.rfind(foot.strip()) + len(foot.strip())
        print('%-24s registered   head: %s; footer: %s' % (name, ', '.join(registered(html[i:html.find('</head>', i)].strip())[1]) or 'none',
                                                         ', '.join(registered(html[k:html.rfind('</body>')].strip())[1]) or 'none'))
    return rc


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
