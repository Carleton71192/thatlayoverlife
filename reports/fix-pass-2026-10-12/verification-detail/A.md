# Verification A: items 1, 3, 8, 11, 12 (12 Oct 2026)

Read-only. I made no Webflow writes. Everything below comes from the Webflow Data/Designer API: element trees, element settings, page code, schema markup, page metadata and CMS items. The live site was not loaded, so "live" claims (for example "404 live" or "3 on home") are inferred from the data.

Site 69d6145cf421c777840c1e25. Session ses_3KaiC3Xp5d6a2qFO2SGFwaI1oRW.

---

### Item 1: /destinations links to /detail_countries and /detail_stories (BLOCKER)
- **Status:** STAGED (unpublished) on the script side. **STILL BROKEN** in the raw link bindings.
- **Evidence** (page 6a47adad7a97f26b91c7d78e):
  - **Story card link** `37e35a86-a5b1-0ba2-1c7f-3cfd758054f6`. It sits inside the Stories collection list `a6c7bb60-…ea688`, which has `data-ds3="shelf"`.
    - Raw `link` = `{"mode":"collectionPage","to":{"pageSlug":"detail_stories"}}`.
    - Attributes: `data-ds3="card"` and `data-ds3-slug` bound to CMS Stories › Slug (field `d4a7d554aa019bec407651fa5cf642a7`). The staged attribute is present.
  - **Tile link, atlas list 1** `02ac7fa8-bfa6-ff88-195c-71dac771ad1d`, in list `a634b5e3-…5396d` (`data-ds3-part="1"`).
    - Raw `link` = `{"mode":"collectionPage","to":{"pageSlug":"detail_countries"}}`.
    - `data-ds3-slug` is bound to Countries › Slug (`c4c09b0645d48e534a525a2c72bcc11f`). `data-ds3-iso` is bound to ISO2 (`d6aa42be…`).
  - **Tile link, atlas list 2** `d363da1c-9c97-91b4-bbed-037bddd021ef`, in list `def2282e-…ae542` (`data-ds3-part="2"`). Its link and bindings are identical to the list 1 tile.
  - **Head code.** `tll-ds3-destinations-js-v1` is a freeform `<script>` block in the page head (22,425 chars). It is not a registered script, and `get_page_scripts` returns 404 (no page scripts are applied). The block contains:
    `function links(){$$('[data-ds3=card][data-ds3-slug],[data-ds3=tile][data-ds3-slug]').forEach(function(a){var sl=(a.getAttribute('data-ds3-slug')||'').trim(),h=a.getAttribute('href')||'';if(!sl||(h&&h!=='#'&&h.indexOf('/detail_')<0))return;a.setAttribute('href',(a.getAttribute('data-ds3')==='card'?'/stories/':'/countries/')+encodeURIComponent(sl));});}`
    `boot()` calls `try{links();}catch(e){}` first and only then runs `shelf()`/`atlas()`/ItemList. The order is correct.
  - **Can the API bind "Current item"?**
    - `get_bindable_sources` with `value_type: link` returns **0 matches** for the card and the tile. The only link-capable CMS sources are URL fields (Audio version URL, External URL), so a field binding cannot do it.
    - However, the links that already work on the **Countries Template** (6a8afbda8e907b41c4da10a1) store a different value. `tllcf-card` links `63506e42-95da-9f95-558d-448b4ae3ca4c`, `ab3a82da-de7b-dd30-3a39-ea17907d204f` and `d10ca4d5-948f-9d88-9ecd-c9b83765d4f6` store `{"mode":"collectionPage"}` with **no `to`**. The Stories Template related card `963290e8-1279-01d7-0bfb-7a59eeb22182` stores the same.
    - The /destinations links store `to.pageSlug = detail_*`, which renders the template path. The no-`to` form looks like the "Current item" binding.
    - `set_settings` accepts `static_link {mode:"collectionPage"}` with `to` optional. So an API rebind is probably possible, but I could not test it under the read-only rules.
  - **Other pages:**
    - Home (69d6145df421c777840c1e46): 0 `detail_` strings in 25 Link elements, 24 HtmlEmbeds and head/footer code.
    - /countries (6a8b07db18f836c65f4a3dfe): 5 links, all plain URLs.
    - Countries template: no `detail_`. Its 3 card links use the no-`to` form.
    - Stories template (6a0b29eedc14f1444e935766): no `detail_`. The related card uses the no-`to` form.
    - Footer and nav components: none.
