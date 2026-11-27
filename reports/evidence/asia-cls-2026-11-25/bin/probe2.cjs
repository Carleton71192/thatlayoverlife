/* one-off: why the lead mark stays on a hidden card when the core and chunks are 3 s late (old build only, cached assets). */
const { chromium } = require('playwright'); const { load } = require('./ab.cjs');
(async () => { const b = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY } });
  try { for (const slow of [0, 3000]) { const st = await load(b, 'old', 'stories.html', 1440, false, { sig: false, slowJs: slow, wait: slow ? 9000 : 6000, q: '?place=Asia', tag: 'probe2',
      init: () => { window.__ev = []; const D = document; const o = D.addEventListener.bind(D); D.addEventListener('DOMContentLoaded', () => window.__ev.push('dcl ' + Math.round(performance.now()))); },
      act: p => p.evaluate(() => { const gs = document.querySelectorAll('.tll-lib-grid'); const g = gs[0];
        const kids = [...g.children]; const vis = k => k.offsetParent !== null;
        return { grids: gs.length, kids: kids.length, visKids: kids.filter(vis).length, firstVisIdx: kids.findIndex(vis), leadIdx: kids.findIndex(k => k.hasAttribute('data-tll-lead')),
          leadDisplay: (kids.find(k => k.hasAttribute('data-tll-lead')) || {}).style ? kids.find(k => k.hasAttribute('data-tll-lead')).style.display : null,
          leadInner: kids.filter(k => k.querySelector('[data-tll-lead]')).length, ev: window.__ev,
          searchSlot: !!document.querySelector('.tll-library-filters .tll-filters-inner[data-tll-merged]') }; }) });
      console.log(slow, JSON.stringify(st.act), st.errs); } } finally { await b.close(); } })();
