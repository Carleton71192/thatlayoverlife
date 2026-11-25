'use strict';
/* wf-guard: Webflow bandwidth guard for Playwright harnesses.
   Rules: reports/bandwidth-2026-11-13.md section 4 (rules 1 to 6) and reports/bandwidth-2026-11-25.md fix 1.
   Usage (details in tools/WF-GUARD.md):
     const { guard } = require('./tools/wf-guard.cjs');
     const g = guard(context, { label: 'my-check', mode: 'block' });   // before any route of your own
     ... run the check ...
     await context.close();                                            // appends one line to handoff/BANDWIDTH-LOG.md
   What it does:
     (a) images, video and fonts from Webflow hosts are aborted (mode 'block'), or served from a local cache folder
         (mode 'cache'), where each URL is fetched from the network at most once ever;
     (b) every byte received from Webflow hosts is counted (wire bytes for browser requests, body plus headers for fetches);
     (c) the run stops (throws) at 200 MB, or when the day's total in handoff/BANDWIDTH-LOG.md plus this run reaches 250 MB;
     (d) every non-GET request to any host is aborted;
     (e) on close one line is appended to handoff/BANDWIDTH-LOG.md.
   No dependency: the caller passes its own Playwright context or page. 1 MB here is 1,000,000 bytes. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const MB = 1e6;
const RUN_CAP_MB = 200, DAY_CAP_MB = 250;
const DEFAULT_LOG = path.join(__dirname, '..', 'handoff', 'BANDWIDTH-LOG.md');
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WF_HOSTS = [/^(www\.)?thatlayover\.life$/i, /(^|\.)webflow\.io$/i, /(^|\.)website-files\.com$/i];
const MEDIA_TYPES = new Set(['image', 'media', 'font']);
const MEDIA_EXT = /\.(avif|bmp|gif|ico|jpe?g|png|svg|tiff?|webp|m4a|m4v|mov|mp3|mp4|ogg|ogv|wav|webm|eot|otf|ttf|woff2?)$/i;
const DROP = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'keep-alive', 'alt-svc', 'set-cookie', 'report-to', 'nel']);

class WfBudgetError extends Error { constructor(msg, info) { super(msg); this.name = 'WfBudgetError'; Object.assign(this, info || {}); } }

const sha1 = s => crypto.createHash('sha1').update(s).digest('hex');
const logPath = o => (o && o.logFile) || process.env.WF_GUARD_LOG || DEFAULT_LOG;

function hostMatcher(hosts) {
  const list = hosts ? [].concat(hosts) : WF_HOSTS;
  return url => {
    let h; try { h = new URL(url).hostname; } catch (e) { return false; }
    return list.some(x => (x instanceof RegExp ? x.test(h) : String(x).toLowerCase() === h.toLowerCase()));
  };
}
const isWebflowUrl = hostMatcher();

function isMediaRequest(req) {
  let p = ''; try { p = new URL(req.url()).pathname; } catch (e) { }
  return MEDIA_TYPES.has(req.resourceType()) || MEDIA_EXT.test(p);
}

/* ---------- the shared log ---------- */

/* Webflow MB a log line counts for the given UTC day (Date), or 0. A line counts for each day its leading date or
   date range covers ("25 Nov", "21 to 22 Nov", "20 Oct to 19 Nov", "2026-11-25"). Lines written by this tool are read
   by their "X MB from Webflow (M)" figure; any other line by the sum of its MB, KB and GB figures, taking the upper
   end of a range ("5 to 57 MB" is 57). Counting a multi-day line in full on each day errs on the safe side. */
