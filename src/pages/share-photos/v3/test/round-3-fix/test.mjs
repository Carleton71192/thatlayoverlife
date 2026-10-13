// Offline Playwright checks for /share-photos v3, round 2 (after the Fix stage). Pages come from mock-in.html / mock-out.html (built by gen.py) served through
// page.route on http://tll.test/. Every other request is stubbed (204) or, for cookieconsent's CDN bundle, answered with a tiny shim.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
import { execSync } from 'child_process';
const dir = new URL('.', import.meta.url).pathname;
const V3 = '/home/user/thatlayoverlife/src/pages/share-photos/v3/';
const results = [];
function rec(check, name, pass, evidence) { results.push({ check, name, pass: !!pass, evidence: typeof evidence === 'string' ? evidence : JSON.stringify(evidence) }); }
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

async function open(file, { width = 1280, height = 900, reduced = false, query = '' } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const errors = [], net = [], navs = [];
  await ctx.addInitScript(() => { window.__rej = []; window.addEventListener('unhandledrejection', e => window.__rej.push(String(e.reason))); });
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + String(e)));
  page.on('framenavigated', f => { if (f === page.mainFrame()) navs.push(f.url()); });
  await page.route('**/*', async route => {
    const url = route.request().url();
    if (url.startsWith('http://tll.test/')) {
      const p = new URL(url).pathname;
      if (p.endsWith('.css')) return route.fulfill({ body: fs.readFileSync(dir + p.slice(1)), contentType: 'text/css' });
      if (p.endsWith('.html')) return route.fulfill({ body: fs.readFileSync(dir + p.slice(1)), contentType: 'text/html' });
      net.push(url); return route.fulfill({ status: 204, body: '' });
    }
    net.push(url);
    if (/cookieconsent\.umd\.js/.test(url)) return route.fulfill({ contentType: 'application/javascript', body: 'window.CookieConsent={run(){},show(){},hide(){},acceptCategory(){},acceptedCategory(){return false},getCookie(){return {}},getUserPreferences(){return {acceptedCategories:[]}},validConsent(){return false}};' });
    if (/\.js(\?|$)/.test(url)) return route.fulfill({ contentType: 'application/javascript', body: '' });
    if (/\.css(\?|$)|fonts\.googleapis/.test(url)) return route.fulfill({ contentType: 'text/css', body: '' });
    return route.fulfill({ status: 204, body: '' });
  });
  await page.goto('http://tll.test/' + file + query);
  return { page, ctx, errors, net, navs };
}
const files3 = [1, 2, 3].map(i => dir + `fixtures/photo-${i}.jpg`);
const files13 = Array.from({ length: 13 }, (_, i) => dir + `fixtures/batch-${String(i + 1).padStart(2, '0')}.jpg`);
const norm = s => (s || '').replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- check 1, 2, 3, 12, 13 per viewport (signed in)
for (const width of [1280, 390]) {
  const height = width === 1280 ? 900 : 844;
  const { page, ctx, errors, navs } = await open('mock-in.html', { width, height });
  await page.waitForTimeout(4000);
  const rej = await page.evaluate(() => window.__rej);
  rec(1, `in ${width}: no pageerror, console error or unhandled rejection after 4s`, errors.length === 0 && rej.length === 0, { errors, rej });
  await page.screenshot({ path: dir + `in-${width}-fold.png` });
  await page.screenshot({ path: dir + `in-${width}-full.png`, fullPage: true });

  const s2 = await page.evaluate(() => {
    const q = s => document.querySelector(s);
    const nav = q('[data-mock=nav]'), back = q('a[data-tll-back]'), eyebrow = q('.tll-photos-eyebrow'), h1 = q('h1.tll-photos-title'), em = h1 && h1.querySelector('em'),
      lede = q('p.tll-photos-sub'), form = q('form[data-tll-form="share-photos"]'), fs1 = form.querySelector('fieldset'), legend = fs1.querySelector('legend'),
      help = fs1.querySelector('p.tll-pen-help'), drop = fs1.querySelector('label.tll-photos-drop');
    const seq = [nav, back, eyebrow, h1, lede, legend, help, drop];
    let ordered = true;
    for (let i = 1; i < seq.length; i++) if (!(seq[i - 1] && seq[i]) || !(seq[i - 1].compareDocumentPosition(seq[i]) & Node.DOCUMENT_POSITION_FOLLOWING)) ordered = false;
    const country = form.querySelector('[name=country]'), caption = form.querySelector('[name=caption]');
    const cl = country.closest('label'), capl = caption.closest('label');
    const prev = capl.previousElementSibling, between = prev === cl ? [] : [prev && (prev.id || prev.tagName)];
    const directlyAfter = prev === cl || (prev && prev.id === 'tll-err-country' && prev.previousElementSibling === cl);
    const r = drop.getBoundingClientRect();
    return {
      ordered, backText: back.textContent, eyebrowText: eyebrow.textContent, eyebrowUpper: getComputedStyle(eyebrow).textTransform,
      titleText: h1.textContent, emText: em && em.textContent, emItalic: em && getComputedStyle(em).fontStyle, ledeText: lede.textContent,
      legendBefore: getComputedStyle(legend, '::before').content, legendText: legend.textContent, legendUpper: getComputedStyle(legend).textTransform,
      helpText: help.textContent, dropTop: Math.round(r.top), dropBottom: Math.round(r.bottom), dropVisible: r.height > 0 && getComputedStyle(drop).visibility !== 'hidden',
      whereLabel: !!Array.from(form.querySelectorAll('.tll-pen-label')).find(s => s.textContent === 'Where is this?'),
      captionLabel: capl.querySelector('.tll-pen-label').textContent, directlyAfter, between,
      placeholders: Array.from(form.querySelectorAll('[placeholder]')).map(e => e.name + '=' + e.getAttribute('placeholder')),
      scrollY: window.scrollY, vh: innerHeight
    };
  });
  const foldLimit = width === 1280 ? 800 : height;
  // Chromium returns the specified value (counter(...)) for ::before content, so the rendered number is read from the accessibility tree
  const aria = await page.locator('form[data-tll-form="share-photos"]').ariaSnapshot();
  const groupNames = (aria.match(/- group "([^"]+)"/g) || []).map(s => s.replace(/- group "|"$/g, ''));
  s2.ariaGroups = groupNames;
  // and from layout: with .is-plain (the CSS switch that removes the counter) every group label must get narrower by the width of "0n · "
  s2.counterWidths = await page.evaluate(() => {
    const form = document.querySelector('form[data-tll-form="share-photos"]');
    const labels = [...form.querySelectorAll(':scope > fieldset > legend.tll-pen-legend, :scope > .tll-pen-promises > .tll-pen-legend, :scope > fieldset > div.tll-pen-legend')];
    // where the first text node starts relative to the label box: with a rendered "0n · " ::before the text is pushed right
    const w = () => labels.map(l => { const r = document.createRange(); r.selectNodeContents(l.firstChild); const first = r.getClientRects()[0] || r.getBoundingClientRect(); return Math.round(first.left - l.getBoundingClientRect().left); });
    const withCounter = w(); form.classList.add('is-plain'); const plain = w(); form.classList.remove('is-plain');
    const nested = form.querySelector('fieldset fieldset legend'); const nestedBefore = nested ? getComputedStyle(nested, '::before').content : null;
    return { labels: labels.map(l => l.textContent), withCounter, plain, nestedLegendBefore: nestedBefore };
  });
  s2.counterRendered = s2.legendBefore === '"01 · "' || (/counter\(tll-step/.test(s2.legendBefore) && s2.counterWidths.withCounter.length === 4 && s2.counterWidths.withCounter.every((x, i) => x > s2.counterWidths.plain[i] + 20 && s2.counterWidths.plain[i] <= 1) && s2.counterWidths.nestedLegendBefore === 'none');
  rec(2, `in ${width}: first screen order and content (section 2)`,
    s2.ordered && s2.backText === '← The Layover Lounge' && s2.eyebrowText === 'The Layover Lounge' && s2.eyebrowUpper === 'uppercase' && s2.titleText === 'Submit your shot.' && s2.emText === 'shot' && s2.emItalic === 'italic'
    && s2.ledeText === 'Real photos from real places. No filters, no stock, no staging. If you were there, it counts.' && s2.counterRendered && s2.legendText === 'Your photos' && s2.legendUpper === 'uppercase'
    && s2.helpText === 'Up to 12 at a time. JPG or WebP, 25MB each at most.' && s2.dropVisible && s2.dropBottom <= foldLimit && s2.whereLabel && s2.captionLabel === 'What was happening?' && s2.directlyAfter && s2.placeholders.length === 0,
    Object.assign({ foldLimit }, s2));

  const s3 = await page.evaluate(() => {
    const form = document.querySelector('form[data-tll-form="share-photos"]');
    const req = Array.from(form.querySelectorAll('[required]')).map(e => e.name);
    const req2 = Array.from(form.querySelectorAll('input,select,textarea')).filter(e => e.required).map(e => e.name);
    const photos = form.querySelector('[name=photos]'), year = form.querySelector('[name=year]');
    return { reqAttr: req, reqProp: req2, accept: photos.getAttribute('accept'), yearRequired: year.required, yearInputmode: year.getAttribute('inputmode') };
  });
  const want = ['photos', 'country', 'agree-rights', 'agree-licence', 'agree-people'];
  rec(3, `in ${width}: exactly five required controls, accept image/jpeg,image/webp, year optional`,
    s3.reqProp.length === 5 && want.every(n => s3.reqProp.includes(n)) && s3.accept === 'image/jpeg,image/webp' && s3.yearRequired === false, s3);

  // check 12: computed styles (fresh page, no pointer interaction yet, so programmatic focus counts as focus-visible)
  const s12 = await page.evaluate(() => {
    const form = document.querySelector('form[data-tll-form="share-photos"]'); const cs = e => e ? getComputedStyle(e) : null;
    const h1 = cs(document.querySelector('h1.tll-photos-title'));
    const inputs = ['country', 'city', 'year', 'caption', 'pets-along', 'trip-type'].map(n => { const e = form.querySelector('[name="' + n + '"]'); const c = cs(e); return [n, c.fontSize, c.borderRadius]; });
    const drop = cs(form.querySelector('label.tll-photos-drop')), radio = cs(form.querySelector('label.tll-pen-radio')), promise = cs(form.querySelector('label.tll-pen-field-inline')),
      btn = cs(form.querySelector('input[type=submit]')), done = cs(document.querySelector('.w-form-done'));
    const country = form.querySelector('[name=country]'); country.focus();
    const fc = cs(country); const focused = document.activeElement === country, fv = country.matches(':focus-visible');
    const out = { fontFamily: h1.fontFamily, fontWeight: h1.fontWeight, inputs, dropRadius: drop.borderRadius, radioRadius: radio.borderRadius, promiseRadius: promise.borderRadius, btnRadius: btn.borderRadius, doneRadius: done.borderRadius,
      btnBg: btn.backgroundColor, focus: { focused, fv, outline: fc.outlineWidth + ' ' + fc.outlineStyle + ' ' + fc.outlineColor, offset: fc.outlineOffset, shadow: fc.boxShadow } };
    country.blur(); return out;
  });
  rec(12, `in ${width}: computed styles (title, inputs 16px, 4px radius, focus ring, button color)`,
    /^"?Playfair Display"?/.test(s12.fontFamily) && s12.fontWeight === '800' && s12.inputs.every(i => i[1] === '16px' && i[2] === '4px') && [s12.dropRadius, s12.radioRadius, s12.promiseRadius, s12.btnRadius, s12.doneRadius].every(r => r === '4px')
    && s12.btnBg === 'rgb(214, 56, 89)' && s12.focus.fv && s12.focus.outline === '3px solid rgb(10, 11, 20)' && /rgb\(0, 201, 200\) 0px 0px 0px 6px/.test(s12.focus.shadow), s12);

  // check 13: overflow and tap targets
  const s13 = await page.evaluate(() => {
    const de = document.documentElement; const main = document.querySelector('main');
    const els = Array.from(main.querySelectorAll('a,button,input,select,label.tll-photos-drop'));
    const small = [];
    for (const e of els) {
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none') continue;
      if (e.matches('input[type=file]')) continue; // visually hidden, the drop label is the target
      const min = e.matches('a[data-tll-back]') ? 24 : 44;
      let okRow = r.height >= min, row = e;
      while (!okRow && row && row !== main) { row = row.parentElement; if (row && ['LABEL', 'LI', 'DIV', 'BUTTON'].includes(row.tagName)) { const rr = row.getBoundingClientRect(); if (rr.height >= min && rr.height < 400) okRow = true; } }
      if (!okRow) small.push({ el: e.tagName + (e.id ? '#' + e.id : '') + (e.name ? '[' + e.name + ']' : '') + (e.className ? '.' + String(e.className).split(' ')[0] : ''), h: Math.round(r.height), text: (e.textContent || e.value || '').trim().slice(0, 40) });
    }
    return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, small, count: els.length };
  });
  rec(13, `in ${width}: no horizontal overflow, every interactive element 44px tall or in a 44px row (back link 24px)`, s13.scrollWidth === s13.clientWidth && s13.small.length === 0, s13);
  await ctx.close();
}