- **Proposed fix:**
  - (a) Try the API first. On page 6a47adad…, run `data_element_settings_tool > set_settings` on each of the 3 links with `key:"link", static_link:{mode:"collectionPage"}` and no `to`. Then re-read with `get_settings all_raw_settings` and confirm the value equals `{"mode":"collectionPage"}`, the same as the working Countries-template cards.
  - (b) If the API rejects that or still stores a pageSlug, Nancy rebinds the 3 links in the Designer, as on the afternoon list. Keep `links()` either way as a fallback.
- **Who can do it:** "API now (unpublished edit)", needs a one-element trial on the card first. Otherwise "Nancy in Designer: open /destinations, select each of the 3 links, set Link settings to Current Stories item (card) or Current Countries item (both tiles)."
- **What could break:**
  - If the API stores `{mode:"collectionPage"}` but the published HTML still points at a template, nothing changes, and `links()` still covers the click.
  - A wrong binding would send every card to one story. Check 2 or 3 cards in the Designer preview before publishing.
  - The ItemList JSON-LD reads hrefs after `links()` runs, so it is unaffected.

### Item 3: href="#" on home and /support, disabled guide button on /the-paw-passport (BLOCKER)
- **Status:** PARTLY FIXED / STAGED. The Paw Passport button and its note are hidden (staged). **The /support Ko-fi buttons are STILL BROKEN** (still visible, link `#`). The 3 "#" on home do not appear in the page data.
- **Evidence:**
  - **Home 69d6145df421c777840c1e46:**
    - All 25 Link elements have real URLs.
    - I searched all 24 HtmlEmbed codes and found no `href="#"` or empty href.
    - Home head/footer code: no `href="#"`.
    - The only `#` link is in the **TLL Site Footer component**: Link `710ff458-c06e-d602-a663-e5e88ca145bb`, attrs `data-tll-cookie-prefs="1" href="#"`, text "Cookie preferences". This is intentional: the site footer `wire()` binds it to `CookieConsent.showPreferences()`.
    - Site code also turns `javascript:` copy/cookie links into `#` at runtime (site footer). The skip link becomes `'#'+main.id`, which is not a bare `#`.
    - I cannot reproduce the "3 on home" count from data. It probably predates Home 3.0 (published 10 Oct). Re-crawl after publish.
  - **/support 6a0e960f7a8024d33df17e83**, in section `cea26fb8-84f8-b723-60ee-aa27dd214135` (`id="layover-club"`, `data-tll-club="section"`). Page elements, not a component or embed:
    - Link `0744a87c-eb66-1948-6b65-9af97b63293c`, text "Join on Ko-fi". Raw `link {"mode":"url","to":"#"}`, attrs `data-tll-club="join" aria-disabled="true"`. visibility true.
    - Link `d46a4f20-be52-207e-7487-7fcc898cf6f4`, text "Or just leave a tip". `link {"mode":"url","to":"#"}`, attrs `data-tll-club="tip" aria-disabled="true"`. visibility true.
    - Their parent is the ctas block `70c0e0e3-79bf-a803-4beb-9ce5281eac64` (`data-tll-club="ctas"`).
    - Related Ko-fi copy that is still visible:
      - Heading `6d7eae95-8f9d-bd64-d2c3-cf4575eee65f` (`data-tll-club="soon"`): "Coming soon · goes live with the Ko-fi page".
      - Paragraph `a300cf12-4307-daed-3759-c636f1a389e9` (`data-tll-club="note"`): "Cancel in one click on Ko-fi. Yearly members get a reminder email a week before renewal, not a surprise. Prices include Danish moms."
      - Heading `ef988351-d8c1-de2b-77a2-e9d07d51c39e` (`data-tll-club="price"`): "Price TBC · USD 3 to 5 a month, or yearly".
    - The page head CSS comment still says "Ko-fi buttons stay disabled until Nancy sends the Ko-fi link".
    - The other 6 support cards are mailto links. Footer component: cookie `#` (intentional). That accounts for 3 of the reported 5. The other 2 are not in the data (likely runtime or crawl artifacts).
    - Note: the API tree output **omits** `link` when it is `{mode:url,to:"#"}`. Use `get_settings` to see it.
  - **/the-paw-passport 6a3e5e3ed36c8c6a1df1d12e**. Guide section `877803f6-6c20-ebac-1351-298f1311a67a` (`id="guide"`), paid card `d54a3eb2-414b-b1be-b6e9-089b9039ee8c`:
    - Ko-fi button Block `89499c2b-3a7e-bc05-5bd4-14612ea0dc80` ("Get it on Ko-fi"; div, `role=button`, `aria-disabled`). **visibility false**, already staged hidden.
    - Note `6e3b1e70-3e41-8d96-8239-78908f34a833`: "Coming soon · the Ko-fi link goes live when the guide ships". **visibility false**, already staged hidden.
    - Free-story link `93e63429-e565-c0a5-fa20-f45b94e09d37`: visibility false.
    - **Still visible:**
      - Price `3e8ba920-6a74-de48-4a7b-84116c125cf5` (`data-tll-t="price"`): "€9".
      - Meta `99bfa206-2dd7-8ad6-96da-b91bc4a5367c`: "PDF · V1.0 · INCL. 25% MOMS · FREE UPDATES WHEN THE RULES CHANGE".
      - Fine print `61fd4512-494f-98d1-a0b3-56aaab540d62`: "…we reissue it to everyone who bought it."
      - The whole paid card and its "In the guide" checklist.
    - The empty section `3e165852-15be-2798-e749-f8a4694d54a3` is hidden.
  - **Other €9 mention:** /copenhagen-stopover Paragraph `7887ab5d-1ab1-fac5-1ac9-cb0bc1cb0f48` ("The Paw Passport guide covers the order of operations. €9."). The page is draft, see item 11.
  - **Ko-fi elsewhere:**
    - /faq: 0 Ko-fi elements, no embeds, head code 62 chars.
    - /for-affiliates (6a3e5c69e76442d430914f64): 0 Ko-fi, 0 embeds, 5 real links.
    - /for-brands (6abbd8cec872cf76da1d1e59): 0 Ko-fi, 0 embeds, 4 real links.
    - Side note: /for-brands links `12a1ba01-…fe81e` and `…fe849`, and the footer "How paid work works" `bca670be-…902b`, point to `/editorial-charter#rule-08`, but STATUS S17 says rule 08 was removed. Check that anchor.
