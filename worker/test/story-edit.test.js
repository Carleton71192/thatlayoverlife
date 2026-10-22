// Members edit their own stories: GET /story, GET /story/mine, POST /story/update, POST /story/unpublish.
// No network: global fetch is replaced by a fake for each test and restored after it.
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import { parseShoutOuts, parseDisclosure, readLog, MEMBER_FIELDS } from "../src/story-edit.js";

const PLACE_ID = "a".repeat(24);
const OTHER_PLACE = "b".repeat(24);
const WRITER = "mem_writer";
const realFetch = globalThis.fetch;
let calls;
let logs;
let realError;

function memoryKv() {
  const store = new Map();
  return {
    store,
    get: async (key, type) => {
      if (!store.has(key)) return null;
      return type === "json" ? JSON.parse(store.get(key)) : store.get(key);
    },
    put: async (key, value) => void store.set(key, value),
  };
}

function env(overrides = {}) {
  return {
    SITE_ORIGINS: "https://www.thatlayover.life,https://thatlayover.life",
    WEBFLOW_SITE_ID: "site",
    STORIES_COLLECTION: "stories",
    CONTRIBUTORS_COLLECTION: "contributors",
    PLACES_COLLECTION: "places",
    MEMBERSTACK_SECRET_KEY: "ms-secret",
    WEBFLOW_API_TOKEN: "wf",
    TLL_KV: memoryKv(),
    ...overrides,
  };
}

function words(n) {
  return Array.from({ length: n }, (_, i) => `word${i}`).join(" ");
}
const BODY = `<p>${words(150)}</p><p>${words(160)}</p>`;
const HERO = "https://res.cloudinary.com/idonvlow/image/upload/v1/tll/abc.jpg";

function liveItem(overrides = {}, fields = {}) {
  return {
    id: "story-1",
    isDraft: false,
    isArchived: false,
    fieldData: {
      name: "Six hours in Kastrup",
      slug: "six-hours-in-kastrup-ab12",
      body: BODY,
      excerpt: "A long layover.",
      "hero-image": { url: HERO },
      contributor: "c-writer",
      "country-2": PLACE_ID,
      city: "Copenhagen",
      "trip-when": "September 2026",
      "reading-time": 2,
      region: "147a690dc0bb9b392de8f76e596b8618",
      "seo-title": "Six hours in Kastrup",
      "seo-description": "A long layover.",
      "byline-location": "COPENHAGEN, DENMARK",
      status: "40fb8550c58a86ae03f3dfb83bf691e3",
      "published-date": "2026-10-01T10:00:00.000Z",
      "charter-agreed-at": "2026-10-01T10:00:00.000Z",
      disclosure: "Paid for by the traveler",
      "editor-notes-log": JSON.stringify([{ type: "spelling", decision: "accepted" }]),
      "photo-originals": JSON.stringify({ hero: { publicId: "tll/abc", originalUrl: HERO, cleanedUrl: HERO, approved: "original" }, gallery: [] }),
      "links-and-mentions": '<ul><li><a href="https://cafe.example.com/menu" rel="nofollow">Cafe Example</a>: Coffee</li></ul>',
      sources: "First-hand",
      commissioned: true,
      ...fields,
    },
    ...overrides,
  };
}

