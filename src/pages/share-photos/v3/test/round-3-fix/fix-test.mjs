// Focused re-test of the three Fix-stage findings on /share-photos v3 (thumbnail sizing, year error inside the closed panel, drag-and-drop clearing the photos error).
// Same offline harness as test.mjs: mock-in.html served through page.route on http://tll.test/, every other request stubbed.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const dir = new URL('.', import.meta.url).pathname;
const results = [];
function rec(check, name, pass, evidence) { results.push({ check, name, pass: !!pass, evidence }); }
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
async function open(file, { width = 1280, height = 900 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage(); const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + String(e)));
  await page.route('**/*', async route => {
    const url = route.request().url();
    if (url.startsWith('http://tll.test/')) {
      const p = new URL(url).pathname;
      if (p.endsWith('.css')) return route.fulfill({ body: fs.readFileSync(dir + p.slice(1)), contentType: 'text/css' });
      if (p.endsWith('.html')) return route.fulfill({ body: fs.readFileSync(dir + p.slice(1)), contentType: 'text/html' });
      return route.fulfill({ status: 204, body: '' });
    }
    if (/cookieconsent\.umd\.js/.test(url)) return route.fulfill({ contentType: 'application/javascript', body: 'window.CookieConsent={run(){},show(){},hide(){},acceptCategory(){},acceptedCategory(){return false},getCookie(){return {}},getUserPreferences(){return {acceptedCategories:[]}},validConsent(){return false}};' });
    if (/\.js(\?|$)/.test(url)) return route.fulfill({ contentType: 'application/javascript', body: '' });
    if (/\.css(\?|$)|fonts\.googleapis/.test(url)) return route.fulfill({ contentType: 'text/css', body: '' });
    return route.fulfill({ status: 204, body: '' });
  });
  await page.goto('http://tll.test/' + file); await page.waitForTimeout(600);
  return { page, ctx, errors };
}
// in-page helpers: build JPEG Files from a canvas, feed them through the picker path (change event) or a synthetic drop
const setDetail = (page, open) => page.evaluate(o => { const b = document.getElementById('tll-more-detail-btn'); if ((b.getAttribute('aria-expanded') === 'true') !== o) b.click(); }, open);
const mkFiles = `async function mkFiles(specs){ const out=[]; for(const [w,h,name] of specs){ const c=document.createElement('canvas'); c.width=w; c.height=h; const g=c.getContext('2d'); g.fillStyle='#C8325B'; g.fillRect(0,0,w,h); g.fillStyle='#067A79'; g.fillRect(0,0,w/2,h/2); const b=await new Promise(r=>c.toBlob(r,'image/jpeg',.8)); out.push(new File([b],name,{type:'image/jpeg',lastModified:Date.now()+out.length})); } return out; }`;
const waitImgs = `async function waitImgs(){ const imgs=[...document.querySelectorAll('#tll-photos-list img')]; await Promise.all(imgs.map(i=>i.complete?null:new Promise(r=>{i.onload=r;i.onerror=r;}))); await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))); }`;

