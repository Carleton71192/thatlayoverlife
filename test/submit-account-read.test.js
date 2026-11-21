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

const PAGE = FORM.replace(/<\/form><\/div>\s*$/, '</form><div class="w-form-done" style="display:none"><div>It is with the editor. Your draft stays in your account either way.</div></div>'
  + '<div class="w-form-fail" style="display:none"><div>That did not send.</div></div></div>');
const clone = (x) => JSON.parse(JSON.stringify(x));
const DRAFT = { at: '2026-11-20T18:00:00.000Z', fields: { name: 'The night bus', excerpt: 'Two cities, one missed ferry.', body: 'We missed the ferry and took the night bus instead.', country: 'Greece', 'credit-mode=named': 1 } };

// One page load. `account` is the stand-in member JSON, kept across visits; `late` is when Memberstack shows up (ms after the
// steps script runs; null = never, signed out); `browser` is this browser's localStorage, carried from one visit to the next.
function visit({ block, account, late = 0, browser = new Map(), customFields = {}, slowDraftWrite = 0 }) {
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
  dom.run(block, { fetch, createImageBitmap });
  dom.run(PHOTO_CLEAN, { fetch, createImageBitmap });
  dom.run(CHUNK, { fetch, createImageBitmap });
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
