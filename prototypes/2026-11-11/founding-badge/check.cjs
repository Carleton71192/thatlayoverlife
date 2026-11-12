/* Browser check for the founding badge prototype. Run from this folder:
     NODE_PATH=/opt/node22/lib/node_modules PATH=/opt/node22/bin:$PATH node check.cjs
   Renders the six images (two designs x three formats) through badge.js in Chromium, saves them here,
   checks their pixel sizes from the PNG header, drives the page (form, Make my badge, share step), repeats the
   share step inside a sandboxed frame, and saves shot-390.png and shot-1440.png at device scale 2.
   Set CHECK_EXTRA=dir to also write long-name and theme variants to that folder for review. */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DIR = __dirname;
const URL_ = 'file://' + path.join(DIR, 'index.html');
const EXTRA = process.env.CHECK_EXTRA || '';
let failures = 0;
function ok(cond, msg) { console.log((cond ? 'ok   ' : 'FAIL ') + msg); if (!cond) failures++; }

function pngSize(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47 || buf.toString('ascii', 12, 16) !== 'IHDR') return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

const BASE = { name: 'Sample Traveler', number: 42, cap: null, word: 'anywhere', joined: '2026-11-11', city: { code: 'CPH', name: 'Copenhagen', lat: 55.7, lon: 12.6 } };
const MAGNUS = { name: 'Magnus Waffles', species: 'Dog', breed: 'Samoyed',
  places: 'Brazil, Germany, Czech Republic, Slovakia, Austria, Albania, Serbia, Kosovo, Bulgaria, Sweden, North Macedonia, Hungary, Poland, Luxembourg, Denmark'.split(', ') };
const SIZES = { story: [1080, 1920], square: [1080, 1080], landscape: [1200, 675] };

async function renderPng(page, data) {
  const b64 = await page.evaluate(async (d) => {
    const r = await window.TLLBadge.render(d, { fontTimeout: 8000 });
    const buf = new Uint8Array(await r.blob.arrayBuffer());
    let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
    return { png: btoa(s), fonts: r.fonts, w: r.width, h: r.height };
  }, data);
  return { buf: Buffer.from(b64.png, 'base64'), fonts: b64.fonts };
}

