# Fix-pass verification B (items 2, 9, 10, 13, 14) · 12 Oct 2026

This pass was read-only. Nothing was written to Webflow. Sources: Data API through the Webflow MCP: element trees and queries, element settings, page and site freeform code, registered and applied scripts, page SEO metadata, and CMS items in Stories, Countries, Contributors and Pets.

Limits:
- The live site and cdn.prod.website-files.com are blocked from this container. The contents of registered hosted scripts could not be read.
- "Published" state cannot be told apart from staged Designer state.
- A `visibility:false` element is not in the published HTML, so it counts as hidden.

---

### Item 2: /for-expats (6a3e5c68993a0f9ad19ee39d) dead and empty elements (BLOCKER)

- **Status:** PARTLY FIXED. "Example text" is gone and the labels are connected. The flag link, the FIND button and the four placeholder desks are still broken. A further break was found: the finder reads markup that /travelers no longer publishes, so it can never show an expert.

**Evidence, part by part**

1. **ALL COUNTRIES BY FLAG**
   - Link `85a680e1-f94e-6fb7-908f-702fbc714713` with text "ALL COUNTRIES BY FLAG →" is set to `{"mode":"url","to":"/stories"}`.
   - It also carries a custom attribute `href="/stories"`, so the target appears twice. Still wrong.

2. **FIND button**
   - Link `048e09f7-4a3b-5237-8784-813e1195e9c2` ("FIND", attrs `data-tll-x=finder-go`, `role=button`) is set to `{"mode":"url","to":"#"}`.
   - The footer script `<script id="tll-expats-js-v1">` (page footer freeform code) catches the click with `e.preventDefault(); run(input.value)` and renders a result panel in place. So with JavaScript the button does something. Without JavaScript it is a dead "#".
   - The input `7770f451-970e-749c-ac0d-e625c12a125b` is a DOM `<input>` with no form. Its placeholder is set by the same script.

3. **Four placeholder desks.** Still present and visible. Each "CLAIM THIS DESK →" link points to `#tll-expert-apply`.

   | Desk wrapper | Eyebrow | H3 | Line | Claim link |
   |---|---|---|---|---|
   | `dc46d80e-55da-73c5-2752-d2f14cadd117` | PORTUGAL · DESK OPEN | Lisbon | "Which tram to skip, which pastelaria to defend." | `4c42a506-0080-cd82-2880-3a68eae9435d` |
   | `13591898-7280-d506-b55e-c7ccc7ea29ad` | GERMANY · DESK OPEN | Berlin | "The Späti economy, explained kindly." | `c93f9998-012a-e62b-0fb9-4cad30518648` |
   | `75e34864-a365-7f02-f5e1-895bd0684750` | SINGAPORE · DESK OPEN | Singapore | "A hawker center ranking, with receipts." | `5eaa5083-db90-a54a-d197-f8ab6e0631b3` |
   | `155da7be-a3a4-c62f-5580-717601f4c35f` | MEXICO · DESK OPEN | Mexico City | "Which colonia, which taquería, which hour." | `e8279e9b-124a-0bac-1009-43402bfa1240` |

   The H2 `dcbdfe29-38ca-105d-f15f-f4820a5b29c6` reads "The experts so far. Plenty of desks." The script would rewrite it if it found any experts. It never does (see part 6).

4. **"Example text":** 0 hits for "example", "lorem" or "Heading" on the page. Already fixed; the 9 Oct pass agrees. The DynamoEmpty strings `4d7cd252-…c354` and `4fb14406-…edf9` are empty and sit inside `[data-tll-x=finder-src]`, which the head CSS sets to `display:none`.