- **Proposed fix** (remove or hide, per plan). Use `data_element_settings_tool > set_settings` with `key:"visibility", static_boolean:false`:
  - /support: either hide the CTA block `70c0e0e3-…ac64` (both Ko-fi buttons), the "soon" heading `6d7eae95-…e65f`, the note `a300cf12-…89e9` and the price `ef988351-…c39e`, **or** hide the whole club section `cea26fb8-…4135`. The second option is simplest, but the footer link "The Layover Club" (`/support#layover-club`) would then land on nothing, so hiding the inner elements is preferred.
  - /the-paw-passport: hide price `3e8ba920-…cf5`, price meta `99bfa206-…67c` and fine print `61fd4512-…d62`, or hide the paid card `d54a3eb2-…e8c` entirely. If the paid card goes, the intro `1f04f74e-…fb9b` ("…is the part you pay for.") also needs a decision.
  - Remove "€9." from `7887ab5d-…0f47` with `set_text` when the guide pages are rebuilt.
- **Who can do it:** "API now (unpublished edit)". Wording changes to the Paw intro need "Nancy decision needed: keep a no-price teaser or drop the paid card".
- **What could break:**
  - Hiding the paid card collapses the 2-column `tll-guide-grid`. Check the layout.
  - The footer "The Layover Club" anchor must still land on something.
  - Webflow hidden elements are not rendered, so the `aria-disabled` styling CSS becomes dead code, which is harmless.

