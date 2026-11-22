// tll-gate-return-v1 (the site chunk; sweep of 21 Nov, item A08). A click on Log in or Join inside a sign-in gate on /submit,
// /my-pets or /share-photos stores the page; on the next page the member reaches signed in, one card offers the way back. The nav's
// own Log in, other pages, signed-out visits, /login itself and old keys show nothing; being back on the page clears the key.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createDom } from './mini-dom.js';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'src', 'site-layers', 'tll-gate-return-v1.js'), 'utf8');
const GATE = '<nav class="tll-nav-v1"><div data-ms-content="anonymous"><a id="navlogin" href="/login">Log in</a></div></nav>'
  + '<div data-ms-content="anonymous"><section><a id="login" href="/login" class="tll-btn tll-btn-primary">Log in</a><a id="join" href="/signup" class="tll-btn tll-btn-ghost">Join the Travelers</a></section></div>';

function session() { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), m }; }
function ms(signed) { return { getCurrentMember: () => Promise.resolve({ data: signed ? { id: 'x' } : null }) }; }
async function visit(pathname, sessionStorage, { html = '<main></main>', signed = true } = {}) {
  const dom = createDom({ pathname, html });
  dom.run(src, { sessionStorage, $memberstackDom: ms(signed) });
  await dom.tick(400); return dom;
}

describe('tll-gate-return-v1 (A08)', () => {
  it('a gate Log in on /submit stores the page; the next signed-in page offers Back to your story', async () => {
    const s = session();
    const gate = await visit('/submit', s, { html: GATE, signed: false });
    gate.document.getElementById('login').click();
    expect(JSON.parse(s.getItem('tll-gate-return')).p).toBe('/submit');
    const acc = await visit('/account', s);
    const card = acc.document.getElementById('tll-gate-back');
    expect(card.querySelector('a').getAttribute('href')).toBe('/submit');
    expect(card.querySelector('a').textContent).toBe('Back to your story →');
  });
  it('Join on /my-pets and /share-photos store their own words', async () => {
    for (const [p, w] of [['/my-pets', 'Back to your pets →'], ['/share-photos', 'Back to your photos →']]) {
      const s = session(); const gate = await visit(p, s, { html: GATE, signed: false });
      gate.document.getElementById('join').click();
      const next = await visit('/', s);
      expect(next.document.getElementById('tll-gate-back').querySelector('a').textContent).toBe(w);
    }
  });
  it('the nav Log in stores nothing, nor does a gate on another page', async () => {
    const s = session();
    (await visit('/submit', s, { html: GATE, signed: false })).document.getElementById('navlogin').click();
    (await visit('/stories', s, { html: GATE, signed: false })).document.getElementById('login').click();
    expect(s.getItem('tll-gate-return')).toBe(null);
  });
  it('shows nothing on /login, nor to a signed-out visitor', async () => {
    const s = session(); s.setItem('tll-gate-return', JSON.stringify({ p: '/submit', t: Date.now() }));
    expect((await visit('/login', s)).document.getElementById('tll-gate-back')).toBe(null);
    expect((await visit('/account', s, { signed: false })).document.getElementById('tll-gate-back')).toBe(null);
    expect(s.getItem('tll-gate-return')).not.toBe(null);
  });
  it('back on the page itself the key is cleared; an old key is dropped', async () => {
    const s = session(); s.setItem('tll-gate-return', JSON.stringify({ p: '/submit', t: Date.now() }));
    expect((await visit('/submit', s)).document.getElementById('tll-gate-back')).toBe(null);
    expect(s.getItem('tll-gate-return')).toBe(null);
    s.setItem('tll-gate-return', JSON.stringify({ p: '/submit', t: Date.now() - 31 * 60 * 1000 }));
    expect((await visit('/account', s)).document.getElementById('tll-gate-back')).toBe(null);
    expect(s.getItem('tll-gate-return')).toBe(null);
  });
  it('closing the card clears the key', async () => {
    const s = session(); s.setItem('tll-gate-return', JSON.stringify({ p: '/my-pets', t: Date.now() }));
    const dom = await visit('/account', s);
    dom.document.querySelector('#tll-gate-back button').click();
    expect([dom.document.getElementById('tll-gate-back'), s.getItem('tll-gate-return')]).toEqual([null, null]);
  });
  it('touches no data-ms-* attribute (it only reads the gate)', () => {
    expect(/setAttribute\(['"]data-ms|removeAttribute\(['"]data-ms/.test(src)).toBe(false);
  });
});
