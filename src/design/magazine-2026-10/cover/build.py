#!/usr/bin/env python3
"""Builds the cover prototype from template.html: inlines the stamp (with place, date and coordinates per story) and Nancy's map,
then writes cover.html (CDN photos, Google Fonts for the text faces that are on it, plus the fontsource files for the rest)
and cover-local.html (everything from local folders, for offline screenshots)."""
import pathlib, re, sys
HERE = pathlib.Path(__file__).parent
ROOT = HERE.parents[3]
sys.path.insert(0, str(ROOT / 'src/pages/home/mobile-proto-2026-10-26'))
tpl = (HERE / 'template.html').read_text()
stamp = (HERE.parent / 'stamp/stamp.svg').read_text()
stamp = re.sub(r'<!--.*?-->', '', stamp, flags=re.S).replace('width="200" height="200" ', '')

def make(place, date, coords, uid):
    s = stamp.replace('CURAÇAO', place).replace('12 OCT 2026', date).replace('12.17° N · 68.99° W', coords)
    s = s.replace('Curaçao, 12 October 2026, 12.17 degrees north, 68.99 degrees west', place.title() + ', ' + date)
    for i in ('ink', 'top', 'bottom'):  # unique ids per copy
        s = s.replace('id="%s"' % i, 'id="%s-%s"' % (i, uid)).replace('url(#%s)' % i, 'url(#%s-%s)' % (i, uid)).replace('href="#%s"' % i, 'href="#%s-%s"' % (i, uid))
    return s

page = tpl.replace('<!--STAMP-->', make('IBIZA', '27 SEP 2024', '38.98° N · 1.43° E', 'cv'))
page = page.replace('<!--STAMP-AZ-->', make('ARIZONA', '30 SEP 2024', '36.88° N · 111.51° W', 'az'))
page = page.replace('<!--STAMP-ES-->', make('MADRID', '27 SEP 2024', '40.42° N · 3.70° W', 'es'))
page = page.replace('<!--STAMP-BR-->', make('PANTANAL', '09 OCT 2026', '16.4° S · 56.5° W', 'br'))
page = page.replace('<!--MAP-->', (ROOT / 'src/pages/home/mobile-proto-2026-10-26/map.svg').read_text())
assert '<!--STAMP' not in page and '<!--MAP' not in page

FONT_DIR = '../type/fonts/'
faces = [
    ('Newsreader', 'normal', '200 800', 'newsreader-latin-wght-normal'), ('Newsreader', 'italic', '200 800', 'newsreader-latin-wght-italic'),
    ('Fraunces', 'normal', '100 900', 'fraunces-latin-wght-normal'), ('Fraunces', 'italic', '100 900', 'fraunces-latin-wght-italic'),
    ('Instrument Serif', 'normal', '400', 'instrument-serif-latin-400-normal'), ('Instrument Serif', 'italic', '400', 'instrument-serif-latin-400-italic'),
    ('Inter Tight', 'normal', '100 900', 'inter-tight-latin-wght-normal'), ('Inter Tight', 'italic', '100 900', 'inter-tight-latin-wght-italic'),
    ('Instrument Sans', 'normal', '400', 'instrument-sans-latin-400-normal'), ('Instrument Sans', 'normal', '500', 'instrument-sans-latin-500-normal'),
    ('Playfair Display', 'normal', '800', 'playfair-display-latin-800-normal'), ('Playfair Display', 'italic', '800', 'playfair-display-latin-800-italic'),
    ('JetBrains Mono', 'normal', '400', 'jetbrains-mono-latin-400-normal'), ('JetBrains Mono', 'normal', '600', 'jetbrains-mono-latin-600-normal'),
]
def css(prefix):
    return '<style>' + ''.join(f"@font-face{{font-family:'{f}';font-style:{s};font-weight:{w};font-display:swap;src:url({prefix}{file}.woff2) format('woff2')}}" for f, s, w, file in faces) + '</style>'
GOOGLE = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&family=Instrument+Serif:ital@0;1&family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Instrument+Sans:wght@400;500&family=Playfair+Display:ital,wght@0,800;1,800&family=JetBrains+Mono:wght@400;600&display=swap">'

from build import IMG, CDN  # the photo map from the phone prototype
(HERE / 'cover.html').write_text(page.replace('<!--FONTS-->', GOOGLE))
local = page.replace('<!--FONTS-->', css(FONT_DIR))
for key, f in IMG.items():
    local = local.replace(CDN + key, '../../../pages/home/mobile-proto-2026-10-26/img/' + f)
assert CDN not in local, re.search(re.escape(CDN) + r'\S+', local).group(0)
(HERE / 'cover-local.html').write_text(local)
print('wrote cover.html and cover-local.html', len(page) // 1024, 'KB')
