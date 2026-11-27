'use strict';
/* No browser. N-1 across processes, N-2 in wf-get, measured with a relay (relay.cjs) in front of the Webflow stub.
   Run: node -r ./dnsmap.cjs repro-proc.cjs <worktree> [parts]   parts: A (N-1 processes), B (one run near the cap),
   C (N-2 wf-get refused or cut), D (N-1 wait for another process's reservation). */
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const { start } = require('./stub2.cjs'); const { relay } = require('./relay.cjs');
const WT = process.argv[2], parts = (process.argv[3] || 'A,B,C,D').split(',');
const G = require(WT + '/tools/wf-get.cjs'), W = require(WT + '/tools/wf-guard.cjs');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'wfrp-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const note = (k, v) => console.log(k, JSON.stringify(v));
const child = (env, code) => { const c = spawn(process.execPath, ['-r', path.join(__dirname, 'dnsmap.cjs'), '-e', code], { env: Object.assign({}, process.env, env) });
  const p = new Promise(ok => { let o = ''; c.stdout.on('data', d => o += d); c.stderr.on('data', d => o += d); c.on('exit', (x, s) => ok({ code: x, sig: s, out: o.trim() })); }); p.proc = c; return p; };
(async () => {
  const pages = {}; const S = await start(pages); const RL = await relay(S.wf.port); const RP = RL.port;
  const WFH = `http://www.thatlayover.life:${RP}`;
  const sum = (h0) => S.wf.hits.slice(h0).reduce((s, h) => s + (h.wrote || 0), 0);
  if (parts.includes('A')) {
    const getCode = `const G=require(process.env.WT+'/tools/wf-get.cjs'); setTimeout(()=>G.wfGet([process.env.URL],{label:process.env.LABEL,out:process.env.OUT,logFile:process.env.LOGF,dayCapMB:+process.env.CAP,quiet:true}).then(r=>console.log(JSON.stringify({bytes:r.bytes,err:r.results[0]&&r.results[0].error||null,stopped:r.stopped&&r.stopped.message.slice(0,60)})),e=>console.log('ERR '+e.message.slice(0,60))), Math.max(0,+process.env.AT-Date.now()));`;
    for (const [n, kb] of [[2, 600], [6, 300], [12, 200], [12, 190]]) {
      const sd = tmp(), logf = path.join(tmp(), 'log.md'); const at = Date.now() + 1500; const h0 = S.wf.hits.length, r0 = RL.mark();
      const rs = await Promise.all(Array.from({ length: n }, (_, i) => child({ WT, AT: String(at), URL: `${WFH}/kb${kb}.js?p=${i}`, LABEL: `rp-${n}-${i}`, OUT: tmp(), LOGF: logf, CAP: '1', WF_GUARD_STATE: sd }, getCode)));
      await sleep(300);
      const ok = rs.filter(r => /"err":null/.test(r.out)).length;
      const t = W.readTally(sd, new Date()); const tally = Object.values(t.runs).reduce((s, r) => s + (+r.bytes || 0), 0);
      note(`A ${n} wf-get processes at once, ${kb} KB each, daily cap 1 MB`, { completeGets: ok, fitByArithmetic: Math.floor(1e6 / (kb * 1000 + 200)), stubRequests: S.wf.hits.length - h0, deliveredToClient: RL.since(r0), stubWrote: sum(h0), countedInTally: tally, results: rs.map(r => r.out.slice(0, 120)) });
    }
  }
  if (parts.includes('B')) {
    /* one wf-get run, four 300 KB files, daily cap 1 MB: the fourth GET gets a grant of about 0.1 MB */
    const h0 = S.wf.hits.length, r0 = RL.mark(); const logf = path.join(tmp(), 'log.md');
    const r = await G.wfGet([1, 2, 3, 4, 5].map(i => `${WFH}/kb300.js?b=${i}`), { label: 'rp-b', out: tmp(), logFile: logf, stateDir: tmp(), dayCapMB: 1, quiet: true });
    await sleep(300);
    note('B one wf-get run, five 300 KB files, daily cap 1 MB', { stubRequests: S.wf.hits.length - h0, deliveredToClient: RL.since(r0), countedByRun: r.bytes, results: r.results.map(x => x.error || x.status), stopped: r.stopped && r.stopped.message, log: fs.readFileSync(logf, 'utf8').trim() });
  }
  if (parts.includes('C')) {
    for (const [u, label] of [[`${WFH}/kb3000.js`, 'content-length 3 MB'], [`${WFH}/kb30000.js`, 'content-length 30 MB'], [`${WFH}/chunked?kb=30000`, 'chunked 30 MB']]) {
      const h0 = S.wf.hits.length, r0 = RL.mark();
      const r = await G.wfGet([u], { label: 'rp-c', out: tmp(), logFile: path.join(tmp(), 'l.md'), stateDir: tmp(), maxFileMB: 1, quiet: true });
      await sleep(300);
      note(`C wf-get --max-filesize 1, ${label}`, { counted: r.bytes, deliveredToClient: RL.since(r0), stubWrote: sum(h0), countedCoversDelivered: r.bytes >= RL.since(r0), error: r.results[0].error });
    }
    { /* the same 6 MB URL three times in one run (default 5 MB limit) */
      const h0 = S.wf.hits.length, r0 = RL.mark(); const logf = path.join(tmp(), 'l.md');
      const r = await G.wfGet([`${WFH}/kb6000.js`, `${WFH}/kb6000.js`, `${WFH}/kb6000.js`], { label: 'rp-dup', out: tmp(), logFile: logf, stateDir: tmp(), quiet: true });
      await sleep(300);
      note('C wf-get, the same 6 MB URL three times in one run', { stubRequests: S.wf.hits.length - h0, deliveredToClient: RL.since(r0), counted: r.bytes, results: r.results.map(x => x.error), log: fs.readFileSync(logf, 'utf8').trim() });
    }
  }
  if (parts.includes('D')) {
    /* a holder process reserves the whole 1 MB daily cap, then settles; a wf-get run in this process wants one 50 KB file */
    const holdCode = `const W=require(process.env.WT+'/tools/wf-guard.cjs'); const run=W.createRun({label:'holder',stateDir:process.env.SD,logFile:process.env.LOGF,dayCapMB:1,noLog:true});
      const g=run.tryReserve(1e6); console.log('HELD '+g.bytes+' '+g.by); setTimeout(()=>{ run.settle(g,+process.env.USE); console.log('SETTLED'); run.close(); process.exit(0); }, +process.env.HOLD);`;
    for (const [name, hold, use, waitS, kill] of [['D1 wait shorter than the hold', 3000, 0, 1, false], ['D2 wait longer than the hold', 3000, 0, 10, false],
      ['D3 holder killed with SIGKILL while holding', 20000, 0, 10, true], ['D4 holder settles having used the whole cap', 2000, 1e6, 10, false]]) {
      const sd = tmp(), logf = path.join(tmp(), 'log.md');
      const hp = child({ WT, SD: sd, LOGF: logf, HOLD: String(hold), USE: String(use) }, holdCode);
      for (let i = 0; i < 50 && !Object.keys(W.readTally(sd, new Date()).runs).length; i++) await sleep(50);
      await sleep(200);
      if (kill) setTimeout(() => hp.proc.kill('SIGKILL'), 1000);
      const h0 = S.wf.hits.length, t0 = Date.now(); let r, err = null;
      try { r = await G.wfGet([`${WFH}/kb50.js?d=${name[1]}`], { label: 'rp-d', out: tmp(), logFile: logf, stateDir: sd, dayCapMB: 1, reserveWaitS: waitS, quiet: true }); } catch (e) { err = e.message; }
      const h = await hp;
      note(name, { holdMs: hold, reserveWaitS: waitS, seconds: +((Date.now() - t0) / 1000).toFixed(1), stubRequests: S.wf.hits.length - h0, startError: err, result: r && r.results[0].error || (r && r.results[0].status), stopped: r && r.stopped && r.stopped.message, counted: r && r.bytes, holder: h.out.replace(/\n/g, ' | ') + (h.sig ? ' [' + h.sig + ']' : ''), log: fs.existsSync(logf) ? fs.readFileSync(logf, 'utf8').trim() : '' });
    }
  }
  RL.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
