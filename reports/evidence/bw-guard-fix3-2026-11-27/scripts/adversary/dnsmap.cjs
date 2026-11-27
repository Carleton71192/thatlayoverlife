'use strict';
/* Preload: every Node-side name lookup answers 127.0.0.1, so Playwright route.fetch (which runs in Node, not in
   Chromium) also lands on the local stub. */
const dns = require('dns');
const ans = (opts) => (opts && opts.all) ? [{ address: '127.0.0.1', family: 4 }] : null;
dns.lookup = function (host, opts, cb) { if (typeof opts === 'function') { cb = opts; opts = {}; } const a = ans(opts); process.nextTick(() => a ? cb(null, a) : cb(null, '127.0.0.1', 4)); };
dns.promises.lookup = async (host, opts) => ans(opts) || { address: '127.0.0.1', family: 4 };
