'use strict';
/* Tests for tools/wf-guard.cjs and tools/wf-get.cjs. A stub server on this machine stands in for Webflow: pages come
   from http://localhost:<port> (not a Webflow host) and assets from http://127.0.0.1:<port>, which most tests pass as the
   Webflow host list. Tests with the real host names use Chromium's host resolver map (every name goes to 127.0.0.1) and
   never fetch. Every curl call gets --noproxy '*' --connect-to ::127.0.0.1: (WF_GUARD_CURL_ARGS), so no request leaves the
   machine even by mistake. The shared log, the main checkout log and the tally of the real repository are never touched.
   Run: NODE_PATH=/opt/node22/lib/node_modules node --test tools/test/ */
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http'), zlib = require('zlib'), crypto = require('crypto'), { execFile, execFileSync } = require('child_process');

const SAFE = fs.mkdtempSync(path.join(os.tmpdir(), 'wfg-safe-'));
process.env.WF_GUARD_STATE = path.join(SAFE, 'state');
process.env.WF_GUARD_MAIN_LOG = 'none';
process.env.WF_GUARD_LOG = path.join(SAFE, 'default-log.md');
process.env.WF_GUARD_CURL_ARGS = JSON.stringify(['--noproxy', '*', '--connect-to', '::127.0.0.1:']);
delete process.env.WF_GUARD_CACHE;

const test = require('node:test'), assert = require('node:assert/strict');
const W = require('../wf-guard.cjs'), G = require('../wf-get.cjs');

let chromium = null;
for (const m of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { chromium = require(m).chromium; break; } catch (e) { } }

const runCli = (args, o) => new Promise(res => execFile(process.execPath, args, Object.assign({ encoding: 'utf8' }, o), (e, stdout, stderr) => res({ status: e ? e.code : 0, stdout, stderr })));
const tmp = () => fs.mkdtempSync(path.join(SAFE, 't-'));
const day = new Date('2026-11-25T10:00:00Z');
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const BIG = Buffer.alloc(300000, 97);
const HUGE = Buffer.alloc(3000000, 98);
const VIDEO = Buffer.alloc(3000000, 7);
const HTMLGZ = zlib.gzipSync(Buffer.from('<html><body>' + 'hello stub page '.repeat(4000) + '</body></html>'));
const fileHash = f => { try { return crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex'); } catch (e) { return 'missing'; } };
const REAL = [W.DEFAULT_LOG, W.MAIN_LOG].map(f => [f, fileHash(f)]);
const STATE_EXISTED = fs.existsSync(W.STATE_DIR);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const unhandled = [];
process.on('unhandledRejection', e => { unhandled.push(String(e && e.message || e)); });

/* ---------- stub server ---------- */
let server, port, hits = {}, ranges = [], sent = [];
const hit = k => { hits[k] = (hits[k] || 0) + 1; };
const A = () => `http://127.0.0.1:${port}`;
const L = () => `http://localhost:${port}`;
function page(p) {
  const a = A(), l = L();
  if (p === '/page.html') return `<!doctype html><html><head><link rel="stylesheet" href="${a}/style.css"><script src="${a}/app.js"></script>
    <style>@font-face{font-family:X;src:url(${a}/f.woff2) format("woff2")} body{font-family:X}</style></head>
    <body>text<img src="${a}/img/a.png"><img src="${a}/img/b.jpg"><video src="${a}/v.mp4" autoplay muted></video>
    <script>window.__post = fetch('${l}/form', {method:'POST', body:'x=1'}).then(r=>r.status, e=>'blocked');
    window.__xhr = fetch('${a}/data.json').then(r=>r.text(), e=>'err');</script></body></html>`;
  if (p === '/big.html') return `<!doctype html><script src="${a}/big.js"></script><p>big</p>`;
  if (p === '/endless.html') return `<!doctype html><script src="${a}/endless.js"></script><p>endless</p>`;
  if (p === '/slow.html') return `<!doctype html><script src="${a}/slow.js"></script><p>slow</p>`;
  if (p === '/dup.html') return `<!doctype html><img src="${a}/img/d.png"><img src="${a}/img/d.png"><div style="background:url(${a}/img/d.png)">x</div>`;
  if (p === '/plain.html') return `<!doctype html><img src="${a}/img/a.png"><p>plain</p>`;
  if (p === '/drop.html') return `<!doctype html><img src="${a}/img/drop.png"><p>drop</p>`;
  if (p === '/video.html') return `<!doctype html><video src="${a}/v.mp4" preload="metadata" muted></video><link rel="stylesheet" href="${a}/fonts.css"><p>video</p>`;
  if (p === '/s2.html') return `<!doctype html><img src="${l}/to-wf-img"><p>s2</p>`;
  if (p === '/unload.html') return `<!doctype html><p>unload</p><script>addEventListener('pagehide', () => {
    navigator.sendBeacon('${a}/u-beacon', 'x'); fetch('${a}/u-ka', {method:'POST', body:'y', keepalive:true}).catch(()=>{});
    navigator.sendBeacon('${l}/u-beacon-other', 'x'); fetch('${l}/u-ka-other', {method:'POST', body:'y', keepalive:true}).catch(()=>{}); });</script>`;
  if (p === '/many.html') return Array.from({ length: 45 }, (_, i) => `<img src="${a}/slow/m${i}.png?ms=800">`).join('') + '<p>many</p>';
  if (p === '/three.html') return Array.from({ length: 3 }, (_, i) => `<img src="${a}/slow/t${i}.png?ms=500">`).join('') + '<p>three</p>';
  if (p === '/bigcl.html') return `<!doctype html><script src="${a}/cl/3000.js"></script><p>bigcl</p>`;
  if (p === '/noext.html') return `<!doctype html><p>noext</p><script>
    window.__v = fetch('${a}/media/clip').then(r => r.arrayBuffer()).then(b => b.byteLength, e => 'blocked');
    window.__j = fetch('${a}/api/small').then(r => r.status + ' ' + r.headers.get('content-range') + ' ' + r.statusText.length).then(x => x, e => 'err');
    window.__jt = fetch('${a}/api/small').then(r => r.text(), e => 'err');
    window.__big = fetch('${a}/api/big').then(r => r.text()).then(t => t.length, e => 'err');</script>`;
  if (p === '/landing.html') return `<!doctype html><p>landing</p><img src="rel.png"><script>window.__loc = location.href;</script>`;
  if (p === '/beacon-live.html') return `<!doctype html><p>beacon</p><script>window.__b = navigator.sendBeacon('${a}/live-beacon', 'x');
    window.__f = fetch('${a}/live-post', {method: 'POST', body: 'x'}).then(() => 'sent', () => 'stopped');</script>`;
  if (p === '/realhosts.html') return `<!doctype html><img src="http://www.thatlayover.life.:${port}/img/dot.png"><img src="http://cdn.thatlayover.life:${port}/img/sub.png">
    <img src="http://uploads-ssl.webflow.com:${port}/img/old.png"><script>window.__s = fetch('http://cdn.prod.website-files.com.:${port}/a%2Epng').then(r=>r.status, e=>'blocked');</script>`;
  return null;
}
test.before(async () => {
  server = http.createServer((req, res) => {
    const p = req.url.split('?')[0]; hit(req.method + ' ' + p);
    const h = page(p);
    if (h) { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(h); }
    if (/\.png$/.test(p) && p !== '/img/drop.png' || /\.jpg$/.test(p)) { res.writeHead(200, { 'content-type': 'image/png', 'access-control-allow-origin': '*' }); return res.end(PNG); }
    if (p === '/img/drop.png') { req.socket.destroy(); return; }
    if (p === '/f.woff2') { res.writeHead(200, { 'content-type': 'font/woff2', 'access-control-allow-origin': '*' }); return res.end(Buffer.alloc(500)); }
    if (p === '/fonts.css') { res.writeHead(200, { 'content-type': 'text/css' }); return res.end(`@font-face{font-family:Y;src:url(${A()}/g.woff2)} p{font-family:Y}`); }
    if (p === '/v.mp4') {
      ranges.push(req.headers.range || 'none');
      const m = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || '');
      if (!m) { res.writeHead(200, { 'content-type': 'video/mp4', 'content-length': VIDEO.length }); return res.end(VIDEO); }
      const a = +m[1], b = m[2] ? Math.min(+m[2], VIDEO.length - 1) : VIDEO.length - 1;
      res.writeHead(206, { 'content-type': 'video/mp4', 'content-range': `bytes ${a}-${b}/${VIDEO.length}`, 'accept-ranges': 'bytes', 'content-length': b - a + 1 });
      return res.end(VIDEO.subarray(a, b + 1));
    }
    if (p === '/style.css') { res.writeHead(200, { 'content-type': 'text/css' }); return res.end('p{color:red}'.repeat(100)); }
    if (p === '/app.js') { res.writeHead(200, { 'content-type': 'application/javascript' }); return res.end('window.__app=1;' + '//pad\n'.repeat(200)); }
    if (p === '/big.js') { res.writeHead(200, { 'content-type': 'application/javascript' }); return res.end(BIG); }
    if (p === '/huge.html') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(HUGE); }
    if (p === '/endless.js') { res.writeHead(200, { 'content-type': 'application/javascript' }); res.flushHeaders(); const t = setInterval(() => { if (!res.write('/' + 'z'.repeat(100000) + '\n')) { } }, 5); res.on('close', () => clearInterval(t)); return; }
    if (p === '/slow.js') { res.writeHead(200, { 'content-type': 'application/javascript' }); res.write('//' + 's'.repeat(1000) + '\n'); const t = setTimeout(() => res.end(), 20000); res.on('close', () => clearTimeout(t)); return; }
    if (p === '/data.json') { res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' }); return res.end('{"ok":true}'); }
    if (p === '/gz.html') { res.writeHead(200, { 'content-type': 'text/html', 'content-encoding': 'gzip', 'content-length': HTMLGZ.length }); return res.end(HTMLGZ); }
    if (p === '/redir') { res.writeHead(302, { location: '/plain.html' }); return res.end(); }
    if (p === '/redir-to-img') { res.writeHead(302, { location: '/img/r.png' }); return res.end(); }
    if (p === '/to-wf-img') { res.writeHead(302, { location: `${A()}/img/s2.png`, 'access-control-allow-origin': '*' }); return res.end(); }
    if (p === '/noext-img') { res.writeHead(200, { 'content-type': 'image/png' }); return res.end(PNG); }
    if (p.startsWith('/slow/')) { const ms = +(/ms=(\d+)/.exec(req.url) || [0, 0])[1]; const t = setTimeout(() => { res.writeHead(200, { 'content-type': 'image/png' }); res.end(PNG); }, ms); res.on('close', () => clearTimeout(t)); return; }
    if (p.startsWith('/cl/')) { const n = +p.slice(4).replace(/\.js$/, '') * 1000; res.writeHead(200, { 'content-type': 'application/javascript', 'content-length': n }); sent.push({ p, n }); return res.end(Buffer.alloc(n, 32)); }
    if (p === '/media/clip' || p === '/api/small' || p === '/api/big') {
      const body = p === '/media/clip' ? VIDEO : p === '/api/small' ? Buffer.from('{"small":true}') : Buffer.alloc(800000, 120);
      const type = p === '/media/clip' ? 'video/mp4' : 'application/json';
      ranges.push(`${p} ${req.headers.range || 'none'}`);
      const m = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || '');
      if (!m) { sent.push({ p, n: body.length }); res.writeHead(200, { 'content-type': type, 'content-length': body.length }); return res.end(body); }
      const a = +m[1], b = m[2] ? Math.min(+m[2], body.length - 1) : body.length - 1;
      sent.push({ p, n: b - a + 1 });
      res.writeHead(206, { 'content-type': type, 'content-range': `bytes ${a}-${b}/${body.length}`, 'accept-ranges': 'bytes', 'content-length': b - a + 1 });
      return res.end(body.subarray(a, b + 1));
    }
    if (p === '/hop') { res.writeHead(301, { location: `${L()}/landing.html` }); return res.end(); }
    if (p === '/loop') { res.writeHead(302, { location: '/loop' }); return res.end(); }
    if (req.method !== 'GET') { res.writeHead(204); return res.end(); }
    res.writeHead(404); res.end('no');
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r)); port = server.address().port;
});
test.after(() => {
  server.close();
  for (const [f, h] of REAL) assert.equal(fileHash(f), h, `the tests changed ${f}`);
  assert.equal(fs.existsSync(W.STATE_DIR), STATE_EXISTED, 'the tests touched the real tally folder');
  assert.deepEqual(unhandled, [], 'no unhandled rejections');
  fs.rmSync(SAFE, { recursive: true, force: true });
});
const opt = (o) => Object.assign({ label: 'test-run', hosts: ['127.0.0.1'], now: day, onTrip: 'close', stateDir: path.join(tmp(), 'state'), logFile: path.join(tmp(), 'log.md') }, o);

