// Story enrichment (31 Oct 2026, Nancy: "The AI summary and links are not on other people's stories, can you integrate that").
// After a member story is published, the 30-minute job fills two empty fields, never touching the member's own words:
//   short-version        a neutral summary of the story, labeled "Summary by AI, from the story."
//   links-and-mentions   official or reputable pages for the places, venues and events the story names, found with
//                        Claude's web search. Only URLs that came back as search results are kept, so no link is invented.
// Stories are queued by /intake (enqueueEnrich); when the queue is empty, a sweep finds any live story still missing either
// field, so this is standing practice for every story. Three per run, each tried once a month. A field with text is left alone.
// Both blocks carry an AI disclosure line.
// Needs ANTHROPIC_API_KEY; without it the queue simply waits.
import Anthropic from '@anthropic-ai/sdk';
import { webflow } from './profile-sync.js';
import { listLive } from './site-stats.js';
import { articleText, cleanSummary } from './link-summary.js';

const MODEL = 'claude-opus-5-5';
const QUEUE = 'enrich:queue';
const PER_RUN = 3;
export const STORY_LABEL = 'Summary by AI, from the story.';
export const LINKS_LABEL = 'Links found by AI web search for the places in this story. Check details before you go.';
const BLOCKED = /(tripadvisor|booking\.com|getyourguide|viator|expedia|agoda|hotels\.com|facebook\.com|instagram\.com|tiktok\.com|x\.com|twitter\.com|pinterest|reddit\.com|amazon\.)/i;

const SUMMARY_SYSTEM = [
  'You write the summary box for a travel magazine story. A member wrote the story about their own trip.',
  'Write two or three plain sentences, at most 60 words, saying what the story covers: the place, the trip, and the practical tips a reader will find.',
  'Neutral and factual, third person, US English. Use only facts stated in the story. Do not repeat a claim that is plainly wrong about geography. No opinions of your own, no praise, no quotes longer than five words.',
  'Never name where the writer lives now or where they are going next. No em dashes and no exclamation marks. Do not mention that you are an AI.',
  'If the text is too short or not a travel story, reply with exactly: NO_SUMMARY',
].join(' ');

const LINKS_SYSTEM = [
  'You find sources for a travel story\'s "Links and mentions" block. Search the web for the official or most reputable page for each specific place, venue, event, transport service or park the story names.',
  'Prefer official sites (park authorities, venues, tourism boards, transport operators), then reputable references. Never booking sites, aggregators, social media or affiliate links.',
  'Reply with only a JSON array, 3 to 8 items, each {"url": "...", "text": "Publisher: Page title"}. Use only URLs that appeared in your search results. US English, no em dashes, no exclamation marks.',
].join(' ');

export function storyText(fd) {
  return articleText(`<article>${fd?.body || ''}</article>`);
}

export async function enqueueEnrich(env, id) {
  if (!env.WIRE_KV || !id) return;
  let q = [];
  try { q = JSON.parse((await env.WIRE_KV.get(QUEUE)) || '[]'); } catch { q = []; }
  if (!q.includes(id)) q.push(id);
  await env.WIRE_KV.put(QUEUE, JSON.stringify(q.slice(-100)));
}

function client(env, injected) {
  return injected || new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 120_000 });
}

export async function summarizeStory(text, env, { client: injected } = {}) {
  if (text.split(/\s+/).length < 60) return null;
  const response = await client(env, injected).beta.messages.create({
    model: MODEL, max_tokens: 1024, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default', output_config: { effort: 'low' },
    system: SUMMARY_SYSTEM, messages: [{ role: 'user', content: text.slice(0, 24_000) }],
  });
  if (response.stop_reason === 'refusal') return null;
  return cleanSummary(response.content.filter((b) => b.type === 'text').map((b) => b.text).join(' ')) || null;
}

