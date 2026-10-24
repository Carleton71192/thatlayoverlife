// tll-photo-clean-v1 on a stand-in /my-pets add-pet form. Cloudinary and Webflow are faked; nothing is sent anywhere.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const dir = new URL('.', import.meta.url).pathname;
const SCRIPT = fs.readFileSync(dir + '../tll-photo-clean-v1.js', 'utf8');
const results = []; const rec = (n, p, e) => results.push({ name: n, pass: !!p, evidence: e });
const PAGE = `<!doctype html><html><head><meta name=viewport content="width=device-width"></head><body>
<div class="w-form"><form data-tll-form="add-pet" method="get">
<input name="name" data-name="name" required><input name="breed" data-name="breed">
<input type="file" name="avatar" data-name="avatar" accept="image/*"><input type="file" name="pet-gallery" data-name="pet-gallery" accept="image/*" multiple>
<input type="submit" value="Add pet"></form></div>
<script>
window.__petEditorRuns=0; window.__extrasRuns=0; window.__wfRuns=0; window.__wfFields=null;
var f=document.querySelector('form');
f.addEventListener('submit',function(){ window.__petEditorRuns++; },true);   /* stands in for tll-pet-editor (capture) */
f.addEventListener('submit',function(){ window.__extrasRuns++; },true);      /* stands in for tll-pet-extras (capture) */
document.addEventListener('submit',function(ev){ ev.preventDefault(); window.__wfRuns++; var o={};    /* Webflow's handler: delegated, bubble */
  [].forEach.call(ev.target.querySelectorAll('input,select,textarea'),function(el,i){ if(el.type==='submit'||el.type==='file') return; o[el.getAttribute('data-name')||el.getAttribute('name')||('Field '+(i+1))]=el.value; }); window.__wfFields=o; });
</script><script>${SCRIPT}</script></body></html>`;
const pick = `async function pick(sel,n){ const out=[]; for(let k=0;k<n;k++){ const c=document.createElement('canvas'); c.width=1200; c.height=900; const g=c.getContext('2d'); g.fillStyle='#067A79'; g.fillRect(0,0,1200,900);
  const jpg=new Uint8Array(await (await new Promise(r=>c.toBlob(r,'image/jpeg',.8))).arrayBuffer()); const txt=new TextEncoder().encode('GPS-SECRET-55.67N\\0'); const tiff=new Uint8Array(26+txt.length);
  tiff.set([0x49,0x49,0x2A,0,8,0,0,0,1,0,0x0E,0x01,2,0,txt.length,0,0,0,26,0,0,0,0,0,0,0],0); tiff.set(txt,26); const exif=new Uint8Array(6+tiff.length); exif.set(new TextEncoder().encode('Exif\\0\\0'),0); exif.set(tiff,6);
  const len=exif.length+2, app1=new Uint8Array(4+exif.length); app1.set([0xFF,0xE1,len>>8,len&255],0); app1.set(exif,4); const all=new Uint8Array(jpg.length+app1.length); all.set(jpg.subarray(0,2),0); all.set(app1,2); all.set(jpg.subarray(2),2+app1.length);
  out.push(new File([all],'pet'+k+'.jpg',{type:'image/jpeg',lastModified:500+k+sel.length})); }
  const inp=document.querySelector(sel); const dt=new DataTransfer(); out.forEach(f=>dt.items.add(f)); inp.files=dt.files; return out.length; }`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
