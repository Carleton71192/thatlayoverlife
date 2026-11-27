'use strict';
/* check-repro (fix3): stub3 with a relay (../relayline.cjs) in front of the "wf" stub; S.wf.port is the relay's port, so
   every Webflow byte, through the guard's curl or straight from Chromium, passes it. Each printed line gets
   " | relayDeliveredSincePreviousLine=<bytes>" (one line per scenario). Everything is on 127.0.0.1. */
const base = require('./stub3.cjs'); const { relay, total } = require('../relayline.cjs');
async function start(pages) { const S = await base.start(pages); const R = await relay(S.wf.port); S.wf.stubPort = S.wf.port; S.wf.port = R.port; S.relayTotal = total; return S; }
module.exports = { start, PNG: base.PNG, relayTotal: total };
