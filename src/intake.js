// POST /intake and GET /lounge (31 Oct 2026, Nancy: "When people submit things ... instantly link and set up photos and
// stories. The next day submit the full report to me to check it. I approve expats and press.")
//
// POST /intake  Authorization: Bearer <Memberstack token>
//   {"kind":"story"|"linkout"|"photos","fields":{...the form's own field names and values...}}
// The page sends this right after Webflow accepted the form, so the Webflow Forms copy stays the record. The verified member
// is the only author: their Contributors item is found (or created from their Memberstack profile) and linked.
//   story   -> a published Stories item with the writer's words unchanged (paragraphs; short lines on their own become
//              headings), hero and gallery from their uploads, captions and placements (Photo placements row), region,
//              countries, theme, and automatic checks in notes-to-editor (ends mid-sentence, cut off by the form, missing
//              photo, few hashtags, reader question without a question mark).
//   linkout -> a published link-out Stories item pointing at the external article.
//   photos  -> one published Photo submissions item per photo, shown in the /gallery Lounge (GET /lounge).
// Expat and press applications are not published here: they wait for Nancy in the next-day report.
// Never writes headlines, bodies or captions: every word comes from the member's form. 20 intakes per member per hour.
import { verifyMemberToken, rateLimit, memberCors, reply } from './member-auth.js';
import { webflow, slugify, uniqueSlug, findContributor, applyMember } from './profile-sync.js';
import { bylineCountries } from './site-stats.js';
import { summarizeLink } from './link-summary.js';
import { enqueueEnrich } from './story-enrich.js';

const MEMBERSTACK_API = 'https://admin.memberstack.com';
export const INTAKE_LIMIT_PER_HOUR = 20;
export const STORIES = { status: { Published: '40fb8550c58a86ae03f3dfb83bf691e3' } };
export const REGION_IDS = {
  africa: 'b26135c02cc190fdaa35f3ad21155d6c', americas: 'b88f7cae88de6d134d2001cf4d834a8c', asia: 'a1e06f7a3091709d901b9be349d2beef',
  europe: '147a690dc0bb9b392de8f76e596b8618', 'middle east': '2e0e976094dd2b15d1722227f4bd2bcc', 'middle-east': '2e0e976094dd2b15d1722227f4bd2bcc',
  oceania: '2d61f02c72f97e50d2e47529e1df47e5', antarctica: '237262f269ed78e2c26130a142667c73',
};
export const PHOTO_STAGE_PUBLISHED = 'afc4f7d5343f799bd5c9888b5b80c7dc';
const CAPTION_MAX = 200;

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clean = (v, max = 4000) => String(v ?? '').replace(/\r/g, '').trim().slice(0, max);
const urls = (v) => String(v || '').split(/[\n,]+/).map((u) => u.trim()).filter((u) => /^https:\/\/res\.cloudinary\.com\/\S+$/i.test(u));
const fileSlug = (u) => String(u).split('/').pop().split('?')[0].replace(/\.(jpe?g|png|webp|avif|gif)$/i, '').toLowerCase();

/** The full body: body-part-1..12 joined when present (the form keeps only about 5,000 characters of one field). */
export function fullBody(fields) {
  const parts = [];
  for (let i = 1; i <= 12; i += 1) { const p = fields[`body-part-${i}`]; if (p) parts.push(String(p)); }
  return (parts.length ? parts.join('') : String(fields.body || '')).replace(/\r/g, '');
}