// ---------------------------------------------------------------- check 4: disclosures (1280)
{
  const { page, ctx } = await open('mock-in.html');
  await page.waitForTimeout(600);
  const state = () => page.evaluate(() => {
    const out = {};
    for (const [b, p] of [['tll-more-detail-btn', 'tll-more-detail'], ['tll-more-share-btn', 'tll-more-share']]) {
      const btn = document.getElementById(b), panel = document.getElementById(p);
      if (!btn || !panel) { out[p] = null; continue; }
      const focusables = Array.from(panel.querySelectorAll('input,select,button,a,[tabindex]')); const tabbable = [];
      const prev = document.activeElement;
      for (const f of focusables) { f.focus(); if (document.activeElement === f) tabbable.push(f.name || f.id || f.tagName); }
      if (prev && prev.focus) prev.focus(); else document.activeElement.blur();
      const cs = getComputedStyle(panel);
      out[p] = { expanded: btn.getAttribute('aria-expanded'), controls: btn.getAttribute('aria-controls'), btnText: btn.textContent, btnClass: btn.className, panelClass: panel.className, isOpen: panel.classList.contains('is-open'), visibility: cs.visibility, rows: cs.gridTemplateRows, display: cs.display, height: Math.round(panel.getBoundingClientRect().height), tabbable, focusables: focusables.length };
    }
    out.help = (document.querySelector('.tll-pen-disclosure-help') || {}).textContent; out.session = sessionStorage.getItem('tllPhotosPanels');
    return out;
  });
  const closed = s => s && s.expanded === 'false' && s.visibility === 'hidden' && !s.isOpen && s.tabbable.length === 0;
  const opened = s => s && s.expanded === 'true' && s.visibility === 'visible' && s.isOpen && s.tabbable.length > 0;
  const s0 = await state();
  rec(4, 'in 1280: both disclosures closed on load (aria-expanded=false, visibility hidden, nothing tabbable)', closed(s0['tll-more-detail']) && closed(s0['tll-more-share']) && s0.help === 'City, year, trip type and a pet in the shot. None of it is required.', s0);
  await page.click('#tll-more-detail-btn'); await page.waitForTimeout(350); const s1 = await state();
  await page.click('#tll-more-share-btn'); await page.waitForTimeout(350); const s1b = await state();
  await page.click('#tll-more-detail-btn'); await page.click('#tll-more-share-btn'); await page.waitForTimeout(350); const s2 = await state();
  rec(4, 'in 1280: toggling opens and closes both panels', opened(s1['tll-more-detail']) && opened(s1b['tll-more-share']) && closed(s2['tll-more-detail']) && closed(s2['tll-more-share']), { afterOpenDetail: s1['tll-more-detail'], afterOpenShare: s1b['tll-more-share'], afterClose: s2 });
  await page.click('#tll-more-share-btn'); await page.waitForTimeout(100);
  const sess = await page.evaluate(() => sessionStorage.getItem('tllPhotosPanels'));
  await page.reload(); await page.waitForTimeout(600); const s3 = await state();
  rec(4, 'in 1280: sessionStorage remembers an open panel across reload', sess === '{"detail":false,"share":true}' && opened(s3['tll-more-share']) && closed(s3['tll-more-detail']), { sessBeforeReload: sess, afterReload: s3 });
  await page.click('#tll-more-share-btn'); await page.click('#tll-more-detail-btn'); await page.waitForTimeout(300);
  await page.fill('#tll-more-detail [name=city]', 'Lisbon');
  await page.click('#tll-more-detail-btn'); await page.waitForTimeout(300);
  const sessB = await page.evaluate(() => sessionStorage.getItem('tllPhotosPanels'));
  await page.reload(); await page.waitForTimeout(600);
  let restored = await page.evaluate(() => document.querySelector('[name=city]').value);
  let s4 = await state(); let how = 'browser form restoration on reload';
  if (restored !== 'Lisbon') {
    how = 'value re-applied before DOMContentLoaded (init script), since Chromium did not restore the field on reload';
    await ctx.addInitScript(() => { document.addEventListener('DOMContentLoaded', () => { const c = document.querySelector('[name=city]'); if (c) c.value = 'Lisbon'; }); });
    await page.reload(); await page.waitForTimeout(600); restored = await page.evaluate(() => document.querySelector('[name=city]').value); s4 = await state();
  }
  rec(4, 'in 1280: a value in City plus a reload opens More detail', sessB === '{"detail":false,"share":false}' && restored === 'Lisbon' && opened(s4['tll-more-detail']), { sessBeforeReload: sessB, restored, how, afterReload: s4['tll-more-detail'] });
  await ctx.close();
}

