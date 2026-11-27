'use strict';
/* check-repro (fix3): a TCP relay with a running total, as relay.cjs (backpressure: it reads more from the server only when
   the client side has taken what was written, so the total is what reached the client host). Each line a probe prints gets
   " | relayDeliveredSincePreviousLine=<bytes>" added. Everything is on 127.0.0.1. */
const net = require('net');
let total = 0, last = 0;
function relay(targetPort) {
  const srv = net.createServer(c => {
    const up = net.connect(targetPort, '127.0.0.1');
    c.on('data', d => up.write(d));
    up.on('data', d => { if (c.destroyed) return; c.write(d, () => { }); total += d.length; if (c.writableLength > 0) { up.pause(); c.once('drain', () => up.resume()); } });
    const end = () => { c.destroy(); up.destroy(); };
    c.on('close', end); up.on('close', end); c.on('error', end); up.on('error', end);
  });
  srv.unref(); /* the probe's own end decides when the process exits */
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r({ srv, port: srv.address().port })));
}
const log0 = console.log.bind(console);
console.log = (...a) => { const d = total - last; last = total; log0(...a, `| relayDeliveredSincePreviousLine=${d}`); };
module.exports = { relay, total: () => total };
