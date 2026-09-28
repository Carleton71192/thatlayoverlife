import { describe, expect, it } from 'vitest';
import { handleStoryHook, publishedItems } from '../src/story-hook.js';

function memoryKv() {
  const store = new Map();
  return {
    store,
    get: async (key) => (store.has(key) ? store.get(key) : null),
    put: async (key, value) => void store.set(key, value),
  };
}

function env(overrides = {}) {
  return {
    STORY_HOOK_TOKEN: 'secret',
    WEBFLOW_TOKEN: 'wf',
    MEMBERSTACK_KEY: 'ms',
    STORIES_COLLECTION_ID: 'stories',
    CONTRIBUTORS_COLLECTION_ID: 'contributors',
    COUNTRIES_COLLECTION_ID: 'countries',
    WIRE_KV: memoryKv(),
    ...overrides,
  };
}

function story(overrides = {}) {
  return {
    id: 'story-1',
    collectionId: 'stories',
    isDraft: false,
    isArchived: false,
    fieldData: { contributor: 'nancy', 'byline-location': 'CHILE AND ARGENTINA', ...overrides },
  };
}

function hookRequest(body, token = 'secret') {
  return new Request(`https://w.example/hooks/story-published?token=${token}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

function fakeApis({ memberJson = {}, contributor = { 'memberstack-id': 'mem_1' } } = {}) {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, method: init.method || 'GET', body: init.body });
    if (url.includes('/collections/contributors/items/')) {
      return Response.json({ fieldData: contributor });
    }
    if (url.includes('/collections/countries/items/')) {
      return Response.json({ fieldData: { iso2: 'dk' } });
    }
    if (url.includes('admin.memberstack.com/members/') && (init.method || 'GET') === 'GET') {
      return Response.json({ data: { id: 'mem_1', json: memberJson } });
    }
    if (url.includes('admin.memberstack.com/members/') && init.method === 'PATCH') {
      return Response.json({ data: { id: 'mem_1' } });
    }
    return new Response('nope', { status: 500 });
  };
  return { calls, fetchImpl };
}

describe('publishedItems', () => {
  it('reads single and wrapped payloads', () => {
    expect(publishedItems({ payload: story() })).toHaveLength(1);
    expect(publishedItems({ payload: { items: [story(), story()] } })).toHaveLength(2);
    expect(publishedItems({})).toEqual([]);
  });
});

describe('handleStoryHook', () => {
  it('is a 404 until the token is configured', async () => {
    const response = await handleStoryHook(hookRequest({}), env({ STORY_HOOK_TOKEN: '' }));
    expect(response.status).toBe(404);
  });

  it('rejects a wrong token', async () => {
    const response = await handleStoryHook(hookRequest({}, 'wrong'), env());
    expect(response.status).toBe(401);
  });

  it('adds the story countries and keeps every other JSON key', async () => {
    const e = env();
    const { calls, fetchImpl } = fakeApis({
      memberJson: { favourite: 'coconut', tllStates: { v: 2, travelers: [{ id: 't1', name: 'Nancy', pet: false }], states: { '152': { t1: 'lived' } } } },
    });
    const response = await handleStoryHook(hookRequest({ payload: story() }), e, { fetchImpl });
    const { results } = await response.json();

    expect(results[0].added).toEqual(['032']);
    const patch = calls.find((call) => call.method === 'PATCH');
    const sent = JSON.parse(patch.body).json;
    expect(sent.favourite).toBe('coconut');
    expect(sent.tllStates.states['152']).toEqual({ t1: 'lived' });
    expect(sent.tllStates.states['032']).toEqual({ t1: 'visited' });
    expect(typeof sent.tllStatesAt).toBe('number');
  });

  it('uses the Countries reference when the story has one', async () => {
    const { calls, fetchImpl } = fakeApis();
    const response = await handleStoryHook(
      hookRequest({ payload: story({ 'country-2': 'dk-item', 'byline-location': 'Copenhagen' }) }),
      env(),
      { fetchImpl },
    );
    const { results } = await response.json();
    expect(results[0].alpha2).toEqual(['DK']);
    expect(calls.some((call) => call.url.includes('/collections/countries/items/dk-item'))).toBe(true);
  });

  it('applies a story only once', async () => {
    const e = env();
    const first = fakeApis();
    await handleStoryHook(hookRequest({ payload: story() }), e, { fetchImpl: first.fetchImpl });
    const second = fakeApis();
    const response = await handleStoryHook(hookRequest({ payload: story() }), e, { fetchImpl: second.fetchImpl });
    const { results } = await response.json();
    expect(results[0].skipped).toBe('already applied');
    expect(second.calls).toHaveLength(0);
  });

  it('skips drafts, other collections and authors without a member ID', async () => {
    const { fetchImpl } = fakeApis({ contributor: {} });
    const body = { payload: { items: [
      { ...story(), isDraft: true },
      { ...story(), collectionId: 'pets' },
      story(),
    ] } };
    const response = await handleStoryHook(hookRequest(body), env(), { fetchImpl });
    const { results } = await response.json();
    expect(results.map((result) => result.skipped)).toEqual([
      'not live',
      'not a story',
      'contributor has no Memberstack ID',
    ]);
  });

  it('writes nothing when every country is already on the map', async () => {
    const { calls, fetchImpl } = fakeApis({
      memberJson: { tllStates: { v: 2, travelers: [{ id: 't1', pet: false }], states: { '152': { t1: 'visited' }, '032': { t1: 'layover' } } } },
    });
    await handleStoryHook(hookRequest({ payload: story() }), env(), { fetchImpl });
    expect(calls.some((call) => call.method === 'PATCH')).toBe(false);
  });
});
