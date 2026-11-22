/* Sweep Nov 21 CHECK, part 2: behavior and break tests, live vs branch. Usage: NODE_PATH=/opt/node22/lib/node_modules node bt.cjs [filter] */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load, sleep, OUT } = require('./ab.cjs');
const RES = path.join(OUT, process.env.BTRES || 'bt.jsonl');
const ev = (fn, ...a) => page => page.evaluate(fn, ...a);

const tabWalk = async (page) => { /* Tab from the top of the grid through the first two cards; record each stop */
  await page.evaluate(() => { const g = document.querySelector('.tll-lib-grid'); const b = document.createElement('button'); b.id = 'chk-start'; b.textContent = 'start'; g.parentNode.insertBefore(b, g); b.focus(); });
  const stops = []; const cards = await page.evaluate(() => [].slice.call(document.querySelectorAll('.tll-lib-card'), 0, 2).map((c, i) => (c.dataset.chk = i, i)));
  for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); const s = await page.evaluate(() => { const a = document.activeElement; const c = a.closest('.tll-lib-card'); return { card: c ? c.dataset.chk : null, what: a.tagName.toLowerCase() + '.' + String(a.className).split(' ')[0] + (a.getAttribute('role') ? '[' + a.getAttribute('role') + ']' : '') }; });
    if (s.card === null) { if (stops.length) break; continue; } stops.push(s); }
  const per = {}; stops.forEach(s => per[s.card] = (per[s.card] || 0) + 1); return { per, stops: stops.slice(0, 7).map(s => s.card + ':' + s.what) };
};
const clickLabels = async (page) => { const out = [];
  const labs = await page.$$('form label');
  for (const l of labs) { const inp = await l.$('input[type=checkbox]'); if (!inp) continue; const txt = await l.$('span'); const tgt = txt || l; await tgt.scrollIntoViewIfNeeded(); const bx = await tgt.boundingBox(); if (!bx) { out.push('hidden'); continue; }
    const before = await inp.isChecked(); await page.mouse.click(bx.x + bx.width - 6, bx.y + bx.height / 2); await sleep(250); out.push((before ? 'was-on ' : '') + ((await inp.isChecked()) ? 'ticked' : 'NOT ticked') + ' for=' + (await l.getAttribute('for') === '' ? 'empty' : 'set')); }
  const cdp = await page.context().newCDPSession(page); let ax = []; try { const { nodes } = await cdp.send('Accessibility.getFullAXTree'); ax = nodes.filter(n => n.role && n.role.value === 'checkbox' && !n.ignored).map(n => (n.name && n.name.value || '(no name)').slice(0, 24)); } catch (e) { }
  const named = await page.evaluate(() => [].filter.call(document.querySelectorAll('form input:not([type=hidden]):not([type=submit]),form textarea,form select'), i => i.offsetParent).map(i => i.labels && i.labels.length ? 1 : 0));
  return { clicks: out, ax, fieldsWithLabel: named.reduce((a, b) => a + b, 0) + ' of ' + named.length };
};
const chipFlow = async (page) => { const o = {}; const asia = await page.$('[data-tll-chips="place-sort"] [data-tll-place="Asia"]'); if (!asia) return 'no Asia chip';
  const h0 = await page.evaluate(() => history.length);
  await asia.click(); await sleep(500); o.afterAsia = await page.evaluate(() => location.search + ' shown ' + [].filter.call(document.querySelectorAll('.tll-lib-card'), c => c.offsetParent).length);
  const all = await page.$('[data-tll-chips="place-sort"] [data-tll-place="all"]'); if (all) { await all.click(); await sleep(400); o.afterAll = await page.evaluate(() => location.search + ' shown ' + [].filter.call(document.querySelectorAll('.tll-lib-card'), c => c.offsetParent).length); }
  o.historyGrew = (await page.evaluate(() => history.length)) - h0; return o; };
const placeState = ev(() => ({ url: location.search, pressed: [].map.call(document.querySelectorAll('[data-tll-place][aria-pressed="true"]'), c => c.getAttribute('data-tll-place')), shown: [].filter.call(document.querySelectorAll('.tll-lib-card'), c => c.offsetParent).length,
  note: (document.getElementById('tll-q-note') || {}).innerText || null }));
const gateCard = ev(() => { const b = document.getElementById('tll-gate-back'); const pill = document.querySelector('#tll-note .tll-note-pill') || document.getElementById('tll-note');
  const r = e => { if (!e) return null; const x = e.getBoundingClientRect(); return [Math.round(x.left), Math.round(x.top), Math.round(x.right), Math.round(x.bottom)]; };
  const ov = (a, b) => a && b && !(a[2] <= b[0] || b[2] <= a[0] || a[3] <= b[1] || b[3] <= a[1]);
  const fixed = [].filter.call(document.querySelectorAll('body *'), e => { const c = getComputedStyle(e); return c.position === 'fixed' && e.offsetWidth && e.id !== 'tll-gate-back' && !b?.contains(e) && c.display !== 'none' && c.visibility !== 'hidden'; }).map(e => ({ k: e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + '.' + String(e.className).split(' ')[0], r: r(e) }));
  return { card: b ? { text: b.innerText.replace(/\s+/g, ' '), href: b.querySelector('a').getAttribute('href'), r: r(b) } : null, pill: r(pill), overlapsFixed: b ? fixed.filter(f => ov(f.r, r(b))).map(f => f.k) : [], key: sessionStorage.getItem('tll-gate-return') ? 'set' : 'none' }; });
