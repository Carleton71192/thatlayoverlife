#!/usr/bin/env python3
"""Builds the story page prototype from template.html and a CMS story (read 26 Oct 2026, untouched): spain-madrid-wedding-ibiza.json
by default (a contributor's story), or the slug given as the first argument.
Writes story.html (CDN photos, Google Fonts) and story-local.html (offline)."""
import json, pathlib, re, sys, datetime
HERE = pathlib.Path(__file__).parent
ROOT = HERE.parents[3]
sys.path.insert(0, str(ROOT / 'src/pages/home/mobile-proto-2026-10-26'))
from build import IMG, CDN
SLUG = sys.argv[1] if len(sys.argv) > 1 else 'spain-madrid-wedding-ibiza'
fd = json.loads((HERE / (SLUG + '.json')).read_text())
AUTHORS = {  # contributor id in the CMS: name, page, avatar
    '6a0be79e01ee7eff10102ce9': ('Nancy Carleton', '/contributors/nancy-carleton', 'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg'),
}
STORY = {  # per slug: author (when the CMS contributor is not Nancy), hero alt, caption, stamp place and coordinates, pull quote prefix
    'spain-madrid-wedding-ibiza': dict(author=('Chesney Lish', '/contributors/chesney-lish', 'https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad65e8f2780d19349de64e9_6ad65e66249074db2462a667_chesney-lish-avatar.jpeg'), alt='Sunset over the sea from a beach bar in Ibiza, the sun low behind a thatched roof', caption='Sunset from a beach bar, Ibiza.', place='MADRID', coords='40.42° N · 3.70° W', pull='The sunset that evening'),
    'ghana-easter-everyone-wears-white': dict(author=AUTHORS['6a0be79e01ee7eff10102ce9'], alt='Kids in Ghana at Easter', caption='Kids at Easter, Accra.', place='ACCRA', coords='5.60° N · 0.19° W', pull='Ghana gave us drumbeats'),
}
S = STORY[SLUG]
author = AUTHORS.get(fd.get('contributor')) or S['author']
tpl = (HERE / 'template.html').read_text()
stamp = re.sub(r'<!--.*?-->', '', (HERE.parent / 'stamp/stamp.svg').read_text(), flags=re.S).replace('width="200" height="200" ', '')

def make(place, date, coords, uid):
    s = stamp.replace('CURAÇAO', place).replace('12 OCT 2026', date).replace('12.17° N · 68.99° W', coords)
    s = s.replace('Curaçao, 12 October 2026, 12.17 degrees north, 68.99 degrees west', place.title() + ', ' + date)
    for i in ('ink', 'top', 'bottom'):
        s = s.replace('id="%s"' % i, 'id="%s-%s"' % (i, uid)).replace('url(#%s)' % i, 'url(#%s-%s)' % (i, uid)).replace('href="#%s"' % i, 'href="#%s-%s"' % (i, uid))
    return s

d = datetime.datetime.fromisoformat(fd['published-date'].replace('Z', '+00:00'))
date_long = f"{d.day} {d.strftime('%B %Y')}"
body = fd['body']
# the pull quote: the CMS field when set, else the sentence that starts with the prefix above, chosen by hand
plain = re.sub(r'<[^>]+>', ' ', body)
m = re.search(re.escape(S['pull']) + r'[^.!?]*[.!?]', plain)
pull = (fd.get('pull-quote') or '').strip() or (m.group(0).strip() if m else '')
assert pull, 'no pull quote'
rep = {
    '<!--PILLAR-->': fd.get('pillar-name') or 'Story', '<!--PLACE-->': (fd.get('byline-location') or '').title().split(',')[-1].strip() or 'Somewhere', '<!--TITLE-->': fd['name'], '<!--DEK-->': fd['excerpt'],
    '<!--AUTHOR-->': author[0], '<!--AUTHOR-HREF-->': author[1], '<!--AVATAR-->': author[2], '<!--LOCATION-->': (fd.get('byline-location') or '').title(),
    '<!--HERO-->': fd['hero-image']['url'], '<!--HERO-ALT-->': S['alt'], '<!--CAPTION-->': S['caption'],
    '<!--DATE-->': date_long, '<!--MINS-->': str(fd['reading-time']), '<!--BODY-->': body, '<!--PULL-->': pull,
    '<!--QA-->': fd['quick-answers'], '<!--SIGNOFF-->': fd['sign-off'], '<!--QUESTION-->': fd['reader-question'],
    '<!--STAMP-->': make(S['place'], d.strftime('%d %b %Y').upper(), S['coords'], 'st'),
    '<!--STAMP-AZ-->': make('ARIZONA', '30 SEP 2024', '36.88° N · 111.51° W', 'az'),
    '<!--STAMP-BR-->': make('PANTANAL', '09 OCT 2026', '16.4° S · 56.5° W', 'br'),
    '<!--STAMP-GH-->': make('ACCRA', '19 SEP 2026', '5.60° N · 0.19° W', 'gh'),
}
page = tpl
for k, v in rep.items():
    assert k in page, k
    page = page.replace(k, v)
assert fd.get('quick-answers'), 'no quick answers'
assert '<!--' not in page.replace('<!--FONTS-->', ''), re.search(r'<!--[A-Z-]+-->', page).group(0)

FONT_DIR = '../type/fonts/'
faces = [('Newsreader', 'normal', '200 800', 'newsreader-latin-wght-normal'), ('Newsreader', 'italic', '200 800', 'newsreader-latin-wght-italic'),
         ('Inter Tight', 'normal', '100 900', 'inter-tight-latin-wght-normal'), ('Inter Tight', 'italic', '100 900', 'inter-tight-latin-wght-italic'),
         ('JetBrains Mono', 'normal', '400', 'jetbrains-mono-latin-400-normal'), ('JetBrains Mono', 'normal', '600', 'jetbrains-mono-latin-600-normal')]
LOCAL = '<style>' + ''.join(f"@font-face{{font-family:'{f}';font-style:{s};font-weight:{w};font-display:swap;src:url({FONT_DIR}{file}.woff2) format('woff2')}}" for f, s, w, file in faces) + '</style>'
GOOGLE = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:wght@400;600&display=swap">'
(HERE / 'story.html').write_text(page.replace('<!--FONTS-->', GOOGLE))
local = page.replace('<!--FONTS-->', LOCAL)
for key, f in IMG.items():
    local = local.replace(CDN + key, '../../../pages/home/mobile-proto-2026-10-26/img/' + f)
assert CDN not in local, re.search(re.escape(CDN) + r'\S+', local).group(0)
(HERE / 'story-local.html').write_text(local)
print('wrote story.html and story-local.html', len(page) // 1024, 'KB')
