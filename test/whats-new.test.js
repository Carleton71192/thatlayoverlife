import { describe, it, expect } from 'vitest';
import { liveEntries } from '../src/whats-new.js';

const e = (slug, f) => ({ isDraft: false, isArchived: false, fieldData: { name: slug, slug, line: 'x', button: 'Go', link: `https://www.thatlayover.life/${slug}#a`, starts: '2026-10-31T00:00:00Z', live: true, ...f } });
describe("what's new", () => {
  it('serves only switched-on entries whose start has passed, newest first, site links only', () => {
    const now = Date.parse('2026-11-02T00:00:00Z');
    const out = liveEntries([e('a'), e('off', { live: false }), e('later', { starts: '2026-12-01T00:00:00Z' }), e('b', { starts: '2026-11-01T00:00:00Z' }), e('evil', { link: 'https://evil.example/x' })], now);
    expect(out.map((x) => x.id)).toEqual(['b', 'a', 'evil']);
    expect(out[1].link).toBe('/a#a');
    expect(out[2].link).toBe('');
  });
});
