"""Builds the static (crawlable, no-JS) shelf cards from a Stories CMS export. Run: python3 build_shelf.py stories.json > embed-shelf-cards.html"""
import json, sys, html
st = json.load(open(sys.argv[1]))
AV = "https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6aba2059525e130282e72224_nancy-carleton-avatar.jpg"
rows = []
for s in st:
    if s.get('isDraft') or s.get('isArchived'): continue
    f = s['fieldData']
    loc = (f.get('byline-location') or '').strip()
    country = loc.split(',')[-1].strip().title().replace(' And ', ' and ')
    img = (f.get('hero-image') or {})
    rows.append(dict(slug=f['slug'], name=f['name'], date=f.get('published-date') or '', mins=f.get('reading-time') or '',
                     pillar=f.get('pillar-name') or '', country=country, img=img.get('url', ''), alt=img.get('alt') or f['name']))
rows.sort(key=lambda r: r['date'], reverse=True)
e = lambda x: html.escape(str(x), quote=True)
for r in rows:
    print(f'<a class="h3-card" href="/stories/{e(r["slug"])}" data-slug="{e(r["slug"])}" data-pillar="{e(r["pillar"])}" data-date="{e(r["date"][:10])}" data-loc="{e(r["country"])}" data-mins="{e(r["mins"])}">'
          f'<div class="h3-card-ph"><img src="{e(r["img"])}" alt="{e(r["alt"])}" loading="lazy" decoding="async" width="380" height="475"><span class="h3-card-tag">{e(r["country"])}</span></div>'
          f'<h3 class="h3-card-title">{e(r["name"])}</h3>'
          f'<p class="h3-card-meta">{e(r["pillar"])} · {e(r["mins"])} min</p>'
          f'<p class="h3-card-by"><img src="{AV}" alt="" width="26" height="26" loading="lazy"><b>Nancy Carleton</b> · {e(r["country"])}</p></a>')
