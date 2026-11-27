'use strict';
/* check-repro (fix4): the relay process. node relayfile-child.cjs <target port> <counts file> [rate bytes/s].
   Same relay as relay.cjs (backpressure: it reads more from the server only when the client side has taken what was
   written). Before it forwards a chunk to the client it writes the connection's new running total into the counts file
   (16 bytes per connection, at offset id*16), so the probe reads exact totals with a synchronous read. All on 127.0.0.1. */
const net = require('net'), fs = require('fs');
const target = +process.argv[2], fd = fs.openSync(process.argv[3], 'r+'), rate = +(process.argv[4] || 0);
let n = 0;
const rec = (id, v) => fs.writeSync(fd, String(v).padStart(15, ' ') + '\n', id * 16);
const srv = net.createServer(c => {
  const id = n++; let total = 0; rec(id, 0);
  const up = net.connect(target, '127.0.0.1');
  c.on('data', d => up.write(d));
  up.on('data', d => {
    if (c.destroyed) return;
    if (!rate) {
      total += d.length; rec(id, total); c.write(d, () => { });
      if (c.writableLength > 0) { up.pause(); c.once('drain', () => up.resume()); }
      return;
    }
    up.pause(); let off = 0;
    const step = () => {
      if (c.destroyed) return;
      const k = Math.min(16384, d.length - off); if (k <= 0) return up.resume();
      total += k; rec(id, total); c.write(d.subarray(off, off + k)); off += k;
      setTimeout(step, Math.max(1, Math.round(k / rate * 1000)));
    };
    step();
  });
  const end = () => { c.destroy(); up.destroy(); };
  c.on('close', end); up.on('close', end); c.on('error', end); up.on('error', end);
});
const ppid = process.ppid;
setInterval(() => { if (process.ppid !== ppid) process.exit(0); try { process.kill(ppid, 0); } catch (e) { process.exit(0); } }, 500);
setTimeout(() => process.exit(0), 3600000);
srv.listen(0, '127.0.0.1', () => process.stdout.write(srv.address().port + '\n'));
