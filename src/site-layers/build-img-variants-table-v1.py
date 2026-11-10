"""Refreshes the variant table inside src/site-layers/tll-img-variants-v1.js. Run from anywhere (needs the network, uses curl):
    python3 src/site-layers/build-img-variants-table-v1.py            probe and rewrite the table
    python3 src/site-layers/build-img-variants-table-v1.py --check    probe and report only
Why (10 Nov 2026, week one item 4): Webflow's CDN ignores ?width, and CMS files (bucket 6a0b29c6...) have no variants at all. Almost every
CMS file has a twin in the site bucket (69d6145c...) named {siteId}_{name}, and Webflow built -p-500, -p-800, -p-1080, -p-1600 and -p-2000
.jpg variants for that twin, but only the widths below the photo's own width (and none for a few files). The layer cannot ask the CDN which
exist without paying a failed request, so this script asks once, here, and writes the answer into the layer as a table: the last six hex
digits of the twin's id, grouped by how many variants it has (0 to 4). A file not in the table is taken to have all five; if one of them is
missing the layer drops the srcset and the original loads once.
Sources: every page in the live sitemap, plus the site-bucket and CMS URLs written into the layers and the cover and story builds.
The table is rewritten between the TABLE markers; the rest of the layer is untouched. Then run build-site-layers-v16.py as usual."""
import os, re, sys, subprocess, concurrent.futures as cf
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(ROOT)
LAYER = 'src/site-layers/tll-img-variants-v1.js'
HOST = 'https://cdn.prod.website-files.com/'
CMS, SITE = '6a0b29c6d081332e921900d8', '69d6145cf421c777840c1e25'
W = [500, 800, 1080, 1600, 2000]
RC = re.compile(re.escape(HOST + CMS) + r'/[0-9a-f]{24}_(?:[0-9a-f]{24}_)*([0-9a-f]{24})_([^/?#"\'\s)<>\\]+?)\.(?:jpe?g|png)\b', re.I)
RS = re.compile(re.escape(HOST + SITE) + r'/([0-9a-f]{24})_([^/?#"\'\s)<>\\]+?)\.(?:jpe?g|png)\b', re.I)
RN = re.compile(re.escape(HOST + CMS) + r'/[0-9a-f]{24}_[^/?#"\'\s)<>\\]+?\.(?:jpe?g|png)\b', re.I)

def curl(args):
    return subprocess.run(['curl', '-sS', '--max-time', '60'] + args, capture_output=True, text=True).stdout

def sources():
    urls = re.findall(r'<loc>([^<]+)</loc>', curl(['https://www.thatlayover.life/sitemap.xml']))
    with cf.ThreadPoolExecutor(12) as ex:
        texts = list(ex.map(lambda u: curl([u]), urls))
    for f in sorted(os.listdir('src/site-layers')):
        if f.startswith('tll-') and f.endswith('.js') and f != os.path.basename(LAYER):
            texts.append(open(os.path.join('src/site-layers', f), encoding='utf-8').read())
    for f in ('src/design/magazine-2026-10/cover-build/tll-mag-cover-v1.html', 'src/design/magazine-2026-10/story-build/tll-mag-story-v1.html'):
        texts.append(open(f, encoding='utf-8').read())
    # layers write CMS URLs as C+'{id}_{name}.jpeg' with C the bucket prefix
    texts = [re.sub(r"\bC\+'", "'" + HOST + CMS + '/', t) for t in texts]
    return len(urls), '\n'.join(texts)

def main():
    pages, text = sources()
    twins, notwin, fromcms = {}, set(), set()
    for m in RC.finditer(text):
        twins[m.group(1)] = m.group(1) + '_' + m.group(2).replace('%25', '%'); fromcms.add(m.group(1))
    for m in RS.finditer(text):
        if not re.search(r'-p-\d+$', m.group(2)): twins.setdefault(m.group(1), m.group(1) + '_' + m.group(2))
    for m in RN.finditer(text):
        if not RC.match(m.group(0)): notwin.add(m.group(0))
    jobs = [(k, w) for k in twins for w in W]
    def head(job):
        k, w = job
        return job, curl(['-o', '/dev/null', '-I', '-w', '%{http_code}', HOST + SITE + '/' + twins[k] + '-p-%d.jpg' % w]).strip()
    with cf.ThreadPoolExecutor(48) as ex:
        got = dict(ex.map(head, jobs))
    count, odd = {}, []
    for k in twins:
        ok = [got[(k, w)] == '200' for w in W]
        n = ok.index(False) if False in ok else len(W)
        if any(ok[n:]): odd.append(twins[k])
        count[k] = n
    keys = [k[-6:] for k in twins]
    assert len(set(keys)) == len(keys), 'two twins share their last six hex digits: widen the key'
    # a site-bucket file not in the table is left alone anyway, so site-only files without variants (favicons, share images) are not listed
    groups = {n: ''.join(sorted(k[-6:] for k in twins if count[k] == n and (n or k in fromcms))) for n in range(len(W))}
    line = '/*TABLE*/var T={%s};/*/TABLE*/' % ','.join("%d:'%s'" % (n, groups[n]) for n in range(len(W)))
    print('pages %d, twins %d, by variant count %s' % (pages, len(twins), {n: sum(1 for k in count if count[k] == n) for n in range(len(W) + 1)}))
    print('CMS twins with no variant (left on their originals):', sorted(twins[k] for k in twins if count[k] == 0 and k in fromcms))
    print('CMS files with no twin name (left on their originals):', sorted(u.rsplit('/', 1)[1] for u in notwin))
    if odd: print('gaps (a larger variant without a smaller one; the table stops at the gap):', odd)
    if '--check' in sys.argv: return
    src = open(LAYER, encoding='utf-8').read()
    new, k = re.subn(r'/\*TABLE\*/.*?/\*/TABLE\*/', lambda m: line, src, count=1, flags=re.S)
    assert k == 1, 'TABLE markers not found in ' + LAYER
    open(LAYER, 'w', encoding='utf-8').write(new)
    print('wrote', LAYER, len(line), 'bytes of table')

main()
