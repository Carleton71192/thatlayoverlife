// POST /publish: the B2.2 rules and the B2.3 writer copy. No network: global fetch is
// replaced by a fake for each test and restored after it.
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import worker, { MIN_WORDS, writerCopy } from "../src/index.js";
import { wordCount, htmlToText, bodyHrefs, publicHttpUrl } from "../src/validate.js";

const PLACE_ID = "a".repeat(24);
const WRITER = "mem_writer";
const WRITER_EMAIL = "writer@example.com";
const OTHER_EMAIL = "other@example.com";
const realFetch = globalThis.fetch;
let calls;
let logs;
let realError;
let realLog;

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
    RESEND_KEY: "re_test",
    MAIL_FROM: "That Layover Life <stories@thatlayover.life>",
    TLL_KV: memoryKv(),
    ...overrides,
  };
}

// opts.links: url -> status (0 = network error). opts.verifyEmail: put the email in the verify reply.
function install(opts = {}) {
  const links = opts.links || {};
  globalThis.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    const method = init.method || "GET";
    const body = init.body && typeof init.body === "string" && init.body.startsWith("{") ? JSON.parse(init.body) : init.body || null;
    calls.push({ url, method, body, headers: init.headers || {} });
    const ok = (data, status = 200) => new Response(JSON.stringify(data), { status });
    if (url === "https://admin.memberstack.com/members/verify-token") {
      return ok({ data: opts.verifyEmail ? { id: WRITER, auth: { email: WRITER_EMAIL } } : { id: WRITER } });
    }
    if (url === `https://admin.memberstack.com/members/${WRITER}`) {
      if (opts.memberFails) return ok({}, 500);
      return ok({ data: { id: WRITER, auth: { email: WRITER_EMAIL }, customFields: { "first-name": "Jay" } } });
    }
    if (url.startsWith("https://api.webflow.com/v2/collections/contributors/items?")) {
      return ok({
        items: [
          { id: "c-other", fieldData: { "memberstack-id": "mem_other", name: "Other Writer", email: OTHER_EMAIL } },
          { id: "c-writer", fieldData: { "memberstack-id": WRITER, name: "Jay Writer", "credit-mode": "3489ae81c67477dbdf19a921804b343e" } },
        ],
      });
    }
    if (url === `https://api.webflow.com/v2/collections/places/items/${PLACE_ID}`) {
      return ok({ id: PLACE_ID, isArchived: !!opts.placeArchived, isDraft: false, fieldData: { name: "Denmark", region: "Europe" } });
    }
    if (url === "https://api.webflow.com/v2/collections/stories/items" && method === "POST") return ok({ id: "story-1" });
    if (url === "https://api.webflow.com/v2/collections/stories/items/publish") return ok({});
    if (url.startsWith("https://webflow.com/api/v1/form/")) return new Response("{}", { status: 200 });
    if (url === "https://api.resend.com/emails") return ok(opts.resendFails ? { message: "nope" } : { id: "email-1" }, opts.resendFails ? 422 : 200);
    if (url in links) {
      if (links[url] === 0) throw new TypeError("fetch failed");
      return new Response(null, { status: links[url] });
    }
    if (/^https?:\/\/[^/]*example\.(com|org)\//.test(url)) return new Response(null, { status: 200 });
    throw new Error(`unexpected fetch ${method} ${url}`);
  };
}

function words(n) {
  return Array.from({ length: n }, (_, i) => `word${i}`).join(" ");
}

function story(overrides = {}) {
  return {
    country: PLACE_ID,
    city: "Copenhagen",
    when: "September 2026",
    body: `<p>${words(150)}</p><p>${words(150)}</p>`,
    headline: "Six hours in Kastrup",
    excerpt: "A long layover.",
    heroPhoto: {
      publicId: "tll/abc",
      originalUrl: "https://res.cloudinary.com/idonvlow/image/upload/v1/tll/abc.jpg",
      cleanedUrl: "https://res.cloudinary.com/idonvlow/image/upload/v1/tll/abc.jpg",
      approved: "original",
    },
    shoutOuts: [{ who: "Cafe Example", link: "https://cafe.example.com/menu", why: "Coffee" }],
    rightsAgreed: true,
    charterAgreed: true,
    affiliateLinks: false,
    ...overrides,
  };
}