5. **Labels.** Already connected in Webflow data. I checked label `for` and input `domId` settings directly for the first row of each form; the rest come from the element tree, which mirrors `domId`.

   Location Expert application form:

   | Label element | Label text | `for` | Input element | Input id | Input name |
   |---|---|---|---|---|---|
   | `dddf0a0b-b9ec-ae3d-0bdf-bc6616448b35` | "Your name or pen name" | le-name | `…8b36` | le-name | name-or-pen-name |
   | `…8b39` | "Email" | le-email | `…8b3a` | le-email | email |
   | `…8b3d` | "City and country" | le-city | `…8b3e` | le-city | city-country |
   | `…8b41` | "How long you have lived there" | le-years | `…8b42` | le-years | years-there |
   | `…8b46` | "The local truth · one thing visitors always get wrong" | le-pitch | `…8b47` (textarea) | le-pitch | local-truth |
   | `…8b49` | "Where you already write (optional)" | le-links | `…8b4a` | le-links | published-links |
   | `…8b50` (wraps the checkbox) | "I am 16 or older and I have read the Editorial Charter. …" | implicit | `…8b4b` | `checkbox` (generic) | age-and-terms |

   Expat group form: each label wraps its input, which is a valid implicit association.

   | Label element | Label text | Input element | Input id |
   |---|---|---|---|
   | `88e25396-…0cf1` | GROUP NAME | `…0cf0` | xg-name |
   | `…0cf4` | CITY OR AREA | `…0cf3` | xg-area |
   | `…0cf7` | COUNTRY | `…0cf6` | xg-country |
   | `…0cfa` | WHERE IT LIVES (LINK) | `…0cf9` | xg-link |
   | `…0cfd` | YOUR EMAIL (NEVER SHOWN) | `…0cfc` | xg-email |
   | `…0d04` (checkbox) | "I run or co-run this group…" | `…0cff` | xg-check |

   The finder input `7770f451…` has no `<label>`. It has `aria-label="Find a country"`, which gives it an accessible name.

6. **New: the finder is blind.**
   - `loadTravelers()` in tll-expats-js-v1 fetches /travelers and reads `a.tll-spot-card[href^="/contributors/"]` plus `.tll-spot-card-base` with the regex `/,\s*([A-Z]{2})\s*$/`.
   - On /travelers the only `a.tll-spot-card` is the founder card `4b2435b2-491c-b36a-e754-cb1c76686ed5`. It sits inside section `4b2435b2-491c-b36a-e754-cb1c76686f15` (`tll-spotlight-section`), which has `visibility:false`. So it is not in the published HTML.
   - The visible founder card is now `a.tll-trav-card-dark` `74d49d23-00d0-e4f7-4f94-59f907d29e5d` (href /contributors/nancy-carleton). Its country is in the pill `ea45f992-…` (`title="Denmark, now"`, `data-tll-t="pill-dk"`).
   - Results for a logged-out visitor:
     - The quick chips are never built.
     - Every country shows "DESK OPEN".
     - The directory grid keeps the four static desks and the "See every traveler →" fallback `e4fadf18-e5f6-a85a-e1e6-ef45ad09224e`.
   - Every in-page anchor also depends on that script. `#tll-expert-apply` only exists because the script sets `apply.id`. The apply section `dddf0a0b-b9ec-ae3d-0bdf-bc6616448b5d` has no DOM id. Six links use that anchor: hero `673bd154-9ae2-1cb3-f8dc-0ee040756c19`, the four desk links, `3fe9d130-9975-1c21-5fb9-43ffe9e0ab50`, and bottom `9fb9e2b5-c453-7a9a-a512-33827431ea0f`. The groups anchor `#tll-groups` is fine: section `88e25396-…0d17` has DOM id tll-groups.

7. **Country filter on /travelers (6a0e0632ef1e4948167e827c): not supported.**
   - The search input is `b0d27320-b2c1-a9c8-454b-7a2c6d3b636a` (`id=tll-trav-q`, `name=q`, `data-tll-trav-search`).
   - It is driven by `<script id="tll-trav-search-js">` in the page footer freeform code. That script filters cards by text on `input` events and never reads `location.search`.
   - Its last line, `if(q.value)apply();`, means a pre-filled value would filter. Nothing fills it from the URL.
   - The founder card text includes "lives in Denmark" and "Denmark · now", so a text filter on a country name works once the value is passed in.

**Proposed fix (minimal)**

1. **Flag link `85a680e1-…4713`:**
   - `set_link` with linkType page and target 6a47adad7a97f26b91c7d78e (/destinations).
   - `remove_attribute` with `["href"]` to drop the duplicate custom href.
   - (/destinations had an `#atlas-all` anchor under B40. I did not verify it survives the S40 rebuild, so link the page itself.)
2. **FIND `048e09f7-…e9c2`:**
   - `set_link` with url `/travelers`. That is a no-JS fallback; the script still calls `preventDefault` and runs the finder in place.
   - Optional, for a real country hand-off: in the /travelers footer block `tll-trav-search-js`, add one line before `if(q.value)apply();`: `var p=new URLSearchParams(location.search);var v=p.get('country')||p.get('q');if(v)q.value=v;`
   - Then the finder can link to `/travelers?country=<name>`.
   - Alternative if Nancy prefers: hide FIND with `set_visibility false` and let Enter run the search.
