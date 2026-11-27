'use strict';
/* wf-guard: Webflow bandwidth guard for Playwright harnesses.
   Rules: reports/bandwidth-2026-11-13.md section 4 (rules 1 to 6), reports/bandwidth-2026-11-25.md fix 1, and the fixes in
   reports/evidence/bw-guard-2026-11-25/check.md, reports/evidence/keep-going-2026-11-25/review.md (G1, G2, G4) and
   reports/evidence/bw-guard-fix-2026-11-27/check.md (N-1 to N-7), and of the two checks in
   reports/evidence/bw-guard-fix2-2026-11-27/ (R-1, R-3 to R-5 in check-repro.md; A-1 to A-7 in check-adversary.md).
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
     (b) Every byte of those fetches is counted on the wire. Each fetch reserves getCapMB plus room for an allowance and is
         capped by --max-filesize at what is left of the budget, so a run cannot go over a cap during one response. A response
         refused or cut at that limit counts with an allowance for what the server sent past it, up to its reservation.
     (c) The run stops at 200 MB, or when the UTC day's total reaches 250 MB, counted in bytes really used (a GET that open
         reservations block waits for them instead). The day's total is the shared log in the main
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
/* the smallest grant worth a GET; less than this left of a cap in bytes really counted stops the run */
const MIN_GRANT = HEADER_ALLOWANCE * 2;
/* counted for a response that curl refused or cut at a size limit, beyond what curl read (see countedBytes) */
const CUT_ALLOWANCE = 256000;
/* reserved on top of a GET's body limit, so that the allowance of a refused or cut response fits in its own grant */
const ALLOW = HEADER_ALLOWANCE + CUT_ALLOWANCE;
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
/* a content type that says nothing about the file (application/octet-stream, binary/octet-stream, or none) */
const isOctet = ct => { const t = String(ct || '').toLowerCase().split(';')[0].trim(); return !t || /^(application|binary)\/octet-stream$/.test(t); };
/* the first bytes of an MP4, MOV or M4V file (a box type at offset 4) or of a WebM or Matroska file (the EBML magic) */
function looksLikeVideo(buf) {
  if (!buf || buf.length < 8) return false;
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return true;
  return /^(ftyp|moov|mdat|wide|free|skip|pnot)$/.test(buf.subarray(4, 8).toString('latin1'));
}
/* the class of a response by its type, with an octet-stream body that starts like a video taken as video */
function typeOf(headers, head) {
  const ct = classifyType(headers && headers['content-type']);
  return ct === 'doc' && head && isOctet(headers && headers['content-type']) && looksLikeVideo(head) ? 'video' : ct;
}
/* "bytes a-b/total" -> { a, b, total } (total null for "*"), or null */
function contentRange(s) {
  const m = /^bytes\s+(\d+)-(\d+)\/(\d+|\*)$/i.exec(String(s || '').trim());
  return m ? { a: +m[1], b: +m[2], total: m[3] === '*' ? null : +m[3] } : null;
}

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
/* sizes: KB, MB, GB (also KiB, MiB, GiB and the words), bytes, and a bare capital M ("3 M"); a range counts its upper end */
const NUM = '(\\d[\\d,]*(?:\\.\\d+)?)', RANGE = `(?:\\s*(?:to|-|\\u2013|\\u2014)\\s*${NUM})?`;
const SIZE_RE = new RegExp(`(?<![\\w.])${NUM}${RANGE}\\s*(kib|mib|gib|kb|mb|gb|kilobytes?|megabytes?|gigabytes?|bytes?)(?![a-z])`, 'gi');
const BARE_M_RE = new RegExp(`(?<![\\w.])${NUM}${RANGE}\\s*M(?![A-Za-z&])`, 'g');
/* a date anywhere in a line, in any form the parser reads at the start of a bullet, or close to one */
const MON_ANY = '(?:[Jj]an(?:uary)?|[Ff]eb(?:ruary)?|[Mm]ar(?:ch)?|[Aa]pr(?:il)?|May|[Jj]une?|[Jj]uly?|[Aa]ug(?:ust)?|[Ss]ep(?:t(?:ember)?)?|[Oo]ct(?:ober)?|[Nn]ov(?:ember)?|[Dd]ec(?:ember)?)';
/* a date inside a path or file name (reports/x-2026-11-27/check.md) is not a date */
const DATE_ANY_RE = new RegExp(`\\b\\d{1,2}(?:st|nd|rd|th)?\\s+(?:of\\s+)?${MON_ANY}\\b|\\b${MON_ANY}\\.?\\s+\\d{1,2}\\b|(?<![\\w/.-])\\d{4}[-/.]\\d{1,2}[-/.]\\d{1,2}(?![\\w/-])|(?<![\\w/.-])\\d{1,2}[-/.]\\d{1,2}[-/.]\\d{4}(?![\\w/-])`);
const RUN_ID_RE = /\brun ([0-9a-f]{6})\b/;

/* every size figure of a text: { mb, n, first } (first: index of the first figure, or -1).
   A bare capital M ("3 M") is a size only where the real log would use it as one: followed by a marker in brackets
   ("2 M (E)"), or at the end of a line that has no other size figure ("- 27 Nov, x: 3 M"). So "12 M requests" and
   "1 MB, video 1080 M" do not count the M figure. */
