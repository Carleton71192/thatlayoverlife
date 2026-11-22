/* Sweep Nov 21 build check: the cached pages with this branch's core and chunks (served from the worktree in place of the pinned
   jsDelivr files), one load per cell, measuring each class A fix. Usage: NODE_PATH=/opt/node22/lib/node_modules node chk.cjs [filter] */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load, sleep } = require('./h.cjs');
const WT = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-build/wt/src/site-layers';
const OUT = path.join(__dirname, '..', 'results', 'chk.jsonl');
global.__LOCAL = WT;
global.__MOD = (html) => html.replace(/(<script src="https:\/\/cdn\.jsdelivr\.net\/gh\/[^"]+\/tll-site-layers-v16\.js"[^>]*?) integrity="[^"]*"/, '$1');

async function fonts(page, sels) {
  const cdp = await page.context().newCDPSession(page); await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 }); const out = {};
  for (const s of sels) { try { const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: s }); const r = [];
      for (const id of nodeIds.slice(0, 2)) { const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: id }); r.push(fonts.map(f => f.familyName + ':' + f.glyphCount).join(',')); }
      out[s] = { n: nodeIds.length, painted: r }; } catch (e) { out[s] = 'err ' + String(e).slice(0, 80); } }
  return out;
}
const cs = (page, sel, props) => page.evaluate(([sel, props]) => [].slice.call(document.querySelectorAll(sel), 0, 3).map(e => { const c = getComputedStyle(e), r = e.getBoundingClientRect(); const o = { t: (e.innerText || '').trim().slice(0, 28), w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top) }; props.forEach(p => { o[p] = c.getPropertyValue(p); }); return o; }), [sel, props]);

