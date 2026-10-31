import { describe, it, expect } from 'vitest';
import { entryFrom, toCsv, handlePaw } from '../src/paw.js';

describe('Paw Passport waitlist', () => {
  it('needs a working email and consent, keeps only known interests, drops bots quietly', () => {
    expect(entryFrom({ email: 'x', consent: true }).error).toBeTruthy();
    expect(entryFrom({ email: 'a@b.dk' }).error).toMatch(/Tick/);
    expect(entryFrom({ email: 'a@b.dk', consent: true, website: 'spam' }).error).toBe('bot');
    const e = entryFrom({ email: ' A@B.dk ', consent: true, pet: 'Magnus <b>', interests: ['plush', 'crypto'] }, Date.parse('2026-10-31T12:00:00Z')).entry;
    expect(e).toEqual({ email: 'a@b.dk', pet: 'Magnus b', interests: ['plush'], source: 'the-paw-passport', consentAt: '2026-10-31T12:00:00.000Z' });
  });
  it('dedupes by email, and only the site owner can export', async () => {
    const kv = new Map();
    const env = { OWNER_MEMBER_ID: 'mem_owner', MEMBERSTACK_KEY: 'k', WIRE_KV: { get: async (k) => kv.get(k) ?? null, put: async (k, v) => { kv.set(k, v); } } };
    const fetchImpl = async (u, init) => new Response(JSON.stringify({ data: { id: JSON.parse(init.body).token } }), { status: 200 });
    const post = (path, body, token) => handlePaw(new Request(`https://w.example${path}`, { method: 'POST', headers: { Origin: 'https://www.thatlayover.life', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body || {}) }), env, { fetchImpl });
    await post('/paw/waitlist', { email: 'a@b.dk', consent: true, interests: ['guide'] });
    await post('/paw/waitlist', { email: 'a@b.dk', consent: true, interests: ['plush'], source: 'qr:mini' });
    expect((await post('/paw/waitlist/export', {}, 'mem_someone')).status).toBe(403);
    const r = await post('/paw/waitlist/export', {}, 'mem_owner');
    expect(r.headers.get('X-Count')).toBe('1');
    expect((await r.text()).split('\n')[1]).toMatch(/^a@b\.dk,,guide plush,qr:mini,/);
  });
  it('writes a safe CSV', () => {
    expect(toCsv([{ email: 'a@b.dk', pet: 'Max, "the dog"', interests: ['guide'], source: 's', consentAt: 't' }])).toBe('email,pet,interests,source,consent_at\na@b.dk,"Max, ""the dog""",guide,s,t\n');
  });
});
