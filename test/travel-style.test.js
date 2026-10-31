import { describe, it, expect } from 'vitest';
import { cleanStyles, monthly } from '../src/travel-style.js';
describe('travel style', () => {
  it('keeps known choices only and counts each member once a month', () => {
    expect(cleanStyles(['work', 'pet', 'work', 'spy'])).toEqual(['work', 'pet']);
    expect(cleanStyles('work')).toBe(null);
    const m = monthly([{ styles: ['work', 'pet'], at: '2026-11-02T10:00:00Z' }, { styles: ['work'], at: '2026-11-20T10:00:00Z' }, { styles: ['abroad'], at: '2026-12-01T10:00:00Z' }]);
    expect(m['2026-11']).toMatchObject({ members: 2, work: 2, pet: 1, abroad: 0 });
    expect(m['2026-12'].abroad).toBe(1);
  });
});