// ---------------------------------------------------------------- check 5: file list
{
  const { page, ctx, errors } = await open('mock-in.html');
  await page.waitForTimeout(600);
  await page.setInputFiles('#photos-upload', files3); await page.waitForTimeout(500);
  const rows = () => page.evaluate(async () => {
    const list = document.getElementById('tll-photos-list'), count = document.getElementById('tll-photos-count'), errs = document.getElementById('tll-photos-file-errors');
    const li = Array.from(list.querySelectorAll('li'));
    const imgs = li.map(l => l.querySelector('img')); await Promise.all(imgs.filter(Boolean).map(i => i.complete ? null : new Promise(r => { i.onload = r; i.onerror = r; })));
    return { listHidden: list.hidden, listDisplay: getComputedStyle(list).display, rows: li.map(l => ({ cls: l.className, thumb: !!l.querySelector('.tll-photos-thumb'), img: l.querySelector('img') ? l.querySelector('img').naturalWidth : null, blob: l.querySelector('img') ? l.querySelector('img').src.slice(0, 5) : null, name: l.querySelector('.tll-photos-name').textContent, size: l.querySelector('.tll-photos-size').textContent, remove: l.querySelector('button.tll-photos-remove').textContent, aria: l.querySelector('button.tll-photos-remove').getAttribute('aria-label'), h: Math.round(l.getBoundingClientRect().height) })),
      count: count.textContent, countHidden: count.hidden, files: document.getElementById('photos-upload').files.length, fileErrs: Array.from(errs.querySelectorAll('p')).map(p => p.textContent) };
  });
  const r1 = await rows();
  rec(5, 'in 1280: three JPEGs render three rows with thumbnail, name, size, Remove (aria-label) and "3 of 12 chosen."',
    r1.rows.length === 3 && r1.rows.every((r, i) => r.thumb && r.img > 0 && r.blob === 'blob:' && r.name === `photo-${i + 1}.jpg` && /^\d+(\.\d+)? MB$/.test(r.size) && r.remove === 'Remove' && r.aria === `Remove photo-${i + 1}.jpg`) && r1.count === '3 of 12 chosen.' && !r1.countHidden && !r1.listHidden && r1.files === 3, r1);
  await page.click('#tll-photos-list li:first-child button.tll-photos-remove'); await page.waitForTimeout(200);
  const r2 = await rows();
  rec(5, 'in 1280: Remove rebuilds the FileList (2 files, 2 rows, "2 of 12 chosen.")', r2.files === 2 && r2.rows.length === 2 && r2.rows[0].name === 'photo-2.jpg' && r2.count === '2 of 12 chosen.', r2);
  await page.setInputFiles('#photos-upload', [dir + 'fixtures/not-a-photo.png']); await page.waitForTimeout(300);
  const r3 = await rows();
  rec(5, 'in 1280: a .png is rejected with the exact message and the kept files stay', r3.fileErrs.length === 1 && r3.fileErrs[0] === 'not-a-photo.png is not a JPG or WebP. Try the original from your Photos app.' && r3.files === 2 && r3.rows.length === 2 && r3.count === '2 of 12 chosen.', r3);
  await page.reload(); await page.waitForTimeout(600);
  await page.setInputFiles('#photos-upload', files13); await page.waitForTimeout(700);
  const r4 = await rows();
  rec(5, 'in 1280: a 13-file set keeps 12 and shows the exact message', r4.files === 12 && r4.rows.length === 12 && r4.count === '12 of 12 chosen.' && r4.fileErrs.length === 1 && r4.fileErrs[0] === "That's more than 12. We kept the first 12 and left the rest for next time.", { files: r4.files, rows: r4.rows.length, count: r4.count, fileErrs: r4.fileErrs, lastRow: r4.rows[11] && r4.rows[11].name });
  rec(1, 'in 1280 (file list run): no page errors', errors.length === 0, errors);
  await ctx.close();
}

