/* Where every placeholder comes from, and the real values used to test the templates.
   Read by build.cjs, which writes schema-templates.annotated.jsonc, webflow-head-code.html,
   filled-examples.json and the data block inside index.html. */

const wf = (path, type) => `{{wf {"path":"${path}","type":"${type}"} }}`;

/* One row per placeholder. "today" is what the live block does (checked Nov 12, 2026). */
const annotations = {
  story: [
    { ph: "SLUG", field: "Stories · slug", wf: wf("slug", "PlainText"), today: "Same.", note: "Used in @id, url, mainEntityOfPage and the breadcrumb." },
    { ph: "NAME", field: "Stories · name", wf: wf("name", "PlainText"), today: "Same (headline is the story title, not the SEO title).", note: "Google wants headline to match the title on the page. Webflow writes ' as &#39;; the tidy step turns it back." },
    { ph: "EXCERPT", field: "Stories · excerpt", wf: wf("excerpt", "PlainText"), today: "Same.", note: "A line break typed into the excerpt would make the block invalid JSON; the tidy step flattens it." },
    { ph: "HERO_IMAGE", field: "Stories · hero-image", wf: wf("hero-image", "ImageRef"), today: "Same, as a single string.", note: "Now an array of one, which is the shape Google's Article docs show." },
    { ph: "PUBLISHED_DATE", field: "Stories · published-date", wf: wf("published-date", "Date"), today: "Same.", note: "ISO 8601 with time zone, as Webflow writes it." },
    { ph: "DATE_MODIFIED", field: "Stories · last-updated, else published-date", wf: wf("published-date", "Date"), today: "Head code writes published-date; the inline script tll-st3-owner-edit-v1 swaps in last-updated when it is later.", note: "Keep that arrangement: head code cannot fall back from an empty field. The tidy step also copies datePublished into an empty dateModified." },
    { ph: "READING_TIME", field: "Stories · reading-time (Number, minutes)", wf: wf("reading-time", "Number"), today: "Not emitted.", note: "New. Becomes timeRequired, e.g. PT9M. The Worker sets it on publish (words ÷ 220, rounded up, at least 1). Empty would read PTM; the tidy step drops it. No Google feature reads timeRequired." },
    { ph: "CONTRIBUTOR_SLUG", field: "Stories · contributor → Contributors · slug", wf: wf("contributor:slug", "PlainText"), today: "Same, in author.url.", note: "New: author.@id matches the #person id the profile page already uses, so the story and the profile point at one person." },
    { ph: "CONTRIBUTOR_NAME", field: "Stories · contributor → Contributors · name", wf: wf("contributor:name", "PlainText"), today: "Same.", note: "Google's author guidance: name plus a url to the author page. Both are there." },
    { ph: "CONTRIBUTOR_BADGE", field: "Stories · contributor → Contributors · badge (Option: Contributor, Frequent, Editor, Founder)", wf: wf("contributor:badge", "Option"), today: "Not emitted.", note: "The founder badge. No schema.org property earns a rich result for it, so it is carried as a role: author.memberOf → OrganizationRole.roleName, inside TLL. The Founding 01 to 03 numbers are typed into the home page only; no CMS field holds them (see README)." },
    { ph: "EDITED_BY", field: "Stories · edited-by", wf: wf("edited-by", "PlainText"), today: "Not emitted.", note: "New: editor (Person). Empty on most stories; the tidy step drops a Person with no name." },
    { ph: "SPONSOR_NAME", field: "Stories · sponsor-name-2", wf: wf("sponsor-name-2", "PlainText"), today: "Not emitted.", note: "New: sponsor (Organization), only when a host or sponsor is named. The disclosure sentence itself stays on the page; no schema.org property carries it." },
    { ph: "BYLINE_LOCATION", field: "Stories · byline-location", wf: wf("byline-location", "PlainText"), today: "Same, in contentLocation.name (stored in capitals, e.g. NEW ORLEANS, LOUISIANA).", note: "Harmless in capitals. Title case in the CMS would read better in any tool that shows it." },
    { ph: "COUNTRY", field: "Stories · country-2 → Countries · name", wf: wf("country-2:name", "PlainText"), today: "Not emitted.", note: "New: contentLocation.address.addressCountry. The brief lists a field called countries; the Oct 13 CMS export and the Worker have country-2, a single reference. If a multi-reference countries field exists, head code cannot loop over it, so this stays one country." }
  ],
  layover: [
    { ph: "SLUG", field: "Layovers · slug", wf: wf("slug", "PlainText"), today: "Same.", note: "" },
    { ph: "NAME", field: "Layovers · name", wf: wf("name", "PlainText"), today: "Uses seo-title, e.g. \"Copenhagen 6-hour layover from CPH · That Layover Life\".", note: "Change: headline should be the title on the page (the H1 is the name), without the site name." },
    { ph: "SEO_DESCRIPTION", field: "Layovers · seo-description", wf: wf("seo-description", "PlainText"), today: "Same.", note: "" },
    { ph: "HERO_IMAGE", field: "Layovers · hero-image", wf: wf("hero-image", "ImageRef"), today: "Same, as a single string.", note: "" },
    { ph: "LAST_UPDATED", field: "Layovers · last-updated", wf: wf("last-updated", "Date"), today: "Same, in dateModified.", note: "There is no published-date field on Layovers, so datePublished is left out rather than guessed. Adding one is a decision (see README)." },
    { ph: "AUTHOR_SLUG", field: "Layovers · author → Contributors · slug", wf: wf("author:slug", "PlainText"), today: "Not emitted.", note: "New. The Layovers collection has an author reference (Oct 13 export), not in the brief's field list. Both live guides point at Nancy Carleton." },
    { ph: "AUTHOR_NAME", field: "Layovers · author → Contributors · name", wf: wf("author:name", "PlainText"), today: "Not emitted.", note: "New. Today the guides carry no author at all, which is the largest gap." },
    { ph: "CITY", field: "Layovers · city", wf: wf("city", "PlainText"), today: "about is the plain string \"Copenhagen\".", note: "Change: about becomes a typed City." },
    { ph: "AIRPORT_CODE", field: "Layovers · airport-code", wf: wf("airport-code", "PlainText"), today: "Not emitted.", note: "New: an Airport with iataCode, also in about. time-window (3h, 6h, 9h, 12h+) is not mapped: timeRequired means time to read or work through the page, and 12h+ is not a duration." }
  ],
  faq: [
    { ph: "PAGE_URL", field: "Page URL (no collection yet)", wf: "Coming soon", today: "/faq: same URL and the same #webpage id.", note: "Moving guides have no pages and no collection yet. On story pages the FAQ block is built by the script from Quick answers and uses #faq, because the page itself is the Article." },
    { ph: "PAGE_NAME", field: "Page name", wf: "Coming soon", today: "/faq: \"FAQ · That Layover Life\".", note: "" },
    { ph: "PAGE_DESCRIPTION", field: "Page meta description", wf: "Coming soon", today: "/faq: same.", note: "" },
    { ph: "LAST_UPDATED", field: "Moving guide · last-updated (proposed)", wf: "Coming soon", today: "/faq: not emitted.", note: "Empty on /faq, so the tidy step drops it." },
    { ph: "CITY", field: "Moving guide · city (proposed)", wf: "Coming soon", today: "/faq: not emitted.", note: "General FAQ has no city; dropped when empty." },
    { ph: "QUESTION", field: "Quick answers (RichText): each bold line or h3/h4", wf: "Script, not a binding", today: "Story pages: tll FAQ schema v1 builds this from the rendered Quick answers block. /faq: written by hand into the page head.", note: "Repeats once per question. Webflow head code cannot loop a RichText field into JSON, so the script that already does this for stories is the injection point." },
    { ph: "ANSWER", field: "Quick answers (RichText): the paragraphs under each question", wf: "Script, not a binding", today: "As above.", note: "Google requires the answer text to be visible on the page; reading it from the rendered block guarantees that." }
  ]
};