async function open(cloud = 'ok') {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await ctx.newPage(); const errors = [], uploads = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.route('**/*', async route => { const req = route.request(), url = req.url();
    if (url.startsWith('https://api.cloudinary.com/')) { const b = req.postDataBuffer() || Buffer.alloc(0); uploads.push(b);
      if (cloud === 'fail') return route.fulfill({ status: 500, body: '{}' });
      const folder = (b.toString('latin1').match(/name="folder"\r\n\r\n([^\r]*)/) || [])[1];
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ secure_url: `https://res.cloudinary.com/idonvlow/image/upload/${folder}/p${uploads.length}.jpg` }) }); }
    return route.fulfill({ contentType: 'text/html', body: PAGE }); });
  await page.goto('http://tll.test/my-pets'); return { page, ctx, errors, uploads };
}
const has = (b, s) => b.includes(Buffer.from(s));
const st = page => page.evaluate(() => ({ editor: __petEditorRuns, extras: __extrasRuns, wf: __wfRuns, fields: __wfFields, msg: (document.querySelector('.tll-up-msg') || {}).textContent || '' }));
{ const { page, ctx, errors, uploads } = await open();
  await page.evaluate(`(async()=>{ ${pick} await pick('[name="avatar"]',1); await pick('[name="pet-gallery"]',2); document.querySelector('[name="name"]').value='Biscuit'; })()`);
  await page.click('input[type=submit]'); await page.waitForFunction(() => __wfRuns > 0, null, { timeout: 15000 }).catch(() => {});
  const s = await st(page);
  rec('three photos uploaded (1 avatar, 2 gallery)', uploads.length === 3, uploads.length);
  rec('no EXIF or GPS text in any upload', uploads.length === 3 && uploads.every(b => !has(b, 'Exif') && !has(b, 'GPS-SECRET')), uploads.map(b => [has(b, 'Exif'), has(b, 'GPS-SECRET')]));
  rec('folders follow the field names', uploads.length === 3 && has(uploads[0], 'tll/avatar') && has(uploads[1], 'tll/pet-gallery'), '');
  rec('pet editor and extras ran exactly once each', s.editor === 1 && s.extras === 1, s);
  rec('Webflow sent once with avatar and pet-gallery links', s.wf === 1 && /tll\/avatar/.test(s.fields.avatar) && s.fields['pet-gallery'].split('\n').length === 2 && s.fields.name === 'Biscuit', s.fields);
  rec('no page errors', !errors.length, errors); await ctx.close(); }
{ const { page, ctx, uploads } = await open();
  await page.evaluate(() => { document.querySelector('[name="name"]').value = 'Noodle'; });
  await page.click('input[type=submit]'); await page.waitForTimeout(500); const s = await st(page);
  rec('no photos chosen: form untouched, scripts once, nothing uploaded', uploads.length === 0 && s.editor === 1 && s.wf === 1 && !s.msg, s); await ctx.close(); }
{ const { page, ctx, uploads } = await open();
  await page.evaluate(`(async()=>{ ${pick} await pick('[name="avatar"]',1); })()`);
  await page.click('input[type=submit]'); await page.waitForTimeout(800); const s = await st(page);
  rec('name missing: browser stops it, nothing uploaded, nothing saved', uploads.length === 0 && s.editor === 0 && s.wf === 0, s); await ctx.close(); }
{ const { page, ctx, uploads } = await open('fail');
  await page.evaluate(`(async()=>{ ${pick} await pick('[name="avatar"]',1); document.querySelector('[name="name"]').value='Biscuit'; })()`);
  await page.click('input[type=submit]'); await page.waitForTimeout(2000); const s = await st(page);
  const dis = await page.evaluate(() => document.querySelector('input[type=submit]').disabled);
  rec('upload fails: nothing saved or sent, clear message, button usable', uploads.length === 1 && s.editor === 0 && s.wf === 0 && /did not go through/.test(s.msg) && !dis, s); await ctx.close(); }
{ const { page, ctx, uploads } = await open();
  await page.evaluate(`(async()=>{ ${pick} await pick('[name="pet-gallery"]',2); })()`); await page.waitForTimeout(800);
  rec('choosing photos uploads nothing', uploads.length === 0, uploads.length); await ctx.close(); }
await browser.close();
fs.writeFileSync(dir + 'results.json', JSON.stringify(results, null, 2));
for (const r of results) console.log((r.pass ? 'PASS ' : 'FAIL ') + r.name + (r.pass ? '' : '  ' + JSON.stringify(r.evidence)));
console.log(`${results.filter(r => r.pass).length}/${results.length} passed`);
