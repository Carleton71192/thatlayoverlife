import os,re,json,collections
from html.parser import HTMLParser
C='/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-cache/html'
def pagepath(f):
    k=f[:-5]
    if k=='home': return '/'
    if k=='profile': return '/contributors/<profile>'
    return '/'+k.replace('__','/')
class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.ids=collections.Counter(); s.hrefs=[]; s.imgs=[]; s.stack=[]; s.inscript=False
    def handle_starttag(s,t,a):
        a=dict(a)
        if t=='script': s.inscript=True
        if 'id' in a and a['id']: s.ids[a['id']]+=1
        if 'name' in a and t=='a': s.ids[a['name']]+=1
        if t=='a' and 'href' in a: s.hrefs.append(a['href'] or '')
        if t=='img': s.imgs.append(a)
    def handle_endtag(s,t):
        if t=='script': s.inscript=False
out={}
pages={}
for f in sorted(os.listdir(C)):
    if not f.endswith('.html'): continue
    h=open(os.path.join(C,f),encoding='utf8',errors='replace').read()
    p=P(); p.feed(h); pages[pagepath(f)]=p
for path,p in pages.items():
    r={}
    r['dup_ids']={k:v for k,v in p.ids.items() if v>1}
    bad=[]
    for hr in p.hrefs:
        if hr.startswith('#') and len(hr)>1:
            if hr[1:] not in p.ids: bad.append(hr)
        m=re.match(r'^(/[^#?]*)(?:\?[^#]*)?#(.+)$',hr)
        if m:
            tp=m.group(1).rstrip('/') or '/'
            tgt=pages.get(tp)
            if tgt is None: bad.append(hr+' (target not cached)')
            elif m.group(2) not in tgt.ids: bad.append(hr)
    r['bad_anchors']=sorted(set(bad))
    noalt=[]; emptyalt=0
    for a in p.imgs:
        src=a.get('src','') or a.get('data-src','')
        if 'alt' not in a: noalt.append(src[-70:])
        elif not (a.get('alt') or '').strip(): emptyalt+=1
    r['img_total']=len(p.imgs); r['img_no_alt']=noalt; r['img_empty_alt']=emptyalt
    r['hash_only_links']=sum(1 for x in p.hrefs if x=='#')
    r['js_links']=sum(1 for x in p.hrefs if x.lower().startswith('javascript'))
    out[path]=r
json.dump(out,open('/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-debug/static.json','w'),indent=1)
for k,r in out.items():
    print(k, 'dup', r['dup_ids'], 'bad', r['bad_anchors'], 'imgs', r['img_total'], 'noalt', len(r['img_no_alt']), 'empty', r['img_empty_alt'], '#', r['hash_only_links'])
