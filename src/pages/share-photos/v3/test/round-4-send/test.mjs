// tll-photo-send-v1 on /share-photos: offline test against mock-send.html (the live page footer's form script plus the new send script).
// Cloudinary and Webflow are faked. Nothing is sent anywhere.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const dir = new URL('.', import.meta.url).pathname;
const results = [];
const rec = (name, pass, evidence) => results.push({ name, pass: !!pass, evidence });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

async function open({ width = 390, height = 844, cloud = 'ok' } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  const errors = [], uploads = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.route('**/*', async route => {
    const req = route.request(), url = req.url();
    if (url.startsWith('https://api.cloudinary.com/')) {
      const body = req.postDataBuffer() || Buffer.alloc(0);
      uploads.push(body);
      if (cloud === 'fail') return route.fulfill({ status: 500, body: '{}' });
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ secure_url: `https://res.cloudinary.com/idonvlow/image/upload/v1/tll/photos/p${uploads.length}.jpg` }) });
    }
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
  await page.goto('http://tll.test/mock-send.html');
  await page.waitForTimeout(600);
  return { page, ctx, errors, uploads };
}

// In-page: JPEGs carrying an EXIF block with a GPS marker string, fed through the picker path.
const pick = `async function pick(n){
  const out=[]; for(let k=0;k<n;k++){ const c=document.createElement('canvas'); c.width=1600; c.height=1200; const g=c.getContext('2d'); g.fillStyle='#C8325B'; g.fillRect(0,0,1600,1200);
    const jpg=new Uint8Array(await (await new Promise(r=>c.toBlob(r,'image/jpeg',.8))).arrayBuffer());
    const txt=new TextEncoder().encode('GPS-SECRET-55.6761N-12.5683E\\0'); const tiff=new Uint8Array(26+txt.length);
    tiff.set([0x49,0x49,0x2A,0,8,0,0,0, 1,0, 0x0E,0x01, 2,0, txt.length,0,0,0, 26,0,0,0, 0,0,0,0],0); tiff.set(txt,26);
    const exif=new Uint8Array(6+tiff.length); exif.set(new TextEncoder().encode('Exif\\0\\0'),0); exif.set(tiff,6);
    const len=exif.length+2, app1=new Uint8Array(4+exif.length); app1.set([0xFF,0xE1,len>>8,len&255],0); app1.set(exif,4);
    const all=new Uint8Array(jpg.length+app1.length); all.set(jpg.subarray(0,2),0); all.set(app1,2); all.set(jpg.subarray(2),2+app1.length);
    out.push(new File([all],'IMG_00'+k+'.jpg',{type:'image/jpeg',lastModified:1000+k})); }
  const input=document.getElementById('photos-upload'); const dt=new DataTransfer(); out.forEach(f=>dt.items.add(f)); input.files=dt.files;
  input.dispatchEvent(new Event('change',{bubbles:true}));
  return out.map(f=>f.size);
}`;
const fillRest = page => page.evaluate(() => {
  const c = document.querySelector('input[name="country"]'); c.value = 'Denmark'; c.dispatchEvent(new Event('input', { bubbles: true }));
  for (const n of ['agree-rights', 'agree-licence', 'agree-people']) { const b = document.querySelector(`input[name="${n}"]`); b.checked = true; b.dispatchEvent(new Event('change', { bubbles: true })); }
});
const send = page => page.evaluate(() => document.querySelector('input[type="submit"]').click());
const has = (buf, s) => buf.includes(Buffer.from(s));