### Item 8: Story template hidden "This story was hosted" and "AD SLOT" text
- **Status:** STILL BROKEN. Both blocks are rendered into every story's HTML and hidden only client-side.
- **Evidence** (Stories Template 6a0b29eedc14f1444e935766):
  - **Hosted box:**
    - Block `578a8d42-a1d9-927f-99ea-09feb9ccf136` (`.tll-sponsored`), Webflow **visibility true**, attrs `data-tll-sponsored="1"` and `hidden="hidden"`. It is inside the article `f95e9631-…dd58d`.
    - Children: badge `28238a07-0306-f73d-632f-f5108fc483c8` "Sponsored", and text block `651cb6b7-b374-be93-baac-e79dfcef45ed` (`data-tll-sponsored-text`).
    - The text is the String `651cb6b7-…45ee`: "This story was hosted. The travel was paid for by the host; the opinions were not. Disclosed at the top, never buried. That is the charter."
    - Story head CSS `[data-tll-sponsored][hidden]{display:none !important}` hides it. The story head script `sponsored()` removes `hidden` only when the ledger element `[data-tll-lg="disclosure"]` (`ba931cb9-e883-b5fb-87ea-ffde634c826c`, text bound to Stories › **Disclosure** `d53eb828334c7f7193210aa048ae9cf7`, PlainText) matches `/^hosted\s*(?:by|:)?\s*(.+)$/i`.
    - There is no Designer conditional visibility. The visibility value is plain `true`, and conditional rules are not readable through this API.
  - **Ad slot:**
    - Aside `e1115818-ce30-8ff9-f009-7ec084cb65c4` (`id="tll-ad-slot-story"`, `data-tll-ad-slot="story-mid"`, `data-tll-content="non-members"`), **visibility true**. It is hidden only by story head CSS `#tll-ad-slot-story,[data-tll-ad-slot]{display:none !important}` ("AdSense OFF until reader threshold").
    - Its rendered text: String `c4b5a86f-a822-ba84-ec36-075d18180ee5` "AD SLOT · IN-ARTICLE" (inside `c4b5a86f-…0eea`, `data-tll-reserved-ad="1"`), and String `c4b5a86f-…0ee8` "Trip photo for now. Reserved; off until the reader threshold."
    - The inner partner card `e1115818-…65c2` is already visibility false, so it is not rendered.
  - **Gating field:** Stories has **no hosted or sponsored switch**. The visibility-bindable booleans on the box are Featured in Gallery, Show edited/posted/traveled date and Weekend Read, plus the referenced Contributor and Country booleans.
  - **La Paz:** item `6a96a65a420f652aaea264a3`, slug `la-paz-mexico-whale-sharks`, published. `disclosure: null`. So the script never shows the box. The "hosted" line exists for La Paz only as the hidden default sentence in raw HTML (and for every other story too).
  - **CMS check:** only 3 stories have a Disclosure value, and none starts with "Hosted": La Tomatina, southern-africa-safari, and marathon-on-all-7-continents (`"Paid for by the travelers"`).
  - **Side bug (not asked, worth flagging):** the story head `tll-label-js-v1` `reklame()` regex `/^(?:hosted|sponsored|paid for|reklame)\s*(?:by|for|:)?\s*([^.;\n]+)/i` matches "Paid for by the travelers". It would insert a false "Reklame for the travelers" label before the h1 on `marathon-on-all-7-continents`. Verify on that page.
