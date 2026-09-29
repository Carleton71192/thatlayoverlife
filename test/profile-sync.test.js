import { describe, expect, it } from 'vitest';
import { coerce, fieldDataFor, handleProfileHook, memberFrom } from '../src/profile-sync.js';

function env(overrides = {}) {
  return { PROFILE_HOOK_TOKEN: 'secret', WEBFLOW_TOKEN: 'wf', CONTRIBUTORS_COLLECTION_ID: 'contributors', ...overrides };
}

function member(customFields = {}, id = 'mem_1') {
  return { event: 'member.updated', payload: { id, auth: { email: 'x@example.com' }, customFields } };
}

describe('coerce', () => {
  it('turns switches, numbers, urls and long bios into CMS types', () => {
    expect(coerce('available-for-press', 'true')).toBe(true);
    expect(coerce('available-for-press', '')).toBe(false);
    expect(coerce('country-count', '87')).toBe(87);
    expect(coerce('country-count', 'x')).toBeUndefined();
    expect(coerce('country-count', '')).toBeNull();
    expect(coerce('website-url', 'nancycarleton.com')).toBe('https://nancycarleton.com');
    expect(coerce('bio-long', 'One.\n\nTwo <b>')).toBe('<p>One.</p><p>Two &lt;b&gt;</p>');
    expect(coerce('fun-title', '  The Lifer ')).toBe('The Lifer');
  });
});

describe('fieldDataFor', () => {
  it('maps only the keys the member sent', () => {
    const out = fieldDataFor({ customFields: { 'fun-title': 'Lifer', 'linkedin-url': 'https://l.in/n', 'unknown': 'x' } });
    expect(out).toEqual({ 'fun-title': 'Lifer', 'linkedin-url-2': 'https://l.in/n' });
  });
  it('is empty for a member with no profile fields', () => {
    expect(fieldDataFor({ customFields: { 'first-name': 'N' } })).toEqual({});
  });
});

describe('memberFrom', () => {
  it('reads a wrapped or bare member', () => {
    expect(memberFrom(member({}, 'a')).id).toBe('a');
    expect(memberFrom({ id: 'b', customFields: {} }).id).toBe('b');
    expect(memberFrom({ nothing: true })).toBeNull();
  });
});

describe('handleProfileHook', () => {
  function request(body, token = 'secret') {
    return new Request(`https://w.example/hooks/member-updated?token=${token}`, { method: 'POST', body: JSON.stringify(body) });
  }
  it('refuses a bad token and hides the route without one', async () => {
    expect((await handleProfileHook(request(member(), 'nope'), env())).status).toBe(401);
    expect((await handleProfileHook(request(member()), env({ PROFILE_HOOK_TOKEN: '' }))).status).toBe(404);
  });
  it('patches and republishes the matching contributor', async () => {
    const calls = [];
    const fetchImpl = async (url, init = {}) => {
      calls.push({ url, method: init.method || 'GET', body: init.body ? JSON.parse(init.body) : null });
      if (url.includes('/items?')) {
        return new Response(JSON.stringify({ items: [
          { id: 'c-other', isDraft: false, fieldData: { 'memberstack-id': 'mem_9' } },
          { id: 'c-nancy', isDraft: false, fieldData: { 'memberstack-id': 'mem_1' } },
        ] }), { status: 200 });
      }
      return new Response(JSON.stringify({}), { status: 200 });
    };
    const res = await handleProfileHook(request(member({ 'fun-title': 'Lifer', 'country-count': '88' })), env(), { fetchImpl });
    const body = await res.json();
    expect(body.result).toEqual({ member: 'mem_1', item: 'c-nancy', fields: ['fun-title', 'country-count'], published: true });
    const patch = calls.find((c) => c.method === 'PATCH');
    expect(patch.url).toContain('/collections/contributors/items/c-nancy');
    expect(patch.body).toEqual({ fieldData: { 'fun-title': 'Lifer', 'country-count': 88 } });
    expect(calls.find((c) => c.url.endsWith('/items/publish')).body).toEqual({ itemIds: ['c-nancy'] });
  });
  it('reports a member with no contributor item instead of failing', async () => {
    const fetchImpl = async () => new Response(JSON.stringify({ items: [] }), { status: 200 });
    const res = await handleProfileHook(request(member({ 'fun-title': 'x' }, 'mem_none')), env(), { fetchImpl });
    expect((await res.json()).result.skipped).toMatch(/no Contributors item/);
  });
});
