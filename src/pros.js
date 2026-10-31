// GET /pros (31 Oct 2026, Value Playbook Phase 6: "From the Pros"). The pros Nancy has published in the CMS "Pros" collection,
// with what the site needs to label their stories and profiles. The link rules from the playbook are decided here, once:
//   one link, anchored on their name or brand; rel="sponsored" when paid or hosted; rel="ugc nofollow" until Nancy has
//   checked their first piece (Trusted off); a plain link once trusted. Never a required link back.
import { listLive } from './site-stats.js';

const VISIBILITY_OFF = '1423c8d17c2060776541377f76ea0b31';
const ROAD_WARRIOR = '7203ed9cbb4a974d00937c5b801ec7e4';
// Category (31 Oct): pursuit-expert, road-warrior, move-pros, pet-travel-pros. The older Track field still counts for road warriors.
const CATEGORY = { '120e57de44ff210601a79216c28b43aa': 'pursuit-expert', '0e80aa98b5e2e590c59223e3c8dc9886': 'road-warrior', '3aad9087dfe90d557e80f112ba530bb2': 'move-pros', '18b1bf5824e46ac016fae52027d522c4': 'pet-travel-pros' };
export const categoryOf = (f) => CATEGORY[f.category] || (f.track === ROAD_WARRIOR ? 'road-warrior' : 'pursuit-expert');

export function relFor(p) {
  if (p['paid-or-hosted'] === true) return 'sponsored noopener noreferrer';
  return p.trusted === true ? 'noopener' : 'ugc nofollow noopener';
}

export function prosList(pros, people, pursuits) {
  return pros.map((p) => {
    const f = p.fieldData || {};
    const person = people.find((c) => c.id === f.contributor && c.fieldData?.visibility !== VISIBILITY_OFF);
    if (!person) return null;
    const url = /^https:\/\//.test(String(f['their-site'] || '')) ? f['their-site'] : '';
    const hub = pursuits.find((x) => x.id === f.pursuit);
    return {
      slug: person.fieldData.slug, name: person.fieldData.name, avatar: person.fieldData.avatar?.url || '',
      line: String(f['pro-line'] || '').slice(0, 40), linkName: String(f['link-name'] || person.fieldData.name).slice(0, 60), url, rel: relFor(f),
      sponsored: f['paid-or-hosted'] === true, track: categoryOf(f) === 'road-warrior' ? 'road-warrior' : 'pursuit-expert', category: categoryOf(f),
      // Road warriors: the employer is shown only when the pro gave permission to name it.
      employer: f['permission-to-name-employer'] === true ? String(f.employer || '').slice(0, 60) : '', pursuit: hub ? { slug: hub.fieldData.slug, name: hub.fieldData['display-name'] || hub.fieldData.name } : null,
    };
  }).filter(Boolean);
}

export async function handlePros(request, env, { fetchImpl = fetch } = {}) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', Vary: 'Origin' };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'GET' } });
  if (!env.WEBFLOW_TOKEN || !env.PROS_COLLECTION_ID) return new Response(JSON.stringify({ pros: [] }), { headers: { ...headers, 'Cache-Control': 'no-store' } });
  const [pros, people, pursuits] = await Promise.all([
    listLive(env, fetchImpl, env.PROS_COLLECTION_ID), listLive(env, fetchImpl, env.CONTRIBUTORS_COLLECTION_ID),
    env.PURSUITS_COLLECTION_ID ? listLive(env, fetchImpl, env.PURSUITS_COLLECTION_ID) : [],
  ]);
  return new Response(JSON.stringify({ pros: prosList(pros, people, pursuits) }), { headers: { ...headers, 'Cache-Control': 'public, max-age=600' } });
}