function publish(body, e = env()) {
  const req = new Request("https://w.example/publish", {
    method: "POST",
    headers: { Authorization: "Bearer tok", "Content-Type": "application/json", Origin: "https://www.thatlayover.life" },
    body: JSON.stringify(body),
  });
  return worker.fetch(req, e);
}

const created = () => calls.find((c) => c.url === "https://api.webflow.com/v2/collections/stories/items" && c.method === "POST");
const resendCalls = () => calls.filter((c) => c.url === "https://api.resend.com/emails");

beforeEach(() => {
  calls = [];
  logs = [];
  realError = console.error;
  realLog = console.log;
  console.error = (...a) => logs.push(a.join(" "));
  console.log = (...a) => logs.push(a.join(" "));
});
afterEach(() => {
  globalThis.fetch = realFetch;
  console.error = realError;
  console.log = realLog;
});

// ---------------------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------------------

test("wordCount counts words in the HTML body, not tags or lone dashes", () => {
  assert.equal(wordCount("<p>One two</p><p>three &amp; four</p>"), 4);
  assert.equal(wordCount("<p>Gate B12 - then 5 hours</p>"), 5);
  assert.equal(wordCount(""), 0);
});

test("htmlToText keeps paragraphs and line breaks and decodes entities", () => {
  assert.equal(htmlToText("<p>Hi &amp; bye</p><p>Line one<br>Line two</p>"), "Hi & bye\n\nLine one\nLine two");
});

test("bodyHrefs and publicHttpUrl", () => {
  assert.deepEqual(bodyHrefs('<a href="https://a.example.com/x?a=1&amp;b=2">x</a> <a href=\'mailto:x@y.z\'>m</a>'), [
    "https://a.example.com/x?a=1&b=2",
    "mailto:x@y.z",
  ]);
  assert.equal(publicHttpUrl("https://www.example.com/a"), "https://www.example.com/a");
  assert.equal(publicHttpUrl("http://localhost:8787/"), null);
  assert.equal(publicHttpUrl("http://10.0.0.1/"), null);
  assert.equal(publicHttpUrl("ftp://example.com/"), null);
  assert.equal(publicHttpUrl("https://intranet/"), null);
});

// ---------------------------------------------------------------------------------------
// B2.2 rules
// ---------------------------------------------------------------------------------------

test("publishes a story that passes every rule", async () => {
  install();
  const res = await publish(story());
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.match(data.url, /^https:\/\/www\.thatlayover\.life\/stories\/six-hours-in-kastrup-[a-z0-9]{4}$/);
  assert.equal(created().body.fieldData.disclosure, "Paid for by the traveler");
});

test(`refuses a body under ${MIN_WORDS} words and accepts exactly ${MIN_WORDS}`, async () => {
  install();
  const short = await publish(story({ body: `<p>${words(299)}</p>` }));
  assert.equal(short.status, 400);
  assert.match((await short.json()).error, /300 words or more\. This one has 299\./);
  assert.equal(created(), undefined);
  const exact = await publish(story({ body: `<p>${words(300)}</p>`, headline: "Exactly three hundred" }));
  assert.equal(exact.status, 200);
});

test("refuses a missing rights tick", async () => {
  install();
  for (const rightsAgreed of [undefined, false, "true"]) {
    const res = await publish(story({ rightsAgreed }));
    assert.equal(res.status, 400);
    assert.match((await res.json()).error, /your trip, your words and your photos/);
  }
  assert.equal(created(), undefined);
});

test("refuses a missing charter tick (existing rule kept)", async () => {
  install();
  const res = await publish(story({ charterAgreed: false }));
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /charter/);
});

test("refuses a missing affiliate declaration and records a yes in the disclosure", async () => {
  install();
  const missing = await publish(story({ affiliateLinks: undefined }));
  assert.equal(missing.status, 400);
  assert.match((await missing.json()).error, /affiliate links, yes or no/);
  const yes = await publish(story({ affiliateLinks: true, shoutOuts: [{ who: "Hotel Example", link: "https://hotel.example.com/", affiliate: true }] }));
  assert.equal(yes.status, 200);
  const fields = created().body.fieldData;
  assert.equal(fields.disclosure, "Paid for by the traveler. Contains affiliate links");
  assert.match(fields["links-and-mentions"], /rel="sponsored nofollow" data-tll-affiliate/);
});

