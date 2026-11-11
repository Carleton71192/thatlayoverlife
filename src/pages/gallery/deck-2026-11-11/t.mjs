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
  const ctx = await browser.newContext({ viewport: { width: w, height: o.h || (mobile ? 844 : 900) }, hasTouch: mobile && ENGINE === 'chromium', reducedMotion: o.still ? 'reduce' : 'no-preference', deviceScaleFactor: 1 });
  const reqs = [], errs = []; let releaseMembers; const gate = new Promise((res) => { releaseMembers = res; });
  await ctx.addInitScript(() => { window.__deckAt = null; window.__dcl = null;
    document.addEventListener('DOMContentLoaded', () => { window.__dcl = performance.now(); const s = document.createElement('style'); s.textContent = '#cc-main{display:none!important}'; document.head.appendChild(s); });
    new MutationObserver(() => { if (window.__deckAt === null && document.querySelector('.tll-deck .tll-deck-card')) window.__deckAt = performance.now(); }).observe(document, { childList: true, subtree: true }); });
  await ctx.route('**/*', async (r) => { const u = r.request().url(); reqs.push(u);
    if (u.split('?')[0].replace(/\/$/, '') === PAGE) return r.fulfill({ body: html(o), contentType: 'text/html; charset=utf-8' });
    if (u.startsWith('https://layers.test/')) { const m = /^https:\/\/layers\.test\/(old|new)\/(.*)$/.exec(u); let body;
      try { body = m[1] === 'old' ? oldFile(m[2]) : fs.readFileSync(path.join(ROOT, m[2])); } catch (e) { return r.fulfill({ status: 404, body: 'not found', headers: { 'Access-Control-Allow-Origin': '*' } }); }
      if (o.chunkDelay && /misc-preview\.js$/.test(u)) await new Promise((res) => setTimeout(res, o.chunkDelay));
      return r.fulfill({ body, contentType: 'application/javascript; charset=utf-8', headers: { 'Access-Control-Allow-Origin': '*' } }); }
    if (/workers\.dev\/lounge/.test(u) && o.membersGate) await gate; /* the test decides when the member photos arrive */
    if (/workers\.dev\/lounge/.test(u)) return o.members ? r.fulfill({ body: JSON.stringify(MEMBERS), contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' } })
      : r.fulfill({ status: 404, body: '{"error":"not found"}', contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' } });
    if (BLOCK.test(u)) return r.abort();
    return r.continue(); });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  await page.goto(PAGE + (o.q || ''), { waitUntil: o.until || 'load' }); await page.waitForTimeout(o.wait || (o.members ? 1500 : 900));
  return { ctx, page, reqs, errs, releaseMembers };
}
const TOP = '.tll-deck-stage .tll-deck-card:not([aria-hidden="true"])';
const count = (page) => page.locator('.tll-deck-count').innerText();
const state = (page) => page.evaluate(() => { const c = document.querySelector('.tll-deck-stage .tll-deck-card:not([aria-hidden="true"])'); const cr = c && c.querySelector('.tll-deck-credit');
  return { count: document.querySelector('.tll-deck-count').textContent, label: c && c.getAttribute('aria-label'), credit: cr && cr.textContent, text: c && c.innerText.trim(), live: document.querySelector('.tll-deck-sr').textContent, cards: document.querySelectorAll('.tll-deck-stage .tll-deck-card').length }; });
async function dragBy(page, dx, o = {}) { await page.evaluate(() => document.querySelector('.tll-deck').scrollIntoView({ block: 'start' })); await page.waitForTimeout(80); const b = await page.locator(TOP).boundingBox(); const x = b.x + b.width / 2, y = b.y + b.height / 2; const n = o.fast ? 3 : 10;
  await page.mouse.move(x, y); await page.mouse.down(); if (o.hold) await page.waitForTimeout(o.hold);
  for (let i = 1; i <= n; i++) { await page.mouse.move(x + dx * i / n, y + (o.dy || 0) * i / n); await page.waitForTimeout(o.fast ? 8 : 35); }
  if (o.mid) await o.mid(); if (!o.fast) await page.waitForTimeout(220); await page.mouse.up(); await page.waitForTimeout(600); }
const shot = async (page, name) => { if (!/^(before|drag)/.test(name)) await page.evaluate(() => { const c = document.querySelector('[data-tll-lounge-chips]'); scrollTo(0, c.getBoundingClientRect().top + scrollY - (innerWidth < 768 ? 150 : 110)); }); await page.waitForTimeout(120); await page.screenshot({ path: path.join(DIR, `${name}.png`) }); };
const mainHtml = (page) => page.evaluate(() => document.querySelector('main').innerHTML);

const pageReqs = [];
for (const w of [390, 1440]) {
  const T = `[${ENGINE} ${w}] `;
  /* 1. Without the flag: today's Lounge, and the new code is not downloaded. Compared with the committed build on the same saved page. */
  /* The comparison page stays open until its own fonts are in (the page's JetBrains Mono file can arrive late), so a late font of the page's own is not counted against the deck. */
  { const a = await open({ w, old: true }), b = await open({ w, wait: 3500 }); await b.page.evaluate(() => document.fonts.ready); await b.page.waitForTimeout(500);
    const ha = await mainHtml(a.page), hb = await mainHtml(b.page);
    ok(ha === hb, T + '1 no flag: main is identical with the committed build and with this build'); 
    ok(b.reqs.some((u) => /\/new\/src\/site-layers\/chunks\/misc\.js$/.test(u)), T + '1 no flag: public misc chunk loaded');
    ok(!b.reqs.some((u) => /misc-preview/.test(u)), T + '1 no flag: preview chunk not downloaded');
    eq(await b.page.evaluate(() => [!!document.querySelector('.tll-deck'), !!document.getElementById('tll-lounge-deck-v1'), typeof window.__tllLoungeDeck, document.querySelectorAll('[data-tll-loc]').length]), [false, false, 'undefined', 17], T + '1 no flag: no deck, 17 tiles');
    await b.page.evaluate(() => { const c = document.querySelector('[data-tll-lounge-chips]'); scrollTo(0, c.getBoundingClientRect().top + scrollY - (innerWidth < 768 ? 150 : 110)); });
    await shot(b.page, `before-${ENGINE}-${w}`);
    /* What the page asks for by itself: both no-flag runs together, at every width so far (a font can come from the browser's memory cache in a later run and so not be asked for again). */
    pageReqs.push(...a.reqs, ...b.reqs); var baseReqs = pageReqs.slice(), baseErrs = b.errs.slice(); await a.ctx.close(); await b.ctx.close(); }

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
    eq(await page.evaluate(() => { const a = document.querySelector('.tll-deck-card.is-end a'); return [a.getAttribute('href'), document.activeElement.classList.contains('is-end'), document.activeElement.getAttribute('aria-label')]; }), ['/share-photos', true, 'That is all 17.'], T + '4 end card links to /share-photos; focus on the end card itself');
    await page.keyboard.press('Enter'); await page.waitForTimeout(300); s = await state(page); eq(s.text.replace(/\s+/g, ' '), 'That is all 17. Start again Add yours', T + 'R2 one Enter too many on Next does nothing (it used to press Start again)');
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

/* Regression checks for the review of 11 November 2026 (handoff/CHANGE-LOG-LOUNGE-POSTCARDS-2026-11-11.md, "Review"). */
{ const T = `[${ENGINE} review] `;
  { const { ctx, page } = await open({ w: 1440, q: '?preview=lounge' });
    for (let i = 0; i < 2; i++) { await page.locator('.tll-deck [data-deck="next"]').click(); await page.waitForTimeout(420); }
    await page.locator('.tll-deck [data-deck="prev"]').focus(); for (let i = 0; i < 3; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(420); }
    eq([await count(page), await page.evaluate((sel) => document.activeElement === document.querySelector(sel), TOP)], ['1 of 17', true], T + 'R2 one Enter too many on Previous stays on card 1, focus on the card');
    /* R6: a flick after resting on the card */
    await dragBy(page, 70, { fast: true, hold: 300 }); eq(await count(page), '2 of 17', T + 'R6 a flick after a 300 ms rest still throws');
    await dragBy(page, 100, { hold: 300 }); eq(await count(page), '2 of 17', T + 'R6 a slow 100 px drag after a rest still springs back');
    /* R4: a mouse press with no release (a context menu took it), then the mouse moves with no button down */
    await page.evaluate(() => document.querySelector('.tll-deck').scrollIntoView({ block: 'start' })); const b = await page.locator(TOP).boundingBox(); const x = b.x + b.width / 2, y = b.y + b.height / 2;
    await page.evaluate(([x, y]) => document.querySelector('.tll-deck-stage .tll-deck-card:not([aria-hidden="true"]) .tll-deck-face').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 1, clientX: x, clientY: y })), [x, y]);
    await page.mouse.move(x + 10, y); await page.mouse.move(x + 120, y, { steps: 6 }); await page.waitForTimeout(500);
    eq(await page.evaluate((sel) => { const c = document.querySelector(sel); return [getComputedStyle(c).transform, c.classList.contains('is-drag')]; }, TOP), ['matrix(1, 0, 0, 1, 0, 0)', false], T + 'R4 a press that never got its release does not glue the card to the cursor');
    await page.locator('.tll-deck [data-deck="next"]').click(); await page.waitForTimeout(450); eq(await count(page), '3 of 17', T + 'R4 the next click is not eaten');
    await page.keyboard.down('Control'); await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 180, y, { steps: 8 }); await page.mouse.up(); await page.keyboard.up('Control'); await page.waitForTimeout(500); eq(await count(page), '3 of 17', T + 'R4 a ctrl-click starts no drag');
    await ctx.close(); }
  /* R7: See all as a grid with the top of the deck scrolled out of view */
  for (const [w, h] of [[390, 664], [1366, 650]]) { const { ctx, page } = await open({ w, h, q: '?preview=lounge' });
    await page.evaluate(() => { const l = document.querySelector('.tll-deck [data-deck="grid"]').getBoundingClientRect(); scrollBy(0, l.bottom - innerHeight + 120); }); await page.waitForTimeout(150);
    await page.locator('.tll-deck [data-deck="grid"]').click(); await page.waitForTimeout(300);
    const vis = (sel) => page.evaluate((sel) => { const r = document.querySelector(sel).getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return [r.top >= 77 && r.bottom <= innerHeight, !!e && !!e.closest(sel), document.activeElement === document.querySelector(sel)]; }, sel);
    eq(await vis('.tll-deck-backbar [data-deck="deck"]'), [true, true, true], T + `R7 ${w}x${h} Back to the deck is on screen and has focus after See all as a grid`);
    await page.evaluate(() => scrollBy(0, 500)); await page.locator('.tll-deck-backbar [data-deck="deck"]').focus({ preventScroll: true }); await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    eq(await vis('.tll-deck [data-deck="grid"]'), [true, true, true], T + `R7 ${w}x${h} See all as a grid is on screen and has focus after Back to the deck`); await ctx.close(); }
  /* R5: short screens */
  for (const [w, h, cw, ch] of [[844, 390, 220, 275], [1366, 650, 368, 460], [320, 568, 272, 340]]) { const { ctx, page } = await open({ w, h, q: '?preview=lounge' });
    eq(await page.evaluate((sel) => { const c = document.querySelector(sel).getBoundingClientRect(); return [Math.round(c.width), Math.round(c.height), c.height < innerHeight, document.documentElement.scrollWidth <= innerWidth]; }, TOP), [cw, ch, true, true], T + `R5 ${w}x${h}: the whole card fits the screen`); await ctx.close(); }
  /* R8: a chip pressed before the deck layer arrived */
  { const { ctx, page } = await open({ w: 390, q: '?preview=lounge', chunkDelay: 3000, until: 'domcontentloaded', wait: 1200 });
    eq(!!(await page.$('.tll-deck')), false, T + 'R8 (set-up) the deck has not arrived yet'); await page.locator('[data-tll-lounge-chips] button[data-val="Asia"]').click(); await page.waitForSelector('.tll-deck .tll-deck-card', { timeout: 15000 }); await page.waitForTimeout(300);
    const s = await state(page); eq([s.count, s.credit], ['1 of 3', 'NC · VIETNAM'], T + 'R8 the deck starts on the chip already pressed'); await ctx.close(); }
  /* R3: member photos that arrive late */
  { const { ctx, page, releaseMembers } = await open({ w: 1440, q: '?preview=lounge', members: true, membersGate: true, wait: 900 });
    await page.locator('.tll-deck [data-deck="next"]').click(); await page.waitForTimeout(420); await page.locator(TOP).focus(); eq(await count(page), '2 of 17', T + 'R3 (set-up) no member photos yet'); releaseMembers(); await page.waitForTimeout(900);
    let s = await state(page); eq([s.count, s.credit, await page.evaluate((sel) => document.activeElement === document.querySelector(sel), TOP)], ['4 of 19', 'NC · VIETNAM', true], T + 'R3 late member photos: same card, new count, focus kept'); await ctx.close(); }
  { const { ctx, page, releaseMembers } = await open({ w: 1440, q: '?preview=lounge', members: true, membersGate: true, wait: 900 });
    await page.locator('[data-tll-lounge-chips] button[data-val="Africa"]').click(); await page.locator('.tll-deck [data-deck="next"]').click(); await page.waitForTimeout(420); await page.locator('.tll-deck [data-deck="restart"]').focus(); releaseMembers(); await page.waitForTimeout(900);
    let s = await state(page); eq([s.text.replace(/\s+/g, ' '), await page.evaluate(() => document.activeElement.textContent)], ['That is all 1. Start again Add yours', 'Start again'], T + 'R3 late member photos leave a filtered deck, its end card and focus alone');
    await page.locator('[data-tll-lounge-chips] button[data-val="all"]').click(); await page.waitForTimeout(300); s = await state(page); eq([s.count, s.credit], ['1 of 19', 'JC · LISBON, PORTUGAL'], T + 'R3 they are in the deck when All is pressed again'); await ctx.close(); }
  { const { ctx, page, releaseMembers } = await open({ w: 1440, q: '?preview=lounge', members: true, membersGate: true, wait: 900 });
    for (let i = 0; i < 2; i++) { await page.locator('.tll-deck [data-deck="next"]').click(); await page.waitForTimeout(420); }
    await page.evaluate(() => document.querySelector('.tll-deck').scrollIntoView({ block: 'start' })); const b = await page.locator(TOP).boundingBox(); const x = b.x + b.width / 2, y = b.y + b.height / 2;
    await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 170, y, { steps: 8 }); await page.waitForTimeout(200); releaseMembers(); await page.waitForTimeout(900);
    const held = await page.evaluate((sel) => [document.querySelector(sel).classList.contains('is-drag'), document.querySelector('.tll-deck-count').textContent], TOP);
    await page.mouse.up(); await page.waitForTimeout(700); const s = await state(page);
    eq([held, s.count, s.credit], [[true, '3 of 17'], '6 of 19', 'NC · GHANA'], T + 'R3 late member photos wait for a swipe in progress; the release still throws the card'); await ctx.close(); }
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
  /* R1: a second finger. Finger 1 drags 160 px, finger 2 touches the card, both lift: the card goes back, nothing is thrown or stuck. */
  const pts = (a) => cdp.send('Input.dispatchTouchEvent', { type: a.type, touchPoints: a.p.map(([px, py, id]) => ({ x: px, y: py, id })) });
  await pts({ type: 'touchStart', p: [[x2, yy, 1]] }); for (let i = 1; i <= 8; i++) { await pts({ type: 'touchMove', p: [[x2 + 20 * i, yy, 1]] }); await page.waitForTimeout(30); }
  await pts({ type: 'touchStart', p: [[x2 + 160, yy, 1], [x2 + 100, yy + 60, 2]] }); await page.waitForTimeout(120); await pts({ type: 'touchMove', p: [[x2 + 160, yy, 1], [x2 + 100, yy + 110, 2]] }); await page.waitForTimeout(120); await pts({ type: 'touchEnd', p: [] }); await page.waitForTimeout(700);
  eq(await page.evaluate((sel) => { const c = document.querySelector(sel); return [document.querySelector('.tll-deck-count').textContent, getComputedStyle(c).transform, c.classList.contains('is-drag')]; }, TOP), ['2 of 17', 'matrix(1, 0, 0, 1, 0, 0)', false], '[chromium 390 touch] R1 a second finger cancels the swipe: card back in place, nothing thrown');
  await touch('touchStart', x2); for (let i = 1; i <= 10; i++) { await touch('touchMove', x2 - 17 * i); await page.waitForTimeout(30); } await page.waitForTimeout(200); await touch('touchEnd'); await page.waitForTimeout(600);
  eq(await count(page), '3 of 17', '[chromium 390 touch] R1 a one-finger swipe works again afterwards');
  eq(await page.evaluate((sel) => getComputedStyle(document.querySelector(sel)).touchAction, TOP), 'pan-y pinch-zoom', '[chromium 390 touch] R1 two fingers may zoom the page');
  await ctx.close();
}
await browser.close();
console.log(`${ENGINE}: ${pass} passed, ${fail} failed`); if (fail) { console.log(fails.join('\n')); process.exit(1); }
