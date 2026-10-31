import { describe, it, expect } from 'vitest';
import { prosList, relFor } from '../src/pros.js';

describe('From the Pros', () => {
  it('link rules: ugc nofollow until trusted, plain once trusted, sponsored when paid or hosted', () => {
    expect(relFor({})).toBe('ugc nofollow noopener');
    expect(relFor({ trusted: true })).toBe('noopener');
    expect(relFor({ trusted: true, 'paid-or-hosted': true })).toBe('sponsored noopener noreferrer');
  });
  it('lists published pros with a live, visible profile, one https link anchored on their name', () => {
    const people = [{ id: 'c1', fieldData: { slug: 'jane', name: 'Jane Doe' } }, { id: 'c2', fieldData: { slug: 'off', name: 'Off', visibility: '1423c8d17c2060776541377f76ea0b31' } }];
    const out = prosList([
      { fieldData: { contributor: 'c1', 'link-name': 'Jane Doe Travels', 'their-site': 'https://janedoe.example', 'pro-line': 'Six Star finisher', pursuit: 'p1' } },
      { fieldData: { contributor: 'c2', 'their-site': 'https://x.example' } },
      { fieldData: { contributor: 'c9' } },
      { fieldData: { contributor: 'c1', 'their-site': 'javascript:alert(1)' } },
    ], people, [{ id: 'p1', fieldData: { slug: 'marathons', name: 'Marathons', 'display-name': 'That Global Marathon Life' } }]);
    expect(out).toHaveLength(2);
    expect(out[0]).toMatchObject({ slug: 'jane', linkName: 'Jane Doe Travels', url: 'https://janedoe.example', rel: 'ugc nofollow noopener', pursuit: { slug: 'marathons', name: 'That Global Marathon Life' } });
    expect(out[1].url).toBe('');
  });
});
