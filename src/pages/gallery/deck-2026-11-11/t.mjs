/* Tests for tll-lounge-deck-v1 (handoff/CHANGE-LOG-LOUNGE-POSTCARDS-2026-11-11.md, test plan items 1 to 13).
   Run from the repository root after python3 src/site-layers/build-site-layers-v16.py:
     NODE_PATH=<a folder holding playwright>/node_modules node src/pages/gallery/deck-2026-11-11/t.mjs [chromium|webkit]
   The page is the saved copy of the live /gallery of 11 November 2026 (live-gallery-2026-11-11.html), served at its real address.
   Only two things are swapped: the site layers core and its chunks come from this working tree (the build under test, or the
   committed build for the comparison in item 1), and the Worker's /lounge answer is set by the test. Stylesheets, fonts and photos
   come from the live site, as a visitor would get them. Analytics and ads are not requested. */
import { createRequire } from 'module'; const pw = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url'; import { execSync } from 'child_process';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../../..');
const ENGINE = process.argv[2] || 'chromium';
const PAGE = 'https://www.thatlayover.life/gallery';
const FIX = fs.readFileSync(path.join(DIR, 'live-gallery-2026-11-11.html'), 'utf8');
const CORE_TAG = /<script src="https:\/\/cdn\.jsdelivr\.net\/gh\/[^"]*\/src\/site-layers\/tll-site-layers-v16\.js"[^>]*>/;
if (!CORE_TAG.test(FIX)) throw new Error('core script tag not found in the saved page');
const html = (o) => { let h = FIX.replace(CORE_TAG, `<script src="https://layers.test/${o.old ? 'old' : 'new'}/src/site-layers/tll-site-layers-v16.js" type="text/javascript">`);
  if (o.open) { const a = 'data-tll-credit="NC · LAOS" '; if (!h.includes('data-tll-img="https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6acce4ad') ) {} h = h.replace(/data-tll-img="[^"]*" data-tll-credit="NC · LAOS"/, 'data-tll-credit="NC · LAOS"'); if (/data-tll-img="[^"]*" data-tll-credit="NC · LAOS"/.test(h) || !h.includes(a)) throw new Error('open slot fixture'); }
  return h; };
const oldFile = (rel) => execSync(`git show HEAD:${rel}`, { cwd: ROOT, maxBuffer: 1 << 26 });
const BLOCK = /googletagmanager|google-analytics|doubleclick|googlesyndication|adservice|clarity\.ms|facebook\.net/;
const MEMBERS = { photos: [
  { img: 'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6a0e02265e2392e5fc632431_Montenegro%20coast.jpg', alt: 'Tram 28 on a hill', place: 'Lisbon, Portugal', country: 'Portugal', credit: 'JC', caption: 'The tram that never came' },
  { img: 'https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6a0e02265e2392e5fc632431_Montenegro%20coast.jpg', alt: '', place: 'Kyoto, Japan', country: 'Japan', credit: '', caption: '' } ] };

let pass = 0, fail = 0; const fails = [];
const ok = (cond, name, got) => { if (cond) { pass++; } else { fail++; fails.push(name + (got !== undefined ? ' | got: ' + JSON.stringify(got) : '')); console.log('FAIL', name, got !== undefined ? JSON.stringify(got) : ''); } };
const eq = (a, b, name) => ok(JSON.stringify(a) === JSON.stringify(b), name, a);