3. **Desks:** `set_visibility false` on the four wrappers `dc46d80e…`, `13591898…`, `75e34864…` and `155da7be…`. This is reversible; `remove_element` if Nancy wants them deleted.
   - Keep the any-city card `3fe9d130…` ("Your city is not listed? Any city, any country. Claim it.").
   - Change H2 `dcbdfe29…` to "The experts so far. Plenty of room." With the desks gone, "desks" reads oddly. Or keep it, since the bottom CTA is "Claim your desk →".
4. **Anchor without JS:** `set_dom_id` static `tll-expert-apply` on section `dddf0a0b-b9ec-ae3d-0bdf-bc6616448b5d`.
5. **Finder selector (page footer freeform, tll-expats-js-v1):** change it to read the visible cards.
   - Selector: `a.tll-trav-card-dark[href^="/contributors/"]`.
   - Name: `.tll-trav-name`.
   - Country code: from the first `[data-tll-t^="pill-"]` whose parent `title` ends in ", now". Better still, the Directory `lives-in` field.
   - Without this change the result panel never shows Nancy as the Denmark expert.
6. **Labels:** nothing required. Optional: change the checkbox `…8b4b` DOM id from the generic `checkbox` to `le-age`.

**Who can do it**
- Parts 1 to 4: API now (unpublished edit).
- Part 5 and the /travelers line from part 2: page freeform code edits, so API now, but they change script behavior. Nancy decision: OK to edit tll-expats-js-v1 and tll-trav-search-js.

**What could break**
- The finder's `data-tll-x` hooks: leave the attributes alone.
- If the desks are removed rather than hidden, the CSS `[data-tll-x=desk]` simply goes unused.
- Changing FIND's href has no effect with JS, because `preventDefault` stays.
- The `?country=` value goes into an input, never into innerHTML, so it is safe.

---

### Item 9: "Currently in" becomes "Home base"; never show current location

- **Status:** PARTLY FIXED. The label on /edit-profile already reads "Home base". The Contributors template still outputs the `currently-in` CMS field in the HTML, hidden only by CSS. Nancy's CMS value is a live-location line.

**Every occurrence found**

