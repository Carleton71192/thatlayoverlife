'use strict';
/* N8b: body bytes that reach the client host for a GET that curl refuses at --max-filesize, measured by a TCP relay that
   forwards server bytes to curl with backpressure (counts what curl's kernel accepted), versus what the guard counts. */
const http = require('http'), net = require('net');
const W = require(process.argv[2] + '/tools/wf-guard.cjs');
(async () => {
  for (const [mb, chunked] of [[3, false], [30, false], [30, true]]) {
    const body = Buffer.alloc(mb * 1e6, 32);
    const srv = http.createServer((q, s) => { s.writeHead(200, Object.assign({ 'content-type': 'application/javascript' }, chunked ? {} : { 'content-length': body.length })); s.end(body); });
    await new Promise(r => srv.listen(0, '127.0.0.1', r));
    let relayed = 0;
    const relay = net.createServer(c => {
      const up = net.connect(srv.address().port, '127.0.0.1');
      c.on('data', d => up.write(d));
      up.on('data', d => { if (c.destroyed) return; c.write(d, () => { }); relayed += d.length; if (c.writableLength > 0) { up.pause(); c.once('drain', () => up.resume()); } });
      const end = () => { c.destroy(); up.destroy(); }; c.on('close', end); up.on('close', end); c.on('error', end); up.on('error', end);
    });
    await new Promise(r => relay.listen(0, '127.0.0.1', r));
    const r = await W.curlFetch(`http://www.thatlayover.life:${relay.address().port}/big.js`, { maxBytes: 1e6, timeoutS: 10, curlArgs: ['--noproxy', '*', '--connect-to', '::127.0.0.1:'] }).promise;
    await new Promise(x => setTimeout(x, 200));
    console.log(`N8b ${chunked ? 'chunked' : 'content-length'} ${mb} MB, curl --max-filesize 1 MB`, JSON.stringify({ guardCountsWire: r.wire, curlExit: r.exit, bytesDeliveredToClientHost: relayed }));
    srv.close(); relay.close();
  }
})();
