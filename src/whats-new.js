// GET /whats-new (31 Oct 2026, Nancy: "when we add a new function, is there a way to prompt current users to check it out?" "Yes please").
// The entries Nancy switched on in the CMS "What's new" collection whose start date has passed, newest first, at most five.
// Public and cached five minutes: the words are the same for everyone; which ones a member has seen lives on their own
// Memberstack record (tllSeenNew), handled in the browser by tll-whats-new-v1.
import { webflow } from './profile-sync.js';

export function liveEntries(items, now = Date.now()) {
  return items
    .filter((i) => !i.isArchived && i.fieldData?.live === true && (!i.fieldData.starts || Date.parse(i.fieldData.starts) <= now))
    .sort((a, b) => String(b.fieldData.starts || '').localeCompare(String(a.fieldData.starts || '')))
    .slice(0, 5)
    .map((i) => {
      const f = i.fieldData;
      let link = String(f.link || '');
      try { const u = new URL(link, 'https://www.thatlayover.life'); link = /(^|\.)thatlayover\.life$/.test(u.hostname) ? u.pathname + u.search + u.hash : ''; } catch { link = ''; }
      return { id: f.slug, title: String(f.name || '').slice(0, 80), line: String(f.line || '').slice(0, 160), button: String(f.button || 'Take a look').slice(0, 30), link, starts: f.starts || null };
    });
}

export async function handleWhatsNew(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', Vary: 'Origin' };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'GET' } });
  if (!env.WEBFLOW_TOKEN || !env.WHATS_NEW_COLLECTION_ID) return new Response(JSON.stringify({ entries: [] }), { headers: { ...headers, 'Cache-Control': 'no-store' } });
  const page = await webflow(env, fetchImpl, `/collections/${env.WHATS_NEW_COLLECTION_ID}/items?limit=100`);
  return new Response(JSON.stringify({ entries: liveEntries(page?.items || [], now) }), { headers: { ...headers, 'Cache-Control': 'public, max-age=300' } });
}
