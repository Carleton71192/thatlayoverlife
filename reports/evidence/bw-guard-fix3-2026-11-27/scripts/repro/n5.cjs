'use strict';
/* N5: the daily cap across processes (wf-get children, no browser) and one browser run plus wf-get at the same time.
   N8: bytes a server sends for a GET that curl refuses or cuts at --max-filesize. */
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const { start } = require('./stub2r.cjs');
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'wfn5-'));
const WT = process.argv[2];
const G = require(WT + '/tools/wf-get.cjs'), W = require(WT + '/tools/wf-guard.cjs');
const note = (k, v) => console.log(k, JSON.stringify(v));
(async () => {
  const pages = {}; const S = await start(pages); const WP = S.wf.port;
  const child = (env, code) => new Promise(ok => {
    const c = spawn(process.execPath, ['-e', code], { env: Object.assign({}, process.env, env) });
    let o = ''; c.stdout.on('data', d => o += d); c.stderr.on('data', d => o += d);
    c.on('exit', x => ok({ code: x, out: o.trim() }));
  });
  const getCode = `const G=require(process.env.WT+'/tools/wf-get.cjs'); const t=+process.env.AT; setTimeout(()=>G.wfGet([process.env.URL],{label:process.env.LABEL,out:process.env.OUT,logFile:process.env.LOGF,dayCapMB:+process.env.CAP,quiet:true}).then(r=>console.log(JSON.stringify({bytes:r.bytes,stopped:r.stopped&&r.stopped.message.slice(0,70)})),e=>console.log('ERR '+e.message.slice(0,90))), Math.max(0,t-Date.now()));`;
  for (const [n, kb] of [[2, 600], [6, 300], [12, 200]]) {
    const sd = tmp(), logf = path.join(tmp(), 'log.md'); const at = Date.now() + 1500; const h0 = S.wf.hits.length;
    const rs = await Promise.all(Array.from({ length: n }, (_, i) => child({ WT, AT: String(at), URL: `http://www.thatlayover.life:${WP}/kb${kb}.js?p=${i}`, LABEL: `n5-${n}-${i}`, OUT: tmp(), LOGF: logf, CAP: '1', WF_GUARD_STATE: sd }, getCode)));
    const sent = S.wf.hits.slice(h0).reduce((s, h) => s + (h.wrote || 0), 0);
    let day = null; try { day = W.readDailyTotalMB([logf], new Date(), { skipRuns: new Set() }); } catch (e) { day = e.message; }
    const t = W.readTally(sd, new Date()); const tallyMB = Object.values(t.runs).reduce((s, r) => s + (+r.bytes || 0), 0) / 1e6;
    note(`N5 ${n} wf-get processes at once, ${kb} KB each, daily cap 1 MB`, { results: rs.map(r => r.out), stubWroteMB: +(sent / 1e6).toFixed(3), logDayMB: day, tallyMB: +tallyMB.toFixed(3) });
  }
  // N8: refused by Content-Length and cut mid-stream
  for (const [u, label] of [[`http://www.thatlayover.life:${WP}/kb3000.js`, 'content-length 3 MB'], [`http://www.thatlayover.life:${WP}/chunked?kb=3000`, 'chunked 3 MB'], [`http://www.thatlayover.life:${WP}/kb30000.js`, 'content-length 30 MB']]) {
    const h0 = S.wf.hits.length;
    const r = await G.wfGet([u], { label: 'n8', out: tmp(), logFile: path.join(tmp(), 'l.md'), stateDir: tmp(), maxFileMB: 1, quiet: true });
    await new Promise(x => setTimeout(x, 300));
    const h = S.wf.hits.slice(h0)[0];
    note(`N8 wf-get --max-filesize 1, ${label}`, { counted: r.bytes, stubSentBody: h && h.sent, socketBytesWritten: h && h.wrote, error: r.results[0].error });
  }
  S.close(); process.exit(0);
})();