// opts.item: the stories item the API returns (null = none). opts.slugFilter: false makes the ?slug= list ignore the filter.
function install(opts = {}) {
  const item = "item" in opts ? opts.item : liveItem();
  globalThis.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    const method = init.method || "GET";
    const body = init.body && typeof init.body === "string" && init.body.startsWith("{") ? JSON.parse(init.body) : init.body || null;
    calls.push({ url, method, body });
    const ok = (data, status = 200) => new Response(JSON.stringify(data), { status });
    if (url === "https://admin.memberstack.com/members/verify-token") return ok({ data: { id: opts.member || WRITER } });
    if (url.startsWith("https://api.webflow.com/v2/collections/contributors/items?")) {
      return ok({
        items: [
          { id: "c-other", fieldData: { "memberstack-id": "mem_other", name: "Other Writer" } },
          { id: "c-writer", fieldData: { "memberstack-id": WRITER, name: "Jay Writer" } },
        ],
      });
    }
    if (url.startsWith("https://api.webflow.com/v2/collections/stories/items?")) {
      const u = new URL(url);
      if (u.searchParams.get("slug") && opts.slugFilter === false) return ok({ items: [liveItem({ id: "story-9" }, { slug: "something-else" })] });
      const all = opts.items || (item ? [item] : []);
      if (u.searchParams.get("slug")) return ok({ items: all.filter((i) => i.fieldData.slug === u.searchParams.get("slug")) });
      return ok({ items: all });
    }
    if (url === `https://api.webflow.com/v2/collections/places/items/${PLACE_ID}`) return ok({ id: PLACE_ID, fieldData: { name: "Denmark", region: "Europe" } });
    if (url === `https://api.webflow.com/v2/collections/places/items/${OTHER_PLACE}`) return ok({ id: OTHER_PLACE, fieldData: { name: "Sweden", region: "Europe" } });
    if (url === "https://api.webflow.com/v2/collections/stories/items/story-1" && method === "PATCH") return ok(opts.patchFails ? {} : { id: "story-1" }, opts.patchFails ? 500 : 200);
    if (url === "https://api.webflow.com/v2/collections/stories/items/story-1/live" && method === "DELETE") return new Response(null, { status: 204 });
    if (url === "https://api.webflow.com/v2/collections/stories/items/publish") return ok(opts.publishFails ? {} : {}, opts.publishFails ? 500 : 200);
    if (/^https?:\/\/[^/]*example\.(com|org)\//.test(url)) return new Response(null, { status: 200 });
    throw new Error(`unexpected fetch ${method} ${url}`);
  };
}

function edit(overrides = {}) {
  return {
    slug: "six-hours-in-kastrup-ab12",
    country: PLACE_ID,
    city: "Copenhagen",
    when: "September 2026",
    body: BODY,
    headline: "Six hours in Kastrup",
    excerpt: "A long layover.",
    heroPhoto: { publicId: "tll/abc", originalUrl: HERO, cleanedUrl: HERO, approved: "original" },
    shoutOuts: [{ who: "Cafe Example", link: "https://cafe.example.com/menu", why: "Coffee" }],
    affiliateLinks: false,
    ...overrides,
  };
}