- **Proposed fix:**
  1. Hosted line. Choose one:
     - (a) Create a Switch field `hosted` ("Hosted trip") in Stories (`data_cms_tool > create_collection_static_field`, type Switch, default off). Then `set_visibility` on `578a8d42-…f136` with `binding {source_type:"cms", collection_id:"6a0b29eddc14f1444e935760", field_id:<new>}`. Webflow then omits the box when the switch is off.
     - (b) Without a schema change: clear the default sentence (`set_text` on text block `651cb6b7-…45ed` to an empty string) so only the script writes it. The empty box and its "Sponsored" badge would still be in raw HTML.
     - Recommend (a). Leave La Paz off (Nancy decided it was not hosted). No CMS edit is needed for La Paz.
  2. Ad slot: `set_visibility static_value:false` on aside `e1115818-…65c4`. That removes "AD SLOT · IN-ARTICLE" and the reserved note from the HTML. Turn it back on when ads are approved.
- **Who can do it:** "API now (unpublished edit)" for the ad slot and option 1b. Option 1a is also API but adds a CMS field, so "Nancy decision needed: OK to add a Hosted switch to Stories".
- **What could break:**
  - The `sponsored()` script returns early when `[data-tll-sponsored]` is missing, which is safe.
  - With 1a, a story with "Hosted by X" in Disclosure but the switch off would show no box, so both must be set together for hosted stories.
  - The head comment says ad-slot "hooks stay in the DOM (contract)". I found no page script querying `#tll-ad-slot-story` or `[data-tll-ad-slot]` (CSS only). Registered hosted scripts were not inspected, so check before hiding.

### Item 11: Footer guides /copenhagen-stopover and /ees-etias-layover
- **Status:** STILL BROKEN (404 live is consistent with the data). Both pages are **draft**.
- **Evidence:**
  - Metadata:
    - /copenhagen-stopover `6abbdbbadcc11e6928b4481c`: `draft: true`, lastUpdated 2026-10-09T05:42:52Z.
    - /ees-etias-layover `6abbdbbbbcdc0c05aaa893fc`: `draft: true`, lastUpdated 2026-10-09T05:42:52Z.
    - S17 (9 Oct) "pull the guides (reminder 23 Oct)" explains the draft state, and therefore the 404.
  - Both heads contain `<!-- tll-guide-noindex-v1 : remove together with the DRAFT banner once Nancy has checked every answer -->` and `<meta name="robots" content="noindex,follow">`. Page metadata has no noindex flag.
  - Both have FAQPage JSON-LD (5 Questions each) that mirrors the on-page Q&A.
  - Footer component links `97dea203-3010-7e7f-94b1-a734c788cf13` (/copenhagen-stopover) and `…cf15` (/ees-etias-layover) are live in every footer.
  - **Copenhagen content:**
    - Hero eyebrow "ANSWER GUIDE · STOPOVERS"; H1 "The Copenhagen stopover, *with or without a dog.*"; lede.
    - Tabs to both guides, and a "THE SHORT VERSION" block.
    - **DRAFT box** `7887ab5d-…0eff` ("DRAFT" plus "Every answer below is checked against the linked official source before this page goes live…").
    - 5 Q&A articles with source links: cph.dk ×2, flysas.com, dsb.dk, foedevarestyrelsen.dk. Q2's source label "SOURCE: EDITOR'S RULE OF THUMB ↗" links to cph.dk, which does not match.
    - Box heading `7887ab5d-…0f25` **"THE LEDGER"**. "Ledger" is a banned word.
    - dd `7887ab5d-…0f30` "Draft, not yet checked" (LAST CHECKED); UPDATED "When the rules change"; CHECKED BY "Nancy Carleton, editor".
    - CTA with "€9." (`…0f47`), button to /the-paw-passport.
  - **EES content:**
    - Hero "ANSWER GUIDE · BORDER RULES"; H1 "EES and ETIAS on a layover, *without the panic.*"
    - Short version, DRAFT box `7f7414e4-…c673`, and 5 Q&A with europa.eu sources (ees_en ×4, etias_en ×1).
    - "THE LEDGER" heading `7f7414e4-…c699`; LAST CHECKED dd String `…c6a4` "Draft, not yet checked".
    - CTA "Stuck at a Schengen gate right now?" → /submit.
