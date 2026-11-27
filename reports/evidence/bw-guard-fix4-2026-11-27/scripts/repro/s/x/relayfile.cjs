'use strict';
/* check-repro (fix4): drop-in for relay.cjs (and relayrate.cjs) with the relay in its own process (relayfile-child.cjs).
   relay(targetPort[, rate]) -> { port, conns, delivered(), mark(), since(m), close() }. Totals are read from the counts
   file the relay process writes before it forwards each chunk. */
const { spawn } = require('child_process'), fs = require('fs'), path = require('path'), os = require('os');
function relay(targetPort, rate) {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'relayf-')), 'counts'); fs.writeFileSync(f, '');
  const ch = spawn(process.execPath, [path.join(__dirname, 'relayfile-child.cjs'), String(targetPort), f, String(rate || 0)], { stdio: ['ignore', 'pipe', 'inherit'] });
  const read = () => { let b = ''; try { b = fs.readFileSync(f, 'latin1'); } catch (e) { } const out = []; for (let i = 0; i + 16 <= b.length; i += 16) out.push(+b.slice(i, i + 15) || 0); return out; };
  const sum = a => a.reduce((s, x) => s + x, 0);
  return new Promise(res => {
    let o = '';
    ch.stdout.on('data', d => {
      o += d; const m = /^(\d+)\n/.exec(o); if (!m) return;
      ch.stdout.removeAllListeners('data'); ch.stdout.destroy(); ch.unref();
      res({ port: +m[1], get conns() { return read().map(x => ({ delivered: x })); }, delivered: () => sum(read()), mark: () => read().length, since: k => sum(read().slice(k)), close: () => { try { ch.kill(); } catch (e) { } }, srv: { close: () => { try { ch.kill(); } catch (e) { } } }, pid: ch.pid });
    });
  });
}
module.exports = { relay };
