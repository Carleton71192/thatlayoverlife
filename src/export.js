// POST /export (31 Oct 2026, Value Playbook Phase 4: "Download everything: stories, photos and map as a zip, from the account
// page. It backs up the Instagram promise."). Member only, and only the member's own records: the profile, every story they
// wrote (drafts included, so nothing is lost), their collections and stamps (private ones too: it is their own copy), the pets
// they own or share, the companions they travel with (names and profile links only) and the photo links. The browser then
// downloads the photos and builds the zip, so no large file passes through the Worker. Ten exports an hour per member.
import { findContributor } from './profile-sync.js';
import { rateLimit, reply, verifyMemberToken } from './member-auth.js';
import { listAll } from './collections.js';

const SITE = 'https://www.thatlayover.life';
const PRIVATE_FIELDS = ['memberstack-id', 'outreach-status', 'outreach-notes', 'source-list', 'press-verified', 'badge-label', 'currently-in'];

const img = (x, folder, name) => (x?.url ? { url: x.url, folder, name, alt: x.alt || '' } : null);
const safe = (s) => String(s || 'item').toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'item';

/** Pure: the export manifest from the member's own records. */
export function buildExport({ me, stories = [], items = [], stamps = [], pets = [], people = [], cats = [], pursuits = [], now = Date.now() }) {
  const f = { ...(me.fieldData || {}) };
  PRIVATE_FIELDS.forEach((k) => delete f[k]);
  const name = (list, id) => list.find((x) => x.id === id)?.fieldData?.name || '';
  const photos = [];
  const add = (p) => { if (p) photos.push(p); };
  add(img(f.avatar, 'profile', 'avatar'));
  const myStories = stories.filter((s) => s.fieldData?.contributor === me.id).map((s) => {
    const d = s.fieldData || {};
    const slug = d.slug || s.id;
    add(img(d['hero-image'], `stories/${slug}`, 'cover'));
    (d['photo-gallery'] || []).forEach((g, i) => add(img(g, `stories/${slug}`, `photo-${String(i + 1).padStart(2, '0')}`)));
    return { title: d.name || '', slug, link: s.isDraft ? null : `${SITE}/stories/${slug}`, status: s.isDraft ? 'draft' : 'published', place: d['byline-location'] || '',
      published: d['published-date'] || null, trip: d['trip-when'] || '', excerpt: d.excerpt || '', body: d.body || '', signOff: d['sign-off'] || '',
      externalUrl: d['external-url'] || null };
  });
  const mine = (list) => list.filter((x) => x.fieldData?.owner === me.id && !x.isArchived);
  const collections = mine(items).map((i, n) => {
    const d = i.fieldData || {};
    const col = d['own-category-name'] || name(cats, d.category);
    const shots = [d.photo, ...(d['more-photos'] || [])].filter((x) => x?.url);
    shots.forEach((p, k) => add(img(p, `collections/${safe(col)}`, `${safe(d.name)}-${n + 1}${shots.length > 1 ? `-${k + 1}` : ''}`)));
    return { collection: col, country: d.name || '', city: d.city || '', year: d.year || null, caption: d.caption || '', shownOnProfile: d['show-on-profile'] === true, photos: shots.map((p) => p.url) };
  });
  const myStamps = mine(stamps).map((s, n) => {
    const d = s.fieldData || {};
    const pursuit = name(pursuits, d.pursuit);
    if (d.photo?.url) add(img(d.photo, `stamps/${safe(pursuit)}`, `${safe(d.what)}-${n + 1}`));
    return { pursuit, what: d.what || '', country: d.name || '', city: d.city || '', month: d.month || null, year: d.year || null, shownOnProfile: d['show-on-profile'] === true, photo: d.photo?.url || null };
  });
  const myPets = pets.filter((p) => p.fieldData?.owner === me.id || (p.fieldData?.['shared-with'] || []).includes(me.id)).map((p) => {
    const d = p.fieldData || {};
    add(img(d.avatar, `pets/${safe(d.name)}`, 'avatar'));
    (d['pet-gallery'] || []).forEach((g, i) => add(img(g, `pets/${safe(d.name)}`, `photo-${i + 1}`)));
    return { name: d.name || '', breed: d.breed || '', countries: d['countries-list'] || '', link: `${SITE}/pets/${d.slug}`, role: d.owner === me.id ? 'owner' : 'co-owner' };
  });
  const companions = (f.crew || []).map((id) => people.find((p) => p.id === id)).filter(Boolean).map((p) => ({ name: p.fieldData?.name || '', link: `${SITE}/contributors/${p.fieldData?.slug}` }));
  delete f.crew;
  let map = null;
  try { map = f['map-snapshot'] ? JSON.parse(f['map-snapshot']) : null; } catch { map = null; }
  delete f['map-snapshot'];
  return {
    exportedAt: new Date(now).toISOString(), site: SITE, profileLink: `${SITE}/contributors/${f.slug}`,
    profile: f, mapSummary: map, stories: myStories, collections, stamps: myStamps, pets: myPets, companions, photos,
  };
}

export async function handleExport(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.WEBFLOW_TOKEN || !env.MEMBERSTACK_KEY || !env.CONTRIBUTORS_COLLECTION_ID || !env.WIRE_KV) return reply({ error: 'Downloads are not switched on yet.' }, 503);
  const auth = await verifyMemberToken(request, env, { fetchImpl });
  if (auth instanceof Response) return auth;
  if (!(await rateLimit(env, 'export', auth.memberId, 10, now))) return reply({ error: 'That is ten downloads in an hour. Try again a little later.' }, 429);
  const me = await findContributor(env, fetchImpl, auth.memberId);
  if (!me) return reply({ error: 'Your profile page has not been created yet.' }, 404);
  const get = (id) => (id ? listAll(env, fetchImpl, id) : Promise.resolve([]));
  const [stories, items, stamps, pets, people, cats, pursuits] = await Promise.all([
    get(env.STORIES_COLLECTION_ID), get(env.COLLECTION_ITEMS_ID), get(env.STAMPS_COLLECTION_ID), get(env.PETS_COLLECTION_ID),
    (me.fieldData?.crew || []).length ? get(env.CONTRIBUTORS_COLLECTION_ID) : Promise.resolve([]), get(env.COLLECTION_CATEGORIES_ID), get(env.PURSUITS_COLLECTION_ID),
  ]);
  return reply({ ok: true, ...buildExport({ me, stories, items, stamps, pets, people, cats, pursuits, now }) });
}
