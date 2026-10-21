// Members edit their own stories (change log handoff/CHANGE-LOG-STORY-EDIT-2026-10-21.md, approved by Nancy 21 Oct 2026).
// Three routes next to /publish, all behind the Memberstack token check:
//   GET  /story?slug=        the live story in form shape, for its owner only (E2.1)
//   GET  /story/mine         the member's own stories with their state, for the /account Stories tab (E1.1, E4.2)
//   POST /story/update       rewrite the member fields, log the edit, republish the one item (E3)
//   POST /story/unpublish    take the story off the site: unpublish and mark it draft, never delete (E4)
// The helpers come in from index.js so the publish rules are shared, not copied.

const MEMBER_LOG_LIMIT = 400;

// Fields a member may change, by Webflow slug. Everything else on the item is left exactly as it is:
// slug, published-date, contributor, commissioned, status, submitted-at, charter-agreed-at, sources, the editor's fields.
export const MEMBER_FIELDS = [
  "name",
  "body",
  "excerpt",
  "pull-quote",
  "hero-image",
  "photo-gallery",
  "photo-originals",
  "country-2",
  "city",
  "trip-when",
  "reading-time",
  "region",
  "seo-title",
  "seo-description",
  "disclosure",
  "sign-off",
  "pet-co-travelers",
  "human-co-travelers",
  "links-and-mentions",
  "cost-summary",
  "who-it-s-for",
  "sponsor-name-2",
  "sponsor-url",
  "syndication",
  "theme",
  "pillar-2",
  "byline-location",
  "last-updated",
];

const SLUG_RE = /^[a-z0-9-]{1,120}$/;

function decodeEntities(s) {
  return String(s)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** The shout-outs list as the form holds it, read back from the links-and-mentions HTML that shoutOutsHtml wrote. */
export function parseShoutOuts(html) {
  const out = [];
  const re = /<li><a href="([^"]*)"([^>]*)>([^<]*)<\/a>(?::\s*([^<]*))?<\/li>/g;
  let m;
  while ((m = re.exec(String(html || ""))) && out.length < 5) {
    out.push({ link: decodeEntities(m[1]), affiliate: /\bdata-tll-affiliate\b/.test(m[2]), who: decodeEntities(m[3]), why: decodeEntities(m[4] || "") });
  }
  return out;
}

/** The two disclosure answers, read back from the disclosure line that /publish wrote. */
export function parseDisclosure(text) {
  const t = String(text || "").trim();
  const affiliateLinks = /contains affiliate links/i.test(t);
  const m = /^Sponsored or hosted:\s*(.+?)(?:\.\s*Contains affiliate links)?\.?$/i.exec(t);
  return { sponsored: !!m, sponsorName: m ? m[1].trim() : "", affiliateLinks };
}

/** The editor-notes-log field as an array. Anything unreadable is kept as one legacy entry, never dropped. */
export function readLog(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [{ type: "legacy", raw: parsed }];
  } catch {
    return [{ type: "legacy", raw: String(raw).slice(0, 4000) }];
  }
}

