"""Builds tll-mag-cover-v1.html from cover.template.html, the cover story's CMS item and the stamp SVG of the story layer.
Run from the repo root: python3 src/design/magazine-2026-10/cover-build/build-cover.py
The cover story is COVER_SLUG below (the Stories collection's Weekend Read switch is stale, two Bulgaria pieces; and the
collection is at Webflow's 60-field limit). Change the slug, run this, rebuild the site layers bundle, pin and publish."""
import json, re, pathlib, datetime
D = pathlib.Path(__file__).resolve().parent; ROOT = D.parents[3]
COVER_SLUG = 'spain-madrid-wedding-ibiza'
AUTHORS = {'6ab3fabd46f0ae8633ccb97f': ('Chesney Lish', 'chesney-lish', 'https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad65e8f2780d19349de64e9_6ad65e66249074db2462a667_chesney-lish-avatar.jpeg'),
           '6a0be79e01ee7eff10102ce9': ('Nancy Carleton', 'nancy-carleton', 'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg')}
# per cover: the place as the chip says it, the stamp place, the coordinates and the crop focus (phone, desktop). CMS focal point field comes later.
TUNE = {'spain-madrid-wedding-ibiza': dict(place='Ibiza', stampPlace='IBIZA', coords='38.98° N 1.43° E', posPhone='50% 100%', posDesk='50% 100%', phoneZoom='90%')}
d = json.load(open(ROOT / 'src/design/magazine-2026-10/story' / (COVER_SLUG + '.json'))); fd = d.get('fieldData', d)
a = AUTHORS[fd['contributor']]
when = datetime.datetime.fromisoformat(fd['published-date'].replace('Z', '+00:00'))
t = TUNE.get(COVER_SLUG, {})
cover = dict(slug=fd['slug'], title=fd['name'], img=fd['hero-image']['url'], alt=fd['hero-image'].get('alt') or '', w=1440, h=1920,
             author=a[0], authorSlug=a[1], avatar=a[2], place=t.get('place') or (fd.get('byline-location') or '').split(',')[0].title(),
             stampPlace=t.get('stampPlace') or (fd.get('byline-location') or '').split(',')[0].upper()[:16],
             stampDate=when.strftime('%d %b %Y').upper(), stampArc=(fd.get('pillar-name') or '').upper() or 'BY THE PEOPLE WHO WENT',
             coords=t.get('coords', ''), posPhone=t.get('posPhone', '50% 50%'), posDesk=t.get('posDesk', '50% 50%'), phoneZoom=t.get('phoneZoom', '0%'),
             kicker="This week's cover", dek='Real places and real opinions, written by the people who went. Free to join, no card, no paywall.',
             button='Read the cover story')
# the people strip: the contributors as the live library rail names them, with what they went to; Nancy is one byline among them
PEOPLE = [dict(name='Chesney Lish', slug='chesney-lish', avatar=AUTHORS['6ab3fabd46f0ae8633ccb97f'][2], sub='Madrid and Ibiza'),
          dict(name='Barzy Adam', slug='barzy-adam', avatar='https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ad72dc2c7c33fe2b4d53be9_6ad72d778e0db3aa7718c140_barzy-adam-avatar.jpeg', sub='Arizona'),
          dict(name='Nancy Carleton', slug='nancy-carleton', avatar=AUTHORS['6a0be79e01ee7eff10102ce9'][2], sub='Editor · Copenhagen')]
svg = re.search(r"var SVG='(.*?)';\n", (ROOT / 'src/design/magazine-2026-10/story-build/tll-mag-story-v1.html').read_text()).group(1)
out = (D / 'cover.template.html').read_text().replace('/*COVER*/{}', json.dumps(cover, ensure_ascii=False)).replace("/*SVG*/''", "'" + svg + "'").replace('/*PEOPLE*/[]', json.dumps(PEOPLE, ensure_ascii=False))
(D / 'tll-mag-cover-v1.html').write_text(out)
print('built tll-mag-cover-v1.html for', cover['slug'], 'by', cover['author'], len(out), 'bytes')
