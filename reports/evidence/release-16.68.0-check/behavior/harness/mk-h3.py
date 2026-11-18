import sys,re
P=sys.argv[1]
s=open(P+'/bin/h2.orig.cjs').read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a)
    if n!=cnt: raise SystemExit('patch miss (%d): %r'%(n,a[:80]))
    s=s.replace(a,b)
# header
i=s.index('const fs = require')
s='''/* Release 16.68.0 behavior check (18 Nov 2026): the REAL test-site documents (that-layover-life.webflow.io: core 16.68.0 pin 0f04fabf,
   photo clean 1.2.0 pin f67f3f74, /submit footer C) against the REAL www documents (core 16.67.0 pin a254306f, photo clean pin 22019832).
   Built on the lab harness reports/evidence/submit-save-2026-11-17/check-final-run/h2.cjs. Differences from the lab:
   - the main document of every load is one real navigation to the real host (route.continue); nothing in the HTML is changed;
   - core, chunks and photo clean come from `git show <pin>:<path>` at the pin the page asks for (byte equal to jsDelivr, carry check),
     so the browser's SRI check runs for real on both hosts;
   - the Worker stub answers with the page origin in access-control-allow-origin.
   The stubs are the lab's: Cloudinary upload 4 s a photo, Webflow form post 1.5 s, travel-wire /intake 6 s (or 502, or a dropped
   connection), Memberstack and Turnstile local fakes. Every other non-GET is aborted; workers.dev, cloudinary.com and memberstack
   hosts are never reached. Images, video and fonts: local caches of earlier checks, a miss is aborted (never fetched).
   node h3.cjs <page> <www|test> <scenario> <w>x<h> [outfile] */
'''+s[i:]
rep("const D = path.join(SP, 'nov18/submit-final-check'), WT = path.join(D, 'wt'),","const D = path.join(SP, 'nov18/check1668-behavior'),")
# cache: replace IDX setup with a scan of every earlier cache folder
a=s.index('const N16 = '); b=s.index('const key = u =>')
s=s[:a]+'''const OWN = path.join(D, 'cache'); fs.mkdirSync(OWN, { recursive: true });
const IDX = new Map();
(function scan() {
  const dirs = [OWN];
  const walk = (d, depth) => { let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch (e) { return; }
    for (const e of ents) if (e.isDirectory()) { const p = path.join(d, e.name);
      if (/cache/i.test(e.name)) dirs.push(p); else if (depth < 4 && e.name !== 'node_modules' && e.name !== 'wt' && e.name !== 'build') walk(p, depth + 1); } };
  for (const day of ['nov18', 'nov17', 'nov16', 'nov15', 'nov14', 'nov13', 'nov12']) walk(path.join(SP, day), 0);
  for (const d of dirs) { let fl = []; try { fl = fs.readdirSync(d); } catch (e) { } for (const f of fl) if (f.endsWith('.json')) {
    try { const m = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')); const k = path.join(d, f.slice(0, -5)); if (m && m.u && fs.existsSync(k + '.b') && !IDX.has(m.u)) IDX.set(m.u, k); } catch (e) { } } }
})();
const DROP = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'keep-alive', 'alt-svc', 'set-cookie', 'report-to', 'nel']);
'''+s[b:]
rep("function load(u) { const k = IDX.get(u); if (!k || !fs.existsSync(k + '.json')) return null; const m = JSON.parse(fs.readFileSync(k + '.json')); return { status: m.status, headers: m.headers, body: fs.readFileSync(k + '.b') }; }",
"function load(u, O) { const k = IDX.get(u); if (!k || !fs.existsSync(k + '.json')) return null; const m = JSON.parse(fs.readFileSync(k + '.json')); const h = {}; for (const x in (m.headers || {})) if (!DROP.has(x.toLowerCase())) h[x.toLowerCase()] = String(m.headers[x]); if (h['access-control-allow-origin'] && h['access-control-allow-origin'] !== '*') h['access-control-allow-origin'] = O; return { status: m.status || 200, headers: h, body: fs.readFileSync(k + '.b') }; }")
rep("function store(u, status, headers, body) { const k = path.join(OWN, key(u)); fs.writeFileSync(k + '.b', body); fs.writeFileSync(k + '.json', JSON.stringify({ u, status, headers })); IDX.set(u, k); }",
"function store(u, status, headers, body) { const k = path.join(OWN, key(u)); const hd = {}; for (const x in headers) if (!DROP.has(x.toLowerCase())) hd[x] = headers[x]; fs.writeFileSync(k + '.b', body); fs.writeFileSync(k + '.json', JSON.stringify({ u, status, headers: hd })); IDX.set(u, k); }\nconst RE_WF = /^https?:\\/\\/([a-z0-9-]+\\.)*(website-files\\.com|webflow\\.io|webflow\\.com|thatlayover\\.life|d3e54v103j8qbb\\.cloudfront\\.net)(\\/|$)/i;\nconst BYTES = path.join(D, 'out', 'bytes.log');")
rep("const O = 'https://www.thatlayover.life';","const HOSTS = { www: 'https://www.thatlayover.life', test: 'https://that-layover-life.webflow.io' };\nlet O = null;")
# main: args and no HTML changes
a=s.index("  const V = new Set(variant.split('+'));"); b=s.index("  const S = {")
s=s[:a]+"  O = HOSTS[variant]; if (!O) throw new Error('host?');\n  const docs = [];\n"+s[b:]
rep("const R = { page, variant, scen, vp,","const R = { page, variant, host: variant, scen, vp, docs, jsd: [], netHosts: [], wfFetched: [], navAborted: [],")
# routing: real navigation, git at pin for our jsDelivr files
a=s.index("      if (pu && pu.origin === O) {"); b=s.index("      const c = load(u);")
s=s[:a]+'''      if (pu && /^(www\\.thatlayover\\.life|thatlayover\\.life|that-layover-life\\.webflow\\.io)$/.test(pu.host)) {
        if (q.isNavigationRequest() && pu.origin === O && pu.pathname === '/' + page && q.frame().parentFrame() === null) { docs.push({ t: Date.now(), path: pu.pathname }); return rt.continue(); } /* the one real navigation of this load */
        if (q.isNavigationRequest()) R.navAborted.push(pu.host + pu.pathname);
        R.aborted.push('GET ' + ty + ' ' + pu.host + pu.pathname.slice(0, 60)); return rt.abort(); }
      const gm = /^https:\\/\\/cdn\\.jsdelivr\\.net\\/gh\\/[^/]+\\/thatlayoverlife@([0-9a-f]{40})\\/([^?#]+)$/i.exec(u);
      if (gm) {
        const hd = { 'content-type': /\\.css$/.test(gm[2]) ? 'text/css; charset=utf-8' : JS, 'access-control-allow-origin': '*' };
        const b = git(gm[1], gm[2]); R.jsd.push(gm[1].slice(0, 8) + ':' + gm[2].replace(/^.*\\//, '') + (b ? '' : ' MISS')); if (b) return rt.fulfill({ status: 200, headers: hd, body: b });
      }
'''+s[b:]
rep("      const c = load(u); if (c) return rt.fulfill({ status: c.status, headers: c.headers, body: c.body });","      const c = load(u, O); if (c) return rt.fulfill({ status: c.status, headers: c.headers, body: c.body });")
rep("try { const r = await rt.fetch(); const b = await r.body(); store(u, r.status(), r.headers(), b); R.misses.push(u.slice(0, 100));",
    "try { const r = await rt.fetch(); const b = await r.body(); store(u, r.status(), r.headers(), b); R.misses.push(u.slice(0, 100)); R.netHosts.push(pu.host); if (RE_WF.test(u)) { R.wfFetched.push([u.slice(0, 120), b.length]); fs.appendFileSync(BYTES, ['asset', variant, b.length, u.slice(0, 160)].join(' ') + '\\n'); }")
