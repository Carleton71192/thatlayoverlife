'use strict';
const path = require('path'), { spawn } = require('child_process');
const { start } = require('./stub2.cjs');
(async () => {
  const pages = { '/blank.html': () => '<p>blank</p>' };
  const S = await start(pages);
  for (const mode of ['fetch-once', 'block', 'cache-only']) {
    const h0 = S.wf.hits.length;
    const r = await new Promise(ok => {
      const c = spawn(process.execPath, ['-r', path.join(__dirname, 'dnsmap.cjs'), path.join(__dirname, 'n4-child.cjs')], { env: Object.assign({}, process.env, { WT: process.argv[2], WP: String(S.wf.port), OP: String(S.other.port), MODE: mode }) });
      let o = ''; c.stdout.on('data', d => o += d); c.stderr.on('data', d => o += d);
      const k = setTimeout(() => { c.kill('SIGKILL'); o += ' [KILLED AFTER 60 s]'; }, 60000);
      c.on('exit', (code, sig) => { clearTimeout(k); ok({ code, sig, out: o.trim().split('\n').filter(l => /RESULTS|STATS|ALIVE|Error|KILLED|nhandled/.test(l)).map(l => l.slice(0, 700)) }); });
    });
    const fails = {}; for (const h of S.wf.hits.slice(h0)) fails[h.path] = (fails[h.path] || 0) + 1;
    console.log(`N4 ${mode}: exit ${r.code} signal ${r.sig}`); r.out.forEach(l => console.log('  ' + l)); console.log('  Webflow stub requests per path ' + JSON.stringify(fails));
  }
  S.close(); process.exit(0);
})();
