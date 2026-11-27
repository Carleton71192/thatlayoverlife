#!/usr/bin/env node
'use strict';
/* wf-get: plain HTML GETs with the wf-guard counting, caps and log line (rules 3, 4 and 6 of
   reports/bandwidth-2026-11-13.md section 4). Uses curl (it honors the session proxy) with --compressed, so the
   counted bytes are the bytes on the wire: body as received plus headers.
   Usage:
     node tools/wf-get.cjs --label <task> [--out <dir>] [--max <n>] [--max-filesize <MB>] [--cache <dir>] [--log <file>] <url> ...
     node tools/wf-get.cjs --label <task> --list urls.txt
   Saves each page to <out>/<path with / as __>.html (home is home.html) and prints "status bytes file url".
   <out> defaults to wf-get-out/<label> in the repository root this script sits in (not the current folder); the log line goes
   to handoff/BANDWIDTH-LOG.md of that same checkout. Both paths are fixed, wherever the command runs from.
   Limits: at most --max GETs (default 30; a redirect hop is a GET), at most --max-filesize MB per GET (default 5; curl stops the
   transfer there), and never more than is left of the run cap (200 MB) or the daily cap (250 MB, shared with every other run).
   A GET that other runs' open reservations block waits for them (up to 60 s) and is then refused; only bytes really counted
   stop the run. A GET refused or cut at a size limit counts with an allowance and is not asked for again in the same run.
   Redirects are followed by hand, one hop at a time (at most 5). Images, video and fonts are refused: by the URL before any
   request, by a redirect target before it is fetched, and by the content type after a GET (the file is then deleted).
   Only GET is ever sent. --cache <dir> also stores each 200 answer in the wf-guard cache layout, so a 'cache-only' browser run
   can use it. Exit code 0 when all done, 3 when a cap stopped it, 2 on bad arguments. One log line is appended at the end. */
const fs = require('fs'), path = require('path');
const W = require('./wf-guard.cjs');
const { createRun, hostMatcher, WfBudgetError, curlFetch, classify, classifyType, fileFor, makeCache, REPO_ROOT } = W;

const MAX_GETS = 30, MAX_FILE_MB = 5, MAX_HOPS = 5;
const safeLabel = s => String(s).replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'run';
const defaultOut = label => path.join(REPO_ROOT, 'wf-get-out', safeLabel(label));

