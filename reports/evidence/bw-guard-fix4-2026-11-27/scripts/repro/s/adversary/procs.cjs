'use strict';
/* P1 to P3: several wf-get processes on one tally (N-1, N-2), and reservations held by a live process.
   Run: node procs.cjs <tools parent> */
const fs = require('fs'), os = require('os'), path = require('path'), { spawn, spawnSync } = require('child_process');
const T = process.argv[2]; const W = require(T + '/tools/wf-guard.cjs');
const { start } = require('./stub3r.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfp-'));
const note = (k, v) => console.log(k, JSON.stringify(v));
const child = (opts, urls) => new Promise(res => { const c = spawn(process.execPath, [path.join(__dirname, 'wfget-child.cjs'), T, JSON.stringify(opts), ...urls], { stdio: ['ignore', 'pipe', 'pipe'] }); let o = ''; c.stdout.on('data', d => o += d); c.on('close', () => { try { res(JSON.parse(o.trim().split('\n').pop())); } catch (e) { res({ raw: o }); } }); });
(async () => {
  const S = await start({}); const CDN = `http://cdn.prod.website-files.com:${S.wf.port}`;
  const tallyMB = st => { const t = W.readTally(st, new Date()); let b = 0; for (const r of Object.values(t.runs)) b += r.bytes || 0; return +(b / 1e6).toFixed(3); };
  /* P1 and P2 */
  for (const [name, n, urlsOf] of [
    ['P1 12 processes, one 190 KB file each', 12, i => [`${CDN}/kb190.js?p=${i}`]],
    ['P2 8 processes, each: 190 KB, 3 MB with Content-Length, 3 MB chunked, 190 KB (max-filesize 1 MB)', 8, i => [`${CDN}/kb190.js?a=${i}`, `${CDN}/ign/big-${i}.js`, `${CDN}/chunked?kb=3000&c=${i}`, `${CDN}/kb190.js?b=${i}`]],
  ]) {
    const st = tmp(), logf = path.join(tmp(), 'log.md'); const h0 = S.wf.hits.length;
    const rs = await Promise.all(Array.from({ length: n }, (_, i) => child({ label: `p${i}`, stateDir: st, logFile: logf, dayCapMB: 1, maxFileMB: 1, out: tmp() }, urlsOf(i))));
    const hs = S.wf.hits.slice(h0);
    note(name + ', day cap 1 MB', { tallyMB: tallyMB(st), logTotalMB: W.dailyTotalMB(fs.readFileSync(logf, 'utf8'), new Date()), stubRequests: hs.length, stubBytesWritten: hs.reduce((a, h) => a + (h.wrote || 0), 0), succeeded200: rs.reduce((a, r) => a + (r.results || []).filter(x => /^200 /.test(x) && !/refused|over|cap/.test(x)).length, 0), perProcess: rs.map(r => r.refusedAtStart ? 'refused at start' : `${r.gets} GETs ${(r.bytes / 1e6).toFixed(3)} MB ${r.stopped ? 'STOPPED' : ''} ${JSON.stringify(r.results)}`) });
  }
  /* P3: a live process holds a reservation of the whole day cap in the tally */
  {
    const st = tmp(); const sl = spawn('sleep', ['30']); const day = new Date();
    fs.mkdirSync(st, { recursive: true });
    fs.writeFileSync(path.join(st, `tally-${day.toISOString().slice(0, 10)}.json`), JSON.stringify({ runs: { fake01: { label: 'holder', pid: sl.pid, bytes: 0, reserved: 1e6, closed: false } } }));
    const run = W.createRun({ label: 'p3', stateDir: st, logFile: path.join(tmp(), 'log.md'), dayCapMB: 1, reserveWaitS: 2, onTrip: 'close' });
    const t0 = Date.now(); const g1 = await run.reserveWait(); const t1 = Date.now();
    sl.kill('SIGKILL'); await new Promise(r => setTimeout(r, 200));
    const g2 = await run.reserveWait(); run.settle(g2, 0);
    note('P3 a live process holds 1 MB reserved, day cap 1 MB, reserveWaitS 2', { first: g1, waitedMs: t1 - t0, tripped: !!run.error, afterHolderDies: g2, waits: run.waits, waitRefused: run.waitRefused });
    run.close();
  }
  /* P4: a dead process's reservation is ignored; a pid that was reused would not be (shown with this process's own pid) */
  {
    const st = tmp(); const day = new Date();
    fs.writeFileSync(path.join(st, `tally-${day.toISOString().slice(0, 10)}.json`), JSON.stringify({ runs: { dead01: { label: 'dead', pid: 999999, bytes: 0, reserved: 1e6, closed: false }, reuse1: { label: 'reused pid', pid: process.ppid, bytes: 0, reserved: 1e6, closed: false } } }));
    const run = W.createRun({ label: 'p4', stateDir: st, logFile: path.join(tmp(), 'log.md'), dayCapMB: 1.5, reserveWaitS: 1, onTrip: 'close' });
    const g = await run.reserveWait(); note('P4 tally: a dead pid with 1 MB reserved, a live unrelated pid with 1 MB reserved, day cap 1.5 MB', { grant: g, tripped: !!run.error });
    run.close();
  }
  S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
