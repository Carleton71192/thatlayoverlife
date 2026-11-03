import json,re,sys,urllib.request,time
H='https://that-layover-life.webflow.io'
def get(p):
    r=urllib.request.Request(H+p+'?v='+str(time.time()),headers={'User-Agent':'Mozilla/5.0 TLL-check'})
    return urllib.request.urlopen(r,timeout=30).read().decode('utf-8','replace')
h=get('/'); print('layers src:',re.findall(r'src="([^"]*tll-site-layers[^"]*)"',h))
sm=get('/sitemap.xml'); locs=re.findall(r'<loc>([^<]+)</loc>',sm)
pre=('/pillars/','/paw-passport/','/layovers/','/marathon-diaries/','/contributors/','/pets/')
paths=sorted({re.sub(r'^https?://[^/]+','',u) for u in locs if any(p in u for p in pre)})
# also pages not in sitemap (noindex ones)
for extra in ['/pillars/paw-passport','/pets/magnus-waffles','/marathon-diaries/copenhagen-marathon-2026-recap','/marathon-diaries/tokyo-marathon-2027-prerace']:
    if extra not in paths: paths.append(extra)
for p in paths:
    try: h=get(p)
    except Exception as e: print(p,'ERR',e); continue
    blocks=re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>',h,re.S)
    out=[]
    for b in blocks:
        try:
            j=json.loads(b); g=j.get('@graph',[j])
            for n in g:
                t=n.get('@type'); 
                if t=='BreadcrumbList': out.append('BC'+str(len(n['itemListElement']))+':'+n['itemListElement'][-1]['name'][:20]); continue
                empty=[k for k,v in n.items() if v=='' ]
                out.append(f"{t}:{(n.get('name') or n.get('headline') or '')[:28]}|date={n.get('datePublished') or n.get('dateModified') or ''}|empty={empty}")
        except Exception as e: out.append('PARSE-ERR '+str(e)[:60])
    print(p,'|',len(blocks),'blocks |',' ; '.join(out))
