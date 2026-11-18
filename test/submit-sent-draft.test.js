// /submit after the send: what happens to the story draft (18 Nov 2026, reports/evidence/submit-save-2026-11-17/fix.md part C).
// Nancy's choice: after the send only stop the autosave, keep the draft in the account (the done box says "Your draft stays in
// your account either way."), and do not offer the sent story as an unsent "Draft restored" on a later visit.
// Part C is a proposal for the /submit page custom code (a Webflow write, not done). This test reads the exact before and after
// blocks from fix.md, puts each into the steps script as it is in the repo copy of the live footer, and runs it with photo clean
// and the BUILT submit chunk (its gallery layer prints "Draft restored") on the story form as exported, in the mini DOM.
// Memberstack, Cloudinary, Webflow's form handler and the Worker are stand-ins; nothing is sent anywhere; no real member data.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createDom } from './mini-dom.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const PHOTO_CLEAN = read('src/components/photo-clean/tll-photo-clean-v1.js');
const CHUNK = read('src/site-layers/chunks/submit.js');
const FORM = read('src/pages/submit/live-2026-10-29/form-story-export-2026-10-13.html');
const FOOTER = read('src/pages/submit/live-2026-11-11/followups/footer.before.html');
const FIX = read('reports/evidence/submit-save-2026-11-17/fix.md');
const WORKER = 'https://tll-travel-wire.thatlayoverlife.workers.dev/intake';
const STORY = 'We missed the ferry and took the night bus instead.';
const SENT_NOTE = 'Already sent to the editor. A copy stays in your account.';
const RESTORED = 'Draft restored from your last visit.';

// part C of fix.md: the first js block is the before, the second the after
const partC = FIX.slice(FIX.indexOf('## C. Page code'), FIX.indexOf('## Tests'));
const blocks = [...partC.matchAll(/```js\n([\s\S]*?)```/g)].map((m) => m[1]);
const [BEFORE, AFTER] = blocks;
const STEPS = /<script id="tll-form-steps-js-v2">([\s\S]*?)<\/script>/.exec(FOOTER)[1];
const steps = (block) => STEPS.replace(BEFORE, () => block);

const PAGE = FORM.replace(/<\/form><\/div>\s*$/, '</form><div class="w-form-done" style="display:none"><div>It is with the editor. Your draft stays in your account either way.</div></div>'
  + '<div class="w-form-fail" style="display:none"><div>That did not send.</div></div></div>');
const clone = (x) => JSON.parse(JSON.stringify(x));

// One page load. `account` is the stand-in Memberstack member JSON and lives across visits, like the real account;
// `browser` is this browser's localStorage, carried from one visit to the next.
function visit({ block, account, browser = new Map(), slowDraftWrite = 0 }) {
  const dom = createDom({ pathname: '/submit', html: PAGE });
  for (const [k, v] of browser) dom.store.set(k, v);
  const d = dom.document; const w = dom.window;
  const form = d.querySelector('form[data-tll-form="submit-story"]'); const btn = form.querySelector('[type="submit"]');
  const done = d.querySelector('.w-form-done');
  const posts = []; let shownAt = null;
  w.$memberstackDom = {
    getMemberCookie: () => 'tok_test',
    getCurrentMember: () => Promise.resolve({ data: { id: 'mem_test', customFields: {} } }),
    getMemberJSON: () => new Promise((res) => w.setTimeout(() => res({ data: clone(account.json) }), 200)),
    updateMemberJSON: ({ json }) => new Promise((res) => w.setTimeout(() => {
      account.json = clone(json); account.writes.push({ at: dom.now(), json: clone(json) }); res({ data: json });
    }, json.tllStoryDraft && !json.tllStoryDraft.sent && slowDraftWrite ? slowDraftWrite : 300)),
  };
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
  dom.run(steps(block), { fetch, createImageBitmap });
  dom.run(PHOTO_CLEAN, { fetch, createImageBitmap });
  dom.run(CHUNK, { fetch, createImageBitmap });
  const save = form.querySelector('.tllst-save');
  const body = form.querySelector('textarea[name="body"]');
  return { dom, form, btn, done, posts, save, body, browser: dom.store, shownAt: () => shownAt };
}

// the writer fills the form, an autosave runs, then they go to step 3 and press Send once
async function writeAndSend(t, wait = 20500) {
  const w = t.dom.window;
  t.form.querySelectorAll('[required]').forEach((e) => {
    if (e.type === 'checkbox') e.checked = true;
    else if (e.localName === 'select') { e.add(new w.Option('Europe', 'europe')); e.value = 'europe'; }
    else if (e.type !== 'file') e.value = 'Filled';
  });
  t.body.value = STORY;
  t.form.querySelector('input[type="file"][name="hero-image"]').files = [{ name: 'cover.jpg', size: 3100000, lastModified: 1, type: 'image/jpeg' }];
  t.form.querySelector('input[type="file"][name="photo-gallery"]').files = [{ name: 'g1.jpg', size: 2900000, lastModified: 2, type: 'image/jpeg' }, { name: 'g2.jpg', size: 2800000, lastModified: 3, type: 'image/jpeg' }];
  await t.dom.tick(wait); // one autosave (at 20 s): this browser and the account hold the unsent draft
  t.pressedAt = t.dom.now();
  const next = t.form.querySelector('.tllst-next'); next.click(); next.click(); // step 3
  t.btn.click();
  await t.dom.tick(16000); // three uploads, the post, Webflow's done box
}

const autosaveTimers = (t) => t.dom.timers.filter((x) => x.every === 20000).length;

