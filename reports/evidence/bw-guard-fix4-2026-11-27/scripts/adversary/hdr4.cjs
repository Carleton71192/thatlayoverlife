'use strict';
/* H: header edge cases at caps, wf-get of old (686e520) and new (49889e7), one URL per run, no browser.
   node hdr4.cjs <new tree> <old tree> [rate bytes/s]
   The stub (stub5.cjs) is on 127.0.0.1; the relay runs in its own process (relayproc4.cjs) and counts what reached curl.
   curl goes to 127.0.0.1 through WF_GUARD_CURL_ARGS (--connect-to ::127.0.0.1:) and the curl wrapper. */
const fs = require('fs'), os = require('os'), path = require('path');
const trees = { old: process.argv[3], new: process.argv[2] };
const G = { old: require(path.resolve(trees.old, 'tools/wf-get.cjs')), new: require(path.resolve(trees.new, 'tools/wf-get.cjs')) };
const WG = { old: require(path.resolve(trees.old, 'tools/wf-guard.cjs')), new: require(path.resolve(trees.new, 'tools/wf-guard.cjs')) };
const RATE = +(process.argv[4] || 0);
const { start } = require('./stub5.cjs'); const { relay } = require('./relayc.cjs');
const tmp = () => fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'h4-'));
(async () => {
  const S = await start(); const R = await relay(S.port, RATE);
  console.log(`relay ${RATE ? RATE + ' bytes/s' : 'no rate limit'}`);
  const H = `http://wf.test:${R.port}`;
  const cases = [
    ['H1 B4: 60 KB headers, 0.98 MB body, run cap 1 MB', '/h/a?hk=60&kb=980', { runCapMB: 1 }],
    ['H2 63 KB headers, 0.6 MB body, run cap 1 MB', '/h/b?hk=63&kb=600', { runCapMB: 1 }],
    ['H3 65 KB headers, 0.1 MB body, far from a cap', '/h/c?hk=65&kb=100', {}],
    ['H4 one 64,100 B header line, 0.1 MB body, far from a cap', '/h/d?hb=64100&kb=100', {}],
    ['H5 one 99,000 B header line, 0.1 MB body, far from a cap', '/h/e?hb=99000&kb=100', {}],
    ['H6 290 KB headers (1 KB lines), 0.1 MB body, far from a cap', '/h/f?hk=290&kb=100', {}],
    ['H7 290 KB headers, 0.1 MB body, run cap 0.7 MB', '/h/g?hk=290&kb=100', { runCapMB: 0.7 }],
    ['H8 103 Early Hints 40 KB, then 30 KB headers, 0.1 MB body', '/eh/h?ehk=40&hk=30&kb=100', {}],
    ['H9 chunked, 20 KB headers, 0.5 MB body, 70 KB trailers', '/chunk/i?hk=20&kb=500&tk=70', {}],
    ['H10 chunked, 60 KB headers, 0.98 MB body, run cap 1 MB', '/chunk/j?hk=60&kb=980', { runCapMB: 1 }],
    ['H11 gzip chunked, 60 KB headers, 0.98 MB body, run cap 1 MB', '/gz/k?hk=60&kb=980', { runCapMB: 1 }],
    ['H12 gzip chunked, 20 KB headers, 2 MB body, run cap 1 MB', '/gz/l?hk=20&kb=2000', { runCapMB: 1 }],
    ['H13 marker text in a header line, then 80 KB headers, 0.1 MB body', '/inject/m?hk=80&kb=100', {}],
    ['H14 marker text, 200 KB headers, 0.6 MB body, run cap 1 MB', '/inject/n?hk=200&kb=600', { runCapMB: 1 }],
    ['H15 headers trickled 1 KB per 5 ms, 120 KB, 0.1 MB body', '/slow/o?hk=120&kb=100', {}],
    ['H16 290 KB headers, 0.03 MB body, run cap 0.4 MB', '/h/p?hk=290&kb=30', { runCapMB: 0.4 }],
    ['H17 20 KB headers, 0.67 MB body, run cap 1 MB', '/h/q?hk=20&kb=670', { runCapMB: 1 }],
    ['H18 20 KB headers, 0.3 MB body, run cap 0.5 MB (P7b)', '/h/r?hk=20&kb=300', { runCapMB: 0.5 }],
  ];
  for (const [tag, p, o] of cases) {
    for (const t of ['old', 'new']) {
      const sd = tmp(), m0 = await R.mark(), h0 = S.hits.length;
      const r = await G[t].wfGet([H + p + '&t=' + t], Object.assign({ label: 'adv4-hdr', out: tmp(), logFile: path.join(sd, 'log.md'), readLogs: [], stateDir: sd, hosts: ['wf.test'], quiet: true }, o));
      const delivered = await R.since(m0);
      const tally = WG[t].readTally(sd, new Date()); const runs = Object.values(tally.runs);
      const cap = (o.runCapMB || 200) * 1e6;
      const res = r.results[0] || {};
      console.log(JSON.stringify({ tag, tree: t, gets: r.gets, stubRequests: S.hits.length - h0, delivered, counted: r.bytes, cap, overCap: r.bytes > cap, reservedLeft: runs.reduce((s, x) => s + (+x.reserved || 0), 0), status: res.status, error: res.error || null, stopped: r.stopped ? r.stopped.message.slice(0, 140) : null, line: r.line.replace(/^.*?wf-get run \w+, /, '') }));
    }
  }
  R.close(); S.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