const setKey = (p, ageMin) => new Function('if(!sessionStorage.getItem("chk-once")){sessionStorage.setItem("chk-once","1");sessionStorage.setItem("tll-gate-return",JSON.stringify({p:' + JSON.stringify(p) + ',t:Date.now()-' + (ageMin * 60000) + '}));}');
const gateClick = async (page) => { const o = {}; const links = []; for (const h of await page.$$('[data-ms-content="anonymous"] a[href^="/login"]')) if (!(await h.evaluate(a => !!a.closest('nav')))) links.push(h);
  o.gateLinks = links.length; let vis = null; for (const l of links) if (await l.isVisible()) { vis = l; break; }
  o.visible = !!vis; if (!vis) { await page.evaluate(() => { const a = [].find.call(document.querySelectorAll('[data-ms-content="anonymous"] a[href^="/login"]'), x => !x.closest('nav')); if (a) a.click(); }); } else await vis.click();
  await page.waitForLoadState('load').catch(() => { }); await sleep(1500);
  o.landed = await page.evaluate(() => location.pathname); o.key = await page.evaluate(() => { try { const v = JSON.parse(sessionStorage.getItem('tll-gate-return')); return v ? v.p : null; } catch (e) { return 'bad'; } }); return o; };
const navClick = async (page) => { /* a nav Log in link on a gate page must not set the key */
  await page.evaluate(() => { const a = [].find.call(document.querySelectorAll('nav a[href^="/login"]'), x => x); if (a) { a.addEventListener('click', e => e.preventDefault(), { once: true }); a.click(); } });
  return page.evaluate(() => ({ key: sessionStorage.getItem('tll-gate-return'), navLogin: !!document.querySelector('nav a[href^="/login"]') })); };
const cardBack = async (page) => { const a = await page.$('#tll-gate-back a'); if (!a) return 'no card'; await a.click(); await page.waitForLoadState('load').catch(() => { }); await sleep(2500);
  return page.evaluate(() => ({ at: location.pathname, key: sessionStorage.getItem('tll-gate-return'), card: !!document.getElementById('tll-gate-back') })); };
const closeCard = async (page) => { const x = await page.$('#tll-gate-back button'); if (!x) return 'no card'; await x.click(); await sleep(200); return page.evaluate(() => ({ key: sessionStorage.getItem('tll-gate-return'), card: !!document.getElementById('tll-gate-back') })); };

const pillOpen = async (page) => { const p = await page.$('#tll-note .tll-note-pill'); if (!p) return 'no pill'; await p.click(); await sleep(500);
  return page.evaluate(() => { const r = e => { if (!e) return null; const x = e.getBoundingClientRect(); return [Math.round(x.left), Math.round(x.top), Math.round(x.right), Math.round(x.bottom)]; };
    const card = document.getElementById('tll-note-card'); const pill = document.querySelector('#tll-note .tll-note-pill'); const side = [].filter.call(document.querySelectorAll('a'), a => { const x = a.getBoundingClientRect(); return x.left < 300 && x.bottom > innerHeight - 120 && x.width > 0; }).length;
    return { vw: innerWidth, vh: innerHeight, pill: r(pill), card: r(card), cardInView: card ? (r(card)[0] >= 0 && r(card)[2] <= innerWidth && r(card)[1] >= 0) : null, cardVisible: card ? getComputedStyle(card).display !== 'none' && card.offsetWidth > 0 : null }; }); };