function call(path, body, method = "POST", e = env()) {
  const req = new Request(`https://w.example${path}`, {
    method,
    headers: { Authorization: "Bearer tok", "Content-Type": "application/json", Origin: "https://www.thatlayover.life" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return worker.fetch(req, e);
}

const patched = () => calls.find((c) => c.url.endsWith("/stories/items/story-1") && c.method === "PATCH");
const published = () => calls.find((c) => c.url.endsWith("/stories/items/publish"));
const unpublished = () => calls.find((c) => c.url.endsWith("/story-1/live") && c.method === "DELETE");

beforeEach(() => {
  calls = [];
  logs = [];
  realError = console.error;
  console.error = (...a) => logs.push(a.join(" "));
});
afterEach(() => {
  globalThis.fetch = realFetch;
  console.error = realError;
});

// ---------------------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------------------

test("parseShoutOuts reads back what shoutOutsHtml wrote, affiliate flag included", () => {
  const html = '<ul><li><a href="https://a.example.com/x?y=1&amp;z=2" rel="sponsored nofollow" data-tll-affiliate>A &amp; B</a>: Why</li><li><a href="https://b.example.com/" rel="nofollow">B</a></li></ul>';
  assert.deepEqual(parseShoutOuts(html), [
    { link: "https://a.example.com/x?y=1&z=2", affiliate: true, comped: false, who: "A & B", why: "Why" },
    { link: "https://b.example.com/", affiliate: false, comped: false, who: "B", why: "" },
  ]);
  assert.deepEqual(parseShoutOuts(""), []);
});

test("parseDisclosure reads the two answers back from the disclosure line", () => {
  assert.deepEqual(parseDisclosure("Paid for by the traveler"), { sponsored: false, sponsorName: "", affiliateLinks: false, sponsors: [] });
  assert.deepEqual(parseDisclosure("Paid for by the traveler. Contains affiliate links"), { sponsored: false, sponsorName: "", affiliateLinks: true, sponsors: [] });
  assert.deepEqual(parseDisclosure("Sponsored or hosted: Hotel Example. Contains affiliate links"), { sponsored: true, sponsorName: "Hotel Example", affiliateLinks: true, sponsors: [] });
  assert.deepEqual(parseDisclosure("Sponsored or hosted: Hotel Example"), { sponsored: true, sponsorName: "Hotel Example", affiliateLinks: false, sponsors: [] });
});

test("parseDisclosure reads the Submit v5 line back into sponsor rows", () => {
  const v5 = parseDisclosure("Hosted by Hotel Example. Gifted by Ferry Co. Opinions are the writer's own. Contains affiliate links.");
  assert.deepEqual(v5, {
    sponsored: true,
    sponsorName: "Hotel Example, Ferry Co",
    affiliateLinks: true,
    sponsors: [{ name: "Hotel Example", kind: "hosted" }, { name: "Ferry Co", kind: "gifted" }],
  });
  assert.deepEqual(parseDisclosure("Paid for by Airline X. Opinions are the writer's own.").sponsors, [{ name: "Airline X", kind: "paid" }]);
});

test("readLog keeps an unreadable log as a legacy entry instead of dropping it", () => {
  assert.deepEqual(readLog(""), []);
  assert.deepEqual(readLog("[1]"), [1]);
  assert.equal(readLog("not json")[0].type, "legacy");
  assert.equal(readLog('{"a":1}')[0].type, "legacy");
});

test("the member field list never includes the fields an edit must not touch", () => {
  for (const k of ["slug", "published-date", "contributor", "commissioned", "status", "submitted-at", "charter-agreed-at", "sources", "editor-notes-log"]) {
    assert.ok(!MEMBER_FIELDS.includes(k), k);
  }
});

// ---------------------------------------------------------------------------------------
// GET /story
// ---------------------------------------------------------------------------------------

test("GET /story returns the owner's story in form shape", async () => {
  install();
  const res = await call("/story?slug=six-hours-in-kastrup-ab12", null, "GET");
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.headline, "Six hours in Kastrup");
  assert.equal(data.state, "live");
  assert.equal(data.charterOnFile, true);
  assert.equal(data.countryName, "Denmark");
  assert.equal(data.heroPhoto.publicId, "tll/abc");
  assert.deepEqual(data.shoutOuts, [{ link: "https://cafe.example.com/menu", affiliate: false, comped: false, who: "Cafe Example", why: "Coffee" }]);
  assert.equal(data.sponsored, false);
  assert.deepEqual(data.sponsors, []);
  assert.deepEqual(data.datesShown, { posted: true, traveled: true, edited: false });
  assert.equal(data.readerQuestion, "");
  assert.equal(data.url, "https://www.thatlayover.life/stories/six-hours-in-kastrup-ab12");
});

test("GET /story refuses another member's story with 403 and an unknown slug with 404", async () => {
  install({ member: "mem_other" });
  const res = await call("/story?slug=six-hours-in-kastrup-ab12", null, "GET");
  assert.equal(res.status, 403);
  install({ item: null });
  const none = await call("/story?slug=nothing-here", null, "GET");
  assert.equal(none.status, 404);
  const bad = await call("/story?slug=Not%20A%20Slug", null, "GET");
  assert.equal(bad.status, 400);
});

test("GET /story still finds the item when the slug filter is not honored", async () => {
  install({ slugFilter: false });
  const res = await call("/story?slug=six-hours-in-kastrup-ab12", null, "GET");
  assert.equal(res.status, 200);
});

test("GET /story needs a token", async () => {
  install();
  const req = new Request("https://w.example/story?slug=six-hours-in-kastrup-ab12", { headers: { Origin: "https://www.thatlayover.life" } });
  const res = await worker.fetch(req, env());
  assert.equal(res.status, 401);
});

// ---------------------------------------------------------------------------------------
// GET /story/mine
// ---------------------------------------------------------------------------------------

test("GET /story/mine lists only this member's stories with their state, newest first", async () => {
  install({
    items: [
      liveItem({ id: "s-old" }, { slug: "old-one", "published-date": "2026-09-01T00:00:00.000Z" }),
      liveItem({ id: "s-other" }, { slug: "theirs", contributor: "c-other" }),
      liveItem({ id: "s-down", isDraft: true }, { slug: "down-one", "published-date": "2026-10-05T00:00:00.000Z" }),
      liveItem({ id: "s-held" }, { slug: "held-one", status: "someotheroptionid", "published-date": "2026-10-03T00:00:00.000Z" }),
    ],
  });
  const res = await call("/story/mine", null, "GET");
  assert.equal(res.status, 200);
  const { stories } = await res.json();
  assert.deepEqual(
    stories.map((s) => [s.slug, s.state]),
    [
      ["down-one", "taken-down"],
      ["held-one", "held"],
      ["old-one", "live"],
    ]
  );
});

// ---------------------------------------------------------------------------------------
// POST /story/update
// ---------------------------------------------------------------------------------------

test("saves a changed headline and city, logs the edit, sets last-updated and republishes the one item", async () => {
  install();
  const res = await call("/story/update", edit({ headline: "Seven hours in Kastrup", city: "Kastrup" }));
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.live, true);
  assert.equal(data.message, "Saved. The story is live again with your changes.");
  const p = patched();
  assert.ok(p, "patched");
  assert.equal(p.body.isDraft, false);
  const fd = p.body.fieldData;
  assert.equal(fd.name, "Seven hours in Kastrup");
  assert.equal(fd.city, "Kastrup");
  assert.equal(fd["seo-title"], "Seven hours in Kastrup");
  assert.equal(fd["byline-location"], "KASTRUP, DENMARK");
  assert.ok(fd["last-updated"]);
  for (const k of ["slug", "published-date", "contributor", "commissioned", "status", "charter-agreed-at", "sources", "submitted-at"]) assert.ok(!(k in fd), k);
  // unchanged member fields are not rewritten
  assert.ok(!("body" in fd));
  assert.ok(!("hero-image" in fd));
  const log = JSON.parse(fd["editor-notes-log"]);
  assert.equal(log.length, 2);
  assert.equal(log[0].type, "spelling");
  assert.equal(log[1].type, "member-edit");
  assert.deepEqual(log[1].fields, ["name", "city", "seo-title", "byline-location"]);
  assert.deepEqual(log[1].words, { before: 310, after: 310 });
  assert.deepEqual(log[1].notes, []);
  assert.deepEqual(published().body, { itemIds: ["story-1"] });
});

test("rights and charter are on file, so the edit form does not have to send them again", async () => {
  install();
  const res = await call("/story/update", edit({ excerpt: "A longer layover." }));
  assert.equal(res.status, 200);
  install({ item: liveItem({}, { "charter-agreed-at": null }) });
  const again = await call("/story/update", edit({ excerpt: "A longer layover." }));
  assert.equal(again.status, 400);
  assert.match((await again.json()).error, /your trip, your words and your photos/i);
});

test("a story that fails a publish rule is not written and the form hears which rule", async () => {
  install();
  const res = await call("/story/update", edit({ body: `<p>${words(200)}</p>` }));
  assert.equal(res.status, 400);
  const { error } = await res.json();
  assert.match(error, /^Not saved yet: Stories need 300 words or more/);
  assert.match(error, /Fix it and save again\.$/);
  assert.ok(!patched());
});

test("another member cannot update or take down the story", async () => {
  install({ member: "mem_other" });
  const res = await call("/story/update", edit({ headline: "Mine now" }));
  assert.equal(res.status, 403);
  const down = await call("/story/unpublish", { slug: "six-hours-in-kastrup-ab12" });
  assert.equal(down.status, 403);
  assert.ok(!patched());
  assert.ok(!unpublished());
});

test("nothing changed means nothing written", async () => {
  install();
  const res = await call("/story/update", edit());
  assert.equal(res.status, 200);
  assert.deepEqual((await res.json()).changed, []);
  assert.ok(!patched());
  assert.ok(!published());
});

test("a held story keeps the edit on the item and is not republished", async () => {
  install({ item: liveItem({}, { status: "someotheroptionid" }) });
  const res = await call("/story/update", edit({ headline: "Changed while held" }));
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.held, true);
  assert.equal(data.live, false);
  assert.equal(data.message, "The editor is looking at this one. Your changes are saved and go live when it is released.");
  assert.ok(patched());
  assert.ok(!published());
  assert.equal(JSON.parse(patched().body.fieldData["editor-notes-log"]).at(-1).held, true);
});

