/* Sweep 21 Nov 2026, lens UX: journeys. One action set per page; everything read only, non-GET aborted (h.cjs), sends stubbed in the page.
   Usage: NODE_PATH=/opt/node22/lib/node_modules node jour.cjs <name> */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { load, sleep } = require('./h.cjs');
const SP = '/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-ux';
const SHOT = path.join(SP, 'shots');
const mask = s => String(s).replace(/contributors\/[^/?#\s"'):]+/g, 'contributors/<profile>');
const vis = `(x=>{if(!x)return false;const r=x.getBoundingClientRect();if(r.width<1||r.height<1)return false;for(let e=x;e;e=e.parentElement){const c=getComputedStyle(e);if(c.display==='none'||c.visibility==='hidden')return false;}return true;})`;

const J = {
  /* home: first screen CTAs, home search parameter, cover story click */
  async home(page, w) {
    const R = {};
    R.fold = await page.evaluate(`(()=>{const v=${vis};return [].filter.call(document.querySelectorAll('a[href],button'),a=>{const r=a.getBoundingClientRect();return v(a)&&r.top<innerHeight&&r.bottom>0;}).map(a=>((a.innerText||a.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,40))+' -> '+(a.getAttribute('href')||'button'))})()`);
    const s = await page.$('#Search-the-library'); if (s) { await s.scrollIntoViewIfNeeded(); await s.fill('Lisbon'); const [nav] = await Promise.all([page.waitForNavigation({ timeout: 8000 }).catch(() => null), s.press('Enter')]); R.homeSearch = page.url().replace(/^https:\/\/[^/]+/, ''); }
    return R;
  },
  async stories(page, w) {
    const R = {};
    const count = () => page.evaluate(`(()=>{const v=${vis};const c=[].filter.call(document.querySelectorAll('[data-tll-card]'),x=>v(x));const n=document.getElementById('tll-q-note');return {shown:c.length,note:n&&v(n)?n.innerText.trim().slice(0,120):null,url:location.pathname+location.search};})()`);
    R.all = await count();
    for (const q of ['Lisbon', 'Portugal', 'dog', 'food', 'Travel Logistics', 'zzqx']) { await page.goto('https://www.thatlayover.life/stories?q=' + encodeURIComponent(q), { waitUntil: 'load' }); await sleep(2500); R['q_' + q] = await count(); if (q === 'zzqx') await page.screenshot({ path: path.join(SHOT, 'stories-' + w + '-noresults.jpg'), type: 'jpeg', quality: 55 }); }
    await page.goto('https://www.thatlayover.life/stories', { waitUntil: 'load' }); await sleep(3000);
    const chip = await page.$('.tll-shelf-chip:text("Asia")') || await page.$('text=Asia'); if (chip) { await chip.scrollIntoViewIfNeeded(); await chip.click(); await sleep(1200); R.chipAsia = await count(); R.chipUrl = page.url().replace(/^https:\/\/[^/]+/, ''); }
    const anta = await page.$('.tll-shelf-chip:text("Antarctica")'); if (anta) { await anta.click(); await sleep(1200); R.chipAntarctica = await count(); await page.screenshot({ path: path.join(SHOT, 'stories-' + w + '-antarctica.jpg'), type: 'jpeg', quality: 55 }); }
    R.chips = await page.evaluate(() => [].map.call(document.querySelectorAll('.tll-shelf-chip,.tll-filter-chip'), c => (c.innerText || '').trim()).filter(Boolean));
    R.themeUi = await page.evaluate(() => /Travel Logistics|Cultural Intelligence|Paw Passport/.test([].map.call(document.querySelectorAll('button,a.tll-shelf-chip,.tll-filter-chip,select option'), x => x.innerText).join(' ')));
    return R;
  },
  async story(page, w) {
    const R = {};
    R.after = await page.evaluate(`(()=>{const v=${vis};const b=document.querySelector('.tll-story-body,.w-richtext,[class*="story-body"]');const y=b?b.getBoundingClientRect().bottom+scrollY:0;
      return {bodyEnd:Math.round(y),docH:document.documentElement.scrollHeight,links:[].filter.call(document.querySelectorAll('a[href],button'),a=>v(a)&&a.getBoundingClientRect().top+scrollY>y&&!a.closest('footer,.tll-footer')).map(a=>((a.innerText||a.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,38))+' -> '+(a.getAttribute('href')||'btn')).slice(0,40),
      heads:[].filter.call(document.querySelectorAll('h2,h3'),h=>v(h)&&h.getBoundingClientRect().top+scrollY>y&&!h.closest('footer')).map(h=>h.innerText.trim().slice(0,50))};})()`);
    R.after.links = R.after.links.map(mask);
    R.save = await page.evaluate(() => { const b = document.querySelector('.tll-save-btn'); if (!b) return null; const r = b.getBoundingClientRect(); return { t: b.innerText.trim(), w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top + scrollY) }; });
    const sb = await page.$('.tll-save-btn'); if (sb) { await sb.scrollIntoViewIfNeeded(); await sb.click().catch(() => { }); await sleep(1200); R.saveAfter = await page.evaluate(() => ({ url: location.pathname, btn: (document.querySelector('.tll-save-btn') || {}).innerText, dlg: [].map.call(document.querySelectorAll('[role=dialog],[role=alertdialog],.tll-toast,[class*="toast"]'), d => (d.innerText || '').trim().slice(0, 100)).filter(Boolean) })); R.saveAfter.url = mask(R.saveAfter.url); }
    return R;
  },
  async auth(page, w, file) {
    const R = {};
    R.fields = await page.evaluate(`(()=>{const v=${vis};return [].filter.call(document.querySelectorAll('input:not([type=hidden]),button,a[href]'),x=>v(x)&&x.closest('main,form,[class*="auth"]')&&!x.closest('nav,footer,.tll-footer,[class*="tll-nav"]')).map(x=>x.tagName.toLowerCase()+(x.type?':'+x.type:'')+' "'+((x.labels&&x.labels[0]&&x.labels[0].innerText)||x.getAttribute('aria-label')||x.placeholder||x.innerText||x.value||'').trim().replace(/\\s+/g,' ').slice(0,40)+'" req='+!!x.required+' ac='+(x.getAttribute('autocomplete')||'')+' '+(x.getAttribute('href')||'')).slice(0,30)})()`);
    const sub = await page.$('form [type=submit]'); if (sub) { await sub.scrollIntoViewIfNeeded(); await sub.click().catch(e => R.clickErr = String(e).slice(0, 80)); await sleep(800);
      R.empty = await page.evaluate(() => { const a = document.activeElement; return { focus: a && (a.name || a.type || a.tagName), msg: a && a.validationMessage }; }); }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({ path: path.join(SHOT, file + '-' + w + '-empty.jpg'), type: 'jpeg', quality: 55 });
    R.pwToggle = await page.evaluate(() => !!document.querySelector('[data-ms-action="show-password"],[aria-label*="password" i][role=button],button[aria-label*="password" i],.tll-pw-toggle'));
    return R;
  },
  async notfound(page, w) {
    return await page.evaluate(`(()=>{const v=${vis};const m=document.querySelector('main')||document.body;return {h1:[].map.call(document.querySelectorAll('h1'),h=>h.innerText.trim()),text:(m.innerText||'').replace(/\\s+/g,' ').slice(0,500),links:[].filter.call(m.querySelectorAll('a[href]'),a=>v(a)&&!a.closest('nav,footer,.tll-footer')).map(a=>a.innerText.trim().slice(0,30)+' -> '+a.getAttribute('href')).slice(0,15),search:!!m.querySelector('input[type=search],input[name=q]')};})()`);
  },
  async expats(page, w) {
    const R = {};
    const i = await page.$('input[placeholder*="country" i]'); if (i) { await i.scrollIntoViewIfNeeded(); await i.fill('Denmark'); await i.press('Enter'); await sleep(1500);
      R.after = await page.evaluate(() => (document.activeElement && document.activeElement.closest('section') || document.body).innerText.replace(/\s+/g, ' ').slice(0, 400)); await page.screenshot({ path: path.join(SHOT, 'for-expats-' + w + '-finder.jpg'), type: 'jpeg', quality: 55 }); }
    R.checks = await page.evaluate(() => [].map.call(document.querySelectorAll('input[type=checkbox]'), c => { const l = c.closest('label') || (c.id && document.querySelector('label[for="' + c.id + '"]')); const r = (l || c).getBoundingClientRect(); return c.name + ' wrapLabel=' + !!c.closest('label') + ' for=' + !!(c.id && document.querySelector('label[for="' + c.id + '"]')) + ' hit=' + Math.round(r.width) + 'x' + Math.round(r.height) + ' txt="' + ((l && l.innerText) || (c.parentElement && c.parentElement.innerText) || '').trim().slice(0, 50) + '"'; }));
    return R;
  },
  async map(page, w, file) {
    const R = {};
    R.unnamed = await page.evaluate(`(()=>{const v=${vis};return [].filter.call(document.querySelectorAll('button'),b=>v(b)&&!(b.innerText||'').trim()&&!b.getAttribute('aria-label')&&!b.getAttribute('title')&&!b.getAttribute('aria-labelledby')).map(b=>{const p=b.parentElement;return (p?(p.tagName.toLowerCase()+'.'+String(p.className).split(' ')[0]):'')+'>button.'+String(b.className).split(' ')[0]+' '+Math.round(b.getBoundingClientRect().width)+'x'+Math.round(b.getBoundingClientRect().height)+' html:'+b.innerHTML.replace(/\\s+/g,' ').slice(0,120)}).slice(0,6)})()`);
    R.unnamedN = await page.evaluate(`(()=>{const v=${vis};return [].filter.call(document.querySelectorAll('button'),b=>v(b)&&!(b.innerText||'').trim()&&!b.getAttribute('aria-label')&&!b.getAttribute('title')).length})()`);
    R.receipts = await page.evaluate(() => { const h = [].find.call(document.querySelectorAll('h2,h3'), x => /Every list/.test(x.innerText || '')); if (!h) return null; const sec = h.closest('section') || h.parentElement.parentElement;
      const cards = [].filter.call(sec.querySelectorAll('*'), x => /COUNTRIES/i.test((x.firstElementChild && x.firstElementChild.innerText) || '') && x.getBoundingClientRect().height > 200).slice(-1)[0];
      if (!cards) return 'no card'; const p = cards.parentElement, cs = getComputedStyle(p), r = cards.getBoundingClientRect(), pr = p.getBoundingClientRect();
      return { card: cards.tagName + '.' + String(cards.className).split(' ').slice(0, 2).join('.'), cardW: Math.round(r.width), parent: p.tagName + '.' + String(p.className).split(' ').slice(0, 2).join('.'), parentW: Math.round(pr.width), display: cs.display, cols: cs.gridTemplateColumns, kids: p.children.length, kidsShown: [].filter.call(p.children, k => k.getBoundingClientRect().height > 0).length }; });
    R.sheet = await page.evaluate(() => [].filter.call(document.querySelectorAll('*'), x => /^\s*DONE\s*$/i.test(x.innerText || '') && x.tagName === 'BUTTON').map(b => { let s = b; while (s && getComputedStyle(s).position !== 'fixed' && getComputedStyle(s).position !== 'sticky' && getComputedStyle(s).position !== 'absolute') s = s.parentElement; const r = b.getBoundingClientRect(); return { shown: r.height > 0, y: Math.round(r.top), pos: s ? getComputedStyle(s).position : 'static', cls: s ? String(s.className).slice(0, 60) : '' }; }));
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    const shots = [];
    for (const y of [0, 900, 1800, 2700]) { await page.evaluate(yy => window.scrollTo(0, yy), y); await sleep(700); const f = 'the-map-' + w + '-' + file.split('-').pop() + '-y' + y + '.jpg'; await page.screenshot({ path: path.join(SHOT, f), type: 'jpeg', quality: 50 }); shots.push(f); }
    R.shots = shots;
    return R;
  },
  async form(page, w, file) {
    const R = {};
    R.fields = await page.evaluate(`(()=>{const v=${vis};return [].filter.call(document.querySelectorAll('main input:not([type=hidden]),main select,main textarea,form input:not([type=hidden]),form select,form textarea'),x=>(v(x)||x.type==='file'||x.type==='checkbox')&&!x.closest('#tll-note-form,nav,footer,.tll-footer')).map(x=>x.tagName.toLowerCase()+':'+(x.type||'')+' name='+x.name+' "'+((x.labels&&[].map.call(x.labels,l=>l.innerText).join('|'))||x.getAttribute('aria-label')||x.placeholder||'').trim().replace(/\\s+/g,' ').slice(0,50)+'" req='+!!x.required+' vis='+v(x)).slice(0,40)})()`);
    R.forms = await page.evaluate(`(()=>{const v=${vis};return [].map.call(document.querySelectorAll('form'),f=>({id:f.id||f.getAttribute('data-tll-form')||f.name,vis:v(f),ms:[].slice.call(f.attributes).filter(a=>/^data-ms/.test(a.name)).map(a=>a.name).join(',')}))})()`);
    R.texts = await page.evaluate(`(()=>{const v=${vis};const m=document.querySelector('main')||document.body;return [].filter.call(m.querySelectorAll('h1,h2,h3,legend,.w-form-label,label,button,input[type=submit],p'),x=>v(x)&&!x.closest('footer,.tll-footer,nav,#tll-note-form')).map(x=>(x.innerText||x.value||'').trim().replace(/\\s+/g,' ').slice(0,90)).filter(Boolean).slice(0,60)})()`);
    const posts = []; await page.route('**/*', async route => { const q = route.request(); if (q.method() !== 'GET') { posts.push(q.method() + ' ' + q.url().replace(/\?.*/, '').replace(/form\/[^/]+/, 'form/<site>').slice(0, 80)); return route.abort(); } return route.fallback(); });
    const sub = await page.evaluateHandle(`(()=>{const v=${vis};return [].find.call(document.querySelectorAll('form [type=submit]'),b=>v(b)&&!b.closest('#tll-note-form,nav,footer,.tll-footer,.tll-home-search'))||null})()`);
    if (sub && sub.asElement()) { const el = sub.asElement(); R.submitLabel = await el.evaluate(b => (b.value || b.innerText || '').trim()); await el.scrollIntoViewIfNeeded(); await el.click().catch(e => R.clickErr = String(e).slice(0, 80)); await sleep(1200);
      R.empty = await page.evaluate(() => { const a = document.activeElement; const inv = [].filter.call(document.querySelectorAll('form :invalid'), x => x.name && !x.closest('#tll-note-form')).map(x => x.name + (x.offsetParent ? '' : ' (hidden)')); return { focus: a && (a.name || a.type || a.tagName), msg: a && a.validationMessage, invalid: inv.slice(0, 12) }; });
      await page.screenshot({ path: path.join(SHOT, file + '-' + w + '-' + (R.signed || '') + 'empty-send.jpg'), type: 'jpeg', quality: 55 }); }
    R.posts = posts;
    return R;
  },
  async account(page, w) {
    const R = {};
    R.tabs = await page.evaluate(`(()=>{const v=${vis};return [].filter.call(document.querySelectorAll('[role=tab],[data-a3-go],.w-tab-link'),x=>v(x)).map(x=>(x.innerText||'').trim().slice(0,30)+' '+(x.getAttribute('data-a3-go')||x.getAttribute('href')||''))})()`);
    R.text = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.replace(/\s+/g, ' ').slice(0, 1600));
    R.links = await page.evaluate(`(()=>{const v=${vis};const m=document.querySelector('main')||document.body;return [].filter.call(m.querySelectorAll('a[href]'),a=>v(a)&&!a.closest('nav,footer,.tll-footer')).map(a=>(a.innerText||a.getAttribute('aria-label')||'').trim().replace(/\\s+/g,' ').slice(0,36)+' -> '+a.getAttribute('href')).slice(0,60)})()`);
    R.links = R.links.map(mask);
    return R;
  },
};

