import { describe, expect, it } from 'vitest';
import {
  FIELD_MAP, MEMBER_WRITABLE, OPTION_IDS, coerce, fieldDataFor, handleProfileHook, memberFrom, eventFrom,
  memberName, slugify, uniqueSlug,
} from '../src/profile-sync.js';

function env(overrides = {}) {
  return { PROFILE_HOOK_TOKEN: 'secret', WEBFLOW_TOKEN: 'wf', CONTRIBUTORS_COLLECTION_ID: 'contributors', ...overrides };
}

function member(customFields = {}, id = 'mem_1', event = 'member.updated', extra = {}) {
  return { event, payload: { id, auth: { email: 'x@example.com' }, customFields, ...extra } };
}

/** A fake Webflow that records every call and answers with the items given. */
function webflowFake(items = []) {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, method: init.method || 'GET', body: init.body ? JSON.parse(init.body) : null });
    if (url.includes('/items?')) return new Response(JSON.stringify({ items }), { status: 200 });
    if (url.endsWith('/items') && init.method === 'POST') return new Response(JSON.stringify({ id: 'c-new' }), { status: 202 });
    return new Response(JSON.stringify({}), { status: 200 });
  };
  return { calls, fetchImpl };
}

describe('FIELD_MAP', () => {
  it('maps the Profile v2 keys and keeps the older Memberstack keys', () => {
    expect(FIELD_MAP['personal-website-url']).toBe('website-url');
    expect(FIELD_MAP['substack-url']).toBe('substack-url-2');
    expect(FIELD_MAP['strava-url']).toBe('strava-url-2');
    for (const key of ['one-line', 'home-base', 'from-and-lived-in', 'languages', 'credit-mode', 'pen-name', 'contact-mode',
      'visibility', 'share-ranges', 'links-shown', 'alltrails-url', 'komoot-url', 'garmin-url', 'beli-url',
      'list-expats', 'list-creators', 'list-press', 'name', 'bio-long', 'instagram-url', 'youtube-url', 'tiktok-url']) {
      expect(FIELD_MAP[key], key).toBe(key);
    }
  });
  it('drops the typed counts, the available-for switches and every editor-only field', () => {
    const slugs = Object.values(FIELD_MAP);
    for (const gone of ['country-count', 'cities-count', 'states-count', 'national-parks-count', 'continents-marathoned',
      'published-count', 'visited-countries', 'available-for-press', 'available-for-partnerships', 'available-for-sponsored-stories',
      'available-for-collabs', 'accepts-newsletter', 'fun-title', 'badge-label', 'press-verified', 'map-snapshot', 'slug', 'memberstack-id']) {
      expect(slugs, gone).not.toContain(gone);
    }
    for (const never of ['badge-label', 'press-verified', 'map-snapshot', 'slug', 'memberstack-id', 'member-since', 'country-count']) {
      expect(MEMBER_WRITABLE, never).not.toContain(never);
    }
  });
});

describe('coerce', () => {
  it('writes option ids from a name or an id', () => {
    expect(coerce('credit-mode', 'Full')).toBe(OPTION_IDS['credit-mode'].Full);
    expect(coerce('credit-mode', 'pen')).toBe(OPTION_IDS['credit-mode'].Pen);
    expect(coerce('contact-mode', OPTION_IDS['contact-mode'].Relay)).toBe(OPTION_IDS['contact-mode'].Relay);
    expect(coerce('visibility', 'Unlisted')).toBe('c32afc794ebfffa4275c7710b9b45c9b');
    expect(coerce('visibility', 'Hidden')).toBeUndefined();
    expect(coerce('visibility', '')).toBeNull();
  });
  it('reads switches as true/false, "true"/"false", "on"/"off"', () => {
    expect(coerce('share-ranges', true)).toBe(true);
    expect(coerce('share-ranges', false)).toBe(false);
    expect(coerce('list-expats', 'true')).toBe(true);
    expect(coerce('list-expats', 'false')).toBe(false);
    expect(coerce('list-press', 'on')).toBe(true);
    expect(coerce('list-press', 'off')).toBe(false);
    expect(coerce('list-creators', 'maybe')).toBeUndefined();
  });
  it('normalizes urls, emails, country lists and links-shown', () => {
    expect(coerce('website-url', 'nancycarleton.com')).toBe('https://nancycarleton.com');
    expect(coerce('beli-url', '')).toBeNull();
    expect(coerce('avatar', 'https://cdn.example/a.jpg')).toEqual({ url: 'https://cdn.example/a.jpg' });
    expect(coerce('email', ' Nancy@Example.com ')).toBe('nancy@example.com');
    expect(coerce('email', 'not an email')).toBeUndefined();
    expect(coerce('from-and-lived-in', 'US, br vn,DK,usa')).toBe('us,br,vn,dk');
    expect(coerce('from-and-lived-in', ['dk', 'US'])).toBe('dk,us');
    expect(coerce('links-shown', 'youtube,instagram,linkedin')).toBe('instagram,youtube');
    expect(coerce('links-shown', '')).toBeNull();
    expect(coerce('crew', 'aaaaaaaaaaaaaaaaaaaaaaaa, nope')).toEqual(['aaaaaaaaaaaaaaaaaaaaaaaa']);
  });
  it('keeps the long bio and plain text rules', () => {
    expect(coerce('bio-long', 'One.\n\nTwo <b>')).toBe('<p>One.</p><p>Two &lt;b&gt;</p>');
    expect(coerce('one-line', '  Seven marathons. ')).toBe('Seven marathons.');
    expect(coerce('name', '')).toBeUndefined();
    expect(coerce('home-base', '')).toBeNull();
  });
});