test("saving a taken-down story puts it back, even with no field changes", async () => {
  install({ item: liveItem({ isDraft: true }) });
  const res = await call("/story/update", edit());
  assert.equal(res.status, 200);
  assert.equal((await res.json()).live, true);
  assert.equal(patched().body.isDraft, false);
  assert.equal(JSON.parse(patched().body.fieldData["editor-notes-log"]).at(-1).restored, true);
  assert.ok(published());
});

test("a changed country rewrites the byline and the region; the editor notes from this session land in the log", async () => {
  install();
  const notes = [{ type: "spelling", original: "recieved", suggested: "received", decision: "accepted", at: "2026-10-21T08:00:00.000Z" }];
  const res = await call("/story/update", edit({ country: OTHER_PLACE, editorNotesLog: notes }));
  assert.equal(res.status, 200);
  const fd = patched().body.fieldData;
  assert.equal(fd["country-2"], OTHER_PLACE);
  assert.equal(fd["byline-location"], "COPENHAGEN, SWEDEN");
  assert.deepEqual(JSON.parse(fd["editor-notes-log"]).at(-1).notes, notes);
});

test("a failed publish step says the changes are saved but not live, as 207", async () => {
  install({ publishFails: true });
  const res = await call("/story/update", edit({ headline: "Try again" }));
  assert.equal(res.status, 207);
  assert.match((await res.json()).error, /saved but not live/);
});