// ---------------------------------------------------------------- finding 1: thumbnails sized to the tile, both widths
for (const width of [1280, 390]) {
  const { page, ctx, errors } = await open('mock-in.html', { width, height: width === 1280 ? 900 : 844 });
  const r = await page.evaluate(`(async()=>{ ${mkFiles} ${waitImgs}
    const input=document.getElementById('photos-upload'); const files=await mkFiles([[300,900,'tall.jpg'],[1200,300,'wide.jpg'],[1600,1200,'big.jpg'],[96,64,'small.jpg']]);
    const dt=new DataTransfer(); files.forEach(f=>dt.items.add(f)); input.files=dt.files; input.dispatchEvent(new Event('change',{bubbles:true}));
    await new Promise(r=>setTimeout(r,400)); await waitImgs();
    const rows=[...document.querySelectorAll('#tll-photos-list li')];
    return rows.map(li=>{ const th=li.querySelector('.tll-photos-thumb'), img=th.querySelector('img'), name=li.querySelector('.tll-photos-name'), size=li.querySelector('.tll-photos-size');
      const tr=th.getBoundingClientRect(), ir=img.getBoundingClientRect(), lr=li.getBoundingClientRect(), nr=name.getBoundingClientRect(), sr=size.getBoundingClientRect(); const cs=getComputedStyle(th), ci=getComputedStyle(img);
      const same=(a,b)=>Math.abs(a-b)<=0.5;
      return { name:name.textContent, natural:[img.naturalWidth,img.naturalHeight], tile:[Math.round(tr.width),Math.round(tr.height)], img:[Math.round(ir.width),Math.round(ir.height)],
        imgEqualsTile: same(ir.width,tr.width)&&same(ir.height,tr.height)&&same(ir.left,tr.left)&&same(ir.top,tr.top), imgInsideRow: ir.bottom<=lr.bottom+0.5&&ir.right<=lr.right+0.5,
        rowH: Math.round(lr.height), thumbOverflow: cs.overflow, objectFit: ci.objectFit, imgDisplay: ci.display,
        textClearOfImg: nr.left>=ir.right-0.5 && sr.left>=ir.right-0.5, nameVisible: nr.width>0&&nr.height>0 };
    });
  })()`);
  rec('F1', `in ${width}: four previews (300x900, 1200x300, 1600x1200, 96x64) each paint exactly inside the 64x64 tile; name and size sit clear of the image`,
    r.length === 4 && r.every(x => x.imgEqualsTile && x.imgInsideRow && x.tile[0] === 64 && x.tile[1] === 64 && x.thumbOverflow === 'hidden' && x.objectFit === 'cover' && x.imgDisplay === 'block' && x.textClearOfImg && x.nameVisible && x.rowH >= 66 && x.rowH <= 70 && x.natural[0] > 0), r);
  await page.screenshot({ path: dir + `thumbs-${width}.png`, clip: await page.evaluate(() => { const r = document.getElementById('tll-photos-list').getBoundingClientRect(); return { x: Math.max(0, r.left - 8), y: Math.max(0, r.top - 8), width: r.width + 16, height: r.height + 16 }; }) });
  rec('F1', `in ${width}: no page errors`, errors.length === 0, errors);
  await ctx.close();
}