# record document sizes and the pins that answered
rep("    pg.on('pageerror', e => R.pageErr.push(tag + ' ' + String(e).slice(0, 200)));",
"""    pg.on('pageerror', e => R.pageErr.push(tag + ' ' + String(e).slice(0, 200)));
    pg.on('requestfinished', async r => { try { if (r.isNavigationRequest() && r.frame() === pg.mainFrame()) { const z = await r.sizes(); const n = z.responseBodySize + z.responseHeadersSize; R.docBytes = (R.docBytes || 0) + n; fs.appendFileSync(BYTES, ['doc', variant, n, r.url()].join(' ') + '\\n'); } } catch (e) { } });
    pg.on('response', r => { const m = /thatlayoverlife@([0-9a-f]{40})\\/(src\\/[^?#]+)/.exec(r.url()); if (m) (R.jsResp = R.jsResp || []).push(tag + ' ' + m[1].slice(0, 8) + ':' + m[2].replace(/^.*\\//, '') + ':' + r.status()); });
    pg.on('requestfailed', r => { if (r.resourceType() === 'script') (R.scriptBad = R.scriptBad || []).push(tag + ' ' + r.url().slice(0, 120) + ' ' + ((r.failure() || {}).errorText || '')); });""")
rep("    await pg.goto(O + '/' + page, { waitUntil: 'load', timeout: 60000 });",
    "    const resp = await pg.goto(O + '/' + page, { waitUntil: 'load', timeout: 60000 }); (R.docStatus = R.docStatus || []).push(tag + ' ' + (resp ? resp.status() : null) + ' ' + new URL(pg.url()).host);")
# loaded: pins and SRI from the tags, and whether the scripts ran
rep("R.loaded = await pg.evaluate((FORM) => ({ core: [...document.querySelectorAll('script[src*=\"tll-site-layers-v16\"]')].map(s => s.src.replace(/^.*@/, '').slice(0, 8)),",
    "R.loaded = await pg.evaluate((FORM) => ({ core: [...document.querySelectorAll('script[src*=\"tll-site-layers-v16\"]')].map(s => s.src.replace(/^.*@/, '').slice(0, 8) + ' ' + (s.integrity || 'nosri').slice(0, 15)), pcTag: [...document.querySelectorAll('script[src*=\"tll-photo-clean\"]')].map(s => s.src.replace(/^.*@/, '').slice(0, 8) + ' ' + (s.integrity || 'nosri').slice(0, 15)), selfDoc: typeof window.tllSelfDoc,")
s=s.replace("path.join(D, 'out', `shot-${page}-${variant}-${scen}-${vp}","path.join(D, 'out', 'shots', `shot-${page}-${variant}-${scen}-${vp}")
open(P+'/bin/h3.cjs','w').write(s)
print('ok', s.count('rt.continue()'))
