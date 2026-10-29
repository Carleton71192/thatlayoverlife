import { describe, it, expect } from 'vitest';
import { webflow, RETRY_DELAYS_MS } from '../src/profile-sync.js';

RETRY_DELAYS_MS[0] = 0; RETRY_DELAYS_MS[1] = 0;
const res = (status, body = {}) => ({ ok: status < 300, status, headers: { get: () => null }, json: async () => body, text: async () => JSON.stringify(body) });

describe('webflow retry', () => {
  it('retries a busy answer and then succeeds', async () => {
    const answers = [res(409, { message: 'busy' }), res(429), res(200, { ok: 1 })];
    let calls = 0;
    const out = await webflow({ WEBFLOW_TOKEN: 't' }, async () => answers[calls++], '/x');
    expect(out).toEqual({ ok: 1 });
    expect(calls).toBe(3);
  });
  it('gives up after two retries and names the status and reply', async () => {
    let calls = 0;
    await expect(webflow({ WEBFLOW_TOKEN: 't' }, async () => { calls += 1; return res(409, { message: 'Conflict' }); }, '/x')).rejects.toThrow(/HTTP 409 .*Conflict/);
    expect(calls).toBe(3);
  });
  it('does not retry a bad request', async () => {
    let calls = 0;
    await expect(webflow({ WEBFLOW_TOKEN: 't' }, async () => { calls += 1; return res(400); }, '/x')).rejects.toThrow(/HTTP 400/);
    expect(calls).toBe(1);
  });
});