/* ---------- the log parser ---------- */
const SAMPLE = `# Webflow bandwidth log
One line per run. Budget: 250 MB a day, 5 GB a month, 200 MB a run.
## Period from about 20 Nov 2026
- 21 Nov, sweep debug pass: 191 photos fetched once into a cache, 25.4 MB (M, rule 1 break); 302 status GETs, 5 to 57 MB (E)
- 21 to 22 Nov, sweep checks: 0 MB from Webflow (M, cached assets)
- 21 to 22 Nov, plain GETs: about 60 HTML pages, about 10 MB (E)
- 22 Nov 22:10, scheduled audit (PageSpeed): 5 to 20 MB (E, not logged by the task)
- 20 to 25 Nov, scheduled daily report: 0 to 5 MB a day (E, not logged by the task)
- 25 Nov, 16.69.0 live check: 24 HTML GETs, about 4 MB (E); bandwidth audit: about 0 MB (M, saved HTML only)
- 25 Nov 14:05 UTC, t1: wf-guard block run, 12 page loads, 30 Webflow responses, 1.25 MB from Webflow (M); aborted 40 Webflow images, video or fonts and 2 non-GET requests
- 2026-11-25, iso line: 2 MB (M)
- 30 Oct to 2 Nov, cross month: 1.5 GB (E)
  - 25 Nov, sub line: 300 KB (M)
`;
const d = s => new Date(s + 'T12:00:00Z');
test('log parser: single days, ranges, the guard line format, ISO dates, GB and KB', () => {
  assert.equal(+W.dailyTotalMB(SAMPLE, d('2026-11-21')).toFixed(3), 25.4 + 57 + 0 + 10 + 5);
  assert.equal(+W.dailyTotalMB(SAMPLE, d('2026-11-22')).toFixed(3), 0 + 10 + 20 + 5);
  assert.equal(+W.dailyTotalMB(SAMPLE, d('2026-11-25')).toFixed(3), 5 + 4 + 1.25 + 2 + 0.3);
  assert.equal(W.dailyTotalMB(SAMPLE, d('2026-11-01')), 1500);
  assert.equal(W.dailyTotalMB(SAMPLE, d('2026-11-19')), 0);
  assert.equal(W.lineMBForDay('Budget: 250 MB a day', d('2026-11-25')), 0, 'header text is not a log line');
});
test('log parser: the formats the check listed are read, not counted as 0 (check item 13)', () => {
  const day25 = d('2026-11-25');
  const cases = [
    ['- 25 November, full month: 3 MB (M)', 3], ['- Nov 25, month first: 4 MB (M)', 4], ['- November 25, 2026, month first with year: 1 MB', 1],
    ['- **25 Nov**, bold date: 5 MB (M)', 5], ['* 25 Nov, star bullet: 6 MB', 6], ['- 25 Nov, words: 7 megabytes', 7],
    ['- 25-11-2026, day first numbers: 8 MB', 8], ['- 25/11/2026, slashes: 2 MB', 2], ['- 24\u201326 Nov, en dash range: 1.5 MB', 1.5],
    ['- 25 Nov 10:00 UTC, x: wf-guard block run abc123, 1.00 MB from Webflow (M); later 300 MB by hand', 301],
    ['- 25 Nov, classb-check: 3 HTML GETs, 0.6 MB (M); 126 browser page loads, 0 MB from Webflow (M)', 0.6],
    ['- 25 Nov, gibi: 0.5 GiB', 500], ['- 25 Nov, no size figure in this line, 12 page loads', 0],
  ];
  for (const [l, mb] of cases) assert.equal(+W.lineMBForDay(l, day25).toFixed(3), mb, l);
  const ny = '- 28 Dec to 2 Jan, across the new year: 9 MB (E)';
  assert.equal(W.lineMBForDay(ny, d('2026-12-30')), 9); assert.equal(W.lineMBForDay(ny, d('2027-01-02')), 9); assert.equal(W.lineMBForDay(ny, d('2027-01-03')), 0);
  assert.equal(W.lineMBForDay('- 25 Nov 2025, last year: 9 MB', day25), 0);
});
test('log parser: a dated-looking line it cannot read fails loudly instead of counting 0', () => {
  for (const l of ['- 25th of Nov: 3 MB', '- yesterday, a run: 40 MB (M)', '- 2026/11/25 run: 1 MB']) {
    assert.throws(() => W.lineMBForDay(l, d('2026-11-25')), W.WfLogFormatError, l);
  }
  const text = SAMPLE + '- sometime, a hand line: 99 MB\n';
  assert.throws(() => W.dailyTotalMB(text, d('2026-11-25')), e => e instanceof W.WfLogFormatError && /99 MB/.test(e.message));
  const f = path.join(tmp(), 'log.md'); fs.writeFileSync(f, text);
  assert.throws(() => W.createRun({ label: 'x', logFile: f, stateDir: path.join(tmp(), 's'), now: day }), W.WfLogFormatError, 'a run does not start on a log it cannot read');
});
test('log parser reads the real handoff/BANDWIDTH-LOG.md of this checkout and of the main checkout', () => {
  const f = path.join(__dirname, '..', '..', 'handoff', 'BANDWIDTH-LOG.md');
  const mb = W.readDailyTotalMB(f, d('2026-11-21'));
  assert.ok(mb >= 25.4 && mb < 250, String(mb));
  for (const x of ['2026-11-20', '2026-11-25', '2026-11-27']) W.readDailyTotalMB([f, W.MAIN_LOG], d(x));
  assert.equal(W.readDailyTotalMB([f, f], d('2026-11-21')), mb, 'a line in two logs counts once');
});
test('appendLogLine adds a newline when the file lacks one and keeps one line', () => {
  const f = path.join(tmp(), 'log.md'); fs.writeFileSync(f, '# log');
  W.appendLogLine(f, '- 25 Nov, a: 1 MB (M)\nsecond'); assert.equal(fs.readFileSync(f, 'utf8'), '# log\n- 25 Nov, a: 1 MB (M) second\n');
});
test('paths: the log, the main checkout and the tally folder come from the script location (S8, G4)', () => {
  const root = path.resolve(__dirname, '..', '..');
  assert.equal(W.REPO_ROOT, root); assert.equal(W.DEFAULT_LOG, path.join(root, 'handoff', 'BANDWIDTH-LOG.md'));
  const common = path.resolve(root, execFileSync('git', ['rev-parse', '--git-common-dir'], { cwd: root, encoding: 'utf8' }).trim());
  assert.equal(W.STATE_DIR, path.join(common, 'wf-guard'));
  assert.equal(W.MAIN_LOG, path.join(path.dirname(common), 'handoff', 'BANDWIDTH-LOG.md'));
  assert.equal(G.defaultOut('my check'), path.join(root, 'wf-get-out', 'my-check'));
});