// ---------------------------------------------------------------- findings 2 and 4: a bad year inside the closed panel, other fields failing too
{
  const { page, ctx, errors } = await open('mock-in.html');
  await page.click('#tll-more-detail-btn'); await page.waitForTimeout(300);
  await page.fill('#tll-more-detail [name=year]', '99');
  await page.click('#tll-more-detail-btn'); await page.waitForTimeout(300);
  const before = await page.evaluate(() => ({ expanded: document.getElementById('tll-more-detail-btn').getAttribute('aria-expanded'), yearValue: document.querySelector('[name=year]').value }));
  await page.click('input[type=submit]'); await page.waitForTimeout(400);
  const s = await page.evaluate(() => {
    const vis = e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return !e.hidden && cs.visibility === 'visible' && cs.display !== 'none' && r.height > 0; };
    const spans = [...document.querySelectorAll('span.tll-pen-error')]; const visible = spans.filter(vis).map(x => x.id);
    const year = document.querySelector('[name=year]'); const ae = document.activeElement;
    const focusedFirst = ae && ae.name; year.focus(); const yearReachable = document.activeElement === year;
    return { expanded: document.getElementById('tll-more-detail-btn').getAttribute('aria-expanded'), panelOpen: document.getElementById('tll-more-detail').classList.contains('is-open'),
      panelVisibility: getComputedStyle(document.getElementById('tll-more-detail')).visibility, yearErr: document.getElementById('tll-err-year').textContent, yearErrVisible: vis(document.getElementById('tll-err-year')),
      yearInvalid: year.getAttribute('aria-invalid'), status: document.querySelector('.tll-pen-status').textContent, visibleErrors: visible, focusedFirst, yearReachable, session: sessionStorage.getItem('tllPhotosPanels') };
  });
  rec('F2', 'in 1280: year 99 inside the closed panel plus five other failures: the panel opens, the year error is visible and reachable, the count matches the visible errors, focus stays on the first failure (photos)',
    before.expanded === 'false' && before.yearValue === '99' && s.expanded === 'true' && s.panelOpen && s.panelVisibility === 'visible' && s.yearErr === 'A four-digit year. Guessing is allowed.' && s.yearErrVisible && s.yearInvalid === 'true'
    && s.status === '6 things to fix above.' && s.visibleErrors.length === 6 && s.visibleErrors.includes('tll-err-year') && s.focusedFirst === 'photos' && s.yearReachable, { before, after: s });
  // the year-first case still focuses the year itself
  await page.reload(); await page.waitForTimeout(600);
  await setDetail(page, true); await page.waitForTimeout(300);
  await page.fill('#tll-more-detail [name=year]', '99'); await page.fill('[name=country]', 'Portugal'); await page.check('[name=agree-rights]'); await page.check('[name=agree-licence]'); await page.check('[name=agree-people]');
  await page.evaluate(`(async()=>{ ${mkFiles} const input=document.getElementById('photos-upload'); const dt=new DataTransfer(); (await mkFiles([[200,150,'one.jpg']])).forEach(f=>dt.items.add(f)); input.files=dt.files; input.dispatchEvent(new Event('change',{bubbles:true})); })()`);
  await page.waitForTimeout(300);
  await setDetail(page, false); await page.waitForTimeout(300);
  await page.click('input[type=submit]'); await page.waitForTimeout(400);
  const s2 = await page.evaluate(() => ({ expanded: document.getElementById('tll-more-detail-btn').getAttribute('aria-expanded'), status: document.querySelector('.tll-pen-status').textContent, focus: document.activeElement && document.activeElement.name, wfRuns: window.__wfHandlerRuns }));
  rec('F2', 'in 1280: year as the only failure (panel closed before submit): panel opens, "One thing to fix above.", focus on the year, no post', s2.expanded === 'true' && s2.status === 'One thing to fix above.' && s2.focus === 'year' && s2.wfRuns === 0, s2);
  rec('F2', 'in 1280: no page errors', errors.length === 0, errors);
  await ctx.close();
}

