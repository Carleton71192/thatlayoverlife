import json,re,sys,html,urllib.request,time
S=sys.argv[1]; H=sys.argv[2] if len(sys.argv)>2 else 'https://that-layover-life.webflow.io'
def get(p):
    r=urllib.request.Request(H+p+('&' if '?' in p else '?')+'v='+str(time.time()),headers={'User-Agent':'Mozilla/5.0 TLL-check'})
    return urllib.request.urlopen(r,timeout=30).read().decode('utf-8','replace')
home=get('/')
m=re.findall(r'tll-site-layers[^"\']*',home); print('layers:',sorted(set(m))[:3])
lines=json.load(open(S+'/lines.json'));bad=0
for l in lines:
    if l['key']=='D1' or l['key']=='T7':
        continue
    h=get(l['page'])
    if l['key'][0]=='T':
        v=html.unescape(re.search(r'<title>(.*?)</title>',h,re.S).group(1))
    else:
        v=html.unescape(re.search(r'<meta content="([^"]*)" name="description"',h).group(1))
    if v!=l['draft']: bad+=1; print('BAD',l['key'],repr(v))
print('story lines bad:',bad)
h=get('/paw-passport/magnus-boryana-sofia-bulgaria'); print('T7 title:',html.unescape(re.search(r'<title>(.*?)</title>',h).group(1)))
h=get('/contributors/nancy-carleton'); print('D1 desc:',html.unescape(re.search(r'<meta content="([^"]*)" name="description"',h).group(1)))
h=get('/stories/marathon-on-all-7-continents'); print('A3 apex links left:',h.count('https://thatlayover.life/stories'),'relative:',h.count('href="/stories/antarctica-marathon"'))
h=get('/stories/antarctica-marathon'); print('From-line hrefs:',re.findall(r'<a[^>]*data-st3-from-part="country"[^>]*>',h)[:1])
