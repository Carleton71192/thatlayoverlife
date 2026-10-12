// Offline Playwright checks for Account and sign-in 3.0. Pages are served from local mocks via page.route on http://tll.test/.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const dir = new URL('.', import.meta.url).pathname;
const results = []; let fails = 0;
function ok(name, cond, info = '') { results.push((cond ? 'PASS ' : 'FAIL ') + name + (info ? ' :: ' + info : '')); if (!cond) fails++; }
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
async function open(file, { width = 1280, hash = '', reduced = false, js = true } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: reduced ? 'reduce' : 'no-preference', javaScriptEnabled: js });
  const page = await ctx.newPage(); const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.route('http://tll.test/**', async route => {
    const u = new URL(route.request().url());
    if (u.pathname === '/site.css') return route.fulfill({ body: fs.readFileSync(dir + 'site.css'), contentType: 'text/css' });
    if (u.pathname.startsWith('/p/')) return route.fulfill({ body: fs.readFileSync(dir + u.pathname.slice(3)), contentType: 'text/html' });
    return route.fulfill({ status: 204, body: '' });
  });
  await page.route(/^(?!http:\/\/tll\.test).*/, r => r.abort());
  await page.goto('http://tll.test/p/' + file + (hash.startsWith('?') ? hash : hash));
  await page.waitForTimeout(1500);
  return { page, ctx, errors };
}
const noHScroll = p => p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 0);

