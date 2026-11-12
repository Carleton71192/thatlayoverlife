# Schema templates: JSON-LD for stories, layover guides and the expat Q&A

A reference page and the files behind it. The brief asked for three JSON-LD templates: an Article for stories, a layover-guide type and an FAQPage for expat paperwork. Open `index.html`: it shows each template as plain template, annotated view, Webflow head code, filled with real pages and next to what the live page emits today. It also has a form that fills a template the way Webflow does and says whether the result parses. Mock-up only: nothing was committed and Webflow was not touched.

## Files

| File | What it is |
| --- | --- |
| `schema-templates.json` | The three templates (`story`, `layover`, `faq`) in one file. It parses as JSON; values are `{{PLACEHOLDER}}` tokens inside strings. |
| `schema-templates.annotated.jsonc` | The same templates with a `//` comment above each line naming the CMS field, what the live page does today and what changes. JSON-LD cannot contain comments, so this file is for reading only. |
| `webflow-head-code.html` | The exact text for the Stories and Layovers collection template heads, with Webflow `{{wf ...}}` bindings, plus the tidy script. |
| `filled-examples.json` | Each template filled with one real page's values, parsed, tidied and checked, with a property diff against the live block. |
| `live-jsonld-2026-11-12.json` | Every `application/ld+json` block on six live pages, read in Chromium after their scripts ran on Nov 12, 2026. |
| `tidy.cjs` | The tidy step, proposed as `tll-ld-unescape-v2`. Works in the browser and in Node. |
| `data.cjs` | The field map and the real example values with where each came from. |
| `build.cjs` | `PATH=/opt/node22/bin:$PATH node build.cjs` fills, parses and checks every example, writes the files above and copies the data into `index.html`. It stops on any failure. |
| `shot-390.png`, `shot-1440.png` | The page at device scale 2. |

Checked in Chromium at 390, 768 and 1440: no sideways scroll, no console errors, nothing under 12px, and axe-core 4.10 reports no violations. Tabs (arrow keys work), view chips, copy buttons and the fill form were driven by script. The stats line ("5 of 5 real pages fill, parse and pass", "8 live blocks read on 6 pages") is computed in the page.

## How the brief is met

| Brief | In the prototype |
| --- | --- |
| Article for the travel logs, mapping author, founder badges and read times | `story` template. Author is a Person with name, url and an `@id` that matches the `#person` id the profile pages already emit. Read time is `timeRequired` as ISO 8601 (`PT9M`) from `reading-time`. The founder badge is `author.memberOf`, an `OrganizationRole` inside TLL whose `roleName` comes from Contributors `badge` (Contributor, Frequent, Editor, Founder). Also editor (`edited-by`), sponsor (`sponsor-name-2`), country (`country-2`). |
| TravelAction or a custom Guide for layovers | Both considered and rejected, with HowTo and Article (section 04 of the page). Recommended: `Article` with `about` a typed `City` and an `Airport` with `iataCode`, and an author from the Layovers `author` reference. |
| FAQPage for the expat logistics section | `faq` template, one Question per pair. Google's current limits are stated up front (below). |
| Comments showing where to inject metadata | The annotated `.jsonc`, the field map beside each template, and the Webflow head code with the real binding for each field. |
| Complete, valid template | Every template is filled with real values and parsed by `build.cjs` and again in the page. The filled results are in `filled-examples.json`. |

## What the live site emits today (Nov 12, 2026)

