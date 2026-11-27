'use strict';
/* A relay in its own process: node relayproc4.cjs <target port> [rate bytes/s]. Prints "<relay port> <control port>".
   GET http://127.0.0.1:<control port>/ answers the bytes delivered to the client per connection, as JSON.
   With a rate, the server's bytes reach the client at most that many bytes per second (16 KB steps). All on 127.0.0.1. */
const net = require('net'), http = require('http');
const target = +process.argv[2], rate = +(process.argv[3] || 0);
const conns = [];
const srv = net.createServer(c => {
  const rec = { delivered: 0 }; conns.push(rec);
  const up = net.connect(target, '127.0.0.1');
  c.on('data', d => up.write(d));
  if (!rate) {
    up.on('data', d => { if (c.destroyed) return; c.write(d, () => { }); rec.delivered += d.length; if (c.writableLength > 0) { up.pause(); c.once('drain', () => up.resume()); } });
  } else {
    /* rate mode: queued bytes are still sent after the server closes; the client side ends when the queue is empty */
    let busy = false, upDone = false;
    up.on('data', d => {
      if (c.destroyed) return; up.pause(); busy = true; let off = 0;
      const step = () => { if (c.destroyed) return; const n = Math.min(16384, d.length - off); if (n <= 0) { busy = false; if (upDone) c.end(); return up.resume(); }
        c.write(d.subarray(off, off + n)); rec.delivered += n; off += n; setTimeout(step, Math.max(1, Math.round(n / rate * 1000))); };
      step();
    });
    up.on('end', () => { upDone = true; if (!busy) c.end(); });
  }
  const end = () => { c.destroy(); up.destroy(); };
  c.on('close', end); c.on('error', end); up.on('error', end);
  if (!rate) up.on('close', end);
});
const ctl = http.createServer((q, s) => { s.end(JSON.stringify(conns.map(x => x.delivered))); });
srv.listen(0, '127.0.0.1', () => ctl.listen(0, '127.0.0.1', () => console.log(srv.address().port + ' ' + ctl.address().port)));
process.on('disconnect', () => process.exit(0)); setTimeout(() => process.exit(0), 1800000).unref();