// ---------------------------------------------------------------- check 6: empty submit
{
  const { page, ctx, net, navs, errors } = await open('mock-in.html');
  await page.waitForTimeout(600);
  const netBefore = net.length, navBefore = navs.length, urlBefore = page.url();
  await page.click('input[type=submit]'); await page.waitForTimeout(400);
  const s6 = await page.evaluate(() => {
    const g = id => { const e = document.getElementById(id); return e ? { text: e.textContent, hidden: e.hidden, display: getComputedStyle(e).display, color: getComputedStyle(e).color, cls: e.className } : null; };
    const form = document.querySelector('form[data-tll-form="share-photos"]'); const inv = Array.from(form.querySelectorAll('[aria-invalid=true]')).map(e => e.name);
    const ae = document.activeElement;
    return { errs: { photos: g('tll-err-photos'), country: g('tll-err-country'), year: g('tll-err-year'), rights: g('tll-err-rights'), license: g('tll-err-license'), people: g('tll-err-people') }, invalid: inv,
      invalidLabels: Array.from(form.querySelectorAll('.is-invalid')).map(e => e.className.split(' ').slice(0, 2).join('.')), focus: ae ? ae.tagName + '#' + ae.id + '.' + ae.className.split(' ')[0] : null, focusIsDrop: ae === document.getElementById('photos-upload') || ae === document.querySelector('label.tll-photos-drop'),
      status: form.querySelector('.tll-pen-status').textContent, statusRole: form.querySelector('.tll-pen-status').getAttribute('role'), wfRuns: window.__wfHandlerRuns, noValidate: form.noValidate, describedBy: form.querySelector('[name=country]').getAttribute('aria-describedby') };
  });
  const shown = Object.entries(s6.errs).filter(([k, v]) => v && !v.hidden && v.text).map(([k]) => k);
  rec(6, 'in 1280: empty submit is blocked in the capture phase (no navigation, no Webflow handler, no request)', page.url() === urlBefore && navs.length === navBefore && net.length === netBefore && s6.wfRuns === 0, { url: page.url(), navsAfter: navs.slice(navBefore), netAfter: net.slice(netBefore), wfRuns: s6.wfRuns });
  rec(6, 'in 1280: inline errors with the exact strings, aria-invalid on the controls, focus on the drop zone input, status count',
    s6.errs.photos.text === 'Add at least one photo.' && s6.errs.country.text === 'Tell us the country, at least.' && s6.errs.rights.text === 'Tick this one to send.' && s6.errs.license.text === 'Tick this one to send.' && s6.errs.people.text === 'Tick this one to send.'
    && s6.errs.year.hidden && shown.length === 5 && ['photos', 'country', 'agree-rights', 'agree-licence', 'agree-people'].every(n => s6.invalid.includes(n)) && s6.invalid.length === 5 && s6.focusIsDrop && s6.status === '5 things to fix above.' && s6.statusRole === 'status' && s6.describedBy === 'tll-err-country',
    Object.assign({ shown, expectedStatus: '5 things to fix above. (year is optional, so five, not six)' }, s6));
  // a bad year makes six; then fixing the country clears one
  await page.click('#tll-more-detail-btn'); await page.waitForTimeout(300);
  await page.fill('#tll-more-detail [name=year]', '99'); await page.click('input[type=submit]'); await page.waitForTimeout(300);
  const s6b = await page.evaluate(() => ({ year: document.getElementById('tll-err-year').textContent, yearHidden: document.getElementById('tll-err-year').hidden, status: document.querySelector('.tll-pen-status').textContent, yearInvalid: document.querySelector('[name=year]').getAttribute('aria-invalid') }));
  await page.fill('[name=country]', 'Portugal'); await page.waitForTimeout(200);
  const s6c = await page.evaluate(() => ({ country: document.getElementById('tll-err-country').hidden, text: document.getElementById('tll-err-country').textContent, invalid: document.querySelector('[name=country]').getAttribute('aria-invalid'), labelInvalid: document.querySelector('[name=country]').closest('label').classList.contains('is-invalid'), status: document.querySelector('.tll-pen-status').textContent }));
  rec(6, 'in 1280: a bad year adds its exact error ("6 things to fix above."); fixing the country clears its error and the count', s6b.year === 'A four-digit year. Guessing is allowed.' && !s6b.yearHidden && s6b.status === '6 things to fix above.' && s6b.yearInvalid === 'true' && s6c.country && s6c.text === '' && s6c.invalid === null && !s6c.labelInvalid && s6c.status === '5 things to fix above.', { afterBadYear: s6b, afterCountryFix: s6c });
  // singular
  await page.setInputFiles('#photos-upload', files3.slice(0, 1)); await page.check('[name=agree-rights]'); await page.check('[name=agree-licence]'); await page.fill('#tll-more-detail [name=year]', '2024'); await page.waitForTimeout(200);
  await page.click('input[type=submit]'); await page.waitForTimeout(300);
  const s6d = await page.evaluate(() => ({ status: document.querySelector('.tll-pen-status').textContent, focus: document.activeElement.name, wfRuns: window.__wfHandlerRuns }));
  await page.check('[name=agree-people]'); await page.waitForTimeout(200);
  const s6e = await page.evaluate(() => ({ status: document.querySelector('.tll-pen-status').textContent }));
  rec(6, 'in 1280: singular "One thing to fix above.", focus on the failing promise; the footnote returns when the last error clears', s6d.status === 'One thing to fix above.' && s6d.focus === 'agree-people' && s6d.wfRuns === 0 && s6e.status === 'A human looks at every photo before it goes up. Changed your mind later? Write to hello@thatlayover.life and we take it down.', { s6d, s6e });
  // everything valid: the capture check lets the submit through to the (mock) Webflow handler
  await page.click('input[type=submit]'); await page.waitForTimeout(300);
  const s6f = await page.evaluate(() => ({ wfRuns: window.__wfHandlerRuns, status: document.querySelector('.tll-pen-status').textContent, invalid: document.querySelectorAll('[aria-invalid=true]').length }));
  rec(6, 'in 1280: a valid form reaches the Webflow handler (mock) once', s6f.wfRuns === 1 && s6f.invalid === 0, Object.assign({ url: page.url() }, s6f));
  rec(1, 'in 1280 (submit run): no page errors', errors.length === 0, errors);
  await ctx.close();
}