/* ---------- hosts and classes ---------- */
test('host matcher: the Webflow hosts with trailing dots, site subdomains and webflow.com, and nothing else (S1, W6)', () => {
  for (const u of ['https://www.thatlayover.life/', 'https://thatlayover.life/x', 'https://WWW.THATLAYOVER.LIFE./', 'https://cdn.thatlayover.life/a.js', 'https://that-layover-life.webflow.io/',
    'https://cdn.prod.website-files.com/a.jpg', 'https://cdn.prod.website-files.com./a.jpg', 'https://assets-global.website-files.com/b.woff2', 'https://uploads-ssl.webflow.com/x.png', 'https://webflow.com/'])
    assert.ok(W.isWebflowUrl(u), u);
  for (const u of ['https://cdn.jsdelivr.net/gh/x', 'https://static.memberstack.com/x.js', 'https://notthatlayover.life/', 'https://website-files.com.evil.test/', 'https://webflow.com.evil.test/', 'https://mywebflow.com/', 'data:image/png;base64,AA'])
    assert.ok(!W.isWebflowUrl(u), u);
});
test('classes: decoded extensions, resource types and content types; video ranges are bounded', () => {
  assert.equal(W.classify('https://x/a%2Epng'), 'image'); assert.equal(W.classify('https://x/v.MP4'), 'video'); assert.equal(W.classify('https://x/f.woff2'), 'font');
  assert.equal(W.classify('https://x/noext', 'image'), 'image'); assert.equal(W.classify('https://x/noext', 'media'), 'video'); assert.equal(W.classify('https://x/app.js', 'script'), 'doc');
  assert.equal(W.classifyType('image/webp'), 'image'); assert.equal(W.classifyType('audio/mpeg'), 'video'); assert.equal(W.classifyType('font/woff2'), 'font'); assert.equal(W.classifyType('text/html'), 'doc');
  assert.equal(W.boundRange('bytes=0-', 1000), 'bytes=0-999'); assert.equal(W.boundRange('bytes=100-199', 1000), 'bytes=100-199'); assert.equal(W.boundRange('bytes=0-99999', 1000), 'bytes=0-999');
  assert.equal(W.boundRange(null, 1000), null); assert.equal(W.boundRange('bytes=-50', 1000), 'bytes=-50');
  const c = W.makeCache(path.join(tmp(), 'c')); c.put('u', 200, { 'content-type': 'video/mp4' }, Buffer.from('0123456789'));
  const r = W.cacheLookup(c, 'u', 'bytes=2-4'); assert.equal(r.status, 206); assert.equal(r.body.toString(), '234'); assert.equal(r.headers['content-range'], 'bytes 2-4/10');
  assert.equal(W.cacheLookup(c, 'u', 'bytes=20-').status, 416);
});

/* ---------- runs, caps and the tally ---------- */
test('createRun: daily cap already reached throws before any traffic', () => {
  const f = path.join(tmp(), 'log.md'); fs.writeFileSync(f, '- 25 Nov, earlier: 250 MB (M)\n');
  assert.throws(() => W.createRun({ label: 'x', logFile: f, stateDir: path.join(tmp(), 's'), now: day }), e => e instanceof W.WfBudgetError && e.cap === 'day');
  assert.throws(() => W.createRun({ logFile: f }), /label/);
});
test('createRun: run cap and daily cap trip, write one STOPPED line, and call onTrip', () => {
  const f = path.join(tmp(), 'log.md'); fs.writeFileSync(f, '- 25 Nov, earlier: 249.5 MB (M)\n');
  let got = null; const r = W.createRun({ label: 'cap-test', logFile: f, stateDir: path.join(tmp(), 's'), now: day, onTrip: e => { got = e; } });
  r.add(400e3); assert.equal(got, null); r.add(200e3);
  assert.ok(got instanceof W.WfBudgetError); assert.equal(got.cap, 'day'); assert.throws(() => r.check(), W.WfBudgetError);
  const lines = fs.readFileSync(f, 'utf8').trim().split('\n'); assert.equal(lines.length, 2);
  assert.match(lines[1], new RegExp(`^- 25 Nov 10:00 UTC, cap-test: wf-guard cache-only run ${r.id}, 0 page loads, 0 Webflow GETs, 0\\.60 MB from Webflow \\(M\\).*STOPPED at the daily cap$`));
  r.close(); assert.equal(fs.readFileSync(f, 'utf8').trim().split('\n').length, 2, 'close after a trip does not log twice');
  const g = path.join(tmp(), 'log.md'); let e2 = null; const st = path.join(tmp(), 's');
  const r2 = W.createRun({ label: 'run-cap', logFile: g, stateDir: st, now: day, runCapMB: 1, onTrip: e => { e2 = e; } });
  r2.add(999999); assert.equal(e2, null); r2.add(1); assert.equal(e2.cap, 'run');
  assert.match(fs.readFileSync(g, 'utf8'), /1\.00 MB from Webflow \(M\).*STOPPED at the run cap/);
  assert.equal(W.readDailyTotalMB(g, day), 1, 'the line it writes is read back by the parser');
  const t = W.readTally(st, day); assert.equal(t.runs[r2.id].bytes, 1e6); assert.equal(t.runs[r2.id].closed, true);
});
test('two runs at once share the tally under a lock: they cannot both pass the daily cap (S8)', () => {
  const st = path.join(tmp(), 's'), f = path.join(tmp(), 'log.md');
  const trips = [];
  const a = W.createRun({ label: 'a', logFile: f, stateDir: st, now: day, dayCapMB: 1, onTrip: e => trips.push('a ' + e.cap) });
  const b = W.createRun({ label: 'b', logFile: f, stateDir: st, now: day, dayCapMB: 1, onTrip: e => trips.push('b ' + e.cap) });
  a.add(0.6e6); assert.deepEqual(trips, []);
  const g = b.reserve(5e6); assert.ok(g.bytes > 0 && g.bytes <= 0.4e6, 'b may use only what a left: ' + g.bytes); assert.equal(g.by, 'day');
  b.settle(g, 0.45e6); assert.deepEqual(trips, ['b day']);
  a.close();
  /* the log now holds a's line (with its run id) and the tally holds a's bytes: counted once */
  const c = W.createRun({ label: 'c', logFile: f, stateDir: st, now: day, dayCapMB: 2, onTrip: 'close' });
  assert.ok(Math.abs(c.dayBaseBytes() - 1.05e6) < 1, 'day base ' + c.dayBaseBytes());
  c.close();
});
test('the tally is shared across processes: an open run in another process counts at once (S8)', async () => {
  const st = path.join(tmp(), 's'), f = path.join(tmp(), 'log.md'), mod = path.join(__dirname, '..', 'wf-guard.cjs');
  const child = execFile(process.execPath, ['-e', `const W=require(${JSON.stringify(mod)});const r=W.createRun({label:'other',logFile:${JSON.stringify(f)},stateDir:${JSON.stringify(st)},now:'${day.toISOString()}',dayCapMB:1,onTrip:'close'});r.add(0.7e6);console.log('ready');setTimeout(()=>{},3000);`]);
  await new Promise(r => child.stdout.on('data', x => { if (/ready/.test(x)) r(); }));
  let trip = null;
  const me = W.createRun({ label: 'me', logFile: f, stateDir: st, now: day, dayCapMB: 1, onTrip: e => { trip = e; } });
  me.add(0.2e6); assert.equal(trip, null); me.add(0.2e6); assert.equal(trip && trip.cap, 'day');
  child.kill(); await new Promise(r => child.on('exit', r));
});
test('default onTrip stops the process with an uncaught WfBudgetError after the log line; an unclosed run logs at exit', async () => {
  const dir = tmp(), f = path.join(dir, 'log.md'), st = path.join(dir, 's'), mod = path.join(__dirname, '..', 'wf-guard.cjs');
  const a = await runCli(['-e', `const W=require(${JSON.stringify(mod)});const r=W.createRun({label:'crash',logFile:${JSON.stringify(f)},stateDir:${JSON.stringify(st)},runCapMB:1});r.add(2e6);setTimeout(()=>console.log('still running'),500);`]);
  assert.notEqual(a.status, 0); assert.match(a.stderr, /WfBudgetError/); assert.doesNotMatch(a.stdout, /still running/);
  assert.match(fs.readFileSync(f, 'utf8'), /crash: .*2\.00 MB from Webflow \(M\).*STOPPED at the run cap/);
  const g = path.join(dir, 'log2.md');
  const b = await runCli(['-e', `const W=require(${JSON.stringify(mod)});const r=W.createRun({label:'no-close',logFile:${JSON.stringify(g)},stateDir:${JSON.stringify(st)}});r.add(1234);`]);
  assert.equal(b.status, 0); assert.match(fs.readFileSync(g, 'utf8'), /no-close: wf-guard cache-only run [0-9a-f]{6}, .*0\.00 MB from Webflow/);
});
test('the day CLI prints the total, and fails loudly on a log line it cannot read', async () => {
  const dir = tmp(), f = path.join(dir, 'log.md'), cli = path.join(__dirname, '..', 'wf-guard.cjs');
  fs.writeFileSync(f, '- 25 Nov, a: 3 MB (M)\n');
  const env = Object.assign({}, process.env, { WF_GUARD_LOG: f, WF_GUARD_STATE: path.join(dir, 's') });
  const a = await runCli([cli, 'day', '2026-11-25'], { env }); assert.equal(a.status, 0); assert.match(a.stdout, /25 Nov: 3\.00 MB/);
  fs.appendFileSync(f, '- someday: 5 MB\n');
  const b = await runCli([cli, 'day', '2026-11-25'], { env }); assert.equal(b.status, 1); assert.match(b.stderr, /no date the guard can read/);
});

