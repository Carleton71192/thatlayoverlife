'use strict';
/* check-repro (fix4): drop-in for relayline.cjs with the relay in its own process (relayfile.cjs). Each line a probe prints
   gets " | relayDeliveredSincePreviousLine=<bytes>" added. */
const { relay: r0 } = require('./relayfile.cjs');
let R = null, last = 0;
const total = () => (R ? R.delivered() : 0);
async function relay(targetPort) { R = await r0(targetPort); return R; }
const log0 = console.log.bind(console);
console.log = (...a) => { const t = total(), d = t - last; last = t; log0(...a, `| relayDeliveredSincePreviousLine=${d}`); };
module.exports = { relay, total };