// ---------------------------------------------------------------- check 7: summary line
{
  const { page, ctx } = await open('mock-in.html');
  await page.waitForTimeout(600);
  const sum = () => page.evaluate(() => { const s = document.getElementById('tll-photos-summary'); return { hidden: s.hidden, text: s.textContent, display: getComputedStyle(s).display, prev: s.previousElementSibling && s.previousElementSibling.id, parent: s.parentElement.className }; });
  const a = await sum();
  await page.setInputFiles('#photos-upload', files3.slice(0, 1)); await page.waitForTimeout(300); const b = await sum();
  await page.fill('[name=country]', 'Portugal'); await page.waitForTimeout(100); const c = await sum();
  await page.setInputFiles('#photos-upload', files3.slice(1, 2)); await page.waitForTimeout(300); const d = await sum();
  await page.click('#tll-more-detail-btn'); await page.waitForTimeout(300);
  await page.fill('#tll-more-detail [name=city]', 'Lisbon'); const e = await sum();
  await page.fill('#tll-more-detail [name=year]', '2024'); const f = await sum();
  await page.click('#tll-photos-list li:first-child button.tll-photos-remove'); await page.waitForTimeout(200); const g = await sum();
  await page.fill('[name=country]', ''); const h = await sum();
  rec(7, 'in 1280: summary appears only with a photo and a country, exact singular and plural wording', a.hidden && b.hidden && c.text === '1 photo from Portugal.' && !c.hidden && d.text === '2 photos from Portugal.' && e.text === '2 photos from Lisbon, Portugal.' && f.text === '2 photos from Lisbon, Portugal, 2024.' && g.text === '1 photo from Lisbon, Portugal, 2024.' && h.hidden && c.prev === 'tll-promises-label' && c.parent === 'tll-pen-promises', { a, b, c, d, e, f, g, h });
  await ctx.close();
}

// ---------------------------------------------------------------- check 8 and 9: credited-as line, heading clicks
{
  const { page, ctx } = await open('mock-in.html');
  await page.waitForTimeout(1200);
  const cred = () => page.evaluate(() => { const c = document.getElementById('tll-credited-as'); return { text: c.text || c.textContent, hidden: c.hidden, display: getComputedStyle(c).display, prevIsCreditLabel: !!(c.previousElementSibling && c.previousElementSibling.querySelector('input[name=credit-mode]')), reads: window.__msReads, writes: window.__msWrites } });
  const c0 = await cred();
  await page.check('input[name=credit-mode][value=pen-name]'); const c1 = await cred();
  await page.check('input[name=credit-mode][value=anonymous]'); const c2 = await cred();
  await page.check('input[name=credit-mode][value=named]'); const c3 = await cred();
  rec(8, 'in 1280: "Credited as Nancy Carleton, from your account." while My name is checked; hidden for the other two; one read-only Memberstack call', c0.text === 'Credited as Nancy Carleton, from your account.' && !c0.hidden && c0.display !== 'none' && c1.hidden && c1.display === 'none' && c2.hidden && !c3.hidden && c0.reads === 1 && c0.writes.length === 0 && c0.prevIsCreditLabel, { c0, c1, c2, c3 });
  // check 9
  await page.check('input[name=credit-mode][value=pen-name]');
  const creditHeading = page.locator('label.tll-pen-field:has(input[name=credit-mode]) > span.tll-pen-label');
  await creditHeading.click(); await page.waitForTimeout(100);
  const n1 = await page.evaluate(() => ({ named: document.querySelector('input[name=credit-mode][value=named]').checked, pen: document.querySelector('input[name=credit-mode][value=pen-name]').checked, heading: document.querySelector('label.tll-pen-field:has(input[name=credit-mode]) > span.tll-pen-label').textContent }));
  await page.click('#tll-more-share-btn'); await page.waitForTimeout(300);
  const shareHeading = page.locator('label.tll-pen-field:has(input[name=syndication-social]) > span.tll-pen-label');
  await shareHeading.click(); await page.waitForTimeout(100);
  const n2 = await page.evaluate(() => ({ checked: ['syndication-social', 'syndication-rotation', 'syndication-press'].map(n => document.querySelector('[name="' + n + '"]').checked), heading: document.querySelector('label.tll-pen-field:has(input[name=syndication-social]) > span.tll-pen-label').textContent, rows: Array.from(document.querySelectorAll('label.tll-pen-checkbox .w-form-label')).map(s => s.textContent) }));
  // and a click on a syndication row still ticks it
  await page.click('label.tll-pen-checkbox .w-form-label >> nth=0'); await page.waitForTimeout(100);
  const n3 = await page.evaluate(() => document.querySelector('[name=syndication-social]').checked);
  rec(9, 'in 1280: clicking the credit heading and the syndication heading text ticks nothing; a row click still works', !n1.named && n1.pen && n1.heading === 'Credit' && n2.checked.every(x => x === false) && n2.heading === 'Unticked means the Lounge only. Say yes to any of these.' && n3 === true, { n1, n2, n3 });
  await ctx.close();
  // fallback without Memberstack
  const o = await open('mock-in.html', { query: '?noms' });
  await o.page.waitForTimeout(1500);
  const cf = await o.page.evaluate(() => ({ ms: typeof window.$memberstackDom, text: document.getElementById('tll-credited-as').textContent, hidden: document.getElementById('tll-credited-as').hidden }));
  rec(8, 'in 1280 (?noms): with $memberstackDom undefined the line reads the fallback', cf.ms === 'undefined' && cf.text === 'Credited with the name on your account.' && !cf.hidden, cf);
  rec(1, 'in 1280 (?noms): no page errors', o.errors.length === 0, o.errors);
  await o.ctx.close();
}

