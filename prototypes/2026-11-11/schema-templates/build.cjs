/* node build.cjs
   1. Fills every template with each real example by text substitution (the way Webflow does it),
      parses the result, runs the tidy step, and checks it. Any failure stops the build.
   2. Writes filled-examples.json, schema-templates.annotated.jsonc and webflow-head-code.html.
   3. Copies the data and tidy.js into index.html between the DATA and TIDY markers. */
const fs = require("fs");
const path = require("path");
const here = (f) => path.join(__dirname, f);

const templates = JSON.parse(fs.readFileSync(here("schema-templates.json"), "utf8"));
const { annotations, examples, wf } = require("./data.cjs");
const tidy = require("./tidy.cjs");
const live = JSON.parse(fs.readFileSync(here("live-jsonld-2026-11-12.json"), "utf8"));

const PH = /\{\{([A-Z_]+)\}\}/g;
const jsonEsc = (s) => JSON.stringify(String(s)).slice(1, -1);

function placeholders(obj) {
  const set = new Set();
  JSON.stringify(obj).replace(PH, (_, k) => set.add(k));
  return [...set];
}

function liveQA(pagePath) {
  const blocks = live.pages[pagePath] || [];
  for (const b of blocks) {
    const nodes = (b.json && (b.json["@graph"] || [b.json])) || [];
    for (const n of nodes) if (n["@type"] === "FAQPage") return n.mainEntity.map((q) => ({ q: q.name, a: q.acceptedAnswer.text }));
  }
  return [];
}

/* Text-level fill, as Webflow's head code does: the template is text, values go in where the tokens are. */
function fill(name, values, qa) {
  const t = JSON.parse(JSON.stringify(templates[name]));
  if (qa && t.mainEntity) {
    const pattern = JSON.stringify(t.mainEntity[0]);
    t.mainEntity = qa.map((p) => JSON.parse(pattern.replace("{{QUESTION}}", jsonEsc(p.q)).replace("{{ANSWER}}", jsonEsc(p.a))));
  }
  const text = JSON.stringify(t, null, 2).replace(PH, (_, k) => jsonEsc(values[k] == null ? "" : values[k]));
  return text;
}

function mainNode(j) {
  const nodes = j["@graph"] || [j];
  return nodes.find((n) => n["@type"] === "Article" || n["@type"] === "FAQPage") || nodes[0];
}

function check(name, obj) {
  const errs = [];
  const s = JSON.stringify(obj);
  if (s.includes("{{")) errs.push("a placeholder was left unfilled");
  if (/&#39;|&quot;|&amp;/.test(s)) errs.push("an HTML entity survived the tidy step");
  if (obj["@context"] !== "https://schema.org") errs.push("@context missing");
  const walk = (v, p) => {
    if (typeof v === "string") {
      if (/^(date|datePublished|dateModified)$/.test(p) && isNaN(Date.parse(v))) errs.push(p + " is not a date: " + v);
      if (p === "timeRequired" && !/^PT\d+M$/.test(v)) errs.push("timeRequired is not an ISO 8601 duration: " + v);
      if (/^(url|item|image|mainEntityOfPage|publishingPrinciples)$/.test(p) && !/^https:\/\/[^\s]+$/.test(v)) errs.push(p + " is not an absolute https URL: " + v);
    } else if (Array.isArray(v)) v.forEach((x) => walk(x, p));
    else if (v && typeof v === "object") Object.keys(v).forEach((k) => walk(v[k], k));
  };
  walk(obj, "");
  const m = mainNode(obj);
  if (name === "story" || name === "layover") {
    ["headline", "image", "author", "dateModified"].forEach((k) => { if (!m[k]) errs.push("Article has no " + k); });
    if (m.author && !(m.author.name && m.author.url)) errs.push("author needs name and url");
    if (name === "story" && !m.datePublished) errs.push("story has no datePublished");
  }
  if (name === "faq") {
    if (!Array.isArray(m.mainEntity) || !m.mainEntity.length) errs.push("FAQPage has no questions");
    (m.mainEntity || []).forEach((q, i) => { if (!q.name || !q.acceptedAnswer || !q.acceptedAnswer.text) errs.push("question " + (i + 1) + " is incomplete"); });
  }
  return errs;
}

/* Which properties of the main node are new, changed or dropped compared with the live page. */
function diff(proposed, livePath) {
  const blocks = live.pages[livePath] || [];
  const want = mainNode(proposed)["@type"];
  let liveNode = null;
  for (const b of blocks) {
    const nodes = (b.json && (b.json["@graph"] || [b.json])) || [];
    for (const n of nodes) if (n["@type"] === want && (!liveNode)) liveNode = n;
  }
  if (!liveNode) return { added: [], changed: [], dropped: [], liveFound: false };
  const p = mainNode(proposed);
  const keys = new Set([...Object.keys(p), ...Object.keys(liveNode)]);
  const out = { added: [], changed: [], dropped: [], liveFound: true };
  const canon = (v) => Array.isArray(v) ? "[" + v.map(canon).join(",") + "]" : (v && typeof v === "object") ? "{" + Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}" : JSON.stringify(v);
  keys.delete("@context");
  keys.forEach((k) => {
    if (!(k in liveNode)) out.added.push(k);
    else if (!(k in p)) out.dropped.push(k);
    else if (canon(p[k]) !== canon(liveNode[k])) out.changed.push(k);
  });
  return out;
}

