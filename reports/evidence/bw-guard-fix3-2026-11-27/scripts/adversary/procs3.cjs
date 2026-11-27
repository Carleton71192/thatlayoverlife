'use strict';
/* Q1 to Q3: reservations across processes (wf-get children on one tally) and the A-5 start-time check.
   Run: node -r ./dnsmap.cjs procs3.cjs <tools parent> */
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const T = process.argv[2]; const W = require(T + '/tools/wf-guard.cjs');
const { start } = require('./stub4.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wfq-'));
const note = (k, v) => console.log(k, JSON.stringify(v));
const child = (opts, urls) => new Promise(res => { const c = spawn(process.execPath, ['-r', path.join(__dirname, 'dnsmap.cjs'), path.join(__dirname, 'wfget-child.cjs'), T, JSON.stringify(opts), ...urls], { stdio: ['ignore', 'pipe', 'pipe'] }); let o = ''; c.stdout.on('data', d => o += d); c.on('close', () => { try { res(JSON.parse(o.trim().split('\n').pop())); } catch (e) { res({ raw: o }); } }); });
(async () => {
  const S = await start({}); const CDN = `http://cdn.prod.website-files.com:${S.wf.port}`;
  const tallyMB = st => { const t = W.readTally(st, new Date()); let b = 0; for (const r of Object.values(t.runs)) b += r.bytes || 0; return +(b / 1e6).toFixed(3); };
  /* Q1: 10 wf-get processes at once, day cap 2 MB, --max-filesize 1, each asks for two 0.9 MB files and one 3 MB file */
  {
    const st = tmp(), logf = path.join(tmp(), 'log.md'); const h0 = S.wf.hits.length;
    const rs = await Promise.all(Array.from({ length: 10 }, (_, i) => child({ label: `q${i}`, stateDir: st, logFile: logf, dayCapMB: 2, maxFileMB: 1, out: tmp() }, [`${CDN}/kb/a${i}.js?kb=900`, `${CDN}/kb/b${i}.js?kb=3000`, `${CDN}/kb/c${i}.js?kb=900`])));
    const hs = S.wf.hits.slice(h0);
    note('Q1 10 wf-get processes at once, day cap 2 MB, max-filesize 1 MB; files 0.9 MB, 3 MB, 0.9 MB', { tallyMB: tallyMB(st), capMB: 2, stubRequests: hs.length, stubBytesWritten: hs.reduce((a, h) => a + (h.wrote || 0), 0), perProcess: rs.map(r => r.refusedAtStart ? 'refused at start' : `${r.gets} GETs ${(r.bytes / 1e6).toFixed(3)} MB${r.stopped ? ' STOPPED' : ''}`) });
  }
  /* Q2: A-5. A live process (sleep) is in the tally with 1 MB reserved, day cap 1.5 MB, reserveWaitS 1:
     (a) with its real start time: the reservation holds (busy); (b) with another start time (a reused pid): ignored;
     (c) with no start time (an entry from older code): holds. */
  {
    const sl = spawn('sleep', ['20']); await new Promise(r => setTimeout(r, 100));
    const real = W.procStart ? W.procStart(sl.pid) : null;
    for (const [k, ps] of [['a real start time', real], ['b other start time', real != null ? String(+real + 1) : 'x'], ['c no start time', undefined]]) {
      const st = tmp(); const day = new Date();
      const e = { label: 'holder', pid: sl.pid, bytes: 0, reserved: 1e6, closed: false }; if (ps !== undefined) e.pidStart = ps;
      fs.writeFileSync(path.join(st, `tally-${day.toISOString().slice(0, 10)}.json`), JSON.stringify({ runs: { hold01: e } }));
      const run = W.createRun({ label: 'q2', stateDir: st, logFile: path.join(tmp(), 'log.md'), dayCapMB: 1.5, reserveWaitS: 1, onTrip: 'close' });
      const g = await run.reserveWait(); run.settle(g, 0, true);
      note(`Q2${k}: live pid ${sl.pid} holds 1 MB reserved, day cap 1.5 MB`, { storedStart: ps === undefined ? 'none' : ps, grantBytes: g.bytes, by: g.by });
      run.close();
    }
    sl.kill('SIGKILL');
  }
  /* Q3: a run's own entry carries pidStart, and its value is field 22 of /proc/<pid>/stat */
  {
    const st = tmp(); const run = W.createRun({ label: 'q3', stateDir: st, logFile: path.join(tmp(), 'log.md'), onTrip: 'close' });
    const t = W.readTally(st, new Date()); const e = t.runs[run.id];
    const stat = fs.readFileSync('/proc/self/stat', 'utf8'); const f22 = stat.slice(stat.lastIndexOf(')') + 2).split(' ')[19];
    note('Q3 own tally entry', { pid: e.pid, pidStart: e.pidStart, procField22: f22 }); run.close();
  }
  S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
