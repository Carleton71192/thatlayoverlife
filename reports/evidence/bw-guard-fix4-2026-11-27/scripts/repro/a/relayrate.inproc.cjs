'use strict';
/* relay.cjs with a rate limit: the server's bytes reach the client at most `rate` bytes per second (a model of a real link).
   delivered counts what reached the client socket. Everything is on 127.0.0.1. */
const net = require('net');
function relay(targetPort, rate) {
  const conns = [];
  const srv = net.createServer(c => {
    const rec = { delivered: 0, t: Date.now() }; conns.push(rec);
    const up = net.connect(targetPort, '127.0.0.1');
    c.on('data', d => up.write(d));
    up.on('data', d => {
      if (c.destroyed) return;
      up.pause();
      let off = 0;
      const step = () => {
        if (c.destroyed) return;
        const n = Math.min(16384, d.length - off); if (n <= 0) return up.resume();
        c.write(d.subarray(off, off + n)); rec.delivered += n; off += n;
        setTimeout(step, Math.max(1, Math.round(n / rate * 1000)));
      };
      step();
    });
    const end = () => { c.destroy(); up.destroy(); };
    c.on('close', end); up.on('close', end); c.on('error', end); up.on('error', end);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r({
    port: srv.address().port, conns,
    mark: () => conns.length, since: m => conns.slice(m).reduce((s, x) => s + x.delivered, 0), close: () => srv.close(),
  })));
}
module.exports = { relay };
