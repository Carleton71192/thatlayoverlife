'use strict';
/* A TCP relay in front of a local stub, as in n8b.cjs. It forwards the server's bytes to the client with backpressure: it
   reads more from the server only when the client side has taken what was written. So "delivered" counts the bytes that
   reached the client host's socket, not what the server wrote into its own buffer. Everything is on 127.0.0.1. */
const net = require('net');
function relay(targetPort) {
  const conns = [];
  const srv = net.createServer(c => {
    const rec = { delivered: 0, t: Date.now() }; conns.push(rec);
    const up = net.connect(targetPort, '127.0.0.1');
    c.on('data', d => up.write(d));
    up.on('data', d => {
      if (c.destroyed) return;
      c.write(d, () => { }); rec.delivered += d.length;
      if (c.writableLength > 0) { up.pause(); c.once('drain', () => up.resume()); }
    });
    const end = () => { c.destroy(); up.destroy(); };
    c.on('close', end); up.on('close', end); c.on('error', end); up.on('error', end);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r({
    port: srv.address().port, conns,
    delivered: () => conns.reduce((s, x) => s + x.delivered, 0),
    mark: () => conns.length,
    since: m => conns.slice(m).reduce((s, x) => s + x.delivered, 0),
    close: () => srv.close(),
  })));
}
module.exports = { relay };
