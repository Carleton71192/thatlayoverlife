// node nojs.cjs <w> <h>: the home page with JavaScript off and the proposal applied: does the Curacao fallback still load and show?
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright'); const L = require('./lib.cjs'); const P = require('./proposal.cjs');
const [w, h] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const o = await L.open(b, { name: 'home', build: 'after', w: +w, h: +h, mod: P.home, js: false });
  await o.pg.waitForTimeout(3000);
  const r = await o.pg.$eval('[data-h3-hero] img[data-tll-parallax="hero"]', i => ({ loading: i.getAttribute('loading'), cur: i.currentSrc.replace(/^.*\//, ''), complete: i.complete, nw: i.naturalWidth }));
  await o.pg.screenshot({ path: path.join(L.D, 'shots', `nojs-${w}.png`) });
  console.log(JSON.stringify({ w: +w, ...r, curacaoBytes: L.summary(o.st).imgs.filter(x => /Curacao/.test(x[0])), blocked: o.st.blocked.length }));
  await o.ctx.close(); await b.close();
})();