| Where | Element / code | Text | Fed by | Visible? |
|---|---|---|---|---|
| Contributors Template 6a0b29c8a7b1840afe9390ab | Block `d3e97d53-cf59-1b67-61da-372c4f6820b3` (`data-tll-prof="meta"`) | bound text | CMS Contributors field **`currently-in`** (display "Currently In", id e0f41d4bc24e96bfbdf6e611a5c89201; help text says "Live location line under the name"). Value on nancy-carleton (6a0be79e01ee7eff10102ce9): **"Currently in Copenhagen, Denmark · filing weekly"**. The other 7 Contributors items (all drafts) are empty. | Hidden by CSS only: head block tll-pf3-profile-v1 sets `.tll-traveler-profile [data-tll-prof="meta"]{display:none !important}`. **Still in the page source** for crawlers, no-CSS readers and the HTML. |
| Contributors Template | String `467582ac-10a9-b0fc-edb2-36b3adb4997e` in paragraph `70cb4393-2904-ec38-1919-254b01ce11fe` | static "Currently in Copenhagen, Denmark · filing weekly" | static text | Not published: ancestor section `70cb4393-…1232` (old hero) is `visibility:false` |
| Contributors Template head | JSON-LD `homeLocation` | `{{wf path:"home-base"}}` | CMS `home-base` (display "Location") | Fine. This is the home base. |
| /travelers | String `c22b09f5-b2ae-f069-8ff6-b6c736d95f55` | "NOMADS · CURRENTLY ANYWHERE" | static | Not published: section `c22b09f5-…5fa8` (#full-crew) is `visibility:false` |
| /travelers founder card | String `4077a0c1-def2-904b-0eac-d35793ccadca` "Denmark · now", pill `ea45f992-65cd-08e5-7a02-fc3e76b92392` `title="Denmark, now"` | static | static | Visible. It says where she is "now" (borderline). |
| /travelers founder card | String `f1126ce5-1a67-97a5-37de-9a979a191772` | "Knows Copenhagen · abroad since 2018 · lives in Denmark" | static | Visible. Compliant with J15. |
| /edit-profile 6a0df371cd5b09ac504421ae | label String `63c6284b-3818-4de0-a4e4-f9b53f5147d4` | "Home base" | input `63c6284b-…47d6` writes Memberstack custom field **home-base** (`data-ms-member="home-base"`, untouched) | Already fixed |
| /profile 69d61469f421c777840c204e, /account 6a0d5c23c57426a9c563e8de | none | no "currently", "home base" or `data-ms-member*=home` elements | n/a | Clean |
| Page and site freeform code (all 52 pages + site head/footer) | none | No script writes "Currently in". The only hits are code comments: contributors head ("Currently In hidden on screen (J15)"). | n/a | Clean |
| Registered hosted scripts | tllpf3guardv1 (contributors), tll_account_stories_count, tllacctmodcounts, tllacctpetsv1, tllexportv1 (account) | CANNOT VERIFY. The CDN is blocked from here. The repo source `src/pages/profile/v3/pf3-guard.js` has no "currently". | | |

**Proposed fix**

1. `set_visibility false` on `d3e97d53-cf59-1b67-61da-372c4f6820b3`. This takes the field out of the published HTML, not just off screen. Keep the CMS binding and the `data-tll-prof` attribute so pf3 JS still finds its siblings. API now (unpublished edit).
2. CMS: clear `currently-in` on nancy-carleton (`update_collection_items` on 6a0b29c7a7b1840afe9390a5 with item 6a0be79e01ee7eff10102ce9 and `{"currently-in": ""}`).
   - Optionally use `update_collection_field` on e0f41d4bc24e96bfbdf6e611a5c89201 to set the display name to "Home base (unused)" and the help text to "Not shown anywhere. Location lives in Location (home-base)."
   - The field slug stays. Nancy decision: S37 lists "Currently In" as waiting on her.
3. /travelers: change String `4077a0c1-…cadca` to "Denmark · home". Pill `ea45f992-…` `title` from "Denmark, now" to "Denmark, home base". API now (unpublished edit). The finder fix in Item 2, part 5, keys off this title; keep the two in step.
4. The hidden legacy strings `467582ac…` and `c22b09f5-…5f55` are unpublished. Optional cleanup: `remove_element`.

- **Who can do it:** steps 1, 3 and 4: API now. Step 2: Nancy decision (her CMS line).
- **What could break:** pf3 JS composes the mono line from sibling blocks. Hiding `d3e97d53` (already `display:none`) changes nothing on screen. No data-ms-* attribute is touched.

---

### Item 10: /share-photos (6a0dfca3f9fa5b751d154257) EXIF GPS

- **Status:** STILL BROKEN. No upload path strips anything. The page promises stripping it does not do. This item comes down to a list of options for Nancy.

**Evidence**

- **The form is a plain Webflow form**, not Uploadcare, Memberstack or Webflow's File Upload element.
  - FormForm `c09ceb51-0ee9-0a93-6196-eee626758710` ("Html Form", method `get`, attributes `enctype=multipart/form-data`, `data-tll-form=share-photos`, `data-ms-member-bound=true`).
  - The file field is a FormTextInput with `inputType: "file"`: element `c09ceb51-0ee9-0a93-6196-eee626758687`, `id=photos-upload`, `name=photos`, `accept=image/*`, `multiple`.
- **No processing code anywhere.**
  - Page code is only `<meta name="robots" content="noindex, follow">` and the `tll-form-fix` CSS.
  - The only page script is `tllgateflashv1`.
  - No site or page code mentions exif, canvas, `toBlob` or uploadcare.
  - The site footer only styles `input[type=file]`.
- **Files probably never arrive.** Webflow's form handler does not send file bytes from a plain file input; only the native File Upload element does that. So the photos most likely never reach TLL at all. This needs a live test submission to confirm.
- **False promises on the page:**
  - String `c09ceb51-0ee9-0a93-6196-eee62675867d`: "Up to 12 at a time. JPG or WebP. We strip EXIF if you pick anonymous."
  - Radio label String `c09ceb51-0ee9-0a93-6196-eee6267586d9`: "Anonymous Traveler (EXIF stripped, off the map)"
  - Same kind of claim in the share layer: repo source `src/site-layers/tll-share-v1.js` line 333, "Photo location data is stripped on upload." Per STATUS G09 and S03 this bundle is loaded on /the-map and /account.

**Options (for Nancy)**

| Option | What it does | Notes |
|---|---|---|
| **A. Client-side re-encode (canvas)** | Before submit, draw each image to a canvas and export JPEG or WebP with `toBlob`. All EXIF, including GPS, is dropped for named and anonymous uploads alike. | No third party. It needs an upload target that actually receives the files: either the Webflow File Upload element (paid form plan, ≤10 MB per file, single file per field) or a Worker. Rotation has to be applied first. HEIC decodes only in Safari. It is a new script, so it needs Nancy's OK. |
| **B. Uploadcare widget** | Uploadcare uploader with metadata stripping. The CDN operation is `-/strip_meta/all/` (or `sensitive`, which removes GPS and camera serials); a project-level setting may also exist. | Needs an Uploadcare account and key (Nancy click). Replaces the file input. The originals stay in Uploadcare storage with EXIF unless processed or delivered via the stripped URL. |
| **C. Worker upload + Cloudflare Images** | Post the files to the existing Worker (tll-travel-wire), store them in R2, and deliver via Cloudflare Images or Image Resizing with `metadata=none`. | Server-side, so it covers every path. The existing Worker would need a new route and secrets (Nancy click plus deploy). |
| **D. Interim, process only** | The editor strips location before anything is published, for example `exiftool -gps:all= -xmp:geotag= file.jpg` or "Remove location" in the macOS Photos export. Change the copy so it promises only what happens. | No code. Proposed lines, Nancy decision: `…867d` "Up to 12 at a time. JPG or WebP. The editor removes location data from every photo before it goes up." and `…86d9` "Anonymous Traveler (no name, off the map)". |

- **Who can do it:** Nancy decision on the option. Option D's copy change is then API now (unpublished edit).
- **What could break:** A replaces the file input, which is wrapped in label `c09ceb51-…8688` (the drop zone). Keep the `data-ms-member-bound` attribute untouched.

---

### Item 13: Banned-word sweep, site-wide

- **Status:** STILL BROKEN. There are hits on 13 static pages, 2 templates, 3 page-code blocks, 1 site-code block, 3 page SEO entries, and in CMS. The nav (TLL Nav v1) and footer (TLL Site Footer) components are clean.

**Coverage and limits**
- `query_elements` text filter on all 49 non-template pages (incl. home) plus the Contributors and Stories templates. The Countries template query was rate-limited; see the note at the end.
- Freeform head and footer code on all 52 pages, plus the site head and footer.
- The visible home embeds' code (19 HtmlEmbeds).
- Page SEO and OG for all 78 pages.
- CMS: all 46 Stories, 197 Countries, 8 Contributors and 1 Pet.
- Registered hosted scripts could not be read: the CDN is blocked here. Notably tll_saved_shelf ("TLL Saved Shelf") and tll_ledger_sync are applied site-wide and may write text.
- Matches on relationship, membership, partnership(s), sponsorship, ownership and "by hand" (without "counted") were excluded.

**Static page elements and SEO.** All are "API now (unpublished edit)" unless marked otherwise. The API action for strings is `set_text` on the parent text element. For SEO it is `update_page_settings`.

| # | Page | Element | Exact text now | Proposed line |
|---|---|---|---|---|
| 1 | /travelers 6a0e0632… | `38cbeefd-f7cc-47c4-ff8d-c400118dd042` | "Free to join, free to publish, free to keep on the road. We add your Traveler card the moment your first story ships." | "…We add your Traveler card the moment your first story goes live." |
| 2 | /terms 6a0f0856… | `4e4398cb-11a5-1301-9a55-4ae0580f0143` | "Stories generated by AI (Claude, ChatGPT, Gemini, Midjourney). The byline is human or it doesn't ship." | "…The byline is human or it doesn't run." **Nancy decision (legal wording)** |
| 3 | /spotlight 6a0e9c71… | `c03cefd4-b465-c61d-e4e5-30e4522894ed` | "One traveler featured at a time. Stories boosted, links shipped, byline up top." | "One traveler featured at a time. Stories boosted, links shared, byline up top." |
| 3b | /spotlight page SEO | seo.description | "One traveler, front and center, every week. Stories boosted, links shipped, byline up top. Exposure is the currency, and TLL spends it generously." | same with "links shared" |
| 3c | /spotlight page OG | openGraph.description | "One traveler featured at a time. Stories boosted, links shipped, byline up top." | "…links shared…" |
| 4 | /spotlight | `33c1ae67-363c-3e76-2dcd-ba0367b73729` | "American expat in Copenhagen with 87 countries on the ledger. Travels with Magnus 🐻‍❄️ Waffles, a Samoyed of strong opinions." | "American expat in Copenhagen with 87 countries on the map. Travels with Magnus 🐻‍❄️ Waffles, a Samoyed of strong opinions." (The 87 is typed, not read from tllStates; that belongs to another item.) |
| 5 | Home 69d6145d… | `aa171515-0f50-d0b2-f5a3-7112b2da5635` | "TLL is being written in public. Your byline stays yours, your photos stay credited, and a real person reads every word before it ships." | "…and a real person reads every word before it goes up." |
| 6 | Home | `300047e7-de75-7f9c-7045-af42c0caff6a` | "Real places, real opinions, real names. Shared by people who went." | "Real places, real opinions, real bylines. Shared by people who went." |
| 7 | Home | `e646451a-68a7-b183-3a52-6da4762de1e6` | "Already on the shelf · Explore the stories" | "Already filed · Explore the stories" |
| 8 | Home | `9c10ff57-6eaf-8454-a70a-39e2092f0373` | "One writer so far. Room on the shelf for " (sentence continues in the next node) | "One writer so far. Room in the library for " |
| 9 | Home HtmlEmbed `94ce12c0-56fc-4b10-fa9f-14da000634c7` (code) | eyebrow | "Chapter 01 · Already on the shelf" | "Chapter 01 · Already filed" |
| 9b | same embed | H2 `#h3-shelf-t` | "The shelf." | "The stories." |
| 9c | same embed, markup and h3-shelf-js | hint | "Keep scrolling, the shelf moves sideways" and "Swipe, the shelf moves sideways" | "Keep scrolling, the stories move sideways" and "Swipe, the stories move sideways" |
| 9d | same embed | aria-label | "Filter the shelf by pillar" | "Filter the stories by pillar" |
| 10 | Home HtmlEmbed `8d306efc-d927-7aa8-0a61-dda177a79aae` | figcaption | "From the shelf · Brazil" | "From the stories · Brazil" |
| 11 | /about 6a0e05a2… | `aa3fb94c-49fc-beb3-9d5f-5d23820fde37` | "87, counted by hand" | "87, each one logged" |
| 12 | /about | `fd48f043-654d-b49b-bcbb-3ebe3ef070b5` | "Countries, counted by hand" | "Countries, each one logged" |
| 13 | /stories 69d61469…204d | `cc25e31b-2507-bf47-8b86-5e9bc92546ff` and `769ed083-dc6d-d488-c3c5-4877002ec6d5` | "Counted by hand in Copenhagen. More landing weekly." | "Logged in Copenhagen. More landing weekly." |
| 14 | /stories | `6b8749f3-2560-6665-99ed-9b01d8ce6ccc` | "Search the shelf" | "Search the stories" |
| 15 | /stories | `6b8749f3-…6cd4` | "Searching the shelf." | "Searching the stories." |
| 16 | /stories | `6b8749f3-…6cd7` | "That search did not run. Try the word again, or browse the shelf below." | "That search did not run. Try the word again, or browse the stories below." |
| 17 | /stories | `9a9eddff-e1b9-aa23-7b52-8f79574a0565` | "Front of the shelf" (section hidden per S33) | "Most read" |
| 18 | /stories | `b88528ee-4663-9ad1-b354-b62698ab258d` | "Open slot. The read counter is not wired yet, and we do not guess. Until it is, the newest stories sit at the top of the shelf." | "…Until it is, the newest stories sit at the top." |
| 19 | /stories | `43ed9711-cfab-25ae-d6fb-310c8eacf75f` | "Nothing on the shelf yet. Be the first to file a story." | "No stories here yet. Be the first to file one." |
| 20 | /copenhagen-stopover 6abbdbba… | `7887ab5d-1ab1-fac5-1ac9-cb0bc1cb0f24` | "THE LEDGER" | "THE RECEIPTS" (matches the story template, S34) |
| 21 | /ees-etias-layover 6abbdbbb… | `7f7414e4-d299-8e6d-ee11-7235276fc698` | "THE LEDGER" | "THE RECEIPTS" |
| 22 | /editorial-charter 6a47b432… | `e8b5c39b-c7af-4148-a2b8-8e0d05500132` | "…The story ledger's Disclosure row says the same thing." | "…The Disclosure row in the story's receipts says the same thing." (Policy page; Nancy may want to see it.) |
| 23 | /edit-profile 6a0df371… | `8c71633c-aee4-586a-b3b4-b12249948783` | "Trip Ledger · drives your map" | "Your trips · drives your map" |
| 24 | /submit 6a0d5e5e… | `db792b8d-0563-5847-6bab-bf221a701e8c` | "The full story lives on TLL. Photos, route, ledger, the works." | "The full story lives on TLL. Photos, route, receipts, the works." |
| 25 | /submit | `e3fa17a2-adfd-42ef-da55-6b45cc4a6b58` | "Your call. Tick what readers may see in the story ledger. Untick and the ledger stays quiet about it." | "Your call. Tick what readers may see in the story's receipts. Untick and the receipts stay quiet about it." |
| 26 | /the-paw-passport 6a3e5e3e… | `6e3b1e70-3e41-8d96-8239-78908f34a834` | "Coming soon · the Ko-fi link goes live when the guide ships" | "Coming soon · the Ko-fi link goes live when the guide is out" |
| 27 | /for-expats | `dddf0a0b-b9ec-ae3d-0bdf-bc6616448b32` | "…Your first story lands on the Stories shelf under From the Location Experts." | "…Your first story runs in Stories under From the Location Experts." |
| 28 | /account page SEO and OG 6a0d5c23… | seo.description, og.title, og.description | "…The shelf inside the library that is yours." / "Your TLL account · The shelf that's yours" / "…The library has a shelf for you." | "…Your corner of the library." / "Your TLL account · Your corner of the library" / "…The library keeps a corner for you." |
| 29 | Bookmarks template SEO and OG 6a0cbdad… | seo.description, og.title | "…The shelf inside your account where the road notes wait…" / "Your TLL bookmarks · The shelf that's yours" | "…The corner of your account where the road notes wait…" / "Your TLL bookmarks · Saved for later" |
| 30 | Stories template 6a0b29ee… | `c6e74446-6eb6-9387-bd3e-583cdd32d229` | "More stories are on their way to the shelf." | "More stories are on their way." **Must change together with code row C4.** |
| 31 | Stories template | `b3f20463-8f3d-49ca-a90a-21b9b02aed19` | "The country counts ledger" (inside the typed card that S34 hides) | "The country count" or leave hidden |
| 32 | Contributors template 6a0b29c8… | `a83eaf6e-d9df-dafa-4714-d931180b8d2d` | "…On a Google Sheet that Jay calls the Trip Ledger." | **Nancy decision** (her bio; "Trip Ledger" is Jay's name for the sheet). Option: "…On a Google Sheet Jay keeps like scripture." |

**Borderline "your shelf".** "the shelf" / "on the shelf" is not literally present in these; I recommend changing them anyway for consistency. API now.

| Page | Element | Text |
|---|---|---|
| /account | `148fc877-086d-5622-a83d-de293c9a76b8` | "Your shelf inside the library. Saved stories, your submissions, your map, your pets. All here." |
| /account | `148fc877-…7743` | "Your shelf is " |
| /profile | `3546d9b1-c283-bfa2-1314-a6fa0162bc82` | "Your shelf inside the library. …" |
| /profile | `3546d9b1-…bc88` | "This shelf is " |
| /profile | page SEO description | "…Your shelf inside the library." |
| /login | `3c16a77a-1fef-8a9d-3984-ec13fe40ffc2` | "Welcome back. Taking you to your shelf." Proposed: "Welcome back. Taking you to your account." |
| /signup | `d8aa44e7-c49a-d2c7-7ab8-f5d9fb2ef88d` | "Welcome aboard. Check your inbox to confirm, then come find your shelf." Proposed: "…then come find your corner of the library." |
| /submit | `410fe31c-0208-fa02-297c-3b2122ab7d3a` | "…Your draft stays on your shelf either way." Proposed: "…Your draft stays in your account either way." |

**Code that writes visible text.** All are freeform code blocks: API now (unpublished edit), with Nancy's OK to edit scripts.

| # | Where | Block | Text now | Proposed |
|---|---|---|---|---|
| C1 | Site footer freeform | `<script id="tll-core-v2">`, `ledger()` (runs on /edit-profile) | "Log a place to your Trip Ledger" / "Add to ledger →" / "Logged. N place(s) on your ledger." | "Log a place" / "Log it →" / "Logged. N place(s) saved." |
| C2 | /stories footer | `<script id="tll-lib-chips-v1">` | "Nothing on the shelf for '+place+' yet." | "No stories from '+place+' yet." |
| C3 | /stories footer | `<script id="tll-s3-stories-js-v1">` | "Nothing on the shelf for “…” yet." | "No stories match “…” yet." |
| C4 | Stories template footer | first `<script>` block, the "Keep reading fallback" (line 67 onward) | matcher `/on their way to the shelf/` | Change it to `/on their way/` in the same edit as row 30, or the fallback stops finding its list. |

Also checked and not visible: the matchers in the site head, which test `on the shelf` inside a count regex. They keep working; consider adding the new wording to them. The home and /my-passport footers match `countries, counted by hand`. No element on either page carries that text, so the regex is already dead. Changing row 11 or 12 breaks nothing.

**CMS findings**

| Collection / item | Field | Text | Proposal / owner |
|---|---|---|---|
| Stories `6a175109bd13b9a306f5fb94` sofia-88-bulgaria-plum-brandy (draft) | seo-description | "Country #88 on the ledger." | "Country #88 on the map." Fix before it publishes. API now. |
| Stories `6a175109bd13b9a306f5fb94`, `6a16a048ddcf8666bf6eaf34` yamanote, `6a0d44ca5133ed0ecea08d33` hibiscus, `6a0d44ca5133ed0ecea08d30` magnus-refuses-goats (all drafts) | links-and-mentions | "Nancy Carleton · the full ledger" | "Nancy Carleton · every country so far". API now (drafts). |
| Stories `6a0d44ca5133ed0ecea08d33`, `6a0d44ca5133ed0ecea08d30`, `6a0cc5157e83888edcfbbf23` (drafts) | body, hashtag-set, short-version | "The Trip Ledger updates…", "#TravelLedger", "Bulgaria was country 88 on the Trip Ledger…" | **Nancy decision** (story bodies) |
| Contributors `6a0be79e01ee7eff10102ce9` nancy-carleton | bio-long | "On a Google Sheet that Jay calls the Trip Ledger." | **Nancy decision** (same as row 32) |
| Stories `6acc9dd1901463fb94a531b9` aruba-curacao-dushi-detour (published) | body, featured-pull-quote, short-version | "So the ship left." / "When a ship needs to get into the harbor…" / "…the ship itself was patched and sailed to Baltimore…" | **Nancy decision (story text).** "ship" here means a vessel. Recommend keeping it; alternatively "boat" or "tanker". |
| Stories `6a3503d2b838e59a94bfab88` antarctica-marathon (published) | body, quick-answers | "10 aboard the ship", "our own ship friends", "on the ship", "new ship", "board the same ship" | **Nancy decision**; vessel, recommend keep |
| Stories `6a0d44ca5133ed0ecea08d30` magnus-refuses-goats (draft) | body | "cruise ship" ×5 | **Nancy decision**; vessel |
| Stories `6ab138253d416b48c2a12304` scandinavia (draft) | body | "Viking Ship Museum" | Proper noun. Keep. |
| Stories `6a96a65a420f652aaea264a1` patagonia | notes-to-editor (internal, not rendered) | "Ship this one first…" | No action (internal) |

Countries (197 items) and Pets (1 item): 0 hits.

- **What could break:**
  - The home shelf embed: change text only. Keep the `h3-shelf*` classes and data attributes, which h3-shelf-js uses.
  - Rows 30 and C4 must ship together.
  - "THE RECEIPTS" on the guides: the `[data-tll-gd=ledger]` CSS hook stays.

Note: the Countries template text query was rate-limited (429). Its CMS items are clean; the static text was not swept.

---

### Item 14: "Sao Paulo" to "São Paulo"

- **Status:** STILL BROKEN on the Pantanal meta description. Everything else visible is already "São Paulo".

**Evidence**
- Stories item **`6ac869cbead7f028cee5bcba`** (pantanal-glimmers-in-the-wild, published; lastPublished 2026-10-09). Field **`seo-description`** (field id d062ed622a0c59893b12a245124882b9) reads: "A self-driven trip from Sao Paulo to the Pantanal: 147 km of the Transpantaneira and its 120 wooden bridges, why Porto Jofre's jaguars let you watch them, and what going without a guide actually gets you."
  - The same item's body, short-version and quick-answers already say "São Paulo".
- **Other untilded instances:**
  - Stories `6a3503d2b838e59a94bfab7a` "brazil" (**draft**): pull-quote "Sao Paulo taught me something I did not know I was missing, which is the ability to be in the place where I actually am." and byline-location "SAO PAULO".
  - Stories `6ab3fd224172c39c5a9bb87c` northern-brazil-sequins-to-sloths: notes-to-editor (internal only, not rendered) "…the Sao Paulo residency context was added…".
  - /destinations head script alias key `'sao paulo':'br'` is a normalized search key. Correct as is; keep it.
- **Clean:** all 197 Countries items, static text on all non-template pages, and all 78 pages' SEO and OG.

**Proposed fix**
- `update_collection_items` on Stories 6a0b29eddc14f1444e935760, item `6ac869cbead7f028cee5bcba`, fieldData `{"seo-description": "A self-driven trip from São Paulo to the Pantanal: 147 km of the Transpantaneira and its 120 wooden bridges, why Porto Jofre's jaguars let you watch them, and what going without a guide actually gets you."}`.
- Leave `isDraft` out of the request, so the item stays live and the change waits for Nancy's publish.
- Optional, same call pattern, for the draft "brazil" item: pull-quote "São Paulo taught me…" and byline-location "SÃO PAULO, BRAZIL", matching the NFL story's format.

- **Who can do it:** API now (unpublished edit). The draft "brazil" pull-quote is her story text: Nancy decision, trivial.
- **What could break:** nothing. The meta description is 204 characters, the same length as before.
