/* Sweep Nov 21, verify-1: adversarial re-checks of A01 to A21 and B01 to B07 on the cached pages (h.cjs = debug d.cjs, own OUT).
   Usage: NODE_PATH=/opt/node22/lib/node_modules node vx.cjs [cellFilter] */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load, sleep } = require('./h.cjs');
const OUT = path.join(__dirname, '..', 'results', 'vx.jsonl');
const mask = s => String(s).replace(/contributors\/[^/?#\s"']+/g, 'contributors/<profile>');

function lum(c) { const m = String(c).match(/[\d.]+/g); if (!m) return null; const f = v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(+m[0]) + .7152 * f(+m[1]) + .0722 * f(+m[2]); }

async function fonts(page, sels) {
  const cdp = await page.context().newCDPSession(page); await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 }); const out = {};
  for (const s of sels) { try { const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: s }); const r = [];
      for (const id of nodeIds.slice(0, 2)) { const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: id }); r.push(fonts.map(f => f.familyName + ':' + f.glyphCount).join(',')); }
      out[s] = { n: nodeIds.length, painted: r }; } catch (e) { out[s] = 'err ' + String(e).slice(0, 80); } }
  return out;
}

const ACT = {
  async stories(page, w) {
    const r = await page.evaluate(() => {
      const o = {};
      const n = document.getElementById('tll-q-note'); o.note = n ? n.innerText.replace(/\s+/g, ' ').trim().slice(0, 200) : null;
      o.noteLinks = n ? [].map.call(n.querySelectorAll('a'), a => a.getAttribute('href') + ' ' + a.innerText.trim()) : null;
      o.cardsShown = [].filter.call(document.querySelectorAll('.tll-lib-card'), c => c.offsetParent !== null).length;
      const h = document.querySelector('.tll-library-newsletter h3'); if (h) { const cs = getComputedStyle(h), em = h.querySelector('em'); o.nlH3 = { fs: cs.fontSize, emColor: em && getComputedStyle(em).color, bg: null };
        let p = h; while (p && getComputedStyle(p).backgroundColor.match(/rgba\(0, 0, 0, 0\)|transparent/)) p = p.parentElement; o.nlH3.bg = p && getComputedStyle(p).backgroundColor; }
      const card = document.querySelector('.tll-lib-card'); if (card) { const foc = [card, ...card.querySelectorAll('*')].filter(e => e.tabIndex >= 0 && (e.matches('a[href],button,[tabindex]'))); o.cardTabStops = foc.map(e => e.tagName.toLowerCase() + '.' + (e.className || '').toString().split(' ')[0] + (e.getAttribute('role') ? '[role=' + e.getAttribute('role') + ']' : '')); }
      let lead = 0, tot = 0; for (const c of document.querySelectorAll('.tll-lib-card')) { const nm = c.querySelector('.tll-lib-byline-name'), pl = c.querySelector('[data-s3-place]'); if (!nm || !pl || !pl.offsetParent) continue; tot++;
        const a = nm.getBoundingClientRect(), b = pl.getBoundingClientRect(); if (b.top >= a.bottom - 2) lead++; }
      o.placeOwnLine = lead + ' of ' + tot;
      const pl = document.querySelector('.tll-lib-card [data-s3-place]'); if (pl) { o.placeBefore = getComputedStyle(pl, '::before').content; o.bylineDisplay = getComputedStyle(pl.parentElement).display + ' ' + getComputedStyle(pl.parentElement).flexWrap; }
      return o; });
    if (!/q=/.test(page.url())) { const chip = await page.$('[data-tll-place="Asia"]'); if (chip) { await chip.click().catch(() => {}); await sleep(800); r.urlAfterChip = await page.evaluate(() => location.pathname + location.search + location.hash); } }
    return r;
  },
  async support(page) { return page.evaluate(() => { const o = {}; const em = document.querySelector('.tll-support-direct-title em'); if (em) { const r = em.getBoundingClientRect(), p = em.closest('.tll-support-direct-inner') || em.parentElement.parentElement; o.em = { w: Math.round(r.width), right: Math.round(r.right), fs: getComputedStyle(em).fontSize, ws: getComputedStyle(em).whiteSpace, colRight: Math.round(p.getBoundingClientRect().right), vw: innerWidth, sw: document.documentElement.scrollWidth }; }
    o.ghost = [].map.call(document.querySelectorAll('a.tll-cta-ghost-dark'), a => { const cs = getComputedStyle(a); return { t: a.innerText.trim().slice(0, 30), color: cs.color, bg: cs.backgroundColor, fs: cs.fontSize, fw: cs.fontWeight }; }); return o; }); },
  async contact(page) { const o = await ACT.support(page); o.h = await page.evaluate(() => [].map.call(document.querySelectorAll('h2,h3'), h => { const em = h.querySelector('em,span[style*="color"]'); return em ? { t: h.innerText.trim().slice(0, 40), fs: getComputedStyle(h).fontSize, emColor: getComputedStyle(em).color } : null; }).filter(Boolean)); return o; },
  async about(page) { const o = await page.evaluate(() => [].map.call(document.querySelectorAll('.tll-about-final-cite,.tll-about-final-li,.tll-about-final-p,.tll-about-final-intro,.tll-about-final-button,.tll-about-final-button-secondary'), e => e.className.split(' ')[0] + ' ' + getComputedStyle(e).fontFamily).filter((v, i, a) => a.indexOf(v) === i));
    return { ff: o, painted: await fonts(page, ['.tll-about-final-cite', '.tll-about-final-li', '.tll-about-final-p', '.tll-about-final-intro', '.tll-about-final-button']) }; },
  async pen(page) { return page.evaluate(() => { const bgOf = e => { let p = e; while (p && /rgba\(0, 0, 0, 0\)|transparent/.test(getComputedStyle(p).backgroundColor)) p = p.parentElement; return p ? getComputedStyle(p).backgroundColor : 'none'; };
    const o = {}; for (const c of ['tll-pen-helptext', 'tll-pen-help', 'tll-pen-legend', 'tll-pen-status', 'tll-pen-label']) { const e = [].find.call(document.querySelectorAll('.' + c), x => x.offsetParent !== null && x.innerText.trim()); if (e) { const cs = getComputedStyle(e); o[c] = { color: cs.color, bg: bgOf(e), fs: cs.fontSize, fw: cs.fontWeight, st: cs.fontStyle, ff: cs.fontFamily.slice(0, 40) }; } else o[c] = 'none visible'; }
    const inp = [].find.call(document.querySelectorAll('input.tll-pen-input,textarea'), x => x.offsetParent !== null && x.placeholder); if (inp) o.ph = { color: getComputedStyle(inp, '::placeholder').color, bg: getComputedStyle(inp).backgroundColor };
    const nx = document.querySelector('.tllst-next'); if (nx) o.next = { r: getComputedStyle(nx).borderTopLeftRadius, ff: getComputedStyle(nx).fontFamily.slice(0, 30) };
    const pill = document.querySelector('#tll-note .tll-note-pill'); if (pill) { const r = pill.getBoundingClientRect(); o.pill = [r.left, r.top, r.width, r.height].map(Math.round); }
    const sh = [].find.call(document.querySelectorAll('a'), a => /^Share your story$/.test(a.innerText.trim()) && a.offsetParent); if (sh) o.navShare = Math.round(sh.getBoundingClientRect().height);
    return o; }); },
  async expats(page) { const o = {}; const labs = await page.$$('label.tllpr-check, label[data-tll-x="check"]'); o.n = labs.length; o.res = [];
    for (const l of labs) { const box = await l.boundingBox(); const inp = await l.$('input[type=checkbox]'); if (!box || !inp) { o.res.push('nobox'); continue; }
      const before = await inp.isChecked(); await page.mouse.click(box.x + box.width - 20, box.y + box.height / 2); await sleep(200); const after = await inp.isChecked();
      const name = await page.evaluate(e => { const ls = e.labels ? [].map.call(e.labels, x => x.innerText.trim().slice(0, 30)) : []; return { id: e.id, labels: ls, outerFor: e.closest('label').parentElement.closest('label') ? e.closest('label').parentElement.closest('label').getAttribute('for') : null }; }, inp);
      o.res.push({ before, after, name }); }
    const cdp = await page.context().newCDPSession(page); try { const { nodes } = await cdp.send('Accessibility.getFullAXTree'); o.axCheckboxNames = nodes.filter(n => n.role && n.role.value === 'checkbox').map(n => (n.name && n.name.value || '').slice(0, 40)); } catch (e) { o.ax = String(e).slice(0, 80); }
    o.exampleText = await page.evaluate(() => document.querySelectorAll('input[placeholder="Example text"]').length);
    return o; },
  async map(page, w, signed) { const o = await page.evaluate(() => { const o = {}; const a = [].find.call(document.querySelectorAll('a'), x => /Edit your countries/.test(x.textContent)); o.editHref = a && a.getAttribute('href'); o.editVisible = !!(a && a.offsetParent);
      const d = document.querySelector('.tllm-drawer'); if (d) { const foc = [].filter.call(d.querySelectorAll('a[href],button,input,[tabindex]'), e => e.tabIndex >= 0 && !e.disabled); const r = d.getBoundingClientRect(); o.drawer = { open: d.getAttribute('data-open'), inert: d.inert, focusable: foc.length, rect: [r.top, r.height].map(Math.round), vis: getComputedStyle(d).visibility }; }
      const g = document.querySelector('.tllm-card-grid'); if (g) o.grid = { cols: getComputedStyle(g).gridTemplateColumns, cards: g.children.length, w: Math.round(g.getBoundingClientRect().width), c0: g.children[0] ? Math.round(g.children[0].getBoundingClientRect().width) : null };
      const sm = document.getElementById('tllm-sample'); if (sm) o.sampleFF = getComputedStyle(sm).fontFamily;
      o.small = [].filter.call(document.querySelectorAll('#tll-map-layers button,#tll-map-layers a'), e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 44; }).slice(0, 6).map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 20) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height));
      return o; });
    if (o.sampleFF !== undefined) o.samplePainted = await fonts(page, ['#tllm-sample']);
    const a = await page.$('a:has-text("Edit your countries")');
    if (a && o.editVisible) { await a.scrollIntoViewIfNeeded(); await sleep(300); const y0 = await page.evaluate(() => scrollY); await a.click().catch(e => o.clickErr = String(e).slice(0, 80)); await sleep(1500);
      o.afterClick = await page.evaluate(y0 => ({ dy: Math.round(scrollY - y0), hash: location.hash, editorOpen: !!document.querySelector('.tllm-editor[data-open="1"],[data-tllm-editing="1"],.tllm-edit-panel:not([hidden])'), fs: !!document.fullscreenElement }), y0); }
    return o; },
  async profile(page) { return page.evaluate(() => [].slice.call(document.querySelectorAll('.tll-alb-tape small'), 0, 3).map(n => ({ fs: getComputedStyle(n).fontSize, ws: getComputedStyle(n).whiteSpace, sw: n.scrollWidth, tapeW: Math.round(n.parentElement.getBoundingClientRect().width), over: Math.round(n.getBoundingClientRect().left + n.scrollWidth - n.parentElement.getBoundingClientRect().right) }))); },
  async story(page) { return page.evaluate(() => { const o = {}; const s = [].find.call(document.querySelectorAll('a,button'), e => /Save for later/i.test(e.innerText) && e.offsetParent); if (s) { const r = s.getBoundingClientRect(); o.save = Math.round(r.width) + 'x' + Math.round(r.height); }
    const card = document.querySelector('.tll-lib-card'); if (card) o.cardTabStops = [card, ...card.querySelectorAll('*')].filter(e => e.tabIndex >= 0 && e.matches('a[href],button,[tabindex]')).length; return o; }); },
  async home(page) { return page.evaluate(() => { const card = document.querySelector('.tll-lib-card'); const o = {}; if (card) o.cardTabStops = [card, ...card.querySelectorAll('*')].filter(e => e.tabIndex >= 0 && e.matches('a[href],button,[tabindex]')).map(e => e.tagName.toLowerCase() + (e.getAttribute('role') ? '[role=' + e.getAttribute('role') + ']' : '')); o.cards = document.querySelectorAll('.tll-lib-card').length; return o; }); },
  async e404(page) { return page.evaluate(() => [].map.call(document.querySelectorAll('.tll404-btn'), b => getComputedStyle(b).borderTopLeftRadius + ' ' + getComputedStyle(b).backgroundColor)); },
  async account(page) { return page.evaluate(() => { const o = {}; const pill = document.querySelector('#tll-note .tll-note-pill'); if (pill) { const r = pill.getBoundingClientRect(); o.pill = [r.left, r.top, r.width, r.height].map(Math.round); const under = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2).filter(e => !e.closest('#tll-note')).slice(0, 2).map(e => e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0]); o.under = under; }
    o.mono85 = [].filter.call(document.querySelectorAll('[data-tll-wr=stats] dt,[data-tll-ls=sheet] li small'), e => e.offsetParent).map(e => getComputedStyle(e).fontSize).slice(0, 3); return o; }); },
};

