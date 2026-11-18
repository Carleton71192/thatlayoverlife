// /submit Send, end to end without a browser (17 Nov 2026, reports/evidence/submit-save-2026-11-17/): photo clean and the BUILT
// submit chunk (src/site-layers/chunks/submit.js, every layer in it) loaded together on the story form as exported, in the order
// the live page runs them (photo clean registers first). This pair was never tested together before.
// The steps script is not loaded; its effect on step 3 is set by hand (steps 1 and 2 carry tllst-hide). Cloudinary, Webflow's
// form handler, Memberstack and the travel-wire Worker are stand-ins; nothing is sent anywhere. Uploads take 4 s each and the
// Worker answers after 6 s, as on 17 Nov.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createDom } from './mini-dom.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const PHOTO_CLEAN = readFileSync(join(root, 'src/components/photo-clean/tll-photo-clean-v1.js'), 'utf8');
const CHUNK = readFileSync(join(root, 'src/site-layers/chunks/submit.js'), 'utf8');
const FORM = readFileSync(join(root, 'src/pages/submit/live-2026-10-29/form-story-export-2026-10-13.html'), 'utf8');
const LABEL = 'Send it to the editor';
const SAVED = 'Saved. It is with the editor.';
const SAVED_FORM = 'Saved. The editor will add it to the draft list by hand.';
const WORKER = 'https://tll-travel-wire.thatlayoverlife.workers.dev/intake';

// The export ends at the form; the live page has Webflow's done and fail boxes after it (story-form-lines 625 to 629).
const PAGE = FORM.replace(/<\/form><\/div>\s*$/, '</form><div class="w-form-done" style="display:none"><div>It is with the editor.</div></div>'
  + '<div class="w-form-fail" style="display:none"><div>That did not send.</div></div></div>');

function setup({ body = 'We missed the ferry and took the night bus instead.', worker = { status: 200, body: { saved: true, held: true } }, token = 'tok_test' } = {}) {
  const dom = createDom({ pathname: '/submit', html: PAGE });
  const d = dom.document; const w = dom.window;
  const form = d.querySelector('form[data-tll-form="submit-story"]'); const btn = form.querySelector('[type="submit"]');
  const done = d.querySelector('.w-form-done');
  const uploads = []; const posts = []; const workerCalls = [];
  w.$memberstackDom = { getMemberCookie: () => token, getCurrentMember: () => Promise.resolve({ data: null }) };
  // Webflow's form handler (delegated, bubble): label to data-wait, post, then hide the form and show the done box 2 s later.
  d.addEventListener('submit', (ev) => {
    const f = ev.target; ev.preventDefault();
    const fields = {}; f.elements.forEach((e) => { if (e.name && e.type !== 'file' && e.type !== 'submit' && ((e.type !== 'checkbox' && e.type !== 'radio') || e.checked)) fields[e.name] = e.value; });
    posts.push({ fields, label: btn.value, at: dom.now() }); btn.disabled = true; btn.value = btn.getAttribute('data-wait');
    w.setTimeout(() => { f.style.display = 'none'; done.style.display = 'block'; dom.mutate(done); }, 2000);
  });
  const fetch = (url, init) => {
    if (url === WORKER) {
      workerCalls.push({ at: dom.now(), body: JSON.parse(init.body) });
      return new Promise((res, rej) => w.setTimeout(() => (worker === 'offline' ? rej(new Error('offline'))
        : res({ ok: worker.status < 300, json: () => Promise.resolve(worker.body) })), 6000));
    }
    if (/^https:\/\/api\.cloudinary\.com\//.test(url)) {
      uploads.push({ at: dom.now(), folder: init.body.get('folder') }); const n = uploads.length;
      return new Promise((res) => w.setTimeout(() => res({ ok: true, json: () => Promise.resolve({ secure_url: `https://res.cloudinary.com/idonvlow/image/upload/v${n}/${init.body.get('folder')}/p${n}.jpg` }) }), 4000));
    }
    return Promise.reject(new Error('unexpected fetch ' + url));
  };
  const createImageBitmap = () => Promise.resolve({ width: 4032, height: 3024, close() {} });
  // the live order: photo clean is a parser-blocking script at the end of the body; the chunk comes later from the core
  dom.run(PHOTO_CLEAN, { fetch, createImageBitmap });
  dom.run(CHUNK, { fetch, createImageBitmap });
  // the writer fills every required field, picks a cover photo and two gallery photos, and is on step 3
  form.querySelectorAll('[required]').forEach((e) => {
    if (e.type === 'checkbox') e.checked = true;
    else if (e.localName === 'select') { e.add(new w.Option('Europe', 'europe')); e.value = 'europe'; }
    else if (e.type !== 'file') e.value = 'Filled';
  });
  form.querySelector('textarea[name="body"]').value = body;
  form.querySelector('input[type="file"][name="hero-image"]').files = [{ name: 'cover.jpg', size: 3100000, lastModified: 1, type: 'image/jpeg' }];
  form.querySelector('input[type="file"][name="photo-gallery"]').files = [{ name: 'g1.jpg', size: 2900000, lastModified: 2, type: 'image/jpeg' }, { name: 'g2.jpg', size: 2800000, lastModified: 3, type: 'image/jpeg' }];
  form.querySelectorAll('[data-tll-step]').forEach((fs) => { if (fs.getAttribute('data-tll-step') !== '3') fs.classList.add('tllst-hide'); });
  const shown = (el) => !!el && dom.getComputedStyle(el).display !== 'none';
  const lines = () => done.querySelectorAll('.tll-intake-msg').map((p) => p.textContent);
  return { dom, d, w, form, btn, done, uploads, posts, workerCalls, shown, lines };
}

