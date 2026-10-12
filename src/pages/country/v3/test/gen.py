import json,html,sys
V='/home/user/thatlayoverlife/src/pages/country/v3/'
head=open(V+'template-head-new.html').read()
foot=open(V+'template-footer-new.html').read()
embed=json.load(open('embed.json'))
def wf(s,d):  # resolve {{wf}} tokens
    import re
    def r(m):
        p=json.loads('{'+m.group(1)+'}')['path']
        return d.get(p,'')
    return re.sub(r'\{\{wf \{(.*?)\} \}\}',r,s)
import base64
PHOTO="data:image/svg+xml;base64,"+base64.b64encode('<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1350"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8d9b0"/><stop offset=".5" stop-color="#7fa3b8"/><stop offset="1" stop-color="#3d5a40"/></linearGradient></defs><rect width="2400" height="1350" fill="url(#g)"/><circle cx="1700" cy="300" r="180" fill="#fff6d0"/></svg>'.encode()).decode()
def e(s): return html.escape(s or '')
def page(c):
    d={'slug':c['slug'],'name':c['name'],'verdict':c['verdict'],'iso2':c['iso'],'story-ref:slug':c.get('sslug',''),'story-ref:name':c.get('sname','')}
    bind=lambda v,cls='':(f'class="{cls} w-dyn-bind-empty"' if not v else (f'class="{cls}"' if cls else ''))
    story=bool(c.get('sslug'))
    img=(f'<img data-ct3="hero-img" fetchpriority="high" aria-hidden="true" src="{PHOTO}" loading="lazy" alt="">' if story else '<img data-ct3="hero-img" fetchpriority="high" aria-hidden="true" src="https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg" loading="lazy" alt="" class="w-dyn-bind-empty">')
    fimg=(f'<img data-ct3="filed-img" src="{PHOTO}" loading="lazy" alt="">' if story else '<img data-ct3="filed-img" src="https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg" loading="lazy" alt="" class="w-dyn-bind-empty">')
    ok='<span data-ct3="dataok"></span>' if c.get('ok') else '<span data-ct3="dataok" class="w-condition-invisible"></span>'
    facts=''.join(f'<div class="tllcx-fact"><div class="tllcx-label">{l}</div><div class="tllcx-value{"" if v else " w-dyn-bind-empty"}">{e(v)}</div></div>' for l,v in c['facts'])
    word=c.get('word') or {}
    qa=c.get('qa','')
    expat=c.get('expat')
    dirnode=(f'<div data-tll-dir="1" data-name="{e(expat["name"])}" data-slug="x" data-lives="{e(c["name"])}" data-since="2018" data-knows="" data-tags="Food, Trains" data-links="[]" data-cmode="none"><img src="{PHOTO}" alt=""></div>' if expat else '')
    body=f'''<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{e(c["name"])} · Country Guide</title>
<style>*{{box-sizing:border-box}} body{{margin:0;font-family:'IBM Plex Sans Condensed',system-ui,sans-serif;color:#0A0B14}} .tll-eyebrow-teal{{font-family:monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase}} h1{{font-size:56px}} .tll-fos-card-open{{border:1.5px dashed #c9b89a;border-radius:16px;padding:24px;background:#fff}} .tll-fos-label{{font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#067A79}} .tll-btn{{display:inline-block;padding:12px 18px;border-radius:999px}} .tll-place-btn{{border:1px solid #ccc;padding:8px 14px}} .w-condition-invisible{{display:none!important}} nav.mock{{height:64px;background:#0A0B14;color:#F7F1E8;display:flex;align-items:center;padding:0 24px;font-family:monospace}} footer.mock{{height:120px;background:#0A0B14}}</style>
{wf(head,d)}</head><body><nav class="mock">TLL Nav v1 (mock)</nav><main>
<div class="w-embed">{embed}</div>
<section class="tllcx-hero">{img}<div class="tllcx-wrap"><div class="tllcx-flag">{c["flag"]}</div><div class="tll-eyebrow-teal">{e(c["region"])}</div><h1>{e(c["name"])}</h1><p class="tllcx-verdict">{e(c["verdict"])}</p><div data-tll-ctry="v2"><div class="tll-trav-meta" data-tll-ctry-meta="1"> </div></div>
<div data-ct3="src" hidden="hidden" aria-hidden="true" data-name="{e(c["name"])}" data-iso="{c["iso"]}" data-checked="{e(c.get("checked",""))}" data-adv-url="{e(c.get("adv",""))}" data-adv-checked="{e(c.get("advc",""))}" data-fcdo-url="{e(c.get("fcdo",""))}" data-fcdo-rev="{e(c.get("fcdor",""))}" data-oneword="{e(word.get("w",""))}" data-s-name="{e(c.get("sname",""))}" data-s-slug="{e(c.get("sslug",""))}" data-s-pillar="{e(c.get("pillar",""))}" data-s-rt="{e(str(c.get("rt","")))}" data-s-pub="{e(c.get("pub",""))}">{ok}</div></div></section>
<div data-ct3="bar"><div data-ct3="bar-wrap"><div class="tll-places" data-tll-places="country"><div data-tll-place-alt="1" hidden aria-hidden="true">{e(c["name"])}</div><div data-tll-ctry-iso="1" hidden aria-hidden="true">{c["iso"]}</div><a class="tll-place-btn" data-tll-place-toggle="been" role="button" aria-pressed="false" href="#">Been here</a><a class="tll-place-btn" data-tll-place-toggle="want" role="button" aria-pressed="false" href="#">Want to go</a><div class="tll-places-note" data-tll-places-note="1" role="status">Log in to save</div></div></div></div>
<section class="tllcx-body"><div class="tllcx-wrap">
<div class="tll-fos-card-open" data-tll-ctry-qa="1"><div class="tll-fos-label" data-tll-t="qa-label">Quick answers · from the travelers who logged it</div><h2 class="tll-trav-name-ink">What do travelers say about this country?</h2><div class="tll-fos-body" data-tll-t="qa-body">Worth leaving the airport? Cash or card? Best month to go? The first traveler to log this country answers them here, with a name and a date.</div><div data-ct3="qa-src" aria-hidden="true" class="w-richtext{"" if qa else " w-dyn-bind-empty"}">{qa}</div></div>
<div class="tllcx-eb" role="heading" aria-level="2">At a glance</div>
<div class="tllcx-facts">{facts}</div>
<div class="tllcx-word"><div class="tllcx-eb" role="heading" aria-level="2">One word to know</div><div class="tllcx-big{"" if word else " w-dyn-bind-empty"}">{e(word.get("w",""))}</div><p class="{"" if word else "w-dyn-bind-empty"}">{e(word.get("g",""))}</p><p class="tllcx-src{"" if word else " w-dyn-bind-empty"}">{e(word.get("s",""))}</p><p class="tllcx-src w-dyn-bind-empty"></p></div>
<div class="tllcx-filed" id="tll-filed"><div class="tllcx-filed-eyebrow" role="heading" aria-level="2">Filed from here</div><a class="tllcx-filed-card" id="tll-filed-link" href="/stories">{fimg}<div class="tllcx-filed-title" id="tll-filed-title">Story</div><div class="tllcx-filed-meta">Read the story →</div></a>
<div id="tllcf-layovers" class="w-dyn-list"><div class="w-dyn-empty"><div>No items found.</div></div></div><div id="tllcf-races" class="w-dyn-list"><div class="w-dyn-empty"><div>No items found.</div></div></div><div id="tllcf-diary" class="w-dyn-list"><div class="w-dyn-empty"><div>No items found.</div></div></div>
<div class="tllcx-filed-open">Been somewhere here we have not covered? <a class="tllcx-filed-openlink" href="/submit">File the next one →</a></div></div>
<div data-tll-ctry-after="1"><div data-tll-ctry-wire="1" hidden><div class="tll-fos-head"><div class="tll-fos-eyebrow" data-tll-ctry-wire-label="1" role="heading" aria-level="2">On the wire</div><a class="tll-fos-wire" href="/travel-wire">All travel news →</a></div><div data-tll-ctry-wire-list="1"></div></div>
<div class="tll-fos-card-open" data-tll-ctry-subs="1"><div class="tll-fos-label" data-tll-ctry-subs-label="1" role="heading" aria-level="2">Reader submissions</div><div class="tll-fos-body" data-tll-ctry-subs-body="1">Nothing from the readers yet.</div><a class="tll-fos-cta" href="/submit">Submit yours →</a></div></div>
<div class="tllcx-cta"><h2>Been here?</h2><p>Add it to your map, or write the story nobody has written yet.</p><a class="tll-btn tll-btn-primary" href="/the-map">Log it</a><a class="tll-btn tll-btn-ghost-rose" href="/submit">Pen a tale</a></div>
<p class="tllcx-src">Sources: population and capital from public World Bank and national data; travel advice from the Government of Canada and the UK Foreign Office. Check the official advice before you book.</p>
</div></section>
<section data-tll-cx-expats="" data-tll-cx-name="{e(c["name"])}"><div data-tll-cx-wrap=""><div data-tll-cx-left=""><div data-tll-cx-eyebrow="">Expats who know <span data-tll-cx-country=""></span></div><h2 data-tll-cx-h2="">The people who <em>live it.</em></h2><div data-tll-cx-counts=""></div><div data-tll-cx-grid=""></div><div hidden data-tll-cx-empty=""><p data-tll-cx-emptyline=""></p><a href="/edit-profile">Switch on "I'm an expat" →</a></div><p hidden data-tll-cx-join="">One expat is a real answer, not a thin page. Lived here too? <a href="/edit-profile">Join the list</a>.</p></div>
<aside data-tll-cx-res=""><div data-tll-cx-eyebrow="">Where expats already gather</div><div data-tll-cx-groups=""></div><div data-tll-cx-reslist=""></div><p data-tll-cx-resnote="">External sites. We don't run them, we just think they're useful.</p><a href="mailto:hello@thatlayover.life" data-tll-cx-suggest="">Suggest a resource →</a></aside></div>
<div data-tll-cx-src=""><div class="w-dyn-list"><div class="w-dyn-items"><div class="w-dyn-item">{dirnode}</div></div></div></div></section>
</main><footer class="mock"></footer>
<script>{c.get("ms","")}</script>
{wf(foot,d)}</body></html>'''
    return body
cases=json.load(open('cases.json'))
for c in cases:
    open(c['file'],'w').write(page(c))
print('ok',len(cases))
