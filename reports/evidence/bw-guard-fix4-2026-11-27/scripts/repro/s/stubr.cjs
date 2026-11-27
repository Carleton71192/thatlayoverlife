'use strict';
/* check-repro (fix3): stub.cjs (one server for every host) with a relay (relayline.cjs) in front; port is the relay's port.
   This stub answers localhost pages too, so the relay figure covers every host, not Webflow only. */
const base = require('./stub.cjs'); const { relay, total } = require('./relayline.cjs');
async function start(pages) { const S = await base.start(pages); const R = await relay(S.port); S.stubPort = S.port; S.port = R.port; S.relayTotal = total; return S; }
module.exports = Object.assign({}, base, { start });
