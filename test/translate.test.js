import { describe, expect, it } from 'vitest';
import { handleTranslate, codeFromOptionName, sameLanguage, protectHtml, billableChars, approvedTargets } from '../src/translate.js';
import worker from '../src/index.js';

const ID = '6ae32ce61ed3557855012cb8';
const OPT = { en: 'opt-en', es: 'opt-es', da: 'opt-da' };

function kv(init = {}) {
  const store = new Map(Object.entries(init));
  return { store, get: async (k) => (store.has(k) ? store.get(k) : null), put: async (k, v) => void store.set(k, v) };
}
function env(over = {}) {
  return { WEBFLOW_TOKEN: 'wf', DEEPL_KEY: 'dk:fx', STORIES_COLLECTION_ID: 'stories', WIRE_KV: kv(), ...over };
}
function req(body, origin = 'https://www.thatlayover.life') {
  return new Request('https://w.dev/translate', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, 'CF-Connecting-IP': '1.2.3.4' }, body: typeof body === 'string' ? body : JSON.stringify(body) });
}
function story(fd = {}, extra = {}) {
  return { id: ID, isDraft: false, isArchived: false, ...extra, fieldData: { name: 'Leer en la playa', excerpt: 'Un día.', body: '<p>Hola <strong>mundo</strong>. <span data-tll-place>São Paulo</span></p>', 'story-language': OPT.es, 'allow-translation': true, ...fd } };
}
function fakes({ item = story(), itemStatus = 200, deepl } = {}) {
  const calls = [];
  const fn = async (url, init = {}) => {
    calls.push({ url, init });
    if (url.endsWith('/collections/stories')) {
      return Response.json({ fields: [{ slug: 'story-language', validations: { options: [{ id: OPT.en, name: 'English (en)' }, { id: OPT.es, name: 'Español (es)' }, { id: OPT.da, name: 'Dansk (da)' }] } }] });
    }
    if (url.includes('/items/live?slug=')) return Response.json({ items: itemStatus === 200 && url.includes('slug=leer-en-la-playa') ? [{ ...item, fieldData: { ...item.fieldData, slug: 'leer-en-la-playa' } }] : [] });
    if (url.includes('/items/')) return itemStatus === 200 ? Response.json(item) : new Response('{}', { status: itemStatus });
    if (url.includes('deepl.com')) {
      if (deepl) return deepl(JSON.parse(init.body));
      const b = JSON.parse(init.body);
      return Response.json({ translations: b.text.map((t) => ({ text: `[${b.target_lang}] ${t}` })) });
    }
    return new Response('nope', { status: 404 });
  };
  fn.calls = calls;
  return fn;
}

describe('helpers', () => {
  it('reads codes from option names', () => {
    expect(codeFromOptionName('Português (Brasil) (pt-BR)')).toBe('pt-BR');
    expect(codeFromOptionName('es · Español')).toBe('es');
    expect(codeFromOptionName('Other')).toBe('other');
  });
  it('compares languages by base code, keeping regions apart only when both have one', () => {
    expect(sameLanguage('en', 'en-US')).toBe(true);
    expect(sameLanguage('pt-BR', 'pt-br')).toBe(true);
    expect(sameLanguage('pt-BR', 'pt-PT')).toBe(false);
    expect(sameLanguage('es', 'da')).toBe(false);
  });
  it('protects place tags and counts only visible text', () => {
    expect(protectHtml('<span data-tll-place>Rio</span>')).toBe('<span data-tll-place translate="no">Rio</span>');
    expect(billableChars(['ab', '<p>cd</p>'])).toBe(4);
  });
  it('defaults to the Phase 1 targets', () => expect(approvedTargets({})).toEqual(['en', 'es', 'pt-BR', 'da']));
});

