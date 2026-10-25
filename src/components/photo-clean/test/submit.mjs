// tll-photo-clean-v1 on /submit: the story form as exported (13 Oct) plus the live page footer (three-step script, 26 Oct copy).
// Cloudinary and Webflow are faked; nothing is sent anywhere.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const dir = new URL('.', import.meta.url).pathname;
const LIVE = dir + '../../../pages/submit/live-2026-10-26/';
const SCRIPT = fs.readFileSync(dir + '../tll-photo-clean-v1.js', 'utf8');
const FORM = fs.readFileSync(LIVE + 'form-story-export-2026-10-13.html', 'utf8');
const FOOTER = fs.readFileSync(LIVE + 'page-footer.html', 'utf8');
const results = []; const rec = (n, p, e) => results.push({ name: n, pass: !!p, evidence: e });
const MS_FORM = `<div class="w-form"><form data-ms-form="profile" id="msform"><input type="file" name="profile-image" data-ms-member="profile-image"><input type="submit" value="Save"></form></div>`;
const PAGE = `<!doctype html><html><head><meta charset="utf-8"><meta name=viewport content="width=device-width"></head><body>
${FORM}${MS_FORM}
<script>
window.__wfRuns=0; window.__wfFields=null; window.__msRuns=0; window.__msFileName=null;
window.$memberstackDom={getMemberJSON:()=>Promise.resolve({data:{}}),updateMemberJSON:()=>Promise.resolve({}),getCurrentMember:()=>Promise.resolve({data:{id:'mem_jay',customFields:{}}})};
document.getElementById('msform').addEventListener('submit',function(ev){ ev.preventDefault(); window.__msRuns++; var i=this.querySelector('input[type=file]'); window.__msFileName=i.getAttribute('name')+':'+(i.files?i.files.length:0); });
document.addEventListener('submit',function(ev){ if(ev.target.id==='msform') return; ev.preventDefault(); window.__wfRuns++; var o={};   /* Webflow's handler: delegated, bubble */
  [].forEach.call(ev.target.querySelectorAll('input,select,textarea'),function(el,i){ if(el.type==='submit'||el.type==='file') return; if((el.type==='checkbox'||el.type==='radio')&&!el.checked) return; o[el.getAttribute('data-name')||el.getAttribute('name')||('Field '+(i+1))]=el.value; }); window.__wfFields=o; });
</script>${FOOTER}<script>${SCRIPT}</script></body></html>`;
const pick = `async function pick(sel,n,tag){ const out=[]; for(let k=0;k<n;k++){ const c=document.createElement('canvas'); c.width=1600; c.height=1000; const g=c.getContext('2d'); g.fillStyle='#C8325B'; g.fillRect(0,0,1600,1000);
  const jpg=new Uint8Array(await (await new Promise(r=>c.toBlob(r,'image/jpeg',.8))).arrayBuffer()); const txt=new TextEncoder().encode('GPS-SECRET-55.67N\\0'); const tiff=new Uint8Array(26+txt.length);
  tiff.set([0x49,0x49,0x2A,0,8,0,0,0,1,0,0x0E,0x01,2,0,txt.length,0,0,0,26,0,0,0,0,0,0,0],0); tiff.set(txt,26); const exif=new Uint8Array(6+tiff.length); exif.set(new TextEncoder().encode('Exif\\0\\0'),0); exif.set(tiff,6);
  const len=exif.length+2, app1=new Uint8Array(4+exif.length); app1.set([0xFF,0xE1,len>>8,len&255],0); app1.set(exif,4); const all=new Uint8Array(jpg.length+app1.length); all.set(jpg.subarray(0,2),0); all.set(app1,2); all.set(jpg.subarray(2),2+app1.length);
  out.push(new File([all],(tag||'p')+k+'.jpg',{type:'image/jpeg',lastModified:900+k+sel.length})); }
  const inp=document.querySelector(sel); const dt=new DataTransfer(); out.forEach(f=>dt.items.add(f)); inp.files=dt.files; return out.length; }`;