const isHeading = (line, next) => line.length >= 3 && line.length <= 90 && !/[.!?…:;,"”')\]]$/.test(line) && line.split(/\s+/).length <= 14 && !!next;

/** Writer's text to rich text: paragraphs, and a short line on its own (no closing punctuation) as a heading. */
export function bodyHtml(text) {
  const lines = String(text).split(/\n/).map((l) => l.trim()).filter(Boolean);
  return lines.map((l, i) => (isHeading(l, lines[i + 1]) ? `<h2>${esc(l)}</h2>` : `<p>${esc(l)}</p>`)).join('');
}

/** Automatic checks for the next-day report; never changes the story. */
export function storyChecks(fields, text) {
  const out = [];
  const lines = String(text).split(/\n/).map((l) => l.trim()).filter(Boolean);
  const last = lines[lines.length - 1] || '';
  if (last && !/[.!?…"”')\]]$/.test(last)) out.push(`Ends mid-sentence: "...${last.slice(-60)}"`);
  if (!fields['body-part-1'] && String(fields.body || '').length >= 4800) out.push('Body is at the form limit and may be cut off');
  const words = String(text).split(/\s+/).filter(Boolean).length;
  if (words < 150) out.push(`Short: ${words} words`);
  if (!urls(fields['hero-image']).length) out.push('No cover photo');
  const tags = String(fields['hashtag-set'] || '').split(/[\s,]+/).filter((t) => t.startsWith('#'));
  if (tags.length < 5) out.push(`${tags.length} hashtags (kit asks for 5 to 10)`);
  if (fields['reader-question'] && !/\?\s*$/.test(String(fields['reader-question']))) out.push('Reader question has no question mark');
  return out;
}

function photoPlan(fields) {
  try { const p = JSON.parse(fields['photo-plan'] || '[]'); return Array.isArray(p) ? p : []; } catch { return []; }
}

/** Stories fieldData for a story submission (lookups such as countries and themes are added by the handler). */
export function buildStory(fields, { contributorId, slug, now }) {
  const text = fullBody(fields);
  const title = clean(fields.name, 200);
  const country = clean(fields.country, 80);
  const city = clean(fields.city, 80);
  const hero = urls(fields['hero-image'])[0];
  const gallery = urls(fields['photo-gallery']);
  const plan = photoPlan(fields);
  const capFor = (n) => clean((plan.find((p) => Number(p.n) === n) || {}).caption, CAPTION_MAX);
  const words = text.split(/\s+/).filter(Boolean).length;
  const checks = storyChecks(fields, text);
  const synd = ['newsletter', 'social', 'press'].filter((k) => String(fields[`syndication-${k}`]) === 'true');
  const fd = {
    name: title, slug,
    excerpt: clean(fields.excerpt, 240) || clean(text, 240),
    body: bodyHtml(text),
    contributor: contributorId,
    'sensory-anchors': clean(fields['sensory-anchors'], 500) || null,
    'pull-quote': clean(fields['pull-quote'], 600) || null,
    'sign-off': clean(fields['sign-off'], 200) || 'The writer',
    'hashtag-set': clean(fields['hashtag-set'], 400) || '#ThatLayoverLife',
    'reader-question': clean(fields['reader-question'], 300) || 'Have you been?',
    'reading-time': Math.max(1, Math.round(words / 230)),
    'seo-title': title.slice(0, 70),
    'seo-description': (clean(fields.excerpt, 240) || clean(text, 160)).slice(0, 160),
    'published-date': new Date(now).toISOString(),
    'submitted-at': new Date(now).toISOString(),
    'charter-agreed-at': String(fields['agree-charter']) === 'true' ? new Date(now).toISOString() : null,
    'byline-location': [city, country].filter(Boolean).join(', ').toUpperCase() || null,
    city: city || null,
    'trip-when': clean(fields['Field 5'] || fields['trip-when'], 80) || null,
    region: REGION_IDS[String(fields.region || '').toLowerCase()] || null,
    status: STORIES.status.Published,
    syndication: synd.join(', ') || null,
    'hero-caption': clean(fields['cover-caption'], CAPTION_MAX) || null,
    commissioned: false,
    'notes-to-editor': `<p>Set up automatically from /submit on ${new Date(now).toISOString().slice(0, 16).replace('T', ' ')} UTC. The writer's words are unchanged.</p>${checks.length ? `<p>Checks: ${checks.map(esc).join('; ')}.</p>` : '<p>Checks: none.</p>'}`,
  };
  if (hero) fd['hero-image'] = { url: hero, alt: clean(fields['cover-caption'], CAPTION_MAX) || title };
  if (gallery.length) fd['photo-gallery'] = gallery.slice(0, 25).map((url, i) => ({ url, alt: capFor(i + 1) || `${title}, photo ${i + 1}` }));
  const placement = [];
  plan.forEach((p) => {
    const u = gallery[Number(p.n) - 1]; if (!u) return;
    if (p.after && p.after !== 'gallery') placement.push(`${clean(p.after, 120)} | ${fileSlug(u)}`);
    const c = clean(p.caption, CAPTION_MAX).replace(/\|/g, '/'); if (c) placement.push(`Caption: ${fileSlug(u)} | ${c}`);
  });
  return { fieldData: fd, placement: placement.join('\n'), checks, countryCodes: bylineCountries(country || city), country };
}

/** Stories fieldData for a link-out. */
export function buildLinkout(fields, { contributorId, slug, now, memberName }) {
  const title = clean(fields['Field 5'] || fields.title, 200);
  const url = clean(fields['external-url'], 600);
  const summary = clean(fields.summary, 240);
  const country = clean(fields.country, 80);
  const fd = {
    name: title, slug, excerpt: summary || title, body: `<p>${esc(summary || title)}</p>`, contributor: contributorId,
    'sign-off': memberName || 'The writer', 'hashtag-set': `#${country.replace(/\s+/g, '') || 'Travel'} #ThatLayoverLife`,
    'reader-question': `Have you been to ${country || 'this place'}?`, 'seo-title': title.slice(0, 70), 'seo-description': (summary || title).slice(0, 160),
    'published-date': new Date(now).toISOString(), 'submitted-at': new Date(now).toISOString(), status: STORIES.status.Published,
    'external-url': url, 'byline-location': country.toUpperCase() || null, region: null, commissioned: false,
    'notes-to-editor': `<p>Link-out set up automatically from /submit on ${new Date(now).toISOString().slice(0, 10)}. Points to ${esc(url)}.</p>`,
  };
  // Cover: the article's own share photo when it passed the photo check; else the member's own photo; else none (the card
  // shows the ink panel with the country, never a stock or ad image).
  const og = clean(fields['og-image'], 600);
  const own = urls(fields['hero-image'])[0];
  if (/^https:\/\//i.test(og)) fd['hero-image'] = { url: og, alt: title };
  else if (own) fd['hero-image'] = { url: own, alt: title };
  return { fieldData: fd, countryCodes: bylineCountries(country), country };
}

async function fetchMember(env, fetchImpl, memberId) {
  const r = await fetchImpl(`${MEMBERSTACK_API}/members/${memberId}`, { headers: { 'X-API-KEY': env.MEMBERSTACK_KEY } });
  if (!r.ok) throw new Error(`Memberstack member: HTTP ${r.status}`);
  const j = await r.json();
  return j.data || j;
}

async function contributorFor(env, fetchImpl, memberId) {
  let item = await findContributor(env, fetchImpl, memberId);
  if (!item) { await applyMember(env, await fetchMember(env, fetchImpl, memberId), { fetchImpl, event: 'member.created' }); item = await findContributor(env, fetchImpl, memberId); }
  return item;
}

async function findByName(env, fetchImpl, collection, name) {
  if (!collection || !name) return null;
  const page = await webflow(env, fetchImpl, `/collections/${collection}/items?limit=100&name=${encodeURIComponent(name)}`);
  return (page?.items || []).find((i) => String(i.fieldData?.name || '').toLowerCase() === name.toLowerCase()) || null;
}

async function storySlugs(env, fetchImpl) {
  const all = [];
  for (let offset = 0; offset < 2000; offset += 100) {
    const page = await webflow(env, fetchImpl, `/collections/${env.STORIES_COLLECTION_ID}/items?limit=100&offset=${offset}`);
    const items = page?.items || []; items.forEach((i) => all.push(i.fieldData?.slug)); if (items.length < 100) break;
  }
  return all.filter(Boolean);
}

async function createPublished(env, fetchImpl, collection, fieldData) {
  const made = await webflow(env, fetchImpl, `/collections/${collection}/items`, { method: 'POST', body: JSON.stringify({ isDraft: false, isArchived: false, fieldData }) });
  const id = made?.id || made?.items?.[0]?.id;
  if (id) await webflow(env, fetchImpl, `/collections/${collection}/items/publish`, { method: 'POST', body: JSON.stringify({ itemIds: [id] }) });
  return id;
}

async function logIntake(env, entry, now) {
  if (!env.WIRE_KV) return;
  const key = `intake:${new Date(now).toISOString().slice(0, 10)}`;
  let list = []; try { list = JSON.parse((await env.WIRE_KV.get(key)) || '[]'); } catch { list = []; }
  list.push(entry); await env.WIRE_KV.put(key, JSON.stringify(list.slice(-500)), { expirationTtl: 60 * 60 * 24 * 30 });
}

export async function handleIntake(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (!env.WEBFLOW_TOKEN || !env.MEMBERSTACK_KEY || !env.STORIES_COLLECTION_ID) return reply({ error: 'Not switched on yet.' }, 503);
  const auth = await verifyMemberToken(request, env, { fetchImpl });
  if (auth instanceof Response) return auth;
  const { memberId } = auth;
  let body; try { body = await request.json(); } catch { return reply({ error: 'bad json' }, 400); }
  const kind = body?.kind; const fields = body?.fields;
  if (!['story', 'linkout', 'photos'].includes(kind) || !fields || typeof fields !== 'object') return reply({ error: 'Send {kind, fields}.' }, 400);
  if (!(await rateLimit(env, 'intake', memberId, INTAKE_LIMIT_PER_HOUR, now))) return reply({ error: 'That is a lot in one hour. Your submission is saved; we will set it up.' }, 429);
  try {
    const contributor = await contributorFor(env, fetchImpl, memberId);
    if (!contributor) return reply({ error: 'Your profile page is not ready yet. Your submission is saved.' }, 404);
    const memberName = contributor.fieldData?.name || '';
    if (kind === 'photos') {
      const list = urls(fields.photos).slice(0, 30);
      if (!list.length) return reply({ error: 'No photos arrived.' }, 400);
      const place = [clean(fields.city, 80), clean(fields.country, 80)].filter(Boolean).join(', ');
      const ids = [];
      const batch = `b${now.toString(36)}`;
      for (const [i, url] of list.entries()) {
        const fd = {
          name: `${memberName || 'Member'} · ${place || 'Photo'} · ${i + 1}`, slug: slugify(`${memberName}-${place}-${batch}-${i + 1}`),
          'submitted-at': new Date(now).toISOString(), country: clean(fields.country, 80) || null, city: clean(fields.city, 80) || null,
          year: /^\d{4}$/.test(String(fields.year || '')) ? Number(fields.year) : null, caption: clean(fields.caption, 1000) || null,
          'credit-preference': clean(fields['credit-mode'], 40) || 'named', 'contributor-credit': memberName || null,
          'gallery-opt-in': true, 'social-opt-in': String(fields['syndication-social']) === 'true', 'press-interest-opt-in': String(fields['syndication-press']) === 'true',
          'rights-confirmed': String(fields['agree-rights']) === 'true', 'license-accepted': String(fields['agree-licence']) === 'true', 'people-consent-confirmed': String(fields['agree-people']) === 'true',
          'consent-recorded-at': new Date(now).toISOString(), 'uploader-member-id': memberId, 'contributor-profile': contributor.id,
          'moderation-stage': PHOTO_STAGE_PUBLISHED, 'review-status': 'published, review next day', 'batch-id': batch, 'gallery-published-at': new Date(now).toISOString(),
          'pet-names': clean(fields['pets-along'], 200) || null, photo: { url, alt: clean(fields.caption, 200) || `${place} photo by ${memberName}` },
        };
        if (!(fd['rights-confirmed'] && fd['license-accepted'] && fd['people-consent-confirmed'])) return reply({ error: 'The three promises must be ticked.' }, 400);
        ids.push(await createPublished(env, fetchImpl, env.PHOTO_SUBMISSIONS_COLLECTION_ID, fd));
      }
      await logIntake(env, { kind, memberId, name: memberName, ids, place, at: new Date(now).toISOString() }, now);
      return reply({ ok: true, kind, ids });
    }
    const taken = await storySlugs(env, fetchImpl);
    const title = clean(kind === 'story' ? fields.name : (fields['Field 5'] || fields.title), 200);
    if (!title) return reply({ error: 'A title is needed.' }, 400);
    const slug = uniqueSlug(title, taken);
    const built = kind === 'story' ? buildStory(fields, { contributorId: contributor.id, slug, now }) : buildLinkout(fields, { contributorId: contributor.id, slug, now, memberName });
    const fd = built.fieldData;
    if (kind === 'linkout' && fd['external-url']) {
      const s = await summarizeLink(fd['external-url'], env, { fetchImpl }).catch(() => null);
      if (s) fd['short-version'] = `<p>${esc(s.summary)}</p><p><em>Summary by AI, from the linked article.</em></p>`;
    }
    const [countryItem, destItem] = await Promise.all([
      findByName(env, fetchImpl, env.COUNTRIES_COLLECTION_ID, built.country), findByName(env, fetchImpl, env.DESTINATIONS_COLLECTION_ID, built.country),
    ]);
    if (countryItem) { fd.countries = [countryItem.id]; if (!fd.region && countryItem.fieldData?.region) fd.region = REGION_IDS[String(countryItem.fieldData.region).toLowerCase()] || null; }
    if (destItem) fd['country-2'] = destItem.id;
    if (kind === 'story' && env.THEMES_COLLECTION_ID) {
      const wanted = Object.keys(fields).filter((k) => /^theme-/.test(k) && String(fields[k]) === 'true').map((k) => k.slice(6));
      if (wanted.length) { const themes = await webflow(env, fetchImpl, `/collections/${env.THEMES_COLLECTION_ID}/items?limit=100`); fd.theme = (themes?.items || []).filter((t) => wanted.includes(t.fieldData?.slug)).map((t) => t.id); }
    }
    if (!fd.region) { fd.region = REGION_IDS.europe; (built.checks = built.checks || []).push('Region not chosen, set to Europe; check it'); fd['notes-to-editor'] = `${fd['notes-to-editor'] || ''}<p>Region not chosen; set to Europe for now.</p>`; }
    const id = await createPublished(env, fetchImpl, env.STORIES_COLLECTION_ID, fd);
    if (kind === 'story') await enqueueEnrich(env, id).catch(() => {}); // AI summary and links, next 30-minute run
    if (kind === 'story' && built.placement && env.PHOTO_PLACEMENTS_COLLECTION_ID) {
      await createPublished(env, fetchImpl, env.PHOTO_PLACEMENTS_COLLECTION_ID, { name: slug, slug, story: id, 'photo-placement': built.placement });
    }
    await logIntake(env, { kind, memberId, name: memberName, id, slug, title, checks: built.checks || [], at: new Date(now).toISOString() }, now);
    return reply({ ok: true, kind, id, slug, url: `/stories/${slug}`, checks: built.checks || [] });
  } catch (error) {
    console.log(`intake ${JSON.stringify({ member: memberId, kind, error: String(error?.message || error) })}`);
    return reply({ error: 'Saved, and we will set it up by hand.' }, 502);
  }
}

/** GET /lounge: published member photos for the /gallery Lounge, newest first. Public fields only. */
export async function handleLounge(request, env, { fetchImpl = fetch, cache = globalThis.caches?.default } = {}) {
  const cors = memberCors(request);
  const json = (b, s = 200, extra = {}) => new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors, ...extra } });
  if (!env.WEBFLOW_TOKEN || !env.PHOTO_SUBMISSIONS_COLLECTION_ID) return json({ photos: [] }, 200, { 'Cache-Control': 'no-store' });
  const key = new Request('https://cache.local/lounge/v1');
  if (cache) { const hit = await cache.match(key); if (hit) return json(await hit.json(), 200, { 'Cache-Control': 'public, max-age=300' }); }
  const page = await webflow(env, fetchImpl, `/collections/${env.PHOTO_SUBMISSIONS_COLLECTION_ID}/items/live?limit=100`);
  const photos = (page?.items || [])
    .filter((i) => i.fieldData?.['moderation-stage'] === PHOTO_STAGE_PUBLISHED && i.fieldData?.['gallery-opt-in'] && i.fieldData?.photo?.url && !i.fieldData?.['removal-requested'])
    .sort((a, b) => String(b.fieldData['submitted-at']).localeCompare(String(a.fieldData['submitted-at'])))
    .map((i) => { const f = i.fieldData; const initials = String(f['contributor-credit'] || '').split(/\s+/).map((w) => w[0] || '').join('').toUpperCase().slice(0, 3);
      return { img: f.photo.url, alt: f.photo.alt || '', place: [f.city, f.country].filter(Boolean).join(', '), country: f.country || '', credit: f['credit-preference'] === 'anonymous' ? '' : initials, caption: f.caption || '' }; });
  const body = { photos };
  if (cache) await cache.put(key, new Response(JSON.stringify(body), { headers: { 'Cache-Control': 'max-age=300' } }));
  return json(body, 200, { 'Cache-Control': 'public, max-age=300' });
}

export { memberCors as intakeCors };