/* 1. Every placeholder has an annotation; every example has a value for every placeholder. */
const problems = [];
for (const name of Object.keys(templates)) {
  const used = placeholders(templates[name]);
  const rows = annotations[name].map((r) => r.ph);
  used.forEach((k) => { if (!rows.includes(k)) problems.push(name + ": {{" + k + "}} has no annotation"); });
  rows.forEach((k) => { if (!used.includes(k)) problems.push(name + ": annotation for {{" + k + "}} matches nothing"); });
}

const filled = [];
for (const ex of examples) {
  const used = placeholders(templates[ex.template]).filter((k) => !(ex.template === "faq" && (k === "QUESTION" || k === "ANSWER")));
  used.forEach((k) => { if (!(k in ex.values)) problems.push(ex.id + ": no value for {{" + k + "}}"); });
  const qa = ex.qaFromLive ? liveQA(ex.qaFromLive) : null;
  if (ex.qaFromLive && !qa.length) problems.push(ex.id + ": no live questions found");
  const rawText = fill(ex.template, ex.values, qa);
  let raw, tidied;
  try { raw = JSON.parse(rawText); } catch (e) { problems.push(ex.id + ": raw fill does not parse: " + e.message); continue; }
  try { tidied = tidy.tidyText(rawText); } catch (e) { problems.push(ex.id + ": tidy failed: " + e.message); continue; }
  const errs = check(ex.template, tidied);
  errs.forEach((e) => problems.push(ex.id + ": " + e));
  const livePath = new URL(ex.page).pathname;
  filled.push({ id: ex.id, short: ex.short, template: ex.template, label: ex.label, page: ex.page, from: ex.from || {}, values: ex.values, questions: qa ? qa.length : undefined, rawParses: true, checks: errs.length ? errs : ["parses", "no placeholder left", "dates are ISO 8601", "URLs are absolute https"], diffVsLive: diff(tidied, livePath), jsonld: tidied });
}

if (problems.length) { console.error("BUILD FAILED\n- " + problems.join("\n- ")); process.exit(1); }

/* 2a. filled-examples.json */
fs.writeFileSync(here("filled-examples.json"), JSON.stringify({ built: new Date().toISOString().slice(0, 10), note: "Each template filled with one real page's values by text substitution, parsed, then tidied. Values and sources are in data.cjs.", examples: filled }, null, 2) + "\n");

/* 2b. annotated version (JSONC: JSON with // comments, which JSON-LD itself cannot carry). */
const CONST_NOTES = {
  '"@type": "OrganizationRole"': "founder badge as a role inside TLL; schema.org-valid, no Google rich result",
  '"publishingPrinciples"': "constant: the editorial charter, already on the Organization node",
  '"isAccessibleForFree"': "constant: no story is paywalled",
  '"inLanguage"': "constant",
  '"@id": "https://www.thatlayover.life/#organization"': "constant: the Organization node on the home page",
  '"@id": "https://www.thatlayover.life/#website"': "constant: the WebSite node on the home page",
  '"name": "Layover Guides"': "constant; today it links /pillars/layover-guides, while /layovers is the guide index (decision in README)",
  '"mainEntity": [': "one Question per Quick answers pair; the script repeats this block"
};
function annotate(name) {
  const rows = Object.fromEntries(annotations[name].map((r) => [r.ph, r]));
  const lines = JSON.stringify(templates[name], null, 2).split("\n");
  const out = [], seen = new Set();
  lines.forEach((line) => {
    const phs = [...line.matchAll(PH)].map((m) => m[1]);
    const notes = [];
    phs.forEach((k) => {
      const r = rows[k];
      if (r && seen.has(k)) { if (!notes.some((n) => n.startsWith(k))) notes.push(k + ": same field as above"); return; }
      seen.add(k);
      if (r && !notes.some((n) => n.startsWith(k))) notes.push(k + " ← " + r.field + (r.wf.startsWith("{{wf") ? "" : " [" + r.wf + "]") + ". Today: " + r.today + (r.note ? " " + r.note : ""));
    });
    Object.keys(CONST_NOTES).forEach((c) => { if (line.includes(c)) notes.push(CONST_NOTES[c]); });
    if (notes.length) notes.forEach((n) => out.push(line.replace(/\S.*$/, "") + "// " + n));
    out.push(line);
  });
  return out.join("\n");
}
const titles = { story: "STORY (Stories collection template, /stories/<slug>): Article + BreadcrumbList", layover: "LAYOVER GUIDE (Layovers collection template, /layovers/<slug>): Article about a City and an Airport", faq: "FAQ (expat paperwork Q&A; /faq today): FAQPage" };
const jsonc = ["// TLL JSON-LD templates, annotated. Nov 12, 2026. Prototype, not live.",
  "// JSON-LD cannot carry comments, so this file is for reading. Paste from schema-templates.json or webflow-head-code.html.",
  "// Each comment sits above the line it explains: the CMS field the value comes from, what the live page does today, and what changes.", ""];
