// tll-photo-clean-v1 under vitest with the stand-in DOM in test/mini-dom.js (no browser). 17 Nov 2026: a writer pressed Send
// several times on /submit while three photos uploaded for about 15 s, because the button only faded and kept its label
// (reports/evidence/submit-save-2026-11-17/). These checks cover the two changes:
//   1. the button label shows the progress and gets its own label back, on success before the form is sent, and on failure;
//   2. the send after the uploads runs in the next task, so a pass where every photo is already cached still sends (before,
//      requestSubmit ran inside the submit event that was still firing, and the HTML form submission algorithm returns then).
// Cloudinary and Webflow are stand-ins; nothing is sent anywhere. The Playwright checks next to this file (test.mjs,
// submit.mjs) still cover the canvas and EXIF side in a real browser.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createDom } from '../../../../test/mini-dom.js';

const here = dirname(fileURLToPath(import.meta.url));
const SCRIPT = readFileSync(join(here, '..', 'tll-photo-clean-v1.js'), 'utf8');
const LABEL = 'Send it to the editor';
// The version live on 17 Nov (jsDelivr pin 22019832), when git has it: used once to show the swallowed send is real.
let LIVE = null;
try { LIVE = execFileSync('git', ['show', '22019832ad62816bc7c9f20805d2549615cfc508:src/components/photo-clean/tll-photo-clean-v1.js'], { cwd: here, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { LIVE = null; }

const PAGE = `<div class="w-form"><form data-tll-form="submit-story" data-ms-member-bound="true" method="get">
<fieldset data-tll-step="3"><input name="name" data-name="name" required>
<label><input type="file" name="hero-image" data-name="hero-image" required></label>
<label><input type="file" name="photo-gallery" data-name="photo-gallery" multiple></label></fieldset>
<div class="tll-pen-actions"><input type="submit" class="w-button" value="${LABEL}" data-wait="Sending to Copenhagen…"></div>
</form><div class="w-form-done" style="display:none"><div>It is with the editor.</div></div></div>`;

const file = (name, k = 0) => ({ name, size: 1000 + k, lastModified: 1700000000000 + k, type: 'image/jpeg' });

function setup({ source = SCRIPT, cloud = 'ok', uploadMs = 4000 } = {}) {
  const dom = createDom({ pathname: '/submit', html: PAGE });
  const d = dom.document; const form = d.querySelector('form'); const btn = form.querySelector('[type="submit"]');
  const uploads = []; const posts = [];
  // Webflow's form handler: delegated, bubble. It reads the button label at submit time and shows data-wait (webflow.js).
  d.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const fields = {}; ev.target.elements.forEach((e) => { if (e.name && e.type !== 'file' && e.type !== 'submit') fields[e.name] = e.value; });
    posts.push({ fields, label: btn.value }); btn.disabled = true; btn.value = btn.getAttribute('data-wait');
  });
  const fetch = (url, init) => {
    uploads.push({ url, folder: init.body.get('folder') });
    const n = uploads.length;
    return new Promise((res) => dom.window.setTimeout(() => res(cloud === 'fail'
      ? { ok: false, json: () => Promise.resolve({}) }
      : { ok: true, json: () => Promise.resolve({ secure_url: `https://res.cloudinary.com/idonvlow/image/upload/v1/${init.body.get('folder')}/p${n}.jpg` }) }), uploadMs));
  };
  const createImageBitmap = () => Promise.resolve({ width: 4000, height: 3000, close() {} });
  dom.run(source, { fetch, createImageBitmap });
  form.querySelector('[name="name"]').value = 'A title';
  const pick = (hero = 1, gallery = 2) => {
    form.querySelector('[name="hero-image"]').files = Array.from({ length: hero }, (_, k) => file(`hero${k}.jpg`, k));
    form.querySelector('[name="photo-gallery"]').files = Array.from({ length: gallery }, (_, k) => file(`g${k}.jpg`, 10 + k));
  };
  const msg = () => (form.querySelector('.tll-up-msg') || { textContent: '' }).textContent;
  return { dom, form, btn, uploads, posts, pick, msg };
}

describe('photo clean: the Send button shows the upload progress (17 Nov)', () => {
  it('reads "Sending photos 1 of 3", then 2 of 3, 3 of 3, while it is disabled', async () => {
    const t = setup(); t.pick(1, 2);
    t.btn.click();
    expect([t.btn.value, t.btn.disabled]).toEqual(['Sending photos 1 of 3', true]);
    expect(t.msg()).toMatch(/Removing location data and sending 3 photos/);
    await t.dom.tick(4000);
    expect([t.btn.value, t.btn.disabled]).toEqual(['Sending photos 2 of 3', true]);
    await t.dom.tick(4000);
    expect(t.btn.value).toBe('Sending photos 3 of 3');
    expect(t.uploads).toHaveLength(3);
  });

  it('presses during the uploads do nothing: no second pass, no early send', async () => {
    const t = setup(); t.pick(1, 2);
    t.btn.click(); await t.dom.tick(3000);
    t.btn.click(); t.form.requestSubmit(); // a disabled button ignores the click; a direct submit is held by the busy flag
    await t.dom.tick(1500);
    expect(t.uploads).toHaveLength(2);
    expect(t.posts).toHaveLength(0);
  });

  it('after the last upload it reads "Photos are up. Sending", and Webflow sees the button\'s own label when it sends', async () => {
    const t = setup(); t.pick(1, 2);
    t.btn.click();
    await t.dom.tick(3 * 4000 - 1);
    expect(t.posts).toHaveLength(0);
    await t.dom.step(); // the last upload lands; the send waits for the next task, and the button stays busy until then
    expect(t.dom.timers).toHaveLength(1); // the deferred send
    expect([t.btn.value, t.btn.disabled, t.posts.length]).toEqual(['Photos are up. Sending', true, 0]);
    expect(t.msg()).toBe('Photos are up. Sending.');
    t.btn.click(); // still busy: nothing
    await t.dom.step();
    expect(t.posts).toHaveLength(1);
    expect(t.posts[0].label).toBe(LABEL); // so Webflow puts this label back if its own post fails
    expect(t.posts[0].fields['hero-image']).toMatch(/tll\/hero-image\/p1\.jpg$/);
    expect(t.posts[0].fields['photo-gallery'].split('\n')).toHaveLength(2);
    expect(t.btn.value).toBe('Sending to Copenhagen…'); // Webflow's data-wait from here on
  });

  it('one photo reads "Sending your photo"', async () => {
    const t = setup(); t.pick(1, 0);
    t.btn.click();
    expect(t.btn.value).toBe('Sending your photo');
    await t.dom.tick(4000); await t.dom.tick(0);
    expect(t.posts).toHaveLength(1);
  });

  it('a failed upload gives the label and the button back, and sends nothing', async () => {
    const t = setup({ cloud: 'fail' }); t.pick(1, 2);
    t.btn.click(); await t.dom.tick(4000); await t.dom.tick(0);
    expect([t.btn.value, t.btn.disabled, t.posts.length]).toEqual([LABEL, false, 0]);
    expect(t.msg()).toMatch(/did not go through.*Nothing was sent/);
  });
});

describe('photo clean: the send after the uploads is never swallowed (17 Nov, latent)', () => {
  // A capture listener added after photo clean that stops the first send once, as the end-of-story check does.
  function stopOnce(t) { let n = 0; t.dom.document.addEventListener('submit', (ev) => { if (n++ === 0) { ev.preventDefault(); ev.stopImmediatePropagation(); } }, true); }

  it('a second press with every photo cached sends at once, with no new upload', async () => {
    const t = setup(); stopOnce(t); t.pick(1, 2);
    t.btn.click(); await t.dom.tick(3 * 4000); await t.dom.tick(0);
    expect([t.uploads.length, t.posts.length, t.btn.value, t.btn.disabled]).toEqual([3, 0, LABEL, false]);
    t.btn.click(); // all three are in the cache: the whole pass runs inside this submit event
    expect(t.btn.value).toBe('Photos are up. Sending');
    await t.dom.tick(0);
    expect([t.uploads.length, t.posts.length, t.form._swallowed || 0]).toEqual([3, 1, 0]);
    expect(t.btn.value).toBe('Sending to Copenhagen…');
  });

  it.skipIf(!LIVE)('the version live on 17 Nov swallows that second press (the requestSubmit returns inside the firing event)', async () => {
    const t = setup({ source: LIVE }); stopOnce(t); t.pick(1, 2);
    t.btn.click(); await t.dom.tick(3 * 4000);
    t.btn.click(); await t.dom.tick(0);
    expect([t.uploads.length, t.posts.length, t.form._swallowed]).toEqual([3, 0, 1]);
    t.btn.click(); await t.dom.tick(0); // the third press goes through
    expect(t.posts).toHaveLength(1);
  });

  it('a form with no photos chosen is not touched, and the label never changes', async () => {
    const t = setup(); t.form.querySelector('[name="hero-image"]').required = false;
    t.btn.click();
    expect([t.posts.length, t.btn.value, t.uploads.length]).toEqual([1, 'Sending to Copenhagen…', 0]);
    expect(t.posts[0].label).toBe(LABEL);
  });

  it('the new labels keep the copy rules: no em dash, no exclamation mark', () => {
    const lines = SCRIPT.match(/'(Sending your photo|Sending photos |Photos are up\. Sending)'/g) || [];
    expect(lines.length).toBeGreaterThanOrEqual(3);
    for (const l of lines) expect(l).not.toMatch(/[—!]|ship|ledger|filed/i);
  });
});