/** URLs that came back from web search in any content block. */
function searchedUrls(blocks) {
  const out = new Set();
  const walk = (v) => {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (typeof v.url === 'string' && /^https:\/\//.test(v.url)) out.add(v.url.replace(/#.*$/, ''));
    for (const k of Object.keys(v)) if (k !== 'text') walk(v[k]);
  };
  blocks.filter((b) => b.type !== 'text').forEach(walk);
  return out;
}

export function pickLinks(answer, allowed) {
  const m = /\[[\s\S]*\]/.exec(answer || '');
  if (!m) return [];
  let list;
  try { list = JSON.parse(m[0]); } catch { return []; }
  const seen = new Set();
  return (Array.isArray(list) ? list : [])
    .map((l) => ({ url: String(l?.url || '').trim().replace(/#.*$/, ''), text: String(l?.text || '').replace(/\s*[—–]\s*/g, ': ').replace(/!/g, '').replace(/\s+/g, ' ').trim().slice(0, 140) }))
    .filter((l) => /^https:\/\//.test(l.url) && l.text && !BLOCKED.test(l.url) && allowed.has(l.url) && !seen.has(l.url) && seen.add(l.url))
    .slice(0, 8);
}

export async function findLinks(text, title, env, { client: injected } = {}) {
  const c = client(env, injected);
  const messages = [{ role: 'user', content: `Story title: ${title}\n\n${text.slice(0, 16_000)}` }];
  const blocks = [];
  let response;
  for (let turn = 0; turn < 3; turn += 1) {
    response = await c.beta.messages.create({
      model: MODEL, max_tokens: 8000, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default', output_config: { effort: 'medium' },
      system: LINKS_SYSTEM, tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 8 }], messages,
    });
    blocks.push(...response.content);
    if (response.stop_reason !== 'pause_turn') break;
    messages.push({ role: 'assistant', content: response.content });
  }
  if (!response || response.stop_reason === 'refusal') return [];
  const answer = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  return pickLinks(answer, searchedUrls(blocks));
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const linksHtml = (links) => `<ul>${links.map((l) => `<li><a href="${esc(l.url)}">${esc(l.text)}</a></li>`).join('')}</ul><p><em>${LINKS_LABEL}</em></p>`;
export const summaryHtml = (s) => `<p>${esc(s)}</p><p><em>${STORY_LABEL}</em></p>`;

/** One queued story: fills only empty fields, then publishes. */
export async function enrichStory(env, id, { fetchImpl = fetch, client: injected } = {}) {
  const C = env.STORIES_COLLECTION_ID;
  const item = await webflow(env, fetchImpl, `/collections/${C}/items/${id}`);
  const fd = item?.fieldData || {};
  if (!item || fd['external-url']) return 'skipped';
  const text = storyText(fd);
  const patch = {};
  if (!fd['short-version']) { const s = await summarizeStory(text, env, { client: injected }); if (s) patch['short-version'] = summaryHtml(s); }
  if (!fd['links-and-mentions']) { const l = await findLinks(text, fd.name || '', env, { client: injected }); if (l.length >= 2) patch['links-and-mentions'] = linksHtml(l); }
  if (!Object.keys(patch).length) return 'nothing to add';
  await webflow(env, fetchImpl, `/collections/${C}/items/${id}`, { method: 'PATCH', body: JSON.stringify({ fieldData: patch }) });
  if (!item.isDraft) await webflow(env, fetchImpl, `/collections/${C}/items/publish`, { method: 'POST', body: JSON.stringify({ itemIds: [id] }) });
  return `added ${Object.keys(patch).join(', ')}`;
}

/** Standing practice: when the queue is empty, look for live stories still missing a summary or links. Each story is tried once. */
export async function sweep(env, fetchImpl = fetch) {
  const live = await listLive(env, fetchImpl, env.STORIES_COLLECTION_ID);
  const ids = [];
  for (const it of live) {
    const f = it.fieldData || {};
    if (f['external-url'] || (f['short-version'] && f['links-and-mentions'])) continue;
    if (await env.WIRE_KV.get(`enrich:tried:${it.id}`)) continue;
    ids.push(it.id);
  }
  return ids;
}

export async function runEnrich(env, opts = {}) {
  if (!env.ANTHROPIC_API_KEY || !env.WIRE_KV || !env.WEBFLOW_TOKEN) return 'enrich skipped (not configured)';
  let q = [];
  try { q = JSON.parse((await env.WIRE_KV.get(QUEUE)) || '[]'); } catch { q = []; }
  if (!q.length) q = await sweep(env, opts.fetchImpl);
  if (!q.length) return 'enrich: nothing missing';
  const done = [];
  for (const id of q.slice(0, PER_RUN)) {
    try { done.push(`${id} ${await enrichStory(env, id, opts)}`); } catch (e) { done.push(`${id} failed ${String(e?.message || e).slice(0, 80)}`); }
    await env.WIRE_KV.put(`enrich:tried:${id}`, '1', { expirationTtl: 60 * 60 * 24 * 30 });
  }
  await env.WIRE_KV.put(QUEUE, JSON.stringify(q.slice(PER_RUN)));
  return `enrich: ${done.join('; ')}`;
}
