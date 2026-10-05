import { describe, it, expect } from 'vitest';
import { prefsFrom, prefsToFields, slugifyHandle, shareUrlFor, randomSlug } from '../src/site-layers/tll-share-v1.js';

describe('share layer prefs (G10)', () => {
  it('a new member starts Off with nothing public', () => {
    const p = prefsFrom({});
    expect(p.level).toBe('off');
    expect(shareUrlFor(p)).toBeNull();
    expect(prefsToFields(p)['share-slug']).toBe('');
  });
  it('reads the four share-* fields back', () => {
    const p = prefsFrom({ 'share-level': 'unlisted', 'share-slug': 'k7f3q9', 'share-items': 'count,map', 'share-ranges': 'true' });
    expect(p).toEqual({ level: 'unlisted', slug: 'k7f3q9', items: ['count', 'map'], ranges: true });
    expect(shareUrlFor(p)).toBe('https://thatlayover.life/p/k7f3q9');
  });
  it('rejects unknown levels', () => {
    expect(prefsFrom({ 'share-level': 'everyone' }).level).toBe('off');
  });
  it('handles are lowercase ascii slugs', () => {
    expect(slugifyHandle('Nancy Carleton')).toBe('nancy-carleton');
    expect(slugifyHandle('Søren')).toBe('soren');
  });
});