// ---------------------------------------------------------------- check 10: success focus
{
  const { page, ctx } = await open('mock-in.html');
  await page.waitForTimeout(600);
  const s10 = await page.evaluate(async () => {
    const done = document.querySelector('.w-form-done'); const before = { tabindex: done.getAttribute('tabindex'), display: getComputedStyle(done).display, text: done.textContent };
    done.style.display = 'block'; await new Promise(r => setTimeout(r, 150));
    return { before, focused: document.activeElement === done, active: document.activeElement.className, display: getComputedStyle(done).display, bg: getComputedStyle(done).backgroundColor, radius: getComputedStyle(done).borderRadius, outline: getComputedStyle(done).outlineStyle };
  });
  rec(10, 'in 1280: showing .w-form-done (style display:block) moves focus to it', s10.focused && s10.before.tabindex === '-1' && s10.before.text === 'Got them. A human looks at every photo before it goes up, so give us a little time. Changed your mind? Write to hello@thatlayover.life and we take it down, before or after it is published.', s10);
  await ctx.close();
}

// ---------------------------------------------------------------- check 11: signed out (both viewports), plus column width parity
const colIn = {};
for (const width of [1280, 390]) {
  const o = await open('mock-in.html', { width, height: width === 1280 ? 900 : 844 }); await o.page.waitForTimeout(500);
  colIn[width] = await o.page.evaluate(() => { const c = document.querySelector('.tll-photos-section .tll-container'); const r = c.getBoundingClientRect(); return { width: Math.round(r.width), left: Math.round(r.left), pad: getComputedStyle(c).paddingLeft, inner: Math.round(r.width - parseFloat(getComputedStyle(c).paddingLeft) * 2) }; });
  await o.ctx.close();
  const { page, ctx, errors } = await open('mock-out.html', { width, height: width === 1280 ? 900 : 844 });
  await page.waitForTimeout(4000);
  const rej = await page.evaluate(() => window.__rej);
  rec(1, `out ${width}: no pageerror, console error or unhandled rejection after 4s`, errors.length === 0 && rej.length === 0, { errors, rej });
  await page.screenshot({ path: dir + `out-${width}-fold.png` }); await page.screenshot({ path: dir + `out-${width}-full.png`, fullPage: true });
  const s11 = await page.evaluate(() => {
    const anon = document.querySelector('[data-ms-content=anonymous]'), mem = document.querySelector('[data-ms-content=members]');
    const c = anon.querySelector('.tll-container'); const q = s => c.querySelector(s);
    const rows = Array.from(c.querySelectorAll('.tll-photos-preview-row'));
    const seq = [document.querySelector('[data-mock=nav]'), q('.tll-eyebrow-rose'), q('h2'), q('p.tll-lede'), ...rows, q('.tll-photos-public-line'), q('a.tll-btn-primary'), q('a.tll-btn-ghost'), q('.tll-photos-age')];
    let ordered = seq.every(Boolean);
    for (let i = 1; i < seq.length && ordered; i++) if (!(seq[i - 1].compareDocumentPosition(seq[i]) & Node.DOCUMENT_POSITION_FOLLOWING)) ordered = false;
    const r = c.getBoundingClientRect(); const bb = q('a.tll-btn-primary').getBoundingClientRect(), gb = q('a.tll-btn-ghost').getBoundingClientRect();
    return { ordered, memDisplay: getComputedStyle(mem).display, anonDisplay: getComputedStyle(anon).display, eyebrow: q('.tll-eyebrow-rose').textContent, h2: q('h2').textContent, em: q('h2 em') && q('h2 em').textContent, lede: q('p.tll-lede').textContent,
      rows: rows.map(x => [x.children.length, x.children[0].textContent, x.children[1].textContent, x.children[0].tagName, x.children[1].tagName]), line: q('.tll-photos-public-line').textContent, btns: [q('a.tll-btn-primary').textContent, q('a.tll-btn-ghost').textContent], hrefs: [q('a.tll-btn-primary').getAttribute('href'), q('a.tll-btn-ghost').getAttribute('href')], age: q('.tll-photos-age').textContent,
      col: { width: Math.round(r.width), left: Math.round(r.left), pad: getComputedStyle(c).paddingLeft, inner: Math.round(r.width - parseFloat(getComputedStyle(c).paddingLeft) * 2) }, btnH: [Math.round(bb.height), Math.round(gb.height)], sideBySide: Math.abs(bb.top - gb.top) < 2, stacked: gb.top >= bb.bottom, loginBg: getComputedStyle(q('a.tll-btn-primary')).backgroundColor, ghostBorder: getComputedStyle(q('a.tll-btn-ghost')).borderTopColor,
      h2Font: getComputedStyle(q('h2')).fontFamily, h2Size: getComputedStyle(q('h2')).fontSize, h1SizeExpected: null, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, ageSize: getComputedStyle(q('.tll-photos-age')).fontSize, wordSize: getComputedStyle(rows[0].children[0]).fontSize };
  });
  const wantRows = [['Drop', 'Up to 12 photos, straight from your camera roll.'], ['Where', 'A country is enough. Add a caption if you feel like it.'], ['Send', 'Three promises about rights, your credit the way you want it, and a human looks at it before it goes up.']];
  rec(11, `out ${width}: gate order, copy, buttons, age line; members block hidden; same column as signed in`,
    s11.ordered && s11.memDisplay === 'none' && s11.anonDisplay !== 'none' && s11.eyebrow === 'The Layover Lounge' && s11.h2 === 'Sign in to drop your photos.' && s11.em === 'drop your photos' && s11.lede === 'A photo, not an essay. Three short steps, and a human on the other end.'
    && s11.rows.length === 3 && s11.rows.every((r, i) => r[0] === 2 && r[1] === wantRows[i][0] && r[2] === wantRows[i][1]) && s11.line === 'Every photo in the Lounge was taken by a member and sent with their permission.' && s11.btns[0] === 'Log in' && s11.btns[1] === 'Join the Travelers' && s11.age === 'Free. Travelers are 16 and older.'
    && s11.col.width === colIn[width].width && s11.col.inner === colIn[width].inner && s11.btnH.every(h => h >= 48) && (width === 1280 ? s11.sideBySide : s11.stacked) && s11.loginBg === 'rgb(214, 56, 89)' && s11.scrollWidth === s11.clientWidth && /^"?Playfair Display"?/.test(s11.h2Font),
    Object.assign({ signedInColumn: colIn[width] }, s11));
  await ctx.close();
}