const ACT = {
  async storiesq(page) { return page.evaluate(() => { const o = {}; const n = document.getElementById('tll-q-note'); o.note = n && n.innerText.replace(/\s+/g, ' ').trim().slice(0, 160); o.noteLinks = n && [].map.call(n.querySelectorAll('a'), a => a.getAttribute('href'));
    const h = document.querySelector('.tll-library-newsletter h3'); if (h) { const em = h.querySelector('em'); o.nlH3 = { fs: getComputedStyle(h).fontSize, em: em && getComputedStyle(em).color }; }
    const card = document.querySelector('.tll-lib-card'); if (card) o.cardTabStops = [card, ...card.querySelectorAll('*')].filter(e => e.tabIndex >= 0 && e.matches('a[href],button,[tabindex]')).length;
    let own = 0, dot = 0, tot = 0; for (const p of document.querySelectorAll('.tll-lib-card [data-s3-place]')) { if (!p.offsetParent) continue; tot++; const nm = p.parentNode.querySelector('.tll-lib-byline-name'); const a = nm.getBoundingClientRect(), b = p.getBoundingClientRect();
      if (b.top >= a.bottom - 2) { own++; if (getComputedStyle(p, '::before').content !== 'none') dot++; } }
    o.placeOwnLine = own + ' of ' + tot + ', with a dot ' + dot;
    o.mono = ['.tll-lib-meta', '.tll-lib-read', '.tll-filter-label'].map(s => { const e = document.querySelector(s); return s + ' ' + (e ? getComputedStyle(e).fontSize : '-'); });
    return o; }); },
  async stories(page) { const o = {}; const chip = await page.$('[data-tll-place="Asia"]'); if (chip) { await chip.click(); await sleep(600); o.urlAfterAsia = await page.evaluate(() => location.pathname + location.search); }
    const all = await page.$('[data-tll-place="all"]'); if (all) { await all.click(); await sleep(400); o.urlAfterAll = await page.evaluate(() => location.pathname + location.search); } return o; },
  async storiesplace(page) { return page.evaluate(() => ({ url: location.search, pressed: [].map.call(document.querySelectorAll('[data-tll-place][aria-pressed="true"]'), c => c.getAttribute('data-tll-place')), shown: [].filter.call(document.querySelectorAll('.tll-lib-grid > *'), e => e.offsetParent !== null).length })); },
  async support(page) { return { em: await cs(page, '.tll-support-direct-title em', ['font-size']), sw: await page.evaluate(() => [innerWidth, document.documentElement.scrollWidth]), ghost: await cs(page, 'a.tll-cta-ghost-dark', ['color', 'background-color', 'border-top-color', 'border-top-left-radius', 'font-family']) }; },
  async contact(page) { return { ghost: await cs(page, 'a.tll-cta-ghost-dark', ['color', 'background-color', 'border-top-color']), h3: await cs(page, '.tll-contact-faq-card h3', ['font-size']), em: await cs(page, '.tll-contact-faq-card h3 em', ['color']) }; },
  async about(page) { return { painted: await fonts(page, ['.tll-about-final-cite', '.tll-about-final-li', '.tll-about-final-button', '.tll-about-final-button-light']), btn: await cs(page, '.tll-about-final-actions a', ['border-top-left-radius', 'font-weight', 'background-color', 'color']) }; },
  async expats(page) { const o = { res: [] }; for (const l of await page.$$('label.tllpr-check, label[data-tll-x="check"]')) { const box = await l.boundingBox(); const inp = await l.$('input[type=checkbox]'); if (!box || !inp) continue; await l.scrollIntoViewIfNeeded(); const b2 = await l.boundingBox();
      await page.mouse.click(b2.x + b2.width - 20, b2.y + b2.height / 2); await sleep(200); o.res.push({ ticked: await inp.isChecked(), for: await l.getAttribute('for') }); }
    const cdp = await page.context().newCDPSession(page); try { const { nodes } = await cdp.send('Accessibility.getFullAXTree'); o.axCheckboxNames = nodes.filter(n => n.role && n.role.value === 'checkbox').map(n => (n.name && n.name.value || '').slice(0, 30)); } catch (e) { }
    o.btns = await cs(page, 'a[data-tll-btn], a[data-tll-x="finder-go"]', ['border-top-left-radius', 'font-family', 'background-color', 'color', 'border-top-color']); o.finder = await cs(page, '[data-tll-x="finder-input"]', ['min-height']); return o; },
  async pen(page) { const o = await page.evaluate(() => { const o = {}; for (const c of ['tll-pen-helptext', 'tll-pen-help', 'tll-pen-legend', 'tll-pen-status', 'tll-pen-label']) { const e = [].find.call(document.querySelectorAll('.' + c), x => x.offsetParent !== null && x.innerText.trim()); o[c] = e ? [getComputedStyle(e).color, getComputedStyle(e).fontWeight, getComputedStyle(e).fontStyle, getComputedStyle(e).fontSize].join(' ') : 'none visible'; }
      const inp = [].find.call(document.querySelectorAll('input,textarea'), x => x.offsetParent !== null && x.placeholder); o.ph = inp ? getComputedStyle(inp, '::placeholder').color : null;
      const sh = [].find.call(document.querySelectorAll('nav a'), a => /^Share your story$/.test(a.innerText.trim()) && a.offsetParent); o.navShare = sh ? Math.round(sh.getBoundingClientRect().height) : null; return o; });
    o.step = await cs(page, '.tllst-nav button', ['border-top-left-radius', 'font-family', 'text-transform', 'display']); return o; },
  async map(page) { return { painted: await fonts(page, ['#tllm-sample > span:nth-child(2)', '#tllm-sample > a']), sample: await cs(page, '#tllm-sample > span', ['font-size', 'font-family']), mono: await cs(page, '.tllm-card-label, .tllm-cell-l, .tllm-bar-k', ['font-size']), cta: await cs(page, 'a.tll-park-cta, a.tlllb-cta', ['background-color', 'border-top-left-radius']) }; },
  async account(page) { return page.evaluate(() => { const o = {}; const p = document.querySelector('#tll-note .tll-note-pill'); if (p) { const r = p.getBoundingClientRect(); o.pill = [r.left, r.top, r.width, r.height].map(Math.round); o.vw = innerWidth; }
      o.dt = [].slice.call(document.querySelectorAll('[data-tll-wr=stats] dt, .a3-prog-top a, ul.a3-status li'), 0, 4).map(e => getComputedStyle(e).fontSize + ' ' + Math.round(e.getBoundingClientRect().height));
      const tiles = [].slice.call(document.querySelectorAll('[data-tll-wr=stats] dt'), 0, 6).map(e => e.scrollWidth > e.clientWidth + 1); o.dtOverflow = tiles.filter(Boolean).length + ' of ' + tiles.length; return o; }); },
  async profile(page) { return page.evaluate(() => [].slice.call(document.querySelectorAll('.tll-alb-tape'), 0, 7).map(t => { const s = t.querySelector('small'); return s ? Math.round(t.getBoundingClientRect().width) + '/' + s.scrollWidth + '/' + getComputedStyle(s).whiteSpace : 'no small'; })); },
  async e404(page) { return cs(page, '.tll404-btn', ['background-color', 'color', 'border-top-left-radius', 'font-family']); },
  async story(page) { return cs(page, '.tll-save-btn', ['min-height']); },
};
const CELLS = [['stories.html', 390, 0, 'storiesq', '?q=zzqx'], ['stories.html', 390, 0, 'stories'], ['stories.html', 1440, 0, 'storiesplace', '?place=Europe'],
  ['support.html', 390, 0, 'support'], ['contact.html', 390, 0, 'contact'], ['about.html', 1440, 0, 'about'], ['for-expats.html', 390, 0, 'expats'],
  ['submit.html', 390, 1, 'pen'], ['my-pets.html', 390, 1, 'pen'], ['the-map.html', 390, 0, 'map'], ['account.html', 1440, 1, 'account'], ['account.html', 390, 1, 'account'],
  ['profile.html', 1440, 0, 'profile'], ['this-page-does-not-exist-sweep.html', 390, 0, 'e404'], ['stories__lisbon-sun-sails-city-built-to-stand-back-up.html', 1440, 0, 'story'], ['home.html', 390, 0, 'pen']];
(async () => {
  const f = process.argv[2]; const browser = await chromium.launch();
  for (const [file, w, signed, act, q] of CELLS.filter(c => !f || c[0].includes(f) || c[3] === f)) {
    global.__Q = q || ''; global.__ACT = (page) => ACT[act](page);
    const st = await load(browser, file, w, signed);
    const row = { file: file.replace(/^profile/, '<profile>'), w, signed, q: q || '', local: (st.local || []).length, errs: st.errs, act: st.act, nonGet: st.nonGet.length, wf: st.wfFetched, jsd: st.jsd };
    fs.appendFileSync(OUT, JSON.stringify(row) + '\n'); console.log(JSON.stringify(row).slice(0, 600));
  }
  await browser.close();
})();
