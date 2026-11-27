'use strict';
/* round 4: drop-in for repro/relayline.cjs whose counting runs in its own process (relaychild.cjs) */
const { relay: r0 } = require('./relayp.cjs');
let R = null, last = 0;
const total = () => (R ? R.delivered() : 0);
async function relay(targetPort) { R = await r0(targetPort); return R; }
const log0 = console.log.bind(console);
console.log = (...a) => { const t = total(), d = t - last; last = t; log0(...a, `| relayDeliveredSincePreviousLine=${d}`); };
module.exports = { relay, total };