test("refuses an affiliate shout-out when the story says it has no affiliate links", async () => {
  install();
  const res = await publish(story({ affiliateLinks: false, shoutOuts: [{ who: "Hotel Example", link: "https://hotel.example.com/", affiliate: true }] }));
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /Change that answer to yes/);
});

test("refuses a link that does not open (404, 410 or no answer) and names it", async () => {
  install({ links: { "https://gone.example.net/page": 404, "https://down.example.net/": 0 } });
  const res = await publish(story({ shoutOuts: [{ who: "Gone", link: "https://gone.example.net/page" }] }));
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /This link does not open: https:\/\/gone\.example\.net\/page\. Fix or remove it/);
  const body = `<p>${words(300)} <a href="https://down.example.net/">here</a></p>`;
  const res2 = await publish(story({ body, shoutOuts: [] }));
  assert.equal(res2.status, 400);
  assert.match((await res2.json()).error, /down\.example\.net/);
  assert.equal(created(), undefined);
});

test("a link that refuses robots (403) or needs GET (405 on HEAD) still counts as resolving", async () => {
  install({ links: { "https://guarded.example.net/": 403 } });
  const res = await publish(story({ shoutOuts: [{ who: "Guarded", link: "https://guarded.example.net/" }] }));
  assert.equal(res.status, 200);
  calls = [];
  let n = 0;
  install();
  const inner = globalThis.fetch;
  globalThis.fetch = async (input, init = {}) => {
    if (String(input) === "https://headless.example.net/") {
      n += 1;
      calls.push({ url: String(input), method: init.method });
      return new Response(null, { status: init.method === "HEAD" ? 405 : 200 });
    }
    return inner(input, init);
  };
  const res2 = await publish(story({ headline: "Another one", shoutOuts: [{ who: "Headless", link: "https://headless.example.net/" }] }));
  assert.equal(res2.status, 200);
  assert.equal(n, 2);
});

test("refuses a link to a private address before fetching it", async () => {
  install();
  const res = await publish(story({ sponsored: true, sponsorName: "Lounge", sponsorUrl: "http://192.168.0.1/" }));
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /not a public web address/);
  assert.equal(calls.some((c) => c.url.startsWith("http://192.168")), false);
});

test("refuses a country that is archived (not on the list)", async () => {
  install({ placeArchived: true });
  const res = await publish(story());
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /could not find that country/);
  assert.equal(created(), undefined);
});

test("refuses a hero photo from another Cloudinary cloud (existing rule kept)", async () => {
  install();
  const hero = { ...story().heroPhoto, originalUrl: "https://res.cloudinary.com/someoneelse/image/upload/v1/x.jpg" };
  const res = await publish(story({ heroPhoto: hero }));
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /That Layover Life upload/);
});

// ---------------------------------------------------------------------------------------
// B2.3 writer copy
// ---------------------------------------------------------------------------------------

test("emails the writer their own copy when RESEND_KEY and MAIL_FROM are set", async () => {
  install();
  const s = story();
  const res = await publish(s);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.emailed, true);
  const sent = resendCalls();
  assert.equal(sent.length, 1);
  const mail = sent[0].body;
  assert.equal(sent[0].headers.Authorization, "Bearer re_test");
  assert.deepEqual(Object.keys(mail).sort(), ["from", "subject", "text", "to"]);
  assert.deepEqual(mail.to, [WRITER_EMAIL]);
  assert.equal(mail.from, "That Layover Life <stories@thatlayover.life>");
  assert.equal(mail.subject, "Your story is live: Six hours in Kastrup");
  assert.ok(mail.text.includes(data.url));
  assert.ok(mail.text.includes("Six hours in Kastrup"));
  assert.ok(mail.text.includes(`${words(150)}\n\n${words(150)}`));
  // nothing beyond the writer's own copy
  for (const leak of [OTHER_EMAIL, "Other Writer", "mem_", "res.cloudinary.com", "Cafe Example", "A long layover.", "Jay"]) {
    assert.equal(mail.text.includes(leak), false, `email text must not contain ${leak}`);
  }
  // the address came from the Memberstack admin API with the submit Worker's own key
  const lookup = calls.find((c) => c.url === `https://admin.memberstack.com/members/${WRITER}`);
  assert.equal(lookup.headers["X-API-KEY"], "ms-secret");
});

