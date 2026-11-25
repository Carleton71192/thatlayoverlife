#!/usr/bin/env node
'use strict';
/* wf-get: plain HTML GETs with the wf-guard counting, caps and log line (rules 3, 4 and 6 of
   reports/bandwidth-2026-11-13.md section 4). Uses curl (it honors the session proxy) with --compressed, so the
   counted bytes are the bytes on the wire: body as received plus headers.
   Usage:
     node tools/wf-get.cjs --label <task> [--out <dir>] [--max <n>] [--log <file>] <url> [<url> ...]
     node tools/wf-get.cjs --label <task> --list urls.txt
   Saves each page to <out>/<path with / as __>.html (home is home.html) and prints "status bytes file url".
   Images, video and fonts are refused (the tool is for HTML, CSS and scripts). Only GET is ever sent.
   Stops before the next URL at 200 MB for the run or 250 MB for the UTC day (log plus this run), or after --max GETs.
   Exit code 0 when all done, 3 when a cap stopped it, 2 on bad arguments. One log line is appended at the end. */
const fs = require('fs'), path = require('path'), { execFile } = require('child_process');
const run1 = (cmd, args) => new Promise(res => execFile(cmd, args, { encoding: 'utf8' }, (err, stdout, stderr) => res({ status: err ? (err.code || 1) : 0, stdout, stderr })));
const { createRun, hostMatcher, WfBudgetError } = require('./wf-guard.cjs');

const MEDIA_EXT = /\.(avif|bmp|gif|ico|jpe?g|png|svg|tiff?|webp|m4a|m4v|mov|mp3|mp4|ogg|ogv|wav|webm|eot|otf|ttf|woff2?)$/i;

function fileFor(u) {
  const x = new URL(u); let p = x.pathname.replace(/\/+$/, '');
  let f = p ? p.replace(/^\//, '').replace(/\//g, '__') : 'home';
  if (x.search) f += '__q_' + x.search.slice(1).replace(/[^A-Za-z0-9=_.-]/g, '_');
  return f.replace(/[^A-Za-z0-9_.=-]/g, '_') + (/\.[a-z0-9]{2,5}$/i.test(f) ? '' : '.html');
}

/* opts: label, out, max, logFile, hosts, runCapMB, dayCapMB, now, curl (path), quiet */
async function wfGet(urls, opts) {
  opts = Object.assign({}, opts);
  const out = opts.out || path.join(process.cwd(), 'wf-get-out');
  fs.mkdirSync(out, { recursive: true });
  const isWf = hostMatcher(opts.hosts);
  const run = createRun(Object.assign({}, opts, { kind: 'wf-get', mode: 'get', onTrip: 'close' }));
  const results = []; let stopped = null;
  try {
    for (const u of urls) {
      if (run.error) { stopped = run.error; break; }
      if (opts.max != null && run.gets >= opts.max) { stopped = new Error(`wf-get: --max ${opts.max} GETs reached`); stopped.cap = 'max'; break; }
      let pathname; try { pathname = new URL(u).pathname; } catch (e) { results.push({ url: u, error: 'bad url' }); continue; }
      if (MEDIA_EXT.test(pathname)) { results.push({ url: u, error: 'refused: image, video or font' }); continue; }
      const file = path.join(out, fileFor(u));
      const r = await run1(opts.curl || 'curl', ['-sS', '--compressed', '-L', '--max-redirs', '5', '--max-time', '60',
        '-A', 'Mozilla/5.0 (wf-get bandwidth-counted check)', '-o', file, '-w', '%{http_code} %{size_download} %{size_header}', u]);
      const [code, body, head] = String(r.stdout || '').trim().split(' ').map(Number);
      const bytes = (body || 0) + (head || 0);
      run.gets++; if (code !== 200) run.non200++;
      if (isWf(u)) { run.responses++; run.add(bytes); }
      const res = { url: u, status: code || 0, bytes, file, error: r.status ? String(r.stderr || '').trim() : undefined };
      results.push(res);
      if (!opts.quiet) console.log(`${res.status} ${bytes} ${path.relative(process.cwd(), file)} ${u}${res.error ? ' ' + res.error : ''}`);
    }
    if (run.error) stopped = run.error;
  } finally { run.close(); }
  return { results, bytes: run.bytes, gets: run.gets, stopped, line: run.line() };
}

module.exports = { wfGet, fileFor };

if (require.main === module) {
  const a = process.argv.slice(2), o = {}, urls = [];
  for (let i = 0; i < a.length; i++) {
    const k = a[i];
    if (k === '--label') o.label = a[++i];
    else if (k === '--out') o.out = a[++i];
    else if (k === '--max') o.max = +a[++i];
    else if (k === '--log') o.logFile = a[++i];
    else if (k === '--list') urls.push(...fs.readFileSync(a[++i], 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#')));
    else if (k === '--hosts') o.hosts = a[++i].split(',');
    else if (k.startsWith('--')) { console.error('unknown option ' + k); process.exit(2); }
    else urls.push(k);
  }
  if (!o.label || !urls.length) { console.error('usage: node tools/wf-get.cjs --label <task> [--out dir] [--max n] [--log file] <url>...'); process.exit(2); }
  wfGet(urls, o).then(r => {
    console.log(`${r.gets} GETs, ${(r.bytes / 1e6).toFixed(2)} MB from Webflow. Log line: ${r.line}`);
    if (r.stopped) { console.error(r.stopped.message); process.exit(3); }
  }, e => { console.error(e.message); process.exit(e instanceof WfBudgetError ? 3 : 1); });
}
