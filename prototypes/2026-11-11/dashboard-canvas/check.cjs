/* Browser check for the dashboard canvas prototype. Run from anywhere:
     NODE_PATH=/opt/node22/lib/node_modules PATH=/opt/node22/bin:$PATH node check.cjs
   Rebuild first (node build.cjs). Drives every state and trigger by script in Chromium at 1440 and 390, counts
   requestAnimationFrame callbacks while the stage is off screen and while the tab is hidden (both must be zero),
   checks reduced motion with emulateMedia, the error and timeout states, the tooltip, the paw stamp, the three
   non-stand-in adapters, and saves shot-390.png and shot-1440.png at device scale 2.
   The lottie-web adapter is tested against the real lottie_light.min.js 5.12.2: set LOTTIE_FILE to a local copy
   (from `npm pack lottie-web@5.12.2`); the cdnjs URL is answered from that file, so nothing is fetched from cdnjs. */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DIR = __dirname;
const URL_ = 'file://' + path.join(DIR, 'index.html');
const LOTTIE_FILE = process.env.LOTTIE_FILE || '';
let failures = 0;
function ok(cond, msg) { console.log((cond ? 'ok   ' : 'FAIL ') + msg); if (!cond) failures++; }
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* counts every rAF callback on the page, whoever scheduled it */
const RAF_COUNTER = () => {
  const orig = window.requestAnimationFrame.bind(window);
  window.__raf = 0;
  window.requestAnimationFrame = (cb) => orig((t) => { window.__raf++; cb(t); });
};

/* tiny Lottie fixture for the adapter test only: one dot moving across 150 frames, with the brief's markers */
const FIXTURE = {
  v: '5.7.4', fr: 30, ip: 0, op: 150, w: 960, h: 470, nm: 'test fixture', ddd: 0, assets: [],
  markers: [{ tm: 0, cm: 'The Blank Map', dr: 45 }, { tm: 46, cm: 'The Stamp Drop', dr: 44 }, { tm: 91, cm: 'The Connected Route', dr: 59 }],
  layers: [{ ddd: 0, ind: 1, ty: 4, nm: 'dot', ln: 'paw-passport-stamp', sr: 1, ao: 0, ip: 0, op: 150, st: 0, bm: 0,
    ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] },
      p: { a: 1, k: [{ t: 0, s: [100, 235, 0], i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] } }, { t: 150, s: [860, 235, 0] }] } },
    shapes: [{ ty: 'gr', nm: 'g', it: [
      { ty: 'el', nm: 'e', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [24, 24] } },
      { ty: 'fl', nm: 'f', c: { a: 0, k: [0, 0.79, 0.78, 1] }, o: { a: 0, k: 100 }, r: 1 },
      { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }] }] }]
};

async function setup(browser, vp, opts = {}) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, reducedMotion: opts.reduced ? 'reduce' : 'no-preference', hasTouch: !!opts.touch, isMobile: !!opts.touch });
  const page = await ctx.newPage();
  const errors = [], hosts = new Set();
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  page.on('request', r => { const u = new URL(r.url()); hosts.add(u.protocol === 'file:' ? 'file' : u.host); });
  await page.addInitScript(RAF_COUNTER);
  if (LOTTIE_FILE && fs.existsSync(LOTTIE_FILE)) {
    await page.route('https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie_light.min.js',
      r => r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(LOTTIE_FILE), headers: { 'access-control-allow-origin': '*' } }));
  }
  await page.goto(URL_, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  return { ctx, page, errors, hosts };
}
const st = (page) => page.evaluate(() => window.TLLDash.dash.snapshot());
async function waitFor(page, fn, arg, ms = 6000) { await page.waitForFunction(fn, arg, { timeout: ms, polling: 50 }); }
const waitState = (page, s, ms) => waitFor(page, (s) => window.TLLDash.dash.state === s, s, ms);
const waitRest = async (page, frame, ms) => {
  try { await waitFor(page, (f) => { const d = window.TLLDash.dash; return d.state === 'ready' && d.restFrame === f && !d.run && !d.queue; }, frame, ms); }
  catch (e) { console.log('     waiting for rest at ' + frame + ', snapshot: ' + JSON.stringify(await st(page))); throw e; }
};
async function stageTo(page, top) { await page.evaluate((top) => { const r = document.querySelector('[data-dc-stage]').getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top - top); }, top); await sleep(250); }
const liveText = async (page) => { await sleep(120); return page.evaluate(() => document.querySelector('[data-dc-live]').textContent); };
async function rafDuring(page, ms) { const a = await page.evaluate(() => window.__raf); await sleep(ms); const b = await page.evaluate(() => window.__raf); return b - a; }