export function createStoryEditHandlers(h) {
  const { json, readJson, Bad, webflow, findContributor, rateLimit, keyPart, stamp, readPublishInput, checkLinks, approvedUrl, readingTime, regionOptionId, shoutOutsHtml, wordCount, PUBLISHED_STATUS_ID, SITE_URL } = h;

  function readSlug(v) {
    const s = typeof v === "string" ? v.trim().toLowerCase() : "";
    if (!SLUG_RE.test(s)) throw new Bad("That story address is not recognized.");
    return s;
  }

  async function findStory(env, slug) {
    const r = await webflow(env, "GET", `/collections/${env.STORIES_COLLECTION}/items?slug=${encodeURIComponent(slug)}&limit=5`);
    if (!r.ok) throw new Error("stories lookup failed");
    const hit = (r.data?.items || []).find((item) => item.fieldData?.slug === slug);
    if (hit) return hit;
    // If the slug filter is not honored, walk the collection (bounded) before giving up.
    for (let offset = 0; offset < 500; offset += 100) {
      const page = await webflow(env, "GET", `/collections/${env.STORIES_COLLECTION}/items?limit=100&offset=${offset}`);
      if (!page.ok) throw new Error("stories lookup failed");
      const items = page.data?.items || [];
      const found = items.find((item) => item.fieldData?.slug === slug);
      if (found) return found;
      if (items.length < 100) break;
    }
    return null;
  }

  // The owner's view of one item. Returns {story, contributor} or a Response that says why not.
  async function ownedStory(env, auth, slug) {
    let contributor;
    try {
      contributor = await findContributor(env, auth.memberId);
    } catch {
      return json({ error: "We could not look up your profile right now. Try again in a moment." }, 502);
    }
    if (!contributor) return json({ error: "No profile yet. Finish your profile first." }, 409);
    let story;
    try {
      story = await findStory(env, slug);
    } catch {
      return json({ error: "We could not look up that story right now. Try again in a moment." }, 502);
    }
    if (!story || story.isArchived) return json({ error: "We could not find that story." }, 404);
    if (story.fieldData?.contributor !== contributor.id) return json({ error: "Only the writer of a story can change it." }, 403);
    return { story, contributor };
  }

  function stateOf(item) {
    const f = item.fieldData || {};
    if (item.isDraft) return "taken-down";
    if (f.status && f.status !== PUBLISHED_STATUS_ID) return "held";
    return "live";
  }

  function photoRecords(f) {
    let originals = null;
    try {
      originals = f["photo-originals"] ? JSON.parse(f["photo-originals"]) : null;
    } catch {
      originals = null;
    }
    const hero = originals?.hero && typeof originals.hero === "object" ? originals.hero : null;
    const gallery = Array.isArray(originals?.gallery) ? originals.gallery : [];
    return { hero, gallery };
  }

  // GET /story?slug=  (E2.1)
  async function handleStoryGet(request, env, auth) {
    let slug;
    try {
      slug = readSlug(new URL(request.url).searchParams.get("slug"));
    } catch (err) {
      if (err instanceof Bad) return json({ error: err.message }, 400);
      throw err;
    }
    const owned = await ownedStory(env, auth, slug);
    if (owned instanceof Response) return owned;
    const { story } = owned;
    const f = story.fieldData || {};
    const photos = photoRecords(f);
    const heroUrl = f["hero-image"]?.url || "";
    const hero = photos.hero || (heroUrl ? { publicId: "", originalUrl: heroUrl, cleanedUrl: heroUrl, approved: "original" } : null);
    let countryName = "";
    if (f["country-2"]) {
      try {
        const r = await webflow(env, "GET", `/collections/${env.PLACES_COLLECTION}/items/${f["country-2"]}`);
        if (r.ok) countryName = String(r.data?.fieldData?.name || "").trim();
      } catch {
        // the form can still show the id
      }
    }
    const disclosure = parseDisclosure(f.disclosure);
    return json({
      slug,
      url: `${SITE_URL}/stories/${slug}`,
      state: stateOf(story),
      charterOnFile: !!f["charter-agreed-at"],
      lastUpdated: f["last-updated"] || null,
      publishedDate: f["published-date"] || null,
      headline: f.name || "",
      excerpt: f.excerpt || "",
      body: f.body || "",
      pullQuote: f["pull-quote"] || "",
      country: f["country-2"] || "",
      countryName,
      city: f.city || "",
      when: f["trip-when"] || "",
      heroPhoto: hero,
      gallery: photos.gallery,
      pets: Array.isArray(f["pet-co-travelers"]) ? f["pet-co-travelers"] : [],
      coTravelers: Array.isArray(f["human-co-travelers"]) ? f["human-co-travelers"] : [],
      shoutOuts: parseShoutOuts(f["links-and-mentions"]),
      cost: f["cost-summary"] || "",
      forWhom: f["who-it-s-for"] || "",
      signOff: f["sign-off"] || "",
      sponsored: disclosure.sponsored,
      sponsorName: f["sponsor-name-2"] || disclosure.sponsorName,
      sponsorUrl: f["sponsor-url"] || "",
      affiliateLinks: disclosure.affiliateLinks,
      syndication: String(f.syndication || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: Array.isArray(f.theme) ? f.theme : [],
      pursuit: f["pillar-2"] || null,
    });
  }

  // GET /story/mine  (E1.1, E4.2): every story whose Contributor is this member, newest first, with its state.
  async function handleStoryMine(env, auth) {
    let contributor;
    try {
      contributor = await findContributor(env, auth.memberId);
    } catch {
      return json({ error: "We could not look up your profile right now. Try again in a moment." }, 502);
    }
    if (!contributor) return json({ stories: [] });
    const mine = [];
    try {
      for (let offset = 0; offset < 1000; offset += 100) {
        const r = await webflow(env, "GET", `/collections/${env.STORIES_COLLECTION}/items?limit=100&offset=${offset}`);
        if (!r.ok) throw new Error("stories list failed");
        const items = r.data?.items || [];
        for (const item of items) {
          const f = item.fieldData || {};
          if (item.isArchived || f.contributor !== contributor.id || !f.slug) continue;
          mine.push({
            slug: f.slug,
            url: `${SITE_URL}/stories/${f.slug}`,
            headline: f.name || "Untitled",
            state: stateOf(item),
            publishedDate: f["published-date"] || null,
            lastUpdated: f["last-updated"] || null,
            heroUrl: f["hero-image"]?.url || "",
            city: f.city || "",
          });
        }
        if (items.length < 100) break;
      }
    } catch {
      return json({ error: "We could not list your stories right now. Try again in a moment." }, 502);
    }
    mine.sort((a, b) => String(b.publishedDate || "").localeCompare(String(a.publishedDate || "")));
    return json({ stories: mine });
  }

  // POST /story/update  (E3)
  async function handleStoryUpdate(request, env, auth) {
    let input;
    let slug;
    try {
      input = await readJson(request, 400000);
      slug = readSlug(input.slug);
    } catch (err) {
      if (err instanceof Bad) return json({ error: err.message }, 400);
      throw err;
    }
    if (!auth.verifiedId) return json({ error: "We could not confirm your member profile. Please sign in again." }, 401);

    const owned = await ownedStory(env, auth, slug);
    if (owned instanceof Response) return owned;
    const { story: item } = owned;
    const before = item.fieldData || {};

    // Rights and charter were agreed when the story was first published; the edit form shows them, it does not ask again (E2.3).
    const onFile = !!before["charter-agreed-at"];
    let story;
    try {
      story = readPublishInput(onFile ? { ...input, rightsAgreed: true, charterAgreed: true } : input);
    } catch (err) {
      if (err instanceof Bad) return json({ error: `Not saved yet: ${err.message} Fix it and save again.` }, 400);
      throw err;
    }

    const allowed = await rateLimit(env, `storyedit:${keyPart(auth.memberId)}:${stamp(10)}`, 20, 3600);
    if (!allowed) return json({ error: "That is a lot of saves in one hour. Take a breath and try again later." }, 429);

    try {
      await checkLinks(story);
    } catch (err) {
      if (err instanceof Bad) return json({ error: `Not saved yet: ${err.message} Fix it and save again.` }, 400);
      throw err;
    }

    let countryName = "";
    let region;
    try {
      const r = await webflow(env, "GET", `/collections/${env.PLACES_COLLECTION}/items/${story.country}`);
      if (r.status === 404 || r.data?.isArchived || r.data?.isDraft) return json({ error: "Not saved yet: we could not find that country. Fix it and save again." }, 400);
      if (!r.ok) throw new Error("places lookup failed");
      countryName = String(r.data?.fieldData?.name || "").trim();
      region = regionOptionId(r.data?.fieldData?.region);
    } catch {
      return json({ error: "We could not look up that country right now. Try again in a moment." }, 502);
    }

    const nowIso = new Date().toISOString();
    const next = {
      name: story.headline,
      body: story.body,
      excerpt: story.excerpt,
      "pull-quote": story.pullQuote,
      "hero-image": { url: approvedUrl(story.heroPhoto) },
      "photo-gallery": story.gallery.map((p) => ({ url: approvedUrl(p) })),
      "photo-originals": JSON.stringify({ hero: story.heroPhoto, gallery: story.gallery }),
      "country-2": story.country,
      city: story.city,
      "trip-when": story.when,
      "reading-time": readingTime(story.body),
      region,
      "seo-title": story.headline,
      "seo-description": story.excerpt,
      disclosure:
        (story.sponsored ? `Sponsored or hosted: ${story.sponsorName}` : "Paid for by the traveler") +
        (story.affiliateLinks ? ". Contains affiliate links" : ""),
      "sign-off": story.signOff,
      "pet-co-travelers": story.pets,
      "human-co-travelers": story.coTravelers,
      "links-and-mentions": story.shoutOuts.length ? shoutOutsHtml(story.shoutOuts) : "",
      "cost-summary": story.cost,
      "who-it-s-for": story.forWhom,
      "sponsor-name-2": story.sponsorName,
      "sponsor-url": story.sponsorUrl,
      syndication: story.syndication.join(","),
      theme: story.tags,
      "pillar-2": story.pursuit,
      "byline-location": countryName ? `${story.city.toUpperCase()}, ${countryName.toUpperCase()}` : story.city.toUpperCase(),
    };

    // Only what changed is written, and only from the member list. The log names those fields (E3.4).
    const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
    const norm = (k, v) => {
      if (k === "hero-image") return v?.url || null;
      if (k === "photo-gallery") return (Array.isArray(v) ? v : []).map((p) => p?.url || null);
      if (Array.isArray(v)) return v.length ? v : null;
      return v === "" || v === undefined ? null : v;
    };
    const changed = [];
    const fieldData = {};
    for (const k of MEMBER_FIELDS) {
      if (!(k in next)) continue;
      if (same(norm(k, next[k]), norm(k, before[k]))) continue;
      changed.push(k);
      const v = next[k];
      fieldData[k] = v === "" ? null : v;
    }

    const state = stateOf(item);
    const restoring = state === "taken-down";
    const held = state === "held";
    if (!changed.length && !restoring) {
      return json({ ok: true, url: `${SITE_URL}/stories/${slug}`, changed: [], live: !held, held, message: "Nothing changed, so nothing was saved." });
    }

    const entry = {
      type: "member-edit",
      at: nowIso,
      fields: changed,
      words: { before: wordCount(before.body || ""), after: wordCount(story.body) },
      notes: story.editorNotesLog,
    };
    if (restoring) entry.restored = true;
    if (held) entry.held = true;
    const log = readLog(before["editor-notes-log"]);
    log.push(entry);
    fieldData["editor-notes-log"] = JSON.stringify(log.slice(-MEMBER_LOG_LIMIT));
    fieldData["last-updated"] = nowIso;

    try {
      const patched = await webflow(env, "PATCH", `/collections/${env.STORIES_COLLECTION}/items/${item.id}`, { isDraft: false, isArchived: false, fieldData });
      if (!patched.ok) {
        console.error(`story/update: patch failed with status ${patched.status}`);
        return json({ error: "We could not save your changes right now. Nothing was changed. Try again in a moment." }, 502);
      }
    } catch {
      console.error("story/update: patch request failed");
      return json({ error: "We could not save your changes right now. Nothing was changed. Try again in a moment." }, 502);
    }

    const url = `${SITE_URL}/stories/${slug}`;
    // A held story (In Review) keeps the edit on the item and waits for the editor's release (E5.2).
    if (held) {
      return json({ ok: true, url, changed, live: false, held: true, message: "The editor is looking at this one. Your changes are saved and go live when it is released." });
    }

    try {
      const pub = await webflow(env, "POST", `/collections/${env.STORIES_COLLECTION}/items/publish`, { itemIds: [item.id] });
      if (!pub.ok) {
        console.error(`story/update: publish failed with status ${pub.status}`);
        return json({ ok: false, url, changed, live: false, held: false, error: "Your changes are saved but not live yet. Try Save changes once more in a minute." }, 207);
      }
    } catch {
      console.error("story/update: publish request failed");
      return json({ ok: false, url, changed, live: false, held: false, error: "Your changes are saved but not live yet. Try Save changes once more in a minute." }, 207);
    }
    return json({ ok: true, url, changed, live: true, held: false, message: "Saved. The story is live again with your changes." });
  }

  // POST /story/unpublish  (E4): off the site, kept as a draft with its slug. Nothing is deleted.
  async function handleStoryUnpublish(request, env, auth) {
    let slug;
    try {
      slug = readSlug((await readJson(request, 2000)).slug);
    } catch (err) {
      if (err instanceof Bad) return json({ error: err.message }, 400);
      throw err;
    }
    if (!auth.verifiedId) return json({ error: "We could not confirm your member profile. Please sign in again." }, 401);
    const owned = await ownedStory(env, auth, slug);
    if (owned instanceof Response) return owned;
    const { story: item } = owned;
    if (item.isDraft) return json({ ok: true, slug, state: "taken-down" });

    const allowed = await rateLimit(env, `storyedit:${keyPart(auth.memberId)}:${stamp(10)}`, 20, 3600);
    if (!allowed) return json({ error: "That is a lot of changes in one hour. Take a breath and try again later." }, 429);

    const nowIso = new Date().toISOString();
    const log = readLog(item.fieldData?.["editor-notes-log"]);
    log.push({ type: "member-takedown", at: nowIso });
    try {
      const live = await webflow(env, "DELETE", `/collections/${env.STORIES_COLLECTION}/items/${item.id}/live`);
      if (!live.ok && live.status !== 404) {
        console.error(`story/unpublish: unpublish failed with status ${live.status}`);
        return json({ error: "We could not take the story down right now. It is still live. Try again in a moment." }, 502);
      }
      const patched = await webflow(env, "PATCH", `/collections/${env.STORIES_COLLECTION}/items/${item.id}`, {
        isDraft: true,
        fieldData: { "editor-notes-log": JSON.stringify(log.slice(-MEMBER_LOG_LIMIT)), "last-updated": nowIso },
      });
      if (!patched.ok) console.error(`story/unpublish: draft mark failed with status ${patched.status}`);
    } catch {
      console.error("story/unpublish: request failed");
      return json({ error: "We could not take the story down right now. Try again in a moment." }, 502);
    }
    return json({ ok: true, slug, state: "taken-down" });
  }

  return { handleStoryGet, handleStoryMine, handleStoryUpdate, handleStoryUnpublish };
}
