'use strict';
/* wf-guard: Webflow bandwidth guard for Playwright harnesses.
   Rules: reports/bandwidth-2026-11-13.md section 4 (rules 1 to 6), reports/bandwidth-2026-11-25.md fix 1, and the fixes in
   reports/evidence/bw-guard-2026-11-25/check.md and reports/evidence/keep-going-2026-11-25/review.md (G1, G2, G4).
   Usage (details in tools/WF-GUARD.md):
     const { guard } = require('./tools/wf-guard.cjs');
     const g = guard(context, { label: 'my-check', cacheDir });   // mode 'cache-only' is the default
     await g.ready;
     ... run the check ...
     await context.close();                                        // appends one line to handoff/BANDWIDTH-LOG.md
   What it does:
     (a) The browser never talks to a Webflow host itself. Every Webflow GET reaches the guard's own route, which has the
         last word after all routes of the caller. Mode 'cache-only' (default) serves it from a local cache folder and aborts
         a miss. Mode 'fetch-once' fetches a miss once with curl, stores it, and never fetches that URL again, across
         contexts and processes. Mode 'block' aborts images, video and fonts and fetches the rest with curl every time.
     (b) Every byte of those fetches is counted on the wire. Each fetch is capped by --max-filesize at what is left of the
         budget, so a run cannot go over a cap during one response.
     (c) The run stops at 200 MB, or when the UTC day's total reaches 250 MB. The day's total is the shared log in the main
         checkout, the log of this checkout and a running tally kept under a lock file next to the git repository, so two
         runs at once cannot both pass the cap.
     (d) Every non-GET request to any host is aborted. An init script stops sendBeacon and non-GET fetch() to Webflow hosts
         (or to any host) in the page itself, which covers requests sent at page unload. context.request and page.request
         are wrapped the same way.
     (e) On close one line is appended to handoff/BANDWIDTH-LOG.md.
   No dependency: the caller passes its own Playwright context or page, and curl must be on the PATH. 1 MB is 1,000,000 bytes. */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), os = require('os'), { spawn } = require('child_process');

