// Routing for the "Download everything" routes through the Worker's fetch handler: the member route /export/prepare answers
// its CORS preflight and takes POST only; GET /export/zip is a plain navigation target; GET /export/photo answers its
// preflight with CORS for the site origins. Nothing here reaches Memberstack or Webflow: every call stops before a lookup.
import { describe, it, expect } from 'vitest';
import worker from '../src/index.js';

const SITE = 'https://www.thatlayover.life';
const env = { WEBFLOW_TOKEN: 't', MEMBERSTACK_KEY: 'k', CONTRIBUTORS_COLLECTION_ID: 'c', WIRE_KV: { get: async () => null, put: async () => {}, delete: async () => {} } };
const ctx = { waitUntil() {} };
const call = (path, method = 'GET', headers = {}) => worker.fetch(new Request(`https://w.dev${path}`, { method, headers }), env, ctx);

describe('export routes', () => {
  it('POST /export/prepare is a member route: preflight with CORS, POST reaches the handler, GET is 405', async () => {
    const pre = await call('/export/prepare', 'OPTIONS', { Origin: SITE });
    expect(pre.status).toBe(204);
    expect(pre.headers.get('Access-Control-Allow-Origin')).toBe(SITE);
    expect(pre.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
    expect(pre.headers.get('Access-Control-Allow-Headers')).toBe('Authorization, Content-Type');
    const post = await call('/export/prepare', 'POST', { Origin: SITE });
    expect(post.status).toBe(401);
    expect(await post.json()).toEqual({ error: 'Please sign in to continue.' });
    expect(post.headers.get('Access-Control-Allow-Origin')).toBe(SITE);
    const get = await call('/export/prepare', 'GET', { Origin: SITE });
    expect(get.status).toBe(405);
    const outside = await call('/export/prepare', 'OPTIONS', { Origin: 'https://elsewhere.example' });
    expect(outside.status).toBe(204);
    expect(outside.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('GET /export/zip is a navigation target: a missing token is a small page with a way back, POST is 405', async () => {
    const res = await call('/export/zip');
    expect(res.status).toBe(404);
    expect(res.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
    expect(await res.text()).toContain('Back to your account');
    expect((await call('/export/zip?t=abc', 'POST')).status).toBe(405);
  });

  it('GET /export/photo answers its preflight with GET CORS for the site origins, refuses a missing token, and takes GET only', async () => {
    const pre = await call('/export/photo', 'OPTIONS', { Origin: SITE });
    expect(pre.status).toBe(204);
    expect(pre.headers.get('Access-Control-Allow-Origin')).toBe(SITE);
    expect(pre.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS');
    const res = await call('/export/photo?u=https%3A%2F%2Fcdn.prod.website-files.com%2Fa.jpg', 'GET', { Origin: SITE });
    expect(res.status).toBe(404);
    expect(res.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(SITE);
    const post = await call('/export/photo', 'POST', { Origin: SITE });
    expect(post.status).toBe(405);
    expect(post.headers.get('Access-Control-Allow-Origin')).toBe(SITE);
    const outside = await call('/export/photo', 'OPTIONS', { Origin: 'https://elsewhere.example' });
    expect(outside.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });
});
