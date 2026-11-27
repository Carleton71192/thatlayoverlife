'use strict';
/* check-repro (fix3): stub2 with a relay (relayline.cjs) in front of the "wf" stub; S.wf.port is the relay's port. */
const base = require('./stub2.cjs'); const { relay, total } = require('./relayline.cjs');
async function start(pages) { const S = await base.start(pages); const R = await relay(S.wf.port); S.wf.stubPort = S.wf.port; S.wf.port = R.port; S.relayTotal = total; return S; }
module.exports = { start, PNG: base.PNG };