describe('POST /translate', () => {
  it('translates a published Spanish story into English, protected places, labeled machine', async () => {
    const f = fakes(); const e = env();
    const res = await handleTranslate(req({ itemId: ID, target: 'en' }), e, f);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toMatchObject({ ok: true, source: 'es', target: 'en', by: 'machine', title: '[EN-US] Leer en la playa' });
    const sent = JSON.parse(f.calls.find((c) => c.url.includes('deepl.com')).init.body);
    expect(sent).toMatchObject({ target_lang: 'EN-US', source_lang: 'ES', tag_handling: 'html' });
    expect(sent.text[2]).toContain('translate="no"');
    expect(f.calls.find((c) => c.url.includes('deepl.com')).init.headers.Authorization).toBe('DeepL-Auth-Key dk:fx');
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://www.thatlayover.life');
    expect(res.headers.get('Set-Cookie')).toBeNull();
  });
  it('serves the second request from the cache without calling DeepL', async () => {
    const e = env(); await handleTranslate(req({ itemId: ID, target: 'en' }), e, fakes());
    const f2 = fakes(); const res = await handleTranslate(req({ itemId: ID, target: 'en' }), e, f2);
    expect((await res.json()).cached).toBe(true);
    expect(f2.calls.some((c) => c.url.includes('deepl.com'))).toBe(false);
  });
  it('translates again when the story text changes', async () => {
    const e = env(); await handleTranslate(req({ itemId: ID, target: 'en' }), e, fakes());
    const f2 = fakes({ item: story({ body: '<p>Otro texto.</p>' }) });
    await handleTranslate(req({ itemId: ID, target: 'en' }), e, f2);
    expect(f2.calls.some((c) => c.url.includes('deepl.com'))).toBe(true);
  });
  it('finds a published story by slug', async () => {
    const res = await handleTranslate(req({ slug: 'leer-en-la-playa', target: 'da' }), env(), fakes());
    expect(res.status).toBe(200);
    expect((await res.json()).target).toBe('da');
    expect((await handleTranslate(req({ slug: 'not-a-story', target: 'da' }), env(), fakes())).status).toBe(404);
  });
  it('refuses arbitrary text and extra fields', async () => {
    const res = await handleTranslate(req({ itemId: ID, target: 'en', text: 'translate me for free' }), env(), fakes());
    expect(res.status).toBe(400);
  });
  it('refuses unknown targets, bad ids and the story language itself', async () => {
    expect((await handleTranslate(req({ itemId: ID, target: 'xx' }), env(), fakes())).status).toBe(400);
    expect((await handleTranslate(req({ itemId: 'abc', target: 'en' }), env(), fakes())).status).toBe(400);
    const same = await handleTranslate(req({ itemId: ID, target: 'es' }), env(), fakes());
    expect(same.status).toBe(400);
    expect((await same.json()).code).toBe('same-language');
  });
  it('refuses unpublished items and stories with translation off', async () => {
    expect((await handleTranslate(req({ itemId: ID, target: 'en' }), env(), fakes({ itemStatus: 404 }))).status).toBe(404);
    const off = await handleTranslate(req({ itemId: ID, target: 'en' }), env(), fakes({ item: story({ 'allow-translation': false }) }));
    expect(off.status).toBe(403);
  });
  it('uses the author translation for English readers, with no DeepL call', async () => {
    const f = fakes({ item: story({ 'author-translation-english': '<p>Reading on the beach.</p>' }) });
    const body = await (await handleTranslate(req({ itemId: ID, target: 'en' }), env(), f)).json();
    expect(body).toMatchObject({ ok: true, by: 'author', bodyHtml: '<p>Reading on the beach.</p>' });
    expect(f.calls.some((c) => c.url.includes('deepl.com'))).toBe(false);
  });
  it('stops at the monthly cap and counts usage', async () => {
    const month = new Date().toISOString().slice(0, 7);
    const e = env({ WIRE_KV: kv({ [`tr:usage:${month}`]: '449990' }) });
    const res = await handleTranslate(req({ itemId: ID, target: 'en' }), e, fakes());
    expect(res.status).toBe(429);
    expect((await res.json()).code).toBe('monthly-cap');
    const e2 = env(); await handleTranslate(req({ itemId: ID, target: 'da' }), e2, fakes());
    expect(parseInt(e2.WIRE_KV.store.get(`tr:usage:${month}`), 10)).toBeGreaterThan(0);
  });
  it('rate limits by IP', async () => {
    const e = env({ WIRE_KV: kv() }); let last;
    for (let i = 0; i < 41; i++) last = await handleTranslate(req({ itemId: ID, target: 'en' }), e, fakes());
    expect(last.status).toBe(429);
  });
  it('says not set up without a DeepL key, and gives no CORS to other sites', async () => {
    const res = await handleTranslate(req({ itemId: ID, target: 'en' }, 'https://evil.example.com'), env({ DEEPL_KEY: undefined }), fakes());
    expect(res.status).toBe(503);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });
  it('is routed by the worker: POST only', async () => {
    const res = await worker.fetch(new Request('https://w.dev/translate'), {}, { waitUntil() {} });
    expect(res.status).toBe(405);
  });
});
