'use strict';
/* H2-1 to H2-6: curlFetch of old and new over HTTP/2 (TLS on 127.0.0.1, self-signed, curl -k), through a relay process.
   node h2.cjs <new tree> <old tree> <tls dir>. Checks that the header stop and the -w marker work with HTTP/2 and compares
   bytes. No browser; nothing leaves 127.0.0.1. */
const fs = require('fs'), path = require('path'), http2 = require('http2');
const N = require(path.resolve(process.argv[2], 'tools/wf-guard.cjs')), O = require(path.resolve(process.argv[3], 'tools/wf-guard.cjs'));
const tls = process.argv[4]; const { relay } = require('./relayc.cjs');
const srv = http2.createSecureServer({ key: fs.readFileSync(path.join(tls, 'key.pem')), cert: fs.readFileSync(path.join(tls, 'cert.pem')), maxSendHeaderBlockLength: 1e7, settings: { maxHeaderListSize: 1e7 } });
srv.on('stream', (st, h) => {
  const u = new URL(h[':path'], 'https://x'); const hk = +(u.searchParams.get('hk') || 0), kb = +(u.searchParams.get('kb') || 100);
  const out = { ':status': 200, 'content-type': 'application/javascript', 'content-length': kb * 1000 };
  for (let i = 0; i < hk; i++) out['x-pad-' + i] = 'p'.repeat(990);
  try { st.respond(out); st.end(Buffer.alloc(kb * 1000, 97)); } catch (e) { console.log('server respond error', e.code || e.message); }
});
srv.on('sessionError', e => console.log('server session error', e.code || e.message));
(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const R = await relay(srv.address().port, 0);
  const args = ['--noproxy', '*', '--connect-to', '::127.0.0.1:', '-k', '--http2'];
  const cases = [['H2-1 20 KB headers, 0.1 MB', 'hk=20&kb=100', 1e6], ['H2-2 60 KB headers, 0.6 MB, body limit 0.68 MB', 'hk=60&kb=600', 680000],
    ['H2-3 100 KB headers, 0.1 MB', 'hk=100&kb=100', 5e6], ['H2-4 250 KB headers, 0.1 MB', 'hk=250&kb=100', 5e6], ['H2-5 600 KB headers, 0.1 MB', 'hk=600&kb=100', 5e6], ['H2-6 no extra headers, 2 MB body, limit 1 MB', 'hk=0&kb=2000', 1e6]];
  for (const [tag, q, max] of cases) for (const [t, W] of [['old', O], ['new', N]]) {
    const m0 = await R.mark();
    const r = await W.curlFetch(`https://wf.test:${R.port}/x?${q}&t=${t}`, { maxBytes: max, maxHeaderBytes: t === 'new' ? N.HEADER_MARGIN : undefined, curlArgs: args, timeoutS: 20 }).promise;
    const d = await R.since(m0);
    console.log(JSON.stringify({ tag, tree: t, status: r.status, ctype: r.headers['content-type'] || null, nHeaders: Object.keys(r.headers).length, body: r.body.length, wire: r.wire, delivered: d, exit: r.exit, stopped: r.stopped || null, err: (r.error || '').slice(0, 90) }));
  }
  R.close(); srv.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