describe('/submit Send with photo clean and the built submit chunk together', () => {
  it('the chunk on the branch is the built one, with the new intake lines', () => {
    expect(CHUNK).toContain('/* src/site-layers/tll-intake-v1.js */');
    expect(CHUNK).toContain(SAVED_FORM);
    expect(CHUNK).not.toContain("'Sending it to the editor…'");
  });

  it('one press: the button counts the photos, the form posts once, and the saved line is there as soon as the done box shows', async () => {
    const t = setup();
    t.done._rect = { top: -620, bottom: -480, height: 140 }; // the long form collapsed above it: the done box is off screen
    t.btn.click();
    expect([t.btn.value, t.btn.disabled]).toEqual(['Sending photos 1 of 3', true]);
    await t.dom.tick(4000); expect(t.btn.value).toBe('Sending photos 2 of 3');
    await t.dom.tick(4000); expect(t.btn.value).toBe('Sending photos 3 of 3');
    await t.dom.tick(3999); expect(t.posts).toHaveLength(0);
    await t.dom.tick(1); // last upload, then the send in the next task
    expect(t.posts).toHaveLength(1);
    expect(t.posts[0].label).toBe(LABEL);
    expect(t.posts[0].fields['hero-image']).toMatch(/tll\/hero-image\/p1\.jpg$/);
    expect(t.posts[0].fields['photo-gallery'].split('\n').map((u) => u.replace(/.*\//, ''))).toEqual(['p2.jpg', 'p3.jpg']);
    expect(t.btn.value).toBe('Sending to Copenhagen…');
    await t.dom.tick(2000); // Webflow answers: the form hides, the done box shows
    expect(t.shown(t.done)).toBe(true);
    expect(t.workerCalls).toHaveLength(1);
    expect(t.workerCalls[0].body.kind).toBe('story');
    expect(t.lines()).toEqual([SAVED]); // at once, while the Worker call is still running
    expect((t.dom.scrolls || []).filter((s) => s.el === t.done)).toEqual([{ el: t.done, opt: { block: 'center' } }]);
    await t.dom.tick(6000); // the Worker answers {saved, held}
    expect(t.lines()).toEqual([SAVED]);
    expect([t.uploads.length, t.posts.length, t.workerCalls.length]).toEqual([3, 1, 1]);
  });

  it('a done box already in view is not scrolled', async () => {
    const t = setup(); t.done._rect = { top: 200, bottom: 340, height: 140 };
    t.btn.click(); await t.dom.tick(14000);
    expect(t.shown(t.done)).toBe(true);
    expect((t.dom.scrolls || []).filter((s) => s.el === t.done)).toEqual([]);
  });

  it('when the Worker fails, or the connection drops, the line says the editor will add it to the draft list by hand', async () => {
    for (const worker of [{ status: 502, body: { error: 'Saved, and we will set it up by hand.' } }, 'offline']) {
      const t = setup({ worker });
      t.btn.click(); await t.dom.tick(14000);
      expect(t.lines()).toEqual([SAVED]);
      await t.dom.tick(6000);
      expect(t.lines()).toEqual([SAVED_FORM]);
    }
  });

  it('a story that ends without closing punctuation: two presses, one upload pass, one post, and the note is next to Send', async () => {
    const t = setup({ body: 'We missed the ferry and took the night bus instead 🌙' });
    t.btn.click(); await t.dom.tick(12000); await t.dom.tick(0);
    // press 1 uploaded the photos, then the end check stopped the send
    expect([t.uploads.length, t.posts.length]).toEqual([3, 0]);
    const sendNote = t.form.querySelector('.tll-end-send'); const bodyNote = t.form.querySelector('.tll-end-body');
    expect(t.shown(sendNote)).toBe(true); // on step 3, right after the button
    expect(sendNote.previousSibling).toBe(t.btn);
    expect(sendNote.getAttribute('role')).toBe('alert');
    expect(sendNote.textContent).toMatch(/^Your story seems to stop mid-sentence: ".*night bus instead 🌙"\. Finish the last line, or press Send again/);
    expect(t.shown(bodyNote)).toBe(false); // the one under the story box is on hidden step 1, as before
    expect(bodyNote.textContent).toBe(sendNote.textContent);
    expect(t.form.querySelector('.tll-up-msg').textContent).toBe(''); // no "Photos are up. Sending." while nothing is sending
    expect([t.btn.value, t.btn.disabled]).toEqual([LABEL, false]);
    // press 2: every photo is cached, so the pass runs inside the submit event; the deferred send still goes out
    t.btn.click(); await t.dom.tick(0);
    expect([t.uploads.length, t.posts.length, t.form._swallowed || 0]).toEqual([3, 1, 0]);
    await t.dom.tick(2000);
    expect(t.lines()).toEqual([SAVED]);
  });

  it('fixing the last line removes both notes', async () => {
    const t = setup({ body: 'We took the night bus instead' });
    t.btn.click(); await t.dom.tick(12000); await t.dom.tick(0);
    expect(t.form.querySelectorAll('.tll-end-note')).toHaveLength(2);
    const ta = t.form.querySelector('textarea[name="body"]'); ta.value += '.'; ta.dispatchEvent(new t.dom.Event('input', { bubbles: true }));
    expect(t.form.querySelectorAll('.tll-end-note')).toHaveLength(0);
    t.btn.click(); await t.dom.tick(0);
    expect([t.uploads.length, t.posts.length]).toEqual([3, 1]);
  });

  it('without a sign-in the form still posts, the done box still shows, and no Worker call or extra line is made', async () => {
    const t = setup({ token: '' });
    t.btn.click(); await t.dom.tick(20000);
    expect([t.posts.length, t.workerCalls.length, t.lines().length, t.shown(t.done)]).toEqual([1, 0, 0, true]);
  });
});
