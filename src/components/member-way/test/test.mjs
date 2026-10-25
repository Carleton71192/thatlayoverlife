// tll-member-way-v1: offline check with stand-in pages and a fake Memberstack. Nothing is sent anywhere.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const dir = new URL('.', import.meta.url).pathname;
const SCRIPT = fs.readFileSync(dir + '../tll-member-way-v1.js', 'utf8');
const results = []; const rec = (n, p, e) => results.push({ name: n, pass: !!p, evidence: e });
const ms = id => id ? `window.$memberstackDom={getCurrentMember:()=>Promise.resolve({data:{id:'${id}'}})};` : `window.$memberstackDom={getCurrentMember:()=>Promise.resolve({data:null})};`;
const pages = {
  '/contributors/jay-carleton': `<header>nav</header><main><section data-pf5="root" data-member="mem_jay"><h1>Jay Carleton</h1><div data-pf5="buttons"></div></section></main>`,
  '/account': `<header>nav</header><main><div data-ms-content="members" class="a3-grid"><div class="tll-account-hero"><h1>Jay</h1><a class="a3-btn-edit" href="/edit-profile" style="background:#fff;color:#0A0B14;border:1px solid #0A0B14">Edit profile</a></div></div></main>`,
  '/the-map': `<header>nav</header><main><section style="background:#0A0B14;color:#fff;height:300px">THE MAP</section></main>`,
  '/stories': `<header>nav</header><main><h1>Stories</h1></main>`,
  '/account-native': `<div class="tll-nav-v1"><div class="tll-nav-inner">nav</div></div><nav class="tll-mbar" data-tll-member-bar aria-label="Your TLL"><a href="/account">OVERVIEW</a></nav><div data-ms-content="members"><h1>Hi</h1></div>`,
  '/edit-profile': `<div class="tll-nav-v1"><div class="tll-nav-inner">nav</div></div><div data-ms-content="members"><h1>Edit</h1></div>`,
};
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
async function open(path, member, width = 390) {
  const ctx = await browser.newContext({ viewport: { width, height: 844 } }); const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.route('**/*', r => r.fulfill({ contentType: 'text/html', body: `<!doctype html><html><head><meta name=viewport content="width=device-width"></head><body style="margin:0;background:#FDF9F3">${pages[path]}<script>${ms(member)}</script><script>${SCRIPT}</script></body></html>` }));
  await page.goto('http://tll.test' + (path === '/account-native' ? '/account' : path)); await page.waitForTimeout(700);
  return { page, ctx, errors };
}
{ const { page, ctx, errors } = await open('/contributors/jay-carleton', 'mem_jay');
  const r = await page.evaluate(() => { const b = document.getElementById('tmw-own'); if (!b) return null; const btn = b.querySelector('.tmw-btn'), cs = getComputedStyle(btn), rect = btn.getBoundingClientRect();
    return { first: document.querySelector('main').firstElementChild === b, text: b.textContent, href: btn.getAttribute('href'), bg: cs.backgroundColor, h: Math.round(rect.height), w: Math.round(rect.width), overflow: document.documentElement.scrollWidth > innerWidth }; });
  rec('owner sees THIS IS YOUR PAGE bar at the top of main', r && r.first && /THIS IS YOUR PAGE/.test(r.text), r);
  rec('Edit your profile is rose, 44px+, goes to /edit-profile', r && r.href === '/edit-profile' && r.bg === 'rgb(214, 56, 89)' && r.h >= 44, r);
  rec('no sideways scroll at 390', r && !r.overflow, r);
  await page.screenshot({ path: dir + 'profile-owner-390.png', clip: { x: 0, y: 0, width: 390, height: 260 } });
  rec('no page errors (owner)', !errors.length, errors); await ctx.close(); }
{ const { page, ctx } = await open('/contributors/jay-carleton', 'mem_other');
  rec('another member does not see the bar', await page.evaluate(() => !document.getElementById('tmw-own')), ''); await ctx.close(); }
{ const { page, ctx } = await open('/contributors/jay-carleton', null);
  rec('signed out: nothing added', await page.evaluate(() => !document.getElementById('tmw-own')), ''); await ctx.close(); }
{ const { page, ctx, errors } = await open('/account', 'mem_jay');
  const r = await page.evaluate(() => { const bar = document.getElementById('tmw-bar'), M = document.querySelector('[data-ms-content="members"]'); const cur = bar && bar.querySelector('[aria-current="page"]'); const e = document.querySelector('.a3-btn-edit');
    return { bar: !!bar, outsideMembers: !!bar && !M.contains(bar) && bar.nextElementSibling === M, current: cur && cur.textContent, links: bar && [...bar.querySelectorAll('a')].map(a => a.textContent + ' ' + a.getAttribute('href')), editBg: getComputedStyle(e).backgroundColor, overflow: document.documentElement.scrollWidth > innerWidth }; });
  rec('/account: bar before the members block, not inside it', r.bar && r.outsideMembers, r);
  rec('/account: OVERVIEW marked current, six links', r.current === 'OVERVIEW' && r.links.length === 6, r.links);
  rec('/account: Edit profile button turns rose', r.editBg === 'rgb(214, 56, 89)', r.editBg);
  rec('/account: no sideways scroll at 390', !r.overflow, r);
  await page.screenshot({ path: dir + 'account-390.png', clip: { x: 0, y: 0, width: 390, height: 200 } });
  rec('no page errors (account)', !errors.length, errors); await ctx.close(); }
{ const { page, ctx } = await open('/the-map', 'mem_jay');
  const r = await page.evaluate(() => { const bar = document.getElementById('tmw-bar'); return { first: document.querySelector('main').firstElementChild === bar, cur: bar && bar.querySelector('[aria-current]').textContent }; });
  rec('/the-map: bar at the top of main, MAP current', r.first && r.cur === 'MAP', r); await ctx.close(); }
{ const { page, ctx } = await open('/the-map', null);
  rec('/the-map signed out: no bar', await page.evaluate(() => !document.getElementById('tmw-bar')), ''); await ctx.close(); }
{ const { page, ctx } = await open('/stories', 'mem_jay');
  rec('other pages: script does nothing', await page.evaluate(() => !document.getElementById('tll-member-way-css') && !document.getElementById('tmw-bar')), ''); await ctx.close(); }
{ const { page, ctx } = await open('/account-native', 'mem_jay');
  const r = await page.evaluate(() => ({ ours: !!document.getElementById('tmw-bar'), bars: document.querySelectorAll('nav[aria-label="Your TLL"]').length }));
  rec('/account with its own member bar: no second bar', !r.ours && r.bars === 1, r);
  const m = await page.evaluate(() => { const n = document.querySelector('.tll-mbar'), cs = getComputedStyle(n); return { wrap: cs.flexWrap, pl: cs.paddingLeft }; });
  rec('its bar on a phone: one line, 16px from the edge', m.wrap === 'nowrap' && m.pl === '16px', m); await ctx.close(); }
{ const { page, ctx } = await open('/edit-profile', 'mem_jay');
  const r = await page.evaluate(() => { const b = document.getElementById('tmw-bar'); return { bar: !!b, afterNav: !!b && b.previousElementSibling && b.previousElementSibling.classList.contains('tll-nav-v1'), notFirst: document.body.firstElementChild !== b }; });
  rec('page without <main>: bar goes after the site header, never above it', r.bar && r.afterNav && r.notFirst, r); await ctx.close(); }
await browser.close();
fs.writeFileSync(dir + 'results.json', JSON.stringify(results, null, 2));
for (const r of results) console.log((r.pass ? 'PASS ' : 'FAIL ') + r.name + (r.pass ? '' : '  ' + JSON.stringify(r.evidence)));
console.log(`${results.filter(r => r.pass).length}/${results.length} passed`);
