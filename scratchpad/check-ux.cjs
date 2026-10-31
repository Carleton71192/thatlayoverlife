const { chromium } = require('playwright');
const fs = require('fs');
const bundle = ['tll-work-trips-v1','tll-ux-v1'].map((f) => fs.readFileSync(`src/site-layers/${f}.js`, 'utf8')).join('\n');
(async () => {
  const b = await chromium.launch();
  for (const w of [390, 1440]) {
    for (const [path, html, member] of [['/account?welcome=1&preview=ux', '<main><section><h1>Account</h1></section></main>', true], ['/stories/x?preview=ux', '<main><section class="tll-story-hero"><h1>A story</h1></section><div class="tll-body"><p>Body text.</p></div><div><a href="/stories/next-one"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="><h3>The next one</h3></a></div><div class="tll-story-share-row">Share row</div></main>', false]]) {
      const p = await b.newPage({ viewport: { width: w, height: 844 }, locale: 'en-DK' });
      const ms = member ? 'window.$memberstackDom={updateMember:(x)=>{window.__ts=x;return Promise.resolve();},getMemberCookie:()=>"tok",getMemberJSON:()=>Promise.resolve({data:{}}),updateMemberJSON:(x)=>{window.__saved=x.json;return Promise.resolve();}};' : 'window.$memberstackDom={getMemberCookie:()=>""};';
      await p.route('**/*', (r) => { const u = new URL(r.request().url()); if (u.hostname === 'www.thatlayover.life') return r.fulfill({ contentType: 'text/html; charset=utf-8', body: '<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width"></head><body style="margin:0">' + html + '<script>' + ms + 'window.gtag=function(){(window.__ev=window.__ev||[]).push(arguments[1]);};<\/script><script>' + bundle + '<\/script></body></html>' }); return r.fulfill({ contentType: 'application/json', body: '{"ok":true,"stamps":[]}' }); });
      const errs = []; p.on('pageerror', (e) => errs.push(e.message));
      await p.goto('https://www.thatlayover.life' + path); await p.waitForTimeout(2200);
      const tag = path.split('?')[0].replace(/\//g, '_') + '_' + w;
      if (member) {
        await p.screenshot({ path: `scratchpad/shots-1031/ux${tag}_1.png` });
        await p.click('text=Next'); await p.fill('#tll-ux-wel input[type=text]', 'Swe'); await p.click('.tll-ux-row >> text=STAYED');
        await p.screenshot({ path: `scratchpad/shots-1031/ux${tag}_2.png` });
        await p.click('text=Save my map'); await p.waitForTimeout(300); await p.click('#tll-ux-wel >> text=Next'); await p.waitForTimeout(200); await p.click('text=For work'); await p.screenshot({ path: `scratchpad/shots-1031/ux${tag}_ask.png` }); await p.click('text=Show my passport'); await p.waitForTimeout(600);
        await p.screenshot({ path: `scratchpad/shots-1031/ux${tag}_3.png` });
        console.log(tag, JSON.stringify(await p.evaluate(() => ({ states: window.__saved && window.__saved.tllStates.states, ev: window.__ev, ts: window.__ts }))), errs.join('|'));
      } else { await p.screenshot({ path: `scratchpad/shots-1031/ux${tag}.png`, fullPage: true }); console.log(tag, await p.evaluate(() => document.getElementById('tll-ux-end') && document.getElementById('tll-ux-end').innerText), errs.join('|')); }
    }
  }
  await b.close();
})();
