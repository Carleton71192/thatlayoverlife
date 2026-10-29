// Multilingual Phase 1: the story toggle (tll-story-translate-v1.js) in Chromium against the real Worker handler
// (src/translate.js). Webflow and DeepL are faked: DeepL returns "[TARGET] text" so the swap is visible.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../../..');
const { handleTranslate } = await import(path.join(ROOT, 'src/translate.js'));
const layer = fs.readFileSync(path.join(ROOT, 'src/site-layers/tll-story-translate-v1.js'), 'utf8');
const store = new Map(); const KV = { get: async k => store.get(k) ?? null, put: async (k, v) => void store.set(k, v) };
const ITEMS = {
  'un-dia-en-sao-paulo': { lang: 'opt-es', allow: true, title: 'Un día en São Paulo', excerpt: 'Café y lluvia.', body: '<p>Llegamos a <span data-tll-place>São Paulo</span> con hambre.</p><figure><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt=""><figcaption>Foto</figcaption></figure><p>Otra <strong>parte</strong>.</p>' },
  'copenhagen-in-the-rain': { lang: 'opt-en', allow: true, title: 'Copenhagen in the rain', excerpt: 'Bikes and coffee.', body: '<p>We landed hungry.</p>' },
  'kept-in-danish': { lang: 'opt-da', allow: false, title: 'En dag', excerpt: 'Kaffe.', body: '<p>Hej.</p>' },
};
let deeplDown = false;
const fakeFetch = async (u, init = {}) => {
  if (u.endsWith('/collections/stories')) return Response.json({ fields: [{ slug: 'story-language', validations: { options: [{ id: 'opt-en', name: 'English (en)' }, { id: 'opt-es', name: 'Español (es)' }, { id: 'opt-da', name: 'Dansk (da)' }] } }] });
  const m = u.match(/items\/live\?slug=([^&]+)/);
  if (m) { const s = decodeURIComponent(m[1]), it = ITEMS[s]; return Response.json({ items: it ? [{ id: 'a'.repeat(24), isDraft: false, fieldData: { slug: s, name: it.title, excerpt: it.excerpt, body: it.body, 'story-language': it.lang, 'allow-translation': it.allow } }] : [] }); }
  if (u.includes('deepl.com')) { if (deeplDown) return new Response('', { status: 503 }); const b = JSON.parse(init.body); return Response.json({ translations: b.text.map(t => ({ text: `[${b.target_lang}] ${t}` })) }); }
  return new Response('', { status: 404 });
};
const env = { WEBFLOW_TOKEN: 'wf', DEEPL_KEY: 'k:fx', STORIES_COLLECTION_ID: 'stories', WIRE_KV: KV };
const page = (slug) => { const it = ITEMS[slug]; const name = { 'opt-es': 'Español (es)', 'opt-en': 'English (en)', 'opt-da': 'Dansk (da)' }[it.lang];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body style="font-family:sans-serif;max-width:680px;margin:24px auto;padding:0 16px;background:#F7F1E8">
<h1 class="tll-story-title">${it.title}</h1><p class="tll-story-excerpt">${it.excerpt}</p><div class="st3-author">Zain M</div>
<div data-tll-story-lang hidden>${name}</div><div data-tll-tr-allow ${it.allow ? 'style="display:none" data-x' : 'class="w-condition-invisible" style="display:none"'}></div>
<article class="tll-reading-column tll-story-body"><div class="tll-body">${it.body}</div><div class="tll-signoff">Mood: rainy. Nancy</div></article>
<script>${layer}</script></body></html>`; };
// The allow marker is display:none in Webflow too (hidden helper); the layer reads w-condition-invisible. Make "allowed" visible-but-empty:
const fix = (h) => h.replace('style="display:none" data-x', 'style="height:0"');
const b = await chromium.launch(); const out = {};
async function open(slug, locale, w = 1280) {
  const ctx = await b.newContext({ locale, viewport: { width: w, height: 900 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const events = []; await p.exposeFunction('__ev', (n, a) => events.push([n, a]));
  await p.addInitScript(() => { window.gtag = (t, n, a) => window.__ev(n, a); });
  await p.route('**/*', async r => { const u = r.request().url();
    if (u === 'https://tll-travel-wire.thatlayoverlife.workers.dev/translate') {
      const req = new Request(u, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://www.thatlayover.life', 'CF-Connecting-IP': '9.9.9.9' }, body: r.request().postData() });
      const res = await handleTranslate(req, env, fakeFetch); return r.fulfill({ status: res.status, body: await res.text(), contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': 'https://www.thatlayover.life' } }); }
    if (u.startsWith('https://www.thatlayover.life/stories/')) return r.fulfill({ body: fix(page(u.split('/').pop())), contentType: 'text/html; charset=utf-8' });
    return r.abort(); });
  await p.goto('https://www.thatlayover.life/stories/' + slug); await p.waitForTimeout(200);
  return { ctx, p, errs, events };
}
// 1. Spanish story, English reader
{ const { ctx, p, errs, events } = await open('un-dia-en-sao-paulo', 'en-US');
  const before = await p.evaluate(() => ({ html: document.querySelector('.tll-body').innerHTML, lang: document.querySelector('.tll-story-body').lang, pill: (document.querySelector('.tll-tr-pill') || {}).textContent, src: document.documentElement.outerHTML.includes('[EN-US]') }));
  await p.click('.tll-tr-pill'); await p.waitForTimeout(400);
  const after = await p.evaluate(() => ({ title: document.querySelector('.tll-story-title').textContent, lang: document.querySelector('.tll-story-body').lang, pill: document.querySelector('.tll-tr-pill').textContent, label: document.querySelector('.tll-tr-label').textContent, live: document.querySelector('.tll-tr-sr').textContent, place: document.querySelector('[data-tll-place]').textContent, img: !!document.querySelector('.tll-body img'), signoff: document.querySelector('.tll-signoff').textContent, mem: localStorage.getItem('tllTranslateTo') }));
  await p.screenshot({ path: path.join(DIR, 'es-story-en-reader-translated.png'), fullPage: true });
  await p.keyboard.press('Tab'); await p.focus('.tll-tr-pill'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  const restored = await p.evaluate(() => ({ html: document.querySelector('.tll-body').innerHTML, lang: document.querySelector('.tll-story-body').lang, title: document.querySelector('.tll-story-title').textContent }));
  out.spanishStoryEnglishReader = { before, after, exactRestore: restored.html === before.html, restoredLang: restored.lang, restoredTitle: restored.title, events, errs }; await ctx.close(); }
// 2. English story, Spanish reader, at 375
{ const { ctx, p, errs } = await open('copenhagen-in-the-rain', 'es-ES', 375);
  const pill = await p.evaluate(() => (document.querySelector('.tll-tr-pill') || {}).textContent);
  await p.click('.tll-tr-pill'); await p.waitForTimeout(400);
  out.englishStorySpanishReader = { pill, body: await p.$eval('.tll-body', e => e.textContent), label: await p.$eval('.tll-tr-label', e => e.textContent), lang: await p.$eval('.tll-story-body', e => e.lang), errs };
  await p.screenshot({ path: path.join(DIR, 'en-story-es-reader-375.png'), fullPage: true }); await ctx.close(); }
// 3. English story, English reader: no pill. 4. Allow off: no pill
{ const { ctx, p } = await open('copenhagen-in-the-rain', 'en-US'); out.sameLanguageNoPill = !(await p.$('.tll-tr-pill')); await ctx.close(); }
{ const { ctx, p } = await open('kept-in-danish', 'en-US'); out.allowOffNoPill = !(await p.$('.tll-tr-pill')); out.allowOffLang = await p.$eval('.tll-story-body', e => e.lang); await ctx.close(); }
// 5. Translator down: error shown, original stays
{ deeplDown = true; store.clear(); const { ctx, p } = await open('un-dia-en-sao-paulo', 'da-DK'); const before = await p.$eval('.tll-body', e => e.innerHTML);
  await p.click('.tll-tr-pill'); await p.waitForTimeout(400);
  out.translatorDown = { pill: await p.$eval('.tll-tr-pill', e => e.textContent), err: await p.$eval('.tll-tr-err', e => e.textContent), originalKept: (await p.$eval('.tll-body', e => e.innerHTML)) === before };
  await ctx.close(); deeplDown = false; }
await b.close(); console.log(JSON.stringify(out, null, 1));
