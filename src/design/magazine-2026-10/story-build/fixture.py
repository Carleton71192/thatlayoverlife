#!/usr/bin/env python3
"""Builds an offline stand-in for a live story page (the sandbox cannot reach the site).

The Stories template element tree (src/pages/stories-template/tree-2026-10-26.json, read from Webflow on 26 Oct) is turned into
HTML node by node, the CMS bindings are filled from a story's CMS item (the Spain story by default), and the page is wrapped in the
13 Oct export's CSS, today's site head and footer code, the template's head and footer code, and the nav and footer from the export.
It is structurally faithful (same elements, classes and attributes as the live template) and visually close, not pixel-true.

Usage: python3 fixture.py [slug]   writes fixture-<slug>.html next to this file.
"""
import json, pathlib, re, sys, datetime, html
HERE = pathlib.Path(__file__).parent
ROOT = HERE.parents[3]
EXPORT = ROOT / 'handoff/claude-design-source/webflow-export-2026-10-13'
SLUG = sys.argv[1] if len(sys.argv) > 1 else 'spain-madrid-wedding-ibiza'
fd = json.loads((HERE.parent / 'story' / (SLUG + '.json')).read_text())
tree = json.loads((ROOT / 'src/pages/stories-template/tree-2026-10-26.json').read_text())['result']
while isinstance(tree, list): tree = tree[0]
if 'type' not in tree and 'children' not in tree: tree = next(v for v in tree.values() if isinstance(v, (dict, list)))
while isinstance(tree, list): tree = tree[0]

AUTHORS = {'6a0be79e01ee7eff10102ce9': ('Nancy Carleton', 'nancy-carleton', 'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg', 'Founder · Editor')}
EXTRA = {'spain-madrid-wedding-ibiza': ('Chesney Lish', 'chesney-lish', 'https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad65e8f2780d19349de64e9_6ad65e66249074db2462a667_chesney-lish-avatar.jpeg', 'Contributor'),
         'ghana-easter-everyone-wears-white': AUTHORS['6a0be79e01ee7eff10102ce9']}
author = AUTHORS.get(fd.get('contributor')) or EXTRA[SLUG]
author_home = 'Copenhagen, Denmark'  # the contributor's own location field, what the data-st3-loc span is bound to on the live page
d = datetime.datetime.fromisoformat(fd['published-date'].replace('Z', '+00:00'))
date_us = d.strftime('%B %-d, %Y')  # Webflow writes US order; the site's date script flips it on the page
loc = fd.get('byline-location') or ''
country = loc.split(',')[-1].strip().title() if loc else ''
pillar = fd.get('pillar-name') or ''
PLACEMENTS = {'pantanal-glimmers-in-the-wild': 'Day one: red lightning and the long nothing | pantanal-rhea-in-morning-mist<br>The road that ends on purpose | pantanal-driving-the-transpantaneira<br>Kilometer 42 | pantanal-jabiru-following-the-man-with-the-bucket<br>Kilometer 42 | pantanal-capybara-portrait<br>Why the jaguars let you watch | pantanal-jaguar-asleep-on-the-bank<br>Why the jaguars let you watch | pantanal-jaguar-charging-through-the-shallows<br>The stork, concluded | pantanal-jabiru-stork-in-the-marsh<br>Chapada, and down | pantanal-chapada-dos-guimaraes-cliffs<br>What I would tell you | pantanal-nancy-and-sami-in-the-safari-boat'}
PLACEMENT = PLACEMENTS.get(SLUG, '')
related = ('/stories/horseshoe-bend-arizona', 'https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad72ee26479034b2f7d3279_6ad72ec18bcd4df87c789510_barzy-adam-horseshoe-bend-hero.jpeg', 'Arizona, USA', 'My Unique Experience at Horseshoe Bend', '1')

TAG = {'Block': 'div', 'Section': 'section', 'Paragraph': 'p', 'Link': 'a', 'Image': 'img', 'RichText': 'div', 'DOM': 'span', 'Span': 'span',
       'Blockquote': 'blockquote', 'Heading': 'h2', 'DynamoWrapper': 'div', 'DynamoList': 'div', 'DynamoItem': 'div', 'DynamoEmpty': 'div',
       'LightboxWrapper': 'a', 'Emphasized': 'em', 'Body': 'div'}
EXTRA_CLASS = {'RichText': 'w-richtext', 'DynamoWrapper': 'w-dyn-list', 'DynamoList': 'w-dyn-items', 'DynamoItem': 'w-dyn-item', 'DynamoEmpty': 'w-dyn-empty', 'LightboxWrapper': 'w-lightbox'}