function lineMBForDay(line, day) {
  if (!/^\s*-\s/.test(line)) return 0;
  const y = day.getUTCFullYear(), key = Date.UTC(y, day.getUTCMonth(), day.getUTCDate());
  let start, end;
  const iso = /^\s*-\s+(\d{4})-(\d\d)-(\d\d)\b/.exec(line);
  if (iso) start = end = Date.UTC(+iso[1], +iso[2] - 1, +iso[3]);
  else {
    const m = /^\s*-\s+(\d{1,2})(?:\s+([A-Z][a-z]{2}))?(?:\s+to\s+(\d{1,2}))?\s+([A-Z][a-z]{2})\b/.exec(line);
    if (!m) return 0;
    const m2 = MON.indexOf(m[4]), m1 = m[2] ? MON.indexOf(m[2]) : m2;
    if (m1 < 0 || m2 < 0) return 0;
    start = Date.UTC(y, m1, +m[1]); end = Date.UTC(y, m2, m[3] ? +m[3] : +m[1]);
  }
  if (key < start || key > end) return 0;
  const own = /(\d[\d,]*(?:\.\d+)?) MB from Webflow \(M\)/.exec(line);
  if (own) return +own[1].replace(/,/g, '');
  let mb = 0; const re = /(\d[\d,]*(?:\.\d+)?)(?:\s+to\s+(\d[\d,]*(?:\.\d+)?))?\s*(KB|MB|GB)\b/g; let x;
  while ((x = re.exec(line))) { const v = +(x[2] || x[1]).replace(/,/g, ''); mb += x[3] === 'GB' ? v * 1000 : x[3] === 'KB' ? v / 1000 : v; }
  return mb;
}
function dailyTotalMB(text, day) { return String(text).split('\n').reduce((s, l) => s + lineMBForDay(l, day), 0); }
function readDailyTotalMB(file, day) {
  let t = ''; try { t = fs.readFileSync(file || logPath(), 'utf8'); } catch (e) { return 0; }
  return dailyTotalMB(t, day || new Date());
}
function appendLogLine(file, line) {
  file = file || logPath();
  let pre = ''; try { const t = fs.readFileSync(file, 'utf8'); if (t.length && !t.endsWith('\n')) pre = '\n'; } catch (e) { }
  fs.appendFileSync(file, pre + line.replace(/[\r\n]+/g, ' ') + '\n');
}

/* ---------- runs (one log line each) ---------- */

const openRuns = new Set();
let exitHook = false;

/* A run holds the byte tally, the caps and the log line. guard() makes one per context unless given opts.run;
   wf-get makes one per command. */
function createRun(opts) {
  opts = opts || {};
  if (!opts.label) throw new Error('wf-guard: opts.label is required (a short task name, no personal names)');
  const now = opts.now ? () => new Date(opts.now) : () => new Date();
  const run = {
    label: String(opts.label).replace(/[\r\n]+/g, ' ').trim(), kind: opts.kind || 'wf-guard', mode: opts.mode || 'block',
    logFile: logPath(opts), runCap: (opts.runCapMB != null ? opts.runCapMB : RUN_CAP_MB) * MB,
    dayCap: (opts.dayCapMB != null ? opts.dayCapMB : DAY_CAP_MB) * MB, onTrip: opts.onTrip || 'throw', noLog: !!opts.noLog,
    startedAt: now(), bytes: 0, responses: 0, pageLoads: 0, gets: 0, non200: 0, blocked: 0, nonGet: 0,
    cacheHits: 0, cacheFetches: 0, cacheRefused: 0, error: null, closed: false, contexts: new Set(), pending: new Set(),
  };
  let dayBase = readDailyTotalMB(run.logFile, run.startedAt) * MB, dayRead = Date.now();
  run.dayBaseBytes = () => dayBase;
  const refreshDay = () => { if (Date.now() - dayRead > 10000) { dayBase = readDailyTotalMB(run.logFile, run.startedAt) * MB; dayRead = Date.now(); } };
  if (dayBase >= run.dayCap) throw new WfBudgetError(`wf-guard: the daily total for ${fmtDay(run.startedAt)} in ${run.logFile} is already ${(dayBase / MB).toFixed(2)} MB (cap ${run.dayCap / MB} MB); not starting ${run.label}`, { cap: 'day' });

  run.trip = (cap) => {
    if (run.error) return;
    const msg = cap === 'run'
      ? `wf-guard: ${run.label} reached ${(run.bytes / MB).toFixed(2)} MB from Webflow, the run cap is ${run.runCap / MB} MB; run stopped`
      : `wf-guard: ${run.label} brought the ${fmtDay(run.startedAt)} total to ${((dayBase + run.bytes) / MB).toFixed(2)} MB, the daily cap is ${run.dayCap / MB} MB; run stopped`;
    run.error = new WfBudgetError(msg, { cap, bytes: run.bytes });
    run.close();
    for (const c of run.contexts) c.close().catch(() => { });
    if (typeof run.onTrip === 'function') run.onTrip(run.error);
    else if (run.onTrip === 'throw') { const e = run.error; process.nextTick(() => { throw e; }); }
  };
  run.add = (bytes) => {
    run.bytes += Math.max(0, +bytes || 0); refreshDay();
    if (run.bytes >= run.runCap) run.trip('run');
    else if (dayBase + run.bytes >= run.dayCap) run.trip('day');
  };
  run.check = () => { if (run.error) throw run.error; };
  run.line = () => logLine(run);
  /* writes the log line once; async form waits for byte counts still in flight */
  run.close = () => {
    if (run.closed) return; run.closed = true; openRuns.delete(run);
    if (!run.noLog) appendLogLine(run.logFile, run.line());
  };
  run.closeAsync = async () => { await Promise.allSettled([...run.pending]); run.close(); };
  openRuns.add(run);
  if (!exitHook) { exitHook = true; process.on('exit', () => { for (const r of [...openRuns]) { try { r.close(); } catch (e) { } } }); }
  return run;
}