/* opts: label, out, max, maxFileMB, cache, logFile, readLogs, stateDir, hosts, runCapMB, dayCapMB, now, curl, curlArgs, quiet */
async function wfGet(urls, opts) {
  opts = Object.assign({}, opts);
  if (!opts.label) throw new Error('wf-get: --label is required');
  const out = opts.out ? path.resolve(opts.out) : defaultOut(opts.label);
  const max = opts.max != null ? opts.max : MAX_GETS;
  const maxFileMB = opts.maxFileMB != null ? opts.maxFileMB : MAX_FILE_MB;
  const isWf = hostMatcher(opts.hosts);
  const run = createRun(Object.assign({}, opts, { kind: 'wf-get', mode: 'get', onTrip: 'close', getCapMB: maxFileMB }));
  const cache = opts.cache ? makeCache(opts.cache) : null;
  fs.mkdirSync(out, { recursive: true });
  const results = []; let stopped = null;
  const say = r => { if (!opts.quiet) console.log(`${r.status || 0} ${r.bytes || 0} ${r.file ? path.relative(process.cwd(), r.file) : '-'} ${r.url}${r.error ? ' ' + r.error : ''}`); };
  try {
    for (const u0 of urls) {
      if (run.error) { stopped = run.error; break; }
      if (run.gets >= max) { stopped = new Error(`wf-get: --max ${max} GETs reached`); stopped.cap = 'max'; break; }
      let url;
      try { url = new URL(u0).href; } catch (e) { const r = { url: u0, error: 'bad url' }; results.push(r); say(r); continue; }
      if (classify(url) !== 'doc') { const r = { url: u0, error: 'refused: image, video or font' }; results.push(r); say(r); continue; }
      const res = { url: u0, status: 0, bytes: 0, hops: [] };
      for (let hop = 0; ; hop++) {
        if (run.gets >= max) { stopped = new Error(`wf-get: --max ${max} GETs reached`); stopped.cap = 'max'; res.error = 'stopped by --max during redirects'; break; }
        const wf = isWf(url);
        if (wf && run.refusedKeys.has(url)) { run.refusedAgain++; res.error = 'refused: over the size limit earlier in this run'; break; }
        /* waits while other runs' open reservations hold what is left of the daily cap; a cap reached in counted bytes stops the run */
        const grant = wf ? await run.reserveWait(run.getCap) : { bytes: maxFileMB * 1e6, by: 'get' };
        if (!grant.bytes) {
          if (grant.by === 'busy') { res.error = `refused: other runs held what is left of the daily cap for ${run.reserveWaitMs / 1000} s`; break; }
          stopped = run.error; res.error = 'stopped at a cap'; break;
        }
        const limit = W.bodyLimit(grant);
        const r = await curlFetch(url, { maxBytes: limit, timeoutS: 60, curl: opts.curl, curlArgs: opts.curlArgs }).promise;
        run.gets++; if (r.status !== 200) run.non200++;
        /* a response refused or cut at the size limit counts more than curl read (see countedBytes in wf-guard.cjs) */
        const used = wf ? W.countedBytes(r, limit) : 0, atCap = r.truncated && grant.by !== 'get';
        if (wf) {
          run.responses++; if (r.timedOut) run.unfinished++;
          if (r.truncated) { run.refusedKeys.add(url); if (!atCap) run.tooBig++; }
          run.settle(grant, used, atCap);
        }
        res.bytes += used; res.status = r.status; res.hops.push(`${r.status} ${url}`);
        if (r.truncated) { res.error = atCap ? 'stopped at a cap' : `over --max-filesize ${maxFileMB} MB, not saved`; if (atCap) { run.trip(grant.by, { refused: url, left: grant.bytes }); stopped = run.error; } else if (run.error) stopped = run.error; break; }
        if (r.exit) { res.error = r.error || `curl exit ${r.exit}`; break; }
        const loc = r.status >= 300 && r.status < 400 ? r.headers.location : null;
        if (loc) {
          if (hop >= MAX_HOPS) { res.error = `more than ${MAX_HOPS} redirects`; break; }
          const next = new URL(loc, url).href;
          if (classify(next) !== 'doc') { res.error = `refused: redirect to an image, video or font (${next})`; break; }
          if (isWf(next) && !wf) run.redirectsIn++;
          url = next; continue;
        }
        const ct = classifyType(r.headers['content-type']);
        if (ct !== 'doc') { res.error = `refused after the GET: content type ${r.headers['content-type']}, not saved`; break; }
        res.file = path.join(out, fileFor(u0));
        fs.writeFileSync(res.file, r.body);
        if (cache && wf && r.status === 200) cache.put(url, r.status, r.headers, r.body);
        break;
      }
      results.push(res); say(res);
      if (stopped) break;
    }
    if (run.error) stopped = run.error;
  } finally { run.close(); }
  return { results, bytes: run.bytes, gets: run.gets, stopped, line: run.line(), out };
}

module.exports = { wfGet, fileFor, defaultOut, MAX_GETS, MAX_FILE_MB };

if (require.main === module) {
  const a = process.argv.slice(2), o = {}, urls = [];
  const num = (k, v) => { const n = +v; if (!Number.isFinite(n) || n <= 0) { console.error(`${k} needs a positive number`); process.exit(2); } return n; };
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    if (k === '--label') o.label = a[++i];
    else if (k === '--out') o.out = a[++i];
    else if (k === '--max') o.max = num(k, a[++i]);
    else if (k === '--max-filesize') o.maxFileMB = num(k, a[++i]);
    else if (k === '--cache') o.cache = a[++i];
    else if (k === '--log') o.logFile = a[++i];
    else if (k === '--list') urls.push(...fs.readFileSync(a[++i], 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#')));
    else if (k === '--hosts') o.hosts = a[++i].split(',');
    else if (k.startsWith('--')) { console.error('unknown option ' + k); process.exit(2); }
    else urls.push(k);
  }
  if (!o.label || !urls.length) { console.error('usage: node tools/wf-get.cjs --label <task> [--out dir] [--max n] [--max-filesize MB] [--cache dir] [--log file] <url>...'); process.exit(2); }
  wfGet(urls, o).then(r => {
    console.log(`${r.gets} GETs, ${(r.bytes / 1e6).toFixed(2)} MB from Webflow, pages in ${r.out}. Log line: ${r.line}`);
    if (r.stopped) { console.error(r.stopped.message); process.exit(3); }
  }, e => { console.error(e.message); process.exit(e instanceof WfBudgetError ? 3 : 1); });
}
