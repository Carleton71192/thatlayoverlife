// GET /living-library?city=<optional> (31 Oct 2026, expat build Phase C). International House Copenhagen's Citizen Days run a
// "Living Library" where newcomers borrow an experienced expat for a conversation; on TLL the books are members who switched on
// "Open to coffee with newcomers" (/edit-profile, saved with their album settings) AND list themselves as living abroad.
// Card: display name per their credit mode, home base city only if they switched Show home base on, years there, places they
// know well, languages, pursuits, their live stories. Never an email, phone, handle or link to a contact channel: "Get in
// touch" happens on their profile after sign-in. Order: the page shuffles per session; this list is not ranked, and nothing
// pays for a place. New-member sandbox: profiles younger than 14 days are not listed yet.
import { listLive } from './site-stats.js';

const VISIBILITY_PUBLIC = 'a6fcbaf1151c3a0c53d2f575bd540c73';
const CREDIT_FIRST = 'd01799503381d459b0ae4b27b0535111';
const CREDIT_PEN = '38820387bc6c4892f486394a6c28776c';
export const SANDBOX_DAYS = 14;

export function displayName(f) {
  if (f['credit-mode'] === CREDIT_PEN && f['pen-name']) return String(f['pen-name']).slice(0, 60);
  const n = String(f.name || '').trim();
  return f['credit-mode'] === CREDIT_FIRST ? n.split(/\s+/)[0] : n;
}

export function libraryCards(people, settingsById, { stories = [], pursuits = [], now = Date.now() } = {}) {
  return people.filter((p) => {
    const f = p.fieldData || {};
    const s = settingsById[p.id] || {};
    const since = Date.parse(f['member-since'] || p.createdOn || '');
    return s.coffee === true && f['list-expats'] === true && (!f.visibility || f.visibility === VISIBILITY_PUBLIC) && !p.isDraft
      && Number.isFinite(since) && now - since >= SANDBOX_DAYS * 864e5;
  }).map((p) => {
    const f = p.fieldData, s = settingsById[p.id] || {};
    let desks = [];
    try { desks = JSON.parse(f.desks || '[]'); } catch { desks = []; }
    if (!Array.isArray(desks)) desks = [];
    const here = desks.find((d) => d.now === true);
    const home = s.showHomeBase === true ? String(f['home-base'] || '').split(',')[0].trim().slice(0, 60) : '';
    return {
      slug: f.slug, name: displayName(f), avatar: f.avatar?.url || '', homeCity: home,
      years: here ? String(here.years || '').slice(0, 40) : '',
      knowsWell: desks.map((d) => String(d.knows || '').trim()).filter(Boolean).slice(0, 3).map((x) => x.slice(0, 160)),
      languages: String(f.languages || '').split(',').map((x) => x.trim()).filter(Boolean).slice(0, 6),
      interests: (Array.isArray(f.pursuits) ? f.pursuits : []).map((id) => pursuits.find((x) => x.id === id)?.fieldData?.name).filter(Boolean),
      stories: stories.filter((st) => st.fieldData?.contributor === p.id).slice(0, 3).map((st) => ({ slug: st.fieldData.slug, title: st.fieldData.name })),
    };
  });
}

export async function handleLivingLibrary(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', Vary: 'Origin' };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'GET' } });
  const send = (b, cache = 300) => new Response(JSON.stringify(b), { headers: { ...headers, 'Cache-Control': cache ? `public, max-age=${cache}` : 'no-store' } });
  if (!env.WEBFLOW_TOKEN || !env.WIRE_KV) return send({ ok: true, books: [] }, 0);
  let idx = [];
  try { idx = JSON.parse((await env.WIRE_KV.get('coffee:index')) || '[]'); } catch { idx = []; }
  if (!idx.length) return send({ ok: true, books: [] });
  const settingsById = {};
  await Promise.all(idx.map(async (id) => { try { settingsById[id] = JSON.parse((await env.WIRE_KV.get(`album:${id}`)) || '{}'); } catch { settingsById[id] = {}; } }));
  const [people, stories, pursuits] = await Promise.all([
    listLive(env, fetchImpl, env.CONTRIBUTORS_COLLECTION_ID), listLive(env, fetchImpl, env.STORIES_COLLECTION_ID),
    env.PURSUITS_COLLECTION_ID ? listLive(env, fetchImpl, env.PURSUITS_COLLECTION_ID) : [],
  ]);
  const city = (new URL(request.url).searchParams.get('city') || '').toLowerCase();
  let books = libraryCards(people.filter((p) => idx.includes(p.id)), settingsById, { stories, pursuits, now });
  if (city) books = books.filter((b) => b.homeCity.toLowerCase() === city);
  return send({ ok: true, books });
}