/* fill every required field except the photos, the way a writer would */
const fillRequired = () => { const f = document.querySelector('form[data-tll-form="submit-story"]');
  /* the export leaves select options out ("select options are not exposed by the API"): stand-in options */
  [].forEach.call(f.querySelectorAll('select'), sel => { if (sel.options.length < 2) ['Europe', 'Asia'].forEach(v => sel.add(new Option(v, v))); });
  [].forEach.call(f.querySelectorAll('input,textarea,select'), el => { if (el.type === 'file' || el.type === 'submit' || el.type === 'hidden') return;
    if (!el.required) return;
    if (el.type === 'checkbox') el.checked = true; else if (el.type === 'radio') { const g = f.querySelectorAll('input[type=radio][name="' + el.name + '"]'); if (![].some.call(g, r => r.checked)) el.checked = true; }
    else if (el.tagName === 'SELECT') { const o = [].find.call(el.options, x => x.value && !x.disabled); if (o) el.value = o.value; }
    else if (el.type === 'email') el.value = 'jay@example.com'; else if (el.type === 'url') el.value = 'https://example.com';
    else { const n = Math.max(+el.getAttribute('minlength') || 0, 12); el.value = 'Test text '.repeat(Math.ceil(n / 10)).slice(0, Math.max(n, 12)); } });
  return [].filter.call(f.querySelectorAll('input,textarea,select'), el => el.type !== 'file' && el.willValidate && !el.checkValidity()).map(el => el.name); };
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
async function open() {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await ctx.newPage(); const errors = [], uploads = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.route('**/*', async route => { const req = route.request(), url = req.url();
    if (url.startsWith('https://api.cloudinary.com/')) { const b = req.postDataBuffer() || Buffer.alloc(0); uploads.push(b);
      const folder = (b.toString('latin1').match(/name="folder"\r\n\r\n([^\r]*)/) || [])[1];
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ secure_url: `https://res.cloudinary.com/idonvlow/image/upload/${folder}/p${uploads.length}.jpg` }) }); }
    if (url.startsWith('http://tll.test/')) return route.fulfill({ contentType: 'text/html', body: PAGE });
    return route.fulfill({ status: 204, body: '' }); });
  await page.goto('http://tll.test/submit'); await page.waitForTimeout(300); return { page, ctx, errors, uploads };
}
const has = (b, s) => b.includes(Buffer.from(s));
const step = page => page.$eval('.tllst-eb', e => e.textContent);
const st = page => page.evaluate(() => ({ wf: __wfRuns, fields: __wfFields, ms: __msRuns, msFile: __msFileName, msg: (document.querySelector('.tll-up-msg') || {}).textContent || '' }));

// 1 · steps still work, then a full send with a hero photo and two gallery photos
{ const { page, ctx, errors, uploads } = await open();
  rec('three-step bar starts at step 1', /Step 1 of 3/.test(await step(page)), await step(page));
  await page.click('.tllst-next'); await page.waitForTimeout(200);
  rec('Next with empty required fields stays on step 1', /Step 1 of 3/.test(await step(page)), await step(page));
  const left = await page.evaluate(fillRequired);
  rec('every required field except the photos can be filled', left.length === 0, left);
  await page.click('.tllst-next'); await page.waitForTimeout(150); await page.click('.tllst-next'); await page.waitForTimeout(150);
  rec('Next moves to step 3 once filled', /Step 3 of 3/.test(await step(page)), await step(page));
  await page.evaluate(`(async()=>{ ${pick} await pick('[name="hero-image"]',1,'hero'); await pick('[name="photo-gallery"]',2,'gal'); })()`);
  await page.click('form[data-tll-form="submit-story"] input[type=submit]', { timeout: 5000 }); await page.waitForFunction(() => __wfRuns > 0, null, { timeout: 20000 }).catch(() => {});
  const s = await st(page);
  rec('three photos uploaded (1 hero, 2 gallery)', uploads.length === 3, uploads.length);
  rec('no EXIF or GPS text in any upload', uploads.length === 3 && uploads.every(b => !has(b, 'Exif') && !has(b, 'GPS-SECRET')), uploads.map(b => [has(b, 'Exif'), has(b, 'GPS-SECRET')]));
  rec('Webflow sent the story once', s.wf === 1, s.wf);
  rec('hero-image carries one Cloudinary link', s.fields && /res\.cloudinary\.com.*tll\/hero-image/.test(s.fields['hero-image']) && s.fields['hero-image'].split('\n').length === 1, s.fields && s.fields['hero-image']);
  rec('photo-gallery carries two links', s.fields && s.fields['photo-gallery'] && s.fields['photo-gallery'].split('\n').length === 2, s.fields && s.fields['photo-gallery']);
  rec('the written fields went with it', s.fields && Object.keys(s.fields).length > 10, s.fields && Object.keys(s.fields).length);
  rec('draft cleared after the send', await page.evaluate(() => localStorage.getItem('tllStoryDraft')) === null, '');
  rec('no page errors (send)', !errors.length, errors); await ctx.close(); }