/* ---------- curl ---------- */
test('curlFetch: wire bytes, no redirects followed, the size limit and the timeout', async () => {
  const gz = await W.curlFetch(`${A()}/gz.html`).promise;
  assert.equal(gz.status, 200); assert.match(gz.body.toString(), /hello stub page/); assert.ok(gz.wire >= HTMLGZ.length && gz.wire < HTMLGZ.length + 400, String(gz.wire));
  const r = await W.curlFetch(`${A()}/redir`).promise; assert.equal(r.status, 302); assert.equal(r.headers.location, '/plain.html');
  hits = {};
  const big = await W.curlFetch(`${A()}/huge.html`, { maxBytes: 100000 }).promise; assert.equal(big.truncated, true); assert.equal(big.exit, 63);
  const end = await W.curlFetch(`${A()}/endless.js`, { maxBytes: 300000 }).promise; assert.equal(end.truncated, true); assert.ok(end.wire < 600000, String(end.wire));
  const slow = await W.curlFetch(`${A()}/slow.js`, { timeoutS: 1 }).promise; assert.equal(slow.timedOut, true); assert.ok(slow.wire >= 1000, String(slow.wire));
});

/* ---------- wf-get ---------- */
test('wf-get: counts wire bytes of compressed pages, saves decoded HTML, follows redirects by hand, refuses media, logs one line', async () => {
  const dir = tmp(); hits = {};
  const o = opt({ out: dir, quiet: true });
  const r = await G.wfGet([`${A()}/gz.html`, `${A()}/redir`, `${A()}/img/a.png`, `${A()}/missing`], o);
  assert.equal(r.gets, 4, 'gz, redir, its target, missing');
  const gz = r.results[0]; assert.equal(gz.status, 200);
  assert.ok(gz.bytes >= HTMLGZ.length && gz.bytes < HTMLGZ.length + 400, `wire bytes ${gz.bytes} vs gzip ${HTMLGZ.length}`);
  assert.match(fs.readFileSync(path.join(dir, 'gz.html'), 'utf8'), /hello stub page/);
  assert.equal(r.results[1].status, 200); assert.match(fs.readFileSync(path.join(dir, 'redir.html'), 'utf8'), /plain/);
  assert.match(r.results[2].error, /refused/); assert.equal(hits['GET /img/a.png'] || 0, 0);
  assert.equal(r.results[3].status, 404);
  const log = fs.readFileSync(o.logFile, 'utf8').trim().split('\n'); assert.equal(log.length, 1);
  assert.match(log[0], /^- 25 Nov 10:00 UTC, [^:]+: wf-get run [0-9a-f]{6}, 4 GETs \(2 not 200\), \d+\.\d\d MB from Webflow \(M\)$/);
});
test('wf-get: a redirect to an image is refused before it is fetched, an image without an extension after it (W3, W4)', async () => {
  const dir = tmp(); hits = {};
  const r = await G.wfGet([`${A()}/redir-to-img`, `${A()}/noext-img`], opt({ out: dir, quiet: true }));
  assert.match(r.results[0].error, /redirect to an image/); assert.equal(hits['GET /img/r.png'] || 0, 0);
  assert.match(r.results[1].error, /content type image\/png/); assert.equal(fs.existsSync(path.join(dir, 'noext-img.html')), false);
});
test('wf-get: --max-filesize and the run cap stop a GET during the transfer (W5); --max is 30 by default', async () => {
  const dir = tmp();
  const a = await G.wfGet([`${A()}/huge.html`, `${A()}/plain.html`], opt({ out: dir, quiet: true, maxFileMB: 1 }));
  /* N-2: huge.html is chunked, so curl cuts it during the transfer at 1 MB and it counts what curl read plus CUT_ALLOWANCE
     (this assertion was a.bytes < 1.1e6, which pinned the undercount) */
  assert.match(a.results[0].error, /over --max-filesize 1 MB/); assert.ok(a.bytes > 1e6 + W.CUT_ALLOWANCE && a.bytes < 1.1e6 + W.CUT_ALLOWANCE, String(a.bytes)); assert.equal(a.results[1].status, 200);
  assert.equal(fs.existsSync(path.join(dir, 'huge.html')), false);
  const b = await G.wfGet([`${A()}/huge.html`, `${A()}/plain.html`], opt({ out: dir, quiet: true, runCapMB: 0.5 }));
  /* N-2: cut at what is left of the run cap, it counts what curl read plus CUT_ALLOWANCE (was b.bytes < 0.5e6, the undercount) */
  assert.equal(b.stopped.cap, 'run'); assert.ok(b.bytes < 0.5e6 + W.CUT_ALLOWANCE && b.bytes > W.CUT_ALLOWANCE, String(b.bytes)); assert.equal(b.gets, 1, 'curl stops a file over the limit');
  const e = await G.wfGet([`${A()}/endless.js`, `${A()}/plain.html`], opt({ out: dir, quiet: true, runCapMB: 0.5 }));
  /* N-2: a stream cut during the transfer counts what curl read plus CUT_ALLOWANCE (was e.bytes <= 0.5e6, the undercount) */
  assert.equal(e.stopped.cap, 'run'); assert.ok(e.bytes <= 0.5e6 + W.CUT_ALLOWANCE && e.bytes > 0.4e6 + W.CUT_ALLOWANCE, 'a stream is cut during the transfer: ' + e.bytes); assert.equal(e.gets, 1);
  const many = Array.from({ length: 31 }, (_, i) => `${A()}/plain.html?n=${i}`);
  const c = await G.wfGet(many, opt({ out: dir, quiet: true }));
  assert.equal(c.gets, 30); assert.equal(c.stopped.cap, 'max');
  const n = await G.wfGet([`${L()}/plain.html`], opt({ out: dir, quiet: true }));
  assert.equal(n.bytes, 0); assert.equal(n.gets, 1);
});
test('wf-get CLI: exit 3 at the daily cap, 2 without a label; the output folder is fixed to the repo root; --cache stores pages', async () => {
  const dir = tmp(), f = path.join(dir, 'log.md'); const today = new Date();
  fs.writeFileSync(f, `- ${today.getUTCDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][today.getUTCMonth()]}, earlier: 260 MB (M)\n`);
  const cli = path.join(__dirname, '..', 'wf-get.cjs');
  const a = await runCli([cli, '--label', 'x', '--log', f, '--out', dir, `${A()}/plain.html`]);
  assert.equal(a.status, 3, a.stderr); assert.match(a.stderr, /daily total/);
  const b = await runCli([cli, `${A()}/plain.html`]); assert.equal(b.status, 2);
  const label = 'wfget-test-' + process.pid, out = G.defaultOut(label), g = path.join(dir, 'log2.md'), cacheDir = path.join(dir, 'cache');
  try {
    const c = await runCli([cli, '--label', label, '--log', g, '--hosts', '127.0.0.1', '--cache', cacheDir, `${A()}/plain.html`], { cwd: dir });
    assert.equal(c.status, 0, c.stderr);
    assert.ok(fs.existsSync(path.join(out, 'plain.html')), 'saved under the repo root, not the current folder');
    assert.equal(fs.existsSync(path.join(dir, 'wf-get-out')), false);
    assert.match(W.makeCache(cacheDir).get(`${A()}/plain.html`).body.toString(), /plain/);
  } finally { fs.rmSync(out, { recursive: true, force: true }); try { fs.rmdirSync(path.dirname(out)); } catch (e) { } }
});

