'use strict';
/* V1 to V3: reservations across processes, sampled while they run, and stale tally entries. No browser.
   node -r ./dnsmap.cjs resv4.cjs <tools parent>
   V1, V2: many wf-get processes on one tally near a day cap; this process reads the tally file every 2 ms and keeps the
   largest "bytes counted by all runs plus open reservations". Delivered bytes are counted by a relay in its own process.
   V3: hand-made tally entries (F-6 and the start-time rule) and a damaged tally file.
   Everything is on 127.0.0.1 (stub5 raw server, relayproc4, curl --connect-to through the wrapper). */
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const T = process.argv[2]; const W = require(path.resolve(T, 'tools/wf-guard.cjs'));
const { start } = require('./stub5.cjs'); const { relay } = require('./relayc.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'v4-'));
const note = (k, v) => console.log(k, JSON.stringify(v));
const child = (opts, urls) => new Promise(res => { const c = spawn(process.execPath, ['-r', path.join(__dirname, 'dnsmap.cjs'), path.join(__dirname, 'wfget-child.cjs'), T, JSON.stringify(opts), ...urls], { stdio: ['ignore', 'pipe', 'pipe'] }); let o = ''; c.stdout.on('data', d => o += d); c.on('close', () => { try { res(JSON.parse(o.trim().split('\n').pop())); } catch (e) { res({ raw: o.slice(0, 200) }); } }); });
const tallyOf = st => { const f = path.join(st, `tally-${new Date().toISOString().slice(0, 10)}.json`); try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
(async () => {
  const S = await start(); const R = await relay(S.port, +(process.env.RELAY_RATE || 0)); if (process.env.RELAY_RATE) console.log('relay rate', process.env.RELAY_RATE); const H = `http://wf.test:${R.port}`;
  const scen = async (tag, n, opts, urlsOf, capBytes) => {
    const st = tmp(), logf = path.join(tmp(), 'log.md'), m0 = await R.mark(), h0 = S.hits.length;
    let max = 0, maxAt = null, samples = 0, stop = false;
    const poll = (async () => { while (!stop) { const t = tallyOf(st); if (t) { samples++; let b = 0, r = 0; for (const x of Object.values(t.runs || {})) { b += +x.bytes || 0; if (!x.closed) r += +x.reserved || 0; } if (b + r > max) { max = b + r; maxAt = { counted: b, reserved: r }; } } await new Promise(z => setTimeout(z, 2)); } })();
    const mk = i => child(Object.assign({ label: `v${i}`, stateDir: st, logFile: logf, out: tmp(), hosts: ['wf.test'] }, opts), urlsOf(i));
    /* SEQ=1: the same processes one after another (the fair comparison for the old code, which stops falsely when runs overlap) */
    let rs = []; if (process.env.SEQ) { for (let i = 0; i < n; i++) rs.push(await mk(i)); } else rs = await Promise.all(Array.from({ length: n }, (_, i) => mk(i)));
    stop = true; await poll;
    const t = tallyOf(st) || { runs: {} }; let fin = 0; for (const x of Object.values(t.runs)) fin += +x.bytes || 0;
    note(tag, { capBytes, maxCountedPlusReserved: max, at: maxAt, overCap: max > capBytes, finalCounted: fin, samples, stubRequests: S.hits.length - h0, delivered: await R.since(m0),
      perProcess: rs.map(r => r.refusedAtStart ? 'refused at start' : r.raw ? 'raw ' + r.raw : `${r.gets} GETs ${(r.bytes / 1e6).toFixed(3)} MB${r.stopped ? ' STOPPED' : ''} [${(r.results || []).map(x => x.split(' ').slice(2).join(' ').slice(0, 30) || 'ok').join('; ')}]`) });
  };
  /* V1: 12 processes at once, day cap 2 MB, --max-filesize 1; each asks for 0.3 MB, a 0.9 MB file with 60 KB of headers, 3 MB, 0.3 MB */
  await scen('V1 12 wf-get processes, day cap 2 MB, max-filesize 1 MB', 12, { dayCapMB: 2, maxFileMB: 1, reserveWaitS: 5 },
    i => [`${H}/h/a${i}?kb=300`, `${H}/h/b${i}?kb=900&hk=60`, `${H}/h/c${i}?kb=3000`, `${H}/h/d${i}?kb=300`], 2e6);
  /* V2: 8 processes, run cap 0.5 MB each, day cap 3 MB; chunked 2 MB files (no length) and slow headers */
  await scen('V2 8 wf-get processes, run cap 0.5 MB each, day cap 3 MB, chunked and slow files', 8, { dayCapMB: 3, runCapMB: 0.5, maxFileMB: 1, reserveWaitS: 5 },
    i => [`${H}/chunk/e${i}?kb=2000`, `${H}/slow/f${i}?kb=100&hk=50`, `${H}/h/g${i}?kb=200`], 3e6);
  if (process.env.SEQ) { R.close(); S.close(); process.exit(0); }
  /* V3: hand-made tally entries. A live process (sleep) holds 1 MB reserved and has 0.2 MB counted; day cap 1.5 MB. */
  {
    const sl = spawn('sleep', ['30']); await new Promise(r => setTimeout(r, 100));
    const real = W.procStart ? W.procStart(sl.pid) : null; const h = 3600e3, now = Date.now();
    const cases = [
      ['a live pid, real start time', { pid: sl.pid, pidStart: real, updated: new Date(now).toISOString() }],
      ['b live pid, other start time', { pid: sl.pid, pidStart: String(+real + 1), updated: new Date(now).toISOString() }],
      ['c live pid, no start time, updated 1 h ago', { pid: sl.pid, updated: new Date(now - h).toISOString() }],
      ['d live pid, no start time, updated 23.9 h ago', { pid: sl.pid, updated: new Date(now - 23.9 * h).toISOString() }],
      ['e live pid, no start time, updated 24.1 h ago', { pid: sl.pid, updated: new Date(now - 24.1 * h).toISOString() }],
      ['f live pid, no start time, no times', { pid: sl.pid }],
      ['g live pid, no start time, updated 48 h in the future', { pid: sl.pid, updated: new Date(now + 48 * h).toISOString() }],
      ['h live pid, no start time, updated "yesterday" (unreadable)', { pid: sl.pid, updated: 'yesterday' }],
      ['i dead pid, no start time, updated now', { pid: 999999, updated: new Date(now).toISOString() }],
      ['j live pid, no start time, updated 25 h ago, started now', { pid: sl.pid, updated: new Date(now - 25 * h).toISOString(), started: new Date(now).toISOString() }],
    ];
    for (const [k, e0] of cases) {
      const st = tmp(); const day = new Date();
      const e = Object.assign({ label: 'holder', bytes: 200000, reserved: 1e6, closed: false }, e0);
      fs.writeFileSync(path.join(st, `tally-${day.toISOString().slice(0, 10)}.json`), JSON.stringify({ runs: { hold01: e } }));
      let run, g;
      try { run = W.createRun({ label: 'v3', stateDir: st, logFile: path.join(tmp(), 'log.md'), readLogs: [], dayCapMB: 1.5, reserveWaitS: 1, onTrip: 'close' }); g = run.reserveWait ? await run.reserveWait() : run.reserve(); }
      catch (err) { note(`V3${k}`, { error: err.message.slice(0, 120) }); continue; }
      note(`V3${k}`, { grantBytes: g.bytes, by: g.by, bodyLimit: g.limit != null ? g.limit : null, countedPlusThisGrant: 200000 + g.bytes, holderReservationSeen: g.by === 'busy' });
      if (run.settle) run.settle(g, 0, true); run.close();
    }
    sl.kill('SIGKILL');
  }
  /* V4: a damaged tally file: another run has 1.4 MB counted (live pid), the file is cut short; day cap 1.5 MB */
  {
    const st = tmp(); const day = new Date(); const f = path.join(st, `tally-${day.toISOString().slice(0, 10)}.json`);
    const txt = JSON.stringify({ runs: { other1: { label: 'other', pid: process.pid, pidStart: W.procStart ? W.procStart(process.pid) : null, bytes: 1400000, reserved: 0, closed: false, updated: new Date().toISOString() } } }, null, 1);
    fs.writeFileSync(f, txt.slice(0, txt.length - 20));
    let out;
    try { const run = W.createRun({ label: 'v4', stateDir: st, logFile: path.join(tmp(), 'log.md'), readLogs: [], dayCapMB: 1.5, reserveWaitS: 1, onTrip: 'close' }); const g = run.reserveWait ? await run.reserveWait() : run.reserve(); out = { grantBytes: g.bytes, by: g.by }; if (run.settle) run.settle(g, 0, true); run.close(); const t = tallyOf(st); out.otherEntryAfter = t && t.runs.other1 ? 'kept' : 'gone'; }
    catch (err) { out = { error: err.message.slice(0, 160) }; }
    note('V4 damaged tally file (other run 1.4 MB counted), day cap 1.5 MB', out);
  }
  R.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