(async () => {
  const browser = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });

  /* the page source: no fetch at all, and the "All prototypes" link goes back to the index */
  const SRC = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  ok(!SRC.includes('fetch('), 'index.html contains no fetch(');
  ok(/<a class="corner" href="\.\.\/index\.html">All prototypes<\/a>/.test(SRC), 'the "All prototypes" link is href="../index.html"');

  /* ================= 1440 ================= */
  const D = await setup(browser, { width: 1440, height: 900 });
  const p = D.page;
  ok(await p.evaluate(() => document.querySelector('[data-insp]').classList.contains('is-closed')), 'the state inspector starts closed, so it covers nothing');
  await p.click('[data-i-toggle]'); /* open it for the error and timeout controls */
  await p.evaluate(() => { window.__segs = []; window.TLLDash.dash.on('segmentstart', d => window.__segs.push(d.key + ':' + d.label)); });
  let s = await st(p);
  ok(s.state === 'idle' || s.state === 'loading' || s.state === 'paused:offscreen', 'at the top of the page the stage is idle, loading or loaded off screen: ' + s.state);
  ok(!s.aPlayed, 'A has not played before the stage is seen');
  ok(!D.hosts.has('cdnjs.cloudflare.com'), 'stand-in config: nothing requested from cdnjs');

  /* A: scroll into view */
  await stageTo(p, 60);
  await waitFor(p, () => window.TLLDash.dash.state === 'playing:A' || window.TLLDash.dash.restFrame === 45, null, 5000);
  ok(true, 'A starts when the stage scrolls into view');
  await waitRest(p, 45);
  ok(/The map is open\. No places on your map yet\./.test(await liveText(p)), 'A announces: ' + await liveText(p));
  ok((await p.evaluate(() => getComputedStyle(document.querySelector('.tll-dc__skeleton')).display)) === 'none', 'skeleton hidden once ready');

  /* B: tick a trip */
  await p.check('[data-trip][value="CPH"]');
  await waitState(p, 'playing:B');
  ok(true, 'ticking a trip plays B');
  await waitRest(p, 90);
  ok((await p.textContent('[data-dc-count]')) === '1 place stamped', 'count line: ' + await p.textContent('[data-dc-count]'));
  ok((await liveText(p)) === 'Stamp added. One place on your map.', 'B announces: ' + await liveText(p));

  /* rapid ticks coalesce */
  await p.evaluate(() => { window.__segs = []; });
  /* three real clicks inside one B (1.5 s). Separate p.check() calls can each scroll and wait, and when they spread past
     1.5 s, B, B, B is the correct result, which made this check flaky. */
  await p.evaluate(() => ['SOF', 'IST', 'DOH'].forEach(c => document.querySelector('[data-trip][value="' + c + '"]').click()));
  await sleep(150);
  ok((await liveText(p)) === 'Stamp added. Four places on your map.', 'announcement keeps up with every tick: ' + await liveText(p));
  await waitRest(p, 90, 8000);
  let segs = await p.evaluate(() => window.__segs);
  ok(segs.length === 2 && segs.every(x => x === 'B:B'), 'three quick ticks play B, then B once more (queued, coalesced): ' + segs.join(', '));

  /* C: real hover on the CTA; a second hover during C is dropped */
  await p.evaluate(() => { const r = document.querySelector('[data-dc-cta]').getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top - 80); });
  await sleep(200);
  await p.evaluate(() => { window.__segs = []; window.__q = []; window.TLLDash.dash.on('queue', d => window.__q.push(d.key + ' ' + d.action)); });
  await p.hover('[data-dc-cta]');
  await waitState(p, 'playing:C');
  await p.mouse.move(5, 5); await p.hover('[data-dc-cta]');
  await waitRest(p, 150, 8000);
  segs = await p.evaluate(() => window.__segs);
  const q = await p.evaluate(() => window.__q);
  ok(segs.join() === 'C:C', 'hover plays C once; re-hover during C is dropped: ' + segs.join() + ' / ' + q.join('; '));
  ok((await liveText(p)) === 'Route drawn through your four places.', 'C announces: ' + await liveText(p));

  /* C by keyboard focus */
  await p.mouse.move(5, 5);
  await p.evaluate(() => { window.__segs = []; document.querySelector('[data-dc-cta]').blur(); });
  await p.focus('[data-dc-cta]');
  await waitState(p, 'playing:C');
  ok(true, 'keyboard focus on the CTA plays C');
  await waitRest(p, 150, 8000);

  /* tick then untick during C: the queued Stamp Drop has nothing to drop, so it is dropped (pendingDrops) */
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  await stageTo(p, 60);
  await p.evaluate(() => { window.__segs = []; window.__q = []; window.TLLDash.dash.trigger('cta:enter'); }); /* the queue listener from the hover check fills __q */
  await waitState(p, 'playing:C');
  await p.evaluate(() => { const b = document.querySelector('[data-trip][value="GRU"]'); b.click(); b.click(); });
  const tu = await p.evaluate(() => ({ queue: window.TLLDash.dash.queue, pending: window.TLLDash.dash.pendingDrops.length, checked: document.querySelector('[data-trip][value="GRU"]').checked }));
  ok(tu.queue === null && tu.pending === 0 && !tu.checked, 'tick then untick during C: the queued B leaves the slot at once ' + JSON.stringify(tu));
  await waitRest(p, 150, 8000);
  await sleep(300);
  segs = await p.evaluate(() => window.__segs);
  const tq = await p.evaluate(() => window.__q);
  s = await st(p);
  ok(segs.join() === 'C:C' && tq.includes('B dropped') && s.restFrame === 150 && s.state === 'ready', 'tick then untick during C: no empty Stamp Drop replays, the map rests on 150: ' + segs.join() + ' / ' + tq.join('; ') + ' / rest ' + s.restFrame);
  ok((await p.textContent('[data-dc-count]')) === '4 places stamped', 'tick then untick: count back to ' + await p.textContent('[data-dc-count]'));

  /* signup replaces a playing segment */
  await stageTo(p, 60);
  await p.evaluate(() => { window.__segs = []; window.__states = []; window.TLLDash.dash.on('statechange', d => window.__states.push(d.to)); });
  await p.check('[data-trip][value="GRU"]');
  await waitState(p, 'playing:B');
  await sleep(200);
  await p.click('[data-demo-signup]');
  await stageTo(p, 60); /* the click scrolls the button into view, which can take the stage off screen (it pauses); bring it back */
  await waitRest(p, 150, 9000);
  segs = await p.evaluate(() => window.__segs);
  ok(segs.join() === 'B:B,UNFOLD:A,UNFOLD:C', 'signup:success interrupts B and plays Map Unfold as A then C: ' + segs.join());
  ok((await liveText(p)) === 'Your map is ready. Five places on your map.', 'Map Unfold announces: ' + await liveText(p));

  /* off screen: zero rAF callbacks, and resume restores the segment */
  await stageTo(p, 60);
  await p.evaluate(() => window.TLLDash.dash.trigger('cta:enter'));
  await waitState(p, 'playing:C');
  await sleep(250);
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await waitState(p, 'paused:offscreen');
  const f1 = (await st(p)).frame;
  const offRaf = await rafDuring(p, 1500);
  const f2 = (await st(p)).frame;
  ok(offRaf === 0, 'off screen during C: rAF callbacks in 1.5 s = ' + offRaf);
  ok(f1 === f2 && f1 > 91 && f1 < 150, 'off screen: frame frozen mid-C at ' + f1);
  ok((await p.textContent('[data-i="raf"]')) === '0', 'inspector shows 0 rAF callbacks off screen');
  await stageTo(p, 60);
  await waitState(p, 'playing:C');
  ok(true, 'back on screen: state restored to playing:C');
  await waitRest(p, 150, 6000);
  ok(true, 'C completes after resuming');

  /* page visibility */
  await p.evaluate(() => window.TLLDash.dash.trigger('cta:enter'));
  await waitState(p, 'playing:C');
  await sleep(200);
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
  await waitState(p, 'paused:offscreen');
  const hidRaf = await rafDuring(p, 1000);
  ok(hidRaf === 0, 'hidden tab: rAF callbacks in 1 s = ' + hidRaf);
  await p.evaluate(() => { delete document.hidden; delete document.visibilityState; document.dispatchEvent(new Event('visibilitychange')); });
  await waitState(p, 'playing:C');
  ok(true, 'tab visible again: playing:C resumes');
  await waitRest(p, 150, 6000);

  /* pointer tooltip near a hub */
  await stageTo(p, 60);
  const hubPos = await p.evaluate(() => { const r = document.querySelector('[data-dc-stage]').getBoundingClientRect(); const h = window.TLLDash.dash.hubs.find(x => x.code === 'CPH'); return { x: r.left + h.x * r.width + 6, y: r.top + h.y * r.height - 4 }; });
  await p.mouse.move(hubPos.x, hubPos.y);
  await sleep(80);
  const tip = await p.evaluate(() => { const t = document.querySelector('[data-dc-tip]'); const cs = getComputedStyle(t); return { hidden: t.hidden, text: t.textContent, font: cs.fontFamily, color: cs.color, bg: cs.backgroundColor, size: cs.fontSize, pad: cs.padding }; });
  ok(!tip.hidden && /CPH/.test(tip.text) && /55\.62° N · 12\.66° E/.test(tip.text), 'pointer near CPH shows the tooltip: ' + tip.text);
  ok(/JetBrains Mono/.test(tip.font) && tip.color === 'rgb(26, 26, 26)' && tip.bg === 'rgb(253, 249, 243)' && parseFloat(tip.size) >= 12, 'tooltip: JetBrains Mono, Ink on Paper, ' + tip.size + ', padding ' + tip.pad);
  await p.mouse.move(hubPos.x, hubPos.y + 200);
  ok(await p.evaluate(() => document.querySelector('[data-dc-tip]').hidden), 'tooltip hides away from hubs');
  /* keyboard: hub buttons */
  await p.focus('.tll-dc__hub[data-hub="SOF"]');
  const ktip = await p.evaluate(() => document.querySelector('[data-dc-tip]').textContent);
  ok(/SOF/.test(ktip) && /42\.70° N · 23\.41° E/.test(ktip), 'focusing the SOF hub button shows the same tooltip: ' + ktip);
  const name = await p.evaluate(() => document.querySelector('.tll-dc__hub[data-hub="SOF"]').textContent);
  ok(/Sofia, 42\.70 degrees north, 23\.41 degrees east/.test(name), 'hub button name for screen readers: ' + name);
  await p.keyboard.press('Escape');
  ok(await p.evaluate(() => document.querySelector('[data-dc-tip]').hidden), 'Escape hides the tooltip');
  const fo = await p.evaluate(() => { const b = document.querySelector('.tll-dc__hub[data-hub="SOF"]'); b.blur(); b.focus(); const cs = getComputedStyle(b); return cs.outlineStyle + ' ' + cs.outlineWidth + ' / ' + cs.boxShadow; });
  ok(/solid 3px/.test(fo), 'hub button focus is visible: ' + fo);

  /* paw stamp */
  await p.hover('[data-dc-pet]');
  await sleep(320);
  let paw = await p.evaluate(() => { const e = document.querySelector('[data-dc-paw]'); const cs = getComputedStyle(e); return { on: e.classList.contains('is-paw-on'), t: cs.transform, f: cs.filter }; });
  ok(paw.on && paw.t !== 'none' && /saturate\(1\)/.test(paw.f), 'pointer on the pet guide: paw stamp rotates and changes color (' + paw.t + ', ' + paw.f + ')');
  await p.mouse.move(5, 5); await sleep(320);
  paw = await p.evaluate(() => document.querySelector('[data-dc-paw]').classList.contains('is-paw-on'));
  ok(!paw, 'pointer leaves: paw stamp returns');
  await p.focus('[data-pet-demo]');
  ok(await p.evaluate(() => document.querySelector('[data-dc-paw]').classList.contains('is-paw-on')), 'keyboard focus in the pet guide also turns the paw stamp');
  await p.evaluate(() => document.activeElement.blur());

  /* error and timeout */
  await stageTo(p, 60);
  await p.selectOption('[data-i-next]', 'error');
  await p.click('[data-i-reload]');
  await waitState(p, 'error', 4000);
  let e = await p.evaluate(() => ({ stat: getComputedStyle(document.querySelector('.tll-dc__static')).display, note: document.querySelector('[data-dc-note]').hidden, canvas: !!document.querySelector('.tll-dc__canvas') }));
  ok(e.stat === 'block' && !e.note && !e.canvas, 'error: still map shown, note shown, no canvas');
  ok(/did not load/.test(await liveText(p)), 'error announced: ' + await liveText(p));
  await p.uncheck('[data-trip][value="GRU"]');
  ok((await p.textContent('[data-dc-count]')) === '4 places stamped', 'in the error state the count still updates');
  await p.evaluate(() => { window.TLLDash.FABLE_CONFIG.loadTimeoutMs = 1200; });
  await p.selectOption('[data-i-next]', 'timeout');
  await p.click('[data-i-reload]');
  await waitState(p, 'loading', 2000);
  const shim = await p.evaluate(() => getComputedStyle(document.querySelector('.tll-dc__skeleton'), '::after').animationName);
  ok(shim === 'tll-dc-shimmer', 'loading on screen: skeleton shimmer runs (' + shim + ')');
  await waitState(p, 'error', 4000);
  ok(true, 'timeout: loading turns into error after loadTimeoutMs');
  await p.evaluate(() => { window.TLLDash.FABLE_CONFIG.loadTimeoutMs = 8000; });
  await p.selectOption('[data-i-next]', 'none');
  await p.click('[data-i-reload]');
  await p.evaluate(() => { window.__segs = []; });
  await stageTo(p, 60);
  await waitRest(p, 90, 9000);
  segs = await p.evaluate(() => window.__segs);
  ok(segs.join() === 'A:A,B:B', 'reload after error with places already stamped: A plays, then B drops them in (rest 90): ' + segs.join());

  /* reduced motion switched on mid-play */
  await p.evaluate(() => window.TLLDash.dash.trigger('cta:enter'));
  await waitState(p, 'playing:C');
  await p.emulateMedia({ reducedMotion: 'reduce' });
  await waitState(p, 'reduced-motion', 3000);
  s = await st(p);
  ok(s.restFrame === 150 && s.frame === 150, 'reduced motion switched on mid-C: jumps to frame 150');
  await p.emulateMedia({ reducedMotion: 'no-preference' });
  await waitState(p, 'ready', 3000);

  /* adapters other than the stand-in */
  const svgRes = await p.evaluate(async () => {
    const m = document.createElement('div'); m.style.cssText = 'position:fixed;left:0;top:0;width:96px;height:47px'; document.body.appendChild(m);
    const pl = window.TLLDash.adapters.createSvgPlayer(m, { fps: 30, totalFrames: 60,
      svg: '<svg viewBox="0 0 96 47"><g id="stamp"><rect x="40" y="15" width="16" height="16" fill="#00C9C8"/></g></svg>',
      timeline: [{ target: '#stamp', from: 0, to: 30, keyframes: [{ opacity: 0 }, { opacity: 1 }] }] });
    await pl.load();
    const g = m.querySelector('#stamp');
    const o0 = getComputedStyle(g).opacity;
    const pr = pl.playSegment(0, 30);
    await new Promise(r => setTimeout(r, 300)); pl.pause(); const mid = pl.currentFrame();
    await new Promise(r => setTimeout(r, 400)); const still = pl.currentFrame(); pl.resume();
    const how = await pr; const o1 = getComputedStyle(g).opacity; const end = pl.currentFrame();
    pl.goToFrame(15); const o15 = getComputedStyle(g).opacity;
    pl.destroy(); m.remove();
    return { o0, mid, still, how, o1, end, o15 };
  });
  const svgNone = await p.evaluate(async () => {
    const m = document.createElement('div'); document.body.appendChild(m);
    const pl = window.TLLDash.adapters.createSvgPlayer(m, { fps: 30, totalFrames: 60, assetUrl: 'https://example.invalid/x.svg' });
    let msg = ''; try { await pl.load(); } catch (e) { msg = e.message; }
    pl.destroy(); m.remove(); return msg;
  });
  ok(/No SVG export configured/.test(svgNone), 'SVG adapter with no inline markup throws and fetches nothing: ' + svgNone);
  ok(svgRes.o0 === '0' && svgRes.how === 'complete' && svgRes.o1 === '1' && svgRes.end === 30 && Math.abs(parseFloat(svgRes.o15) - 0.5) < 0.05 && svgRes.mid === svgRes.still,
    'SVG + Web Animations adapter: segment, pause, resume, seek work ' + JSON.stringify(svgRes));
  const cvRes = await p.evaluate(async () => {
    const m = document.createElement('div'); document.body.appendChild(m);
    const seen = [];
    const pl = window.TLLDash.adapters.createCanvasPlayer(m, { fps: 30, totalFrames: 150, create: () => ({ seek: (f) => seen.push(f) }) });
    await pl.load(); const how = await pl.playSegment(0, 15); const last = seen[seen.length - 1];
    pl.destroy(); m.remove(); return { how, last, n: seen.length };
  });
  ok(cvRes.how === 'complete' && cvRes.last === 15 && cvRes.n > 3, 'canvas/WebGL wrapper adapter drives seek(frame) to the segment end ' + JSON.stringify(cvRes));
  if (LOTTIE_FILE && fs.existsSync(LOTTIE_FILE)) {
    const lr = await p.evaluate(async (fx) => {
      const m = document.createElement('div'); m.style.cssText = 'position:fixed;left:0;top:0;width:192px;height:94px'; document.body.appendChild(m);
      const pl = window.TLLDash.adapters.createLottiePlayer(m, { animationData: fx, renderer: 'svg', lottieBuild: 'light' });
      await pl.load();
      const markers = pl.markers();
      const how = await pl.playSegment(0, 45); const end = pl.currentFrame();
      pl.playSegment(91, 150); await new Promise(r => setTimeout(r, 300)); pl.pause(); await new Promise(r => setTimeout(r, 120));
      const a = window.__raf; await new Promise(r => setTimeout(r, 800)); const pausedRaf = window.__raf - a;
      const layer = !!pl.layer('#paw-passport-stamp');
      pl.goToFrame(150); const at = pl.currentFrame();
      pl.destroy(); m.remove();
      return { version: window.lottie && window.lottie.version, markers, how, end, pausedRaf, layer, at };
    }, FIXTURE);
    ok(lr.version === '5.12.2' && lr.how === 'complete' && lr.end === 45 && lr.at === 150, 'lottie-web adapter with lottie_light 5.12.2: segment and seek work ' + JSON.stringify({ v: lr.version, how: lr.how, end: lr.end, at: lr.at }));
    ok(lr.markers.length === 3 && lr.markers[2].name === 'The Connected Route' && lr.markers[2].from === 91 && lr.markers[2].to === 150, 'Lottie markers read from the export: ' + JSON.stringify(lr.markers));
    ok(lr.pausedRaf === 0, 'lottie-web paused: rAF callbacks in 0.8 s = ' + lr.pausedRaf);
    ok(lr.layer, "named Lottie layer (ln) reachable for the paw 'layer' mode");
  } else console.log('skip lottie adapter test (set LOTTIE_FILE)');

  /* screenshot 1440: three SAMPLE trips and the route */
  await p.uncheck('[data-trip][value="DOH"]');
  await p.uncheck('[data-trip][value="CPH"]');
  await p.check('[data-trip][value="CPH"]');
  await stageTo(p, 60);
  await waitRest(p, 90, 6000);
  await p.evaluate(() => window.TLLDash.dash.trigger('cta:enter'));
  await waitRest(p, 150, 6000);
  await p.hover('[data-dc-pet]'); await sleep(300);
  await p.evaluate(() => window.scrollTo(0, 0));
  await sleep(200);
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= 1440), '1440: no sideways scroll');
  await p.screenshot({ path: path.join(DIR, 'shot-1440.png'), fullPage: true });
  ok(D.errors.length === 0, '1440: no console errors' + (D.errors.length ? ': ' + D.errors.join(' | ') : ''));
  ok([...D.hosts].every(h => ['file', 'fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'].includes(h)), 'hosts requested: ' + [...D.hosts].join(', '));
  await D.ctx.close();

  /* ================= reduced motion from the start (390) ================= */
  const R = await setup(browser, { width: 390, height: 844 }, { reduced: true });
  const r = R.page;
  await stageTo(r, 80);
  await waitFor(r, () => window.TLLDash.dash.state === 'reduced-motion' && window.TLLDash.dash.restFrame === 45, null, 5000);
  ok(true, 'reduced motion: state reduced-motion, A jumps straight to frame 45');
  const rafA = await rafDuring(r, 300);
  await r.check('[data-trip][value="CPH"]');
  s = await st(r);
  ok(s.restFrame === 90 && s.state === 'reduced-motion', 'reduced motion: a tick jumps to frame 90');
  await r.evaluate(() => window.TLLDash.dash.trigger('cta:enter'));
  ok((await st(r)).restFrame === 150, 'reduced motion: CTA jumps to frame 150');
  await r.evaluate(() => window.TLLDash.dash.trigger('signup:success'));
  const rl = await liveText(r);
  ok((await st(r)).restFrame === 150 && rl === 'Your map is ready. One place on your map.', 'reduced motion: signup jumps to the end of Map Unfold and says: ' + rl);
  ok(rafA === 0 && (await r.evaluate(() => window.TLLDash.RAF_STATS.callbacks)) === 0, 'reduced motion: the frame clock never ran (0 rAF callbacks)');
  ok((await r.evaluate(() => getComputedStyle(document.querySelector('.tll-dc__skeleton'), '::after').animationName)) === 'none', 'reduced motion: shimmer off');
  await r.hover('[data-dc-pet]'); await sleep(50);
  const rpaw = await r.evaluate(() => { const cs = getComputedStyle(document.querySelector('[data-dc-paw]')); return cs.transform + ' ' + cs.filter; });
  ok(/^none saturate\(1\)/.test(rpaw), 'reduced motion: paw stamp changes color without rotating (' + rpaw + ')');
  ok(R.errors.length === 0, 'reduced motion: no console errors' + (R.errors.length ? ': ' + R.errors.join(' | ') : ''));
  await R.ctx.close();

  /* ================= 390 ================= */
  const P = await setup(browser, { width: 390, height: 844 });
  const m = P.page;
  await stageTo(m, 80);
  await waitRest(m, 45, 6000);
  const lay = await m.evaluate(() => { const r = document.querySelector('[data-dc-stage]').getBoundingClientRect(); return { left: r.left, w: r.width, h: r.height, sw: document.documentElement.scrollWidth }; });
  ok(lay.left === 16 && lay.w === 358 && Math.abs(lay.h - 358 * 47 / 96) < 1.5, '390: stage sits on the 16px gutter, 358 wide, ratio locked (' + JSON.stringify(lay) + ')');
  ok(lay.sw <= 390, '390: no sideways scroll');
  for (const c of ['CPH', 'SOF', 'IST']) { await m.check('[data-trip][value="' + c + '"]'); }
  await stageTo(m, 80);
  await waitRest(m, 90, 9000);
  await m.evaluate(() => window.TLLDash.dash.trigger('cta:enter'));
  await waitRest(m, 150, 6000);
  /* pointer near a hub at 390 shows the tooltip inside the viewport (a real touch tap is checked below) */
  const hp = await m.evaluate(() => { const r = document.querySelector('[data-dc-stage]').getBoundingClientRect(); const h = window.TLLDash.dash.hubs.find(x => x.code === 'JFK'); return { x: r.left + h.x * r.width, y: r.top + h.y * r.height }; });
  await m.mouse.move(hp.x, hp.y); await sleep(60);
  const tb = await m.evaluate(() => { const t = document.querySelector('[data-dc-tip]'); const r = t.getBoundingClientRect(); return { hidden: t.hidden, l: r.left, r: r.right }; });
  ok(!tb.hidden && tb.l >= 0 && tb.r <= 390, '390: JFK tooltip stays inside the screen (' + JSON.stringify(tb) + ')');
  await m.mouse.move(5, 5);
  const small = await m.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && !e.closest('.tll-dc-sr,.sr,[hidden]') && getComputedStyle(e).display !== 'none' && parseFloat(getComputedStyle(e).fontSize) < 12).map(e => e.className || e.tagName));
  ok(small.length === 0, 'nothing visible under 12px' + (small.length ? ': ' + small.join(', ') : ''));
  await m.evaluate(() => window.scrollTo(0, 0)); await sleep(200);
  await m.screenshot({ path: path.join(DIR, 'shot-390.png'), fullPage: true });
  ok(P.errors.length === 0, '390: no console errors' + (P.errors.length ? ': ' + P.errors.join(' | ') : ''));
  await P.ctx.close();

  /* ================= review additions (November 12, 2026) ================= */
  /* a real touch tap: the tooltip stays after the finger lifts, and a tap elsewhere closes it */
  const T = await setup(browser, { width: 390, height: 844 }, { touch: true });
  const t = T.page;
  await stageTo(t, 120);
  await waitRest(t, 45, 6000);
  const ip = await t.evaluate(() => { const r = document.querySelector('[data-dc-stage]').getBoundingClientRect(); const h = window.TLLDash.dash.hubs.find(x => x.code === 'IST'); return { x: r.left + h.x * r.width, y: r.top + h.y * r.height }; });
  await t.touchscreen.tap(ip.x, ip.y); await sleep(120);
  const tt = await t.evaluate(() => { const e = document.querySelector('[data-dc-tip]'); return { hidden: e.hidden, text: e.textContent }; });
  ok(!tt.hidden && /IST/.test(tt.text), '390 touch: tapping IST shows the tooltip and it stays after the finger lifts (' + tt.text + ')');
  const cp = await t.evaluate(() => { const r = document.querySelector('[data-dc-count]').getBoundingClientRect(); return { x: r.left + 4, y: r.top + r.height / 2 }; });
  await t.touchscreen.tap(cp.x, cp.y); await sleep(80);
  ok(await t.evaluate(() => document.querySelector('[data-dc-tip]').hidden), '390 touch: a tap elsewhere closes it');
  ok(T.errors.length === 0, '390 touch: no console errors' + (T.errors.length ? ': ' + T.errors.join(' | ') : ''));
  await T.ctx.close();

  /* a member's saved places, set before the map is seen, are on the resting frame (motion and reduced motion) */
  for (const reduced of [false, true]) {
    const M = await setup(browser, { width: 1440, height: 900 }, { reduced });
    const mp = M.page;
    await mp.evaluate(() => { window.__segs = []; window.TLLDash.dash.on('segmentstart', d => window.__segs.push(d.key + ':' + d.label)); window.TLLDash.dash.setStamps(['CPH', 'SOF', 'IST']); });
    await stageTo(mp, 80);
    await waitFor(mp, () => { const d = window.TLLDash.dash; return !d.run && !d.queue && d.restFrame === 90 && (d.state === 'ready' || d.state === 'reduced-motion'); }, null, 9000);
    const px = await mp.evaluate(() => { const d = window.TLLDash.dash; const cv = document.querySelector('.tll-dc__canvas'); const c = cv.getContext('2d'); return d.stamps.map(s => c.getImageData(Math.round(s.x * cv.width), Math.round(s.y * cv.height), 1, 1).data.join(',')); });
    ok(px.every(v => v === '240,80,122,255'), (reduced ? 'reduced motion' : 'motion') + ': saved places are stamped on the resting frame after A: ' + px.join(' / ') + ' ' + (await mp.evaluate(() => window.__segs.join())));
    await M.ctx.close();
  }

  /* signup before the map is seen plays Map Unfold once, without a separate A first */
  const U = await setup(browser, { width: 1440, height: 900 });
  const u = U.page;
  await u.evaluate(() => { window.__segs = []; window.TLLDash.dash.on('segmentstart', d => window.__segs.push(d.key + ':' + d.label)); window.TLLDash.dash.trigger('signup:success'); });
  await stageTo(u, 80);
  await waitFor(u, () => { const d = window.TLLDash.dash; return d.state === 'ready' && !d.run && !d.queue && d.restFrame === 150; }, null, 12000);
  segs = await u.evaluate(() => window.__segs);
  ok(segs.join() === 'UNFOLD:A,UNFOLD:C', 'signup before the map is seen: Map Unfold plays A then C once: ' + segs.join());

  /* keyboard: tabbing to each hub button shows its tooltip on screen (the inspector starts closed) */
  await u.focus('[data-dc-cta]');
  const kb = [];
  for (let i = 0; i < 8; i++) {
    await u.keyboard.press('Tab'); await sleep(60);
    kb.push(await u.evaluate(() => { const a = document.activeElement, e = document.querySelector('[data-dc-tip]'), r = e.getBoundingClientRect(), b = a.getBoundingClientRect(); return a.dataset.hub + ':' + (!e.hidden && r.top >= 0 && r.bottom <= innerHeight && b.top >= 0 && b.bottom <= innerHeight ? 'in' : 'OUT'); }));
  }
  ok(kb.length === 8 && kb.every(x => /:in$/.test(x)), '1440 keyboard: each hub button and its tooltip are both on screen: ' + kb.join(' '));
  ok(U.errors.length === 0, 'signup and keyboard run: no console errors' + (U.errors.length ? ': ' + U.errors.join(' | ') : ''));
  await U.ctx.close();

  await browser.close();
  console.log(failures ? failures + ' FAILED' : 'all checks passed');
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