// ---------------------------------------------------------------- check 12b: reduced motion
{
  const { page, ctx } = await open('mock-in.html', { reduced: true });
  await page.waitForTimeout(600);
  await page.setInputFiles('#photos-upload', files3.slice(0, 2)); await page.waitForTimeout(400);
  const rm = await page.evaluate(() => {
    const cs = e => e ? { transition: getComputedStyle(e).transitionProperty, dur: getComputedStyle(e).transitionDuration, anim: getComputedStyle(e).animationName, transform: getComputedStyle(e).transform } : null;
    return { matches: matchMedia('(prefers-reduced-motion: reduce)').matches, button: cs(document.querySelector('input[type=submit]')), row: cs(document.querySelector('#tll-photos-list li')), panel: cs(document.getElementById('tll-more-detail')), panelInner: cs(document.querySelector('#tll-more-detail > div')), drop: cs(document.querySelector('label.tll-photos-drop')) };
  });
  const noTransform = c => c && !/transform/.test(c.transition) && !/transform/.test(c.anim);
  rec(12, 'in 1280 (reduced motion): no transform transition on the button, rows or panels', rm.matches && noTransform(rm.button) && noTransform(rm.row) && noTransform(rm.panel) && rm.row.anim === 'none', rm);
  await ctx.close();
}

// ---------------------------------------------------------------- CSS/script contract: the classes the script creates must be styled by the CSS block
{
  const { page, ctx } = await open('mock-in.html'); await page.waitForTimeout(600);
  const contract = await page.evaluate(() => {
    const css = document.getElementById('tll-photos-v3').textContent;
    const created = { 'tll-pen-panel': '#tll-more-detail', 'tll-pen-panel-inner': '#tll-more-detail > div', 'tll-pen-disclosure': '#tll-more-detail-btn', 'tll-pen-disclosure-help': '.tll-pen-disclosure-help', 'tll-pen-error': '#tll-err-country', 'tll-photos-row': '#tll-photos-list li', 'tll-photos-thumb': '.tll-photos-thumb', 'tll-photos-remove': '.tll-photos-remove', 'tll-photos-count': '#tll-photos-count', 'tll-credited-as': '#tll-credited-as', 'tll-photos-summary': '#tll-photos-summary', 'tll-pen-promises': '.tll-pen-promises' };
    const out = {};
    for (const [cls, sel] of Object.entries(created)) { const el = document.querySelector(sel); out[cls] = { inDom: !!el, domClass: el ? el.className : null, styledInCss: new RegExp('\\.' + cls + '(?![\\w-])').test(css) }; }
    const cssOnly = ['tll-photos-panel', 'tll-photos-panel-inner', 'tll-photos-disclosure', 'tll-photos-disclosure-help', 'tll-photos-chevron', 'tll-photos-item', 'tll-err', 'tll-photos-vh'].map(c => [c, !!document.querySelector('.' + c)]);
    const btn = document.getElementById('tll-more-detail-btn'); const b = getComputedStyle(btn);
    return { created: out, cssSelectorsWithNoElement: cssOnly, disclosureButton: { font: b.fontFamily, color: b.color, size: b.fontSize, h: Math.round(btn.getBoundingClientRect().height), chevron: !!btn.querySelector('.tll-photos-chevron'), before: getComputedStyle(btn, '::before').content, after: getComputedStyle(btn, '::after').content }, errColor: getComputedStyle(document.getElementById('tll-err-country')).color, petLabelVisible: (() => { const s = document.querySelector('[name="pets-along"]').closest('label').querySelector('.tll-pen-label'); const r = s.getBoundingClientRect(); return { text: s.textContent, w: Math.round(r.width), cls: s.className }; })() };
  });
  const bad = Object.entries(contract.created).filter(([k, v]) => !v.styledInCss).map(([k]) => k);
  rec(4, 'contract: every class the script creates has a rule in tll-photos-v3', bad.length === 0, Object.assign({ unstyled: bad }, contract));
  await ctx.close();
}

