'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawn, execSync } = require('child_process');
const { start } = require('./stub.cjs');
(async () => {
  const { server, port } = await start({});
  const res = {};
  for (const mode of (process.argv[3] ? process.argv[3].split(',') : ['throw', 'reject', 'exit', 'sigterm', 'sigterm-nohandler', 'sigint', 'sigint-nohandler', 'sigkill', 'browser-crash', 'normal-noclose', 'trip-default'])) {
    const logf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'wfgcr-')), 'log.md');
    const t0 = Date.now();
    const r = await new Promise(ok => {
      const c = spawn(process.execPath, ['-r', path.join(__dirname, 'dnsmap.cjs'), path.join(__dirname, 'crash-child.cjs'), mode], { env: Object.assign({}, process.env, { WT: process.argv[2], STUBPORT: String(port), LOGF: logf, SD: path.dirname(logf) + '/state' }) });
      let o = ''; c.stdout.on('data', d => o += d); c.stderr.on('data', d => o += d);
      const k = setTimeout(() => { c.kill('SIGKILL'); o += ' [KILLED BY PARENT AFTER 25 s]'; }, 25000);
      c.on('exit', (code, sig) => { clearTimeout(k); ok({ code, sig, out: o.split('\n').filter(l => /counted|alive|ending|killed|KILLED|Error:/.test(l)).map(l => l.trim().slice(0, 120)) }); });
    });
    await new Promise(r => setTimeout(r, 1500));
    let left = 0; try { left = +execSync("pgrep -c -f 'host-resolver-rules=MA[P]' || true").toString().trim(); } catch (e) { }
    if (left) execSync("pkill -9 -f 'host-resolver-rules=MA[P]' || true");
    let log = []; try { log = fs.readFileSync(logf, 'utf8').trim().split('\n').filter(Boolean); } catch (e) { }
    res[mode] = { exit: r.code, signal: r.sig, seconds: +((Date.now() - t0) / 1000).toFixed(1), out: r.out, logLines: log.map(l => l.replace(/^- \d+ \w+ [\d:]+ UTC, /, '').slice(0, 110)), chromiumLeftOver: left };
    console.log(mode, JSON.stringify(res[mode]));
  }
  fs.writeFileSync(path.join(process.env.OUTDIR, 'crash-result.json'), JSON.stringify(res, null, 1));
  server.close();
})();
