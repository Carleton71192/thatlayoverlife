// /submit: the account read waits for Memberstack (21 Nov 2026, reports/evidence/submit-account-read-2026-11-21/fix.md).
// On the real page Memberstack is added later by the site header (tll_memberstack_init_v2), so the steps script's account read
// at DOMContentLoaded was skipped: a signed-in writer's draft never followed them to another browser, the credit links were never
// prefilled, and the 18 Nov "Already sent" line never showed. Also, a blank visit let the autosave save only the fields other
// scripts fill, which led to a wrong "Draft restored" over an empty form on the next visit.
// This test runs the live footer (webflow-c2-before.html, confirmed equal to www on 21 Nov) and the proposed one
// (webflow-c2-after.html) with photo clean and the built submit chunk on the story form as exported, in the mini DOM, with
// Memberstack arriving 0 s, 2 s or 20 s after the steps script, or never. Memberstack, Cloudinary, Webflow's form handler and the
// Worker are stand-ins; nothing is sent anywhere; no real member data.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createDom } from './mini-dom.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const DIR = 'reports/evidence/submit-account-read-2026-11-21/';
const BEFORE_HTML = read(DIR + 'webflow-c2-before.html');
const AFTER_HTML = read(DIR + 'webflow-c2-after.html');
const LIVE_18NOV = read('reports/evidence/submit-save-2026-11-17/webflow-c-after.html');
const PHOTO_CLEAN = read('src/components/photo-clean/tll-photo-clean-v1.js');
const CHUNK = read('src/site-layers/chunks/submit.js');
const FORM = read('src/pages/submit/live-2026-10-29/form-story-export-2026-10-13.html');
const WORKER = 'https://tll-travel-wire.thatlayoverlife.workers.dev/intake';
const SENT_NOTE = 'Already sent to the editor. A copy stays in your account.';
const RESTORED = 'Draft restored from your last visit.';
const STEPS_RE = /<script id="tll-form-steps-js-v2">([\s\S]*?)<\/script>/;
const BEFORE = STEPS_RE.exec(BEFORE_HTML)[1];
const AFTER = STEPS_RE.exec(AFTER_HTML)[1];
// c3 (same day, check note 1): a leftover copy in this browser with none of the four fields is removed at load instead of filled
const C3_HTML = read(DIR + 'webflow-c3-after.html');
const C3 = STEPS_RE.exec(C3_HTML)[1];

const PAGE = FORM.replace(/<\/form><\/div>\s*$/, '</form><div class="w-form-done" style="display:none"><div>It is with the editor. Your draft stays in your account either way.</div></div>'
  + '<div class="w-form-fail" style="display:none"><div>That did not send.</div></div></div>');
const clone = (x) => JSON.parse(JSON.stringify(x));
const DRAFT = { at: '2026-11-20T18:00:00.000Z', fields: { name: 'The night bus', excerpt: 'Two cities, one missed ferry.', body: 'We missed the ferry and took the night bus instead.', country: 'Greece', 'credit-mode=named': 1 } };