const browser = await pw[ENGINE].launch();
async function open(o = {}) {
  const w = o.w || 390, mobile = w < 768;
  const ctx = await browser.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, hasTouch: mobile && ENGINE === 'chromium', reducedMotion: o.still ? 'reduce' : 'no-preference', deviceScaleFactor: 1 });
  const reqs = [], errs = [];
  await ctx.addInitScript(() => { window.__deckAt = null; window.__dcl = null;
    document.addEventListener('DOMContentLoaded', () => { window.__dcl = performance.now(); const s = document.createElement('style'); s.textContent = '#cc-main{display:none!important}'; document.head.appendChild(s); });
    new MutationObserver(() => { if (window.__deckAt === null && document.querySelector('.tll-deck .tll-deck-card')) window.__deckAt = performance.now(); }).observe(document, { childList: true, subtree: true }); });
  await ctx.route('**/*', async (r) => { const u = r.request().url(); reqs.push(u);
    if (u.split('?')[0].replace(/\/$/, '') === PAGE) return r.fulfill({ body: html(o), contentType: 'text/html; charset=utf-8' });
    if (u.startsWith('https://layers.test/')) { const m = /^https:\/\/layers\.test\/(old|new)\/(.*)$/.exec(u); let body;
      try { body = m[1] === 'old' ? oldFile(m[2]) : fs.readFileSync(path.join(ROOT, m[2])); } catch (e) { return r.fulfill({ status: 404, body: 'not found', headers: { 'Access-Control-Allow-Origin': '*' } }); }
      return r.fulfill({ body, contentType: 'application/javascript; charset=utf-8', headers: { 'Access-Control-Allow-Origin': '*' } }); }
    if (/workers\.dev\/lounge/.test(u)) return o.members ? r.fulfill({ body: JSON.stringify(MEMBERS), contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' } })
      : r.fulfill({ status: 404, body: '{"error":"not found"}', contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' } });
    if (BLOCK.test(u)) return r.abort();
    return r.continue(); });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  await page.goto(PAGE + (o.q || ''), { waitUntil: 'load' }); await page.waitForTimeout(o.members ? 1500 : 900);
  return { ctx, page, reqs, errs };
}
const TOP = '.tll-deck-stage .tll-deck-card:not([aria-hidden="true"])';
const count = (page) => page.locator('.tll-deck-count').innerText();
const state = (page) => page.evaluate(() => { const c = document.querySelector('.tll-deck-stage .tll-deck-card:not([aria-hidden="true"])'); const cr = c && c.querySelector('.tll-deck-credit');
  return { count: document.querySelector('.tll-deck-count').textContent, label: c && c.getAttribute('aria-label'), credit: cr && cr.textContent, text: c && c.innerText.trim(), live: document.querySelector('.tll-deck-sr').textContent, cards: document.querySelectorAll('.tll-deck-stage .tll-deck-card').length }; });
async function dragBy(page, dx, o = {}) { await page.evaluate(() => document.querySelector('.tll-deck').scrollIntoView({ block: 'start' })); await page.waitForTimeout(80); const b = await page.locator(TOP).boundingBox(); const x = b.x + b.width / 2, y = b.y + b.height / 2; const n = o.fast ? 3 : 10;
  await page.mouse.move(x, y); await page.mouse.down();
  for (let i = 1; i <= n; i++) { await page.mouse.move(x + dx * i / n, y + (o.dy || 0) * i / n); await page.waitForTimeout(o.fast ? 8 : 35); }
  if (o.mid) await o.mid(); if (!o.fast) await page.waitForTimeout(220); await page.mouse.up(); await page.waitForTimeout(600); }
const shot = async (page, name) => { if (!/^(before|drag)/.test(name)) await page.evaluate(() => { const c = document.querySelector('[data-tll-lounge-chips]'); scrollTo(0, c.getBoundingClientRect().top + scrollY - (innerWidth < 768 ? 150 : 110)); }); await page.waitForTimeout(120); await page.screenshot({ path: path.join(DIR, `${name}.png`) }); };
const mainHtml = (page) => page.evaluate(() => document.querySelector('main').innerHTML);

for (const w of [390, 1440]) {
  const T = `[${ENGINE} ${w}] `;
  /* 1. Without the flag: today's Lounge, and the new code is not downloaded. Compared with the committed build on the same saved page. */
  { const a = await open({ w, old: true }), b = await open({ w });
    const ha = await mainHtml(a.page), hb = await mainHtml(b.page);
    ok(ha === hb, T + '1 no flag: main is identical with the committed build and with this build'); 
    ok(b.reqs.some((u) => /\/new\/src\/site-layers\/chunks\/misc\.js$/.test(u)), T + '1 no flag: public misc chunk loaded');
    ok(!b.reqs.some((u) => /misc-preview/.test(u)), T + '1 no flag: preview chunk not downloaded');
    eq(await b.page.evaluate(() => [!!document.querySelector('.tll-deck'), !!document.getElementById('tll-lounge-deck-v1'), typeof window.__tllLoungeDeck, document.querySelectorAll('[data-tll-loc]').length]), [false, false, 'undefined', 17], T + '1 no flag: no deck, 17 tiles');
    await b.page.evaluate(() => { const c = document.querySelector('[data-tll-lounge-chips]'); scrollTo(0, c.getBoundingClientRect().top + scrollY - (innerWidth < 768 ? 150 : 110)); });
    await shot(b.page, `before-${ENGINE}-${w}`);
    var baseReqs = b.reqs.slice(), baseErrs = b.errs.slice(); await a.ctx.close(); await b.ctx.close(); }

  /* 2 to 8, 11, 12 on one page. */
  { const { ctx, page, reqs, errs } = await open({ w, q: '?preview=lounge' });
    ok(reqs.some((u) => /\/new\/src\/site-layers\/chunks\/misc-preview\.js$/.test(u)), T + '2 flag: preview chunk loaded');
    let s = await state(page);
    eq([s.count, s.label, s.credit, s.text, s.cards], ['1 of 17', 'Montenegro, photo by NC', 'NC · MONTENEGRO', 'NC · MONTENEGRO', 3], T + '2 first card is Montenegro, 1 of 17, three cards in the stack');
    eq(await page.evaluate(() => { const t = document.querySelector('[data-tll-loc]'), g = t.parentElement, d = document.querySelector('.tll-deck'); return [getComputedStyle(g).display, d.getAttribute('aria-label'), d.previousElementSibling.hasAttribute('data-tll-lounge-chips'), document.querySelectorAll('[data-tll-loc]').length]; }), ['none', 'Lounge photos', true, 17], T + '2 grid hidden, deck labeled, chips above the deck, tiles left in the page');
    const timing = await page.evaluate(() => [Math.round(window.__deckAt - window.__dcl)]); ok(timing[0] < 500, T + '12 deck within half a second of the page being parsed', timing);
    const geo = await page.evaluate(() => { const c = document.querySelector('.tll-deck-stage .tll-deck-card:not([aria-hidden="true"])').getBoundingClientRect(), bar = document.querySelector('.tll-deck-links').getBoundingClientRect(), bs = [].map.call(document.querySelectorAll('.tll-deck button,.tll-deck a'), (b) => { const r = b.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; });
      return { cw: Math.round(c.width), ch: Math.round(c.height), left: Math.round(c.left), right: Math.round(innerWidth - c.right), deckH: Math.round(bar.bottom - c.top), sw: document.documentElement.scrollWidth, iw: innerWidth, small: bs.filter((x) => x[0] < 44 || x[1] < 44) }; });
    if (w === 390) eq([geo.cw, geo.ch, geo.left, geo.right], [342, 428, 24, 24], T + '7 phone card 342 wide, 4:5, 24 px margins'); else eq([geo.cw, geo.ch, geo.left === geo.right], [420, 525, true], T + '7 desktop card 420 wide, 4:5, centered');
    ok(geo.deckH < (w === 390 ? 844 : 900) - 60 && geo.sw <= geo.iw && !geo.small.length, T + '7 deck fits one screen, no sideways scroll, targets at least 44 px', geo);
    await shot(page, `after-${ENGINE}-${w}`);

    /* 3. drags */
    await dragBy(page, 100); s = await state(page); eq(s.count, '1 of 17', T + '3 a 100 px drag springs back');
    eq(await page.evaluate((sel) => getComputedStyle(document.querySelector(sel)).transform, TOP), 'matrix(1, 0, 0, 1, 0, 0)', T + '3 the card is back in place');
    await dragBy(page, 160, { mid: () => shot(page, `drag-${ENGINE}-${w}`) }); s = await state(page); eq([s.count, s.credit, s.live], ['2 of 17', 'NC · VIETNAM', 'Photo 2 of 17, Vietnam'], T + '3 a 160 px drag throws the card');
    await dragBy(page, -160); eq(await count(page), '3 of 17', T + '3 a drag to the left throws it too');
    await dragBy(page, 70, { fast: true }); eq(await count(page), '4 of 17', T + '3 a quick flick throws it');
    await dragBy(page, 10, { dy: 160 }); eq(await count(page), '4 of 17', T + '3 an up and down drag does not move the deck');
    eq(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, T + '3 no sideways scroll after throws');

    /* 4. buttons, keys, end card */
    await page.locator('.tll-deck [data-deck="prev"]').click(); await page.waitForTimeout(450); eq(await count(page), '3 of 17', T + '4 Previous');
    await page.locator('.tll-deck [data-deck="next"]').click(); await page.waitForTimeout(450); eq(await count(page), '4 of 17', T + '4 Next');
    await page.locator(TOP).focus(); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(450); eq(await count(page), '5 of 17', T + '4 right arrow');
    eq(await page.evaluate((sel) => document.activeElement === document.querySelector(sel), TOP), true, T + '3 focus moves to the new top card, never a card that has gone');
    await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(450); eq(await count(page), '4 of 17', T + '4 left arrow');
    for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(380); }
    eq([await count(page), await page.locator('.tll-deck [data-deck="prev"]').isDisabled()], ['1 of 17', true], T + '4 back at card 1, Previous off');

    /* 7 and 8: every card against its tile */
    const tiles = await page.evaluate(() => [].map.call(document.querySelectorAll('[data-tll-loc]'), (t) => t.getAttribute('data-tll-credit')));
    const seen = []; let a11y = true;
    for (let i = 0; i < 17; i++) { s = await state(page); seen.push([s.text, s.label]);
      const one = await page.evaluate(() => { const all = [].slice.call(document.querySelectorAll('.tll-deck-stage .tll-deck-card')); const open = all.filter((c) => c.getAttribute('aria-hidden') !== 'true'); return [open.length, all.filter((c) => c.getAttribute('aria-hidden') === 'true').every((c) => c.hasAttribute('inert') && !c.hasAttribute('tabindex'))]; });
      if (one[0] !== 1 || !one[1]) a11y = false;
      /* The last step is by keyboard: Safari does not focus a button on a mouse click, and the focus hand-over is for keyboard users. */
      if (i < 16) await page.locator('.tll-deck [data-deck="next"]').click(); else { await page.locator('.tll-deck [data-deck="next"]').focus(); await page.keyboard.press('Enter'); }
      await page.waitForTimeout(420); }
    const nice = (p) => p.replace(/[^\s,]+/g, (x) => x.length > 3 ? x[0] + x.slice(1).toLowerCase() : x);
    eq(seen, tiles.map((c) => [c, nice(c.split(' · ')[1]) + ', photo by ' + c.split(' · ')[0]]), T + '7 each card shows its tile credit and nothing else, and is read as place and credit');
    ok(a11y, T + '8 only the top card is open to screen readers; the others are hidden and inert');
    eq(await page.evaluate(() => [].map.call(document.querySelectorAll('.tll-deck [data-deck="prev"],.tll-deck [data-deck="next"]'), (b) => b.getAttribute('aria-label'))), ['Previous photo', 'Next photo'], T + '8 button names');
    s = await state(page);
    eq([s.text.replace(/\s+/g, ' '), s.live, s.count, await page.locator('.tll-deck [data-deck="next"]').isDisabled()], ['That is all 17. Start again Add yours', 'That is all 17.', '', true], T + '4 end card after card 17');
    eq(await page.evaluate(() => { const a = document.querySelector('.tll-deck-card.is-end a'); return [a.getAttribute('href'), document.activeElement.textContent]; }), ['/share-photos', 'Start again'], T + '4 end card links to /share-photos; focus on Start again');
    await shot(page, `end-${ENGINE}-${w}`);
    await page.locator('.tll-deck [data-deck="restart"]').click(); await page.waitForTimeout(450); eq(await count(page), '1 of 17', T + '4 Start again');

    /* 5. chips */
    const chips = {}; for (const c of ['Europe', 'Americas', 'Asia', 'Antarctica', 'Africa', 'Middle East', 'all']) { await page.locator(`[data-tll-lounge-chips] button[data-val="${c}"]`).click(); await page.waitForTimeout(250); chips[c] = await count(page); }
    eq(chips, { Europe: '1 of 5', Americas: '1 of 5', Asia: '1 of 3', Antarctica: '1 of 2', Africa: '1 of 1', 'Middle East': '1 of 1', all: '1 of 17' }, T + '5 chips filter the deck');
    await page.locator('[data-tll-lounge-chips] button[data-val="Antarctica"]').click(); await page.waitForTimeout(250);
    for (let i = 0; i < 2; i++) { await page.locator('.tll-deck [data-deck="next"]').click(); await page.waitForTimeout(420); }
    s = await state(page); eq(s.text.replace(/\s+/g, ' '), 'That is all 2. Start again Add yours', T + '5 end card counts the filtered deck');
    await page.locator('[data-tll-lounge-chips] button[data-val="all"]').click(); await page.waitForTimeout(250);

    /* 6. ADD YOURS */
    eq(await page.evaluate(() => { const a = document.querySelector('.tll-deck a.tll-deck-add'), r = a.getBoundingClientRect(); return [a.textContent, a.getAttribute('href'), r.width > 0 && r.bottom <= innerHeight + scrollY + 2000]; }), ['+ ADD YOURS', '/share-photos', true], T + '6 ADD YOURS by the deck, to /share-photos');

    /* 11. grid and back */
    for (let i = 0; i < 2; i++) { await page.locator('.tll-deck [data-deck="next"]').click(); await page.waitForTimeout(420); }
    await page.locator('.tll-deck [data-deck="grid"]').click(); await page.waitForTimeout(200);
    eq(await page.evaluate(() => { const g = document.querySelector('[data-tll-loc]').parentElement; return [getComputedStyle(document.querySelector('.tll-deck')).display, getComputedStyle(g).display !== 'none', [].filter.call(document.querySelectorAll('[data-tll-loc]'), (t) => t.getBoundingClientRect().width > 0).length, document.activeElement.textContent, !!document.querySelector('a[href="/share-photos"]')]; }), ['none', true, 17, 'Back to the deck', true], T + '11 See all as a grid shows the 17 tiles; focus on Back to the deck');
    await shot(page, `grid-${ENGINE}-${w}`);
    await page.locator('.tll-deck-backbar [data-deck="deck"]').click(); await page.waitForTimeout(200);
    eq([await count(page), await page.evaluate(() => [getComputedStyle(document.querySelector('[data-tll-loc]').parentElement).display, document.activeElement.textContent])], ['3 of 17', ['none', 'See all as a grid']], T + '11 Back to the deck returns to the same card');

    /* 12. requests and errors */
    /* Left out of the comparison: the site's own pages (the address with the flag, and the pet page a core layer fetches on a timer) and the page's own Google consent messages (a new token on every load). The deck layer itself makes no request: see the last check. */
    const extra = [...new Set(reqs)].filter((u) => !baseReqs.includes(u) && !/misc-preview\.js$/.test(u) && !/^https:\/\/www\.thatlayover\.life\//.test(u) && !/^https:\/\/fundingchoicesmessages\.google\.com\//.test(u));
    ok(!reqs.some((u) => /tailwind|unsplash/i.test(u)), T + '12 no Tailwind or Unsplash requests');
    eq([...new Set(reqs.filter((u) => /fonts\.(googleapis|gstatic)/.test(u)))].filter((u) => !baseReqs.includes(u)), [], T + '12 no font request the page did not already make');
    ok(extra.every((u) => /^https:\/\/(cdn\.prod\.website-files\.com|res\.cloudinary\.com)\//.test(u) || baseReqs.some((b) => b.split('?')[0] === u.split('?')[0])), T + '12 nothing new requested besides the preview chunk and the photos', extra.filter((u) => !/^https:\/\/(cdn\.prod\.website-files\.com|res\.cloudinary\.com)\//.test(u)));
    eq(errs.filter((e) => !baseErrs.includes(e)), [], T + '12 no console errors the page did not already have');
    ok(!/fetch\(|XMLHttpRequest|sendBeacon|import\(/.test(fs.readFileSync(path.join(ROOT, 'src/site-layers/tll-lounge-deck-v1.js'), 'utf8')), T + '12 the deck layer makes no request of its own');
    await ctx.close(); }

  /* 6. open slot */
  { const { ctx, page } = await open({ w, q: '?preview=lounge', open: true });
    await page.locator('[data-tll-lounge-chips] button[data-val="Asia"]').click(); await page.waitForTimeout(250);
    for (let i = 0; i < 2; i++) { await page.locator('.tll-deck [data-deck="next"]').click(); await page.waitForTimeout(420); }
    eq(await page.evaluate((sel) => { const c = document.querySelector(sel), a = c.querySelector('a'); return [c.innerText.trim(), a && a.getAttribute('href'), c.getAttribute('aria-label'), document.querySelector('.tll-deck-count').textContent]; }, TOP), ['OPEN SLOT · ASIA', '/share-photos', 'OPEN SLOT · ASIA', '3 of 3'], T + '6 a tile without a photo is an OPEN SLOT card with the share link');
    await ctx.close(); }

  /* 9. reduced motion */
  { const { ctx, page } = await open({ w, q: '?preview=lounge', still: true });
    eq(await page.evaluate(() => [].map.call(document.querySelectorAll('.tll-deck-stage .tll-deck-card'), (c) => { const s = getComputedStyle(c), m = s.transform.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number); return [s.transitionDuration.split(',').every((d) => parseFloat(d) === 0), m[1] === 0 && m[2] === 0]; })), [[true, true], [true, true], [true, true]], T + '9 reduced motion: no transition, no tilt');
    let moved = null; await dragBy(page, 160, { mid: async () => { moved = await page.evaluate((sel) => getComputedStyle(document.querySelector(sel)).transform, TOP); } });
    eq([moved, await count(page), await page.locator('.tll-deck-stage .tll-deck-card').count()], ['matrix(1, 0, 0, 1, 0, 0)', '2 of 17', 3], T + '9 reduced motion: no throw, the card simply changes on a swipe');
    await page.locator('.tll-deck [data-deck="next"]').click(); await page.locator(TOP).focus(); await page.keyboard.press('ArrowRight'); eq(await count(page), '4 of 17', T + '9 reduced motion: buttons and keys still work');
    await shot(page, `still-${ENGINE}-${w}`); await ctx.close(); }

  /* deck above the grid */
  { const { ctx, page } = await open({ w, q: '?preview=lounge-above' });
    eq(await page.evaluate(() => [!!document.querySelector('.tll-deck'), getComputedStyle(document.querySelector('[data-tll-loc]').parentElement).display !== 'none', !!document.querySelector('.tll-deck [data-deck="grid"]'), !!document.querySelector('.tll-deck-backbar'), document.querySelector('.tll-deck-count').textContent]), [true, true, false, false, '1 of 17'], T + 'L12 ?preview=lounge-above: deck above, grid still shown');
    await page.screenshot({ path: path.join(DIR, `above-${ENGINE}-${w}.png`), fullPage: true }); await ctx.close(); }

  /* 13 (part): /lounge 404 is the default above. With member photos from today's tll-lounge-members-v1 the deck takes them in, first, under All only. */
  { const { ctx, page } = await open({ w, q: '?preview=lounge', members: true });
    let s = await state(page); eq([s.count, s.credit, s.label], ['1 of 19', 'JC · LISBON, PORTUGAL', 'The tram that never came, Lisbon, Portugal'], T + '13 member photos join the deck first, with their own words');
    await page.locator('.tll-deck [data-deck="next"]').click(); await page.waitForTimeout(420); s = await state(page); eq([s.credit, s.text], ['KYOTO, JAPAN', 'KYOTO, JAPAN'], T + '13 an anonymous member photo shows the place alone');
    await page.locator('[data-tll-lounge-chips] button[data-val="Europe"]').click(); await page.waitForTimeout(250); eq(await count(page), '1 of 5', T + 'L11 member photos are under All only');
    await ctx.close(); }
}

/* 10. phone, real touch (Chromium only): up and down scrolls the page, sideways throws the card. */
if (ENGINE === 'chromium') {
  const { ctx, page } = await open({ w: 390, q: '?preview=lounge' }); const cdp = await ctx.newCDPSession(page);
  await page.locator(TOP).scrollIntoViewIfNeeded(); const y0 = await page.evaluate(() => scrollY); const b = await page.locator(TOP).boundingBox(); const x = Math.round(b.x + b.width / 2), y = Math.round(b.y + b.height / 2);
  await cdp.send('Input.synthesizeScrollGesture', { x, y, yDistance: -260, xDistance: 0, speed: 600, gestureSourceType: 'touch' }); await page.waitForTimeout(500);
  eq([await page.evaluate((v) => scrollY - v > 150, y0), await count(page)], [true, '1 of 17'], '[chromium 390 touch] 10 an up and down swipe on the card scrolls the page and leaves the card');
  await page.evaluate((v) => scrollTo(0, v), y0); await page.waitForTimeout(200); const b2 = await page.locator(TOP).boundingBox(); const x2 = Math.round(b2.x + b2.width / 2), yy = Math.round(b2.y + b2.height / 2);
  const touch = (type, px) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x: px, y: yy, id: 1 }] });
  await touch('touchStart', x2); for (let i = 1; i <= 10; i++) { await touch('touchMove', x2 - 17 * i); await page.waitForTimeout(30); } await page.waitForTimeout(200); await touch('touchEnd'); await page.waitForTimeout(600);
  eq([await count(page), await page.evaluate((v) => Math.abs(scrollY - v) < 3, y0)], ['2 of 17', true], '[chromium 390 touch] 10 a sideways swipe throws the card and does not scroll the page');
  await touch('touchStart', x2); for (let i = 1; i <= 10; i++) { await touch('touchMove', x2 + 9 * i); await page.waitForTimeout(30); } await page.waitForTimeout(200); await touch('touchEnd'); await page.waitForTimeout(600);
  eq(await count(page), '2 of 17', '[chromium 390 touch] 3 a 90 px swipe springs back');
  await ctx.close();
}
await browser.close();
console.log(`${ENGINE}: ${pass} passed, ${fail} failed`); if (fail) { console.log(fails.join('\n')); process.exit(1); }