const CELLS = [
  ['stories.html', 390, 0, '?q=zzqx', 'stories'], ['stories.html', 1440, 0, '?q=zzqx', 'stories'], ['stories.html', 390, 0, '', 'stories'],
  ['support.html', 390, 0, '', 'support'], ['contact.html', 390, 0, '', 'contact'],
  ['about.html', 390, 0, '', 'about'],
  ['submit.html', 390, 1, '', 'pen'], ['my-pets.html', 390, 1, '', 'pen'], ['share-photos.html', 390, 1, '', 'pen'],
  ['for-expats.html', 390, 0, '', 'expats'],
  ['the-map.html', 390, 0, '', 'map'], ['the-map.html', 1440, 1, '', 'map'], ['the-map.html', 390, 1, '', 'map'],
  ['profile.html', 390, 0, '', 'profile'],
  ['stories__lisbon-sun-sails-city-built-to-stand-back-up.html', 1440, 0, '', 'story'],
  ['home.html', 1440, 0, '', 'home'], ['this-page-does-not-exist-sweep.html', 1440, 0, '', 'e404'], ['account.html', 1440, 1, '', 'account'],
];
(async () => {
  const filt = process.argv[2] || '';
  const done = new Set(fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l).key) : []);
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  try { for (const [f, w, s, q, kind] of CELLS) { const key = f + ' ' + w + ' ' + s + ' ' + q; if (done.has(key) || (filt && key.indexOf(filt) < 0)) continue;
      global.__Q = q; global.__ACT = (page, file, ww, signed) => ACT[kind](page, ww, signed);
      const st = await load(browser, f, w, !!s);
      const rec = { key, page: st.page, w, signed: st.signed, q, errs: st.errs.length, wf: st.wfFetched, act: st.act };
      fs.appendFileSync(OUT, mask(JSON.stringify(rec)) + '\n'); console.log(key, 'errs', st.errs.length, 'wf', st.wfFetched, typeof st.act === 'string' ? st.act : 'ok'); } }
  finally { await browser.close(); }
})();