(async () => {
  const name = process.argv[2];
  const plan = {
    home: [['home.html', 'home']], stories: [['stories.html', 'stories']],
    story: [['stories__lisbon-sun-sails-city-built-to-stand-back-up.html', 'story'], ['stories__vietnam-ninja-duckies.html', 'story']],
    auth: [['signup.html', 'auth'], ['login.html', 'auth']], nf: [['this-page-does-not-exist-sweep.html', 'notfound']],
    expats: [['for-expats.html', 'expats']], map: [['the-map.html', 'map']],
    forms: [['share-photos.html', 'form'], ['my-pets.html', 'form']],
    acct: [['account.html', 'account']],
  }[name];
  const signedSets = { forms: [0, 1], acct: [1], story: [0, 1], map: [0, 1] };
  const browser = await chromium.launch({ args: ['--no-sandbox'], proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:44389' } });
  const out = path.join(SP, 'results', 'jour-' + name + '.jsonl');
  try { for (const [f, fn] of plan) for (const w of [390, 1440]) for (const s of (signedSets[name] || [0])) {
      global.__ACT = async (page, file, ww, signed) => J[fn](page, ww, file.replace('.html', '') + (signed ? '-in' : '-out'));
      const st = await load(browser, f, w, !!s); st.file = f;
      fs.appendFileSync(out, JSON.stringify({ file: f, w, signed: s, act: st.act, errs: st.errs, nonGet: st.nonGet }) + '\n'); console.log(f, w, s, JSON.stringify(st.act).slice(0, 300)); } }
  finally { await browser.close(); }
})();