test("a failed patch changes nothing and says so", async () => {
  install({ patchFails: true });
  const res = await call("/story/update", edit({ headline: "Try again" }));
  assert.equal(res.status, 502);
  assert.ok(!published());
});

test("20 saves per member per hour, then 429", async () => {
  install();
  const e = env();
  await e.TLL_KV.put(`storyedit:${WRITER}:${new Date().toISOString().replace(/\D/g, "").slice(0, 10)}`, "20");
  const res = await call("/story/update", edit({ headline: "One more" }), "POST", e);
  assert.equal(res.status, 429);
  assert.ok(!patched());
});

test("the story text is never logged", async () => {
  install({ patchFails: true });
  await call("/story/update", edit({ headline: "Secret headline here" }));
  assert.ok(logs.length);
  assert.ok(logs.every((l) => !l.includes("Secret headline") && !l.includes("word1 ")));
});

// ---------------------------------------------------------------------------------------
// POST /story/unpublish
// ---------------------------------------------------------------------------------------

test("take down unpublishes the live item and marks it draft; the slug and the item stay", async () => {
  install();
  const res = await call("/story/unpublish", { slug: "six-hours-in-kastrup-ab12" });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, slug: "six-hours-in-kastrup-ab12", state: "taken-down" });
  assert.ok(unpublished());
  const p = patched();
  assert.equal(p.body.isDraft, true);
  assert.ok(!("slug" in p.body.fieldData));
  assert.equal(JSON.parse(p.body.fieldData["editor-notes-log"]).at(-1).type, "member-takedown");
  assert.ok(!calls.some((c) => c.method === "DELETE" && !c.url.endsWith("/live")), "nothing deleted");
});

test("taking down a story that is already down is a no-op", async () => {
  install({ item: liveItem({ isDraft: true }) });
  const res = await call("/story/unpublish", { slug: "six-hours-in-kastrup-ab12" });
  assert.equal(res.status, 200);
  assert.ok(!unpublished());
  assert.ok(!patched());
});

test("GET on a POST story route is 405 and an unknown story route is 404", async () => {
  install();
  assert.equal((await call("/story/update", null, "GET")).status, 405);
  assert.equal((await call("/story/delete", { slug: "x" })).status, 404);
});

// ---------------------------------------------------------------------------------------
// Story extras and Anonymous bylines (22 Oct 2026)
// ---------------------------------------------------------------------------------------

const XENV = { STORY_EXTRAS_COLLECTION: "extras", ANONYMOUS_CONTRIBUTOR_ID: "c-anon" };

// opts.extra: the extras item for the story slug (null = none). opts.kvOwner: a KV owner copy.
function installExtras(opts = {}) {
  install(opts);
  const inner = globalThis.fetch;
  globalThis.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    const method = init.method || "GET";
    if (url.startsWith("https://api.webflow.com/v2/collections/extras/items")) {
      const body = init.body ? JSON.parse(init.body) : null;
      calls.push({ url, method, body });
      const ok = (data) => new Response(JSON.stringify(data), { status: 200 });
      if (method === "GET") {
        const u = new URL(url);
        const all = opts.extra ? [opts.extra] : [];
        if (u.searchParams.get("slug")) return ok({ items: all.filter((i) => i.fieldData.slug === u.searchParams.get("slug")) });
        return ok({ items: all });
      }
      if (method === "POST" && url.endsWith("/publish")) return ok({});
      if (method === "POST") return ok({ id: "extra-1" });
      if (method === "PATCH") return ok({ id: opts.extra?.id || "extra-1" });
    }
    return inner(input, init);
  };
}