// ---------------------------------------------------------------- screenshot follow-ups: clipped opt-in rows at 390, centered gate text
{
  const { page, ctx } = await open('mock-in.html', { width: 390, height: 844 }); await page.waitForTimeout(600);
  await page.click('#tll-more-share-btn'); await page.waitForTimeout(300);
  const clip = await page.evaluate(() => {
    const c = document.querySelector('.tll-photos-section .tll-container').getBoundingClientRect();
    const rows = Array.from(document.querySelectorAll('label.tll-pen-checkbox')).map(l => { const s = l.querySelector('.w-form-label'); const r = s.getBoundingClientRect(); const cs = getComputedStyle(s); const pcs = getComputedStyle(s.parentElement);
      return { text: s.textContent, right: Math.round(r.right), containerRight: Math.round(c.right - parseFloat(getComputedStyle(document.querySelector('.tll-photos-section .tll-container')).paddingRight)), overflow: Math.round(r.right - c.right), whiteSpace: cs.whiteSpace, parentWhiteSpace: pcs.whiteSpace, rowH: Math.round(l.getBoundingClientRect().height) }; });
    const find = (el, prop) => { const hits = []; for (const sh of document.styleSheets) { let rules; try { rules = sh.cssRules; } catch (e) { continue; } const walk = rs => { for (const r of rs) { if (r.cssRules && !(r instanceof CSSStyleRule)) walk(r.cssRules); else if (r.selectorText && r.style && r.style[prop]) { try { if (el.matches(r.selectorText)) hits.push({ sheet: (sh.ownerNode && sh.ownerNode.id) || sh.href || 'inline', sel: r.selectorText, val: r.style[prop], important: r.style.getPropertyPriority(prop) }); } catch (e) {} } } }; walk(rules); } return hits; };
    const span = document.querySelector('label.tll-pen-checkbox .w-form-label');
    const chain = []; let n = span; while (n && !n.classList.contains('tll-container')) { const cs = getComputedStyle(n); chain.push({ el: n.tagName + '.' + String(n.className).split(' ').slice(0, 2).join('.'), w: Math.round(n.getBoundingClientRect().width), display: cs.display, flex: cs.flex, minWidth: cs.minWidth, width: cs.width, whiteSpace: cs.whiteSpace, overflow: cs.overflow, flexWrap: cs.flexWrap }); n = n.parentElement; }
    const wc = span.parentElement;
    return { rows, chain, flexRulesOnWCheckbox: find(wc, 'flex').concat(find(wc, 'flex-shrink'), find(wc, 'flex-basis'), find(wc, 'width')), panelHasRule: !!document.querySelector('.tll-photos-panel'), whiteSpaceRules: find(span, 'white-space').concat(find(span.parentElement, 'white-space')), docScroll: document.documentElement.scrollWidth, overflowRules: find(document.querySelector('main'), 'overflow-x').concat(find(document.querySelector('.tll-photos-section'), 'overflow-x'), find(document.querySelector('.tll-photos-section'), 'overflow'), find(document.querySelector('main'), 'overflow')) };
  });
  rec(13, 'in 390: the three opt-in row labels fit inside the column (not clipped)', clip.rows.every(r => r.overflow <= 0), clip);
  await ctx.close();
  const o = await open('mock-out.html'); await o.page.waitForTimeout(600);
  const al = await o.page.evaluate(() => {
    const find = (el, prop) => { const hits = []; for (const sh of document.styleSheets) { let rules; try { rules = sh.cssRules; } catch (e) { continue; } const walk = rs => { for (const r of rs) { if (r.cssRules && !(r instanceof CSSStyleRule)) walk(r.cssRules); else if (r.selectorText && r.style && r.style[prop]) { try { if (el.matches(r.selectorText)) hits.push({ sheet: (sh.ownerNode && sh.ownerNode.id) || sh.href || 'inline', sel: r.selectorText, val: r.style[prop] }); } catch (e) {} } } }; walk(rules); } return hits; };
    const c = document.querySelector('[data-ms-content=anonymous] .tll-container'); const sec = c.parentElement;
    return { containerAlign: getComputedStyle(c).textAlign, rowAlign: getComputedStyle(document.querySelector('.tll-photos-preview-text')).textAlign, ledeAlign: getComputedStyle(document.querySelector('[data-ms-content=anonymous] p.tll-lede')).textAlign, rules: find(c, 'text-align').concat(find(sec, 'text-align'), find(c.querySelector('.inline-div-0'), 'text-align'), find(c.querySelector('.inline-div-0'), 'justify-content')), signedInAlign: null };
  });
  await o.ctx.close();
  const o2 = await open('mock-in.html'); await o2.page.waitForTimeout(300);
  al.signedInAlign = await o2.page.evaluate(() => getComputedStyle(document.querySelector('.tll-photos-section .tll-container')).textAlign); await o2.ctx.close();
  rec(11, 'out 1280: gate column text is left-aligned like the signed-in column', (al.rowAlign === 'start' || al.rowAlign === 'left') && al.containerAlign === al.signedInAlign, al);
}

// ---------------------------------------------------------------- check 14: syntax
{
  let js = 'ok'; try { execSync(`/opt/node22/bin/node --check ${V3}tll-photos-form-v1.js`, { stdio: 'pipe' }); } catch (e) { js = String(e.stderr || e); }
  const css = fs.readFileSync(V3 + 'tll-photos-v3.css', 'utf8');
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""');
  const opens = (stripped.match(/{/g) || []).length, closes = (stripped.match(/}/g) || []).length;
  let depth = 0, minDepth = 0; for (const ch of stripped) { if (ch === '{') depth++; else if (ch === '}') depth--; if (depth < minDepth) minDepth = depth; }
  // the inline footer blocks must equal the standalone files
  const htmlCss = fs.readFileSync(V3 + 'tll-photos-v3.html', 'utf8'), htmlJs = fs.readFileSync(V3 + 'tll-photos-form-v1.html', 'utf8');
  const cssInHtml = htmlCss.replace(/^<style id="tll-photos-v3">/, '').replace(/<\/style>\s*$/, '') === css, jsInHtml = htmlJs.replace(/^<script id="tll-photos-form-v1">/, '').replace(/<\/script>\s*$/, '') === fs.readFileSync(V3 + 'tll-photos-form-v1.js', 'utf8');
  const footerNew = fs.readFileSync(V3 + 'page-footer-new.html', 'utf8'); const footerOk = footerNew === htmlCss + '\n' + htmlJs && !/Continuous card border/.test(footerNew) && !/^<style id="tll-form-fix">/.test(footerNew);
  // a parse through the browser: count rules the engine accepted vs rule-looking blocks in the source
  const { page, ctx } = await open('mock-in.html'); await page.waitForTimeout(300);
  const parsed = await page.evaluate(() => { const s = document.getElementById('tll-photos-v3'); let n = 0, groups = 0; const walk = r => { for (const x of r) { if (x instanceof CSSStyleRule || x instanceof CSSKeyframeRule) n++; else if (x.cssRules) { groups++; walk(x.cssRules); } } }; walk(s.sheet.cssRules); return { rules: n, groups, topLevel: s.sheet.cssRules.length }; });
  await ctx.close();
  const srcRules = (stripped.match(/[^{}]+{[^{}]*}/g) || []).length;
  rec(14, 'node --check on the script; CSS braces balanced; the browser accepted every rule; footer file equals the two blocks', js === 'ok' && opens === closes && minDepth === 0 && parsed.rules === srcRules && cssInHtml && jsInHtml && footerOk, { nodeCheck: js, opens, closes, minDepth, parsed, srcRules, cssInHtml, jsInHtml, footerOk, stylelint: 'not installed' });
}

await browser.close();
const shots = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort().map(f => dir + f);
const out = { passed: results.every(r => r.pass), results, screenshots: shots };
fs.writeFileSync(dir + 'results.json', JSON.stringify(out, null, 1));
for (const r of results) console.log((r.pass ? 'PASS' : 'FAIL') + ' [' + r.check + '] ' + r.name + (r.pass ? '' : ' :: ' + r.evidence.slice(0, 1500)));
console.log('passed:', out.passed, 'failures:', results.filter(r => !r.pass).length, 'of', results.length);
