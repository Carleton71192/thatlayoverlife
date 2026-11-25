'use strict';
/* Tests for tools/wf-guard.cjs and tools/wf-get.cjs. A stub server on this machine stands in for Webflow: pages come
   from http://localhost:<port> (not a Webflow host) and assets from http://127.0.0.1:<port>, which the tests pass as the
   Webflow host list. No request leaves the machine.
   Run: NODE_PATH=/opt/node22/lib/node_modules node --test tools/test/ */
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('fs'), os = require('os'), path = require('path'), http = require('http'), zlib = require('zlib'), { execFile } = require('child_process');
const W = require('../wf-guard.cjs'), G = require('../wf-get.cjs');

let chromium = null;
for (const m of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { chromium = require(m).chromium; break; } catch (e) { } }

const runCli = args => new Promise(res => execFile(process.execPath, args, { encoding: 'utf8' }, (e, stdout, stderr) => res({ status: e ? e.code : 0, stdout, stderr })));
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'wfg-'));
const day = new Date('2026-11-25T10:00:00Z');
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
const BIG = Buffer.alloc(300000, 97);
const HTMLGZ = zlib.gzipSync(Buffer.from('<html><body>' + 'hello stub page '.repeat(4000) + '</body></html>'));

/* ---------- stub server ---------- */
let server, port, hits = {};
const hit = (k) => { hits[k] = (hits[k] || 0) + 1; };
function page(p) {
  const A = `http://127.0.0.1:${port}`;
  if (p === '/page.html') return `<!doctype html><html><head><link rel="stylesheet" href="${A}/style.css"><script src="${A}/app.js"></script>
    <style>@font-face{font-family:X;src:url(${A}/f.woff2) format("woff2")} body{font-family:X}</style></head>
    <body>text<img src="${A}/img/a.png"><img src="${A}/img/b.jpg"><video src="${A}/v.mp4" autoplay muted></video>
    <script>window.__post = fetch('http://localhost:${port}/form', {method:'POST', body:'x=1'}).then(r=>r.status, e=>'blocked');
    window.__xhr = fetch('${A}/data.json').then(r=>r.text(), e=>'err');</script></body></html>`;
  if (p === '/big.html') return `<!doctype html><script src="${A}/big.js"></script><p>big</p>`;
  if (p === '/dup.html') return `<!doctype html><img src="${A}/img/d.png"><img src="${A}/img/d.png"><div style="background:url(${A}/img/d.png)">x</div>`;
  if (p === '/plain.html') return `<!doctype html><img src="${A}/img/a.png"><p>plain</p>`;
  return null;
}
test.before(async () => {
  server = http.createServer((req, res) => {
    const p = req.url.split('?')[0]; hit(req.method + ' ' + p);
    const h = page(p);
    if (h) { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(h); }
    if (/\.png$/.test(p) || /\.jpg$/.test(p)) { res.writeHead(200, { 'content-type': 'image/png', 'access-control-allow-origin': '*' }); return res.end(PNG); }
    if (p === '/f.woff2') { res.writeHead(200, { 'content-type': 'font/woff2', 'access-control-allow-origin': '*' }); return res.end(Buffer.alloc(500)); }
    if (p === '/v.mp4') { res.writeHead(200, { 'content-type': 'video/mp4' }); return res.end(Buffer.alloc(800)); }
    if (p === '/style.css') { res.writeHead(200, { 'content-type': 'text/css' }); return res.end('p{color:red}'.repeat(100)); }
    if (p === '/app.js') { res.writeHead(200, { 'content-type': 'application/javascript' }); return res.end('window.__app=1;' + '//pad\n'.repeat(200)); }
    if (p === '/big.js') { res.writeHead(200, { 'content-type': 'application/javascript' }); return res.end(BIG); }
    if (p === '/data.json') { res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' }); return res.end('{"ok":true}'); }
    if (p === '/gz.html') { res.writeHead(200, { 'content-type': 'text/html', 'content-encoding': 'gzip', 'content-length': HTMLGZ.length }); return res.end(HTMLGZ); }
    if (p === '/redir') { res.writeHead(302, { location: '/plain.html' }); return res.end(); }
    res.writeHead(404); res.end('no');
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r)); port = server.address().port;
});
test.after(() => server.close());

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
test('log parser: single days, ranges, the guard line format, ISO dates, GB and KB', () => {
  const d = s => new Date(s + 'T12:00:00Z');
  assert.equal(+W.dailyTotalMB(SAMPLE, d('2026-11-21')).toFixed(3), 25.4 + 57 + 0 + 10 + 5);
  assert.equal(+W.dailyTotalMB(SAMPLE, d('2026-11-22')).toFixed(3), 0 + 10 + 20 + 5);
  assert.equal(+W.dailyTotalMB(SAMPLE, d('2026-11-25')).toFixed(3), 5 + 4 + 1.25 + 2 + 0.3);
  assert.equal(W.dailyTotalMB(SAMPLE, d('2026-11-01')), 1500);
  assert.equal(W.dailyTotalMB(SAMPLE, d('2026-11-19')), 0);
  assert.equal(W.lineMBForDay('Budget: 250 MB a day', d('2026-11-25')), 0, 'header text is not a log line');
});
test('log parser reads the real handoff/BANDWIDTH-LOG.md without errors', () => {
  const f = path.join(__dirname, '..', '..', 'handoff', 'BANDWIDTH-LOG.md');
  const mb = W.readDailyTotalMB(f, new Date('2026-11-21T12:00:00Z'));
  assert.ok(mb >= 25.4 && mb < 250, String(mb));
});
test('appendLogLine adds a newline when the file lacks one and keeps one line', () => {
  const f = path.join(tmp(), 'log.md'); fs.writeFileSync(f, '# log');
  W.appendLogLine(f, '- 25 Nov, a: 1 MB (M)\nsecond'); assert.equal(fs.readFileSync(f, 'utf8'), '# log\n- 25 Nov, a: 1 MB (M) second\n');
});

/* ---------- runs and caps without a browser ---------- */
test('createRun: daily cap already reached throws before any traffic', () => {
  const f = path.join(tmp(), 'log.md'); fs.writeFileSync(f, '- 25 Nov, earlier: 250 MB (M)\n');
  assert.throws(() => W.createRun({ label: 'x', logFile: f, now: day }), e => e instanceof W.WfBudgetError && e.cap === 'day');
  assert.throws(() => W.createRun({ logFile: f }), /label/);
});
test('createRun: run cap and daily cap trip, write one STOPPED line, and call onTrip', () => {
  const f = path.join(tmp(), 'log.md'); fs.writeFileSync(f, '- 25 Nov, earlier: 249.5 MB (M)\n');
  let got = null; const r = W.createRun({ label: 'cap-test', logFile: f, now: day, onTrip: e => { got = e; } });
  r.add(400e3); assert.equal(got, null); r.add(200e3);
  assert.ok(got instanceof W.WfBudgetError); assert.equal(got.cap, 'day'); assert.throws(() => r.check(), W.WfBudgetError);
  const lines = fs.readFileSync(f, 'utf8').trim().split('\n'); assert.equal(lines.length, 2);
  assert.match(lines[1], /^- 25 Nov 10:00 UTC, cap-test: wf-guard block run, 0 page loads, 0 Webflow responses, 0\.60 MB from Webflow \(M\).*STOPPED at the daily cap$/);
  r.close(); assert.equal(fs.readFileSync(f, 'utf8').trim().split('\n').length, 2, 'close after a trip does not log twice');
  const g = path.join(tmp(), 'log.md'); let e2 = null;
  const r2 = W.createRun({ label: 'run-cap', logFile: g, now: day, runCapMB: 1, onTrip: e => { e2 = e; } });
  r2.add(999999); assert.equal(e2, null); r2.add(1); assert.equal(e2.cap, 'run');
  assert.match(fs.readFileSync(g, 'utf8'), /1\.00 MB from Webflow \(M\).*STOPPED at the run cap/);
  assert.equal(W.readDailyTotalMB(g, day), 1, 'the line it writes is read back by the parser');
});
test('host matcher: the Webflow hosts and nothing else', () => {
  for (const u of ['https://www.thatlayover.life/', 'https://thatlayover.life/x', 'https://that-layover-life.webflow.io/', 'https://cdn.prod.website-files.com/a.jpg', 'https://assets-global.website-files.com/b.woff2'])
    assert.ok(W.isWebflowUrl(u), u);
  for (const u of ['https://cdn.jsdelivr.net/gh/x', 'https://static.memberstack.com/x.js', 'https://notthatlayover.life/', 'https://website-files.com.evil.test/', 'data:image/png;base64,AA'])
    assert.ok(!W.isWebflowUrl(u), u);
});

test('default onTrip stops the process with an uncaught WfBudgetError after the log line; an unclosed run logs at exit', async () => {
  const dir = tmp(), f = path.join(dir, 'log.md'), mod = path.join(__dirname, '..', 'wf-guard.cjs');
  const a = await runCli(['-e', `const W=require(${JSON.stringify(mod)});const r=W.createRun({label:'crash',logFile:${JSON.stringify(f)},runCapMB:1});r.add(2e6);setTimeout(()=>console.log('still running'),500);`]);
  assert.notEqual(a.status, 0); assert.match(a.stderr, /WfBudgetError/); assert.doesNotMatch(a.stdout, /still running/);
  assert.match(fs.readFileSync(f, 'utf8'), /crash: .*2\.00 MB from Webflow \(M\).*STOPPED at the run cap/);
  const g = path.join(dir, 'log2.md');
  const b = await runCli(['-e', `const W=require(${JSON.stringify(mod)});const r=W.createRun({label:'no-close',logFile:${JSON.stringify(g)}});r.add(1234);`]);
  assert.equal(b.status, 0); assert.match(fs.readFileSync(g, 'utf8'), /no-close: wf-guard block run, .*0\.00 MB from Webflow/);
});

/* ---------- wf-get ---------- */
test('wf-get: counts wire bytes of compressed pages, saves decoded HTML, follows redirects, refuses media, logs one line', async () => {
  const dir = tmp(), f = path.join(dir, 'log.md');
  const A = `http://127.0.0.1:${port}`;
  const r = await G.wfGet([`${A}/gz.html`, `${A}/redir`, `${A}/img/a.png`, `${A}/missing`], { label: 'get-test', out: dir, logFile: f, hosts: ['127.0.0.1'], now: day, quiet: true });
  assert.equal(r.gets, 3);
  const gz = r.results[0]; assert.equal(gz.status, 200);
  assert.ok(gz.bytes >= HTMLGZ.length && gz.bytes < HTMLGZ.length + 400, `wire bytes ${gz.bytes} vs gzip ${HTMLGZ.length}`);
  assert.match(fs.readFileSync(path.join(dir, 'gz.html'), 'utf8'), /hello stub page/);
  assert.equal(r.results[1].status, 200); assert.match(fs.readFileSync(path.join(dir, 'redir.html'), 'utf8'), /plain/);
  assert.match(r.results[2].error, /refused/); assert.equal(hits['GET /img/a.png'] || 0, 0);
  assert.equal(r.results[3].status, 404);
  const log = fs.readFileSync(f, 'utf8').trim().split('\n'); assert.equal(log.length, 1);
  assert.match(log[0], /^- 25 Nov 10:00 UTC, get-test: wf-get plain GETs, 3 GETs \(1 not 200\), \d+\.\d\d MB from Webflow \(M\)$/);
});
test('wf-get: --max and the run cap stop before the next URL; non-Webflow URLs are not counted', async () => {
  const dir = tmp(), f = path.join(dir, 'log.md'); const A = `http://127.0.0.1:${port}`;
  const m = await G.wfGet([`${A}/plain.html`, `${A}/plain.html?b=1`, `${A}/plain.html?c=1`], { label: 'max', out: dir, logFile: f, hosts: ['127.0.0.1'], max: 2, now: day, quiet: true });
  assert.equal(m.gets, 2); assert.equal(m.stopped.cap, 'max');
  const c = await G.wfGet([`${A}/gz.html`, `${A}/plain.html`], { label: 'cap', out: dir, logFile: f, hosts: ['127.0.0.1'], runCapMB: 0.0001, now: day, quiet: true });
  assert.equal(c.gets, 1); assert.equal(c.stopped.cap, 'run'); assert.match(fs.readFileSync(f, 'utf8'), /STOPPED at the run cap/);
  const n = await G.wfGet([`http://localhost:${port}/plain.html`], { label: 'other', out: dir, logFile: f, hosts: ['127.0.0.1'], now: day, quiet: true });
  assert.equal(n.bytes, 0); assert.equal(n.gets, 1);
});
test('wf-get CLI: exit 3 when the day is already at the cap, 2 without a label', async () => {
  const dir = tmp(), f = path.join(dir, 'log.md'); const today = new Date();
  fs.writeFileSync(f, `- ${today.getUTCDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][today.getUTCMonth()]}, earlier: 260 MB (M)\n`);
  const cli = path.join(__dirname, '..', 'wf-get.cjs');
  const a = await runCli([cli, '--label', 'x', '--log', f, '--out', dir, `http://127.0.0.1:${port}/plain.html`]);
  assert.equal(a.status, 3, a.stderr); assert.match(a.stderr, /daily total/);
  const b = await runCli([cli, `http://127.0.0.1:${port}/plain.html`]); assert.equal(b.status, 2);
});

/* ---------- the guard in a real Chromium ---------- */
const skip = chromium ? false : 'playwright not found (set NODE_PATH=/opt/node22/lib/node_modules)';
let browser;
test.describe('guard in Chromium', { skip }, () => {
  test.before(async () => { browser = await chromium.launch({ args: ['--no-sandbox'] }); });
  test.after(async () => { if (browser) await browser.close(); });

  test('block mode: media aborted, non-GET aborted, scripts and styles counted, one log line on close', async () => {
    hits = {}; const f = path.join(tmp(), 'log.md');
    const ctx = await browser.newContext();
    const g = W.guard(ctx, { label: 'block-test', hosts: ['127.0.0.1'], logFile: f, now: day, onTrip: 'close' });
    await g.ready;
    const p = await ctx.newPage();
    await p.goto(`http://localhost:${port}/page.html`, { waitUntil: 'load' });
    assert.equal(await p.evaluate(() => window.__post), 'blocked');
    assert.equal(await p.evaluate(() => window.__xhr), '{"ok":true}');
    assert.equal(await p.evaluate(() => window.__app), 1);
    await p.waitForTimeout(300);
    for (const k of ['GET /img/a.png', 'GET /img/b.jpg', 'GET /f.woff2', 'GET /v.mp4', 'POST /form']) assert.equal(hits[k] || 0, 0, k);
    assert.equal(hits['GET /app.js'], 1); assert.equal(hits['GET /style.css'], 1);
    const s = g.stats();
    assert.equal(s.pageLoads, 1); assert.equal(s.nonGet, 1); assert.ok(s.blocked >= 3, 'blocked ' + s.blocked);
    assert.equal(s.responses, 3, 'app.js, style.css, data.json');
    const min = 1200 + 1215 + 11; assert.ok(s.bytes >= min && s.bytes < min + 3000, 'bytes ' + s.bytes);
    await ctx.close(); await new Promise(r => setTimeout(r, 50));
    const log = fs.readFileSync(f, 'utf8').trim().split('\n'); assert.equal(log.length, 1);
    assert.match(log[0], /^- 25 Nov 10:00 UTC, block-test: wf-guard block run, 1 page loads, 3 Webflow responses, 0\.0\d MB from Webflow \(M\); aborted \d+ Webflow images, video or fonts and 1 non-GET requests$/);
  });

  test("the caller's own routes: continue() still meets the guard, fulfill() is not counted, fetch() of media is refused", async () => {
    hits = {}; const f = path.join(tmp(), 'log.md');
    const ctx = await browser.newContext();
    const g = W.guard(ctx, { label: 'wrap-test', hosts: ['127.0.0.1'], logFile: f, now: day, onTrip: 'close' });
    const p = await ctx.newPage();
    let fetchErr = null;
    await p.route('**/img/a.png', route => route.continue());
    await ctx.route('**/app.js', route => route.fulfill({ status: 200, contentType: 'application/javascript', body: 'window.__app=2' }));
    await p.route('**/img/b.jpg', async route => { try { await route.fetch(); } catch (e) { fetchErr = e.message; } return route.abort(); });
    await p.goto(`http://localhost:${port}/page.html`);
    await p.waitForTimeout(300);
    assert.equal(hits['GET /img/a.png'] || 0, 0); assert.equal(hits['GET /img/b.jpg'] || 0, 0); assert.equal(hits['GET /app.js'] || 0, 0);
    assert.equal(await p.evaluate(() => window.__app), 2);
    assert.match(fetchErr, /refused a Webflow media fetch/);
    assert.equal(g.stats().responses, 2, 'style.css and data.json only');
    await g.close(); await ctx.close();
  });

  test('cache mode: each media URL goes to the network once ever, later loads come from the cache folder', async () => {
    hits = {}; const dir = tmp(), cacheDir = path.join(dir, 'assets'), f = path.join(dir, 'log.md');
    for (let i = 0; i < 2; i++) {
      const ctx = await browser.newContext();
      W.guard(ctx, { label: 'cache-test', mode: 'cache', cacheDir, hosts: ['127.0.0.1'], logFile: f, now: day, onTrip: 'close' });
      const p = await ctx.newPage(); await p.goto(`http://localhost:${port}/plain.html`);
      assert.ok(await p.evaluate(() => document.images[0].complete && document.images[0].naturalWidth === 1));
      await ctx.close();
    }
    assert.equal(hits['GET /img/a.png'], 1);
    const lines = fs.readFileSync(f, 'utf8').trim().split('\n'); assert.equal(lines.length, 2);
    assert.match(lines[0], /cache 0 hits, 1 first fetches, 0 refused/); assert.match(lines[1], /cache 1 hits, 0 first fetches, 0 refused/);
    assert.match(lines[1], / 0\.00 MB from Webflow/);
    /* a URL listed as fetched but with no cached file (its first fetch failed) is never fetched again */
    fs.rmSync(cacheDir, { recursive: true }); fs.mkdirSync(cacheDir);
    fs.writeFileSync(path.join(cacheDir, 'wf-guard-fetched.txt'), `x http://127.0.0.1:${port}/img/a.png 2026-11-25\n`);
    const ctx = await browser.newContext();
    const g = W.guard(ctx, { label: 'cache-refuse', mode: 'cache', cacheDir, hosts: ['127.0.0.1'], logFile: f, now: day, onTrip: 'close' });
    const p = await ctx.newPage(); await p.goto(`http://localhost:${port}/plain.html`);
    assert.equal(hits['GET /img/a.png'], 1); assert.equal(g.stats().cacheRefused, 1);
    await ctx.close();
  });

  test('cache mode: the same URL three times on one page goes to the network once', async () => {
    hits = {}; const dir = tmp();
    const ctx = await browser.newContext();
    const g = W.guard(ctx, { label: 'dup', mode: 'cache', cacheDir: path.join(dir, 'a'), hosts: ['127.0.0.1'], logFile: path.join(dir, 'log.md'), now: day, onTrip: 'close' });
    const p = await ctx.newPage(); await p.goto(`http://localhost:${port}/dup.html`); await p.waitForTimeout(200);
    assert.equal(hits['GET /img/d.png'], 1); assert.equal(g.stats().cacheFetches, 1); assert.equal(g.stats().cacheRefused, 0);
    await ctx.close();
  });

  test('run cap: the run stops, the context closes, onTrip gets a WfBudgetError and the log says STOPPED', async () => {
    const f = path.join(tmp(), 'log.md'); let err = null;
    const ctx = await browser.newContext();
    const g = W.guard(ctx, { label: 'trip-test', hosts: ['127.0.0.1'], logFile: f, now: day, runCapMB: 0.1, onTrip: e => { err = e; } });
    const p = await ctx.newPage();
    await p.goto(`http://localhost:${port}/big.html`).catch(() => { });
    for (let i = 0; i < 50 && !err; i++) await new Promise(r => setTimeout(r, 50));
    assert.ok(err instanceof W.WfBudgetError); assert.equal(err.cap, 'run');
    assert.throws(() => g.check(), W.WfBudgetError);
    await assert.rejects(p.goto(`http://localhost:${port}/plain.html`));
    assert.match(fs.readFileSync(f, 'utf8'), /trip-test: .*0\.30 MB from Webflow \(M\).*STOPPED at the run cap/);
  });

  test('shared run: two contexts, one tally, one line on run.close(); a page target works too', async () => {
    const f = path.join(tmp(), 'log.md');
    const run = W.createRun({ label: 'shared', logFile: f, now: day, onTrip: 'close' });
    for (let i = 0; i < 2; i++) {
      const ctx = await browser.newContext(); const p = await ctx.newPage();
      W.guard(p, { run, hosts: ['127.0.0.1'] });
      await p.goto(`http://localhost:${port}/redir`);
      await ctx.close();
    }
    assert.equal(fs.existsSync(f), false, 'no line until the run closes');
    run.close();
    assert.match(fs.readFileSync(f, 'utf8'), /^- 25 Nov 10:00 UTC, shared: wf-guard block run, 2 page loads, 0 Webflow responses, 0\.00 MB from Webflow \(M\); aborted 2 Webflow images/);
  });

  test('guard refuses a second guard on one context and a context over the daily cap', async () => {
    const f = path.join(tmp(), 'log.md'); fs.writeFileSync(f, '- 25 Nov, earlier: 251 MB (M)\n');
    const ctx = await browser.newContext();
    assert.throws(() => W.guard(ctx, { label: 'over', logFile: f, now: day }), W.WfBudgetError);
    W.guard(ctx, { label: 'ok', logFile: path.join(tmp(), 'l.md'), now: day, onTrip: 'close' });
    assert.throws(() => W.guard(ctx, { label: 'again', logFile: path.join(tmp(), 'l.md'), now: day }), /already guarded/);
    await ctx.close();
  });
});
