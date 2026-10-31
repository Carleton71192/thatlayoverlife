const { chromium } = require('playwright'); const fs = require('fs');
const js = fs.readFileSync('src/site-layers/tll-story-is-v1.js', 'utf8');
const pages = [['/submit', '<main><form><label>Headline<input name="title"></label><textarea name="body"></textarea></form></main>'],
  ['/stories/x', '<main><div class="tll-story-share-row">share</div><p class="tll-sa"><span class="tll-sa-k">Write for TLL</span>Went somewhere worth telling? <a href="/submit">Pitch a layover story</a></p></main>'],
  ['/stories?q=zzz', '<main><p id="tll-q-note">Nothing filed for “<span>zzz</span>” yet, so here are all the stories. <a href="/stories">Clear the search</a></p><div class="tll-lib-grid"></div></main>']];
(async () => { const b = await chromium.launch();
  for (const w of [390, 1440]) for (const [path, html] of pages) { const p = await b.newPage({ viewport: { width: w, height: 900 } }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.route('**/*', (r) => r.fulfill({ contentType: 'text/html; charset=utf-8', body: '<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width"></head><body style="margin:16px;font-family:sans-serif">' + html + '<script>' + js + '<\/script></body></html>' }));
    await p.goto('https://www.thatlayover.life' + path); await p.waitForTimeout(1300);
    if (path === '/submit') { await p.fill('input[name=title]', 'The ultimate guide to Bali'); await p.waitForTimeout(100); }
    const tag = path.split('?')[0].replace(/\//g, '_') + '_' + w; await p.screenshot({ path: 'scratchpad/shots-1031/storyis' + tag + '.png', fullPage: true });
    console.log(tag, 'scrollW', await p.evaluate(() => document.documentElement.scrollWidth), '|', (await p.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 160), '| hint:', await p.evaluate(() => { const h = document.querySelector('.tll-si-hint'); return h ? !h.hidden : 'none'; }), errs.join('|')); }
  await b.close(); })();