const SLOW = { lat: 300, down: 200000, cpu: 4 };
const T = [];
const both = (name, file, w, s, opt) => { for (const v of ['live', 'br']) T.push([name, v, file, w, s, opt]); };
const br = (name, file, w, s, opt) => T.push([name, 'br', file, w, s, opt]);
both('A01 no match', 'stories.html', 390, 0, { q: '?q=zzqx', act: placeState });
both('A01 match', 'stories.html', 390, 0, { q: '?q=lisbon', act: placeState });
both('A11 tab walk', 'stories.html', 1440, 0, { act: tabWalk });
both('A11 tab walk 390', 'stories.html', 390, 0, { act: tabWalk });
both('A12 chip flow', 'stories.html', 1440, 0, { act: chipFlow });
both('A12 ?place=Europe', 'stories.html', 1440, 0, { q: '?place=Europe', act: placeState });
br('A12 ?place=europe lower', 'stories.html', 390, 0, { q: '?place=europe', act: placeState });
br('A12 ?place=Nowhere', 'stories.html', 390, 0, { q: '?place=Nowhere', act: placeState });
br('A12 ?place=all', 'stories.html', 390, 0, { q: '?place=all', act: placeState });
br('A12 ?q=lisbon&place=Europe', 'stories.html', 390, 0, { q: '?q=lisbon&place=Europe', act: placeState });
br('A12 ?place=<script>', 'stories.html', 390, 0, { q: '?place=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E', act: placeState });
br('A12 chips script missing', 'stories.html', 390, 0, { q: '?place=Europe', act: placeState, mod: b => b.replace('<script id="tll-lib-chips-v1">', '<script id="tll-lib-chips-v1" type="text/plain">') });
both('A07 label clicks', 'for-expats.html', 390, 0, { act: clickLabels });
br('A07 inputs without id', 'for-expats.html', 390, 0, { act: clickLabels, mod: b => b.replace(/(<input[^>]*type="checkbox"[^>]*?) id="[^"]*"/g, '$1') });
both('A08 gate click /submit', 'submit.html', 390, 0, { act: gateClick });
br('A08 gate click /my-pets', 'my-pets.html', 1440, 0, { act: gateClick });
br('A08 gate click /share-photos', 'share-photos.html', 390, 0, { act: gateClick });
br('A08 nav login does not set', 'submit.html', 1440, 0, { act: navClick });
both('A09 pill open /account 1440', 'account.html', 1440, 1, { act: pillOpen });
both('A09 pill open /account 960', 'account.html', 960, 1, { act: pillOpen });
both('A08 card on /account 1440', 'account.html', 1440, 1, { init: setKey('/submit', 1), act: gateCard });
br('A08 card on /account 390', 'account.html', 390, 1, { init: setKey('/my-pets', 1), act: gateCard });
br('A08 card on /stories 390', 'stories.html', 390, 1, { init: setKey('/share-photos', 1), act: gateCard });
br('A08 card on home 1440', 'home.html', 1440, 1, { init: setKey('/submit', 1), act: gateCard });
br('A08 card back link', 'account.html', 1440, 1, { init: setKey('/submit', 1), act: cardBack });
br('A08 card close', 'account.html', 390, 1, { init: setKey('/submit', 1), act: closeCard });
br('A08 expired 31 min', 'account.html', 1440, 1, { init: setKey('/submit', 31), act: gateCard });
br('A08 signed out with key', 'stories.html', 390, 0, { init: setKey('/submit', 1), act: gateCard });
br('A08 Memberstack blocked', 'account.html', 1440, 1, { init: setKey('/submit', 1), noMs: true, wait: 8000, act: gateCard });
br('A08 bad key json', 'account.html', 1440, 1, { init: () => { sessionStorage.setItem('tll-gate-return', '{bad'); }, act: gateCard });
for (const [f, w, s] of [['stories.html', 390, 0], ['for-expats.html', 390, 0], ['account.html', 1440, 1], ['submit.html', 390, 1]]) both('slow net ' + f, f, w, s, { throttle: SLOW, wait: 9000, q: f === 'stories.html' ? '?place=Europe' : '', act: f === 'stories.html' ? placeState : null });
for (const [f, w, s] of [['stories.html', 390, 0], ['for-expats.html', 390, 0], ['account.html', 1440, 1], ['submit.html', 390, 1], ['support.html', 390, 0]]) br('chunks blocked ' + f, f, w, s, { block: /^chunks\//, wait: 5000 });
for (const [f, w, s] of [['stories.html', 390, 0], ['for-expats.html', 390, 0]]) both('core and chunks 3 s late ' + f, f, w, s, { slowJs: 3000, wait: 7000, q: f === 'stories.html' ? '?place=Asia' : '', act: f === 'stories.html' ? placeState : clickLabels });
br('preview flag countries chunk', 'stories.html', 390, 0, { q: '?preview=wire' });

(async () => {
  const flt = process.argv[2]; const done = new Set(fs.existsSync(RES) ? fs.readFileSync(RES, 'utf8').split('\n').filter(Boolean).map(l => { const j = JSON.parse(l); return j.name + ' ' + j.v; }) : []);
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try { for (const [name, v, f, w, s, opt] of T) { if (flt && !name.includes(flt)) continue; if (done.has(name + ' ' + v)) continue;
      const st = await load(browser, v, f, w, !!s, Object.assign({ sig: false, tag: 'bt' }, opt)); st.name = name;
      fs.appendFileSync(RES, JSON.stringify(st) + '\n'); console.log(name, v, 'errs', st.errs.length, 'cls', st.perf && st.perf.cls, JSON.stringify(st.act || '').slice(0, 300), st.navErr || ''); } }
  finally { await browser.close(); }
})();
