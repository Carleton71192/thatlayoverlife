d='/home/user/thatlayoverlife/src/pages/destinations/v3/'
head=open(d+'head-new.html').read()
foot=open(d+'orig/page-footer-orig.html').read()
stories=[('Balkans','Europe',14,'Balkans EV road trip, twelve countries','','balkans-ev'),('CHILE AND ARGENTINA','Americas',6,'Patagonia','','patagonia'),('RUDBØL, DENMARK','Europe',5,'Birds','','birds'),('SOUTHERN AFRICA','Africa',5,'Cubs','','cubs'),('Accra, Ghana','Africa',9,'Easter in Accra, where everyone wears white','GH','ghana-easter'),('Pantanal, Brazil','Americas',11,'Jaguars of the Pantanal','','pantanal'),('','Antarctica',8,'Seven continents, one marathon','AQ','antarctica')]
def card(p,r,m,t,iso,slug,cname='Antarctica'):
    return f'''<div role="listitem" class="w-dyn-item"><a data-ds3="card" data-ds3-slug="{slug}" href="/detail_stories" class="w-inline-block"><div data-ds3="media"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='110'%3E%3Crect width='400' height='110' fill='%23556'/%3E%3C/svg%3E" loading="lazy" alt="" data-ds3="img"><div data-ds3="flag" aria-hidden="true"></div></div><div data-ds3="body"><div data-ds3="place" class="{'w-dyn-bind-empty' if not p else ''}">{p}</div><div data-ds3="meta">{r}</div><div data-ds3="title">{t}</div><div data-ds3="read">Read the story →</div></div><div data-ds3="data" aria-hidden="true"><div data-ds3="mins">{m}</div><div data-ds3="cname">{cname if not p else ''}</div><div data-ds3="iso">{iso}</div></div></a></div>'''
countries=[('Antarctica','AQ',''),('Brazil','BR',''),('Bulgaria','BG','Balkans EV road trip'),('Chad','TD',''),('Denmark','DK',''),('Ghana','GH','Easter in Accra'),('Kosovo','',''),('Saint Vincent and the Grenadines','VC','')]
def tile(n,iso,st):
    return f'<div role="listitem" class="w-dyn-item"><a data-ds3="tile" data-ds3-iso="{iso}" data-ds3-slug="{n.lower().replace(" ","-")}" href="/detail_countries" class="w-inline-block"><div data-ds3="tflag" aria-hidden="true"></div><div data-ds3="ttext"><div data-ds3="tname">{n}</div><div data-ds3="tstory" aria-hidden="true" class="{"" if st else "w-dyn-bind-empty"}">{st}</div></div></a></div>'
body=f'''<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{{margin:0;font-family:sans-serif;background:#F7F1E8}} .tlldx-main-inner,.tlldx-hero-inner{{max-width:1200px;margin:0 auto;padding:0 16px}} .tlldx-main{{background:#F7F1E8;padding:24px 0}}</style>
{head}</head><body>
<nav style="height:60px;background:#0A0B14;color:#fff">NAV</nav>
<div class="tlldx-page">
<section class="tlldx-hero"><div class="tlldx-hero-inner"><div class="tlldx-eyebrow">THE ATLAS</div><h1 class="tlldx-h1">Every story starts <em class="tlldx-accent">somewhere</em>.</h1><p class="tlldx-sub">Every country with a story on TLL, and every country still waiting for one.</p></div></section>
<section class="tlldx-main"><div class="tlldx-main-inner">
<h2 class="tlldx-h2">Every country, every <em class="tlldx-accent2">story</em>.</h2>
<div data-ds3="shelf" class="w-dyn-list"><div role="list" class="w-dyn-items">{''.join(card(*s) for s in stories)}</div></div>
<div class="tlldx-grid"><a href="/share" class="tlldx-card tlldx-card-open w-inline-block"><div class="tlldx-flag">🗺</div><div class="tlldx-country">Your country here</div><div class="tlldx-meta">OPEN SLOT · ANY COUNTRY</div><p class="tlldx-desc">File a story and put a pin in it. A human reviews it within 48 hours, edited lightly.</p><div class="tlldx-read">Share your story →</div></a></div>
<div class="tlldx-guides">
<div id="atlas-all" data-tll-anchor="atlas-all" data-tll-atlas="all"><p data-tll-atlas="kicker">EVERY COUNTRY · BY FLAG</p><ul aria-label="Every country by flag" data-tll-atlas="grid"></ul>
<div data-ds3="atlas" data-ds3-part="1" class="w-dyn-list"><div role="list" class="w-dyn-items">{''.join(tile(*c) for c in countries[:5])}</div></div>
<div data-ds3="atlas" data-ds3-part="2" class="w-dyn-list"><div role="list" class="w-dyn-items">{''.join(tile(*c) for c in countries[5:])}</div></div>
</div>
<p class="tlldx-guides-note">Empty country? <a href="/submit" class="tlldx-guides-link">Be the first to tell us about it →</a></p>
</div></div></section>
<section class="tlldx-cta"><div class="tlldx-cta-inner"><div class="tlldx-eyebrow">THE MAP</div><h2 class="tlldx-ctah2">See where the pins <em class="tlldx-accent">drop</em>.</h2><p class="tlldx-ctacopy">Every country the founder has been to, on the map, with the story behind the pin.</p><div class="tlldx-btnrow"><a href="/the-map" class="tlldx-btn-primary">Open the map</a> <a href="/stories" class="tlldx-btn-ghost">All stories</a></div></div></section>
</div>
<footer style="height:80px;background:#0A0B14"></footer>
<script>
/* mock memberstack */
localStorage.setItem('tllStatesOwner','mem_1');
localStorage.setItem('tllStates',JSON.stringify({{v:2,travelers:[{{id:'t1'}},{{id:'p1',pet:true}}],states:{{'100':{{t1:'lived'}},'24':{{p1:'visited'}},'208':{{t1:'layover'}},'76':{{t1:'visited'}}}}}}));
window.$memberstackDom={{getCurrentMember:function(){{return Promise.resolve({{data:{{id:'mem_1'}}}});}},getMemberJSON:function(){{return Promise.resolve({{data:{{}}}});}}}};
</script>
{foot}
</body></html>'''
open(d+'test/mock.html','w').write(body)
