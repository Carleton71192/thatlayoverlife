// tll-p0-closeout-v1 (the site chunk) is a browser script, so this test runs its source against a small stand-in for window and
// document (11 Nov 2026, launch blockers close-out, P4 and P5). P4: "Example Text" placeholders are cleared on /submit and
// /share-photos only, and real hints are left alone. P5: the "Cookie settings" click opens /cookies only after the consent tool
// has answered that the rules do not apply; in Europe, and before any answer, the layer stands aside.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, '..', 'src', 'site-layers', 'tll-p0-closeout-v1.js'), 'utf8');

function field(placeholder) {
  const attrs = { placeholder };
  return { getAttribute: (k) => attrs[k], setAttribute: (k, v) => { attrs[k] = v; }, get placeholder() { return attrs.placeholder; } };
}

function run(pathname, { fields = [], tcf = true } = {}) {
  const listeners = {}; const tcfListeners = []; const went = [];
  const window = {
    addEventListener: (type, fn, capture) => { (listeners[type] = listeners[type] || []).push({ fn, capture }); },
    scrollTo: () => went.push('scroll'),
  };
  if (tcf) window.__tcfapi = (cmd, v, cb) => { if (cmd === 'addEventListener') tcfListeners.push(cb); };
  const document = { readyState: 'complete', addEventListener: () => {}, querySelectorAll: () => fields };
  const location = { pathname, assign: (u) => went.push(u) };
  new Function('window', 'document', 'location', 'setTimeout', src)(window, document, location, () => {});
  const click = (onLink, extra = {}) => {
    const e = { defaultPrevented: false, button: 0, prevented: false, stopped: false,
      target: { closest: (sel) => (onLink && /data-tll-cookie-prefs/.test(sel) ? {} : null) },
      preventDefault() { this.prevented = true; }, stopImmediatePropagation() { this.stopped = true; }, ...extra };
    (listeners.click || []).forEach((l) => l.fn(e)); return e;
  };
  return { click, went, answer: (tc) => tcfListeners.forEach((cb) => cb(tc, true)), listeners };
}

describe('tll-p0-closeout-v1 placeholders (P4)', () => {
  it('clears "Example Text" in any case on /submit and leaves real hints alone', () => {
    const f = [field('Example Text'), field('Example text'), field(' example text '), field('https://'), field('Sofia, Doha, somewhere unspellable')];
    run('/submit', { fields: f });
    expect(f.map((x) => x.placeholder)).toEqual(['', '', '', 'https://', 'Sofia, Doha, somewhere unspellable']);
  });
  it('runs on /share-photos, with or without a trailing slash', () => {
    const f = [field('Example Text')]; run('/share-photos/', { fields: f });
    expect(f[0].placeholder).toBe('');
  });
  it('does nothing on other pages', () => {
    const f = [field('Example Text')]; run('/stories', { fields: f });
    expect(f[0].placeholder).toBe('Example Text');
  });
});

describe('tll-p0-closeout-v1 Cookie settings outside Europe (P5)', () => {
  it('listens on window in the capture phase, ahead of the head script on document', () => {
    const r = run('/');
    expect(r.listeners.click).toHaveLength(1);
    expect(r.listeners.click[0].capture).toBe(true);
  });
  it('stands aside before the consent tool has answered', () => {
    const r = run('/'); const e = r.click(true);
    expect([e.prevented, e.stopped, r.went]).toEqual([false, false, []]);
  });
  it('stands aside in Europe (gdprApplies true)', () => {
    const r = run('/'); r.answer({ gdprApplies: true }); const e = r.click(true);
    expect([e.prevented, e.stopped, r.went]).toEqual([false, false, []]);
  });
  it('opens /cookies once the tool says the rules do not apply', () => {
    const r = run('/stories'); r.answer({ gdprApplies: false, cmpStatus: 'loaded' }); const e = r.click(true);
    expect([e.prevented, e.stopped, r.went]).toEqual([true, true, ['/cookies']]);
  });
  it('ignores other links, modified clicks and clicks another script already handled', () => {
    const r = run('/'); r.answer({ gdprApplies: false });
    expect(r.click(false).prevented).toBe(false);
    expect(r.click(true, { metaKey: true }).prevented).toBe(false);
    expect(r.click(true, { defaultPrevented: true }).prevented).toBe(false);
    expect(r.went).toEqual([]);
  });
  it('on /cookies itself it goes to the top of the page instead of reloading', () => {
    const r = run('/cookies'); r.answer({ gdprApplies: false }); r.click(true);
    expect(r.went).toEqual(['scroll']);
  });
  it('does nothing when the consent tool never loads', () => {
    const r = run('/', { tcf: false }); const e = r.click(true);
    expect([e.prevented, r.went]).toEqual([false, []]);
  });
});