for (const name of Object.keys(templates)) { jsonc.push("// ===== " + titles[name] + " =====", annotate(name), ""); }
fs.writeFileSync(here("schema-templates.annotated.jsonc"), jsonc.join("\n"));

/* 2c. Webflow head code: the exact text for the two collection template pages. */
function wfText(name, id) {
  const rows = Object.fromEntries(annotations[name].map((r) => [r.ph, r]));
  const json = JSON.stringify(templates[name]).replace(PH, (_, k) => rows[k].wf);
  return '<script type="application/ld+json" id="' + id + '">' + json + "</script>";
}
const tidySrc = fs.readFileSync(here("tidy.cjs"), "utf8");
const headCode = [
  "<!-- Stories collection template · Page settings · Custom code · Inside <head> -->",
  "<!-- Replaces the block with the same id. Keep the id: tll-st3-owner-edit-v1 finds it by id to set dateModified. -->",
  "<!-- Insert each {{wf ...}} token with Webflow's \"+ Add field\" picker rather than typing it; Webflow stores the quotes as &quot;. -->",
  wfText("story", "tll-article-ld-v2"), "",
  "<!-- Layovers collection template · same place. Replaces tll-layover-ld-v1. -->",
  wfText("layover", "tll-layover-ld-v1"), "",
  "<!-- Both templates, after the block. Replaces the inline tll-ld-unescape-v1 on stories. -->",
  '<script id="tll-ld-unescape-v2">', tidySrc.trim(), "TLLTidy.run(document);", "</script>", "",
  "<!-- FAQ: no binding. Story pages keep the script that builds FAQPage from the Quick answers block. Moving guides: Coming soon. -->", ""
].join("\n");
fs.writeFileSync(here("webflow-head-code.html"), headCode);

/* 3. Data for index.html */
const liveSummary = {};
Object.keys(live.pages).forEach((p) => { liveSummary[p] = live.pages[p].map((b) => ({ source: b.source, id: b.id, types: b.json ? (b.json["@graph"] || [b.json]).map((n) => n["@type"]) : [], json: b.json })); });
const DATA = {
  templates, annotations, examples: filled, live: liveSummary, capturedAt: live.capturedAt,
  annotated: { story: annotate("story"), layover: annotate("layover"), faq: annotate("faq") },
  head: { story: wfText("story", "tll-article-ld-v2"), layover: wfText("layover", "tll-layover-ld-v1") }
};
let html = fs.readFileSync(here("index.html"), "utf8");
const put = (start, end, body) => {
  const a = html.indexOf(start), b = html.indexOf(end);
  if (a < 0 || b < 0) throw new Error("marker missing: " + start);
  html = html.slice(0, a + start.length) + "\n" + body + "\n" + html.slice(b);
};
put("/*DATA-START*/", "/*DATA-END*/", "var DATA = " + JSON.stringify(DATA).replace(/</g, "\\u003c") + ";");
put("/*TIDY-START*/", "/*TIDY-END*/", tidySrc.trim());
fs.writeFileSync(here("index.html"), html);

console.log("OK: " + filled.length + " examples filled, parsed, tidied and checked.");
filled.forEach((f) => console.log(" - " + f.id + ": " + f.checks.join(", ") + " | vs live: +" + f.diffVsLive.added.join(",") + " ~" + f.diffVsLive.changed.join(",") + " -" + f.diffVsLive.dropped.join(",")));
