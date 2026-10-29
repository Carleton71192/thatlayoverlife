import { createRequire } from 'module'; const { chromium } = createRequire('/home/user/thatlayoverlife/')('playwright');
import fs from 'fs';
const L = fs.readFileSync('/home/user/thatlayoverlife/src/site-layers/tll-story-fixes-1029-v1.js', 'utf8');
const F = fs.readFileSync('/home/user/thatlayoverlife/src/site-layers/tllflagsv5.js', 'utf8');
const html = `<!doctype html><html><head><meta charset="utf-8"><script>${L}</script></head><body>
<div class="tll-lib-meta">NEW ORLEANS, LOUISIANA</div><div class="tll-lib-meta">TBILISI, GEORGIA</div><div class="tll-lib-meta">TORREVIEJA, SPAIN</div>
<div class="tll-related-header"><span>KEEP READING</span><h2>Other stops on this <em class="tll-text-rose">layover</em></h2></div><script>${F}</script></body></html>`;
const b = await chromium.launch(); const p = await b.newPage(); p.on('pageerror', e => console.log('ERR', e.message));
await p.route('**/*', r => r.request().url().includes('tll.test') ? r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' }) : r.fulfill({ body: '<svg xmlns="http://www.w3.org/2000/svg"/>', contentType: 'image/svg+xml' }));
await p.goto('http://tll.test/stories/x'); await p.waitForTimeout(3000);
console.log(JSON.stringify(await p.evaluate(() => ({ flags: [...document.querySelectorAll('.tll-lib-meta')].map(e => e.textContent.trim() + ' -> ' + [...e.querySelectorAll('img')].map(i => i.src.split('/').pop()).join(',')), h: document.querySelector('h2').innerHTML }))));
await b.close();
