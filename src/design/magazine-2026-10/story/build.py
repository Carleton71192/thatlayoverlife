#!/usr/bin/env python3
"""Builds the story page prototype from template.html and ghana.json (the CMS item, read 26 Oct 2026, untouched).
Writes story.html (CDN photos, Google Fonts) and story-local.html (offline)."""
import json, pathlib, re, sys, datetime
HERE = pathlib.Path(__file__).parent
ROOT = HERE.parents[3]
sys.path.insert(0, str(ROOT / 'src/pages/home/mobile-proto-2026-10-26'))
from build import IMG, CDN
fd = json.loads((HERE / 'ghana.json').read_text())
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
# the pull quote is the last sentence of the story, chosen by hand (the CMS field is empty)
pull = 'Ghana gave us drumbeats, hibiscus, monkeys with no concept of personal space, and a sun warm enough to undo a Danish winter.'
assert pull in body
rep = {
    '<!--PILLAR-->': fd['pillar-name'], '<!--PLACE-->': 'Ghana', '<!--TITLE-->': fd['name'], '<!--DEK-->': fd['excerpt'],
    '<!--DATE-->': date_long, '<!--MINS-->': str(fd['reading-time']), '<!--BODY-->': body, '<!--PULL-->': pull,
    '<!--QA-->': fd['quick-answers'], '<!--SIGNOFF-->': fd['sign-off'], '<!--QUESTION-->': fd['reader-question'],
    '<!--STAMP-->': make('ACCRA', d.strftime('%d %b %Y').upper(), '5.60° N · 0.19° W', 'gh'),
    '<!--STAMP-ES-->': make('MADRID', '27 SEP 2024', '40.42° N · 3.70° W', 'es'),
    '<!--STAMP-BR-->': make('PANTANAL', '09 OCT 2026', '16.4° S · 56.5° W', 'br'),
    '<!--STAMP-DK-->': make('TØNDER', '29 SEP 2026', '54.93° N · 8.86° E', 'dk'),
}
page = tpl
for k, v in rep.items():
    assert k in page, k
    page = page.replace(k, v)
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
