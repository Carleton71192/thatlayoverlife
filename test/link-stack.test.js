import { describe, it, expect } from 'vitest';
import { coerce, STACK_MAX } from '../src/profile-sync.js';

const parse = (v) => JSON.parse(coerce('partners', JSON.stringify(v)));

describe('partners link stack', () => {
  it('keeps typed https links and drops bad ones', () => {
    const out = parse({ stack: [
      { t: 'youtube', label: 'My trip', url: 'https://youtu.be/abc' },
      { t: 'web', label: 'Shop', url: 'example.com/x' },
      { t: 'evil', label: 'x', url: 'https://a.b' },
      { t: 'pdf', label: 'Menu', url: 'http://a.b/menu.pdf' },
      { t: 'contact', label: 'Save my contact', url: 'me@example.com' },
    ] });
    expect(out.stack.map((l) => l.t)).toEqual(['youtube', 'web', 'contact']);
    expect(out.stack[1].url).toBe('https://example.com/x');
  });
  it('caps the list and the label', () => {
    const many = Array.from({ length: 20 }, (_, i) => ({ t: 'web', label: 'x'.repeat(90), url: `https://a.b/${i}` }));
    const out = parse({ stack: many });
    expect(out.stack).toHaveLength(STACK_MAX);
    expect(out.stack[0].label).toHaveLength(60);
  });
  it('keeps store and partners as before, with no stack key when empty', () => {
    const out = parse({ store: 'shop.example', links: [], open: true });
    expect(out).toEqual({ store: 'https://shop.example', links: [], open: true });
  });
  it('a stack alone is enough to save', () => {
    expect(parse({ stack: [{ t: 'tips', label: 'Coffee', url: 'https://ko-fi.com/x' }] }).stack).toHaveLength(1);
  });
});