// 1 · happy path, three photos with EXIF and a GPS marker
{
  const { page, ctx, errors, uploads } = await open();
  const sizes = await page.evaluate(`(async()=>{ ${pick} return pick(3); })()`);
  await fillRest(page);
  await send(page);
  await page.waitForFunction(() => window.__wfRuns > 0, null, { timeout: 15000 }).catch(() => {});
  const st = await page.evaluate(() => ({ runs: window.__wfRuns, fields: window.__wfFields, status: document.querySelector('.tll-pen-status').textContent, disabled: document.querySelector('input[type=submit]').disabled }));
  rec('three photos upload, one at a time', uploads.length === 3, { uploads: uploads.length, inputSizes: sizes });
  rec('no EXIF block and no GPS text in any upload', uploads.length === 3 && uploads.every(b => !has(b, 'Exif') && !has(b, 'GPS-SECRET')), uploads.map(b => ({ bytes: b.length, exif: has(b, 'Exif'), gps: has(b, 'GPS-SECRET') })));
  const orig = await page.evaluate(async () => { const f = document.getElementById('photos-upload').files; const out = []; for (const x of f) { const t = new TextDecoder('latin1').decode(await x.arrayBuffer()); out.push(t.includes('Exif') && t.includes('GPS-SECRET')); } return out; });
  rec('originals carried EXIF and the GPS marker (the test is meaningful)', orig.length === 3 && orig.every(Boolean), orig);
  rec('Webflow handler ran exactly once', st.runs === 1, st.runs);
  rec('form sends the three links in "photos"', st.fields && st.fields.photos && st.fields.photos.split('\n').length === 3 && /res\.cloudinary\.com/.test(st.fields.photos), st.fields && st.fields.photos);
  rec('no stray "Field N" and country kept', st.fields && !Object.keys(st.fields).some(k => /^Field /.test(k)) && st.fields.country === 'Denmark', st.fields && Object.keys(st.fields));
  rec('button enabled again after send', !st.disabled, st.status);
  rec('no page errors', errors.length === 0, errors);
  await ctx.close();
}

// 2 · the page check still stops an unfinished form, and nothing uploads
{
  const { page, ctx, errors, uploads } = await open();
  await page.evaluate(`(async()=>{ ${pick} return pick(1); })()`);
  await send(page);
  await page.waitForTimeout(800);
  const st = await page.evaluate(() => ({ runs: window.__wfRuns, status: document.querySelector('.tll-pen-status').textContent }));
  rec('missing country and promises: no upload, no send', uploads.length === 0 && st.runs === 0, st);
  rec('no page errors (check path)', errors.length === 0, errors);
  await ctx.close();
}

// 3 · Cloudinary refuses: nothing is sent, the person is told, the button works again
{
  const { page, ctx, errors, uploads } = await open({ cloud: 'fail' });
  await page.evaluate(`(async()=>{ ${pick} return pick(2); })()`);
  await fillRest(page);
  await send(page);
  await page.waitForTimeout(2500);
  const st = await page.evaluate(() => ({ runs: window.__wfRuns, status: document.querySelector('.tll-pen-status').textContent, role: document.querySelector('.tll-pen-status').getAttribute('role'), disabled: document.querySelector('input[type=submit]').disabled }));
  rec('upload failure: form not sent', st.runs === 0 && uploads.length === 1, { uploads: uploads.length, ...st });
  rec('upload failure: clear message, button usable', /did not go through/.test(st.status) && st.role === 'alert' && !st.disabled, st);
  rec('no page errors (failure path)', errors.length === 0, errors);
  await ctx.close();
}

// 4 · nothing uploads on pick (before Send)
{
  const { page, ctx, uploads } = await open();
  await page.evaluate(`(async()=>{ ${pick} return pick(2); })()`);
  await page.waitForTimeout(1500);
  rec('choosing photos uploads nothing', uploads.length === 0, uploads.length);
  await page.screenshot({ path: dir + 'picked-390.png', fullPage: false });
  await ctx.close();
}

await browser.close();
fs.writeFileSync(dir + 'results.json', JSON.stringify(results, null, 2));
const failed = results.filter(r => !r.pass);
for (const r of results) console.log((r.pass ? 'PASS ' : 'FAIL ') + r.name + (r.pass ? '' : '  ' + JSON.stringify(r.evidence)));
console.log(`${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