describe('/submit after the send: the story draft (fix.md part C)', () => {
  it('fix.md part C carries exactly one before and one after block, and the before is the repo copy of the live footer', () => {
    expect(blocks).toHaveLength(2);
    expect(FOOTER.split(BEFORE)).toHaveLength(2);
    expect(FOOTER.split('\n').slice(70, 83).join('\n') + '\n').toBe(BEFORE);
    expect(AFTER).toContain(SENT_NOTE);
    expect(SENT_NOTE).not.toMatch(/[—!]|ship|ledger|filed/i);
  });

  it('before (live today): the autosave writes the sent story back after the done box, and the next visit offers it as "Draft restored"', async () => {
    const account = { json: { tllLinks: {} }, writes: [] };
    const t = visit({ block: BEFORE, account });
    await writeAndSend(t);
    expect(t.posts).toHaveLength(1);
    expect(t.shownAt()).not.toBeNull();
    expect(t.browser.has('tllStoryDraft')).toBe(false); // the submit handler removed this browser's copy
    await t.dom.tick(60000);
    const after = account.writes.filter((x) => x.at > t.shownAt());
    expect(after.length).toBeGreaterThan(0); // the autosave kept writing after the done box
    expect(after.every((x) => !x.json.tllStoryDraft.sent)).toBe(true);
    expect(t.browser.has('tllStoryDraft')).toBe(true); // and put the copy back in this browser
    expect(autosaveTimers(t)).toBe(1);
    expect(account.json.tllStoryDraft.fields.body).toBe(STORY);
    expect(account.json.tllStoryDraft.fields['hero-image']).toMatch(/p1\.jpg$/);
    // a later visit, same browser and account
    const v = visit({ block: BEFORE, account, browser: t.browser });
    await v.dom.tick(1000);
    expect(v.save.textContent).toContain(RESTORED);
    expect(v.body.value).toBe(STORY); // the sent story is back in the form, ready to send again
  });

  it('after: no autosave write after the done box, the draft kept in the account marked sent, and the later visit says it was sent', async () => {
    const account = { json: { tllLinks: {} }, writes: [] };
    const t = visit({ block: AFTER, account });
    await writeAndSend(t);
    expect(t.posts).toHaveLength(1);
    expect(t.shownAt()).not.toBeNull();
    const before = account.writes.filter((x) => x.at <= t.shownAt());
    expect(before.length).toBeGreaterThan(0); // the autosave did run while the story was being written
    await t.dom.tick(60000);
    const after = account.writes.filter((x) => x.at > t.shownAt());
    expect(after).toHaveLength(1); // only the one write that marks the copy sent
    expect(after[0].json.tllStoryDraft.sent).toBeTruthy();
    expect(autosaveTimers(t)).toBe(0); // the autosave is stopped
    expect(t.browser.has('tllStoryDraft')).toBe(false);
    // the draft stays in the account, as sent, photo links included
    const kept = account.json.tllStoryDraft;
    expect(kept.fields.body).toBe(STORY);
    expect(kept.fields['hero-image']).toMatch(/p1\.jpg$/);
    expect(kept.sent).toBe(kept.at);
    expect(account.json.tllLinks).toEqual({}); // the rest of the member JSON is left as it was
    // a later visit, same browser and account
    const v = visit({ block: AFTER, account, browser: t.browser });
    await v.dom.tick(1000);
    expect(v.save.textContent).toBe(SENT_NOTE);
    expect(v.save.textContent).not.toContain(RESTORED);
    expect(v.body.value).toBe(''); // the sent story is not put back into the form
    expect(account.json.tllStoryDraft.sent).toBeTruthy();
    // a new story: the first autosave writes the new draft and keeps the sent one as tllStorySent
    v.body.value = 'A second trip, a different ferry.';
    await v.dom.tick(20500);
    expect(account.json.tllStoryDraft.fields.body).toBe('A second trip, a different ferry.');
    expect(account.json.tllStoryDraft.sent).toBeUndefined();
    expect(account.json.tllStorySent.fields.body).toBe(STORY);
    expect(account.json.tllStorySent.sent).toBeTruthy();
  });

  it('after, a new browser: the account copy marked sent is not offered either', async () => {
    const account = { json: { tllLinks: {} }, writes: [] };
    const t = visit({ block: AFTER, account });
    await writeAndSend(t); await t.dom.tick(1000);
    const v = visit({ block: AFTER, account });
    await v.dom.tick(1000);
    expect([v.save.textContent, v.body.value]).toEqual([SENT_NOTE, '']);
  });

  it('after: an autosave account write already on its way when the done box shows cannot undo the sent mark', async () => {
    // learn how long a send takes here, then press Send so the done box shows while the 40 s autosave's account write is
    // on its way (read at 40.2 s; the write is made slow, 1.5 s, so without waiting for it the sent mark would land first)
    const probe = visit({ block: AFTER, account: { json: {}, writes: [] } });
    await writeAndSend(probe);
    const took = probe.shownAt() - probe.pressedAt;
    const account = { json: { tllLinks: {} }, writes: [] };
    const t = visit({ block: AFTER, account, slowDraftWrite: 1500 });
    await writeAndSend(t, 40300 - took);
    expect(t.shownAt()).toBe(40300);
    await t.dom.tick(60000);
    const after = account.writes.filter((x) => x.at > t.shownAt());
    expect(after.map((x) => !!x.json.tllStoryDraft.sent)).toEqual([false, true]); // the late autosave write, then the sent mark
    expect(account.json.tllStoryDraft.sent).toBeTruthy();
    expect(account.json.tllStoryDraft.fields.body).toBe(STORY);
    expect(t.browser.has('tllStoryDraft')).toBe(false);
  });
});