test("uses the email from the token check when it is there, without a second lookup", async () => {
  install({ verifyEmail: true });
  const res = await publish(story());
  assert.equal((await res.json()).emailed, true);
  assert.equal(calls.some((c) => c.url === `https://admin.memberstack.com/members/${WRITER}`), false);
  assert.deepEqual(resendCalls()[0].body.to, [WRITER_EMAIL]);
});

test("skips the email silently without RESEND_KEY or without MAIL_FROM", async () => {
  for (const missing of [{ RESEND_KEY: "" }, { MAIL_FROM: undefined }]) {
    calls = [];
    install();
    const res = await publish(story(), env(missing));
    assert.equal(res.status, 200);
    assert.equal((await res.json()).emailed, false);
    assert.equal(resendCalls().length, 0);
    assert.equal(calls.some((c) => c.url === `https://admin.memberstack.com/members/${WRITER}`), false);
  }
});

test("a failed lookup or a refused send still publishes, says emailed false, and never logs the address or text", async () => {
  install({ memberFails: true });
  const a = await publish(story());
  assert.equal(a.status, 200);
  assert.equal((await a.json()).emailed, false);
  assert.equal(resendCalls().length, 0);

  install({ resendFails: true });
  const b = await publish(story({ headline: "Second story" }));
  assert.equal(b.status, 200);
  assert.equal((await b.json()).emailed, false);
  assert.ok(logs.some((l) => l.includes("writer copy failed with status 422")));
  for (const line of logs) {
    assert.equal(line.includes(WRITER_EMAIL), false);
    assert.equal(line.includes("word1"), false);
    assert.equal(line.includes("Second story"), false);
  }
});

test("a repeat of the same publish within 10 minutes sends no second email", async () => {
  install();
  const e = env();
  const first = await publish(story(), e);
  assert.equal((await first.json()).emailed, true);
  const again = await publish(story(), e);
  assert.equal((await again.json()).emailed, true);
  assert.equal(resendCalls().length, 1);
});

test("the email copy follows the TLL rules", () => {
  const { subject, text } = writerCopy({ headline: "A headline", body: "<p>Body text.</p>", url: "https://www.thatlayover.life/stories/x" });
  const ours = `${subject}\n${text}`.replace("A headline", "").replace("Body text.", "");
  assert.equal(/[\u2014!]/.test(ours), false, "no em dashes or exclamation marks");
  for (const banned of ["filed", "ship", "ledger", "the shelf", "counted by hand", "no filler", "truth over polish", "real names", "currently in"]) {
    assert.equal(ours.toLowerCase().includes(banned), false, `banned: ${banned}`);
  }
  assert.equal(writerCopy({ headline: "Two\r\nlines", body: "", url: "u" }).subject, "Your story is live: Two lines");
});

// ---------------------------------------------------------------------------------------
// Submit v5 (21 Oct 2026): sponsor rows, extras, dates shown, profile links, themes list
// ---------------------------------------------------------------------------------------

test("v5: sponsor rows write the disclosure line readers see and join the names into Sponsored by", async () => {
  install();
  const res = await publish(story({ sponsored: true, sponsors: [{ name: "Hotel Example", kind: "hosted" }, { name: "Ferry Co", kind: "gifted" }, { name: "", kind: "paid" }] }));
  assert.equal(res.status, 200);
  const fields = created().body.fieldData;
  assert.equal(fields.disclosure, "Hosted by Hotel Example. Gifted by Ferry Co. Opinions are the writer's own.");
  assert.equal(fields["sponsor-name-2"], "Hotel Example, Ferry Co");
  calls = [];
  const aff = await publish(story({ headline: "Another one", sponsored: true, affiliateLinks: true, sponsors: [{ name: "Airline X", kind: "paid" }] }));
  assert.equal(aff.status, 200);
  assert.equal(created().body.fieldData.disclosure, "Paid for by Airline X. Opinions are the writer's own. Contains affiliate links.");
});

