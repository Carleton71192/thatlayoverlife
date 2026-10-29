import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs'; import path from 'path'; import url from 'url';
const DIR = path.dirname(url.fileURLToPath(import.meta.url)); const ROOT = path.resolve(DIR, '../../../..');
const bar = fs.readFileSync(path.join(ROOT, 'src/components/member-bar/tll-member-bar-v1.html'), 'utf8').replace(' hidden>', '>');
const layer = fs.readFileSync(path.join(ROOT, 'src/site-layers/tll-mbar-align-v1.js'), 'utf8');
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><script>${layer}</script></head><body style="margin:0;background:#F7F1E8;font-family:sans-serif">${bar}<div style="max-width:1208px;margin:0 auto;padding:0 24px;box-sizing:border-box"><h1 style="margin:0">Overview</h1></div></body></html>`;
const b = await chromium.launch();
for (const w of [1440, 390]) { const p = await b.newPage({ viewport: { width: w, height: 300 } }); await p.route('**/*', r => r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' }));
  await p.goto('http://tll.test/account'); await p.waitForTimeout(300);
  console.log(w, await p.evaluate(() => ({ firstLink: Math.round(document.querySelector('.tll-mbar a').getBoundingClientRect().left), h1: Math.round(document.querySelector('h1').getBoundingClientRect().left) })));
  await p.screenshot({ path: path.join(DIR, `mbar-${w}.png`) }); await p.close(); }
await b.close();
