/* TLL JSON-LD tidy (prototype). Proposed as tll-ld-unescape-v2, replacing the inline tll-ld-unescape-v1
   that runs on story pages today. Same job as v1 (turn Webflow's &#39; back into ') plus three more:
   1. drops values a CMS field left empty ("", "PTM" from an empty reading time, a Person with no name),
   2. copies datePublished into dateModified when dateModified ended up empty,
   3. runs on every block TLL writes (story, layover, FAQ), not only #tll-article-ld-v2.
   Works in the browser and in Node (the prototype's build step uses the same function). */
(function (root) {
  var NEEDS = {
    Person: ["name"], Organization: ["name"], OrganizationRole: ["roleName"],
    Place: ["name"], City: ["name"], Airport: ["iataCode"], PostalAddress: ["addressCountry"],
    Question: ["name", "acceptedAnswer"], Answer: ["text"]
  };
  var ENT = { "&#39;": "'", "&#x27;": "'", "&quot;": '"', "&#34;": '"', "&amp;": "&", "&lt;": "<", "&gt;": ">", "&nbsp;": " " };
  function decode(s) {
    if (s.indexOf("&") < 0) return s;
    return s.replace(/&(#39|#x27|quot|#34|amp|lt|gt|nbsp);/g, function (m) { return ENT[m]; });
  }
  function empty(v) {
    return v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
  }
  function clean(v) {
    if (typeof v === "string") {
      var s = decode(v).replace(/\s+/g, " ").trim();
      if (s === "PTM" || s.indexOf("{{") > -1) return "";
      return s;
    }
    if (Array.isArray(v)) return v.map(clean).filter(function (x) { return !empty(x); });
    if (v && typeof v === "object") {
      var out = {};
      Object.keys(v).forEach(function (k) {
        var c = clean(v[k]);
        if (!empty(c)) out[k] = c;
      });
      var need = NEEDS[out["@type"]];
      if (need && need.some(function (k) { return empty(out[k]); })) return "";
      if (out.datePublished && !out.dateModified) out.dateModified = out.datePublished;
      return out;
    }
    return v;
  }
  function tidyText(text) {
    /* Control characters (a line break typed into an Excerpt) make the whole block invalid JSON. */
    return clean(JSON.parse(String(text).replace(/[\u0000-\u001F]+/g, " ")));
  }
  function run(doc) {
    var list = doc.querySelectorAll('script[type="application/ld+json"]');
    Array.prototype.forEach.call(list, function (s) {
      try { s.textContent = JSON.stringify(tidyText(s.textContent)); } catch (e) { /* leave it as it was */ }
    });
  }
  var api = { clean: clean, tidyText: tidyText, run: run, decode: decode };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.TLLTidy = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
