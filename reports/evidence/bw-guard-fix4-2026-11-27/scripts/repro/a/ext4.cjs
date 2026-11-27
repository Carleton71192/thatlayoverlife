'use strict';
/* check-repro (fix4) E1 to E16: extensionless fetch() and XHR to a Webflow host, old (686e520) and new (49889e7) side by side.
   For each case: every request the stub saw with the headers the guard forwards, the curl arguments the guard used (from the
   safety wrapper's log, temp paths shortened), the bytes delivered at a relay in its own process, the bytes counted, and
   what the page got. Run: node -r ./dnsmap.cjs ext4.cjs <tools parent>. Everything is on 127.0.0.1. */
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
const { relay } = require('./relayfile.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfe-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const note = (k, v) => console.log(k, JSON.stringify(v));
const CLOG = process.env.CURL_WRAP_LOG;
const clogSize = () => { try { return fs.statSync(CLOG).size; } catch (e) { return 0; } };
const clogSince = n => { try { const b = fs.readFileSync(CLOG); return b.subarray(n).toString().trim().split('\n').filter(Boolean); } catch (e) { return []; } };
const normArgs = l => l.replace(/^OK \S+ /, '').replace(/\/[^ ]*wfg-curl-[^ /]+\/[hb]/g, '<tmp>').replace(/:\d{4,5}\//g, ':<port>/').replace(/--connect-to ::127\.0\.0\.1: /, '');
function stub() {
  const hits = [];
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x'); const p = u.pathname;
    const fwd = {}; for (const k of ['range', 'accept', 'user-agent', 'accept-language', 'accept-encoding']) if (req.headers[k]) fwd[k] = req.headers[k];
    const rec = { path: p, headers: fwd, wrote: 0 }; hits.push(rec);
    const sock = req.socket, w0 = sock.bytesWritten; res.on('close', () => { rec.wrote = sock.bytesWritten - w0; });
    const kb = +(u.searchParams.get('kb') || 3000), ct = u.searchParams.get('ct') || 'application/json', hk = +(u.searchParams.get('hk') || 0);
    const f = Buffer.alloc(kb * 1000); for (let i = 0; i < f.length; i++) f[i] = 97 + (i * 7) % 26;
    if (p.startsWith('/sniff/')) Buffer.from('000000186674797069736f6d', 'hex').copy(f, 0);
    const extra = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' }; for (let i = 0; i < hk; i++) extra['x-pad-' + i] = 'p'.repeat(1000);
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (p.startsWith('/chunked/')) { res.writeHead(200, Object.assign({ 'content-type': ct }, extra)); let i = 0; const step = () => { if (i >= f.length) return res.end(); const ok = res.write(f.subarray(i, i + 65536)); i += 65536; ok ? setImmediate(step) : res.once('drain', step); }; return step(); }
    if (p.startsWith('/r416/') && m) { res.writeHead(416, Object.assign({ 'content-range': `bytes */${f.length}` }, extra)); return res.end(); }
    if ((p.startsWith('/big/') || p.startsWith('/star/') || p.startsWith('/sniff/')) && m) {
      const a = m[1] === '' ? f.length - +m[2] : +m[1], b = m[1] === '' ? f.length - 1 : (m[2] ? Math.min(+m[2], f.length - 1) : f.length - 1);
      res.writeHead(206, Object.assign({ 'content-type': ct, 'content-length': b - a + 1, 'content-range': `bytes ${a}-${b}/${p.startsWith('/star/') ? '*' : f.length}`, 'accept-ranges': 'bytes' }, extra)); return res.end(f.subarray(a, b + 1));
    }
    res.writeHead(200, Object.assign({ 'content-type': ct, 'content-length': f.length }, extra)); res.end(f);
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r({ server, port: server.address().port, hits })));
}
(async () => {
  const S = await stub(), L = await stub(); const R = await relay(S.port);
  const CDN = `http://cdn.prod.website-files.com:${R.port}`, WWW = `http://www.thatlayover.life:${R.port}`, LOC = `http://localhost:${L.port}`;
  const pages = {};
  const lserver = http.createServer((q, s) => { const b = pages[q.url] || ''; s.writeHead(200, { 'content-type': 'text/html' }); s.end(b); });
  await new Promise(r => lserver.listen(0, '127.0.0.1', r)); const LP = `http://localhost:${lserver.address().port}`;
  const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost', '--no-proxy-server'] });
  const cases = [
    ['E1 JSON 0.3 MB, Range honored', `${CDN}/big/e1?kb=300`, null],
    ['E2 JSON 3 MB, Range honored', `${CDN}/big/e2?kb=3000`, null],
    ['E3 JSON 8 MB (over getCapMB), Range honored (X-1)', `${CDN}/big/e3?kb=8000`, null],
    ['E4 JSON 3 MB, server sends total "*" to a Range (X-2)', `${CDN}/star/e4?kb=3000`, null],
    ['E5 JSON 3 MB, Range ignored', `${CDN}/kb/e5?kb=3000`, null],
    ['E6 JSON 3 MB, 416 to every Range', `${CDN}/r416/e6?kb=3000`, null],
    ['E7 JSON 3 MB, page sends Range bytes=0-99', `${CDN}/big/e7?kb=3000`, 'bytes=0-99'],
    ['E8 video/mp4 3 MB, page sends Range bytes=0- (X7)', `${CDN}/big/e8?kb=3000&ct=video/mp4`, 'bytes=0-'],
    ['E9 video/mp4 3 MB, no Range', `${CDN}/big/e9?kb=3000&ct=video/mp4`, null],
    ['E10 octet-stream MP4 3 MB, no Range (A-6)', `${CDN}/sniff/e10?kb=3000`, null],
    ['E11 page 2 MB text/html on www, Range ignored', `${WWW}/kb/e11?kb=2000&ct=text/html`, null],
    ['E12 JSON 0.5 MB with 20 KB of headers', `${CDN}/kb/e12?kb=500&hk=20`, null],
    ['E13 JSON 0.5 MB with 100 KB of headers', `${CDN}/kb/e13?kb=500&hk=100`, null],
    ['E14 chunked 8 MB, no Content-Length', `${CDN}/chunked/e14?kb=8000`, null],
    ['E15 XHR JSON 1 MB', `${CDN}/big/e15?kb=1000`, null, 'xhr'],
    ['E16 XHR JSON 8 MB (over getCapMB)', `${CDN}/big/e16?kb=8000`, null, 'xhr'],
  ];
  const modes = [['block', {}], ['fetch-once', {}], ['fetch-once allowVideo', { allowVideo: true }]];
  for (const [mname, extra] of modes) for (const [tag, url0, range, kind] of cases) {
    const url = url0 + (url0.includes('?') ? '&' : '?') + 'm=' + mname.replace(/ /g, '-');
    const js = kind === 'xhr'
      ? `window.__r = new Promise(ok => { const x = new XMLHttpRequest(); x.open('GET', '${url}'); x.responseType = 'arraybuffer'; x.onload = () => ok(x.status + ' ' + (x.response ? x.response.byteLength : 0)); x.onerror = () => ok('err'); x.send(); })`
      : `window.__r = fetch('${url}'${range ? `, { headers: { Range: '${range}' } }` : ''}).then(async r => r.status + ' ' + (await r.arrayBuffer()).byteLength, e => 'err ' + e.message)`;
    pages['/p.html'] = `<p>x</p><script>${js}</script>`;
    const trips = []; const ctx = await browser.newContext();
    const g = W.guard(ctx, Object.assign({ label: 'ext4', mode: mname.split(' ')[0], logFile: path.join(tmp(), 'log.md'), stateDir: tmp(), cacheDir: tmp(), onTrip: e => trips.push(e.message) }, extra)); await g.ready;
    const h0 = S.hits.length, m0 = R.mark(), c0 = clogSize(); const pg = await ctx.newPage();
    await pg.goto(LP + '/p.html').catch(() => { }); const res = await Promise.race([pg.evaluate(() => window.__r).catch(e => 'eval ' + e.message), sleep(20000).then(() => 'timeout')]); await sleep(600);
    const st = g.stats(); await ctx.close().catch(() => { }); await sleep(300);
    const hs = S.hits.slice(h0);
    note(`${tag} | ${mname}`, { page: res, requests: hs.map(h => `${h.path} ${JSON.stringify(h.headers)}`), stubWrote: hs.reduce((s, h) => s + h.wrote, 0), deliveredAtRelay: R.since(m0), counted: st.bytes, blocked: st.blocked, tooBig: st.tooBig, curl: clogSince(c0).map(normArgs), trip: trips[0] ? trips[0].slice(0, 160) : null });
  }
  await browser.close(); R.close(); S.server.close(); L.server.close(); lserver.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