/* ---------- second round: check findings N-1 to N-7 (reports/evidence/bw-guard-fix-2026-11-27/check.md) ---------- */
test('N-5: a line repeated in one log counts each time; a line in both logs counts as often as the file that holds it most', () => {
  const dir = tmp(), a = path.join(dir, 'main.md'), b = path.join(dir, 'wt.md'), one = '- 25 Nov, sweep pass: 100 MB (E)\n';
  fs.writeFileSync(a, one + one); fs.writeFileSync(b, one);
  assert.equal(W.dailyTotalMB(one + one, day), 200);
  assert.equal(W.readDailyTotalMB([a], day), 200, 'twice in one file');
  assert.equal(W.readDailyTotalMB([b, b], day), 100, 'the same file twice counts once');
  assert.equal(W.readDailyTotalMB([a, b], day), 200, 'main has it twice, the worktree once: the larger count, not 300');
  fs.writeFileSync(b, one + '- 25 Nov, worktree only: 5 MB (M)\n');
  assert.equal(W.readDailyTotalMB([a, b], day), 205);
});
test('N-6: a dated line with a size that is not a bullet fails loudly and names the line; "3 M" and "bytes" are sizes', () => {
  const d27 = d('2026-11-27');
  for (const l of ['1. 27 Nov, x: 3 MB', '| 27 Nov | x | 3 MB |', '27 Nov, x: 3 MB', '2) Nov 27: 3 MB', 'On 2026-11-27 a run used 3000000 bytes', '**27 Nov**, x: 3 M']) {
    assert.throws(() => W.lineMBForDay(l, d27), e => e instanceof W.WfLogFormatError && e.message.includes(l), l);
    assert.throws(() => W.dailyTotalMB(`# log\n- 27 Nov, ok: 1 MB\n${l}\n`, d27), e => e instanceof W.WfLogFormatError && e.message.includes('line 3: ' + l), l);
  }
  for (const [l, mb] of [['- 27 Nov, x: 3 M', 3], ['- 27 Nov, x: 3000000 bytes', 3], ['- 27 Nov, x: 1,500,000 bytes and 2 M (E)', 3.5], ['- 27 Nov, x: 5 to 7 M', 7], ['- 27 Nov, x: 0.6 MB (M); 0 MB from Webflow (M)', 0.6]]) assert.equal(W.lineMBForDay(l, d27), mb, l);
  /* lines that are not log entries stay quiet: no size, no date, or prose whose sizes come before any date */
  for (const l of ['## Period from about 20 Nov 2026', '| Date | MB |', 'Budget: 250 MB a day, 5 GB a month. Rules: the 13 Nov STANDING RULE.', 'took 5 m on 27 Nov']) assert.equal(W.lineMBForDay(l, d27), 0, l);
  /* the real logs (this checkout and the main checkout) still parse with no error */
  const f = path.join(__dirname, '..', '..', 'handoff', 'BANDWIDTH-LOG.md');
  for (const x of ['2026-11-20', '2026-11-21', '2026-11-25', '2026-11-27']) W.readDailyTotalMB([f, W.MAIN_LOG], d(x));
  const f2 = path.join(tmp(), 'log.md'); fs.writeFileSync(f2, '- 25 Nov, ok: 1 MB (M)\n| 25 Nov | table run | 40 MB |\n');
  assert.throws(() => W.createRun({ label: 'x', logFile: f2, stateDir: path.join(tmp(), 's'), now: day }), e => e instanceof W.WfLogFormatError && /log\.md:2: \| 25 Nov \| table run \| 40 MB \|/.test(e.message));
});
test('N-1: open reservations never trip a run; a blocked GET waits, then is refused alone; a cap in counted bytes still trips', async () => {
  const st = path.join(tmp(), 's'), f = path.join(tmp(), 'log.md'), mod = path.join(__dirname, '..', 'wf-guard.cjs');
  /* another process holds a 1 MB reservation (the whole day cap) and keeps it for 1.5 s */
  const child = execFile(process.execPath, ['-e', `const W=require(${JSON.stringify(mod)});const r=W.createRun({label:'holder',logFile:${JSON.stringify(f)},stateDir:${JSON.stringify(st)},now:'${day.toISOString()}',dayCapMB:1,onTrip:'close'});const g=r.tryReserve(5e6);console.log('held '+g.bytes);setTimeout(()=>{r.settle(g,0.2e6);console.log('settled');setTimeout(()=>{},2000);},1500);`]);
  await new Promise(r => child.stdout.on('data', x => { if (/held/.test(x)) r(); }));
  const trips = [];
  const me = W.createRun({ label: 'me', logFile: f, stateDir: st, now: day, dayCapMB: 1, onTrip: e => trips.push(e.message) });
  assert.equal(me.dayBaseBytes(), 0, 'a run starts: reservations are not bytes');
  assert.deepEqual(me.tryReserve(5e6), { bytes: 0, by: 'busy', left: 1e6 });
  const short = await me.reserveWait(5e6, 300);
  assert.equal(short.bytes, 0); assert.equal(short.by, 'busy'); assert.equal(me.error, null); assert.deepEqual(trips, []);
  assert.equal(me.waitRefused, 1);
  const t0 = Date.now(); const g = await me.reserveWait(5e6, 10000);
  assert.ok(Date.now() - t0 >= 500, 'waited for the other run to settle'); assert.equal(g.bytes, 0.8e6); assert.equal(g.by, 'day');
  me.settle(g, 0.7e6); assert.deepEqual(trips, []);
  /* now 0.9 MB is counted: 0.1 MB left is enough for a small GET, and a cap reached in counted bytes trips */
  const g2 = me.tryReserve(5e6); assert.equal(g2.bytes, 0.1e6);
  me.settle(g2, 0.1e6); assert.equal(trips.length, 1); assert.match(trips[0], /brought the 25 Nov total to 1\.00 MB \(0\.80 MB in this run\), which reached the daily cap of 1 MB/);
  child.kill(); await new Promise(r => child.on('exit', r));
  /* too little left in counted bytes: the run trips and says so */
  const r3 = W.createRun({ label: 'tiny', logFile: path.join(tmp(), 'log.md'), stateDir: path.join(tmp(), 's'), now: day, runCapMB: 0.02, onTrip: e => trips.push(e.message) });
  assert.equal(r3.tryReserve(5e6).by, 'run'); assert.match(trips[1], /tiny stopped at the run cap of 0\.02 MB: 0\.00 MB counted from Webflow in this run and 0\.02 MB left, too little for another GET/);
});
test('N-1: wf-get processes started together share the daily cap in counted bytes: as many run as fit, never more (check N5)', async () => {
  const mod = path.join(__dirname, '..', 'wf-get.cjs');
  for (const [n, kb, fit] of [[2, 600, 1], [6, 300, 3], [12, 190, 5]]) {
    const st = path.join(tmp(), 's'), f = path.join(tmp(), 'log.md'); sent = [];
    const at = Date.now() + 1500;
    const code = i => `const G=require(${JSON.stringify(mod)});setTimeout(()=>G.wfGet([${JSON.stringify(`${A()}/cl/${kb}.js?p=`)}+${i}],{label:'n5-${i}',out:${JSON.stringify(tmp())},logFile:${JSON.stringify(f)},stateDir:${JSON.stringify(st)},dayCapMB:1,hosts:['127.0.0.1'],now:'${day.toISOString()}',quiet:true}).then(r=>console.log(JSON.stringify({ok:r.results[0].status===200&&!r.results[0].error,bytes:r.bytes,err:r.results[0].error||null,stopped:r.stopped&&r.stopped.message})),e=>console.log(JSON.stringify({ok:false,start:e.message}))),Math.max(0,${at}-Date.now()));`;
    const outs = await Promise.all(Array.from({ length: n }, (_, i) => runCli(['-e', code(i)])));
    const rs = outs.map(o => JSON.parse(o.stdout.trim() || '{"ok":false}'));
    assert.equal(rs.filter(r => r.ok).length, fit, `${n} x ${kb} KB: ` + JSON.stringify(rs));
    const whole = sent.filter(x => x.p.startsWith('/cl/')).length;
    assert.ok(whole >= fit, 'stub answers ' + whole);
    const t = W.readTally(st, day); const counted = Object.values(t.runs).reduce((s, r) => s + (+r.bytes || 0), 0);
    assert.ok(fit * kb * 1000 <= 1e6 && counted >= fit * kb * 1000, `counted ${counted}`);
  }
});
test('N-2: a response refused at a size limit counts its declared length up to the limit, or 256 KB; it is not fetched again', async () => {
  const cut = (wire, cl) => ({ truncated: true, wire, headers: cl ? { 'content-length': String(cl) } : {} });
  assert.equal(W.countedBytes({ truncated: false, wire: 1234, headers: {} }, 5e6), 1234);
  assert.equal(W.countedBytes(cut(165, 3e6), 1e6), 165 + 1e6, 'declared 3 MB, limit 1 MB: the limit');
  assert.equal(W.countedBytes(cut(165, 30e6), 0.1e6), 165 + W.CUT_ALLOWANCE, 'a small limit: the allowance');
  assert.equal(W.countedBytes(cut(165, 0.2e6), 0.1e6), 165 + 0.2e6, 'never more than the declared length');
  assert.equal(W.countedBytes(cut(1000169), 1e6), 1000169 + W.CUT_ALLOWANCE, 'cut during a chunked transfer: what curl read plus the allowance');
  sent = [];
  const dir = tmp();
  const r = await G.wfGet([`${A()}/cl/3000.js`, `${A()}/cl/3000.js`], opt({ out: dir, quiet: true, maxFileMB: 1 }));
  assert.match(r.results[0].error, /over --max-filesize 1 MB/); assert.match(r.results[1].error, /over the size limit earlier in this run/);
  assert.ok(r.bytes > 1e6 && r.bytes < 1e6 + 1000, 'counted ' + r.bytes); assert.equal(r.gets, 1, 'asked for once');
  assert.equal(sent.filter(x => x.p === '/cl/3000.js').length, 1);
  assert.match(r.line, /1 over the size limit, 1 refused again as over the size limit earlier in the run$/);
});
test('N-7: a trip that refuses the first GET says it was refused and how much was counted', async () => {
  const r = await G.wfGet([`${A()}/cl/3000.js`], opt({ out: tmp(), quiet: true, runCapMB: 0.5 }));
  assert.equal(r.stopped.cap, 'run');
  assert.match(r.stopped.message, /test-run stopped at the run cap of 0\.5 MB: a GET of http:\/\/127\.0\.0\.1:\d+\/cl\/3000\.js was refused because it was larger than the 0\.50 MB left; 0\.48 MB counted from Webflow in this run, the refused GET included/);
  assert.doesNotMatch(r.stopped.message, /reached 0\.00 MB/);
  assert.match(r.line, /0\.48 MB from Webflow \(M\); STOPPED at the run cap$/);
});