// ---------------------------------------------------------------- finding 3: a drop clears the photos error; Remove keeps the state honest
{
  const { page, ctx, errors } = await open('mock-in.html');
  await page.click('input[type=submit]'); await page.waitForTimeout(400);
  const state = () => page.evaluate(() => { const e = document.getElementById('tll-err-photos'), p = document.getElementById('photos-upload'), z = document.querySelector('label.tll-photos-drop');
    return { errHidden: e.hidden, errText: e.textContent, invalid: p.getAttribute('aria-invalid'), describedBy: p.getAttribute('aria-describedby'), zoneInvalid: z.classList.contains('is-invalid'), dragover: z.classList.contains('is-dragover'),
      files: p.files.length, count: document.getElementById('tll-photos-count').textContent, listHidden: document.getElementById('tll-photos-list').hidden, rows: document.querySelectorAll('#tll-photos-list li').length, status: document.querySelector('.tll-pen-status').textContent }; });
  const a = await state();
  await page.evaluate(`(async()=>{ ${mkFiles} const z=document.querySelector('label.tll-photos-drop'); const dt=new DataTransfer(); (await mkFiles([[320,240,'dropped.jpg']])).forEach(f=>dt.items.add(f));
    z.dispatchEvent(new DragEvent('dragenter',{bubbles:true,cancelable:true,dataTransfer:dt})); z.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt})); z.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt})); })()`);
  await page.waitForTimeout(400);
  const b = await state();
  rec('F3', 'in 1280: after an empty submit, a dropped JPEG clears "Add at least one photo.", aria-invalid, aria-describedby and .is-invalid; the status drops to "4 things to fix above."',
    a.errText === 'Add at least one photo.' && !a.errHidden && a.invalid === 'true' && a.zoneInvalid && a.status === '5 things to fix above.'
    && b.files === 1 && b.rows === 1 && b.count === '1 of 12 chosen.' && b.errHidden && b.errText === '' && b.invalid === null && b.describedBy === null && !b.zoneInvalid && !b.dragover && b.status === '4 things to fix above.', { afterEmptySubmit: a, afterDrop: b });
  await page.click('#tll-photos-list li:first-child button.tll-photos-remove'); await page.waitForTimeout(200);
  const c = await state();
  await page.click('input[type=submit]'); await page.waitForTimeout(400);
  const d = await state();
  // a second drop onto the stale error (the reviewer's exact path) and then Remove with the error already clear
  await page.evaluate(`(async()=>{ ${mkFiles} const z=document.querySelector('label.tll-photos-drop'); const dt=new DataTransfer(); (await mkFiles([[320,240,'dropped-2.jpg']])).forEach(f=>dt.items.add(f)); z.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt})); })()`);
  await page.waitForTimeout(400);
  const e = await state();
  rec('F3', 'in 1280: Remove empties the list without inventing an error (errors appear on submit only); the next submit shows it again; the next drop clears it again',
    c.files === 0 && c.rows === 0 && c.listHidden && c.errHidden && c.status === '4 things to fix above.' && d.files === 0 && !d.errHidden && d.errText === 'Add at least one photo.' && d.status === '5 things to fix above.'
    && e.files === 1 && e.errHidden && e.invalid === null && !e.zoneInvalid && e.status === '4 things to fix above.', { afterRemove: c, afterSecondSubmit: d, afterSecondDrop: e });
  // the picker path still clears once, not twice (no double live() and no lost file-error lines): a 13-file pick after a failed submit keeps the "more than 12" line
  await page.reload(); await page.waitForTimeout(600);
  await page.click('input[type=submit]'); await page.waitForTimeout(300);
  await page.setInputFiles('#photos-upload', Array.from({ length: 13 }, (_, i) => dir + `fixtures/batch-${String(i + 1).padStart(2, '0')}.jpg`)); await page.waitForTimeout(800);
  const f = await page.evaluate(() => ({ files: document.getElementById('photos-upload').files.length, errHidden: document.getElementById('tll-err-photos').hidden, status: document.querySelector('.tll-pen-status').textContent, fileErrs: [...document.querySelectorAll('#tll-photos-file-errors p')].map(p => p.textContent), count: document.getElementById('tll-photos-count').textContent }));
  rec('F3', 'in 1280: the picker path after a failed submit: 12 kept, photos error cleared, "4 things to fix above.", the over-12 line kept',
    f.files === 12 && f.errHidden && f.status === '4 things to fix above.' && f.fileErrs.length === 1 && f.fileErrs[0] === "That's more than 12. We kept the first 12 and left the rest for next time." && f.count === '12 of 12 chosen.', f);
  rec('F3', 'in 1280: no page errors', errors.length === 0, errors);
  await ctx.close();
}
await browser.close();
const passed = results.every(r => r.pass);
fs.writeFileSync(dir + 'fix-results.json', JSON.stringify({ passed, results }, null, 1));
for (const r of results) console.log((r.pass ? 'PASS' : 'FAIL') + ' [' + r.check + '] ' + r.name + (r.pass ? '' : '\n   ' + JSON.stringify(r.evidence)));
console.log(passed ? 'ALL PASS' : 'FAILURES');
process.exit(passed ? 0 : 1);