function fmtDay(d) { return `${d.getUTCDate()} ${MON[d.getUTCMonth()]}`; }
function logLine(r) {
  const d = r.startedAt, t = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  const mb = (r.bytes / MB).toFixed(2);
  let s = `- ${fmtDay(d)} ${t} UTC, ${r.label}: `;
  if (r.kind === 'wf-get') s += `wf-get plain GETs, ${r.gets} GETs (${r.non200} not 200), ${mb} MB from Webflow (M)`;
  else {
    s += `wf-guard ${r.mode} run, ${r.pageLoads} page loads, ${r.responses} Webflow responses, ${mb} MB from Webflow (M); aborted ${r.blocked} Webflow images, video or fonts and ${r.nonGet} non-GET requests`;
    if (r.mode === 'cache') s += `; cache ${r.cacheHits} hits, ${r.cacheFetches} first fetches, ${r.cacheRefused} refused`;
  }
  if (r.error) s += `; STOPPED at the ${r.error.cap === 'run' ? 'run' : 'daily'} cap`;
  return s;
}

/* ---------- the local asset cache (same layout as scratchpad nov21/sweep-cache/assets) ---------- */

/* <dir>/<sha1(url)>.b holds the body, <dir>/<sha1(url)>.json {u, status, headers}. <dir>/wf-guard-fetched.txt lists every
   URL this tool ever sent to the network (written before the fetch), and an asset-index.txt next to <dir> (the sweep
   cache's list) counts as fetched too, so a URL is never fetched twice even when its first fetch failed. */
function makeCache(dir) {
  if (!dir) throw new Error("wf-guard: mode 'cache' needs opts.cacheDir (or WF_GUARD_CACHE)");
  fs.mkdirSync(dir, { recursive: true });
  const listFile = path.join(dir, 'wf-guard-fetched.txt');
  const ever = new Set();
  for (const f of [listFile, path.join(dir, '..', 'asset-index.txt')]) {
    try { for (const l of fs.readFileSync(f, 'utf8').split('\n')) { const u = l.split(' ')[1]; if (u) ever.add(u); } } catch (e) { }
  }
  const k = u => path.join(dir, sha1(u));
  return {
    get(u) {
      try {
        const m = JSON.parse(fs.readFileSync(k(u) + '.json', 'utf8')); const headers = {};
        for (const x in m.headers || {}) if (!DROP.has(x.toLowerCase())) headers[x.toLowerCase()] = String(m.headers[x]);
        return { status: m.status, headers, body: fs.readFileSync(k(u) + '.b') };
      } catch (e) { return null; }
    },
    fetchedBefore: u => ever.has(u),
    mark(u) { ever.add(u); fs.appendFileSync(listFile, `${sha1(u)} ${u} ${new Date().toISOString()}\n`); },
    put(u, status, headers, body) {
      const hd = {}; for (const x in headers) if (!DROP.has(x.toLowerCase())) hd[x] = headers[x];
      fs.writeFileSync(k(u) + '.b', body); fs.writeFileSync(k(u) + '.json', JSON.stringify({ u, status, headers: hd }));
    },
  };
}

const headerBytes = h => Object.entries(h || {}).reduce((s, [a, b]) => s + a.length + String(b).length + 4, 0);