// One page load. `account` is the stand-in member JSON, kept across visits; `late` is when Memberstack shows up (ms after the
// steps script runs; null = never, signed out); `browser` is this browser's localStorage, carried from one visit to the next.
function visit({ block, account, late = 0, browser = new Map(), customFields = {}, slowDraftWrite = 0, chunkFirst = false }) {
  const dom = createDom({ pathname: '/submit', html: PAGE });
  for (const [k, v] of browser) dom.store.set(k, v);
  const d = dom.document; const w = dom.window;
  const form = d.querySelector('form[data-tll-form="submit-story"]'); const btn = form.querySelector('[type="submit"]');
  const done = d.querySelector('.w-form-done');
  const reads = []; const posts = []; let shownAt = null;
  const ms = {
    getMemberCookie: () => 'tok_test',
    getCurrentMember: () => Promise.resolve({ data: { id: 'mem_test', customFields: clone(customFields) } }),
    getMemberJSON: () => { reads.push(dom.now()); return new Promise((res) => w.setTimeout(() => res({ data: clone(account.json) }), 200)); },
    updateMemberJSON: ({ json }) => new Promise((res) => w.setTimeout(() => {
      account.json = clone(json); account.writes.push({ at: dom.now(), json: clone(json) }); res({ data: json });
    }, json.tllStoryDraft && !json.tllStoryDraft.sent && slowDraftWrite ? slowDraftWrite : 300)),
  };
  if (late === 0) w.$memberstackDom = ms;
  else if (late !== null) w.setTimeout(() => { w.$memberstackDom = ms; }, late);
  d.addEventListener('submit', (ev) => {
    const f = ev.target; ev.preventDefault(); posts.push(dom.now()); btn.disabled = true;
    w.setTimeout(() => { f.style.display = 'none'; done.style.display = 'block'; shownAt = dom.now(); dom.mutate(done); }, 2000);
  });
  let up = 0;
  const fetch = (url, init) => {
    if (url === WORKER) return new Promise((res) => w.setTimeout(() => res({ ok: true, json: () => Promise.resolve({ saved: true, held: true }) }), 6000));
    if (/^https:\/\/api\.cloudinary\.com\//.test(url)) {
      up += 1; const n = up;
      return new Promise((res) => w.setTimeout(() => res({ ok: true, json: () => Promise.resolve({ secure_url: `https://res.cloudinary.com/idonvlow/image/upload/v${n}/${init.body.get('folder')}/p${n}.jpg` }) }), 4000));
    }
    return Promise.reject(new Error('unexpected fetch ' + url));
  };
  const createImageBitmap = () => Promise.resolve({ width: 4032, height: 3024, close() {} });
  // the live order: the steps script runs at DOMContentLoaded, photo clean at the end of the body, the chunk later from the core
  // (chunkFirst: the chunk before the steps script, the other side of the order, to show when the gallery layer reads this browser's copy)
  if (chunkFirst) dom.run(CHUNK, { fetch, createImageBitmap });
  dom.run(block, { fetch, createImageBitmap });
  dom.run(PHOTO_CLEAN, { fetch, createImageBitmap });
  if (!chunkFirst) dom.run(CHUNK, { fetch, createImageBitmap });
  const q = (n) => form.querySelector(`[name="${n}"]`);
  return { dom, form, btn, done, posts, reads, q, save: form.querySelector('.tllst-save'), browser: dom.store, shownAt: () => shownAt };
}

// what other scripts put in the form on a blank visit (Turnstile token, invite link, photo pick, trip code)
function helpers(t) {
  const w = t.dom.window; const d = t.dom.document;
  for (const n of ['cf-turnstile-response', 'invite-link']) {
    if (!t.q(n)) { const i = d.createElement('input'); i.type = 'hidden'; i.name = n; t.form.appendChild(i); }
  }
  t.q('cf-turnstile-response').value = 'turnstile-token-test';
  t.q('invite-link').value = 'https://www.thatlayover.life/submit?invite=test';
  const pick = t.q('lounge-photo-pick'); pick.add(new w.Option('Cover', 'cover')); pick.value = 'cover';
  t.q('trip-code').value = 'TRIP-TEST';
}

// the writer fills the form and presses Send once (as in test/submit-sent-draft.test.js)
async function writeAndSend(t, wait = 20500) {
  const w = t.dom.window;
  t.form.querySelectorAll('[required]').forEach((e) => {
    if (e.type === 'checkbox') e.checked = true;
    else if (e.localName === 'select') { e.add(new w.Option('Europe', 'europe')); e.value = 'europe'; }
    else if (e.type !== 'file') e.value = 'Filled';
  });
  t.q('body').value = 'A story sent today.';
  t.form.querySelector('input[type="file"][name="hero-image"]').files = [{ name: 'cover.jpg', size: 3100000, lastModified: 1, type: 'image/jpeg' }];
  t.form.querySelector('input[type="file"][name="photo-gallery"]').files = [{ name: 'g1.jpg', size: 2900000, lastModified: 2, type: 'image/jpeg' }];
  await t.dom.tick(wait);
  t.pressedAt = t.dom.now();
  const next = t.form.querySelector('.tllst-next'); next.click(); next.click();
  t.btn.click();
  await t.dom.tick(16000);
}

const waits = (t) => t.dom.timers.filter((x) => !x.every && x.at - t.dom.now() <= 250).length;
const four = (t) => ['name', 'excerpt', 'body', 'country'].map((n) => t.q(n).value);
const prefilled = (t, n) => !!t.q(n).closest('.tll-pen-field').querySelector('.tllst-prefilled');