function sizesOf(text) {
  let mb = 0, n = 0, first = -1, x;
  const add = (v, u, i) => { mb += /^g/.test(u) ? v * 1000 : /^k/.test(u) ? v / 1000 : /^b/.test(u) ? v / MB : v; n++; if (first < 0 || i < first) first = i; };
  SIZE_RE.lastIndex = 0;
  while ((x = SIZE_RE.exec(text))) add(+(x[2] || x[1]).replace(/,/g, ''), x[3].toLowerCase(), x.index);
  const bare = []; BARE_M_RE.lastIndex = 0;
  while ((x = BARE_M_RE.exec(text))) bare.push({ v: +(x[2] || x[1]).replace(/,/g, ''), i: x.index, rest: text.slice(x.index + x[0].length) });
  for (const b of bare) {
    if (/^\s*\(/.test(b.rest) || (/^\s*[.;,]?\s*$/.test(b.rest) && n === 0 && bare.length === 1)) add(b.v, 'm', b.i);
  }
  return { mb, n, first };
}
/* what kind of line a non-bullet line is, for the error message */
function lineKind(line) {
  const l = String(line);
  if (/^\s*\d+[.)]\s/.test(l)) return 'a numbered line';
  if (/^\s*\|/.test(l)) return 'a table row';
  if (/^\s*#/.test(l)) return 'a heading';
  if (/^\s*>/.test(l)) return 'a quoted line';
  if (/^\s*<!--/.test(l)) return 'an HTML comment';
  return 'a plain line (not a bullet)';
}

/* One log line -> null (no size figure in it, or not a log entry) or { mb, covers(day), runId }.
   A bullet is "-", "*" or "+", indented or not. The size is the sum of every size figure in the line (KB, MB, GB, KiB, MiB,
   GiB, the words, bytes, and a bare capital M after a number), taking the upper end of a range ("5 to 57 MB" is 57). The date
   is read from the start of the bullet in any of the forms in DATE_PATTERNS.
   Throws WfLogFormatError (never counts 0) for a bullet line with a size figure but no date it can read at the start, and for
   any other line (numbered list, table row, plain text) that has a date anywhere before a size figure: the guard reads only
   bullets, so such a line would be lost from the daily total. A plain line whose sizes all come before any date, like the
   "Budget: 250 MB a day ... the 13 Nov STANDING RULE" header line of the real log, is prose and is skipped. */
function parseLogLine(line) {
  const b = /^\s*[-*+]\s+(.*)$/.exec(line);
  if (!b) {
    const text = String(line).replace(/[*_`]+/g, '');
    const s = sizesOf(text); if (!s.n) return null;
    const dm = DATE_ANY_RE.exec(text);
    if (dm && dm.index < s.first) {
      const reason = `${lineKind(line)} with a date and a size figure; the guard reads only bullets, so write it as a bullet ("- 27 Nov, task: 3 MB (M)") to count it`;
      throw new WfLogFormatError(`wf-guard: ${reason}: ${String(line).trim()}`, { line, reason });
    }
    return null;
  }
  const text = b[1].replace(/[*_`]+/g, '').trim();
  const { mb, n } = sizesOf(text);
  if (!n) return null;
  let r = null;
  for (const [re, f] of DATE_PATTERNS) { const m = re.exec(text); if (m) { r = f(m); break; } }
  if (!r || r.m1 < 0 || r.m2 < 0 || r.m1 > 11 || r.m2 > 11 || !r.d1 || !r.d2 || r.d1 > 31 || r.d2 > 31) {
    const reason = 'a bullet with a size figure but no date the guard can read at its start';
    throw new WfLogFormatError(`wf-guard: ${reason}: ${line.trim()}`, { line, reason });
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
/* the lines of a log text that count for the day: a Map of line text -> { mb, count }. A line that appears twice in one
   file counts twice (two runs can write the same words). opts.skipRuns: run ids counted elsewhere (the tally). */
function countedLines(text, day, opts) {
  opts = opts || {};
  const out = new Map(), bad = [];
  String(text).split('\n').forEach((l, i) => {
    let p; try { p = parseLogLine(l); } catch (e) { bad.push(`${opts.file ? opts.file + ':' : 'line '}${i + 1}: ${l.trim()} (${e.reason || 'cannot be read'})`); return; }
    if (!p || !p.covers(day)) return;
    if (p.runId && opts.skipRuns && opts.skipRuns.has(p.runId)) return;
    const k = l.trim(), e = out.get(k);
    if (e) e.count++; else out.set(k, { mb: p.mb, count: 1 });
  });
  if (bad.length) throw new WfLogFormatError(`wf-guard: ${bad.length} log line(s) with a size figure cannot be counted (each one says why); fix them so the daily cap is right:\n  ${bad.slice(0, 8).join('\n  ')}`, { lines: bad });
  return out;
}
const sumLines = m => { let mb = 0; for (const e of m.values()) mb += e.mb * e.count; return mb; };
/* the day's total of one log text; every line counts as often as it appears */
function dailyTotalMB(text, day, opts) { return sumLines(countedLines(text, day, opts)); }
/* the day's total over several log files (main checkout and worktree). A line found in both counts as often as the file
   that holds it most often, not the sum: the worktree log is usually a copy of the main one plus new lines. */
function readDailyTotalMB(files, day, opts) {
  const all = new Map();
  for (const f of [].concat(files || logPath())) {
    let t; try { t = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
    for (const [k, e] of countedLines(t, day || new Date(), Object.assign({}, opts, { file: f }))) {
      const o = all.get(k); if (!o || e.count > o.count) all.set(k, e);
    }
  }
  return sumLines(all);
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
/* the start time of a process (field 22 of /proc/<pid>/stat, in clock ticks since boot), or null where /proc is missing.
   Stored with a reservation, so a reservation of a dead run whose pid now belongs to another process is seen as stale. */
function procStart(pid) {
  try { const t = fs.readFileSync(`/proc/${pid}/stat`, 'utf8'); return t.slice(t.lastIndexOf(')') + 2).split(' ')[19] || null; } catch (e) { return null; }
}
const MY_START = procStart(process.pid);
/* true while the process that made a tally entry is still running: same pid and, where known, the same start time */
function ownerAlive(r) {
  if (!pidAlive(r.pid)) return false;
  if (r.pidStart == null) return true;
  const now = procStart(r.pid);
  return now == null || String(now) === String(r.pidStart);
}
/* bytes counted by all runs in the tally (other than exceptId); with withReserved, open reservations too, which count only
   while their process is alive */
function tallyBytes(t, exceptId, withReserved) {
  let b = 0;
  for (const [id, r] of Object.entries(t.runs || {})) {
    if (id === exceptId) continue;
    b += +r.bytes || 0;
    if (withReserved !== false) b += tallyReserved1(r);
  }
  return b;
}
const tallyReserved1 = r => (!r.closed && r.reserved && ownerAlive(r) ? +r.reserved || 0 : 0);
/* open reservations of all runs in the tally other than exceptId */
function tallyReserved(t, exceptId) { let b = 0; for (const [id, r] of Object.entries(t.runs || {})) if (id !== exceptId) b += tallyReserved1(r); return b; }
/* GETs waiting for reservations to settle are woken when any run of this process settles one (other processes: polling) */
const wakers = new Set();
const wakeAll = () => { for (const w of [...wakers]) w(); };

/* The bytes to count for one GET. curl reports what it read (body as received plus headers). When curl refused a response
   or cut it at a size limit (--max-filesize, exit 63), the server had already sent more than that: up to a TCP window in
   flight, from 0.1 MB to a few MB on a real link. So such a response counts more than curl read:
   - refused up front by its declared Content-Length: what curl read plus the larger of the limit and CUT_ALLOWANCE (256 KB),
     but never more than the declared length;
   - cut during the transfer (chunked, or no length): what curl read plus CUT_ALLOWANCE.
   - stopped by the guard after its headers (a refused type), or killed when a run stopped: what reached the disk plus
     CUT_ALLOWANCE.
   This errs high on purpose. limit is the body limit curl was given. countFor() bounds the allowance by the GET's grant. */
function countedBytes(r, limit) {
  if (!r) return 0;
  if (!r.truncated && !r.stopped && !r.killed) return r.wire || 0;
  const cl = parseInt(r.headers && r.headers['content-length'], 10);
  if (r.truncated && Number.isFinite(cl) && cl > limit) return r.wire + Math.min(Math.max(limit, CUT_ALLOWANCE), cl);
  /* stopped by the guard with a declared, uncompressed length: the server cannot have sent more than the rest of it */
  if (r.stopped && Number.isFinite(cl) && !(r.headers && r.headers['content-encoding'])) return r.wire + Math.min(CUT_ALLOWANCE, Math.max(0, cl - ((r.body && r.body.length) || 0)));
  return (r.wire || 0) + CUT_ALLOWANCE;
}
/* the bytes a GET settles: what curl read, plus the allowance of countedBytes up to the GET's grant. Every grant holds room
   for the allowance (ALLOW), and a GET near a cap may use only what was left, so the bytes counted plus the open
   reservations never pass a cap. */
function countFor(r, limit, grant) {
  const est = countedBytes(r, limit), wire = (r && r.wire) || 0;
  return Math.max(wire, grant && grant.bytes ? Math.min(est, grant.bytes) : est);
}

/* ---------- runs (one log line each) ---------- */

const openRuns = new Set();
let exitHook = false;

/* A run holds the byte tally, the caps and the log line. guard() makes one per context unless given opts.run;
   wf-get makes one per command.
   opts: label (required), kind, mode, logFile, readLogs, stateDir, runCapMB (200), dayCapMB (250), getCapMB (5),
   reserveWaitS (60; how long a GET waits for open reservations before it is refused), onTrip ('throw' | 'close' | function),
   noLog, now (tests).
   Caps trip only on bytes really counted (the logs, the bytes of every run in the tally, and this run's bytes). Open
   reservations never trip a run: a GET they block waits for them to settle, and after reserveWaitS it is refused, not the run. */
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
    blocked: 0, nonGet: 0, leaks: 0, redirectPages: 0, redirectLimit: 0, redirectDirect: 0, joined: 0, shared: 0, unfinished: 0, tooBig: 0, refusedAgain: 0, waits: 0, waitRefused: 0, failed: 0, redirectsIn: 0, redirectsFollowed: 0,
    missList: [], error: null, closed: false, contexts: new Set(), pending: new Set(), inflight: new Set(), refusedKeys: new Set(),
    reserveWaitMs: (opts.reserveWaitS != null ? opts.reserveWaitS : 60) * 1000,
  };
  const day = run.startedAt;
  let logBase = 0, logRead = 0;
  const readLogBase = (t) => {
    const skip = new Set(Object.keys((t || readTally(run.stateDir, day)).runs));
    logBase = readDailyTotalMB(run.readLogs, day, { skipRuns: skip }) * MB; logRead = Date.now();
  };
  readLogBase();
  /* the day's total in bytes really counted: the logs, the other runs in the tally and this run (no reservations) */
  run.dayBaseBytes = () => { const t = readTally(run.stateDir, day); return logBase + tallyBytes(t, run.id, false); };
  const write = (t, extra) => {
    t.runs[run.id] = Object.assign({ label: run.label, kind: run.kind, pid: process.pid, pidStart: MY_START, bytes: run.bytes, reserved: run.reserved, closed: run.closed, started: run.startedAt.toISOString(), updated: new Date().toISOString() }, extra || {});
    writeTally(run.stateDir, day, t);
  };
  /* the real day total as seen under the lock (the logs, other runs' counted bytes and this run's bytes) */
  const realDay = t => {
    if (Date.now() - logRead > 10000) {
      /* a log line that cannot be read stops a new run at its start; during a run the last good total is kept and a warning printed */
      try { readLogBase(t); } catch (e) { logRead = Date.now(); if (!run.logWarned) { run.logWarned = true; console.error(e.message); } }
    }
    return logBase + tallyBytes(t, run.id, false) + run.bytes;
  };
  const start = withLock(run.stateDir, () => { const t = readTally(run.stateDir, day); const total = realDay(t); if (total < run.dayCap) write(t); return total; });
  if (start >= run.dayCap) throw new WfBudgetError(`wf-guard: the daily total for ${fmtDay(day)} (logs ${run.readLogs.join(', ')} and the tally in ${run.stateDir}) is already ${(start / MB).toFixed(2)} MB (cap ${run.dayCap / MB} MB); not starting ${run.label}`, { cap: 'day' });

  /* One try at reserving the next GET's bytes in the shared tally. With no arguments it reserves getCapMB plus ALLOW (room for
     the allowance of a refused response), and the grant's body limit is getCapMB. want: the bytes to reserve; pad: the part
     of want that is room for the allowance, not body. Returns { bytes, by, limit }:
     - bytes > 0: granted; by is the cap that set the size ('get', 'run' or 'day'); limit is the body limit for curl.
     - bytes 0, by 'run' or 'day': less than MIN_GRANT is left of that cap in bytes really counted. The run trips.
     - bytes 0, by 'busy': open reservations (of this run or of other runs) hold what is left. Nothing trips; wait and try
       again (reserveWait does).
     - bytes 0, by 'stopped': the run has already stopped.
     A grant is always the full size the real caps allow, never a slice cut by other reservations. So two runs at once can
     never together pass a cap in counted bytes, and a GET is never cut short by another GET's reservation. */
  run.tryReserve = (want, pad) => {
    if (run.error || run.closed) return { bytes: 0, by: 'stopped' };
    if (want == null) { want = run.getCap + ALLOW; pad = ALLOW; }
    pad = Math.max(0, Math.min(+pad || 0, want - 1));
    const g = withLock(run.stateDir, () => {
      const t = readTally(run.stateDir, day);
      const runLeft = run.runCap - run.bytes, dayLeft = run.dayCap - realDay(t);
      const limit = Math.min(want, runLeft, dayLeft);
      const by = limit >= want ? 'get' : (runLeft <= dayLeft ? 'run' : 'day');
      if (limit < want && limit < MIN_GRANT) return { bytes: 0, by, left: Math.max(0, limit) };
      const free = Math.min(runLeft - run.reserved, dayLeft - run.reserved - tallyReserved(t, run.id));
      if (free < limit) return { bytes: 0, by: 'busy', left: limit };
      run.reserved += limit; write(t);
      return { bytes: limit, by, limit: Math.max(1, Math.min(want - pad, limit - (by === 'get' ? 0 : HEADER_ALLOWANCE))) };
    });
    if (!g.bytes && (g.by === 'run' || g.by === 'day')) run.trip(g.by, { left: g.left });
    return g;
  };
  /* kept for callers of the first version: one try, no waiting */
  run.reserve = run.tryReserve;
  /* Reserves the next GET's bytes, waiting while open reservations hold what is left (woken when a GET of this process
     settles, and every 100 to 200 ms for other processes). After waitMs (reserveWaitS) it gives up: { bytes: 0, by: 'busy' },
     and the caller refuses that one GET without tripping the run. cancelled(): true when the caller no longer needs the GET
     (its context closed); the wait then ends with { bytes: 0, by: 'stopped' }. */
  run.reserveWait = async (want, waitMs, cancelled, pad) => {
    const t0 = Date.now(); waitMs = waitMs != null ? waitMs : run.reserveWaitMs;
    let waited = false;
    for (;;) {
      if (cancelled && cancelled()) return { bytes: 0, by: 'stopped' };
      const g = run.tryReserve(want, pad);
      if (g.by !== 'busy') return g;
      if (!waited) { waited = true; run.waits++; }
      if (Date.now() - t0 >= waitMs) { run.waitRefused++; return g; }
      await new Promise(res => {
        const done = () => { clearTimeout(tm); wakers.delete(done); res(); };
        const tm = setTimeout(done, 100 + Math.floor(Math.random() * 100)); wakers.add(done);
      });
    }
  };
  /* records what a GET used and releases its reservation; trips the run when the bytes counted reach a cap */
  run.settle = (grant, used, noTrip) => {
    const b = Math.max(0, +used || 0);
    const total = withLock(run.stateDir, () => {
      const t = readTally(run.stateDir, day);
      run.reserved = Math.max(0, run.reserved - ((grant && grant.bytes) || 0)); run.bytes += b; write(t); return realDay(t);
    });
    wakeAll();
    if (noTrip) return;
    if (run.bytes >= run.runCap) run.trip('run');
    else if (total >= run.dayCap) run.trip('day', { total });
  };
  run.add = (bytes) => run.settle(null, bytes);
  /* stops the run at a cap. info: { refused: url, left } when a GET was refused because it was larger than what was left,
     { left } when too little was left for another GET, { total } for the day total */
  run.trip = (cap, info) => {
    if (run.error || run.closed) return;
    info = info || {};
    const f = x => (Math.max(0, x) / MB).toFixed(2);
    const capText = cap === 'run' ? `the run cap of ${run.runCap / MB} MB` : `the daily cap of ${run.dayCap / MB} MB for ${fmtDay(day)}`;
    let msg;
    if (info.refused) msg = `wf-guard: ${run.label} stopped at ${capText}: a GET of ${info.refused} was refused because it was larger than the ${f(info.left)} MB left; ${f(run.bytes)} MB counted from Webflow in this run, the refused GET included`;
    else if (info.left != null) msg = `wf-guard: ${run.label} stopped at ${capText}: ${f(run.bytes)} MB counted from Webflow in this run and ${f(info.left)} MB left, too little for another GET`;
    else if (cap === 'run') msg = `wf-guard: ${run.label} counted ${f(run.bytes)} MB from Webflow, which reached ${capText}; run stopped`;
    else msg = `wf-guard: ${run.label} brought the ${fmtDay(day)} total to ${f(info.total != null ? info.total : run.dayBaseBytes() + run.bytes)} MB (${f(run.bytes)} MB in this run), which reached ${capText}; run stopped`;
    run.error = new WfBudgetError(msg, { cap, bytes: run.bytes, refused: info.refused || null });
    run.close();
    for (const c of run.contexts) c.close().catch(() => { });
    if (typeof run.onTrip === 'function') run.onTrip(run.error);
    else if (run.onTrip === 'throw') { const e = run.error; process.nextTick(() => { throw e; }); }
  };
  run.check = () => { if (run.error) throw run.error; };
  run.line = () => logLine(run);
  /* stops fetches still running and counts them as unfinished responses: what they received so far plus the allowance (the
     server may have sent more), up to their grant */
  run.killInflight = () => {
    for (const ent of [...run.inflight]) {
      run.inflight.delete(ent);
      if (ent.settled) continue; ent.settled = true;
      const got = ent.job.kill();
      run.unfinished++; run.responses++;
      run.settle(ent.grant, countFor({ wire: got, killed: true }, 0, ent.grant), true);
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
  } else {
    s += `wf-guard ${r.mode} run ${r.id}, ${r.pageLoads} page loads, ${r.gets} Webflow GETs, ${mb} MB from Webflow (M); ${r.cacheHits} served from the cache, ${r.misses} cache misses aborted, ${r.blocked} images, video or fonts aborted, ${r.nonGet} non-GET requests aborted`;
    if (r.cacheRefused) extra.push(`${r.cacheRefused} refused as fetched before`);
  }
  if (r.tooBig) extra.push(`${r.tooBig} over the size limit`);
  if (r.refusedAgain) extra.push(`${r.refusedAgain} refused again as over the size limit earlier in the run`);
  if (r.redirectLimit) extra.push(`${r.redirectLimit} aborted after 20 redirects`);
  if (r.waitRefused) extra.push(`${r.waitRefused} refused after waiting for other GETs to settle`);
  if (r.redirectDirect) extra.push(`${r.redirectDirect} redirected page loads answered directly to stop a loop`);
  if (r.shared) extra.push(`${r.shared} served from a GET already in flight`);
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
   JSON array is the default, used by the tests to keep every request on this machine).
   o.watch({ status, headers, head }): called every 5 ms once the response headers are in (curl flushes its header file per
   line); head is the first 16 bytes of the body so far. It returns null to let the transfer go on, 'wait' to be asked
   again, or a reason: curl is then stopped at once, and the result has stopped: <reason> (wire is what reached the disk). */
function curlFetch(url, o) {
  o = o || {};
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wfg-curl-'));
  const hf = path.join(dir, 'h'), bf = path.join(dir, 'b');
  let extra = o.curlArgs;
  if (!extra && process.env.WF_GUARD_CURL_ARGS) { try { extra = JSON.parse(process.env.WF_GUARD_CURL_ARGS); } catch (e) { } }
  const args = ['-sS', '--compressed', '--max-time', String(o.timeoutS || 30), '-D', hf, '-o', bf,
    '-w', '%{http_code} %{size_download} %{size_header} %{exitcode}', '-A', (o.headers && o.headers['user-agent']) || 'Mozilla/5.0 (wf-guard bandwidth-counted check)'];
  if (o.maxBytes) args.push('--max-filesize', String(Math.max(1, Math.floor(o.maxBytes))));
  /* with a watch, curl writes the body as it comes (no output buffer), so the first bytes can be read at once */
  if (typeof o.watch === 'function') args.push('--no-buffer');
  for (const [k, v] of Object.entries(o.headers || {})) if (k !== 'user-agent' && v != null) args.push('-H', `${k}: ${v}`);
  args.push(...(extra || []), '--url', url);
  const size = f => { try { return fs.statSync(f).size; } catch (e) { return 0; } };
  const cleanup = () => { try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { } };
  let child, killed = false, stopped = null, poll = null;
  const statusOf = t => { const i = String(t).lastIndexOf('HTTP/'); const m = i < 0 ? null : /^HTTP\/\S+\s+(\d{3})/.exec(t.slice(i)); return m ? +m[1] : 0; };
  const watchOnce = () => {
    let t; try { t = fs.readFileSync(hf, 'latin1'); } catch (e) { return; }
    const i = t.lastIndexOf('HTTP/'); if (i < 0) return;
    const blk = t.slice(i); if (!/\r?\n\r?\n/.test(blk)) return;
    const status = statusOf(blk); if (!status || status < 200) return;
    let head = Buffer.alloc(0);
    try { const fd = fs.openSync(bf, 'r'); const b = Buffer.alloc(16); const n = fs.readSync(fd, b, 0, 16, 0); fs.closeSync(fd); head = b.subarray(0, n); } catch (e) { }
    let v = null; try { v = o.watch({ status, headers: parseHeaderFile(blk), head }); } catch (e) { v = null; }
    if (v === 'wait') return;
    clearInterval(poll); poll = null;
    if (v) { stopped = String(v); try { child.kill('SIGKILL'); } catch (e) { } }
  };
  const promise = new Promise(resolve => {
    let out = '', err = '';
    try { child = spawn(o.curl || 'curl', args, { stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { cleanup(); return resolve({ status: 0, headers: {}, body: Buffer.alloc(0), wire: 0, exit: -1, error: String(e) }); }
    if (typeof o.watch === 'function') poll = setInterval(watchOnce, 5);
    child.stdout.on('data', d => { out += d; }); child.stderr.on('data', d => { err += d; });
    child.on('error', e => { err += String(e); });
    child.on('close', code => {
      if (poll) { clearInterval(poll); poll = null; }
      const [st, dl, hd, ex] = out.trim().split(' ').map(Number);
      let body = Buffer.alloc(0), headers = {}, htext = '';
      try { body = fs.readFileSync(bf); } catch (e) { }
      try { htext = fs.readFileSync(hf, 'latin1'); headers = parseHeaderFile(htext); } catch (e) { }
      const exit = Number.isFinite(ex) ? ex : (code == null ? -1 : code);
      const wire = Number.isFinite(dl) ? (dl || 0) + (hd || 0) : size(bf) + size(hf);
      cleanup();
      resolve({ status: st || statusOf(htext), headers, body, wire, exit, truncated: exit === 63, timedOut: exit === 28, killed, stopped: stopped || undefined, error: exit ? err.trim() || `curl exit ${exit}` : undefined });
    });
  });
  return { promise, kill: () => { killed = true; const n = size(bf) + size(hf); try { child && child.kill('SIGKILL'); } catch (e) { } return n; } };
}

/* ---------- the local cache (same layout as scratchpad nov21/sweep-cache/assets) ---------- */

/* <dir>/<sha1(key)>.b holds the body, <dir>/<sha1(key)>.json {u, status, headers} (written last). The key is the URL, or
   "<url> [range <Range header>]" for a range request. <dir>/<sha1(key)>.claim is created with O_EXCL before the one network
   fetch of a key, so no two contexts or processes fetch the same key, and a key whose fetch failed is never fetched again.
   <dir>/wf-guard-fetched.txt lists every key sent to the network; it and an asset-index.txt next to <dir> (the sweep cache's
   list) count as fetched too. A line "released <sha1> <key> <time>" undoes the claim of a key whose GET was refused before
   anything was sent (release()). One cache object per folder in a process. */
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
      try {
        for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
          const w = l.split(' ');
          if (w[0] === 'released') { const u = w.slice(2, -1).join(' '); if (u) s.delete(u); continue; }
          const u = w.slice(1, -1).join(' ') || w[1]; if (u) s.add(u);
        }
      } catch (e) { }
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
    /* undoes claim(key) for a GET that was refused before anything was sent, so the key may be fetched later */
    release(key) {
      try { fs.rmSync(k(key) + '.claim', { force: true }); } catch (e) { }
      try { fs.appendFileSync(listFile, `released ${sha1(key)} ${key} ${new Date().toISOString()}\n`); } catch (e) { }
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

/* the body limit for curl: the grant's own limit (tryReserve), else the grant, less room for the headers when the grant is
   what is left of a cap */
const bodyLimit = g => (g.limit != null ? g.limit : Math.max(1, g.bytes - (g.by === 'get' ? 0 : HEADER_ALLOWANCE)));

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
/* a URL in the form Chromium sends it: no fragment, and '|' and '^' in the path escaped (Node's URL keeps them; Chromium
   escapes no other printable ASCII character differently; all of them were checked) */
const chromeForm = x => { try { const y = new URL(x); y.hash = ''; y.pathname = y.pathname.replace(/\|/g, '%7C').replace(/\^/g, '%5E'); return y.href; } catch (e) { return String(x); } };
/* the same with every escape decoded, to match a URL whose escapes differ in a way chromeForm does not cover */
const looseForm = x => { const c = chromeForm(x); try { return decodeURIComponent(c); } catch (e) { return c; } };
const REDIRECT_MARK = 'x-wf-guard-redirect';
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
  let ctxClosed = false;
  run.contexts.add(context);
  context[PATCHED] = true;
  const track = p => { run.pending.add(p); const done = () => { run.pending.delete(p); }; p.then(done, done); return p; };

  /* the types a mode refuses for a URL whose own class is 'doc' (an extensionless fetch, or a URL with a non-media extension) */
  const refusedType = ct => ct !== 'doc' && (mode === 'block' || (ct === 'video' && !allow.video) || (ct === 'font' && !allow.font));
  /* One GET from Webflow with curl: counted, capped at what is left of the budget. Every GET reserves getCapMB plus room for
     the allowance (or o.body plus that room when the size is known), also with a small Range header, as the first version
     did: a Range header the server ignores can bring the whole file. A response refused or cut at a size limit is counted
     with an allowance (countFor) and remembered, so this run never asks for it again.
     o.probe: no content type check and no size-limit count here (probeGet decides). o.watch: see curlFetch. o.ext: an
     extensionless URL, whose application/octet-stream answer is checked for a video header (A-6).
     A GET refused before anything was sent (no grant) comes back with unsent: true. */
  async function netGet(url, headers, cls, o) {
    o = o || {};
    const rkey = headers.range ? `${url} [range ${headers.range}]` : url;
    if (run.refusedKeys.has(rkey)) { run.refusedAgain++; return { abort: 'over the size limit earlier in this run' }; }
    const body = Math.max(1, Math.min(run.getCap, o.body != null ? o.body : run.getCap));
    const grant = await run.reserveWait(body + ALLOW, null, () => ctxClosed, ALLOW);
    if (!grant.bytes) return { unsent: true, abort: grant.by === 'busy' ? `other GETs held what is left of the budget for ${run.reserveWaitMs / 1000} s; this GET is refused, the run goes on` : ctxClosed ? 'its context closed' : 'stopped at a cap' };
    const h = {}; for (const x of ['range', 'accept', 'user-agent', 'accept-language']) if (headers[x]) h[x] = headers[x];
    const limit = bodyLimit(grant);
    const job = curlFetch(url, Object.assign({ headers: h, maxBytes: limit, watch: o.watch }, fetchOpts));
    const ent = { job, grant, settled: false }; run.inflight.add(ent);
    const r = await job.promise;
    run.inflight.delete(ent);
    if (ent.settled) return { abort: 'stopped' };
    ent.settled = true;
    run.gets++; run.responses++; if (r.status !== 200 && r.status !== 206) run.non200++;
    if (r.timedOut) run.unfinished++;
    /* refused at the cap only when the cap set the limit; a response larger than a known size or getCapMB is over the size limit */
    const atCap = r.truncated && grant.by !== 'get' && limit < body;
    if (r.truncated) { run.refusedKeys.add(rkey); if (!atCap && !o.probe) run.tooBig++; }
    run.settle(grant, countFor(r, limit, grant), atCap);
    if (atCap) { run.trip(grant.by, { refused: url, left: grant.bytes }); return { abort: 'stopped at a cap' }; }
    if (r.stopped) return { abort: r.stopped, stopped: true, status: r.status, headers: r.headers };
    if (r.truncated) return { abort: 'over the size limit', truncated: true, status: r.status, headers: r.headers };
    if (r.exit) { if (!r.timedOut) run.failed++; return { abort: r.timedOut ? 'timed out' : 'failed' }; }
    const ct = typeOf(r.headers, o.ext ? r.body : null);
    if (!o.probe && cls === 'doc' && refusedType(ct)) { run.blocked++; return { abort: `content type ${ct}` }; }
    return { status: r.status, headers: r.headers, body: r.body };
  }

  /* A fetch or XHR of a Webflow URL with no file extension could be a video (fetch() has no 'media' resource type). It is
     asked for with Range: bytes=0-<videoChunkMB - 1>, and curl may take the whole getCapMB. The guard watches the headers
     (and, for application/octet-stream, the first bytes) as they come and stops the transfer at once for:
     a video (by type or by an MP4, MOV or WebM header), a type the mode refuses, or a 206 whose total is over getCapMB (the
     first version refused that file too). Then:
     - a 206 that holds the whole file: served as a 200;
     - a 206 of the first chunk of a larger file of an allowed type: only the rest (bytes=<chunk>-<total - 1>) is fetched and
       joined to the chunk, so the file is fetched once in all (R-1);
     - a 200 (the server ignored the Range header): kept as the answer, as the first version would have fetched it;
     - a 206 with no total, or a 416: fetched again whole, as before. */
  async function probeGet(url, headers, cls) {
    const probe = `bytes=0-${videoChunk - 1}`;
    const watch = ({ status, headers: h, head }) => {
      if (isOctet(h['content-type']) && head.length < 12) return 'wait';
      const ct = typeOf(h, head);
      if (ct === 'video' || refusedType(ct)) return `content type ${ct}`;
      if (status === 206) { const cr = contentRange(h['content-range']); if (cr && cr.total != null && cr.total > run.getCap) return 'over the size limit'; }
      return null;
    };
    const r = await netGet(url, Object.assign({}, headers, { range: probe }), cls, { probe: true, watch, ext: true });
    if (r.stopped && /^content type/.test(r.abort)) {
      run.blocked++;
      return { abort: `${r.abort} on an extensionless fetch, stopped after its headers${/video/.test(r.abort) && allow.video ? ' (video needs a Range header)' : ''}` };
    }
    if (r.stopped || r.truncated) { run.tooBig++; run.refusedKeys.add(`${url} [range ${probe}]`); return { abort: 'over the size limit' }; }
    if (r.abort) return r;
    const ct = typeOf(r.headers, r.body);
    if (ct === 'video' || refusedType(ct)) {
      run.blocked++;
      return { abort: `content type ${ct} on an extensionless fetch, stopped after at most ${videoChunk} bytes${ct === 'video' && allow.video ? ' (video needs a Range header)' : ''}` };
    }
    if (r.status === 206) {
      const cr = contentRange(r.headers['content-range']);
      if (cr && cr.a === 0 && r.body.length === cr.b + 1 && cr.total != null) {
        const hd = Object.assign({}, r.headers); delete hd['content-range'];
        if (cr.b + 1 === cr.total) return { status: 200, headers: hd, body: r.body };
        if (cr.total > run.getCap) { run.tooBig++; run.refusedKeys.add(`${url} [range ${probe}]`); return { abort: 'over the size limit' }; }
        const rest = await netGet(url, Object.assign({}, headers, { range: `bytes=${cr.b + 1}-${cr.total - 1}` }), cls, { probe: true, body: cr.total - cr.b - 1 });
        if (rest.truncated || rest.stopped) { run.tooBig++; return { abort: 'over the size limit' }; }
        if (rest.abort) return { abort: rest.abort };   /* not unsent: the first chunk was fetched */
        const rc = contentRange(rest.headers['content-range']);
        if (rest.status === 206 && rc && rc.a === cr.b + 1 && rc.total === cr.total && rest.body.length === cr.total - cr.b - 1) {
          run.joined++;
          return { status: 200, headers: hd, body: Buffer.concat([r.body, rest.body]) };
        }
        if (rest.status === 200 && rest.body.length === cr.total) return { status: 200, headers: rest.headers, body: rest.body };
        run.failed++; return { abort: 'failed: the rest of the file did not match its first chunk' };
      }
      return netGet(url, headers, cls, { ext: true });
    }
    if (r.status === 416) return netGet(url, headers, cls, { ext: true });
    return r;
  }
  const extensionless = u => !/\.[A-Za-z0-9]{1,8}$/.test(decodedPath(u).split('/').pop() || '');
  /* a video asked for with a Range header (or an extensionless fetch with the page's own Range) whose server ignores the
     Range and starts a whole file larger than a chunk is stopped at its headers: video comes only in pieces */
  const rangeWatch = ({ status, headers: h, head }) => {
    if (status !== 200) return null;
    if (isOctet(h['content-type']) && head.length < 12) return 'wait';
    const ct = typeOf(h, head), cl = parseInt(h['content-length'], 10);
    if (ct === 'video' && !(Number.isFinite(cl) && cl <= videoChunk)) return 'content type video: the server ignored the Range header';
    return null;
  };

  /* block mode: Webflow GETs of one context that are in flight, by key; a second request for the same key waits for the
     first and gets the same answer (A-3) */
  const blockInflight = new Map();
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
    /* video (fetch-once with allowVideo), and an extensionless fetch or XHR that sends its own Range header: the range is cut
       to videoChunkMB. Video without a Range header is refused; an extensionless fetch without one is probed (probeGet). */
    const ext = !nav && cls === 'doc' && /^(fetch|xhr)$/.test(rtype) && extensionless(url);
    if (cls === 'video' || (ext && range)) {
      const b = boundRange(range, videoChunk);
      if (!b && cls === 'video') { run.blocked++; return { abort: 'video without a Range header' }; }
      if (b && b !== range) { range = b; headers = Object.assign({}, headers, { range }); if (cache) { const hit = cache.get(`${url} [range ${range}]`); if (hit) { run.cacheHits++; return hit; } } }
      if (!b) { range = null; headers = Object.assign({}, headers); delete headers.range; }
    }
    const get = async () => {
      if (ext && !range) return probeGet(url, headers, cls);
      const r = await netGet(url, headers, cls, range && (cls === 'video' || ext) ? { watch: rangeWatch, ext } : { ext });
      if (r.stopped && /^content type/.test(r.abort)) run.blocked++;
      return r;
    };
    const key = range ? `${url} [range ${range}]` : url;
    if (mode === 'block') {
      const bk = (ext ? 'ext ' : '') + key;
      if (blockInflight.has(bk)) { run.shared++; return blockInflight.get(bk); }
      const p = get(); blockInflight.set(bk, p);
      try { return await p; } finally { blockInflight.delete(bk); }
    }
    /* fetch-once: each key goes to the network once, ever (the claim file). A claim whose GET was refused before anything was
       sent (no grant: waited too long, context closed, run stopped) is released, so a later run may fetch it (A-4). */
    if (cache.inflight.has(key)) { await cache.inflight.get(key).catch(() => { }); const h = cache.get(key); if (h) { run.cacheHits++; return h; } run.cacheRefused++; return { abort: 'its one fetch failed' }; }
    if (!cache.claim(key)) { const h = await cache.waitFor(key, 60000); if (h) { run.cacheHits++; return h; } run.cacheRefused++; return { abort: 'fetched before' }; }
    const p = get().then(r => {
      if (!r.abort) { cache.put(key, r.status, r.headers, r.body); run.cacheFetches++; } else if (r.unsent) cache.release(key);
      return r;
    }, e => { throw e; });
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

  /* A main-frame page load that the guard followed through redirects to another URL: the final answer is kept here for a
     short time, and the first request gets a small page that calls location.replace(<final URL>). The browser then loads
     the final URL as its own request, which this map answers without a second fetch, so location and relative links are
     right. Each entry is used once and belongs to one page.
     A-1: the final URL is kept and sent in the form Chromium requests it (chromeForm: '|' and '^' in the path escaped, no
     fragment), with a looser form (every escape decoded) as a second key. A redirect page is never served twice in one
     chain: when the browser comes back with a URL this page was just sent to, or a context has had REDIRECT_MAX redirect
     pages in REDIRECT_WINDOW_MS, the final answer is served for the request as it is (the first version's behavior). */
  const navReplay = new Map(), sentTo = new Map(), redirectTimes = [];
  const REPLAY_MS = 30000, REDIRECT_WINDOW_MS = 10000, REDIRECT_MAX = 8;
  const redirectPage = final => `<!doctype html><meta charset="utf-8"><title>redirect</title><script>location.replace(${JSON.stringify(final).replace(/</g, '\\u003c')})</script>`;
  /* tests only (redirectTargetForm 'node'): the round 2 form of URLs (Node's), to show that the chain limit alone stops a loop */
  const navKeyNode = x => { try { const y = new URL(x); y.hash = ''; return y.href; } catch (e) { return x; } };
  const nodeForm = opts.redirectTargetForm === 'node';
  const F = nodeForm ? navKeyNode : chromeForm;
  const isMainNav = req => { try { return req.isNavigationRequest() && !req.frame().parentFrame(); } catch (e) { return false; } };
  const pageIds = new WeakMap(); let nextPageId = 0;
  const pageOfReq = req => { try { return req.frame().page(); } catch (e) { return null; } };
  const pageKey = req => { const p = pageOfReq(req); if (!p) return '0'; if (!pageIds.has(p)) pageIds.set(p, String(++nextPageId)); return pageIds.get(p); };
  const prune = now => {
    for (const [k, e] of navReplay) if (now - e.at >= REPLAY_MS) navReplay.delete(k);
    for (const [k, at] of sentTo) if (now - at >= REPLAY_MS) sentTo.delete(k);
    while (redirectTimes.length && now - redirectTimes[0] >= REDIRECT_WINDOW_MS) redirectTimes.shift();
  };
  /* the stored final answer for this page and URL, or null (used once) */
  const takeReplay = (pid, u) => {
    const now = Date.now(); prune(now);
    let k = `${pid} ${F(u)}`;
    if (!navReplay.has(k)) { const lf = looseForm(u); k = null; for (const [k2, e2] of navReplay) if (k2.startsWith(pid + ' ') && e2.loose === lf) { k = k2; break; } }
    if (!k) return null;
    const e = navReplay.get(k); navReplay.delete(k); return e;
  };

  /* the guard's own handler: the last word for every request */
  async function handler(route) {
    const req = route.request(), u = req.url();
    handled.add(req);
    try {
      if (req.method() !== 'GET') { run.nonGet++; return await route.abort('blockedbyclient'); }
      if (!/^https?:/i.test(u)) return await route.fallback();
      const mainNav = isMainNav(req), pid = mainNav ? pageKey(req) : null;
      if (mainNav) { const e = takeReplay(pid, u); if (e) return await route.fulfill({ status: e.status, headers: e.headers, body: e.body }); }
      if (!isWf(u) && !strict) return await route.fallback();
      /* every hop is fetched here, so a redirect into a Webflow host comes back to the guard; the browser gets the last answer */
      const p = fetchGuarded(u, req.headers(), req.resourceType(), 20, url => route.fetch({ url, maxRedirects: 0 }), req.isNavigationRequest()); track(p);
      let resp; try { resp = await p; } catch (e) { return await route.abort('blockedbyclient'); }
      const ans = resp[FAKE] ? { status: resp[FAKE].status, headers: cleanHeaders(resp[FAKE].headers), body: resp[FAKE].body } : null;
      const final = resp.url(), st = resp.status();
      /* still a redirect after 20 hops: abort. Fulfilling it would let Chromium follow the next hop itself, unrouted. */
      if (st >= 300 && st < 400 && resp.headers().location) { run.redirectLimit++; return await route.abort('failed'); }
      const jsOff = context._options && context._options.javaScriptEnabled === false;
      if (mainNav && !jsOff && final && F(final) !== F(u) && !(st >= 300 && st < 400)) {
        const now = Date.now(); prune(now);
        const inChain = sentTo.has(`${pid} ${F(u)}`) || sentTo.has(`${pid} ${looseForm(u)}`);
        if (inChain || redirectTimes.length >= REDIRECT_MAX) {
          run.redirectDirect++;
        } else {
          const a = ans || { status: st, headers: cleanHeaders(resp.headers()), body: await resp.body() };
          const to = F(final);
          navReplay.set(`${pid} ${to}`, Object.assign({ at: now, loose: nodeForm ? null : looseForm(final) }, a));
          sentTo.set(`${pid} ${to}`, now); sentTo.set(`${pid} ${looseForm(final)}`, now); redirectTimes.push(now);
          run.redirectPages++;
          return await route.fulfill({ status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', [REDIRECT_MARK]: '1' }, body: redirectPage(to) });
        }
      }
      if (ans) return await route.fulfill(ans);
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
    /* a sendBeacon or non-GET fetch() stopped by the init script while the page is alive counts as a non-GET request aborted.
       One stopped at unload is not counted: the page is gone by then and its call never reaches this binding. */
    context.exposeBinding(binding, () => { if (!run.closed) run.nonGet++; }).catch(() => { }),
    context.addInitScript(UNLOAD_GUARD, cfg),
  ]).then(() => { });
  patch(context);
  for (const p of context.pages()) patch(p);
  context.on('page', patch);

  /* page loads: main-frame Webflow pages answered (from the cache or the network). Also keeps each page's last main-frame
     response for finalResponse(). */
  const lastMain = new WeakMap();
  context.on('response', resp => {
    try {
      const req = resp.request(), st = resp.status();
      if (!req.isNavigationRequest() || req.frame().parentFrame()) return;
      const redirect = !!resp.headers()[REDIRECT_MARK];
      if (isWf(resp.url()) && !(st >= 300 && st < 400) && !redirect) run.pageLoads++;
      const pg = req.frame().page(); const e = lastMain.get(pg) || { waiters: [] };
      e.resp = resp; e.redirect = redirect; lastMain.set(pg, e);
      if (!redirect) { const ws = e.waiters; e.waiters = []; for (const w of ws) w(resp); }
    } catch (e) { }
  });
  /* R-4: page.goto() on a URL that redirects returns the guard's small redirect page (status 200, header
     x-wf-guard-redirect). finalResponse(page) gives the response of the page it led to (waiting for it if needed; null after
     timeoutMs), or the last main-frame response when there was no redirect page. */
  const finalResponse = (page, timeoutMs) => {
    const e = lastMain.get(page);
    if (!e) return Promise.resolve(null);
    if (!e.redirect) return Promise.resolve(e.resp);
    return new Promise(res => {
      const t = setTimeout(() => { e.waiters = e.waiters.filter(w => w !== done); res(null); }, timeoutMs || 30000);
      const done = r => { clearTimeout(t); res(r); };
      e.waiters.push(done);
    });
  };
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
    finalResponse,
    /* page.goto(url, o) that returns the final page's response, not the guard's redirect page */
    goto: async (page, url, o) => { const r = await page.goto(url, o); return r && r.headers()[REDIRECT_MARK] ? finalResponse(page, (o && o.timeout) || 30000) : r; },
    stats: () => ({
      label: run.label, mode: run.mode, id: run.id, bytes: run.bytes, mb: +(run.bytes / MB).toFixed(3), pageLoads: run.pageLoads, gets: run.gets,
      responses: run.responses, cacheHits: run.cacheHits, cacheFetches: run.cacheFetches, cacheRefused: run.cacheRefused, misses: run.misses,
      missList: run.missList.slice(), blocked: run.blocked, nonGet: run.nonGet, leaks: run.leaks, refusedAgain: run.refusedAgain,
      waits: run.waits, waitRefused: run.waitRefused, redirectPages: run.redirectPages, redirectLimit: run.redirectLimit, redirectDirect: run.redirectDirect, joined: run.joined, shared: run.shared,
      unfinished: run.unfinished, tooBig: run.tooBig, failed: run.failed, redirectsIn: run.redirectsIn, redirectsFollowed: run.redirectsFollowed, lastWord,
      dayBaseMB: +(run.dayBaseBytes() / MB).toFixed(3), stopped: run.error ? run.error.cap : null,
    }),
    check: () => run.check(),
    /* writes the log line (own run only) after fetches and counts in flight are done; closing the context does the same */
    close: async () => { run.contexts.delete(context); if (own) await run.closeAsync(); },
  };
  context.once('close', () => { ctxClosed = true; wakeAll(); handle.close().catch(() => { }); });
  return handle;
}

module.exports = {
  guard, createRun, curlFetch, bodyLimit, countedBytes, countFor, CUT_ALLOWANCE, ALLOW, makeCache, chromeForm, looksLikeVideo, procStart, cacheLookup, boundRange, WfBudgetError, WfLogFormatError, isWebflowUrl, hostMatcher, classify, classifyType,
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
