import { describe, it, expect } from 'vitest';
import { pickLinks, enrichStory, enqueueEnrich, runEnrich, summaryHtml, STORY_LABEL, LINKS_LABEL } from '../src/story-enrich.js';

const body = '<p>' + 'We walked the Forum at sunrise and stayed until closing time at the park. '.repeat(12) + '</p>';

function fakeClient() {
  const calls = [];
  return {
    calls,
    beta: { messages: { create: async (p) => {
      calls.push(p);
      if (p.tools) {
        return { stop_reason: 'end_turn', model: 'm', content: [
          { type: 'server_tool_use', id: 's1', name: 'web_search', input: { query: 'Pompeii' } },
          { type: 'web_search_tool_result', tool_use_id: 's1', content: [{ type: 'web_search_result', url: 'https://pompeiisites.org/en/', title: 'Pompeii' }, { type: 'web_search_result', url: 'https://www.tripadvisor.com/x', title: 'TA' }, { type: 'web_search_result', url: 'https://pompeiisites.org/en/villa', title: 'Villa' }] },
          { type: 'text', text: '[{"url":"https://pompeiisites.org/en/","text":"Pompeii Archaeological Park — Home"},{"url":"https://made-up.example/","text":"Invented"},{"url":"https://www.tripadvisor.com/x","text":"TA"},{"url":"https://pompeiisites.org/en/villa","text":"Pompeii Archaeological Park: Villa of the Mysteries!"}]' },
        ] };
      }
      return { stop_reason: 'end_turn', model: 'm', content: [{ type: 'text', text: 'A day at Pompeii — from sunrise to closing.' }] };
    } } },
  };
}

function fakeWebflow(fieldData) {
  const writes = [];
  const fetchImpl = async (url, init = {}) => {
    if (init.method === 'PATCH') writes.push(JSON.parse(init.body).fieldData);
    if (init.method === 'POST') writes.push({ published: JSON.parse(init.body).itemIds });
    return new Response(JSON.stringify(init.method ? {} : { id: 'st1', isDraft: false, fieldData }), { status: 200 });
  };
  return { writes, fetchImpl };
}
const env = { STORIES_COLLECTION_ID: 'stories', WEBFLOW_TOKEN: 't', ANTHROPIC_API_KEY: 'k' };

describe('story enrichment', () => {
  it('keeps only links that came back from search, never booking sites or invented ones', () => {
    const allowed = new Set(['https://pompeiisites.org/en/', 'https://www.tripadvisor.com/x']);
    const out = pickLinks('[{"url":"https://pompeiisites.org/en/","text":"Park"},{"url":"https://nope.example/","text":"x"},{"url":"https://www.tripadvisor.com/x","text":"TA"}]', allowed);
    expect(out).toEqual([{ url: 'https://pompeiisites.org/en/', text: 'Park' }]);
  });
  it('fills an empty summary and links block, labeled, house style, then publishes', async () => {
    const { writes, fetchImpl } = fakeWebflow({ name: 'Pompeii', body });
    const r = await enrichStory(env, 'st1', { fetchImpl, client: fakeClient() });
    expect(r).toBe('added short-version, links-and-mentions');
    expect(writes[0]['short-version']).toBe(summaryHtml('A day at Pompeii, from sunrise to closing.'));
    expect(writes[0]['short-version']).toContain(STORY_LABEL);
    expect(writes[0]['links-and-mentions']).toBe('<ul><li><a href="https://pompeiisites.org/en/">Pompeii Archaeological Park: Home</a></li><li><a href="https://pompeiisites.org/en/villa">Pompeii Archaeological Park: Villa of the Mysteries</a></li></ul><p><em>' + LINKS_LABEL + '</em></p>');
    expect(writes[1]).toEqual({ published: ['st1'] });
  });
  it('never overwrites what is already there and skips link-out stories', async () => {
    let w = fakeWebflow({ name: 'P', body, 'short-version': '<p>mine</p>', 'links-and-mentions': '<ul></ul>' });
    expect(await enrichStory(env, 'st1', { fetchImpl: w.fetchImpl, client: fakeClient() })).toBe('nothing to add');
    expect(w.writes).toEqual([]);
    w = fakeWebflow({ name: 'P', body, 'external-url': 'https://x.example' });
    expect(await enrichStory(env, 'st1', { fetchImpl: w.fetchImpl, client: fakeClient() })).toBe('skipped');
  });
  it('waits without a key and works through the queue three at a time', async () => {
    const kv = new Map();
    const KV = { get: async (k) => kv.get(k) ?? null, put: async (k, v) => { kv.set(k, v); } };
    for (const id of ['a', 'b', 'c', 'd']) await enqueueEnrich({ WIRE_KV: KV }, id);
    expect(await runEnrich({ ...env, ANTHROPIC_API_KEY: '', WIRE_KV: KV })).toMatch(/skipped/);
    const { fetchImpl } = fakeWebflow({ name: 'P', body });
    await runEnrich({ ...env, WIRE_KV: KV }, { fetchImpl, client: fakeClient() });
    expect(JSON.parse(kv.get('enrich:queue'))).toEqual(['d']);
  });
  it('sweeps live stories still missing a block once the queue is empty, once each', async () => {
    const kv = new Map([['enrich:queue', '[]']]);
    const KV = { get: async (k) => kv.get(k) ?? null, put: async (k, v) => { kv.set(k, v); } };
    const live = [
      { id: 'full', fieldData: { 'short-version': 'x', 'links-and-mentions': 'y' } },
      { id: 'out', fieldData: { 'external-url': 'https://x.example' } },
      { id: 'gap', fieldData: { 'short-version': 'x' } },
    ];
    const fetchImpl = async (url, init = {}) => new Response(JSON.stringify(/items\/live/.test(url) ? { items: live } : init.method ? {} : { id: 'gap', isDraft: false, fieldData: { name: 'P', body, 'short-version': 'x' } }), { status: 200 });
    expect(await runEnrich({ ...env, WIRE_KV: KV }, { fetchImpl, client: fakeClient() })).toBe('enrich: gap added links-and-mentions');
    expect(await runEnrich({ ...env, WIRE_KV: KV }, { fetchImpl, client: fakeClient() })).toBe('enrich: nothing missing');
  });
});