/* Real values. Every one was read from the live page or its JSON-LD on Nov 12, 2026,
   except where "from" says the Oct 13, 2026 CMS export. */
const examples = [
  {
    id: "story-nola", short: "New Orleans", template: "story", label: "Story · La Petite's Guide to New Orleans",
    page: "https://www.thatlayover.life/stories/new-orleans-short-girl-wedding-krewe-of-boo",
    values: {
      SLUG: "new-orleans-short-girl-wedding-krewe-of-boo",
      NAME: "La Petite&#39;s Guide to New Orleans",
      EXCERPT: "Tippy toes on Canal Street: a wedding, a Halloween parade and a swamp, seen mostly from the back row.",
      HERO_IMAGE: "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6adfb9519a9ba4a4df4ddecf_6adfb8c46abb1496ea92496b_nola-hero-krewe-of-boo-canal-street.jpeg",
      PUBLISHED_DATE: "2026-10-26T20:40:00.000Z",
      DATE_MODIFIED: "",
      READING_TIME: "9",
      CONTRIBUTOR_SLUG: "nancy-carleton",
      CONTRIBUTOR_NAME: "Nancy Carleton",
      CONTRIBUTOR_BADGE: "Founder",
      EDITED_BY: "Nancy Carleton",
      SPONSOR_NAME: "",
      BYLINE_LOCATION: "NEW ORLEANS, LOUISIANA",
      COUNTRY: "United States"
    },
    from: {
      NAME: "Live Article block, written the way Webflow writes it (&#39;) to show the tidy step",
      DATE_MODIFIED: "Empty: the page shows no Last updated line",
      READING_TIME: "Reading time shown on the page",
      CONTRIBUTOR_BADGE: "Contributors · badge in the Oct 13 CMS export",
      EDITED_BY: "The Receipts box on the page",
      SPONSOR_NAME: "Empty: the disclosure reads \"Paid for by the traveler, flights on points\"",
      COUNTRY: "The country of the byline place; country-2 itself was not read for this build"
    }
  },
  {
    id: "story-torrevieja", short: "Torrevieja", template: "story", label: "Story · Torrevieja Street Food Market 2026",
    page: "https://www.thatlayover.life/stories/torrevieja-street-food-market-2026-rocking-out-with-some-great-food",
    values: {
      SLUG: "torrevieja-street-food-market-2026-rocking-out-with-some-great-food",
      NAME: "Torrevieja Street Food Market 2026: Rocking Out With Some Great Food",
      EXCERPT: "The Torrevieja Street Food Market in the Parque de las Naciones in October 2026 was a sight to behold and certainly wasn&#39;t an event to turn your nose up at.",
      HERO_IMAGE: "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ae323f4b56dc5d88cc6e62e_uwjpidtfgp3gwxuzeefz.jpeg",
      PUBLISHED_DATE: "2026-10-29T10:50:00.000Z",
      DATE_MODIFIED: "",
      READING_TIME: "3",
      CONTRIBUTOR_SLUG: "luke-luby",
      CONTRIBUTOR_NAME: "Luke Luby",
      CONTRIBUTOR_BADGE: "",
      EDITED_BY: "",
      SPONSOR_NAME: "",
      BYLINE_LOCATION: "TORREVIEJA, SPAIN",
      COUNTRY: "Spain"
    },
    from: {
      CONTRIBUTOR_BADGE: "Empty here: no badge shows on his profile, so this example shows the role being dropped",
      EDITED_BY: "Empty: the Receipts box shows only Submitted by",
      COUNTRY: "The country in the byline"
    }
  },
  {
    id: "layover-cph", short: "CPH", template: "layover", label: "Layover · The 6-Hour Copenhagen Reset (from CPH)",
    page: "https://www.thatlayover.life/layovers/cph-copenhagen-6h",
    values: {
      SLUG: "cph-copenhagen-6h",
      NAME: "The 6-Hour Copenhagen Reset (from CPH)",
      SEO_DESCRIPTION: "Six hours from CPH by someone who lives there. The M2 metro, smørrebrød at Schønnemann, the Wednesday cinnamon roll, the sauna swim, and the Round Tower.",
      HERO_IMAGE: "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6a13ea7c5a528723c5ec9a90_6a0cb9cfa916b3a0a762300e_1ogGpPdJtm0VTPcOxKRmJrvMZxvgGGYiX%253Dw2400.jpeg",
      LAST_UPDATED: "2026-09-23T00:00:00.000Z",
      AUTHOR_SLUG: "nancy-carleton",
      AUTHOR_NAME: "Nancy Carleton",
      CITY: "Copenhagen",
      AIRPORT_CODE: "CPH"
    },
    from: { AUTHOR_SLUG: "Layovers · author in the Oct 13 CMS export", AUTHOR_NAME: "Layovers · author in the Oct 13 CMS export", CITY: "Layovers · city", AIRPORT_CODE: "Layovers · airport-code" }
  },
  {
    id: "layover-sof", short: "SOF", template: "layover", label: "Layover · Three Hours in Sofia, If You Must (from SOF)",
    page: "https://www.thatlayover.life/layovers/sof-sofia-3h",
    values: {
      SLUG: "sof-sofia-3h",
      NAME: "Three Hours in Sofia, If You Must (from SOF)",
      SEO_DESCRIPTION: "Three hours from SOF, planned tight. Tarator at Made in Home, the cathedral from across the road, and a candlelit shot of rakia at Hambara.",
      HERO_IMAGE: "https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6a0cc5157e83888edcfbbeee_6a0cba798dfcb5ee54bc8683_1erBLlFASwqo2hhlBzbQgdr_hEqf4rg6q%253Dw2400.jpeg",
      LAST_UPDATED: "2026-05-19T00:00:00.000Z",
      AUTHOR_SLUG: "nancy-carleton",
      AUTHOR_NAME: "Nancy Carleton",
      CITY: "Sofia",
      AIRPORT_CODE: "SOF"
    },
    from: { AUTHOR_SLUG: "Layovers · author in the Oct 13 CMS export", AUTHOR_NAME: "Layovers · author in the Oct 13 CMS export" }
  },
  {
    id: "faq-site", short: "/faq", template: "faq", label: "FAQ · /faq (the only live FAQ page)",
    page: "https://www.thatlayover.life/faq",
    values: {
      PAGE_URL: "https://www.thatlayover.life/faq",
      PAGE_NAME: "FAQ · That Layover Life",
      PAGE_DESCRIPTION: "Questions, answered straight. What TLL is, whether it's free, how to publish and keep your byline, affiliate links, EU dog travel, and press trips.",
      LAST_UPDATED: "",
      CITY: ""
    },
    qaFromLive: "/faq",
    from: { PAGE_NAME: "The name in the live FAQPage block", LAST_UPDATED: "Empty: /faq has no date field", CITY: "Empty: not a city page" }
  }
];

module.exports = { annotations, examples, wf };
