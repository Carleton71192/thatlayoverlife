import re, sys, json, subprocess, concurrent.futures as cf, html
S = sys.argv[1]
BASE = 'https://www.thatlayover.life'
def get(url, body=False):
    args = ['curl', '-sS', '-m', '30', '-o', '-' if body else '/dev/null', '-w', '\n%{http_code} %{url_effective}', '-L', '--max-redirs', '5', url]
    try: out = subprocess.run(args, capture_output=True, timeout=40).stdout.decode('utf-8', 'replace')
    except Exception as e: return 0, '', ''
    text, _, tail = out.rpartition('\n'); code, _, eff = tail.partition(' ')
    return int(code or 0), eff, text
sm = open(f'{S}/raw/sitemap.xml').read()
urls = sorted(set(re.findall(r'<loc>([^<]+)', sm)))
pages = {}
with cf.ThreadPoolExecutor(8) as ex:
    for u, (c, eff, body) in zip(urls, ex.map(lambda u: get(u, True), urls)):
        pages[u] = (c, eff, body)
links = {}
for u, (c, eff, body) in pages.items():
    for h in re.findall(r'href="([^"#]+)', body):
        h = html.unescape(h).strip()
        if h.startswith('/') and not h.startswith('//'): h = BASE + h
        if not h.startswith(BASE) and not h.startswith('https://thatlayover.life'): continue
        h = h.split('#')[0]
        if re.search(r'\.(css|js|png|jpe?g|webp|svg|ico|xml|json|woff2?)(\?|$)', h): continue
        links.setdefault(h, set()).add(u)
todo = sorted(set(links) - set(pages))
res = {}
with cf.ThreadPoolExecutor(8) as ex:
    for h, (c, eff, _) in zip(todo, ex.map(get, todo)): res[h] = (c, eff)
for u, (c, eff, _) in pages.items(): res[u] = (c, eff)
bad = {h: {'code': c, 'final': eff, 'from': sorted(links.get(h, []))[:5]} for h, (c, eff) in res.items() if c != 200}
redirected = {h: eff for h, (c, eff) in res.items() if c == 200 and eff.rstrip('/') != h.rstrip('/')}
sitemap_bad = {u: pages[u][0] for u in urls if pages[u][0] != 200}
json.dump({'sitemapUrls': len(urls), 'internalLinksChecked': len(res), 'bad': bad, 'redirected': redirected, 'sitemapNot200': sitemap_bad}, open(f'{S}/linkcheck.json', 'w'), indent=1)
print('sitemap', len(urls), 'checked', len(res), 'bad', len(bad), 'redirected', len(redirected), 'sitemap not 200', len(sitemap_bad))