/* ---------- the guard in a real Chromium ---------- */
const skip = chromium ? false : 'playwright not found (set NODE_PATH=/opt/node22/lib/node_modules)';
let browser;
const putAsset = (dir, u, type, body, status) => W.makeCache(dir).put(u, status || 200, { 'content-type': type, 'access-control-allow-origin': '*' }, body);
test.describe('guard in Chromium', { skip }, () => {
  test.before(async () => { browser = await chromium.launch({ args: ['--no-sandbox', '--no-proxy-server', '--host-resolver-rules=MAP * 127.0.0.1, EXCLUDE localhost'] }); });
  test.after(async () => { if (browser) await browser.close(); });
  const newGuarded = async (o) => { const ctx = await browser.newContext(); const g = W.guard(ctx, opt(o)); await g.ready; return { ctx, g }; };

  test('cache-only is the default: Webflow pages and assets come from the cache folders, misses are aborted and listed, 0 bytes', async () => {
    hits = {}; const dir = tmp(), cacheDir = path.join(dir, 'assets'), htmlDir = path.join(dir, 'html'); fs.mkdirSync(htmlDir);
    fs.writeFileSync(path.join(htmlDir, 'site__page.html'), `<!doctype html><link rel="stylesheet" href="${A()}/style.css"><script src="${A()}/app.js"></script><img src="${A()}/img/a.png"><img src="${A()}/img/missing.png"><video src="${A()}/v.mp4" muted autoplay></video><p>saved page</p>`);
    putAsset(cacheDir, `${A()}/style.css`, 'text/css', Buffer.from('p{color:blue}'));
    putAsset(cacheDir, `${A()}/app.js`, 'application/javascript', Buffer.from('window.__app="cached"'));
    putAsset(cacheDir, `${A()}/img/a.png`, 'image/png', PNG);
    const { ctx, g } = await newGuarded({ cacheDir, htmlDir });
    assert.equal(g.stats().mode, 'cache-only'); assert.equal(g.lastWord(), true);
    const p = await ctx.newPage(); await p.goto(`${A()}/site/page`); await sleep(200);
    assert.match(await p.textContent('body'), /saved page/); assert.equal(await p.evaluate(() => window.__app), 'cached');
    assert.equal(await p.evaluate(() => document.images[0].naturalWidth), 1);
    assert.deepEqual(Object.keys(hits), [], 'nothing reached the stub: ' + JSON.stringify(hits));
    const s = g.stats(); assert.equal(s.bytes, 0); assert.equal(s.gets, 0); assert.equal(s.pageLoads, 1); assert.equal(s.cacheHits, 4);
    assert.equal(s.misses, 2); assert.ok(s.missList.some(x => /^image .*missing\.png$/.test(x)) && s.missList.some(x => /^video .*v\.mp4$/.test(x)), s.missList.join());
    await ctx.close(); await sleep(50);
    assert.match(fs.readFileSync(g.run.logFile, 'utf8'), /wf-guard cache-only run [0-9a-f]{6}, 1 page loads, 0 Webflow GETs, 0\.00 MB from Webflow \(M\); 4 served from the cache, 2 cache misses aborted/);
  });

  test('real host names: trailing dots, site subdomains, webflow.com and an encoded extension are all caught (S1, W6)', async () => {
    hits = {};
    const ctx = await browser.newContext(); const g = W.guard(ctx, opt({ hosts: undefined })); await g.ready;
    const p = await ctx.newPage(); await p.goto(`${L()}/realhosts.html`); await sleep(300);
    assert.equal(await p.evaluate(() => window.__s), 'blocked');
    for (const k of ['GET /img/dot.png', 'GET /img/sub.png', 'GET /img/old.png', 'GET /a%2Epng']) assert.equal(hits[k] || 0, 0, k);
    assert.equal(g.stats().misses, 4); await ctx.close();
  });

  test('block mode: media aborted, other Webflow GETs fetched by the guard and counted, non-GET aborted', async () => {
    hits = {};
    const { ctx, g } = await newGuarded({ mode: 'block' });
    const p = await ctx.newPage();
    await p.goto(`${L()}/page.html`, { waitUntil: 'load' });
    assert.equal(await p.evaluate(() => window.__post), 'blocked');
    assert.equal(await p.evaluate(() => window.__xhr), '{"ok":true}');
    assert.equal(await p.evaluate(() => window.__app), 1);
    await sleep(200);
    for (const k of ['GET /img/a.png', 'GET /img/b.jpg', 'GET /f.woff2', 'GET /v.mp4', 'POST /form']) assert.equal(hits[k] || 0, 0, k);
    assert.equal(hits['GET /app.js'], 1); assert.equal(hits['GET /style.css'], 1);
    const s = g.stats();
    assert.equal(s.pageLoads, 0, 'the page itself is not a Webflow page'); assert.equal(s.nonGet, 1); assert.ok(s.blocked >= 3, 'blocked ' + s.blocked);
    assert.equal(s.gets, 3, 'app.js, style.css, data.json');
    const min = 1200 + 1215 + 11; assert.ok(s.bytes >= min && s.bytes < min + 3000, 'bytes ' + s.bytes);
    await ctx.close(); await sleep(50);
    const log = fs.readFileSync(g.run.logFile, 'utf8').trim().split('\n'); assert.equal(log.length, 1);
    assert.match(log[0], /^- 25 Nov 10:00 UTC, [^:]+: wf-guard block run [0-9a-f]{6}, 0 page loads, 3 Webflow GETs, 0\.0\d MB from Webflow \(M\); 0 served from the cache, 0 cache misses aborted, \d+ images, video or fonts aborted, 1 non-GET requests aborted$/);
  });

  test('fetch-once: each URL goes to the network once across contexts, also at the same time; video and fonts blocked (S6, G1, G2)', async () => {
    hits = {}; const dir = tmp(), cacheDir = path.join(dir, 'assets');
    const run = W.createRun(opt({ label: 'fo', mode: 'fetch-once' }));
    /* two contexts load the same page at the same time */
    const ctxs = await Promise.all([0, 1].map(() => browser.newContext()));
    const gs = ctxs.map(c => W.guard(c, { run, mode: 'fetch-once', cacheDir, hosts: ['127.0.0.1'] }));
    await Promise.all(gs.map(g => g.ready));
    const pages = await Promise.all(ctxs.map(c => c.newPage()));
    await Promise.all(pages.map(p => p.goto(`${L()}/dup.html`)));
    await Promise.all(pages.map(p => p.goto(`${L()}/page.html`)));
    await sleep(300);
    for (const k of ['GET /img/d.png', 'GET /img/a.png', 'GET /img/b.jpg', 'GET /app.js', 'GET /style.css', 'GET /data.json']) assert.equal(hits[k], 1, k);
    assert.equal(hits['GET /v.mp4'] || 0, 0, 'video blocked'); assert.equal(hits['GET /f.woff2'] || 0, 0, 'font blocked');
    await Promise.all(ctxs.map(c => c.close()));
    /* a later context, and the cache seen from another process */
    const c3 = await browser.newContext(); W.guard(c3, { run, mode: 'fetch-once', cacheDir, hosts: ['127.0.0.1'] }); const p3 = await c3.newPage();
    await p3.goto(`${L()}/page.html`); await sleep(200);
    assert.equal(hits['GET /app.js'], 1); assert.equal(hits['GET /img/a.png'], 1);
    await c3.close();
    const mod = path.join(__dirname, '..', 'wf-guard.cjs');
    const out = execFileSync(process.execPath, ['-e', `const W=require(${JSON.stringify(mod)});const c=W.makeCache(${JSON.stringify(cacheDir)});console.log(c.claim(${JSON.stringify(A() + '/app.js')}), !!c.get(${JSON.stringify(A() + '/app.js')}), c.claim('http://127.0.0.1/new'))`], { encoding: 'utf8' });
    assert.equal(out.trim(), 'false true true', 'another process may not fetch a URL again, but may claim a new one');
    assert.equal(W.makeCache(cacheDir).claim('http://127.0.0.1/new'), false, 'and then this process may not');
    run.close();
    assert.match(fs.readFileSync(run.logFile, 'utf8'), /wf-guard fetch-once run [0-9a-f]{6}, 0 page loads, 6 Webflow GETs/);
  });

  test('fetch-once with allowVideo: the Range header is kept and bounded, the whole video is never downloaded (G2)', async () => {
    hits = {}; ranges = []; const dir = tmp(), cacheDir = path.join(dir, 'assets');
    const { ctx, g } = await newGuarded({ mode: 'fetch-once', cacheDir, allowVideo: true, videoChunkMB: 0.5 });
    const p = await ctx.newPage(); await p.goto(`${L()}/video.html`); await sleep(800);
    assert.ok(ranges.length >= 1, 'the video was asked for'); assert.ok(!ranges.includes('none'), 'never without a Range header: ' + ranges);
    for (const r of ranges) { const m = /^bytes=(\d+)-(\d+)$/.exec(r); assert.ok(m && +m[2] - +m[1] + 1 <= 500000, 'bounded range ' + r); }
    assert.ok(ranges.length <= 4 && g.stats().bytes <= ranges.length * 500000 + 5000 && g.stats().bytes < VIDEO.length, 'bytes ' + g.stats().bytes + ' ranges ' + ranges);
    assert.equal(hits['GET /g.woff2'] || 0, 0, 'fonts still blocked');
    /* a request without a Range header is refused */
    await assert.rejects(p.request.get(`${A()}/v.mp4?whole=1`), /video without a Range header/);
    await ctx.close();
  });

  test('a failed fetch leaves no unhandled rejection and is never fetched again (fix 1)', async () => {
    hits = {}; const dir = tmp(), cacheDir = path.join(dir, 'assets'); const before = unhandled.length;
    const { ctx, g } = await newGuarded({ mode: 'fetch-once', cacheDir });
    let callerErr = null;
    await ctx.route('**/drop2.png', async route => { try { await route.fetch({ url: `${A()}/img/drop.png?b=1` }); } catch (e) { callerErr = e.message; } return route.abort(); });
    const p = await ctx.newPage(); await p.goto(`${L()}/drop.html`);
    await p.evaluate(a => { const i = new Image(); i.src = a + '/x/drop2.png'; }, A()); await sleep(500);
    await p.goto(`${L()}/drop.html`); await sleep(300);
    assert.equal(hits['GET /img/drop.png'], 2, 'once for the page, once for the caller fetch, never again');
    assert.match(String(callerErr), /refused|failed/);
    assert.ok(g.stats().failed >= 2 || g.stats().cacheRefused >= 1, JSON.stringify(g.stats()));
    await ctx.close(); await sleep(100);
    assert.equal(unhandled.length, before, unhandled.join('; '));
  });

  test('routes registered before guard() still run, and their continue() still meets the guard (E1, E2, E3)', async () => {
    hits = {};
    const ctx = await browser.newContext();
    let saved = 0;
    await ctx.route(`${A()}/saved.html`, route => { saved++; return route.fulfill({ status: 200, contentType: 'text/html', body: `<p>saved copy</p><img src="${A()}/img/a.png">` }); });
    const p = await ctx.newPage();
    await p.route('**/img/a.png', route => route.continue());
    const g = W.guard(ctx, opt({ mode: 'block' })); await g.ready;
    await p.goto(`${A()}/saved.html`); await sleep(200);
    assert.equal(saved, 1, 'the earlier context route ran'); assert.match(await p.textContent('body'), /saved copy/);
    assert.equal(hits['GET /saved.html'] || 0, 0); assert.equal(hits['GET /img/a.png'] || 0, 0, 'the earlier page route continue() was stopped');
    assert.equal(g.stats().pageLoads, 1); assert.equal(g.stats().blocked, 1);
    await ctx.close();
    /* guard(page) on a page with an earlier page route */
    const ctx2 = await browser.newContext(); const p2 = await ctx2.newPage();
    await p2.route('**/*', route => route.continue());
    const g2 = W.guard(p2, opt({ mode: 'block' })); await g2.ready;
    await p2.goto(`${L()}/plain.html`); await sleep(200);
    assert.equal(hits['GET /img/a.png'] || 0, 0); assert.equal(g2.stats().blocked, 1);
    await p2.close();
    const p3 = await ctx2.newPage(); await p3.goto(`${L()}/big.html`); await sleep(200);
    await ctx2.close(); await sleep(50);
    assert.match(fs.readFileSync(g2.run.logFile, 'utf8'), /0\.30 MB from Webflow/, 'traffic after the page closed is still logged (check item 8)');
  });

  test("routes registered after guard(): continue() meets the guard, fulfill() is free, fetch() is guarded and its answer can be fulfilled", async () => {
    hits = {}; const dir = tmp(), cacheDir = path.join(dir, 'assets');
    putAsset(cacheDir, `${A()}/data.json`, 'application/json', Buffer.from('{"cached":1}'));
    const { ctx, g } = await newGuarded({ cacheDir });
    const p = await ctx.newPage();
    let fetchErr = null;
    await p.route('**/img/a.png', route => route.continue());
    await ctx.route('**/app.js', route => route.fulfill({ status: 200, contentType: 'application/javascript', body: 'window.__app=2' }));
    await p.route('**/img/b.jpg', async route => { try { await route.fetch(); } catch (e) { fetchErr = e.message; } return route.abort(); });
    await ctx.route('**/data.json', async route => route.fulfill({ response: await route.fetch() }));
    await p.goto(`${L()}/page.html`); await sleep(300);
    assert.equal(hits['GET /img/a.png'] || 0, 0); assert.equal(hits['GET /img/b.jpg'] || 0, 0); assert.equal(hits['GET /app.js'] || 0, 0);
    assert.equal(await p.evaluate(() => window.__app), 2);
    assert.equal(await p.evaluate(() => window.__xhr), '{"cached":1}');
    assert.match(fetchErr, /refused a Webflow fetch in mode cache-only \(not in the cache\)/);
    assert.equal(g.stats().bytes, 0);
    await ctx.close();
  });

  test('non-GET at page unload: beacons and keepalive POSTs to Webflow never leave, other hosts only with unloadNonGet all (fix 3)', async () => {
    for (const all of [false, true]) {
      hits = {};
      const { ctx, g } = await newGuarded(all ? { unloadNonGet: 'all' } : {});
      const p = await ctx.newPage(); await p.goto(`${L()}/unload.html`);
      await p.goto(`${L()}/plain.html`); await sleep(300);
      const p2 = await ctx.newPage(); await p2.goto(`${L()}/unload.html`); await p2.close(); await sleep(300);
      assert.equal(hits['POST /u-beacon'] || 0, 0, 'Webflow beacon'); assert.equal(hits['POST /u-ka'] || 0, 0, 'Webflow keepalive');
      if (all) { assert.equal(hits['POST /u-beacon-other'] || 0, 0); assert.equal(hits['POST /u-ka-other'] || 0, 0); }
      else assert.ok((hits['POST /u-beacon-other'] || 0) >= 1, 'other hosts are left alone by default: ' + JSON.stringify(hits));
      await ctx.close(); assert.ok(g.stats().nonGet >= 0);
    }
  });

  test('context.request and page.request: non-GET refused, Webflow GETs answered by the guard, redirects into Webflow caught', async () => {
    hits = {}; const dir = tmp(), cacheDir = path.join(dir, 'assets');
    putAsset(cacheDir, `${A()}/data.json`, 'application/json', Buffer.from('{"cached":2}'));
    const { ctx, g } = await newGuarded({ cacheDir });
    const p = await ctx.newPage();
    assert.equal(await (await p.request.get(`${A()}/data.json`)).text(), '{"cached":2}');
    await assert.rejects(ctx.request.post(`${L()}/form`, { data: 'x' }), /refused a POST/);
    await assert.rejects(p.request.fetch(`${A()}/form`, { method: 'PUT' }), /refused a PUT/);
    await assert.rejects(p.request.get(`${A()}/miss.json`), /not in the cache/);
    await assert.rejects(p.request.get(`${L()}/to-wf-img`), /not in the cache/);
    assert.equal((await p.request.get(`${L()}/plain.html`)).status(), 200);
    assert.equal(hits['POST /form'] || 0, 0); assert.equal(hits['PUT /form'] || 0, 0); assert.equal(hits['GET /img/s2.png'] || 0, 0); assert.equal(hits['GET /data.json'] || 0, 0);
    assert.equal(g.stats().nonGet, 2); assert.equal(g.stats().redirectsIn, 1);
    await ctx.close();
  });

  test('a response that never finishes is cut at the run cap during the transfer, and the bytes are counted (S5)', async () => {
    let err = null;
    const { ctx, g } = await newGuarded({ mode: 'block', runCapMB: 1, onTrip: e => { err = e; } });
    const p = await ctx.newPage();
    await p.goto(`${L()}/endless.html`, { timeout: 10000 }).catch(() => { });
    for (let i = 0; i < 100 && !err; i++) await sleep(50);
    assert.ok(err instanceof W.WfBudgetError); assert.equal(err.cap, 'run');
    /* N-2: the cut stream counts what curl read plus CUT_ALLOWANCE (these lines pinned 0.9 to 1.01 MB, the undercount) */
    assert.ok(g.stats().bytes > 0.9e6 + W.CUT_ALLOWANCE && g.stats().bytes <= 1.01e6 + W.CUT_ALLOWANCE, 'bytes ' + g.stats().bytes);
    assert.throws(() => g.check(), W.WfBudgetError);
    assert.match(err.message, /a GET of \S+endless\.js was refused because it was larger than the 1\.00 MB left; 1\.2\d MB counted/);
    await assert.rejects(p.goto(`${L()}/plain.html`));
    assert.match(fs.readFileSync(g.run.logFile, 'utf8'), /1\.2\d MB from Webflow \(M\).*STOPPED at the run cap/);
    /* a response that stalls is cut at the timeout and counted as unfinished */
    const b = await newGuarded({ mode: 'block', fetchTimeoutS: 1 });
    const p2 = await b.ctx.newPage(); await p2.goto(`${L()}/slow.html`, { timeout: 10000 }).catch(() => { }); await sleep(300);
    assert.equal(b.g.stats().unfinished, 1); assert.ok(b.g.stats().bytes >= 1000, 'bytes ' + b.g.stats().bytes);
    await b.ctx.close(); await sleep(50);
    assert.match(fs.readFileSync(b.g.run.logFile, 'utf8'), /; 1 unfinished/);
  });

  test('a redirect from another host into a Webflow host is caught (S2); with strictRedirects false it is counted as a leak', async () => {
    hits = {};
    const a = await newGuarded({});
    const p = await a.ctx.newPage(); await p.goto(`${L()}/s2.html`); await sleep(300);
    assert.equal(hits['GET /to-wf-img'], 1); assert.equal(hits['GET /img/s2.png'] || 0, 0);
    assert.equal(a.g.stats().redirectsIn, 1); assert.equal(a.g.stats().misses, 1);
    await a.ctx.close();
    hits = {};
    const b = await newGuarded({ strictRedirects: false });
    const p2 = await b.ctx.newPage(); await p2.goto(`${L()}/s2.html`); await sleep(300);
    assert.equal(hits['GET /img/s2.png'], 1, 'Playwright does not route a network redirect hop');
    assert.equal(b.g.stats().leaks, 1); assert.ok(b.g.stats().bytes > 60, 'counted ' + b.g.stats().bytes);
    await b.ctx.close(); await sleep(50);
    assert.match(fs.readFileSync(b.g.run.logFile, 'utf8'), /1 reached Webflow past the guard/);
  });

  test('run cap on a big file: the run stops, the context closes, onTrip gets a WfBudgetError and the log says STOPPED', async () => {
    let err = null;
    const { ctx, g } = await newGuarded({ mode: 'block', runCapMB: 0.1, onTrip: e => { err = e; } });
    const p = await ctx.newPage();
    await p.goto(`${L()}/big.html`).catch(() => { });
    for (let i = 0; i < 50 && !err; i++) await sleep(50);
    assert.ok(err instanceof W.WfBudgetError); assert.equal(err.cap, 'run');
    /* N-2: big.js is chunked and cut at about 0.08 MB; it counts that plus CUT_ALLOWANCE (was bytes <= 0.1e6, the undercount) */
    assert.ok(g.stats().bytes > W.CUT_ALLOWANCE && g.stats().bytes <= 0.1e6 + W.CUT_ALLOWANCE, String(g.stats().bytes));
    assert.match(fs.readFileSync(g.run.logFile, 'utf8'), /STOPPED at the run cap/);
  });

  test('shared run: two contexts, one tally, one line on run.close(); a page target works too', async () => {
    const run = W.createRun(opt({ label: 'shared', mode: 'block' }));
    for (let i = 0; i < 2; i++) {
      const ctx = await browser.newContext(); const p = await ctx.newPage();
      const g = W.guard(p, { run, mode: 'block', hosts: ['127.0.0.1'] }); await g.ready;
      await p.goto(`${A()}/redir`);
      await ctx.close();
    }
    assert.equal(fs.existsSync(run.logFile), false, 'no line until the run closes');
    run.close();
    assert.match(fs.readFileSync(run.logFile, 'utf8'), /^- 25 Nov 10:00 UTC, shared: wf-guard block run [0-9a-f]{6}, 2 page loads, 4 Webflow GETs, 0\.00 MB from Webflow \(M\); 0 served from the cache, 0 cache misses aborted, 2 images/);
  });

  test('unrouteAll() and unroute(**/*) by the caller keep the guard in place', async () => {
    hits = {};
    const { ctx, g } = await newGuarded({ mode: 'block' });
    await ctx.route('**/*', route => route.continue());
    await ctx.unrouteAll(); await ctx.unroute('**/*');
    const p = await ctx.newPage(); await p.goto(`${L()}/plain.html`); await sleep(200);
    assert.equal(hits['GET /img/a.png'] || 0, 0); assert.equal(g.stats().blocked, 1); assert.equal(g.lastWord(), true);
    await ctx.close();
  });

  test('guard refuses a second guard on one context, a context over the daily cap, the old cache mode and fetch-once without a folder', async () => {
    const f = path.join(tmp(), 'log.md'); fs.writeFileSync(f, '- 25 Nov, earlier: 251 MB (M)\n');
    const ctx = await browser.newContext();
    assert.throws(() => W.guard(ctx, opt({ label: 'over', logFile: f })), W.WfBudgetError);
    assert.throws(() => W.guard(ctx, opt({ label: 'old', mode: 'cache' })), /was replaced/);
    assert.throws(() => W.guard(ctx, opt({ label: 'fo', mode: 'fetch-once' })), /needs opts.cacheDir/);
    const g = W.guard(ctx, opt({ label: 'ok' })); await g.ready;
    assert.throws(() => W.guard(ctx, opt({ label: 'again' })), /already guarded/);
    await ctx.close();
  });
  /* ---------- second round: check findings N-1 to N-7 ---------- */
  test('N-1: 45 small Webflow images at once in fetch-once load without a trip (check n7, was a stop at 0.00 MB)', async () => {
    hits = {}; const trips = [];
    const { ctx, g } = await newGuarded({ mode: 'fetch-once', cacheDir: path.join(tmp(), 'assets'), onTrip: e => trips.push(e.message) });
    const p = await ctx.newPage(); await p.goto(`${L()}/many.html`, { timeout: 20000 });
    assert.deepEqual(trips, []); assert.equal(g.stats().stopped, null);
    assert.equal(await p.evaluate(() => [...document.images].filter(i => i.naturalWidth === 1).length), 45);
    const s = g.stats(); assert.equal(s.cacheFetches, 45); assert.equal(s.gets, 45); assert.ok(s.waits >= 5, 'at least 5 GETs waited for reservations: ' + s.waits); assert.equal(s.waitRefused, 0);
    assert.equal(Object.keys(hits).filter(k => k.startsWith('GET /slow/m')).length, 45);
    await ctx.close();
  });

  test('N-1: 10 MB left of the daily cap and 3 images at once: all three load, no trip (check n7b)', async () => {
    hits = {}; const trips = []; const f = path.join(tmp(), 'log.md'); fs.writeFileSync(f, '- 25 Nov, earlier work: 240 MB (M)\n');
    const { ctx, g } = await newGuarded({ mode: 'fetch-once', cacheDir: path.join(tmp(), 'assets'), logFile: f, onTrip: e => trips.push(e.message) });
    const p = await ctx.newPage(); await p.goto(`${L()}/three.html`, { timeout: 20000 });
    assert.deepEqual(trips, []);
    assert.equal(await p.evaluate(() => [...document.images].filter(i => i.naturalWidth === 1).length), 3);
    assert.equal(g.stats().cacheFetches, 3); assert.ok(g.stats().waits >= 1, 'the third GET waited: ' + g.stats().waits);
    await ctx.close(); await sleep(50);
    assert.doesNotMatch(fs.readFileSync(f, 'utf8'), /STOPPED/);
  });

  test('N-2: block mode remembers a GET refused at getCapMB and never asks for it again in the run', async () => {
    sent = [];
    const { ctx, g } = await newGuarded({ mode: 'block', getCapMB: 1 });
    const p = await ctx.newPage(); await p.goto(`${L()}/bigcl.html`); await p.goto(`${L()}/bigcl.html`); await sleep(200);
    assert.equal(sent.filter(x => x.p === '/cl/3000.js').length, 1, 'fetched once');
    const s = g.stats(); assert.equal(s.tooBig, 1); assert.equal(s.refusedAgain, 1); assert.equal(s.stopped, null);
    assert.ok(s.bytes >= 1e6 && s.bytes < 1e6 + 1000, 'counted up to the 1 MB limit: ' + s.bytes);
    await ctx.close(); await sleep(50);
    assert.match(fs.readFileSync(g.run.logFile, 'utf8').trim(), /1 over the size limit, 1 refused again as over the size limit earlier in the run$/);
  });

  test('N-3: an extensionless fetch() of a Webflow video gets at most one chunk, with a Range header, in every fetching mode', async () => {
    for (const o of [{ mode: 'fetch-once' }, { mode: 'fetch-once', allowVideo: true }, { mode: 'block' }]) {
      ranges = []; sent = [];
      const { ctx, g } = await newGuarded(Object.assign({ cacheDir: path.join(tmp(), 'assets'), videoChunkMB: 0.5 }, o));
      const p = await ctx.newPage(); await p.goto(`${L()}/noext.html`); await sleep(300);
      assert.equal(await p.evaluate(() => window.__v), 'blocked', JSON.stringify(o));
      const clip = ranges.filter(r => r.startsWith('/media/clip'));
      assert.deepEqual(clip, ['/media/clip bytes=0-499999'], JSON.stringify(o) + ' ' + clip);
      const clipBytes = sent.filter(x => x.p === '/media/clip').reduce((a, x) => a + x.n, 0);
      assert.ok(clipBytes <= 500000, 'the stub sent ' + clipBytes + ' video bytes, not 3 MB');
      /* a small extensionless JSON comes whole, as a 200; a larger one (0.8 MB, over the 0.5 MB chunk) is asked for again whole */
      assert.equal(await p.evaluate(() => window.__jt), '{"small":true}');
      assert.match(await p.evaluate(() => window.__j), /^200 null/);
      assert.equal(await p.evaluate(() => window.__big), 800000);
      assert.ok(g.stats().bytes < 500000 + 14 + 500000 + 800000 + 5000, 'bytes ' + g.stats().bytes);
      await ctx.close();
    }
  });

  test('N-4: a redirected page load ends on the final URL, so relative links use the final host; fetched and counted once', async () => {
    hits = {};
    const { ctx, g } = await newGuarded({ mode: 'block', hosts: ['127.0.0.1', 'localhost'] });
    const p = await ctx.newPage(); await p.goto(`${A()}/hop`);
    assert.equal(p.url(), `${L()}/landing.html`);
    assert.equal(await p.evaluate(() => window.__loc), `${L()}/landing.html`);
    assert.equal(await p.evaluate(() => document.images[0].src), `${L()}/rel.png`, 'the relative image resolves against the final host');
    assert.equal(hits['GET /hop'], 1); assert.equal(hits['GET /landing.html'], 1, 'the final page is not fetched a second time');
    const s = g.stats(); assert.equal(s.pageLoads, 1, 'the small redirect page is not a page load'); assert.equal(s.redirectPages, 1); assert.equal(s.gets, 2);
    /* a redirect loop: the guard follows 20 hops, then aborts the load; no redirect page, and Chromium never follows a hop itself */
    hits = {};
    await assert.rejects(p.goto(`${A()}/loop`)); await sleep(300);
    assert.equal(hits['GET /loop'], 21, 'hops ' + hits['GET /loop']); assert.equal(g.stats().redirectPages, 1); assert.equal(g.stats().redirectLimit, 1);
    assert.equal(g.stats().leaks, 0);
    await ctx.close();
  });

  test('N-7: a beacon or non-GET fetch stopped in a live page counts as a non-GET request; the log has no unload counter', async () => {
    hits = {};
    const { ctx, g } = await newGuarded({});
    const p = await ctx.newPage(); await p.goto(`${L()}/beacon-live.html`); await sleep(300);
    assert.equal(await p.evaluate(() => window.__b), true); assert.equal(await p.evaluate(() => window.__f), 'stopped');
    assert.equal(hits['POST /live-beacon'] || 0, 0); assert.equal(hits['POST /live-post'] || 0, 0);
    assert.equal(g.stats().nonGet, 2); assert.equal('unloadStopped' in g.stats(), false);
    await ctx.close(); await sleep(50);
    const line = fs.readFileSync(g.run.logFile, 'utf8'); assert.match(line, /2 non-GET requests aborted/); assert.doesNotMatch(line, /unload/);
  });
});
