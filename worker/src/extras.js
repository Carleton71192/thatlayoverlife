// Story extras (22 Oct 2026). Stories hit Webflow's 60-field cap, so the newer per-story data lives in a companion
// collection, one item per story with the story's slug: sponsors, Lounge opt-in, the writer's member id (so an
// Anonymous story stays editable by its writer), the Anonymous switch, and gallery photos 26 to 50.

export const GALLERY_FREE = 25;
export const GALLERY_PLUS = 50;

const KIND_LABELS = { paid: "Paid for", hosted: "Hosted", gifted: "Gifted", discount: "Discounted" };
const LABEL_KINDS = Object.fromEntries(Object.entries(KIND_LABELS).map(([k, v]) => [v.toLowerCase(), k]));

/** Sponsor rows as the CMS shows them: one line each, "Hosted: Hotel Example". */
export function sponsorsText(rows) {
  return (Array.isArray(rows) ? rows : [])
    .filter((r) => r && r.name)
    .map((r) => `${KIND_LABELS[r.kind] || "Hosted"}: ${r.name}`)
    .join("\n");
}

/** Reads the CMS lines back into rows. Lines that do not match a known kind are kept as Hosted. */
export function parseSponsorsText(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = /^(paid for|hosted|gifted|discounted)\s*:\s*(.+)$/i.exec(line);
      return m ? { name: m[2].trim(), kind: LABEL_KINDS[m[1].toLowerCase()] } : { name: line, kind: "hosted" };
    });
}

/** True when the member holds an active plan listed in GALLERY_PLUS_PLANS (comma list of Memberstack plan ids). */
export async function hasGalleryPlus(env, memberId) {
  const plans = String(env.GALLERY_PLUS_PLANS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const key = env.MEMBERSTACK_SECRET_KEY || env.MEMBERSTACK_KEY;
  if (!plans.length || !key || !memberId) return false;
  try {
    const res = await fetch(`https://admin.memberstack.com/members/${encodeURIComponent(memberId)}`, { method: "GET", headers: { "X-API-KEY": key } });
    if (!res.ok) return false;
    const body = await res.json();
    const member = body?.data || body || {};
    const conns = Array.isArray(member.planConnections) ? member.planConnections : [];
    return conns.some((c) => plans.includes(c?.planId) && !/^(canceled|cancelled|expired|unpaid)$/i.test(String(c?.status || "active")));
  } catch {
    return false;
  }
}

/** The gallery limit for this member: 25, or 50 with Gallery Plus. */
export async function galleryLimit(env, memberId) {
  return (await hasGalleryPlus(env, memberId)) ? GALLERY_PLUS : GALLERY_FREE;
}

export function createExtras(webflow) {
  async function find(env, slug) {
    if (!env.STORY_EXTRAS_COLLECTION || !slug) return null;
    const r = await webflow(env, "GET", `/collections/${env.STORY_EXTRAS_COLLECTION}/items?slug=${encodeURIComponent(slug)}&limit=5`);
    if (!r.ok) throw new Error("extras lookup failed");
    return (r.data?.items || []).find((item) => item.fieldData?.slug === slug) || null;
  }

  /** Story ids whose extras name this member as owner. Bounded walk; the collection holds one item per story. */
  async function ownedStoryIds(env, memberId) {
    const out = new Set();
    if (!env.STORY_EXTRAS_COLLECTION || !memberId) return out;
    for (let offset = 0; offset < 2000; offset += 100) {
      const r = await webflow(env, "GET", `/collections/${env.STORY_EXTRAS_COLLECTION}/items?limit=100&offset=${offset}`);
      if (!r.ok) throw new Error("extras list failed");
      const items = r.data?.items || [];
      for (const item of items) {
        const f = item.fieldData || {};
        if (!item.isArchived && f["owner-member-id"] === memberId && f.story) out.add(f.story);
      }
      if (items.length < 100) break;
    }
    return out;
  }

  /** Creates or patches the extras item for a story, then publishes it. Returns { ok, id }. Never throws. */
  async function save(env, { existing, storyId, slug, headline, fieldData }) {
    if (!env.STORY_EXTRAS_COLLECTION) return { ok: false, id: null };
    try {
      let id = existing?.id || null;
      if (id) {
        const p = await webflow(env, "PATCH", `/collections/${env.STORY_EXTRAS_COLLECTION}/items/${id}`, { isDraft: false, isArchived: false, fieldData: { name: headline, ...fieldData } });
        if (!p.ok) return { ok: false, id };
      } else {
        const c = await webflow(env, "POST", `/collections/${env.STORY_EXTRAS_COLLECTION}/items`, { isDraft: false, fieldData: { name: headline, slug, story: storyId, ...fieldData } });
        if (!c.ok || !c.data?.id) return { ok: false, id: null };
        id = c.data.id;
      }
      const pub = await webflow(env, "POST", `/collections/${env.STORY_EXTRAS_COLLECTION}/items/publish`, { itemIds: [id] });
      return { ok: pub.ok, id };
    } catch {
      return { ok: false, id: null };
    }
  }

  return { find, ownedStoryIds, save };
}

/** Splits approved photo URLs: the first 25 go on the story, the rest on the extras item. */
export function splitGallery(urls) {
  return { main: urls.slice(0, GALLERY_FREE), more: urls.slice(GALLERY_FREE, GALLERY_PLUS) };
}