def sid(n): return n['id']['element'][-8:]
def classes(n): return ' '.join(n.get('styleNames') or [])
def attrs(n):
    a = dict(n.get('attributes') or {})
    s = n.get('settings') or {}
    return a, s

# bound values by element id suffix (from the tree outline) and by class
EMPTY = object()
BOUND = {
    '817a2e61': ('src', fd['hero-image']['url'], 'alt', fd['hero-image'].get('alt') or ''),
    'f7e07cbf': country, 'a800deb8': fd['name'],
    '5d6305b9': loc, '61ed671d': pillar or EMPTY, '9a28bd44': EMPTY, '55e75e72': str(fd.get('reading-time') or ''),
    '7f1dd53e': fd['name'], '7f1dd540': fd.get('excerpt') or '', '6029fd80': fd.get('hero-caption') or EMPTY,
    'cb25cb89': date_us,
    'b377369b': ('src', author[2], 'alt', ''), '6503491d': author[0], 'dd8ada04': 'home', 'd8bc2bf3': date_us,
    '57da4bc2': fd.get('city') or EMPTY, '1f063e7e': country or EMPTY, '5d271ef7': pillar or EMPTY,
    '3804a0fd': fd.get('excerpt') or EMPTY,
    'c690dd05': fd.get('short-version') or EMPTY, 'e5ae70d4': fd['body'], '7f1dd55a': fd.get('pull-quote') or EMPTY,
    'bb3ee217': fd.get('quick-answers') or EMPTY, '950066cb': fd.get('links-and-mentions') or EMPTY,
    'cfc795ac': fd.get('route-stops') or EMPTY, '7f5ea68f': fd.get('route-note') or EMPTY,
    'f05b7ae0': author[0], '9d4efa40': fd.get('edited-by') or EMPTY, '90996826': fd.get('trip-when') or EMPTY, '6ddfb898': date_us,
    '99ee6f28': EMPTY, '520d46d8': fd.get('cost-summary') or EMPTY, '408d8efc': fd.get('sources') or EMPTY, '634c826c': fd.get('disclosure') or EMPTY,
    'abb1fd72': ('src', author[2], 'alt', ''), '648569f9': author[3], 'f7c8b8f3': author[0], '1959b74d': EMPTY,
    '35ebef36': ('src', related[1], 'alt', related[3]), '210f48ed': related[2], '5b25af60': related[3], '4097c3b0': related[4],
    'bb4d4455': ('src', (fd.get('photo-gallery') or [{}])[0].get('url', 'placeholder.svg'), 'alt', ''),
    'd88dd3d1': PLACEMENT or EMPTY,
    '989f36db': EMPTY, 'f41a9f93': EMPTY,
}
SLUGS = {'fca59b21': '/contributors/' + author[1], '7bf36466': '/contributors/' + author[1], 'eeb22182': related[0], '1f063e7e': '/countries/' + country.lower().replace(' ', '-')}
RICH = {'c690dd05', 'e5ae70d4', 'bb3ee217', '950066cb', '7f1dd55a', 'd88dd3d1'}
GALLERY_JSON = json.dumps({'group': 'tll-story-gallery', 'items': [{'url': g['url'], 'type': 'image'} for g in (fd.get('photo-gallery') or [])]})

