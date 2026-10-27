import urllib.request, urllib.error, re, json, sys, time, html
from urllib.parse import urljoin, urlparse, urldefrag
BASE='https://that-layover-life.webflow.io'
HOSTS={'that-layover-life.webflow.io','www.thatlayover.life','thatlayover.life'}
UA={'User-Agent':'Mozilla/5.0 (TLL site check)'}
class NoRedir(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*a,**k): return None
op=urllib.request.build_opener(NoRedir)
def fetch(u):
    try:
        r=op.open(urllib.request.Request(u,headers=UA),timeout=25)
        return r.status, dict(r.headers), r.read().decode('utf-8','replace')
    except urllib.error.HTTPError as e:
        body=''
        try: body=e.read().decode('utf-8','replace')
        except: pass
        return e.code, dict(e.headers), body
    except Exception as e:
        return 0, {}, str(e)
def norm(u):
    u=urldefrag(u)[0]
    p=urlparse(u)
    if p.netloc and p.netloc not in HOSTS: return None
    if p.scheme not in ('http','https',''): return None
    path=p.path or '/'
    return 'https://that-layover-life.webflow.io'+path+(('?'+p.query) if p.query else '')
st,h,sm=fetch(BASE+'/sitemap.xml')
sitemap=[norm(x) for x in re.findall(r'<loc>([^<]+)</loc>',sm)]
queue=[BASE+'/']+sitemap; seen={}; inlinks={}; pages={}
i=0
while i<len(queue) and len(seen)<600:
    u=queue[i]; i+=1
    if u in seen: continue
    status,hd,body=fetch(u); seen[u]=status
    loc=hd.get('Location') or hd.get('location')
    info={'status':status,'loc':loc}
    if status==200 and 'text/html' in (hd.get('Content-Type') or hd.get('content-type') or ''):
        b=re.sub(r'<script(?![^>]*ld\+json)[\s\S]*?</script>','',body)
        def meta(n,attr='name'):
            m=re.search(r'<meta[^>]+%s="%s"[^>]*>'%(attr,re.escape(n)),body,re.I)
            if not m: return None
            c=re.search(r'content="([^"]*)"',m.group(0)); return html.unescape(c.group(1)) if c else ''
        t=re.search(r'<title>([\s\S]*?)</title>',body)
        info.update(title=html.unescape(t.group(1).strip()) if t else None,
            desc=meta('description'), robots=meta('robots'),
            og={k:meta('og:'+k,'property') for k in ('title','description','image','url','type')},
            tw=meta('twitter:card'),
            canon=(re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"',body) or re.search(r'<link[^>]+href="([^"]+)"[^>]+rel="canonical"',body)),
            h1=len(re.findall(r'<h1[\s>]',b)),
            refresh=bool(re.search(r'http-equiv="refresh"',body,re.I)))
        info['canon']=info['canon'].group(1) if info['canon'] else None
        lds=re.findall(r'<script[^>]*application/ld\+json[^>]*>([\s\S]*?)</script>',body)
        bad=[]
        for x in lds:
            try: json.loads(x)
            except Exception as e: bad.append(str(e)[:80])
        info['ld']=len(lds); info['ldbad']=bad
        links=set()
        for m in re.finditer(r'<a\b[^>]*\shref="([^"#][^"]*)"',b):
            n=norm(urljoin(u,html.unescape(m.group(1))))
            if n: links.add(n)
        info['links']=sorted(links)
        for n in links:
            inlinks.setdefault(n,set()).add(u)
            if n not in seen and n not in queue: queue.append(n)
    pages[u]=info
    time.sleep(0.15)
json.dump({'sitemap':sitemap,'pages':pages,'inlinks':{k:sorted(v) for k,v in inlinks.items()}},open(sys.argv[1],'w'))
print('crawled',len(pages),'sitemap',len(sitemap))
