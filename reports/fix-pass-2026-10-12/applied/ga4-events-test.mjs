import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const FOOTER = fs.readFileSync('/home/user/thatlayoverlife/reports/fix-pass-2026-10-12/applied/site-footer-ga4-events-after.html','utf8');
const head = c => `<!doctype html><html><head><style>.w-form-done,.w-form-fail{display:none}</style><script>
window.__ev=[];window.gtag=function(){window.__ev.push([].slice.call(arguments));};
window.CookieConsent={run:function(){},acceptedCategory:function(c){return ${c} && c==='analytics';},showPreferences:function(){}};
</script></head><body>`;
const wf = (attrs, inner, done) => `<div class="w-form"><form ${attrs}>${inner}<input type="submit" value="Send"></form><div class="w-form-done" id="${done}">Thanks</div><div class="w-form-fail">Fail</div></div>`;
const pages = {
  '/submit': `${wf('id="wf-form-Html-Form" data-tll-form="submit-story" name="wf-form-Html-Form" data-name="Html Form"','<input name="Name" type="text"><input type="email" name="Email">','d-write')}
    ${wf('id="lo" name="wf-form-Link-out-story" data-name="Link-out story"','<input name="external-url" type="url"><input type="email" name="Email">','d-link')}
    ${wf('data-tll-form="share-photos"','<input type="email" name="e">','d-share')}`,
  '/newsletter': `${wf('id="email-form" data-name="Email Form"','<input type="email" name="email">','d-news')}
    ${wf('class="tll-home-search" data-name="Search"','<input id="Search-the-library" name="Search-the-library" type="text"><input type="email" name="x">','d-search')}
    ${wf('data-ms-form="signup"','<input type="email" data-ms-member="email">','d-ms')}
    <a id="kofi" href="https://ko-fi.com/thatlayoverlife?ref=abc"><span id="kofispan">Support</span></a>
    <a id="aff" rel="sponsored noopener" href="https://www.booking.com/hotel/x.html?aid=123&label=secret">Hotel</a>
    <a id="aff2" data-tll-affiliate href="https://partner.example.org/p?id=9">P</a>
    <div id="guide"><a id="gext" href="https://checkout.gumroad.com/l/paw?x=1">Buy</a><a id="gint" href="/the-paw-passport">Back</a></div>
    <a id="plain" href="https://example.com/">plain</a>`,
  '/signup': `${wf('data-ms-form="signup"','<input type="email" data-ms-member="email">','d-ms')}
    <script>window.$memberstackDom={onAuthChange:function(cb){window.__cb=cb;return{unsubscribe:function(){}};}};</script>`,
};
const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') && fs.statSync('/opt/pw-browsers/chromium').isFile() ? '/opt/pw-browsers/chromium' : undefined });
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const reveal = (p, id) => p.evaluate(id => { document.getElementById(id).style.display = 'block'; }, id);
const hide = (p, id) => p.evaluate(id => { document.getElementById(id).style.display = 'none'; }, id);
const ev = p => p.evaluate(() => window.__ev);
const tick = p => p.waitForTimeout(80);
for (const consent of [true, false]) {
  const ctx = await browser.newContext();
  await ctx.route('**/*', r => { const u = new URL(r.request().url());
    if (u.host === 'tll.test') { const b = pages[u.pathname.replace(/\/$/, '')]; return b ? r.fulfill({ contentType: 'text/html', body: head(consent) + b + FOOTER + '</body></html>' }) : r.fulfill({ status: 404, body: '' }); }
    return r.abort(); });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  const tag = consent ? '[consent=true] ' : '[consent=false] ';
  // /submit
  await p.goto('http://tll.test/submit'); await tick(p);
  ok((await p.evaluate(() => typeof window.tllEv)) === 'function', tag + 'window.tllEv exposed');
  await reveal(p, 'd-write'); await tick(p); await hide(p, 'd-write'); await tick(p); await reveal(p, 'd-write'); await tick(p);
  await reveal(p, 'd-link'); await tick(p); await reveal(p, 'd-share'); await tick(p);
  let e = await ev(p);
  const n = (name) => e.filter(x => x[0] === 'event' && x[1] === name);
  ok(n('story_submitted').length === (consent ? 2 : 0), tag + `story_submitted count ${n('story_submitted').length} (write+link_out, each once)`);
  if (consent) ok(JSON.stringify(n('story_submitted').map(x => x[2])) === '[{"type":"write"},{"type":"link_out"}]', tag + 'story_submitted params ' + JSON.stringify(n('story_submitted').map(x => x[2])));
  ok(n('newsletter_signup').length === 0, tag + 'share-photos form not counted as newsletter');
  // /newsletter
  await p.goto('http://tll.test/newsletter/'); await tick(p);
  for (const id of ['kofi', 'aff', 'aff2', 'gext', 'gint', 'plain']) await p.evaluate(id => { const a = document.getElementById(id); a.addEventListener('click', ev => ev.preventDefault()); }, id);
  await p.click('#kofispan'); await tick(p);
  await reveal(p, 'd-news'); await tick(p); await hide(p, 'd-news'); await reveal(p, 'd-news'); await tick(p);
  await reveal(p, 'd-search'); await reveal(p, 'd-ms'); await tick(p);
  e = await ev(p);
  ok(n('kofi_click').length === (consent ? 1 : 0), tag + `kofi_click count ${n('kofi_click').length}`);
  ok(n('newsletter_signup').length === (consent ? 1 : 0), tag + `newsletter_signup count ${n('newsletter_signup').length} (search + Memberstack forms excluded)`);
  if (consent) ok(JSON.stringify(n('kofi_click')[0][2]) === '{"link_domain":"ko-fi.com"}' && JSON.stringify(n('newsletter_signup')[0][2]) === '{"location":"/newsletter/"}', tag + 'kofi/newsletter params ' + JSON.stringify([n('kofi_click')[0][2], n('newsletter_signup')[0][2]]));
  // stay on page: further clicks (default prevented on those)
  await p.click('#aff'); await p.click('#aff2'); await p.click('#gext'); await p.click('#gint'); await p.click('#plain'); await tick(p);
  e = await ev(p);
  ok(n('affiliate_click').length === (consent ? 2 : 0), tag + `affiliate_click count ${n('affiliate_click').length}`);
  ok(n('guide_checkout_click').length === (consent ? 1 : 0), tag + `guide_checkout_click count ${n('guide_checkout_click').length} (internal guide link ignored)`);
  if (consent) {
    ok(JSON.stringify(n('affiliate_click').map(x => x[2])) === '[{"link_domain":"www.booking.com","story":"/newsletter/"},{"link_domain":"partner.example.org","story":"/newsletter/"}]', tag + 'affiliate params ' + JSON.stringify(n('affiliate_click').map(x => x[2])));
    ok(JSON.stringify(n('guide_checkout_click')[0][2]) === '{"link_domain":"checkout.gumroad.com"}', tag + 'guide params');
    ok(!JSON.stringify(e).match(/\?|aid=|secret|https?:/), tag + 'no full URL or query string in any event payload');
  }
  // /signup
  await p.goto('http://tll.test/signup'); await p.waitForTimeout(400);
  await p.evaluate(() => { window.__cb(null); window.__cb({ data: { id: 'mem_1' } }); window.__cb({ data: { id: 'mem_1' } }); });
  e = await ev(p);
  ok(n('sign_up').length === (consent ? 1 : 0), tag + `sign_up count ${n('sign_up').length}`);
  if (consent) ok(JSON.stringify(n('sign_up')[0][2]) === '{"method":"memberstack"}', tag + 'sign_up params');
  await p.reload(); await p.waitForTimeout(400); await p.evaluate(() => window.__cb({ data: { id: 'mem_1' } }));
  e = await ev(p);
  ok(n('sign_up').length === 0, tag + 'sign_up not repeated after reload (sessionStorage flag)');
  ok(errs.length === 0, tag + 'no page errors ' + JSON.stringify(errs));
  await ctx.close();
}
await browser.close();
console.log(fails ? `${fails} FAILED` : 'ALL PASS'); process.exit(fails ? 1 : 0);
