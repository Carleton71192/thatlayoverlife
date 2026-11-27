'use strict';
/* round 4: drop-in for relay.cjs whose counting runs in its own process (relaychild.cjs); the parent keeps a mirror */
const { fork } = require('child_process'), path = require('path');
function relay(targetPort) {
  const ch = fork(path.join(__dirname, 'relaychild.cjs'), [String(targetPort)], { stdio: ['ignore', 'inherit', 'inherit', 'ipc'] });
  const conns = [];
  return new Promise(r => ch.on('message', m => {
    if (m.port) { ch.unref(); ch.channel && ch.channel.unref(); return r({ port: m.port, conns, srv: { close: () => ch.kill() },
      delivered: () => conns.reduce((s, x) => s + x, 0), mark: () => conns.length, since: k => conns.slice(k).reduce((s, x) => s + (x || 0), 0), close: () => ch.kill() }); }
    conns[m.id] = m.n;
  }));
}
module.exports = { relay, total: () => 0 };