- **What the pages need to be publishable (outline only):**
  1. Nancy checks each answer against its source. Time-sensitive claims: the EES "fully in operation since 10 April 2026" date, the ETIAS "last quarter of 2026" timing, the SAS stopover process, and the DSB dog ticket rule.
  2. Set a real date in both LAST CHECKED dd strings, replacing "Draft, not yet checked".
  3. Remove the DRAFT boxes (`7887ab5d-…0eff`, `7f7414e4-…c673`), or hide them with visibility false.
  4. Delete the noindex comment and meta lines from both page heads.
  5. Rename the "THE LEDGER" headings (banned word).
  6. Fix the Q2 source mismatch on Copenhagen.
  7. Drop "€9." from the Copenhagen CTA until the guide sells (item 3). The JSON-LD answer "The Paw Passport guide walks through the paperwork" stays accurate only if the guide exists, so adjust it too.
  8. Keep the JSON-LD in sync with any on-page answer edits.
  9. Set `draft:false` (`update_page_settings`), then publish.
  - "Short pages now" could trim each page to 3 questions, but the FAQ JSON-LD must then match.
- **Who can do it:** "API now (unpublished edit)" for steps 2 to 8 once the copy is approved, and `draft:false`. Step 1 is "Nancy decision needed: confirm answers and the check date". The footer links stay; per Nancy, footer changes need "Nancy present".
- **What could break:**
  - Publishing with `draft:false` but noindex still in place leaves the pages live yet unindexed.
  - Publishing unverified entry rules is the trust risk the GTM plan flags.

### Item 12: /faq paid-tier line
- **Status:** STILL BROKEN.
- **Evidence** (page 6a0e960b053efebac06a79ae):
  - Question Heading (h2) `3c2a38a0-4abd-57f4-d5c2-f28569565a3b` / String `…5a3a`: "Is it free to read and to contribute?"
  - Answer Paragraph `3c2a38a0-4abd-57f4-d5c2-f28569565a3d` / String `3c2a38a0-4abd-57f4-d5c2-f28569565a3c`: "Yes to both. Free to read, free to submit, free forever for travelers. A paid tier may add premium features later, but existing accounts always keep a free option and we never paywall published stories."
  - Its wrapper is `3c2a38a0-…5a3e`, in section `3c2a38a0-…5a5c`.
  - **JSON-LD** (page `jsonLdSchema`, set via the schema-markup API, not head code). In the `@graph` FAQPage `https://www.thatlayover.life/faq#webpage`, the mainEntity Question "Is it free to read and to contribute?" has acceptedAnswer text identical to the paragraph above, including "A paid tier may add premium features later".
  - Page head code is 62 chars (no JSON-LD there). No embeds on the page. No Ko-fi mentions.
- **Proposed fix:**
  - `set_text` on String `3c2a38a0-…5a3c` with the approved line.
  - Then `bulk_update_pages_schema_markup` on 6a0e960b053efebac06a79ae. Write back the full existing `@graph` with only that acceptedAnswer text changed, keeping the other 5 Questions and the BreadcrumbList.
  - The afternoon-list proposal mentions "the Ko-fi button is there". The Ko-fi buttons are being removed (item 3), so that sentence would point to nothing. Pick wording without Ko-fi until the link exists.
- **Who can do it:** "Nancy decision needed: final wording", then "API now (unpublished edit)".
- **What could break:** If only one of the paragraph and the JSON-LD is updated, the visible answer and the structured answer will disagree.