(async () => {
  const browser = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
  const errors = [];

  /* ---------- the six images ---------- */
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(URL_, { waitUntil: 'networkidle' });
  const geo = await page.evaluate(() => typeof navigator.geolocation);
  await page.waitForFunction(() => /loaded|Fallback/.test(document.getElementById('pv-fonts').textContent), null, { timeout: 15000 });
  const fontLine = await page.textContent('#pv-fonts');
  ok(/Brand fonts loaded/.test(fontLine), 'brand fonts: ' + fontLine);

  for (const design of ['traveler', 'paw']) {
    for (const format of ['story', 'square', 'landscape']) {
      const data = Object.assign({}, BASE, { design, format, theme: design === 'paw' ? 'light' : 'dark' });
      if (design === 'paw') { data.number = 3; data.pet = MAGNUS; }
      const r = await renderPng(page, data);
      const file = (design === 'paw' ? 'paw-' : 'badge-') + format + '.png';
      fs.writeFileSync(path.join(DIR, file), r.buf);
      const s = pngSize(r.buf);
      ok(s && s.w === SIZES[format][0] && s.h === SIZES[format][1], file + ' is ' + (s ? s.w + ' x ' + s.h : 'not a PNG') + ', ' + Math.round(r.buf.length / 1024) + ' KB');
      ok(r.fonts.ok, file + ' drawn with the brand fonts');
    }
  }

  /* Variants for review: long names, the other theme, no location, the cap shown. */
  if (EXTRA) {
    fs.mkdirSync(EXTRA, { recursive: true });
    const variants = [
      ['long28-space', { name: 'Sample Traveler Twenty-Eight' }],
      ['long28-nospace', { name: 'Abcdefghijklmnopqrstuvwxyzab' }],
      ['long60', { name: 'Sample Traveler With A Very Long Name That Goes On And On' }],
      ['light-cap-gru', { theme: 'light', cap: 100, number: 100, name: 'São', city: { code: 'GRU', name: 'São Paulo', lat: -23.5, lon: -46.6 } }],
      ['soren-001', { name: 'Søren Ærø', number: 1 }],
      ['dark-nolocation', { city: null }],
      ['paw-dark', { design: 'paw', number: 3, pet: MAGNUS, theme: 'dark' }],
      ['paw-nolocation', { design: 'paw', number: 3, pet: MAGNUS, theme: 'light', city: null }]
    ];
    for (const [name, over] of variants) {
      for (const format of ['story', 'square', 'landscape']) {
        const data = Object.assign({ design: 'traveler', theme: 'dark' }, BASE, over, { format });
        const r = await renderPng(page, data);
        fs.writeFileSync(path.join(EXTRA, name + '-' + format + '.png'), r.buf);
      }
    }
    console.log('variants written to ' + EXTRA);
  }

  /* ---------- the page at 1440 ---------- */
  ok(geo !== 'undefined', 'geolocation exists in this browser and the page never calls it (see test.cjs)');
  await page.fill('#f-name', 'Sample Traveler');
  await page.click('#make');
  await page.waitForSelector('#result:not([hidden])');
  await page.waitForFunction(() => document.getElementById('made-img').naturalWidth > 0);
  const made = await page.evaluate(() => { const i = document.getElementById('made-img'); return { w: i.naturalWidth, h: i.naturalHeight, alt: i.alt }; });
  ok(made.w === 1080 && made.h === 1920, 'Make my badge shows the full-size PNG (' + made.w + ' x ' + made.h + ')');
  ok(/Sample Traveler, founding member No\. 042\. CPH to anywhere/.test(made.alt) && /Ink postmark/.test(made.alt), 'alt text: ' + made.alt);
  const cap = await page.inputValue('#caption');
  ok(cap.includes('https://www.thatlayover.life/?ref=badge') && !/#\w/.test(cap), 'caption carries the link and no hashtags');
  const xHref = await page.getAttribute('#b-x', 'href');
  ok(xHref.startsWith('https://twitter.com/intent/tweet?text=') && xHref.includes('&url=https%3A%2F%2Fwww.thatlayover.life%2F%3Fref%3Dbadge'), 'Open X link is prefilled');
  const vis = await page.evaluate(() => ['b-share', 'b-save', 'b-copy', 'b-x', 'save-hint'].reduce((o, id) => (o[id] = !document.getElementById(id).hidden, o), {}));
  ok(vis['b-save'] && vis['b-copy'] && vis['b-x'], 'top level: Save image, Copy caption and Open X shown');
  console.log('     share sheet with files available here: ' + vis['b-share'] + '; save hint shown: ' + vis['save-hint']);
  const evs = await page.textContent('#events');
  ok(/badge_made design=traveler format=story/.test(evs), 'badge_made event recorded');

  /* Small type and sideways scroll. */
  async function pageChecks(p, label) {
    const r = await p.evaluate(() => {
      const small = [];
      document.querySelectorAll('body *').forEach(el => {
        if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') return;
        const hasText = [].some.call(el.childNodes, n => n.nodeType === 3 && n.textContent.trim());
        if (hasText && parseFloat(getComputedStyle(el).fontSize) < 12) small.push(el.tagName + ' ' + el.textContent.trim().slice(0, 30));
      });
      return { small, overflow: document.documentElement.scrollWidth - window.innerWidth };
    });
    ok(!r.small.length, label + ': no text under 12px' + (r.small.length ? ' (' + r.small.join('; ') + ')' : ''));
    ok(r.overflow <= 0, label + ': no sideways scroll (' + r.overflow + ')');
  }
  await pageChecks(page, '1440');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(DIR, 'shot-1440.png'), fullPage: true });

  /* Keyboard focus is visible. */
  await page.keyboard.press('Tab');
  const focus = await page.evaluate(() => { const s = getComputedStyle(document.activeElement); return s.outlineStyle + ' ' + s.outlineWidth + ' ' + s.outlineColor + ' ' + s.outlineOffset; });
  ok(/solid 2px rgb\(200, 50, 91\) 2px/.test(focus), 'focus ring: ' + focus);

  /* ---------- the page at 390 ---------- */
  const ctx390 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p390 = await ctx390.newPage();
  p390.on('pageerror', e => errors.push(String(e)));
  await p390.goto(URL_, { waitUntil: 'networkidle' });
  await p390.waitForFunction(() => /loaded|Fallback/.test(document.getElementById('pv-fonts').textContent), null, { timeout: 15000 });
  await p390.check('input[name=design][value=paw]', { force: true });
  await p390.check('input[name=theme][value=light]', { force: true });
  const petNum = await p390.inputValue('#f-number');
  ok(petNum === '3', 'Paw Passport switches the sample number to Magnus\'s 03 (' + petNum + ')');
  ok((await p390.textContent('#pet-count')) === '15', 'Magnus: 15 countries, counted from his record');
  await p390.click('#make');
  await p390.waitForSelector('#result:not([hidden])');
  await pageChecks(p390, '390');
  const gutter = await p390.evaluate(() => document.getElementById('badge-form').getBoundingClientRect().left);
  ok(Math.round(gutter) === 16, '390: 16px gutter (' + gutter + ')');
  await p390.evaluate(() => window.scrollTo(0, 0));
  await p390.screenshot({ path: path.join(DIR, 'shot-390.png'), fullPage: true });

  /* ---------- inside a sandboxed frame (how the private artifact is viewed) ---------- */
  const html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  const ctxF = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  const pf = await ctxF.newPage();
  pf.on('pageerror', e => errors.push('frame: ' + String(e)));
  await pf.setContent('<!DOCTYPE html><iframe id="f" sandbox="allow-scripts" style="width:1180px;height:880px;border:0"></iframe>');
  await pf.$eval('#f', (f, h) => { f.srcdoc = h; }, html);
  const fh = await (await pf.$('#f')).contentFrame();
  await fh.waitForSelector('#make');
  await fh.waitForFunction(() => /loaded|Fallback/.test(document.getElementById('pv-fonts').textContent), null, { timeout: 15000 });
  await fh.click('#make');
  await fh.waitForSelector('#result:not([hidden])');
  const fr = await fh.evaluate(() => ({
    hint: !document.getElementById('save-hint').hidden && document.getElementById('save-hint').textContent,
    share: !document.getElementById('b-share').hidden,
    save: !document.getElementById('b-save').hidden,
    img: document.getElementById('made-img').naturalWidth
  }));
  ok(fr.img === 1080, 'sandboxed frame: the finished image is on the page');
  ok(fr.hint === 'Press and hold, or right-click, to save the image', 'sandboxed frame: save hint shown');
  ok(!fr.share, 'sandboxed frame: no Share button that cannot work');
  ok(!fr.save, 'sandboxed frame: no Save image button that cannot work');
  await fh.click('#b-copy');
  await fh.waitForFunction(() => document.getElementById('share-status').textContent.length > 0);
  console.log('     copy caption in the frame: ' + await fh.textContent('#share-status'));
  await fh.click('#b-x');
  await fh.waitForFunction(() => /X|tab/.test(document.getElementById('share-status').textContent));
  console.log('     Open X in the frame: ' + await fh.textContent('#share-status'));

  ok(!errors.length, 'no page errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await browser.close();
  console.log(failures ? failures + ' check(s) failed' : 'all checks passed');
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