describe('/submit: the account read waits for Memberstack (submit-account-read-2026-11-21)', () => {
  it('the before file is the 18 Nov footer confirmed on www; the after file changes only the steps script, under the page code limit', () => {
    expect(BEFORE_HTML).toBe(LIVE_18NOV);
    expect(AFTER_HTML.length).toBeLessThan(50000);
    expect(AFTER_HTML.replace(AFTER, '')).toBe(BEFORE_HTML.replace(BEFORE, ''));
    // the 18 Nov sent logic, the autosave's account write and the submit handler are kept as they are
    const keep = BEFORE.split('\n').filter((l) => /sentNow|MutationObserver\(sentNow|pend=ms\.getMemberJSON|removeItem\(KEY\)|function (fields|snap|fill)\(|^pre\(w,links|^function pre\(|^var links=/.test(l));
    expect(keep.length).toBeGreaterThanOrEqual(8);
    keep.forEach((l) => expect(AFTER.split('\n')).toContain(l));
    // line by line: 3 lines go (the autosave guard line and the two lines of the load-time read), 6 come in (their 2
    // replacements, 2 comments, own(), the wait); the rest stays as it is and in the same order
    const bl = BEFORE.split('\n'); const al = AFTER.split('\n');
    const gone = bl.filter((l) => !al.includes(l)); const added = al.filter((l) => !bl.includes(l));
    expect([gone.length, added.length]).toEqual([3, 6]);
    expect(bl.filter((l) => !gone.includes(l))).toEqual(al.filter((l) => !added.includes(l)));
    expect(AFTER).toContain(SENT_NOTE);
    // nothing new a reader sees: the only page text is the same sent line
    const strings = (s) => [...s.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/'([^']*)'/g)].map((m) => m[1]);
    expect(strings(AFTER).filter((x) => !strings(BEFORE).includes(x)).sort()).toEqual(['body', 'country', 'excerpt', 'name']);
  });

  it('Memberstack ready at once (0 s): a new browser gets the account draft, before and after alike', async () => {
    for (const block of [BEFORE, AFTER]) {
      const account = { json: { tllStoryDraft: clone(DRAFT), tllLinks: {} }, writes: [] };
      const t = visit({ block, account, late: 0 });
      await t.dom.tick(1000);
      expect(t.reads).toEqual([0]);
      expect(four(t)).toEqual([DRAFT.fields.name, DRAFT.fields.excerpt, DRAFT.fields.body, DRAFT.fields.country]);
    }
  });

  it('Memberstack 2 s late: before skips the read (the bug); after reads the account once Memberstack is there and fills the form', async () => {
    const account = { json: { tllStoryDraft: clone(DRAFT), tllLinks: {} }, writes: [] };
    const b = visit({ block: BEFORE, account, late: 2000 });
    await b.dom.tick(5000);
    expect(b.reads).toEqual([]);
    expect(four(b)).toEqual(['', '', '', '']);
    const a = visit({ block: AFTER, account, late: 2000 });
    await a.dom.tick(5000);
    expect(a.reads).toEqual([2000]);
    expect(four(a)).toEqual([DRAFT.fields.name, DRAFT.fields.excerpt, DRAFT.fields.body, DRAFT.fields.country]);
    expect(waits(a)).toBe(0); // the wait stopped once it read
    await a.dom.tick(20000); // the autosave then keeps the restored draft, in this browser and the account
    expect(JSON.parse(a.browser.get('tllStoryDraft')).body).toBe(DRAFT.fields.body);
    expect(account.json.tllStoryDraft.fields.body).toBe(DRAFT.fields.body);
    expect(account.json.tllStoryDraft.sent).toBeUndefined();
  });

  it('Memberstack 20 s late: after gives up quietly at 15 s (no read, no fill, no timer left), and the autosave still reaches the account', async () => {
    const account = { json: { tllStoryDraft: clone(DRAFT), tllLinks: {} }, writes: [] };
    const t = visit({ block: AFTER, account, late: 20000 });
    await t.dom.tick(14900);
    expect(waits(t)).toBe(1); // still waiting
    await t.dom.tick(200);
    expect(waits(t)).toBe(0); // gave up at 15 s
    await t.dom.tick(30000);
    expect(t.reads).toEqual([]);
    expect(four(t)).toEqual(['', '', '', '']);
    expect(account.writes).toEqual([]); // blank visit: nothing saved over the account draft
    t.q('body').value = 'Typed after Memberstack came.';
    await t.dom.tick(20000);
    expect(account.json.tllStoryDraft.fields.body).toBe('Typed after Memberstack came.'); // the autosave reads Memberstack each tick, as before
  });

  it('a late account draft never overwrites what the writer typed in this visit', async () => {
    for (const n of ['name', 'excerpt', 'body', 'country']) {
      const account = { json: { tllStoryDraft: clone(DRAFT), tllLinks: {} }, writes: [] };
      const t = visit({ block: AFTER, account, late: 2000 });
      await t.dom.tick(1000);
      t.q(n).value = 'Mine';
      await t.dom.tick(4000);
      expect(t.reads).toEqual([2000]);
      expect(four(t).filter((x) => x).sort()).toEqual(['Mine']); // the typed field kept, nothing mixed in from the account
      await t.dom.tick(16000);
      const kept = account.json.tllStoryDraft.fields; // the autosave saves this visit's words, not the old account draft
      expect(kept[n]).toBe('Mine');
      expect(['name', 'excerpt', 'body', 'country'].filter((k) => kept[k])).toEqual([n]);
    }
  });

  it('a late account draft marked sent shows the already sent line and does not fill the form', async () => {
    const account = { json: { tllStoryDraft: { ...clone(DRAFT), sent: DRAFT.at }, tllLinks: {} }, writes: [] };
    const t = visit({ block: AFTER, account, late: 2000 });
    await t.dom.tick(1000);
    expect(t.save.textContent).not.toBe(SENT_NOTE);
    await t.dom.tick(2000);
    expect(t.save.textContent).toBe(SENT_NOTE);
    expect(t.save.textContent).not.toContain(RESTORED);
    expect(four(t)).toEqual(['', '', '', '']);
  });

  it('the credit website and Instagram are prefilled from the account with a late Memberstack (tllLinks, then custom fields)', async () => {
    const a1 = visit({ block: AFTER, account: { json: { tllLinks: { website: 'https://example.com', instagram: '@example' } }, writes: [] }, late: 2000 });
    await a1.dom.tick(3000);
    expect([a1.q('credit-website').value, a1.q('credit-instagram').value]).toEqual(['https://example.com', '@example']);
    expect([prefilled(a1, 'credit-website'), prefilled(a1, 'credit-instagram')]).toEqual([true, true]);
    const a2 = visit({ block: AFTER, account: { json: {}, writes: [] }, late: 2000, customFields: { website: 'https://example.org', Instagram: '@example2' } });
    await a2.dom.tick(3000);
    expect([a2.q('credit-website').value, a2.q('credit-instagram').value]).toEqual(['https://example.org', '@example2']);
    // the same late load on the live footer prefills nothing
    const b = visit({ block: BEFORE, account: { json: { tllLinks: { website: 'https://example.com', instagram: '@example' } }, writes: [] }, late: 2000 });
    await b.dom.tick(3000);
    expect([b.q('credit-website').value, b.q('credit-instagram').value]).toEqual(['', '']);
    // a link the writer typed first is kept
    const a3 = visit({ block: AFTER, account: { json: { tllLinks: { website: 'https://example.com', instagram: '@example' } }, writes: [] }, late: 2000 });
    a3.q('credit-website').value = 'https://mine.example';
    await a3.dom.tick(3000);
    expect([a3.q('credit-website').value, prefilled(a3, 'credit-website'), a3.q('credit-instagram').value]).toEqual(['https://mine.example', false, '@example']);
  });

  it('a blank visit after a send never writes a draft, so the next visit does not say "Draft restored"', async () => {
    for (const [block, wrong] of [[BEFORE, true], [AFTER, false]]) {
      const account = { json: { tllLinks: {} }, writes: [] };
      const s = visit({ block, account, late: 0 });
      await writeAndSend(s);
      expect(s.posts).toHaveLength(1);
      expect(s.shownAt()).not.toBeNull();
      await s.dom.tick(30000);
      expect(account.json.tllStoryDraft.sent).toBeTruthy();
      // a later visit, same browser, nothing typed, other scripts fill their fields, left open for a minute
      const v = visit({ block, account, browser: s.browser, late: 2000 });
      helpers(v);
      const writes = account.writes.length;
      await v.dom.tick(61000);
      expect(v.browser.has('tllStoryDraft')).toBe(wrong);
      expect(account.writes.length > writes).toBe(wrong);
      expect(!account.json.tllStoryDraft.sent).toBe(wrong);
      if (!wrong) expect(v.save.textContent).toBe(SENT_NOTE);
      // the visit after that, same browser
      const x = visit({ block, account, browser: v.browser, late: 2000 });
      await x.dom.tick(3000);
      expect(x.save.textContent.includes(RESTORED)).toBe(wrong);
      expect(four(x)).toEqual(['', '', '', '']);
      if (!wrong) expect(x.save.textContent).toBe(SENT_NOTE);
    }
  });

  it('the 18 Nov sent mark still waits for an autosave account write on its way (Memberstack 2 s late)', async () => {
    const probe = visit({ block: AFTER, account: { json: {}, writes: [] }, late: 2000 });
    await writeAndSend(probe);
    const took = probe.shownAt() - probe.pressedAt;
    const account = { json: { tllLinks: {} }, writes: [] };
    const t = visit({ block: AFTER, account, late: 2000, slowDraftWrite: 1500 });
    await writeAndSend(t, 40300 - took);
    expect(t.shownAt()).toBe(40300);
    await t.dom.tick(60000);
    const after = account.writes.filter((x) => x.at > t.shownAt());
    expect(after.map((x) => !!x.json.tllStoryDraft.sent)).toEqual([false, true]);
    expect(account.json.tllStoryDraft.sent).toBeTruthy();
    expect(account.json.tllStoryDraft.fields.body).toBe('A story sent today.');
    expect(t.browser.has('tllStoryDraft')).toBe(false);
  });

  it('signed out (no Memberstack ever): the same as today for a typed draft, this browser only; helper fields alone save nothing', async () => {
    const run = async (block) => {
      const t = visit({ block, account: { json: {}, writes: [] }, late: null });
      await t.dom.tick(15500);
      expect(waits(t)).toBe(0); // the wait has ended
      t.q('name').value = 'A title'; t.q('body').value = 'Words';
      await t.dom.tick(10000);
      const saved = t.browser.get('tllStoryDraft'); const line = t.save.textContent;
      const v = visit({ block, account: { json: {}, writes: [] }, browser: t.browser, late: null });
      await v.dom.tick(1000);
      return { saved, line: line.replace(/\d{1,2}:\d{2} [AP]M/, 'T'), restored: v.save.textContent, form: [v.q('name').value, v.q('body').value], reads: t.reads.length + v.reads.length };
    };
    const b = await run(BEFORE); const a = await run(AFTER);
    expect(a).toEqual(b);
    expect(a.restored).toContain(RESTORED);
    expect(a.form).toEqual(['A title', 'Words']);
    expect(a.line).not.toContain('in your account');
    // helper fields only: the live footer saves them as a draft, the new one does not
    for (const [block, saves] of [[BEFORE, true], [AFTER, false]]) {
      const t = visit({ block, account: { json: {}, writes: [] }, late: null });
      helpers(t);
      await t.dom.tick(41000);
      expect(t.browser.has('tllStoryDraft')).toBe(saves);
    }
  });
});

// c3 (21 Nov, check note 1 in reports/evidence/submit-account-read-2026-11-21/check.md): a browser that already holds a copy written
// by the live footer on a blank visit (only fields other scripts fill) kept seeing "Draft restored from your last visit." over an
// empty form with c2, because the gallery layer in the submit chunk says so whenever this browser's copy exists. The gallery layer
// reads that copy only once the steps script has built .tllst-save, and the steps script reads and now removes the copy in the same
// synchronous init, so the footer alone can clean it up (no core change).
const IDLE = 'Your words save as a draft every 20 seconds. Photos are added when you send.';
describe('/submit c3: a leftover copy without the four fields is removed at load (submit-account-read-2026-11-21, check note 1)', () => {
  // a leftover as the live footer writes it: a blank visit, other scripts fill their fields, left open past one autosave tick
  const leftover = async (late = null) => {
    const t = visit({ block: BEFORE, account: { json: {}, writes: [] }, late });
    helpers(t);
    await t.dom.tick(21000);
    const o = JSON.parse(t.browser.get('tllStoryDraft'));
    return { browser: t.browser, o };
  };
  const shot = (t) => ({ four: four(t), line: t.save.textContent, has: t.browser.has('tllStoryDraft') });

  it('files: c3 changes one line of c2 (the load-time read of this browser\'s copy) and adds one comment; c2 files are kept as they are; no new page text', () => {
    expect(createHash('sha384').update(AFTER_HTML).digest('base64')).toBe('12ICmEg6gz0q02hbdXeY36z3wDw0ztw8stfIVqoAk/MWQfvZl6ApO2QPddT8hMGe');
    expect(BEFORE_HTML).toBe(LIVE_18NOV);
    expect(C3_HTML.length).toBeLessThan(50000);
    expect(C3_HTML.replace(C3, '')).toBe(AFTER_HTML.replace(AFTER, ''));
    const al = AFTER.split('\n'); const cl = C3.split('\n');
    const gone = al.filter((l) => !cl.includes(l)); const added = cl.filter((l) => !al.includes(l));
    expect(gone).toEqual(["try{fill(JSON.parse(localStorage.getItem(KEY)||'null'));}catch(e){}"]);
    expect(added).toHaveLength(2);
    expect(added[0]).toMatch(/^\/\* 21 Nov 2026 \(c3\):[^\n]*\*\/$/);
    expect(added[1]).toBe("try{var lo=JSON.parse(localStorage.getItem(KEY)||'null');if(lo&&!own(lo))localStorage.removeItem(KEY);else fill(lo);}catch(e){}");
    expect(al.filter((l) => !gone.includes(l))).toEqual(cl.filter((l) => !added.includes(l)));
    expect(cl.indexOf(added[1])).toBe(al.indexOf(gone[0]) + 1); // same place, after own() and the autosave, before the account read
    const strings = (s) => [...s.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/'([^']*)'/g)].map((m) => m[1]);
    expect(strings(C3).filter((x) => !strings(AFTER).includes(x))).toEqual([]);
    expect(added[0]).not.toMatch(/—|!/);
  });

  it('a leftover from a blank visit on the live footer: c2 says "Draft restored" over an empty form (note 1); c3 removes it at load and shows the plain line, in both script orders', async () => {
    for (const late of [null, 2000]) {
      const { browser, o } = await leftover(late);
      expect(['name', 'excerpt', 'body', 'country'].filter((k) => o[k])).toEqual([]);
      expect(Object.keys(o).sort()).toEqual(expect.arrayContaining(['cf-turnstile-response', 'invite-link', 'trip-code']));
      const b = visit({ block: AFTER, account: { json: {}, writes: [] }, browser: new Map(browser), late });
      await b.dom.tick(3500);
      expect(shot(b)).toEqual({ four: ['', '', '', ''], line: RESTORED + ' ' + IDLE, has: true }); // the wrong line, every visit
      for (const chunkFirst of [false, true]) {
        const t = visit({ block: C3, account: { json: {}, writes: [] }, browser: new Map(browser), late, chunkFirst });
        expect(t.browser.has('tllStoryDraft')).toBe(false); // removed during the steps script's init
        await t.dom.tick(3500); // past the gallery layer's 1.2 s and 3 s passes
        expect(shot(t)).toEqual({ four: ['', '', '', ''], line: IDLE, has: false });
        expect(t.q('trip-code').value).toBe(''); // the helper values of the leftover are not put back
        await t.dom.tick(40000); // a blank visit still writes nothing
        expect(t.browser.has('tllStoryDraft')).toBe(false);
        const n = visit({ block: C3, account: { json: {}, writes: [] }, browser: t.browser, late });
        await n.dom.tick(3500);
        expect(shot(n)).toEqual({ four: ['', '', '', ''], line: IDLE, has: false });
        n.q('name').value = 'A title'; // once the writer types, the autosave saves a draft as before
        await n.dom.tick(20000);
        expect(JSON.parse(n.browser.get('tllStoryDraft')).name).toBe('A title');
        const r = visit({ block: C3, account: { json: {}, writes: [] }, browser: n.browser, late });
        await r.dom.tick(3500);
        expect(r.q('name').value).toBe('A title');
        expect(r.save.textContent).toBe(RESTORED + ' ' + IDLE);
      }
    }
  });

  it('a leftover with only picks and other fields (city, credit choice, theme) is removed too; nothing of it is filled', async () => {
    const browser = new Map([['tllStoryDraft', JSON.stringify({ city: 'Athens', 'credit-mode=anonymous': 1, 'trip-code': 'TRIP-OLD', 'cf-turnstile-response': 'old-token' })]]);
    const t = visit({ block: C3, account: { json: {}, writes: [] }, browser, late: null });
    await t.dom.tick(3500);
    expect(shot(t)).toEqual({ four: ['', '', '', ''], line: IDLE, has: false });
    expect([t.q('city').value, t.q('trip-code').value]).toEqual(['', '']);
    expect(t.form.querySelector('input[name="credit-mode"][value="anonymous"]').checked).toBe(false);
    for (const bad of ['{}', '[]', '"text"', '7', 'not json']) { // odd copies: removed or ignored, never an error
      const x = visit({ block: C3, account: { json: {}, writes: [] }, browser: new Map([['tllStoryDraft', bad]]), late: null });
      await x.dom.tick(3500);
      expect(x.save.textContent).toBe(bad === 'not json' ? RESTORED + ' ' + IDLE : IDLE);
      expect(four(x)).toEqual(['', '', '', '']);
    }
  });

  it('a copy with any one of the four fields is kept and filled exactly as with c2, and says "Draft restored"', async () => {
    for (const k of ['name', 'excerpt', 'body', 'country']) {
      const copy = JSON.stringify({ [k]: 'Kept words', 'trip-code': 'TRIP-KEPT', 'cf-turnstile-response': 'old-token' });
      const res = [];
      for (const block of [AFTER, C3]) {
        const t = visit({ block, account: { json: {}, writes: [] }, browser: new Map([['tllStoryDraft', copy]]), late: null });
        await t.dom.tick(3500);
        res.push({ ...shot(t), copy: t.browser.get('tllStoryDraft'), trip: t.q('trip-code').value });
      }
      expect(res[1]).toEqual(res[0]);
      expect(res[1].line).toBe(RESTORED + ' ' + IDLE);
      expect(res[1].four.filter((x) => x)).toEqual(['Kept words']);
      expect(res[1].copy).toBe(copy);
    }
  });

  it('a leftover and an account draft, Memberstack 2 s late: c3 removes the leftover, the account draft fills the form, no "Draft restored"', async () => {
    const { browser } = await leftover(null);
    const account = { json: { tllStoryDraft: clone(DRAFT), tllLinks: {} }, writes: [] };
    const t = visit({ block: C3, account, browser, late: 2000 });
    await t.dom.tick(3000);
    expect(t.reads).toEqual([2000]);
    expect(shot(t)).toEqual({ four: [DRAFT.fields.name, DRAFT.fields.excerpt, DRAFT.fields.body, DRAFT.fields.country], line: IDLE, has: false });
    await t.dom.tick(20000); // the next autosave keeps the account draft in this browser again
    expect(JSON.parse(t.browser.get('tllStoryDraft')).body).toBe(DRAFT.fields.body);
    expect(account.json.tllStoryDraft.fields.body).toBe(DRAFT.fields.body);
  });

  it('with no leftover, c3 does exactly what c2 does (Memberstack 0 s, 2 s, 20 s, never; account draft, sent, none; typed or not)', async () => {
    const seeds = { draft: { tllStoryDraft: clone(DRAFT), tllLinks: {} }, sent: { tllStoryDraft: { ...clone(DRAFT), sent: DRAFT.at }, tllLinks: {} }, none: { tllLinks: { website: 'https://example.com' } } };
    for (const late of [0, 2000, 20000, null]) {
      for (const seed of Object.keys(seeds)) {
        for (const typed of [false, true]) {
          const res = [];
          for (const block of [AFTER, C3]) {
            const account = { json: clone(seeds[seed]), writes: [] };
            const t = visit({ block, account, late });
            if (typed) { await t.dom.tick(500); t.q('excerpt').value = 'Typed now'; }
            await t.dom.tick(45000);
            const n = visit({ block, account, browser: t.browser, late });
            await n.dom.tick(3500);
            const plain = (x) => JSON.parse(JSON.stringify(x).replace(/"(at|sent)":"[^"]*"/g, '"$1":"T"').replace(/\d{1,2}:\d{2}/g, 'H:M')); // clock times read the real clock
            res.push(plain({ a: shot(t), b: shot(n), reads: [t.reads, n.reads], writes: account.writes.map((x) => [x.at, x.json]), store: [...n.browser], web: t.q('credit-website').value }));
          }
          expect(res[1]).toEqual(res[0]);
        }
      }
    }
  });
});
