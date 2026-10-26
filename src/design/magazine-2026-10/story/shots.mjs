import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url'; const DIR = path.dirname(url.fileURLToPath(import.meta.url));
const OUT = path.join(DIR, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(); const errs = [];
for (const [w, h] of [[390, 844], [1280, 900]]) for (const font of ['newsreader']) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 }); p.on('pageerror', e => errs.push(e.message)); p.on('requestfailed', r => errs.push('failed ' + r.url()));
  await p.goto('file://' + path.join(DIR, 'story-local.html')); await p.evaluate(f => document.documentElement.setAttribute('data-font', f), font);
  await p.evaluate(() => document.fonts.ready); await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); }); await p.waitForTimeout(600);
  await p.addStyleTag({ content: '.sw{display:none}' });
  const m = await p.evaluate(() => { const small = []; for (const e of document.querySelectorAll('a,button,input')) { const r = e.getBoundingClientRect(); if (r.width && (r.width < 44 || r.height < 44)) small.push((e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 24) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); } return { h: document.documentElement.scrollHeight, over: document.documentElement.scrollWidth > innerWidth, small }; });
  console.log(w, font, 'height', m.h, 'overflow', m.over, 'small', m.small.length ? m.small : 'none');
  await p.screenshot({ path: path.join(OUT, `story-${w}-${font}.png`), fullPage: true });
  if (process.env.AXE && font === 'newsreader') { await p.addScriptTag({ path: process.env.AXE }); const r = await p.evaluate(() => axe.run(document, { runOnly: ['color-contrast', 'target-size', 'image-alt', 'link-name', 'button-name', 'label'] })); console.log('axe', w, r.violations.length ? r.violations.map(v => v.id + ': ' + v.nodes.map(x => x.target[0]).join(', ')) : 'none'); }
  await p.close();
}
await b.close(); console.log('errors', errs.length ? errs : 'none');