// ---------- Account, signed in ----------
for (const width of [1280, 375]) {
  const { page, ctx, errors } = await open('out-account-member.html', { width });
  await page.screenshot({ path: dir + `account-member-${width}.png`, fullPage: true });
  ok(`account ${width}: no horizontal scroll`, await noHScroll(page), await page.evaluate(() => document.documentElement.scrollWidth));
  const tabs = await page.$$eval('[role=tab][data-a3-tab]', els => els.map(e => [e.dataset.a3Tab, e.getAttribute('aria-selected'), e.tabIndex]));
  ok(`account ${width}: seven tabs, Overview selected`, tabs.length === 7 && tabs[0][1] === 'true' && tabs.filter(t => t[1] === 'true').length === 1, JSON.stringify(tabs));
  ok(`account ${width}: html.a3-on and rail visible`, await page.evaluate(() => document.documentElement.classList.contains('a3-on') && getComputedStyle(document.querySelector('.a3-rail')).display !== 'none'));
  ok(`account ${width}: rail is a nav with tablist`, await page.evaluate(() => { const n = document.querySelector('nav.a3-rail'); return n && n.getAttribute('aria-label') === 'Account sections' && !!n.querySelector('[role=tablist]'); }));
  // keyboard
  await page.focus('#a3-tab-overview');
  await page.keyboard.press(width === 375 ? 'ArrowRight' : 'ArrowDown');
  let st = await page.evaluate(() => [document.activeElement.id, document.querySelector('#a3-tab-map').getAttribute('aria-selected'), document.querySelector('#a3-tab-overview').getAttribute('aria-selected'), location.hash]);
  ok(`account ${width}: arrow moves to Map and lists, aria-selected follows, hash #map`, st[0] === 'a3-tab-map' && st[1] === 'true' && st[2] === 'false' && st[3] === '#map', JSON.stringify(st));
  const mapVis = await page.evaluate(() => { const v = s => { const e = document.querySelector(s); return !!e && e.getClientRects().length > 0; }; return [v('[data-tll-acct=map]'), v('[data-tll-ls=sec]'), v('.tll-pickin-card'), v('[data-tll-wr=sec]'), v('#a3-ph-map')]; });
  ok(`account ${width}: Map tab shows map and lists only`, JSON.stringify(mapVis) === '[true,true,false,false,true]', JSON.stringify(mapVis));
  await page.keyboard.press('End'); st = await page.evaluate(() => document.activeElement.id); ok(`account ${width}: End goes to last tab`, st === 'a3-tab-settings', st);
  await page.keyboard.press('Home'); st = await page.evaluate(() => document.activeElement.id); ok(`account ${width}: Home goes to first tab`, st === 'a3-tab-overview', st);
  await page.keyboard.press(width === 375 ? 'ArrowLeft' : 'ArrowUp'); st = await page.evaluate(() => document.activeElement.id); ok(`account ${width}: arrow wraps from first to last`, st === 'a3-tab-settings', st);
  const roving = await page.$$eval('[role=tab][data-a3-tab]', els => els.filter(e => e.tabIndex === 0).length); ok(`account ${width}: one tab in the tab order (roving tabindex)`, roving === 1);
  // click focuses the panel
  await page.click('#a3-tab-pets'); st = await page.evaluate(() => [document.activeElement.id, document.querySelector('#a3-ph-pets h2').textContent]);
  ok(`account ${width}: click focuses the panel heading`, st[0] === 'a3-ph-pets' && st[1] === 'Pets', JSON.stringify(st));
  ok(`account ${width}: Pets panel labelled by its tab`, await page.evaluate(() => { const b = document.querySelectorAll('.tll-account-mine-block')[1]; return b.getAttribute('role') === 'tabpanel' && b.getAttribute('aria-labelledby') === 'a3-tab-pets' && b.getClientRects().length > 0 && document.querySelectorAll('.tll-account-mine-block')[0].getClientRects().length === 0; }));
  await page.click('#a3-tab-privacy'); st = await page.evaluate(() => [document.activeElement.textContent, !!document.querySelector('.a3-note a[data-a3-go=card]'), document.querySelector('.tll-pickin-card').getClientRects().length]);
  ok(`account ${width}: Privacy shows the data block, focuses "Your data stays yours."`, st[0] === 'Your data stays yours.' && st[1] && st[2] === 0, JSON.stringify(st));
  await page.click('.a3-note a[data-a3-go=card]'); ok(`account ${width}: privacy note jumps to Share card tab`, await page.evaluate(() => document.querySelector('#a3-tab-card').getAttribute('aria-selected') === 'true' && document.querySelector('#tll-share-host').getClientRects().length > 0));
  await page.click('#a3-tab-overview');
  // content checks
  const hero = await page.evaluate(() => ({ status: [...document.querySelectorAll('.a3-status li')].map(l => l.textContent), prog: document.querySelector('.a3-prog-top').textContent, bar: document.querySelector('.a3-bar').getAttribute('aria-valuenow'), edit: document.querySelector('.a3-btn-edit').getAttribute('href'), signout: document.querySelector('[data-tll-acct-signout]').getAttribute('data-ms-action') }));
  ok(`account ${width}: status line from share-level and directory flags`, hero.status.join('|') === 'PROFILE · LINK ONLY|DIRECTORY · /EXPATS', JSON.stringify(hero.status));
  ok(`account ${width}: progress 5 of 7, next is photo`, hero.prog.startsWith('PROFILE 5 OF 7 DONE') && hero.prog.includes('Add: photo') && hero.bar === '5', hero.prog);
  ok(`account ${width}: Edit profile and Sign out side by side, logout attribute intact`, hero.edit === '/edit-profile' && hero.signout === 'logout');
  const fin = await page.$$eval('.a3-finish li', ls => ls.map(l => l.textContent));
  ok(`account ${width}: Finish your profile lists 7 checks with done/to do text`, fin.length === 7 && fin.filter(t => t.includes('(done)')).length === 5, JSON.stringify(fin));
  const nums = await page.evaluate(() => ({ badge: document.querySelector('[data-a3-badge=map]').textContent, pets: document.querySelector('[data-a3-badge=pets]').textContent, count: document.querySelector('[data-tll-mod=countries]').parentNode.querySelector('.tll-mod-count').textContent, after: getComputedStyle(document.querySelector('[data-tll-mod=countries]').parentNode.querySelector('.tll-mod-count'), '::after').content }));
  ok(`account ${width}: LOGGED shows computed total with "of 249"; badges mirror live counts`, nums.count === '3' && nums.badge === '3' && nums.pets === '1' && nums.after.includes('of 249'), JSON.stringify(nums));
  await page.click('#a3-tab-map');
  const rule = await page.evaluate(() => document.querySelector('.a3-rule').textContent);
  ok(`account ${width}: list rule line for Countries`, rule === 'WHAT COUNTSSet foot outside the airport. Layovers count separately.', rule);
  await page.click('[data-tll-ls-tab=airports]'); await page.waitForTimeout(50);
  ok(`account ${width}: rule line follows the list tab`, (await page.evaluate(() => document.querySelector('.a3-rule').textContent)).endsWith('Connected through or flew from.'));
  await page.click('[data-tll-ls-tab=bridges]'); await page.waitForTimeout(50);
  ok(`account ${width}: no rule line where the design has none`, await page.evaluate(() => document.querySelector('.a3-rule').hidden));
  const order = await page.evaluate(() => { const y = s => document.querySelector(s).getBoundingClientRect().top; return y('[data-tll-log]') < y('[data-tll-ls=sheet]') && y('[data-tll-ls=tabs]') < y('[data-tll-log]'); });
  ok(`account ${width}: Log a place sits above the sheet, under the chips`, order);
  const chip = await page.evaluate(() => { const a = document.querySelector('[data-tll-ls-tab=countries]'); const r = a.getBoundingClientRect(); const b = getComputedStyle(a, '::before'); return [Math.round(r.height), b.top, b.bottom]; });
  ok(`account ${width}: chips 32px with 44px hit area`, chip[0] === 32 && chip[1] === '-6px', JSON.stringify(chip));
  const small = await page.evaluate(() => [...document.querySelectorAll('.a3-tab,.a3-rail-link,.a3-cta,.a3-btn-edit,[data-tll-acct-signout],.a3-add,.a3-prog-top a')].filter(e => e.getClientRects().length && e.getBoundingClientRect().height < 44).map(e => e.className + ':' + e.getBoundingClientRect().height));
  ok(`account ${width}: new controls are 44px tall or more`, small.length === 0, JSON.stringify(small));
  const trans = await page.evaluate(() => [...document.querySelectorAll('.a3-tab,.a3-btn-edit,.tll-pickin-card,[data-tll-ls=tabs] a')].map(e => getComputedStyle(e).transitionProperty).filter(p => p.includes('all')));
  ok(`account ${width}: no "transition: all" on restyled controls`, trans.length === 0, JSON.stringify(trans));
  ok(`account ${width}: a3 made no Memberstack writes`, (await page.evaluate(() => window.__msWrites.length)) === 0);
  ok(`account ${width}: no console errors`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}
// hash on load and reload
{ const { page, ctx, errors } = await open('out-account-member.html', { hash: '#stories' });
  ok('account: #stories opens the Stories tab', await page.evaluate(() => document.querySelector('#a3-tab-stories').getAttribute('aria-selected') === 'true' && document.querySelectorAll('.tll-account-mine-block')[0].getClientRects().length > 0));
  await page.click('#a3-tab-card'); await page.reload(); await page.waitForTimeout(800);
  ok('account: reload keeps the tab from the hash', await page.evaluate(() => document.querySelector('#a3-tab-card').getAttribute('aria-selected') === 'true'));
  await page.screenshot({ path: dir + 'account-member-1280-card.png', fullPage: true });
  ok('account hash run: no console errors', errors.length === 0, errors.join(' | ')); await ctx.close(); }
// reduced motion
{ const { page, ctx } = await open('out-account-member.html', { reduced: true });
  const r = await page.evaluate(() => [...document.querySelectorAll('.a3-tab,.a3-btn-edit,.tll-pickin-card,[data-tll-ls=tabs] a,[data-tll-wr=hide]')].map(e => getComputedStyle(e).transitionDuration).filter(d => d.split(',').some(x => parseFloat(x) > 0)));
  ok('account: reduced motion turns transitions off', r.length === 0, JSON.stringify(r)); await ctx.close(); }
{ const { page, ctx } = await open('out-account-member.html');
  const r = await page.evaluate(() => getComputedStyle(document.querySelector('.a3-tab')).transitionDuration);
  ok('account: transitions present without reduced motion (150ms)', r.includes('0.15s'), r); await ctx.close(); }
// empty member: honest empty states, no fake numbers
{ const { page, ctx, errors } = await open('out-account-member-empty.html', { width: 375 });
  const r = await page.evaluate(() => ({ prog: document.querySelector('.a3-prog-top').textContent, status: [...document.querySelectorAll('.a3-status li')].map(l => l.textContent), badge: document.querySelector('[data-a3-badge=map]').textContent }));
  ok('account (new member): 0 of 7, JUST YOU, DIRECTORY OFF, no badge number', r.prog.startsWith('PROFILE 0 OF 7 DONE') && r.status.join('|') === 'PROFILE · JUST YOU|DIRECTORY · OFF' && r.badge === '', JSON.stringify(r));
  ok('account (new member): pets empty state no longer names Magnus', !(await page.evaluate(() => document.body.innerText.includes('Magnus'))));
  ok('account (new member): no console errors', errors.length === 0, errors.join(' | ')); await ctx.close(); }
// signed out
for (const width of [1280, 375]) {
  const { page, ctx, errors } = await open('out-account-anon.html', { width });
  await page.screenshot({ path: dir + `account-anon-${width}.png`, fullPage: true });
  const r = await page.evaluate(() => ({ anon: document.documentElement.classList.contains('tll-anon'), rail: !!document.querySelector('.a3-rail') && document.querySelector('.a3-rail').getClientRects().length > 0, lines: [...document.querySelectorAll('.a3-gate li')].map(l => l.textContent), back: document.querySelector('.a3-gate-back') && document.querySelector('.a3-gate-back').getAttribute('href'), h2: document.querySelector('.tll-account-gateout-title').textContent }));
  ok(`account anon ${width}: gate shows three lines and Back to the stories, no rail`, r.anon && !r.rail && r.lines.length === 3 && r.back === '/stories' && r.h2 === 'Your account is behind the sign-in.', JSON.stringify(r));
  ok(`account anon ${width}: no horizontal scroll`, await noHScroll(page));
  ok(`account anon ${width}: no console errors`, errors.length === 0, errors.join(' | ')); await ctx.close();
}
// JS off: everything stacked, no rail
{ const { page, ctx } = await open('out-account-member.html', { js: false });
  const r = await page.evaluate(() => ({ rail: document.querySelectorAll('.a3-rail').length, cards: document.querySelector('.tll-pickin-card').getClientRects().length > 0, map: document.querySelector('[data-tll-acct=map]').getClientRects().length > 0, settings: document.querySelector('.tll-account-settings-section').getClientRects().length > 0 }));
  ok('account JS off: no rail, every section stacked', r.rail === 0 && r.cards && r.map && r.settings, JSON.stringify(r)); await ctx.close(); }

// ---------- Auth pages ----------
const AUTH = { login: { inputs: { email: 'email', password: 'current-password' } }, signup: { inputs: { 'first-name': 'given-name', email: 'email', password: 'new-password' } }, forgot: { inputs: { email: 'email' } } };
for (const name of Object.keys(AUTH)) for (const width of [1280, 375]) {
  const file = `out-${name}-anon.html`;
  const src = fs.readFileSync(dir + file, 'utf8');
  const { page, ctx, errors } = await open(file, { width });
  await page.screenshot({ path: dir + `${name}-${width}.png`, fullPage: true });
  ok(`${name} ${width}: no horizontal scroll`, await noHScroll(page), await page.evaluate(() => document.documentElement.scrollWidth));
  const f = await page.evaluate(() => [...document.querySelectorAll('form input:not([type=submit]):not([type=checkbox])')].map(i => ({ name: i.name, id: i.id, ac: i.getAttribute('autocomplete'), lab: i.getAttribute('aria-labelledby') && document.getElementById(i.getAttribute('aria-labelledby')).textContent, req: i.required, ms: i.getAttribute('data-ms-member'), type: i.type, min: i.getAttribute('minlength') })));
  const want = AUTH[name].inputs;
  ok(`${name} ${width}: every input labelled by its visible label and has autocomplete`, f.length === Object.keys(want).length && f.every(i => i.ac === want[i.name] && i.lab && i.lab.length > 1), JSON.stringify(f));
  ok(`${name} ${width}: Memberstack attributes, id, name, required untouched`, f.every(i => i.id === 'field' && i.req && i.ms === (i.name === 'first-name' ? 'first-name' : i.name)) && (name !== 'signup' || f.find(i => i.name === 'password').min === '8'));
  const msAttrsBefore = (src.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, '').match(/data-ms-[a-z:-]+="[^"]*"/g) || []).sort().join('|');
  const msAttrsAfter = await page.evaluate(() => [...document.querySelectorAll('*')].flatMap(e => [...e.attributes].filter(a => a.name.startsWith('data-ms-')).map(a => `${a.name}="${a.value}"`)).sort().join('|'));
  ok(`${name} ${width}: every data-ms-* attribute identical after the script`, msAttrsBefore === msAttrsAfter);
  ok(`${name} ${width}: error block has role=alert`, await page.evaluate(() => [...document.querySelectorAll('.w-form-fail')].every(e => e.getAttribute('role') === 'alert')));
  if (name !== 'forgot') {
    await page.click('.au3-eye'); let t = await page.evaluate(() => [document.querySelector('input[name=password]').type, document.querySelector('.au3-eye').getAttribute('aria-pressed'), document.querySelector('.au3-eye').textContent]);
    ok(`${name} ${width}: Show password switches the field and the button state`, t.join('|') === 'text|true|Hide password', t.join('|'));
    await page.evaluate(() => document.querySelector('form').addEventListener('submit', e => e.preventDefault()));
    await page.fill('input[name=email]', 'a@b.co'); await page.fill('input[name=password]', 'longenough1');
    if (name === 'signup') { await page.fill('input[name=first-name]', 'Ana'); await page.check('input[name=Checkbox]'); await page.check('input[name=age-16]'); }
    await page.click('input[type=submit]'); t = await page.evaluate(() => document.querySelector('input[name=password]').type);
    ok(`${name} ${width}: password goes back to hidden on submit`, t === 'password', t);
    await page.reload(); await page.waitForTimeout(500);
  }
  if (name === 'signup') {
    const h = await page.evaluate(() => { const p = document.querySelector('input[name=password]'); const d = p.getAttribute('aria-describedby'); return d && document.getElementById(d).textContent; });
    ok(`signup ${width}: password hint "8 characters or more." tied with aria-describedby`, h === '8 characters or more.', h);
    const cb = await page.evaluate(() => [...document.querySelectorAll('input[type=checkbox]')].map(c => document.getElementById(c.getAttribute('aria-labelledby')).textContent));
    ok(`signup ${width}: both checkboxes named by their sentences`, cb[0].startsWith('I have read and agree') && cb[1] === 'I am 16 or older.', JSON.stringify(cb));
    const lede = await page.evaluate(() => document.querySelector('.tll-auth-sub').textContent);
    ok(`signup ${width}: lede ends with the protected line`, lede.endsWith('Free to join. We\'re not a gym.'), lede);
  }
  await page.evaluate(() => document.querySelector('form').addEventListener('submit', e => e.preventDefault()));
  await page.click('input[type=submit]'); await page.waitForTimeout(100);
  const inv = await page.evaluate(() => [...document.querySelectorAll('[aria-invalid=true]')].map(i => [i.name, document.getElementById(i.getAttribute('aria-describedby').split(' ').pop()).textContent, getComputedStyle(i).borderTopColor]));
  ok(`${name} ${width}: empty submit marks fields invalid with a sentence and a Rose border`, inv.length >= 1 && inv.every(x => x[1].length > 5), JSON.stringify(inv));
  await page.fill('input[name=email]', 'a@b.co'); await page.waitForTimeout(50);
  ok(`${name} ${width}: fixing the field clears its message`, await page.evaluate(() => !document.querySelector('input[name=email]').hasAttribute('aria-invalid') && !document.getElementById('au3-e-email')));
  const small = await page.evaluate(() => [...document.querySelectorAll('.tll-auth-card a, .tll-forgot-card a, .tll-auth-card button, input[type=submit], .tll-btn-google, .au3-eye, .tll-auth-alt a')].filter(e => !e.closest('.tll-auth-charter-check')).filter(e => e.getClientRects().length && e.getBoundingClientRect().height < 44).map(e => e.textContent.trim().slice(0, 30) + ':' + Math.round(e.getBoundingClientRect().height)));
  ok(`${name} ${width}: links and buttons in the card are 44px tall or more (inline links inside the consent sentence are exempt, WCAG 2.5.8 inline exception)`, small.length === 0, JSON.stringify(small));
  const bg = await page.evaluate(() => getComputedStyle(document.querySelector('.tll-auth-section,.tll-forgot-section')).backgroundColor);
  ok(`${name} ${width}: section is Ink`, bg === 'rgb(10, 11, 20)', bg);
  ok(`${name} ${width}: no console errors`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}
for (const name of ['login', 'signup', 'forgot']) {
  const { page, ctx } = await open(`out-${name}-anon.html`, { reduced: true });
  const r = await page.evaluate(() => [...document.querySelectorAll('.tll-auth-input,.tll-auth-submit,.tll-btn-google')].map(e => getComputedStyle(e).transitionDuration).filter(d => d.split(',').some(x => parseFloat(x) > 0)));
  ok(`${name}: reduced motion turns transitions off`, r.length === 0, JSON.stringify(r)); await ctx.close();
}
await browser.close();
fs.writeFileSync(dir + 'results.txt', results.join('\n') + '\n');
console.log(results.join('\n')); console.log(fails ? `${fails} FAILED` : 'ALL PASS');
