// End-to-end try of the Open Graph pull: the /submit link-out form with the layer, in Chromium, and the Worker's real
// previewLink() code answering /link-preview. The outside web is not reachable here, so the article pages and images are
// served from local copies: a photo article, an article whose share image is an ad banner, and a Worker that is not live yet.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../../..');
const { previewLink } = await import(path.join(ROOT, 'src/link-preview.js'));
const layer = fs.readFileSync(path.join(ROOT, 'src/site-layers/tll-linkout-preview-v1.js'), 'utf8');
const JPG = fs.readFileSync(path.join(ROOT, 'src/pages/home/mobile-proto-2026-10-26/img/pantanal-jaguar.jpg'));
const article = (img) => `<!doctype html><html><head><title>x</title>
<meta property="og:title" content="Six Days on the Rio Negro"><meta property="og:description" content="A slow boat, pink dolphins and no signal for a week.">
<meta property="og:site_name" content="Wander Notes"><meta property="og:image" content="${img}"></head><body></body></html>`;
const SITE = {
  'https://wandernotes.example.org/rio-negro/': { body: article('https://wandernotes.example.org/uploads/rio-negro-boat.jpg'), type: 'text/html' },
  'https://wandernotes.example.org/uploads/rio-negro-boat.jpg': { body: JPG, type: 'image/jpeg' },
  'https://adsy.example.org/deal/': { body: article('https://adsy.example.org/ads/summer-sale-728x90.png'), type: 'text/html' },
};
const fakeFetch = async (u) => { const r = SITE[u]; return r ? new Response(r.body, { status: 200, headers: { 'Content-Type': r.type } }) : new Response('', { status: 404 }); };
const form = `<form data-tll-form="link-out-story" style="max-width:640px;margin:24px auto;font-family:sans-serif">
<h2>Link to a story you already published</h2>
<label>The link<input type="url" name="external-url" style="display:block;width:100%;padding:10px"></label>
<label>Title<input type="text" name="field-5" style="display:block;width:100%;padding:10px"></label>
<label>Country<input type="text" name="country" style="display:block;width:100%;padding:10px"></label>
<label>One-line summary<input type="text" name="summary" style="display:block;width:100%;padding:10px"></label>
<input type="submit" value="Send"></form>`;
const page = `<!doctype html><html><head><meta name="viewport" content="width=device-width"></head><body style="background:#F7F1E8">${form}<script>${layer}</script></body></html>`;
const b = await chromium.launch(); const out = {}; let workerLive = true;
for (const [name, link, w] of [['photo', 'https://wandernotes.example.org/rio-negro/', 1280], ['ad', 'https://adsy.example.org/deal/', 1280], ['photo', 'https://wandernotes.example.org/rio-negro/', 390], ['not-live', 'https://wandernotes.example.org/rio-negro/', 1280]]) {
  workerLive = name !== 'not-live';
  const p = await b.newPage({ viewport: { width: w, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/*', async r => { const u = r.request().url();
    if (u.startsWith('https://tll-travel-wire.thatlayoverlife.workers.dev/link-preview')) {
      if (!workerLive) return r.fulfill({ status: 404, body: '{"error":"not found"}', contentType: 'application/json' });
      const body = await previewLink(new URL(u).searchParams.get('url'), fakeFetch);
      return r.fulfill({ status: body.ok ? 200 : 422, body: JSON.stringify(body), contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': 'http://tll.test' } }); }
    if (u.startsWith('https://wandernotes.example.org/uploads/')) return r.fulfill({ body: JPG, contentType: 'image/jpeg' });
    if (u.startsWith('http://tll.test/')) return r.fulfill({ body: page, contentType: 'text/html' });
    return r.abort(); });
  await p.goto('http://tll.test/submit'); await p.fill('input[name="external-url"]', link); await p.locator('input[name="external-url"]').blur(); await p.waitForTimeout(900);
  const state = await p.evaluate(() => { const f = document.querySelector('form'); const fd = new FormData(f); return { title: fd.get('field-5'), summary: fd.get('summary'), ogImage: fd.get('og-image'), ogSite: fd.get('og-site'), preview: (document.querySelector('.tll-lp') || {}).hidden === false ? document.querySelector('.tll-lp').innerText.replace(/\s+/g, ' ') : '(hidden)' }; });
  if (name === 'photo' && w === 1280) { await p.uncheck('.tll-lp-foot input'); state.afterUntick = await p.evaluate(() => new FormData(document.querySelector('form')).get('og-image')); await p.check('.tll-lp-foot input'); }
  await p.screenshot({ path: path.join(DIR, `${name}-${w}.png`), fullPage: true });
  out[name + '-' + w] = { ...state, errs }; await p.close();
}
await b.close(); console.log(JSON.stringify(out, null, 1));