const anonItem = () => liveItem({}, { contributor: "c-anon" });
const extraFor = (owner, fields = {}) => ({ id: "extra-1", isArchived: false, fieldData: { slug: "six-hours-in-kastrup-ab12", story: "story-1", "owner-member-id": owner, anonymous: true, sponsors: "", ...fields } });

test("anonymous: the owner on the extras item can open and edit the story", async () => {
  installExtras({ item: anonItem(), extra: extraFor(WRITER, { sponsors: "Hosted: Hotel Example", "lounge-opt-in": true }) });
  const res = await call("/story?slug=six-hours-in-kastrup-ab12", null, "GET", env(XENV));
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.creditMode, "Anonymous");
  assert.equal(data.anonymous, true);
  assert.equal(data.loungeOptIn, true);
  assert.deepEqual(data.sponsors, [{ name: "Hotel Example", kind: "hosted" }]);
});

test("anonymous: anyone else is refused, even another signed-in member", async () => {
  installExtras({ item: anonItem(), extra: extraFor("mem_other"), member: WRITER });
  const res = await call("/story?slug=six-hours-in-kastrup-ab12", null, "GET", env(XENV));
  assert.equal(res.status, 403);
});

test("anonymous: the KV owner copy works when the extras item is missing", async () => {
  installExtras({ item: anonItem(), extra: null });
  const e = env(XENV);
  e.TLL_KV.store.set("owner:six-hours-in-kastrup-ab12", WRITER);
  const res = await call("/story?slug=six-hours-in-kastrup-ab12", null, "GET", e);
  assert.equal(res.status, 200);
});

test("anonymous: /story/mine lists the writer's Anonymous stories too", async () => {
  installExtras({ items: [liveItem(), liveItem({ id: "story-2" }, { slug: "quiet-one-cd34", contributor: "c-anon" })], extra: { id: "extra-2", isArchived: false, fieldData: { slug: "quiet-one-cd34", story: "story-2", "owner-member-id": WRITER } } });
  const res = await call("/story/mine", null, "GET", env(XENV));
  const data = await res.json();
  assert.deepEqual(data.stories.map((s) => [s.slug, s.anonymous]).sort(), [["quiet-one-cd34", true], ["six-hours-in-kastrup-ab12", false]]);
});

test("anonymous: switching an edit to Anonymous moves the credit and records the owner; switching back restores it", async () => {
  installExtras({ extra: null });
  const e = env(XENV);
  const res = await call("/story/update", edit({ creditMode: "Anonymous" }), "POST", e);
  assert.equal(res.status, 200);
  assert.equal(patched().body.fieldData.contributor, "c-anon");
  const x = calls.find((c) => c.url.endsWith("/extras/items") && c.method === "POST").body.fieldData;
  assert.equal(x.anonymous, true);
  assert.equal(x["owner-member-id"], WRITER);
  assert.equal(e.TLL_KV.store.get("owner:six-hours-in-kastrup-ab12"), WRITER);

  calls = [];
  installExtras({ item: anonItem(), extra: extraFor(WRITER) });
  const back = await call("/story/update", edit({ creditMode: "Full" }), "POST", env(XENV));
  assert.equal(back.status, 200);
  assert.equal(patched().body.fieldData.contributor, "c-writer");
  const p = calls.find((c) => c.url.endsWith("/extras/items/extra-1") && c.method === "PATCH").body.fieldData;
  assert.equal(p.anonymous, false);
  assert.equal(p["owner-member-id"], WRITER);
});

test("extras: an edit with unchanged extras does not touch the extras item", async () => {
  installExtras({ extra: { id: "extra-1", isArchived: false, fieldData: { slug: "six-hours-in-kastrup-ab12", story: "story-1", "owner-member-id": WRITER, anonymous: false, sponsors: "", "lounge-opt-in": false, "photo-gallery-more": [] } } });
  const res = await call("/story/update", edit({ headline: "Seven hours in Kastrup" }), "POST", env(XENV));
  assert.equal(res.status, 200);
  assert.ok(!calls.some((c) => c.url.includes("/extras/items") && c.method !== "GET"), "extras untouched");
});