/* ---------- guard ---------- */

const PATCHED = Symbol('wfGuardPatched');

/* guard(contextOrPage, opts) -> handle
   opts: label (required), mode 'block' (default) or 'cache', cacheDir (mode 'cache'), run (share one tally and one log
   line across several contexts; see createRun), logFile, runCapMB (200), dayCapMB (250), hosts (strings or RegExps that
   replace the Webflow host list; tests only), onTrip ('throw' default: log line, contexts closed, then an uncaught
   WfBudgetError stops the process; 'close': log line and contexts closed only; or a function(err)), now (tests).
   Call it before registering any route of your own. Your own route handlers then get a route whose continue() passes
   on to the guard (it acts as fallback()) and whose fetch() is counted and refused for non-GET or blocked media. */
function guard(target, opts) {
  opts = opts || {};
  const isPage = target && typeof target.mainFrame === 'function';
  const context = isPage ? target.context() : target;
  if (!context || typeof context.route !== 'function') throw new Error('wf-guard: pass a Playwright BrowserContext or Page');
  if (context[PATCHED]) throw new Error('wf-guard: this context is already guarded');
  const mode = opts.mode || 'block';
  if (mode !== 'block' && mode !== 'cache') throw new Error("wf-guard: mode must be 'block' or 'cache'");
  const own = !opts.run;
  const run = opts.run || createRun(Object.assign({}, opts, { mode }));
  const isWf = hostMatcher(opts.hosts);
  const cache = mode === 'cache' ? makeCache(opts.cacheDir || process.env.WF_GUARD_CACHE) : null;
  const passed = new WeakSet(), inflight = new Map();
  run.contexts.add(context);
  const track = p => { run.pending.add(p); p.finally(() => run.pending.delete(p)); return p; };

  async function fromCache(route, req) {
    const u = req.url();
    let hit = cache.get(u);
    if (!hit && inflight.has(u)) { await inflight.get(u).catch(() => { }); hit = cache.get(u); }
    if (hit) { run.cacheHits++; return route.fulfill({ status: hit.status, headers: hit.headers, body: hit.body }); }
    if (cache.fetchedBefore(u) || run.error) { run.cacheRefused++; return route.abort('blockedbyclient'); }
    cache.mark(u);
    const p = (async () => {
      const headers = Object.assign({}, req.headers()); delete headers.range;
      const resp = await route.fetch({ headers });
      const body = await resp.body();
      run.responses++; run.cacheFetches++;
      cache.put(u, resp.status(), resp.headers(), body);
      run.add(body.length + headerBytes(resp.headers()));
    })();
    inflight.set(u, track(p));
    try { await p; } catch (e) { return route.abort('failed'); } finally { inflight.delete(u); }
    const got = cache.get(u);
    if (!got || run.error) return route.abort('blockedbyclient');
    return route.fulfill({ status: got.status, headers: got.headers, body: got.body });
  }

  /* the guard's own handler: registered first, so it runs after every route of the caller */
  async function handler(route) {
    const req = route.request(), u = req.url();
    try {
      if (req.method() !== 'GET') { run.nonGet++; return await route.abort('blockedbyclient'); }
      if (!isWf(u)) return await route.continue();
      if (run.error) return await route.abort('blockedbyclient');
      if (isMediaRequest(req)) {
        if (!cache) { run.blocked++; return await route.abort('blockedbyclient'); }
        return await fromCache(route, req);
      }
      passed.add(req);
      return await route.continue();
    } catch (e) { /* the page or context closed while routing */ }
  }

  /* routes registered by the caller after guard(): continue() becomes fallback() so the guard always has the last word */
  function wrapRoute(route) {
    return new Proxy(route, {
      get(t, k) {
        if (k === 'continue') return o => t.fallback(o);
        if (k === 'fetch') return o => guardedFetch(t, o);
        const v = t[k]; return typeof v === 'function' ? v.bind(t) : v;
      },
    });
  }
  async function guardedFetch(route, o) {
    const req = route.request(), u = (o && o.url) || req.url(), method = ((o && o.method) || req.method()).toUpperCase();
    if (method !== 'GET') { run.nonGet++; throw new Error(`wf-guard: refused a ${method} fetch of ${u}`); }
    if (!isWf(u)) return route.fetch(o);
    run.check();
    const media = isMediaRequest(req) || MEDIA_EXT.test(new URL(u).pathname);
    if (media && !cache) { run.blocked++; throw new Error(`wf-guard: refused a Webflow media fetch in mode block: ${u}`); }
    if (media && cache) { if (cache.fetchedBefore(u)) { run.cacheRefused++; throw new Error(`wf-guard: ${u} was fetched once already`); } cache.mark(u); }
    const p = track((async () => {
      const resp = await route.fetch(o); const body = await resp.body();
      run.responses++; if (media) { run.cacheFetches++; cache.put(u, resp.status(), resp.headers(), body); }
      run.add(body.length + headerBytes(resp.headers()));
      return resp;
    })());
    return p;
  }
  const wraps = new WeakMap();
  const wrapHandler = h => { if (typeof h !== 'function') return h; if (!wraps.has(h)) wraps.set(h, (route, request) => h(wrapRoute(route), request)); return wraps.get(h); };
  function patch(obj) {
    if (obj[PATCHED]) return; obj[PATCHED] = true;
    const r = obj.route.bind(obj), ur = obj.unroute.bind(obj);
    obj.route = (url, h, o) => r(url, wrapHandler(h), o);
    obj.unroute = (url, h) => ur(url, h ? (wraps.get(h) || h) : h);
  }

  const ready = context.route('**/*', handler);
  patch(context);
  for (const p of context.pages()) patch(p);
  context.on('page', patch);

  context.on('request', req => {
    try { if (req.isNavigationRequest() && !req.redirectedFrom() && !req.frame().parentFrame()) run.pageLoads++; } catch (e) { }
  });
  const passedChain = req => { for (let r = req; r; r = r.redirectedFrom()) if (passed.has(r)) return true; return false; };
  const count = req => {
    if (!passedChain(req)) return;
    track((async () => {
      let n = 0;
      try { const s = await req.sizes(); n = s.responseBodySize + s.responseHeadersSize; }
      catch (e) { try { const r = await req.response(); n = r ? +(r.headers()['content-length'] || 0) + headerBytes(r.headers()) : 0; } catch (e2) { } }
      run.responses++; run.add(n);
    })());
  };
  context.on('requestfinished', count);
  context.on('requestfailed', req => { if (passedChain(req)) run.responses++; });

  const handle = {
    run, ready, context,
    stats: () => ({ label: run.label, mode: run.mode, bytes: run.bytes, mb: +(run.bytes / MB).toFixed(3), pageLoads: run.pageLoads, responses: run.responses,
      blocked: run.blocked, nonGet: run.nonGet, cacheHits: run.cacheHits, cacheFetches: run.cacheFetches, cacheRefused: run.cacheRefused,
      dayBaseMB: +(run.dayBaseBytes() / MB).toFixed(3), stopped: run.error ? run.error.cap : null }),
    check: () => run.check(),
    /* writes the log line (own run only) after byte counts in flight are done; closing the context or page does the same */
    close: async () => { run.contexts.delete(context); if (own) await run.closeAsync(); },
  };
  const onClose = () => { handle.close().catch(() => { }); };
  (isPage ? target : context).once('close', onClose);
  if (isPage) context.once('close', onClose);
  return handle;
}

module.exports = { guard, createRun, WfBudgetError, isWebflowUrl, hostMatcher, isMediaRequest, dailyTotalMB, readDailyTotalMB, lineMBForDay, appendLogLine, logLine, makeCache, RUN_CAP_MB, DAY_CAP_MB, DEFAULT_LOG };

/* node tools/wf-guard.cjs day [YYYY-MM-DD]  prints that UTC day's total from the log */
if (require.main === module) {
  const [cmd, d] = process.argv.slice(2);
  if (cmd === 'day') {
    const day = d ? new Date(d + 'T12:00:00Z') : new Date();
    const mb = readDailyTotalMB(logPath(), day);
    console.log(`${fmtDay(day)}: ${mb.toFixed(2)} MB from Webflow in ${logPath()} (daily cap ${DAY_CAP_MB} MB)`);
  } else { console.log('usage: node tools/wf-guard.cjs day [YYYY-MM-DD]   (the guard itself is a module; see tools/WF-GUARD.md)'); }
}
