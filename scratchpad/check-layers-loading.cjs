// Offline checks for the loading changes in three site layers (1 Nov 2026). Run from the repo root: node scratchpad/check-layers-loading.cjs
//  page heroes  the five fixtures from src/pages/heroes-2026-10-29: lazy or eager as designed, decoding=async, Webflow -p- variants on the lazy
//               tiles only (served, and answered 404 so the one-time fallback to the original is exercised; eager images and the files the
//               13 Oct manifest lists without variants keep the original), high priority plus a preload on the two above-the-fold photos (the
//               /for-expats preload only at 1100px and up), and no tile box changing height between insertion and image load (images are
//               delayed 500 ms).
//  album        a mocked /album payload with a Cloudinary cover and a Webflow cover (uppercase .JPG): c_fill square for the mount, -p-500 tried
//               for Webflow with a lowercase name, the slide show stage keeps c_limit,w_1800 and carries no decoding hint.
//  ads          the script is fetched on every allowed page after ad consent, with or without slot ids (Auto ads as before), and only through
//               requestIdleCallback (timeout 4 s) or the timer fallback; never on the home page; a sponsored story pauses requests. The consent
//               bridge is stubbed as tll-consent-v3 exposes it.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'); const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const HEROES = read('src/site-layers/tll-page-heroes-v1.js'), ALBUM = read('src/site-layers/tll-album-v1.js'), ADS = read('src/site-layers/tll-ads-v1.js');
const JPG = fs.readFileSync(path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/img/avatar-nancy.jpg'));
let fails = 0; const ok = (cond, msg) => { console.log((cond ? '  PASS ' : '  FAIL ') + msg); if (!cond) fails++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const NOV = /magnus-holi|pantanal-hero-jaguar|sortsol-hero/; /* listed in the 13 Oct manifest without variants: the layer keeps their originals */
async function page(b, opts) { const p = await b.newPage({ viewport: { width: opts.width || 1280, height: 900 } }); const reqs = [];
  await p.route('**/*', async r => { const u = r.request().url(); reqs.push(u);
    if (u.startsWith('https://www.thatlayover.life/') && !/\.(js|css|json)(\?|$)/.test(u) && !u.includes('workers.dev')) return r.fulfill({ body: opts.html, contentType: 'text/html; charset=utf-8' });
    if (opts.api && u.includes('workers.dev')) return r.fulfill({ body: JSON.stringify(opts.api), contentType: 'application/json' });
    if (/pagead2\.googlesyndication\.com/.test(u)) return r.fulfill({ body: '', contentType: 'application/javascript' });
    if (/\.(jpe?g|png|webp)(\?|$)/i.test(u) || /res\.cloudinary\.com/.test(u)) { if (opts.delay) await sleep(opts.delay);
      if (opts.variants === '404' && /-p-\d+\.(jpe?g|png)$/i.test(u)) return r.fulfill({ status: 404, body: 'no variant' });
      return r.fulfill({ body: JPG, contentType: 'image/jpeg' }); }
    return r.abort(); });
  return { p, reqs }; }
const inject = (html, head, body) => html.replace(/<head>/i, '<head>' + (head || '')).replace(/<\/body>/i, (body || '') + '</body>');
(async () => { const b = await chromium.launch();
  // ---- page heroes
  const PAGES = { '/stories': 'stories.html', '/travelers': 'travelers.html', '/the-map': 'the-map.html', '/about': 'about.html', '/for-expats': 'for-expats.html' };
  for (const variants of ['served', '404']) for (const [route, file] of Object.entries(PAGES)) {
    console.log(`\npage heroes ${route}, variants ${variants}`);
    const html = inject(read('src/pages/heroes-2026-10-29/fixtures/' + file), '<script>' + HEROES + '</script>');
    const { p, reqs } = await page(b, { html, variants, delay: 500 });
    await p.goto('https://www.thatlayover.life' + route).catch(() => {}); await p.waitForSelector('.tll-ph-img img', { state: 'attached' });
    const boxes = () => [].map.call(document.querySelectorAll('.tll-ph-img'), f => Math.round(f.getBoundingClientRect().height));
    const early = await p.evaluate(boxes);
    await p.evaluate(() => [].forEach.call(document.querySelectorAll('.tll-ph-img img'), i => i.scrollIntoView({ block: 'center' }))); await p.waitForTimeout(1800);
    await p.evaluate(() => [].forEach.call(document.querySelectorAll('.tll-ph-img img'), i => i.scrollIntoView({ block: 'center' }))); await p.waitForTimeout(1400);
    const late = await p.evaluate(boxes);
    ok(early.length && early.join() === late.join(), `${early.length} tile boxes keep their height from insertion to image load (${early.join(',')})`);
    const imgs = await p.evaluate(() => [].map.call(document.querySelectorAll('.tll-ph-img img'), i => ({ src: i.getAttribute('src').split('/').pop(), loading: i.getAttribute('loading'), pri: i.getAttribute('fetchpriority'), dec: i.getAttribute('decoding'), loaded: i.complete && i.naturalWidth > 0, shown: i.classList.contains('tll-ph-in'), where: (i.closest('.tll-ph-row,.tll-ph-faces,.tll-ph-bg,.tll-ph-strip,.tll-ph-side,.tll-ph-band') || {}).className })));
    const pre = await p.evaluate(() => [].map.call(document.querySelectorAll('link[rel="preload"][as="image"]'), l => l.href.split('/').pop() + ' ' + l.getAttribute('fetchpriority')));
    ok(imgs.every(i => i.dec === 'async' && i.loaded && i.shown), `all ${imgs.length} images decoding=async, loaded and faded in`);
    const want = { '/stories': { lazy: true, w: 500 }, '/travelers': { lazy: false, w: 0, pri: 'low' }, '/the-map': { lazy: false, w: 0, pri: 'high' }, '/about': { lazy: true, w: 800 }, '/for-expats': null }[route];
    const check = (list, spec, label) => { const v = spec.w ? new RegExp('-p-' + spec.w + '\\.') : /-p-\d+\./;
      ok(list.every(i => i.loading === (spec.lazy ? 'lazy' : 'eager') && (i.pri || null) === (spec.pri || null)), `${label}: ${list.length} images loading=${spec.lazy ? 'lazy' : 'eager'} fetchpriority=${spec.pri || 'none'} (written out, so the footer's lazy pass leaves them alone)`);
      if (!spec.w) ok(list.every(i => !/-p-\d+\./.test(i.src)), `${label}: original file kept (${list.map(i => i.src.slice(0, 40)).join(', ')})`);
      else if (variants === 'served') ok(list.every(i => v.test(i.src) || NOV.test(i.src)), `${label}: -p-${spec.w} variants in use, jaguar, Sort Sol and Magnus kept (${list.map(i => i.src.slice(-28)).join(', ')})`);
      else ok(list.every(i => !/-p-\d+\./.test(i.src)), `${label}: fell back to the originals after 404 (${list.map(i => i.src.slice(-28)).join(', ')})`); };
    if (want) check(imgs, want, route);
    else { check(imgs.filter(i => /tll-ph-side/.test(i.where)), { lazy: false, w: 0, pri: 'high' }, '/for-expats side'); check(imgs.filter(i => /tll-ph-band/.test(i.where)), { lazy: true, w: 800 }, '/for-expats band'); }
    if (route === '/the-map' || route === '/for-expats') ok(pre.some(x => /sortsol-hero/.test(x) && / high$/.test(x)), `preload link for the Sort Sol photo at high priority (1280 wide): ${pre.join('; ')}`);
    else ok(pre.length === 0, `no preload link on ${route}`);
    const expectTries = imgs.filter(i => i.loading === 'lazy' && !NOV.test(i.src)).length, tries = reqs.filter(u => /-p-\d+\./.test(u)).length;
    ok(tries === expectTries, `${tries} variant request(s) for ${expectTries} lazy tile(s) with variants` + (variants === '404' ? ', then the originals' : ''));
    await p.close(); }
  // /for-expats on a phone: the side tile is placed after the copy below 1100px, so no preload is emitted there
  { console.log('\npage heroes /for-expats at 390 wide');
    const html = inject(read('src/pages/heroes-2026-10-29/fixtures/for-expats.html'), '<script>' + HEROES + '</script>');
    const { p } = await page(b, { html, variants: 'served', width: 390 });
    await p.goto('https://www.thatlayover.life/for-expats').catch(() => {}); await p.waitForSelector('.tll-ph-img img', { state: 'attached' });
    const pre = await p.evaluate(() => document.querySelectorAll('link[rel="preload"][as="image"]').length);
    ok(pre === 0, `no preload link on /for-expats at 390 wide (${pre} found)`); await p.close(); }
  // ---- album
  for (const variants of ['served', '404']) { console.log(`\nalbum, variants ${variants}`);
    const CL = 'https://res.cloudinary.com/idonvlow/image/upload/v1/tll/europe-cover.jpg', WF = 'https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/aaa_bbb_asia-hero.JPG';
    const api = { ok: true, name: 'Nancy', model: 'seven', continents: [
      { key: 'europe', name: 'Europe', countries: 3, cover: { img: CL }, photos: [{ img: CL, line: 'Lisbon' }, { img: WF, line: 'Sofia' }] },
      { key: 'asia', name: 'Asia', countries: 1, cover: { img: WF }, photos: [{ img: WF, line: 'Doha' }] },
      { key: 'africa', name: 'Africa', countries: 0, cover: null, photos: [] }] };
    const html = '<!doctype html><html><head></head><body><main><section><h1>Nancy Carleton</h1></section></main><script>' + ALBUM + '</script></body></html>';
    const { p } = await page(b, { html, variants, api });
    await p.goto('https://www.thatlayover.life/contributors/nancy-carleton').catch(() => {}); await p.waitForSelector('.tll-alb-mount img', { state: 'attached' });
    await p.evaluate(() => [].forEach.call(document.querySelectorAll('.tll-alb-mount img'), i => i.scrollIntoView())); await p.waitForTimeout(1200);
    const m = await p.evaluate(() => [].map.call(document.querySelectorAll('.tll-alb-mount img'), i => ({ src: i.getAttribute('src'), loading: i.getAttribute('loading'), dec: i.getAttribute('decoding'), loaded: i.complete && i.naturalWidth > 0, box: Math.round(i.closest('.tll-alb-mount').getBoundingClientRect().width) + 'x' + Math.round(i.closest('.tll-alb-mount').getBoundingClientRect().height) })));
    ok(m.length === 2 && m.every(x => x.loading === 'lazy' && x.dec === 'async' && x.loaded), `2 mounts lazy, decoding=async, loaded (${m.map(x => x.box).join(', ')} square boxes)`);
    const cl = m.find(x => /cloudinary/.test(x.src)), wf = m.find(x => /website-files/.test(x.src)); /* the layer lays the continents out in a fixed order */
    ok(cl && cl.src.includes('/upload/c_fill,w_400,h_400,q_auto,f_auto/'), `Cloudinary cover cropped to the square mount: ${cl && cl.src}`);
    if (variants === 'served') ok(wf && /asia-hero-p-500\.jpg$/.test(wf.src), `Webflow cover tries -p-500 with a lowercase name for the .JPG original: ${wf && wf.src.split('/').pop()}`);
    else ok(wf && wf.src === WF, `Webflow cover fell back to the original after 404: ${wf && wf.src.split('/').pop()}`);
    await p.click('button.tll-alb-mount:has(img[src*="cloudinary"])'); await p.waitForSelector('.tll-ss-stage img');
    const s = await p.evaluate(() => { const i = document.querySelector('.tll-ss-stage img'); return { src: i.getAttribute('src'), dec: i.getAttribute('decoding') }; });
    ok(s.src.includes('/upload/c_limit,w_1800,q_auto,f_auto/') && s.dec === null, `slide show stage keeps c_limit,w_1800 and carries no decoding hint (decoding=${s.dec}): ${s.src}`);
    await p.close(); }
  // ---- ads
  const body = '<div class="tll-story-body">' + Array.from({ length: 8 }, (_, i) => (i === 3 || i === 6 ? '<h2>Section</h2>' : '') + '<p>' + 'word '.repeat(95) + '</p>').join('') + '</div>';
  const consent = (ready, ads) => `<script>window.__tllConsent={ready:${ready},ads:${ads}};window.__idle=[];var _ric=window.requestIdleCallback;window.requestIdleCallback=function(cb,o){window.__idle.push(o&&o.timeout);return _ric?_ric(cb,o):setTimeout(cb,50);};</script>`;
  const filled = ADS.replace("var SLOTS={inArticle:'',display:''};", "var SLOTS={inArticle:'1111111111',display:'2222222222'};");
  const cases = [
    { name: 'no slot ids (as committed), consent given: loads once idle, no manual units (Auto ads as before)', route: '/stories/test-story', js: ADS, pre: consent(true, true), expect: true, idle: true, units: 0 },
    { name: 'no slot ids, consent refused: nothing loads', route: '/stories/test-story', js: ADS, pre: consent(true, false), expect: false },
    { name: 'no slot ids, sponsored story, consent given: loads once idle, requests paused', route: '/stories/test-story', js: ADS, pre: consent(true, true), expect: true, idle: true, units: 0, paused: true, sponsored: true },
    { name: 'slot ids, consent refused: nothing loads', route: '/stories/test-story', js: filled, pre: consent(true, false), expect: false },
    { name: 'slot ids, consent given: loads once idle, two units', route: '/stories/test-story', js: filled, pre: consent(true, true), expect: true, idle: true, units: 2 },
    { name: 'slot ids, consent arrives later by event: loads after it', route: '/stories/test-story', js: filled, pre: consent(false, false), expect: true, event: true, idle: true },
    /* assigning undefined shadows the inherited method (delete would not); the fallback timer is 2 s after the layer's own 600 ms, so wait longer */
    { name: 'slot ids, no requestIdleCallback: timer fallback loads', route: '/stories/test-story', js: filled, pre: '<script>window.__tllConsent={ready:true,ads:true};window.requestIdleCallback=undefined;window.__idle=[];</script>', expect: true, wait: 3600 },
    { name: 'home page, slot ids, consent given: never loads, requests paused', route: '/', js: filled, pre: consent(true, true), expect: false, paused: true },
    { name: '/stories library with 12 cards, slot ids: loads once idle', route: '/stories', js: filled, pre: consent(true, true), expect: true, idle: true, lib: true }];
  for (const c of cases) { console.log(`\nads: ${c.name}`);
    const main = c.lib ? '<div class="w-dyn-list">' + Array.from({ length: 12 }, (_, i) => '<div class="w-dyn-item"><a class="tll-lib-card" href="/stories/s' + i + '">card</a></div>').join('') + '</div>' : (c.sponsored ? '<p data-tll-sponsored>Paid by a hotel</p>' : '') + body;
    const html = '<!doctype html><html><head>' + c.pre + '</head><body>' + main + '<script>' + c.js + '</script></body></html>';
    const { p, reqs } = await page(b, { html });
    await p.goto('https://www.thatlayover.life' + c.route).catch(() => {}); await p.waitForTimeout(c.wait || 1500);
    if (c.event) { ok(!reqs.some(u => /adsbygoogle\.js/.test(u)), 'no ad script before the consent event'); await p.evaluate(() => { window.__tllConsent = { ready: true, ads: true }; window.dispatchEvent(new CustomEvent('tll:consent', { detail: { ads: true } })); }); await p.waitForTimeout(1200); }
    if (!c.expect) await p.waitForTimeout(3500);
    const st = await p.evaluate(() => ({ idle: window.__idle, paused: window.adsbygoogle && window.adsbygoogle.pauseAdRequests, units: document.querySelectorAll('.tll-ad').length }));
    const loaded = reqs.some(u => /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-7257230007536660/.test(u));
    ok(loaded === c.expect, `ad script ${loaded ? 'requested' : 'not requested'} (expected ${c.expect ? 'requested' : 'not requested'}); units on page: ${st.units}`);
    if (c.idle) ok(st.idle.length === 1 && st.idle[0] === 4000, `loaded through requestIdleCallback with timeout 4000 (${JSON.stringify(st.idle)})`);
    if (c.paused) ok(st.paused === 1, `adsbygoogle.pauseAdRequests=${st.paused}`);
    if (c.units != null) ok(st.units === c.units, `${st.units} manual unit(s) on the page (expected ${c.units})`);
    await p.close(); }
  await b.close(); console.log(fails ? `\n${fails} check(s) failed` : '\nall checks passed'); process.exit(fails ? 1 : 0);
})();
