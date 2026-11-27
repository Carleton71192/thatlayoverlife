'use strict';
/* check-repro (fix4) F6: an old-style tally entry (no pidStart) of a live pid holding 1 MB, with "updated" 1 h, 23 h and 25 h ago
   and with no time at all; day cap 1.5 MB. What does tryReserve grant? No network. Run: node f6.cjs <tools parent> */
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
(async () => {
  const holder = spawn('sleep', ['30']); await new Promise(r => setTimeout(r, 200));
  const day = new Date().toISOString().slice(0, 10);
  for (const [name, ageH] of [['updated 1 h ago', 1], ['updated 23 h ago', 23], ['updated 25 h ago', 25], ['no time stored', null]]) {
    const sd = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'wff6-'));
    const e = { label: 'old-style', kind: 'wf-get', pid: holder.pid, bytes: 0, reserved: 1e6, closed: false };
    if (ageH != null) e.updated = e.started = new Date(Date.now() - ageH * 3600e3).toISOString();
    fs.writeFileSync(path.join(sd, `tally-${day}.json`), JSON.stringify({ runs: { abc123: e } }));
    const run = W.createRun({ label: 'f6', stateDir: sd, logFile: path.join(sd, 'log.md'), readLogs: [], dayCapMB: 1.5, noLog: true, onTrip: 'close' });
    const g = run.tryReserve ? run.tryReserve() : run.reserve();
    console.log(`F6 live pid, no start time, ${name}`, JSON.stringify({ grantBytes: g.bytes, by: g.by }));
    try { run.close && run.close(); } catch (x) { }
  }
  holder.kill(); process.exit(0);
})();