def render(n):
    t = n.get('type')
    if t == 'String':
        return html.escape(n.get('textContent') or n.get('text') or n.get('value') or '')
    if t == 'ComponentInstance' and sid(n) == 'bf1be033':  # TLL Sign-Off v1
        return '<div class="tll-signoff"><div class="tll-signoff-rule"></div><div class="tll-signoff-label">Signed,</div><div class="tll-signoff-name">%s</div><div class="tll-signoff-loc">%s</div></div>' % (html.escape(author[0]), html.escape(fd.get('sign-off') or ''))
    if t in ('ComponentInstance', 'HtmlEmbed'):
        return '<!-- %s %s -->' % (t, sid(n))
    a, s = attrs(n)
    tag = s.get('tag') or TAG.get(t, 'div')
    if t == 'Heading': tag = 'h%d' % (s.get('headingLevel') or 2)
    cls = classes(n)
    if EXTRA_CLASS.get(t): cls = (cls + ' ' + EXTRA_CLASS[t]).strip()
    k = sid(n)
    b = BOUND.get(k)
    inner = ''.join(render(c) for c in n.get('children') or [])
    if b is EMPTY:
        cls = (cls + ' w-dyn-bind-empty').strip()
    elif isinstance(b, tuple):
        a[b[0]] = b[1]; a[b[2]] = b[3]
    elif isinstance(b, str):
        inner = b if k in RICH else html.escape(b)
    if k in SLUGS: a['href'] = SLUGS[k]
    if t == 'LightboxWrapper': inner += '<script type="application/json" class="w-json">%s</script>' % GALLERY_JSON; a['href'] = '#'
    if k == 'd88dd3d1': a['data-story-slug'] = SLUG
    if k == 'dd8ada04': inner = html.escape(author_home); a['data-st3-byline'] = loc; a['data-st3-country-name'] = country; a['data-st3-country'] = country.lower().replace(' ', '-')  # live binding: the contributor's home; the st3 script swaps in the byline
    if s.get('visibility') is False: a['style'] = 'display:none'
    if a.get('data-tll-commissioned') and not fd.get('commissioned'): a['style'] = 'display:none'  # conditional visibility on the live page
    if t == 'DynamoWrapper' and k in ('7d9a821e', '554545ee', 'cfcf757c', 'c1ac0484'): inner = ''.join(render(c) for c in n.get('children') or [] if c.get('type') == 'DynamoEmpty')  # lists with no items
    if t == 'DynamoEmpty' and 'w-dyn-item' in inner: pass
    at = (' class="%s"' % cls if cls else '') + ''.join(' %s="%s"' % (x, html.escape(str(v), quote=True)) for x, v in a.items() if x != 'class')
    if tag == 'img': return '<img%s>' % at
    return '<%s%s>%s</%s>' % (tag, at, inner, tag)

article = render(tree)
# the empty-list blocks: Webflow renders either items or the empty block, not both. Drop the empty block where items exist.
article = re.sub(r'<div class="w-dyn-empty"><div>No items found\.</div></div>', '', article)

about_txt = (EXPORT / 'pages/about.html').read_text()
nav = about_txt[about_txt.index('<!-- component: TLL Nav v1 -->'):about_txt.index('</nav>') + len('</nav>')]
footer = about_txt[about_txt.index('<footer class="inline-footer-0-1"'):about_txt.index('</footer>') + len('</footer>')]
site_head = (ROOT / 'src/pages/spotlight/live-2026-10-25/site-head-after.html').read_text()
site_foot = (ROOT / 'src/site/site-footer-2026-10-21-after.html').read_text()
tpl_head = (ROOT / 'src/pages/stories-template/head-2026-10-19-after.html').read_text()
tpl_foot = (ROOT / 'src/pages/story/v3/template-footer-after-st3.html').read_text() + ''.join('<script>%s</script>' % (ROOT / f).read_text() for f in ['src/site-layers/tllinlinephotosv2a.js', 'src/site-layers/tllinlinephotosv2b.js', 'src/pages/story/perspective-invite-v1.js'])  # the template's page scripts, from the repo copies
embeds = ''.join((ROOT / p).read_text() for p in ['src/pages/story/v3/embed-st3-story-js-v1.html', 'src/pages/story/v3/embed-story-extras-v2.html', 'src/pages/story/live-2026-10-25/embed-5496c6ff-after.html'])
article = article.replace('<!-- HtmlEmbed 96aa8456 -->', embeds, 1)
CSS = ''.join('<link rel="stylesheet" href="/css/%s">' % f for f in ['fonts.css', 'webflow-base.css', 'tll-webflow.css'])  # served by shots.mjs from the export
page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(fd['name'])} | That Layover Life (offline fixture)</title>
{CSS}
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,800;1,800&family=JetBrains+Mono:wght@400;600&display=swap">
<!-- SITE HEAD CODE (Webflow site settings) -->
{site_head}
<!-- /SITE HEAD CODE -->
<!-- PAGE HEAD CODE -->
{tpl_head}
<!-- /PAGE HEAD CODE -->
<!--LAYER-->
</head><body class="body">
{nav}
{article}
{footer}
<!-- SITE FOOTER CODE (Webflow site settings) -->
{site_foot}
<!-- /SITE FOOTER CODE -->
<!-- PAGE FOOTER CODE -->
{tpl_foot}
<!-- /PAGE FOOTER CODE -->
</body></html>'''
out = HERE / ('fixture-%s.html' % SLUG)
out.write_text(page)
print('wrote', out.name, len(page) // 1024, 'KB')