- **Stories** (`#tll-article-ld-v2`, in the Stories template head): Article and BreadcrumbList with headline, excerpt, hero image, published date (also used as dateModified), author name and url, an inline publisher, contentLocation from byline-location. No reading time, badge, editor or sponsor. Stories with Quick answers get a second block, a FAQPage built after load by the "tll FAQ schema v1" script.
- **Layover guides** (`#tll-layover-ld-v1`): Article with the SEO title as headline ("Copenhagen 6-hour layover from CPH · That Layover Life", while the H1 is the guide's name), no author, no datePublished, and `about` as the plain string "Copenhagen".
- **/faq**: a hand-written FAQPage with seven questions plus a BreadcrumbList.
- Webflow writes apostrophes as `&#39;` into head code. In the raw HTML the Kuala Lumpur story's headline is `FOMO Is Real, Y&#39;all`. The inline `tll-ld-unescape-v1` fixes the story block only, for crawlers that run scripts.

What would change: the story block gains timeRequired, the badge role, editor, sponsor, country, a joined-up publisher `@id` and an image array. The layover block gets the name as headline, an author and a typed City and Airport. /faq can stay as it is; the FAQ template filled with its values matches it apart from the breadcrumb, which /faq keeps in its own block. The tidy step replaces `tll-ld-unescape-v1`, covers both blocks and drops what an empty field leaves behind (`"PTM"`, a Person with no name, an empty roleName).

## What Google does with it (the honest part)

- **FAQ rich results are gone for every site.** Google's FAQ documentation reportedly says "As of May 7, 2026, FAQ rich results are no longer appearing in Google Search", with the Rich Results Test and Search Console report following in June 2026. Before that, from August 2023, only well-known government and health sites qualified, so TLL never was eligible. FAQPage stays valid schema.org; test it with validator.schema.org. This build session could not open developers.google.com (the network refused it), so these dates come from search results quoting Google's notice. Open the page before quoting it.
- **HowTo rich results** were removed in August (mobile) and September (desktop) 2023.
- **Article**: Google's docs list no required properties and recommend author with url, dates, headline and image. They help Google read the page. There is no Article-specific snippet to win.
- **Founder badges**: no schema.org property makes a badge into a rich result. The role mapping is accurate and that is all it is. Nancy's home-page Person already has `jobTitle` "Founder and editor", which is where a job belongs.
- **Read time**: `timeRequired` is valid schema.org; Google shows nothing from it.
- **Guide** is a schema.org type in the pending area, meant for pages recommending products or services (`reviewAspect`). **TravelAction** is an Action, the act of traveling, not content. Neither has a Google feature.

## Where I departed from the brief, and why

- **"Maximize rich snippet findability" became "say what Google does".** Two of the three snippets the brief has in mind no longer exist (FAQ, HowTo). The page says so instead of implying otherwise.
- **No TravelAction and no custom Guide.** Reasons above. The layover template stays an Article, which is what the guides already are.
- **Founder badge mapped to a role, not to `jobTitle` or `award`.** A badge is not a job, and inventing a custom property would be ignored by everyone.
- **"countries" is mapped as `country-2`.** The brief's field list says `countries`; the Oct 13 CMS export and the Worker have `country-2`, a single reference. Head code cannot loop a multi-reference anyway.
- **The Layovers `author` field is used**, though it is not in the brief's field list. It is in the Oct 13 export, and both guides point at Nancy Carleton.
- **`time-window` is not mapped.** It is the length of the layover, not time to read the page, and "12h+" is not a duration.
- **dateModified on stories still binds `published-date`.** Head code cannot fall back from an empty field; the existing `tll-st3-owner-edit-v1` script already swaps in Last updated, and the tidy step covers the empty case.

## Real and SAMPLE

Everything on the page is real: the live JSON-LD (read Nov 12), CMS field names and option values (Oct 13 export and Worker code), and the values in the five filled examples: La Petite's Guide to New Orleans (Nancy Carleton), Torrevieja Street Food Market 2026 (Luke Luby), both layover guides and /faq. Two values are not read from the CMS directly and say so in `data.cjs`: Nancy's badge "Founder" comes from the Oct 13 export, and the two countries are the country of the byline place. Luke Luby's badge is left empty because none shows on his profile; that example shows the role being dropped. Nothing is labeled SAMPLE because nothing is invented. Moving guides have no pages or collection yet, so the FAQ template's Webflow view is marked "Coming soon". The /faq answers quoted in the code views include the live pet travel answer word for word.

## Putting it on the real site

TLL is Webflow plus site-layer scripts with a 15-script cap and no Tailwind (this page uses no Tailwind either).

1. Stories template, Page settings, Custom code, head: replace the `tll-article-ld-v2` block with the story template from `webflow-head-code.html`, keeping the id (the owner-edit script finds it by id). Insert each field with Webflow's field picker; it writes the binding and stores quotes as `&quot;`. The binding type names for the Number (`reading-time`) and Option (`contributor:badge`) fields are my best reading and the picker settles them.
2. Layovers template, same place: replace `tll-layover-ld-v1` with the layover template.
3. Replace inline `tll-ld-unescape-v1` with `tll-ld-unescape-v2` (`tidy.cjs` plus `TLLTidy.run(document)`) in both template heads. It is inline page code of about 2.5 KB, so it does not use one of the 15 site-layer scripts.
4. FAQ: no binding. Stories keep the Quick answers script. Moving guides use the same script when the collection exists.
5. Check a few published pages in validator.schema.org and the Article ones in Google's Rich Results Test.

## What Nancy decides

1. Whether to add the `founding-number` (Founding 01, 02, 03) as a Contributors field. Today it lives only in home page text, so the template can carry the `badge` option but not the number.
2. Whether Layovers gets a `published-date` field, or the guides stay without datePublished. (Google recommends it; nothing breaks without it.)
3. Which index the layover breadcrumb names: `/pillars/layover-guides` (today) or `/layovers` (both answer with their own canonical).
4. Whether to keep the FAQPage that story pages add from Quick answers, knowing it earns no snippet. My suggestion: keep it, it costs nothing and other engines read it.
5. Whether byline-location should be stored in title case rather than capitals.