test("v5: sponsored yes with no named row is refused; a v2 payload without rows keeps the old wording", async () => {
  install();
  const none = await publish(story({ sponsored: true, sponsors: [{ name: "", kind: "hosted" }] }));
  assert.equal(none.status, 400);
  assert.match((await none.json()).error, /name the sponsor/);
  const v2 = await publish(story({ sponsored: true, sponsorName: "Hotel Example" }));
  assert.equal(v2.status, 200);
  assert.equal(created().body.fieldData.disclosure, "Sponsored or hosted: Hotel Example");
});

test("v5: reader question, anchors, hashtags, dates shown and the Lounge opt-in are written; absent keys write nothing", async () => {
  install();
  const res = await publish(story({ readerQuestion: "Would you take the ferry?", anchors: "burek, ferry horn", hashtags: "#layover #montenegro", datesShown: { posted: true, traveled: false, edited: true }, loungeOptIn: true }));
  assert.equal(res.status, 200);
  const f = created().body.fieldData;
  assert.equal(f["reader-question"], "Would you take the ferry?");
  assert.equal(f["sensory-anchors"], "burek, ferry horn");
  assert.equal(f["hashtag-set"], "#layover #montenegro");
  assert.deepEqual([f["show-posted-date"], f["show-traveled-date"], f["show-edited-date"]], [true, false, true]);
  assert.deepEqual(JSON.parse(f["editor-notes-log"]).map((e) => e.type), ["lounge-opt-in"]);
  calls = [];
  await publish(story({ headline: "Plain v2 payload" }));
  const g = created().body.fieldData;
  for (const k of ["reader-question", "sensory-anchors", "hashtag-set", "show-posted-date", "show-traveled-date", "show-edited-date"]) assert.ok(!(k in g), k);
  assert.equal(g["editor-notes-log"], "[]");
});

test("v5: the byline step patches pen name, website and Instagram on the profile, only when they changed", async () => {
  install();
  const res = await publish(story({ creditMode: "Pen", penName: "The Gate Floor Correspondent", profileLinks: { website: "https://example.com/", instagram: "@gatefloor" } }));
  assert.equal(res.status, 200);
  const patch = calls.find((c) => c.url === "https://api.webflow.com/v2/collections/contributors/items/c-writer" && c.method === "PATCH");
  assert.ok(patch, "profile patched");
  assert.deepEqual(patch.body.fieldData, {
    "credit-mode": "38820387bc6c4892f486394a6c28776c",
    "pen-name": "The Gate Floor Correspondent",
    "personal-website-url": "https://example.com/",
    "instagram-url": "https://www.instagram.com/gatefloor",
  });
  const bad = await publish(story({ headline: "Bad site", profileLinks: { website: "not a url" } }));
  assert.equal(bad.status, 400);
  calls = [];
  await publish(story({ headline: "Nothing to patch" }));
  assert.ok(!calls.some((c) => c.url.endsWith("/items/c-writer") && c.method === "PATCH"), "no patch when nothing changed");
});

test("v5: a comped shout-out is marked in the links list", async () => {
  install();
  const res = await publish(story({ shoutOuts: [{ who: "Cafe Example", link: "https://cafe.example.com/menu", comped: true }] }));
  assert.equal(res.status, 200);
  assert.match(created().body.fieldData["links-and-mentions"], /data-tll-comped/);
});

test("v5: GET /themes lists the themes publicly", async () => {
  install();
  globalThis.fetch = ((inner) => async (input, init) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.startsWith("https://api.webflow.com/v2/collections/themes/items")) return new Response(JSON.stringify({ items: [{ id: "t1", fieldData: { name: "Layovers" } }] }), { status: 200 });
    return inner(input, init);
  })(globalThis.fetch);
  const res = await worker.fetch(new Request("https://w.example/themes", { headers: { Origin: "https://www.thatlayover.life" } }), env({ THEMES_COLLECTION: "themes" }));
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data.themes));
  assert.equal(data.themes[0].name, "Layovers");
});