const MB = 1e6;
const RUN_CAP_MB = 200, DAY_CAP_MB = 250, GET_CAP_MB = 5;
const HEADER_ALLOWANCE = 16384;
const REPO_ROOT = path.resolve(__dirname, '..');
const DEFAULT_LOG = path.join(REPO_ROOT, 'handoff', 'BANDWIDTH-LOG.md');
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/* the Webflow hosts: the site and its subdomains, webflow.io, webflow.com and website-files.com with all subdomains */
const WF_HOSTS = [/(^|\.)thatlayover\.life$/i, /(^|\.)webflow\.io$/i, /(^|\.)webflow\.com$/i, /(^|\.)website-files\.com$/i];
const EXT = {
  image: /\.(avif|bmp|gif|heic|ico|jpe?g|png|svg|tiff?|webp)$/i,
  video: /\.(aac|flac|m3u8|m4a|m4v|mov|mp3|mp4|oga|ogg|ogv|wav|webm)$/i,
  font: /\.(eot|otf|ttf|woff2?)$/i,
};
const DROP = new Set(['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'keep-alive', 'alt-svc', 'set-cookie', 'report-to', 'nel', 'strict-transport-security']);

class WfBudgetError extends Error { constructor(msg, info) { super(msg); this.name = 'WfBudgetError'; Object.assign(this, info || {}); } }
class WfLogFormatError extends Error { constructor(msg, info) { super(msg); this.name = 'WfLogFormatError'; Object.assign(this, info || {}); } }

const sha1 = s => crypto.createHash('sha1').update(s).digest('hex');

/* ---------- where things live ---------- */

/* The git directory shared by every worktree of this repository (<main checkout>/.git), or null outside git. */
function gitCommonDir(root) {
  const g = path.join(root, '.git');
  try {
    if (fs.statSync(g).isDirectory()) return g;
    const m = /^gitdir:\s*(.+?)\s*$/m.exec(fs.readFileSync(g, 'utf8'));
    if (!m) return null;
    const gd = path.resolve(root, m[1]);
    try { return path.resolve(gd, fs.readFileSync(path.join(gd, 'commondir'), 'utf8').trim()); } catch (e) { return gd; }
  } catch (e) { return null; }
}
const COMMON_DIR = gitCommonDir(REPO_ROOT);
const MAIN_ROOT = COMMON_DIR && path.basename(COMMON_DIR) === '.git' ? path.dirname(COMMON_DIR) : REPO_ROOT;
const MAIN_LOG = path.join(MAIN_ROOT, 'handoff', 'BANDWIDTH-LOG.md');
const STATE_DIR = COMMON_DIR ? path.join(COMMON_DIR, 'wf-guard') : path.join(os.tmpdir(), 'wf-guard');

const logPath = o => (o && o.logFile) || process.env.WF_GUARD_LOG || DEFAULT_LOG;
const stateDirOf = o => (o && o.stateDir) || process.env.WF_GUARD_STATE || STATE_DIR;
/* the logs read for the daily total: the shared log in the main checkout and the log this run writes to */
function readLogsOf(o) {
  if (o && o.readLogs) return [].concat(o.readLogs).map(f => path.resolve(f));
  const env = process.env.WF_GUARD_MAIN_LOG;
  const main = env === 'none' ? null : (env || MAIN_LOG);
  return [...new Set([logPath(o), main].filter(Boolean).map(f => path.resolve(f)))];
}

/* ---------- hosts and request classes ---------- */

const normHost = h => String(h || '').toLowerCase().replace(/\.+$/, '');
function hostMatcher(hosts) {
  const list = hosts ? [].concat(hosts) : WF_HOSTS;
  return url => {
    let h; try { h = normHost(new URL(url).hostname); } catch (e) { return false; }
    if (!h) return false;
    return list.some(x => (x instanceof RegExp ? x.test(h) : normHost(x) === h));
  };
}
const isWebflowUrl = hostMatcher();

function decodedPath(url) {
  let p = ''; try { p = new URL(url).pathname; } catch (e) { return ''; }
  try { p = decodeURIComponent(p); } catch (e) { }
  return p;
}
/* 'video' (video and audio), 'font', 'image' or 'doc' (HTML, CSS, JS, JSON and the rest) */
function classify(url, resourceType) {
  const p = decodedPath(url);
  if (resourceType === 'media' || EXT.video.test(p)) return 'video';
  if (resourceType === 'font' || EXT.font.test(p)) return 'font';
  if (resourceType === 'image' || EXT.image.test(p)) return 'image';
  return 'doc';
}
function classifyType(contentType) {
  const t = String(contentType || '').toLowerCase();
  if (/^(video|audio)\//.test(t)) return 'video';
  if (/^font\/|^application\/(x-)?font|woff/.test(t)) return 'font';
  if (/^image\//.test(t)) return 'image';
  return 'doc';
}
const isMediaRequest = req => classify(req.url(), req.resourceType()) !== 'doc';

/* wf-get's file name for a page: <path with / as __>.html, home.html for the root */
function fileFor(u) {
  const x = new URL(u); const p = x.pathname.replace(/\/+$/, '');
  let f = p ? p.replace(/^\//, '').replace(/\//g, '__') : 'home';
  if (x.search) f += '__q_' + x.search.slice(1).replace(/[^A-Za-z0-9=_.-]/g, '_');
  return f.replace(/[^A-Za-z0-9_.=-]/g, '_') + (/\.[a-z0-9]{2,5}$/i.test(f) ? '' : '.html');
}

/* ---------- the shared log ---------- */

const MON_RE = '(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';
const DASH = '(?:to|-|\u2013|\u2014|through|until)';
const monIdx = s => MON.findIndex(m => m.toLowerCase() === String(s).slice(0, 3).toLowerCase());
const DATE_PATTERNS = [
  /* 2026-11-25, 2026-11-25 to 2026-11-27 */
  [new RegExp(`^(\\d{4})-(\\d{1,2})-(\\d{1,2})(?:\\s*${DASH}\\s*(\\d{4})-(\\d{1,2})-(\\d{1,2}))?(?!\\d)`, 'i'),
    m => ({ d1: +m[3], m1: +m[2] - 1, y1: +m[1], d2: m[4] ? +m[6] : +m[3], m2: m[4] ? +m[5] - 1 : +m[2] - 1, y2: m[4] ? +m[4] : +m[1] })],
  /* 25-11-2026, 25/11/2026, 25.11.2026 */
  [/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})(?!\d)/, m => ({ d1: +m[1], m1: +m[2] - 1, y1: +m[3], d2: +m[1], m2: +m[2] - 1, y2: +m[3] })],
  /* 25 Nov, 25 November 2026, 21 to 22 Nov, 21-22 Nov, 20 Oct to 19 Nov, 28 Dec to 2 Jan */
  [new RegExp(`^(\\d{1,2})(?:\\s+${MON_RE}(?:\\s+(\\d{4}))?)?(?:\\s*${DASH}\\s*(\\d{1,2}))?\\s+${MON_RE}(?:,?\\s+(\\d{4}))?(?![a-z])`, 'i'),
    m => { const m2 = monIdx(m[5]); return { d1: +m[1], m1: m[2] ? monIdx(m[2]) : m2, y1: m[3] ? +m[3] : null, d2: m[4] ? +m[4] : +m[1], m2, y2: m[6] ? +m[6] : null }; }],
  /* Nov 25, November 25, 2026, Nov 25 to 27, Nov 30 to Dec 2 */
  [new RegExp(`^${MON_RE}\\s+(\\d{1,2})(?:,?\\s+(\\d{4}))?(?:\\s*${DASH}\\s*(?:${MON_RE}\\s+)?(\\d{1,2})(?:,?\\s+(\\d{4}))?)?(?!\\d)`, 'i'),
    m => { const m1 = monIdx(m[1]); return { d1: +m[2], m1, y1: m[3] ? +m[3] : null, d2: m[5] ? +m[5] : +m[2], m2: m[4] ? monIdx(m[4]) : m1, y2: m[6] ? +m[6] : (m[3] ? +m[3] : null) }; }],
];
const SIZE_RE = /(?<![\w.])(\d[\d,]*(?:\.\d+)?)(?:\s*(?:to|-|\u2013|\u2014)\s*(\d[\d,]*(?:\.\d+)?))?\s*(kib|mib|gib|kb|mb|gb|kilobytes?|megabytes?|gigabytes?)(?![a-z])/gi;
const RUN_ID_RE = /\brun ([0-9a-f]{6})\b/;

/* One log line -> null (not a bullet line, or no size figure in it) or { mb, covers(day), runId }.
   A bullet is "-", "*" or "+", indented or not. The size is the sum of every KB, MB and GB figure in the line, taking the upper
   end of a range ("5 to 57 MB" is 57). The date is read from the start of the line in any of the forms in DATE_PATTERNS.
   A bullet line with a size figure but no readable date throws WfLogFormatError: it is never counted as 0. */
function parseLogLine(line) {
  const b = /^\s*[-*+]\s+(.*)$/.exec(line);
  if (!b) return null;
  const text = b[1].replace(/[*_`]+/g, '').trim();
  let mb = 0, n = 0, x; SIZE_RE.lastIndex = 0;
  while ((x = SIZE_RE.exec(text))) {
    const v = +(x[2] || x[1]).replace(/,/g, ''), u = x[3].toLowerCase();
    mb += /^g/.test(u) ? v * 1000 : /^k/.test(u) ? v / 1000 : v; n++;
  }
  if (!n) return null;
  let r = null;
  for (const [re, f] of DATE_PATTERNS) { const m = re.exec(text); if (m) { r = f(m); break; } }
  if (!r || r.m1 < 0 || r.m2 < 0 || r.m1 > 11 || r.m2 > 11 || !r.d1 || !r.d2 || r.d1 > 31 || r.d2 > 31) {
    throw new WfLogFormatError(`wf-guard: a log line has a size figure but no date the guard can read: ${line.trim()}`, { line });
  }
  const rid = RUN_ID_RE.exec(text);
  return {
    mb, runId: rid ? rid[1] : null,
    covers(day) {
      const y = day.getUTCFullYear(), key = Date.UTC(y, day.getUTCMonth(), day.getUTCDate());
      const starts = r.y1 != null ? [r.y1] : [y, y - 1];
      for (const sy of starts) {
        const s = Date.UTC(sy, r.m1, r.d1);
        let ey = r.y2 != null ? r.y2 : sy, e = Date.UTC(ey, r.m2, r.d2);
        if (e < s && r.y2 == null) e = Date.UTC(++ey, r.m2, r.d2);
        if (key >= s && key <= e) return true;
      }
      return false;
    },
  };
}
/* Webflow MB a log line counts for the given UTC day (Date), or 0. Throws WfLogFormatError on an unreadable dated line. */
function lineMBForDay(line, day) { const p = parseLogLine(line); return p && p.covers(day) ? p.mb : 0; }
/* the day's total of a log text; opts.skipRuns: run ids counted elsewhere (the tally); opts.seen: a Set of lines already counted */
function dailyTotalMB(text, day, opts) {
  opts = opts || {};
  let mb = 0; const bad = [];
  String(text).split('\n').forEach((l, i) => {
    let p; try { p = parseLogLine(l); } catch (e) { bad.push(`${opts.file ? opts.file + ':' : 'line '}${i + 1}: ${l.trim()}`); return; }
    if (!p || !p.covers(day)) return;
    if (p.runId && opts.skipRuns && opts.skipRuns.has(p.runId)) return;
    const k = l.trim(); if (opts.seen) { if (opts.seen.has(k)) return; opts.seen.add(k); }
    mb += p.mb;
  });
  if (bad.length) throw new WfLogFormatError(`wf-guard: ${bad.length} log line(s) have a size figure but no date the guard can read; fix them so the daily cap is right:\n  ${bad.slice(0, 8).join('\n  ')}`, { lines: bad });
  return mb;
}
/* the day's total over several log files; a line found in two files (main checkout and worktree) counts once */
function readDailyTotalMB(files, day, opts) {
  const seen = new Set(); let mb = 0;
  for (const f of [].concat(files || logPath())) {
    let t; try { t = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
    mb += dailyTotalMB(t, day || new Date(), Object.assign({}, opts, { seen, file: f }));
  }
  return mb;
}
function appendLogLine(file, line) {
  file = file || logPath();
  let pre = ''; try { const t = fs.readFileSync(file, 'utf8'); if (t.length && !t.endsWith('\n')) pre = '\n'; } catch (e) { }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, pre + line.replace(/[\r\n]+/g, ' ') + '\n');
}

/* ---------- the shared tally and its lock ---------- */

const sleepSync = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
/* runs fn while holding <dir>/lock (created with O_EXCL; a lock older than 10 s is taken as stale) */
function withLock(dir, fn) {
  fs.mkdirSync(dir, { recursive: true });
  const lock = path.join(dir, 'lock'), t0 = Date.now();
  for (;;) {
    try { const fd = fs.openSync(lock, 'wx'); fs.writeSync(fd, `${process.pid} ${new Date().toISOString()}\n`); fs.closeSync(fd); break; } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      try { if (Date.now() - fs.statSync(lock).mtimeMs > 10000) { fs.rmSync(lock, { force: true }); continue; } } catch (e2) { continue; }
      if (Date.now() - t0 > 15000) throw new Error(`wf-guard: could not take the lock ${lock} within 15 s`);
      sleepSync(3);
    }
  }
  try { return fn(); } finally { try { fs.rmSync(lock, { force: true }); } catch (e) { } }
}
const dayKey = d => d.toISOString().slice(0, 10);
const tallyFile = (dir, day) => path.join(dir, `tally-${dayKey(day)}.json`);
function readTally(dir, day) { try { const t = JSON.parse(fs.readFileSync(tallyFile(dir, day), 'utf8')); t.runs = t.runs || {}; return t; } catch (e) { return { runs: {} }; } }
function writeTally(dir, day, t) { const f = tallyFile(dir, day), tmp = `${f}.${process.pid}.tmp`; fs.writeFileSync(tmp, JSON.stringify(t, null, 1)); fs.renameSync(tmp, f); }
const pidAlive = pid => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
/* bytes of all runs in the tally (other than exceptId); reservations count only while their process is alive */
function tallyBytes(t, exceptId) {
  let b = 0;
  for (const [id, r] of Object.entries(t.runs || {})) {
    if (id === exceptId) continue;
    b += +r.bytes || 0;
    if (!r.closed && r.reserved && pidAlive(r.pid)) b += +r.reserved || 0;
  }
  return b;
}

/* ---------- runs (one log line each) ---------- */

const openRuns = new Set();
let exitHook = false;

/* A run holds the byte tally, the caps and the log line. guard() makes one per context unless given opts.run;
   wf-get makes one per command.
   opts: label (required), kind, mode, logFile, readLogs, stateDir, runCapMB (200), dayCapMB (250), getCapMB (5),
   onTrip ('throw' | 'close' | function), noLog, now (tests). */
function createRun(opts) {
  opts = opts || {};
  if (!opts.label) throw new Error('wf-guard: opts.label is required (a short task name, no personal names)');
  const now = opts.now ? () => new Date(opts.now) : () => new Date();
  const run = {
    id: crypto.randomBytes(3).toString('hex'),
    label: String(opts.label).replace(/[\r\n]+/g, ' ').trim(), kind: opts.kind || 'wf-guard', mode: opts.mode || 'cache-only',
    logFile: logPath(opts), readLogs: readLogsOf(opts), stateDir: stateDirOf(opts),
    runCap: (opts.runCapMB != null ? opts.runCapMB : RUN_CAP_MB) * MB, dayCap: (opts.dayCapMB != null ? opts.dayCapMB : DAY_CAP_MB) * MB,
    getCap: (opts.getCapMB != null ? opts.getCapMB : GET_CAP_MB) * MB,
    onTrip: opts.onTrip || 'throw', noLog: !!opts.noLog, startedAt: now(),
    bytes: 0, reserved: 0, gets: 0, non200: 0, responses: 0, pageLoads: 0, cacheHits: 0, cacheFetches: 0, cacheRefused: 0, misses: 0,
    blocked: 0, nonGet: 0, unloadStopped: 0, leaks: 0, unfinished: 0, tooBig: 0, failed: 0, redirectsIn: 0, redirectsFollowed: 0,
    missList: [], error: null, closed: false, contexts: new Set(), pending: new Set(), inflight: new Set(),
  };
  const day = run.startedAt;
  let logBase = 0, logRead = 0;
  const readLogBase = (t) => {
    const skip = new Set(Object.keys((t || readTally(run.stateDir, day)).runs));
    logBase = readDailyTotalMB(run.readLogs, day, { skipRuns: skip }) * MB; logRead = Date.now();
  };
  readLogBase();
  run.dayBaseBytes = () => { const t = readTally(run.stateDir, day); return logBase + tallyBytes(t, run.id); };
  const write = (t, extra) => {
    t.runs[run.id] = Object.assign({ label: run.label, kind: run.kind, pid: process.pid, bytes: run.bytes, reserved: run.reserved, closed: run.closed, started: run.startedAt.toISOString(), updated: new Date().toISOString() }, extra || {});
    writeTally(run.stateDir, day, t);
  };
  /* the day total as seen under the lock (other runs, the logs and this run) */
  const dayTotal = t => {
    if (Date.now() - logRead > 10000) {
      /* a log line that cannot be read stops a new run at its start; during a run the last good total is kept and a warning printed */
      try { readLogBase(t); } catch (e) { logRead = Date.now(); if (!run.logWarned) { run.logWarned = true; console.error(e.message); } }
    }
    return logBase + tallyBytes(t, run.id) + run.bytes + run.reserved;
  };
  const start = withLock(run.stateDir, () => { const t = readTally(run.stateDir, day); const total = dayTotal(t); if (total < run.dayCap) write(t); return total; });
  if (start >= run.dayCap) throw new WfBudgetError(`wf-guard: the daily total for ${fmtDay(day)} (logs ${run.readLogs.join(', ')} and the tally in ${run.stateDir}) is already ${(start / MB).toFixed(2)} MB (cap ${run.dayCap / MB} MB); not starting ${run.label}`, { cap: 'day' });

  /* How many bytes may the next GET use? Reserves them in the shared tally. Returns { bytes, by } where by is the cap that
     set the limit ('get', 'run' or 'day'); bytes 0 means a cap is reached (the run trips). */
  run.reserve = (want) => {
    if (run.error || run.closed) return { bytes: 0, by: 'stopped' };
    want = want != null ? want : run.getCap;
    const g = withLock(run.stateDir, () => {
      const t = readTally(run.stateDir, day);
      const runLeft = run.runCap - run.bytes - run.reserved, dayLeft = run.dayCap - dayTotal(t);
      let bytes = Math.min(want, runLeft, dayLeft), by = bytes === want ? 'get' : (runLeft <= dayLeft ? 'run' : 'day');
      if (bytes < want && bytes < HEADER_ALLOWANCE * 2) bytes = 0;
      if (bytes > 0) { run.reserved += bytes; write(t); }
      return { bytes, by };
    });
    if (!g.bytes) run.trip(g.by === 'get' ? 'run' : g.by);
    return g;
  };
  /* records what a GET used and releases its reservation; trips the run at a cap */
  run.settle = (grant, used, noTrip) => {
    const b = Math.max(0, +used || 0);
    const total = withLock(run.stateDir, () => {
      const t = readTally(run.stateDir, day);
      run.reserved = Math.max(0, run.reserved - ((grant && grant.bytes) || 0)); run.bytes += b; write(t); return dayTotal(t);
    });
    if (noTrip) return;
    if (run.bytes >= run.runCap) run.trip('run');
    else if (total >= run.dayCap) run.trip('day');
  };
  run.add = (bytes) => run.settle(null, bytes);
  run.trip = (cap) => {
    if (run.error || run.closed) return;
    const msg = cap === 'run'
      ? `wf-guard: ${run.label} reached ${(run.bytes / MB).toFixed(2)} MB from Webflow, the run cap is ${run.runCap / MB} MB; run stopped`
      : `wf-guard: ${run.label} brought the ${fmtDay(day)} total to the daily cap of ${run.dayCap / MB} MB; run stopped`;
    run.error = new WfBudgetError(msg, { cap, bytes: run.bytes });
    run.close();
    for (const c of run.contexts) c.close().catch(() => { });
    if (typeof run.onTrip === 'function') run.onTrip(run.error);
    else if (run.onTrip === 'throw') { const e = run.error; process.nextTick(() => { throw e; }); }
  };
  run.check = () => { if (run.error) throw run.error; };
  run.line = () => logLine(run);
  /* stops fetches still running and counts what they received so far (as unfinished responses) */
  run.killInflight = () => {
    for (const ent of [...run.inflight]) {
      run.inflight.delete(ent);
      if (ent.settled) continue; ent.settled = true;
      const got = ent.job.kill();
      run.unfinished++; run.responses++;
      run.settle(ent.grant, got, true);
    }
  };
  /* writes the log line once */
  run.close = () => {
    if (run.closed) return;
    run.killInflight();
    run.closed = true; openRuns.delete(run);
    try { withLock(run.stateDir, () => { const t = readTally(run.stateDir, day); run.reserved = 0; write(t, { closed: true }); }); } catch (e) { }
    if (!run.noLog) appendLogLine(run.logFile, run.line());
  };
  /* waits for fetches and counts in flight, then writes the log line */
  run.closeAsync = async () => { await Promise.allSettled([...run.pending]); run.close(); };
  run.noteMiss = (u, cls) => { run.misses++; if (run.missList.length < 500) run.missList.push(`${cls} ${u}`); };
  openRuns.add(run);
  if (!exitHook) { exitHook = true; process.on('exit', () => { for (const r of [...openRuns]) { try { r.close(); } catch (e) { } } }); }
  return run;
}

function fmtDay(d) { return `${d.getUTCDate()} ${MON[d.getUTCMonth()]}`; }
function logLine(r) {
  const d = r.startedAt, t = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  const mb = (r.bytes / MB).toFixed(2);
  let s = `- ${fmtDay(d)} ${t} UTC, ${r.label}: `;
  const extra = [];
  if (r.unfinished) extra.push(`${r.unfinished} unfinished`);
  if (r.leaks) extra.push(`${r.leaks} reached Webflow past the guard`);
  if (r.kind === 'wf-get') {
    s += `wf-get run ${r.id}, ${r.gets} GETs (${r.non200} not 200), ${mb} MB from Webflow (M)`;
    if (r.tooBig) extra.push(`${r.tooBig} over the size limit`);
  } else {
    s += `wf-guard ${r.mode} run ${r.id}, ${r.pageLoads} page loads, ${r.gets} Webflow GETs, ${mb} MB from Webflow (M); ${r.cacheHits} served from the cache, ${r.misses} cache misses aborted, ${r.blocked} images, video or fonts aborted, ${r.nonGet} non-GET requests aborted`;
    if (r.unloadStopped) extra.push(`${r.unloadStopped} unload beacons stopped`);
    if (r.cacheRefused) extra.push(`${r.cacheRefused} refused as fetched before`);
    if (r.tooBig) extra.push(`${r.tooBig} over the size limit`);
  }
  if (extra.length) s += '; ' + extra.join(', ');
  if (r.error) s += `; STOPPED at the ${r.error.cap === 'run' ? 'run' : 'daily'} cap`;
  return s;
}

/* ---------- curl ---------- */

function parseHeaderFile(text) {
  const blocks = String(text).split(/\r?\n\r?\n/).filter(b => /^HTTP\//.test(b.trim()));
  const last = (blocks[blocks.length - 1] || '').trim().split(/\r?\n/);
  const headers = {};
  for (const l of last.slice(1)) {
    const i = l.indexOf(':'); if (i < 1) continue;
    const k = l.slice(0, i).trim().toLowerCase(), v = l.slice(i + 1).trim();
    headers[k] = headers[k] ? `${headers[k]}, ${v}` : v;
  }
  return headers;
}
/* One GET with curl, redirects not followed. Returns { promise, kill() }. The promise gives
   { status, headers, body, wire, exit, truncated, timedOut, error }; wire is body plus headers as received (compressed).
   kill() stops it and returns the bytes received so far (from the files on disk; errs high for compressed bodies).
   o: headers, maxBytes (body limit, curl --max-filesize), timeoutS, curl, curlArgs (extra arguments; WF_GUARD_CURL_ARGS as a
   JSON array is the default, used by the tests to keep every request on this machine). */
function curlFetch(url, o) {
  o = o || {};
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wfg-curl-'));
  const hf = path.join(dir, 'h'), bf = path.join(dir, 'b');
  let extra = o.curlArgs;
  if (!extra && process.env.WF_GUARD_CURL_ARGS) { try { extra = JSON.parse(process.env.WF_GUARD_CURL_ARGS); } catch (e) { } }
  const args = ['-sS', '--compressed', '--max-time', String(o.timeoutS || 30), '-D', hf, '-o', bf,
    '-w', '%{http_code} %{size_download} %{size_header} %{exitcode}', '-A', (o.headers && o.headers['user-agent']) || 'Mozilla/5.0 (wf-guard bandwidth-counted check)'];
  if (o.maxBytes) args.push('--max-filesize', String(Math.max(1, Math.floor(o.maxBytes))));
  for (const [k, v] of Object.entries(o.headers || {})) if (k !== 'user-agent' && v != null) args.push('-H', `${k}: ${v}`);
  args.push(...(extra || []), '--url', url);
  const size = f => { try { return fs.statSync(f).size; } catch (e) { return 0; } };
  const cleanup = () => { try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { } };
  let child, killed = false;
  const promise = new Promise(resolve => {
    let out = '', err = '';
    try { child = spawn(o.curl || 'curl', args, { stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { cleanup(); return resolve({ status: 0, headers: {}, body: Buffer.alloc(0), wire: 0, exit: -1, error: String(e) }); }
    child.stdout.on('data', d => { out += d; }); child.stderr.on('data', d => { err += d; });
    child.on('error', e => { err += String(e); });
    child.on('close', code => {
      const [st, dl, hd, ex] = out.trim().split(' ').map(Number);
      let body = Buffer.alloc(0), headers = {};
      try { body = fs.readFileSync(bf); } catch (e) { }
      try { headers = parseHeaderFile(fs.readFileSync(hf, 'latin1')); } catch (e) { }
      const exit = Number.isFinite(ex) ? ex : (code == null ? -1 : code);
      const wire = Number.isFinite(dl) ? (dl || 0) + (hd || 0) : size(bf) + size(hf);
      cleanup();
      resolve({ status: st || 0, headers, body, wire, exit, truncated: exit === 63, timedOut: exit === 28, killed, error: exit ? err.trim() || `curl exit ${exit}` : undefined });
    });
  });
  return { promise, kill: () => { killed = true; const n = size(bf) + size(hf); try { child && child.kill('SIGKILL'); } catch (e) { } return n; } };
}

/* ---------- the local cache (same layout as scratchpad nov21/sweep-cache/assets) ---------- */

/* <dir>/<sha1(key)>.b holds the body, <dir>/<sha1(key)>.json {u, status, headers} (written last). The key is the URL, or
   "<url> [range <Range header>]" for a range request. <dir>/<sha1(key)>.claim is created with O_EXCL before the one network
   fetch of a key, so no two contexts or processes fetch the same key, and a key whose fetch failed is never fetched again.
   <dir>/wf-guard-fetched.txt lists every key sent to the network; it and an asset-index.txt next to <dir> (the sweep cache's
   list) count as fetched too. One cache object per folder in a process. */
const caches = new Map();
function makeCache(dir) {
  if (!dir) throw new Error('wf-guard: a cache folder is needed (opts.cacheDir or WF_GUARD_CACHE)');
  dir = path.resolve(dir);
  if (caches.has(dir)) return caches.get(dir);
  fs.mkdirSync(dir, { recursive: true });
  const listFile = path.join(dir, 'wf-guard-fetched.txt');
  const listed = () => {
    const s = new Set();
    for (const f of [listFile, path.join(dir, '..', 'asset-index.txt')]) {
      try { for (const l of fs.readFileSync(f, 'utf8').split('\n')) { const u = l.split(' ').slice(1, -1).join(' ') || l.split(' ')[1]; if (u) s.add(u); } } catch (e) { }
    }
    return s;
  };
  const k = key => path.join(dir, sha1(key));
  const cache = {
    dir, inflight: new Map(),
    get(key) {
      try {
        const m = JSON.parse(fs.readFileSync(k(key) + '.json', 'utf8')); const headers = {};
        for (const x in m.headers || {}) if (!DROP.has(x.toLowerCase())) headers[x.toLowerCase()] = String(m.headers[x]);
        return { status: m.status, headers, body: fs.readFileSync(k(key) + '.b') };
      } catch (e) { return null; }
    },
    fetchedBefore: key => fs.existsSync(k(key) + '.claim') || fs.existsSync(k(key) + '.json') || listed().has(key),
    /* true when this caller may fetch key from the network (and nobody else ever will) */
    claim(key) {
      if (fs.existsSync(k(key) + '.json') || listed().has(key)) return false;
      try { fs.writeFileSync(k(key) + '.claim', `${process.pid} ${new Date().toISOString()} ${key}\n`, { flag: 'wx' }); } catch (e) { if (e.code === 'EEXIST') return false; throw e; }
      fs.appendFileSync(listFile, `${sha1(key)} ${key} ${new Date().toISOString()}\n`);
      return true;
    },
    put(key, status, headers, body) {
      const hd = {}; for (const x in headers) if (!DROP.has(x.toLowerCase())) hd[x] = headers[x];
      fs.writeFileSync(k(key) + '.b', body); fs.writeFileSync(k(key) + '.json', JSON.stringify({ u: key, status, headers: hd }));
    },
    /* waits for another context or process that holds the claim; null when it failed or its process is gone */
    async waitFor(key, ms) {
      const t0 = Date.now();
      while (Date.now() - t0 < ms) {
        if (cache.inflight.has(key)) { await cache.inflight.get(key).catch(() => { }); return cache.get(key); }
        const hit = cache.get(key); if (hit) return hit;
        let pid = 0; try { pid = +fs.readFileSync(k(key) + '.claim', 'utf8').split(' ')[0]; } catch (e) { }
        if (!pid || pid === process.pid || !pidAlive(pid)) return null;
        await new Promise(r => setTimeout(r, 100));
      }
      return null;
    },
  };
  caches.set(dir, cache);
  return cache;
}
/* a cached answer for a GET, or null: the exact key first, then a 200 copy of the whole file sliced for a Range header */
function cacheLookup(cache, url, range) {
  if (!range) return cache.get(url);
  const hit = cache.get(`${url} [range ${range}]`); if (hit) return hit;
  const full = cache.get(url); if (!full || full.status !== 200) return null;
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(range).trim()); if (!m) return null;
  const n = full.body.length; let a, b;
  if (m[1] === '') { a = Math.max(0, n - +m[2]); b = n - 1; } else { a = +m[1]; b = m[2] === '' ? n - 1 : Math.min(+m[2], n - 1); }
  if (a > b || a >= n) return { status: 416, headers: { 'content-range': `bytes */${n}` }, body: Buffer.alloc(0) };
  return { status: 206, headers: Object.assign({}, full.headers, { 'content-range': `bytes ${a}-${b}/${n}`, 'accept-ranges': 'bytes' }), body: full.body.subarray(a, b + 1) };
}

/* the body limit for curl: the grant, less room for the headers when the grant is what is left of a cap */
const bodyLimit = g => Math.max(1, g.bytes - (g.by === 'get' ? 0 : HEADER_ALLOWANCE));

/* a Range header cut to at most chunk bytes, or null when there is none or it cannot be read */
function boundRange(range, chunk) {
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(range || '').trim());
  if (!m || (m[1] === '' && m[2] === '')) return null;
  if (m[1] === '') return +m[2] <= chunk ? range : `bytes=-${chunk}`;
  const a = +m[1];
  if (m[2] !== '' && +m[2] - a + 1 <= chunk) return range;
  return `bytes=${a}-${a + chunk - 1}`;
}

/* ---------- guard ---------- */

const PATCHED = Symbol('wfGuardPatched'), WRAPPED = Symbol('wfGuardWrapped'), FAKE = Symbol('wfGuardResponse');

/* in the page, before any page script: sendBeacon and non-GET fetch() to the given hosts (or to all) do nothing.
   Chromium sends beacons and keepalive requests at unload after the frame is gone, where no route sees them. */
function UNLOAD_GUARD(cfg) {
  try {
    const res = cfg.hosts.map(h => (h.re ? new RegExp(h.re, h.flags) : null));
    const hit = u => {
      if (cfg.all) return true;
      let h; try { h = new URL(String(u), location.href).hostname.toLowerCase().replace(/\.+$/, ''); } catch (e) { return false; }
      return cfg.hosts.some((x, i) => (res[i] ? res[i].test(h) : x.s === h));
    };
    const note = (k, u) => { try { const f = window[cfg.binding]; if (typeof f === 'function') Promise.resolve(f(k, String(u).slice(0, 300))).catch(() => { }); } catch (e) { } };
    const N = window.Navigator && Navigator.prototype;
    if (N && typeof N.sendBeacon === 'function') {
      const sb = N.sendBeacon;
      N.sendBeacon = function (u, d) { if (hit(u)) { note('beacon', u); return true; } return sb.call(this, u, d); };
    }
    if (typeof window.fetch === 'function') {
      const f = window.fetch;
      window.fetch = function (input, init) {
        let m = 'GET', u = input;
        try { if (input && typeof input === 'object' && 'url' in input) { u = input.url; m = input.method || 'GET'; } if (init && init.method) m = init.method; } catch (e) { }
        if (String(m).toUpperCase() !== 'GET' && hit(u)) { note('fetch', u); return Promise.reject(new TypeError('wf-guard: non-GET request refused')); }
        return f.apply(this, arguments);
      };
    }
  } catch (e) { }
}

function fakeResponse(url, r) {
  const headers = Object.assign({}, r.headers);
  const res = {
    url: () => url, status: () => r.status, statusText: () => '', ok: () => r.status >= 200 && r.status < 300,
    headers: () => Object.assign({}, headers), headersArray: () => Object.entries(headers).map(([name, value]) => ({ name, value })),
    body: async () => r.body, text: async () => r.body.toString('utf8'), json: async () => JSON.parse(r.body.toString('utf8')), dispose: async () => { },
  };
  res[FAKE] = r;
  return res;
}
const cleanHeaders = h => { const o = {}; for (const k in h || {}) if (!DROP.has(k.toLowerCase())) o[k.toLowerCase()] = h[k]; return o; };

/* guard(contextOrPage, opts) -> handle
   opts: label (required); mode 'cache-only' (default), 'fetch-once' or 'block'; cacheDir (or WF_GUARD_CACHE; needed for
   'fetch-once'); htmlDir (pages saved by wf-get, served for Webflow page loads in every mode); allowVideo, allowFonts
   ('fetch-once' only; video goes in pieces of videoChunkMB, default 1); unloadNonGet 'webflow' (default) or 'all'; strictRedirects (default true); run (one tally and one log
   line across several contexts; see createRun); logFile; readLogs; stateDir; runCapMB (200); dayCapMB (250); getCapMB (5,
   the most one GET may download); fetchTimeoutS (30); hosts (replaces the Webflow host list; tests only); curlArgs (tests);
   onTrip ('throw' default, 'close', or a function(err)); now (tests).
   Register your own routes before or after guard(); either way they run first and the guard has the last word. */
function guard(target, opts) {
  opts = opts || {};
  const isPage = target && typeof target.mainFrame === 'function';
  const context = isPage ? target.context() : target;
  if (!context || typeof context.route !== 'function') throw new Error('wf-guard: pass a Playwright BrowserContext or Page');
  if (context[PATCHED]) throw new Error('wf-guard: this context is already guarded');
  const mode = opts.mode || 'cache-only';
  if (mode === 'cache') throw new Error("wf-guard: mode 'cache' was replaced: use 'cache-only' (serve from the cache folder, abort misses) or 'fetch-once' (store each Webflow GET once)");
  if (!['cache-only', 'fetch-once', 'block'].includes(mode)) throw new Error("wf-guard: mode must be 'cache-only', 'fetch-once' or 'block'");
  const cacheDir = opts.cacheDir || process.env.WF_GUARD_CACHE || null;
  if (mode === 'fetch-once' && !cacheDir) throw new Error("wf-guard: mode 'fetch-once' needs opts.cacheDir (or WF_GUARD_CACHE)");
  const cache = cacheDir ? makeCache(cacheDir) : null;
  const htmlDir = opts.htmlDir || null;
  const own = !opts.run;
  const run = opts.run || createRun(Object.assign({}, opts, { mode }));
  if (run.mode !== mode && opts.run) run.mode = mode;
  const hostList = opts.hosts ? [].concat(opts.hosts) : WF_HOSTS;
  const isWf = hostMatcher(hostList);
  const allow = { video: !!opts.allowVideo, font: !!opts.allowFonts };
  const strict = opts.strictRedirects !== false;
  const videoChunk = Math.max(65536, Math.floor((opts.videoChunkMB || 1) * MB));
  const fetchOpts = { timeoutS: opts.fetchTimeoutS || 30, curl: opts.curl, curlArgs: opts.curlArgs };
  const handled = new WeakSet();
  run.contexts.add(context);
  context[PATCHED] = true;
  const track = p => { run.pending.add(p); const done = () => { run.pending.delete(p); }; p.then(done, done); return p; };

  /* one GET from Webflow with curl: counted, capped at what is left of the budget */
  async function netGet(url, headers, cls) {
    const grant = run.reserve(run.getCap);
    if (!grant.bytes) return { abort: 'stopped at a cap' };
    const h = {}; for (const x of ['range', 'accept', 'user-agent', 'accept-language']) if (headers[x]) h[x] = headers[x];
    const job = curlFetch(url, Object.assign({ headers: h, maxBytes: bodyLimit(grant) }, fetchOpts));
    const ent = { job, grant, settled: false }; run.inflight.add(ent);
    const r = await job.promise;
    run.inflight.delete(ent);
    if (ent.settled) return { abort: 'stopped' };
    ent.settled = true;
    run.gets++; run.responses++; if (r.status !== 200 && r.status !== 206) run.non200++;
    if (r.timedOut) run.unfinished++;
    if (r.truncated && grant.by === 'get') run.tooBig++;
    run.settle(grant, r.wire, r.truncated && grant.by === 'get');
    if (r.truncated && grant.by !== 'get') { run.trip(grant.by); return { abort: 'stopped at a cap' }; }
    if (r.exit) { if (!r.truncated && !r.timedOut) run.failed++; return { abort: r.truncated ? 'over the size limit' : r.timedOut ? 'timed out' : 'failed' }; }
    const ct = classifyType(r.headers['content-type']);
    if (cls === 'doc' && ct !== 'doc' && (mode === 'block' || (ct === 'video' && !allow.video) || (ct === 'font' && !allow.font))) { run.blocked++; return { abort: `content type ${ct}` }; }
    return { status: r.status, headers: r.headers, body: r.body };
  }

  /* the guard's answer for a Webflow GET: { status, headers, body } or { abort } */
  async function serveWebflow(url, rtype, headers, nav) {
    if (run.error || run.closed) return { abort: 'stopped' };
    const cls = classify(url, rtype);
    let range = headers.range || null;
    if (cache) { const hit = cacheLookup(cache, url, range); if (hit) { run.cacheHits++; return hit; } }
    if (htmlDir && cls === 'doc' && (nav || /^(document|fetch|xhr)$/.test(rtype))) {
      try { const body = fs.readFileSync(path.join(htmlDir, fileFor(url))); run.cacheHits++; return { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' }, body }; } catch (e) { }
    }
    if (mode === 'cache-only') { run.noteMiss(url, cls); return { abort: 'not in the cache' }; }
    if (cls !== 'doc' && (mode === 'block' || (cls === 'video' && !allow.video) || (cls === 'font' && !allow.font))) { run.blocked++; return { abort: `${cls} blocked` }; }
    if (mode === 'block') return netGet(url, headers, cls);
    /* fetch-once. Video (when allowed) only in bounded pieces: a request without a Range header is refused, an open or long
       range is cut to videoChunkMB (the 206 answer says which bytes it holds, and the player asks for the next piece). */
    if (cls === 'video') {
      const b = boundRange(range, videoChunk);
      if (!b) { run.blocked++; return { abort: 'video without a Range header' }; }
      if (b !== range) { range = b; headers = Object.assign({}, headers, { range }); const hit = cache.get(`${url} [range ${range}]`); if (hit) { run.cacheHits++; return hit; } }
    }
    const key = range ? `${url} [range ${range}]` : url;
    if (cache.inflight.has(key)) { await cache.inflight.get(key).catch(() => { }); const h = cache.get(key); if (h) { run.cacheHits++; return h; } run.cacheRefused++; return { abort: 'its one fetch failed' }; }
    if (!cache.claim(key)) { const h = await cache.waitFor(key, 60000); if (h) { run.cacheHits++; return h; } run.cacheRefused++; return { abort: 'fetched before' }; }
    const p = netGet(url, headers, cls).then(r => { if (!r.abort) { cache.put(key, r.status, r.headers, r.body); run.cacheFetches++; } return r; });
    cache.inflight.set(key, p); track(p);
    try { return await p; } finally { cache.inflight.delete(key); }
  }

  /* A GET answered hop by hop: each Webflow hop by serveWebflow, each other hop by doFetch(url) with redirects not followed.
     Used for the browser's own requests (Chromium does not route the next hop of a redirect, not even of a fulfilled one), a
     caller's route.fetch and context.request. Throws when the guard refuses a hop. */
  async function fetchGuarded(url, headers, rtype, maxRedirects, doFetch, nav) {
    for (let hop = 0; ; hop++) {
      let resp;
      if (isWf(url)) {
        const r = await serveWebflow(url, rtype, headers || {}, !!nav);
        if (r.abort) throw new Error(`wf-guard: refused a Webflow ${mode === 'block' && classify(url, rtype) !== 'doc' ? 'media ' : ''}fetch in mode ${mode} (${r.abort}): ${url}`);
        resp = fakeResponse(url, r);
      } else resp = await doFetch(url);
      const st = resp.status(), loc = st >= 300 && st < 400 ? resp.headers().location : null;
      if (!loc || hop >= maxRedirects) return resp;
      const next = new URL(loc, url).href;
      if (isWf(next) && !isWf(url)) run.redirectsIn++;
      if (hop === 0) run.redirectsFollowed++;
      url = next;
    }
  }
  function guardedFetch(route, o) {
    o = o || {};
    const req = route.request();
    const u = o.url ? new URL(o.url, req.url()).href : req.url();
    const method = (o.method || req.method()).toUpperCase();
    if (method !== 'GET') { run.nonGet++; return Promise.reject(new Error(`wf-guard: refused a ${method} fetch of ${u}`)); }
    const p = fetchGuarded(u, o.headers || req.headers(), req.resourceType(), o.maxRedirects != null ? o.maxRedirects : 20,
      url => route.fetch(Object.assign({}, o, { url, maxRedirects: 0 })));
    track(p);
    return p;
  }

  /* the guard's own handler: the last word for every request */
  async function handler(route) {
    const req = route.request(), u = req.url();
    handled.add(req);
    try {
      if (req.method() !== 'GET') { run.nonGet++; return await route.abort('blockedbyclient'); }
      if (!/^https?:/i.test(u)) return await route.fallback();
      if (!isWf(u) && !strict) return await route.fallback();
      /* every hop is fetched here, so a redirect into a Webflow host comes back to the guard; the browser gets the last answer */
      const p = fetchGuarded(u, req.headers(), req.resourceType(), 20, url => route.fetch({ url, maxRedirects: 0 }), req.isNavigationRequest()); track(p);
      let resp; try { resp = await p; } catch (e) { return await route.abort('blockedbyclient'); }
      if (resp[FAKE]) { const r = resp[FAKE]; return await route.fulfill({ status: r.status, headers: cleanHeaders(r.headers), body: r.body }); }
      return await route.fulfill({ response: resp });
    } catch (e) {
      try { await route.abort('failed'); } catch (e2) { }
    }
  }

  /* caller routes: continue() becomes fallback() so the guard always has the last word; fetch() goes through the guard;
     fulfill() accepts the guard's own responses */
  function wrapRoute(route) {
    return new Proxy(route, {
      get(t, k) {
        if (k === 'continue') return o => t.fallback(o);
        if (k === 'fetch') return o => guardedFetch(t, o);
        if (k === 'fulfill') return o => { if (o && o.response && o.response[FAKE]) { const r = o.response[FAKE]; o = Object.assign({ status: r.status, headers: cleanHeaders(r.headers), body: o.body === undefined ? r.body : o.body }, o, { response: undefined }); } return t.fulfill(o); };
        const v = t[k]; return typeof v === 'function' ? v.bind(t) : v;
      },
    });
  }
  const wraps = new WeakMap();
  const wrapHandler = h => {
    if (typeof h !== 'function' || h[WRAPPED] || h === handler) return h;
    if (!wraps.has(h)) { const w = (route, request) => h(wrapRoute(route), request); w[WRAPPED] = true; wraps.set(h, w); }
    return wraps.get(h);
  };
  const routesOf = o => (o && Array.isArray(o._routes) ? o._routes : null);
  let lastWord = false;
  /* routes registered before guard(): their handlers are wrapped in place (Playwright keeps them in _routes) */
  const wrapExisting = obj => { const rs = routesOf(obj); if (!rs) return; for (const rh of rs) if (rh && typeof rh.handler === 'function' && rh.handler !== handler) rh.handler = wrapHandler(rh.handler); };
  /* moves the guard's handler to the end of the context's routes, so it runs after every route of the caller */
  const moveLast = () => {
    const rs = routesOf(context); if (!rs) return false;
    const i = rs.findIndex(rh => rh && rh.handler === handler); if (i < 0) return false;
    const [rh] = rs.splice(i, 1); rs.push(rh); return true;
  };
  function installRoute() { const p = context.route('**/*', handler); lastWord = moveLast(); return p.then(() => { lastWord = moveLast() || lastWord; }); }
  function patch(obj) {
    if (obj[WRAPPED]) return; obj[WRAPPED] = true;
    wrapExisting(obj);
    const r = obj.route.bind(obj), ur = obj.unroute.bind(obj), ua = obj.unrouteAll ? obj.unrouteAll.bind(obj) : null;
    obj.route = (url, h, o) => r(url, wrapHandler(h), o);
    obj.unroute = async (url, h) => { await ur(url, h ? (wraps.get(h) || h) : h); if (obj === context && !(routesOf(context) || []).some(rh => rh.handler === handler)) await installRoute(); };
    if (ua) obj.unrouteAll = async o => { await ua(o); if (obj === context) await installRoute(); };
  }

  /* context.request and page.request (the same object): non-GET refused, Webflow GETs answered by the guard */
  const rq = context.request;
  if (rq && typeof rq.fetch === 'function' && !rq[WRAPPED]) {
    const of = rq.fetch.bind(rq); rq[WRAPPED] = true;
    rq.fetch = (urlOrRequest, o) => {
      o = o || {};
      const isStr = typeof urlOrRequest === 'string';
      let u = isStr ? urlOrRequest : urlOrRequest.url();
      const method = String(o.method || (isStr ? 'GET' : urlOrRequest.method()) || 'GET').toUpperCase();
      try { u = new URL(u, (context._options && context._options.baseURL) || undefined).href; } catch (e) { }
      if (method !== 'GET') { run.nonGet++; return Promise.reject(new Error(`wf-guard: refused a ${method} request through context.request or page.request: ${u}`)); }
      const p = fetchGuarded(u, o.headers || {}, 'fetch', o.maxRedirects != null ? o.maxRedirects : 20, url => of(url, Object.assign({}, o, { method: 'GET', maxRedirects: 0 })));
      track(p); return p;
    };
  }

  const binding = '__wfGuardNote';
  const cfg = { all: opts.unloadNonGet === 'all', binding, hosts: hostList.map(x => (x instanceof RegExp ? { re: x.source, flags: x.flags } : { s: normHost(x) })) };
  const ready = Promise.all([
    installRoute(),
    context.exposeBinding(binding, () => { run.unloadStopped++; }).catch(() => { }),
    context.addInitScript(UNLOAD_GUARD, cfg),
  ]).then(() => { });
  patch(context);
  for (const p of context.pages()) patch(p);
  context.on('page', patch);

  /* page loads: main-frame Webflow pages answered (from the cache or the network) */
  context.on('response', resp => {
    try {
      const req = resp.request(), st = resp.status();
      if (req.isNavigationRequest() && !req.frame().parentFrame() && isWf(resp.url()) && !(st >= 300 && st < 400)) run.pageLoads++;
    } catch (e) { }
  });
  /* a Webflow response the guard never saw that came from the network (a redirect from another host with
     strictRedirects false, or a route that slipped past the guard): counted and reported */
  const leak = (req, finished) => {
    if (handled.has(req) || !isWf(req.url())) return;
    track((async () => {
      const resp = await req.response().catch(() => null); if (!resp) return;
      const addr = await resp.serverAddr().catch(() => null); if (!addr) return;
      run.leaks++; run.responses++;
      if (!finished) { run.unfinished++; return; }
      let n = 0; try { const s = await req.sizes(); n = s.responseBodySize + s.responseHeadersSize; } catch (e) { }
      if (!run.closed) run.add(n);
    })());
  };
  context.on('requestfinished', req => leak(req, true));
  context.on('requestfailed', req => leak(req, false));

  const handle = {
    run, ready, context,
    lastWord: () => lastWord,
    stats: () => ({
      label: run.label, mode: run.mode, id: run.id, bytes: run.bytes, mb: +(run.bytes / MB).toFixed(3), pageLoads: run.pageLoads, gets: run.gets,
      responses: run.responses, cacheHits: run.cacheHits, cacheFetches: run.cacheFetches, cacheRefused: run.cacheRefused, misses: run.misses,
      missList: run.missList.slice(), blocked: run.blocked, nonGet: run.nonGet, unloadStopped: run.unloadStopped, leaks: run.leaks,
      unfinished: run.unfinished, tooBig: run.tooBig, failed: run.failed, redirectsIn: run.redirectsIn, redirectsFollowed: run.redirectsFollowed, lastWord,
      dayBaseMB: +(run.dayBaseBytes() / MB).toFixed(3), stopped: run.error ? run.error.cap : null,
    }),
    check: () => run.check(),
    /* writes the log line (own run only) after fetches and counts in flight are done; closing the context does the same */
    close: async () => { run.contexts.delete(context); if (own) await run.closeAsync(); },
  };
  context.once('close', () => { handle.close().catch(() => { }); });
  return handle;
}

module.exports = {
  guard, createRun, curlFetch, bodyLimit, makeCache, cacheLookup, boundRange, WfBudgetError, WfLogFormatError, isWebflowUrl, hostMatcher, classify, classifyType,
  isMediaRequest, fileFor, parseLogLine, lineMBForDay, dailyTotalMB, readDailyTotalMB, appendLogLine, logLine, readTally, withLock,
  RUN_CAP_MB, DAY_CAP_MB, GET_CAP_MB, DEFAULT_LOG, REPO_ROOT, MAIN_ROOT, MAIN_LOG, STATE_DIR, WF_HOSTS,
};

/* node tools/wf-guard.cjs day [YYYY-MM-DD]  prints that UTC day's total from the logs and the tally */
if (require.main === module) {
  const [cmd, d] = process.argv.slice(2);
  if (cmd === 'day') {
    const day = d ? new Date(d + 'T12:00:00Z') : new Date();
    try {
      const t = readTally(stateDirOf(), day);
      const logs = readDailyTotalMB(readLogsOf(), day, { skipRuns: new Set(Object.keys(t.runs)) });
      const tally = tallyBytes(t) / MB;
      console.log(`${fmtDay(day)}: ${(logs + tally).toFixed(2)} MB from Webflow (logs ${logs.toFixed(2)} MB in ${readLogsOf().join(', ')}; tally ${tally.toFixed(2)} MB in ${stateDirOf()}); daily cap ${DAY_CAP_MB} MB`);
    } catch (e) { console.error(e.message); process.exit(1); }
  } else { console.log('usage: node tools/wf-guard.cjs day [YYYY-MM-DD]   (the guard itself is a module; see tools/WF-GUARD.md)'); }
}