// 2 · hero photo missing: the browser stops it on step 3, nothing uploads
{ const { page, ctx, uploads } = await open();
  await page.evaluate(fillRequired); await page.click('.tllst-next'); await page.waitForTimeout(100); await page.click('.tllst-next'); await page.waitForTimeout(100);
  await page.evaluate(`(async()=>{ ${pick} await pick('[name="photo-gallery"]',1,'gal'); })()`);
  await page.click('form[data-tll-form="submit-story"] input[type=submit]', { timeout: 5000 }); await page.waitForTimeout(1200); const s = await st(page);
  rec('no hero photo: nothing uploaded, nothing sent, still on step 3', uploads.length === 0 && s.wf === 0 && /Step 3 of 3/.test(await step(page)), { uploads: uploads.length, wf: s.wf }); await ctx.close(); }

// 3 · a Memberstack form with a file field is left alone
{ const { page, ctx, uploads } = await open();
  await page.evaluate(`(async()=>{ ${pick} await pick('#msform input[type=file]',1,'ms'); })()`);
  await page.click('#msform input[type=submit]'); await page.waitForTimeout(800); const s = await st(page);
  rec('Memberstack form: not held, nothing uploaded, its file field untouched', uploads.length === 0 && s.ms === 1 && s.msFile === 'profile-image:1', { uploads: uploads.length, ms: s.ms, file: s.msFile }); await ctx.close(); }

// 4 · a Memberstack-owned file field inside an ordinary form is skipped, the rest still works
{ const { page, ctx, uploads } = await open();
  await page.evaluate(() => { const g = document.querySelector('[name="photo-gallery"]'); g.setAttribute('data-ms-member', 'gallery'); });
  await page.evaluate(fillRequired); await page.click('.tllst-next'); await page.waitForTimeout(100); await page.click('.tllst-next'); await page.waitForTimeout(100);
  await page.evaluate(`(async()=>{ ${pick} await pick('[name="hero-image"]',1,'hero'); await pick('[name="photo-gallery"]',2,'gal'); })()`);
  await page.click('form[data-tll-form="submit-story"] input[type=submit]', { timeout: 5000 }); await page.waitForFunction(() => __wfRuns > 0, null, { timeout: 20000 }).catch(() => {}); const s = await st(page);
  rec('Memberstack-owned field skipped, hero still cleaned and sent', uploads.length === 1 && s.wf === 1 && /tll\/hero-image/.test(s.fields['hero-image']), { uploads: uploads.length, wf: s.wf }); await ctx.close(); }

await browser.close();
fs.writeFileSync(dir + 'results-submit.json', JSON.stringify(results, null, 2));
const failed = results.filter(r => !r.pass);
for (const r of results) console.log((r.pass ? 'PASS ' : 'FAIL ') + r.name + (r.pass ? '' : '  ' + JSON.stringify(r.evidence)));
console.log(`${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