describe('fieldDataFor', () => {
  it('maps only the keys the member sent', () => {
    const out = fieldDataFor({ customFields: { 'one-line': 'Lifer', 'strava-url': 'strava.com/n', 'country-count': '88', 'unknown': 'x' } });
    expect(out).toEqual({ 'one-line': 'Lifer', 'strava-url-2': 'https://strava.com/n' });
  });
  it('is empty for a member with no profile fields', () => {
    expect(fieldDataFor({ customFields: { 'first-name': 'N' } })).toEqual({});
  });
});

describe('slugs and names', () => {
  it('makes lowercase ascii slugs and steps past collisions', () => {
    expect(slugify('Nancy Brüton  Carleton')).toBe('nancy-bruton-carleton');
    expect(uniqueSlug('Jay Smith', ['nancy'])).toBe('jay-smith');
    expect(uniqueSlug('Jay Smith', ['jay-smith', 'jay-smith-2'])).toBe('jay-smith-3');
    expect(uniqueSlug('', [])).toBe('traveler');
  });
  it('reads the name from the custom fields, then first and last, then the email', () => {
    expect(memberName({ customFields: { name: ' Jay ' } })).toBe('Jay');
    expect(memberName({ customFields: { 'first-name': 'Jay', 'last-name': 'Smith' } })).toBe('Jay Smith');
    expect(memberName({ auth: { email: 'magnus@example.com' }, customFields: {} })).toBe('magnus');
  });
});

describe('memberFrom and eventFrom', () => {
  it('reads a wrapped or bare member and the event name', () => {
    expect(memberFrom(member({}, 'a')).id).toBe('a');
    expect(memberFrom({ id: 'b', customFields: {} }).id).toBe('b');
    expect(memberFrom({ nothing: true })).toBeNull();
    expect(eventFrom(member({}, 'a', 'member.created'))).toBe('member.created');
    expect(eventFrom({ id: 'b' })).toBe('');
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
  it('patches and republishes the matching contributor on member.updated', async () => {
    const { calls, fetchImpl } = webflowFake([
      { id: 'c-other', isDraft: false, fieldData: { 'memberstack-id': 'mem_9' } },
      { id: 'c-nancy', isDraft: false, fieldData: { 'memberstack-id': 'mem_1' } },
    ]);
    const res = await handleProfileHook(request(member({ 'one-line': 'Lifer', 'credit-mode': 'First', 'list-press': 'on', 'country-count': '88' })), env(), { fetchImpl });
    const body = await res.json();
    expect(body.result).toEqual({ member: 'mem_1', item: 'c-nancy', fields: ['one-line', 'credit-mode', 'list-press'], published: true });
    const patch = calls.find((c) => c.method === 'PATCH');
    expect(patch.url).toContain('/collections/contributors/items/c-nancy');
    expect(patch.body).toEqual({ fieldData: { 'one-line': 'Lifer', 'credit-mode': OPTION_IDS['credit-mode'].First, 'list-press': true } });
    expect(calls.find((c) => c.url.endsWith('/items/publish')).body).toEqual({ itemIds: ['c-nancy'] });
  });
  it('reports a member.updated with no contributor item instead of failing', async () => {
    const { fetchImpl } = webflowFake([]);
    const res = await handleProfileHook(request(member({ 'one-line': 'x' }, 'mem_none')), env(), { fetchImpl });
    expect((await res.json()).result.skipped).toMatch(/no Contributors item/);
  });
  it('creates and publishes an item on member.created, stepping past a slug collision', async () => {
    const { calls, fetchImpl } = webflowFake([
      { id: 'c-jay', isDraft: false, fieldData: { 'memberstack-id': 'mem_9', slug: 'jay-smith' } },
    ]);
    const now = Date.parse('2026-10-20T12:00:00Z');
    const payload = member({ name: 'Jay Smith', 'home-base': 'Lisbon', 'badge-label': 'FOUNDER', slug: 'evil' }, 'mem_new', 'member.created', { profileImage: 'https://cdn.example/jay.jpg' });
    const res = await handleProfileHook(request(payload), env(), { fetchImpl, now });
    const { result } = await res.json();
    expect(result).toMatchObject({ member: 'mem_new', item: 'c-new', slug: 'jay-smith-2', created: true, published: true });
    const create = calls.find((c) => c.method === 'POST' && c.url.endsWith('/items'));
    expect(create.body.fieldData).toEqual({
      name: 'Jay Smith',
      slug: 'jay-smith-2',
      'memberstack-id': 'mem_new',
      'member-since': '2026-10-20T12:00:00.000Z',
      visibility: OPTION_IDS.visibility.Public,
      'contact-mode': OPTION_IDS['contact-mode'].Relay,
      'credit-mode': OPTION_IDS['credit-mode'].Full,
      'home-base': 'Lisbon',
      avatar: { url: 'https://cdn.example/jay.jpg' },
    });
    expect(calls.find((c) => c.url.endsWith('/items/publish')).body).toEqual({ itemIds: ['c-new'] });
  });
  it('treats a retried member.created as an update when the item already exists', async () => {
    const { calls, fetchImpl } = webflowFake([
      { id: 'c-jay', isDraft: false, fieldData: { 'memberstack-id': 'mem_9', slug: 'jay-smith' } },
    ]);
    const res = await handleProfileHook(request(member({ name: 'Jay Smith', languages: 'en, pt' }, 'mem_9', 'member.created')), env(), { fetchImpl });
    const { result } = await res.json();
    expect(result).toEqual({ member: 'mem_9', item: 'c-jay', fields: ['name', 'languages'], published: true });
    expect(calls.some((c) => c.method === 'POST' && c.url.endsWith('/items'))).toBe(false);
  });
});
