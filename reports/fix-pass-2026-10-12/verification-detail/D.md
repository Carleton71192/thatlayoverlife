# Verify D: items 7, 15, 16, 17, 18 (That Layover Life, 12 Oct 2026)

Read-only pass. Webflow Data API only (site 69d6145cf421c777840c1e25, session ses_3KaiC3RSJso7oYsVFKerCECtfsD). Nothing was written to Webflow. Site last published 2026-10-12T10:44:53Z (get_site). Raw dumps used: scratchpad/verify/site_head.html, site_footer.html, pagecode/<slug>__head|footer.html (all 77 pages incl. home).

---

### Item 7 (BLOCKER): Measurement

- Status: PARTLY FIXED. The GA4 tag loads once and is consent-gated; no events, no Consent Mode defaults, no Search Console verification tag.

- Evidence:
  - **Webflow GA4 field is empty.** get_site returns `"googleTagIds":[]`, `"dataCollectionEnabled":false`. No other analytics/integration field exists in the site object.
  - **G-T1K83PRL1R appears exactly once**: site head freeform code, lines 126-130:
    `<script type="text/plain" data-category="analytics" async src="https://www.googletagmanager.com/gtag/js?id=G-T1K83PRL1R"></script>`
    `<script type="text/plain" data-category="analytics"> window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);} gtag('js',new Date());gtag('config','G-T1K83PRL1R'); </script>`
  - **No other GA4 / GTM / UA id anywhere in Webflow code blocks.** Grep for `G-[A-Z0-9]{8,}`, `GTM-`, `UA-`, `gtag(`, `dataLayer`, `googletagmanager` over: site head (40,411 chars) and site footer (25,654 chars); head and footer freeform code of all 77 pages (0 hits); the 15 site-applied registered scripts (all TLL utility scripts: tll_memberstack_init_v2, tll_memberstack_skin_v1, tll_world_map_v1, tllfactsv1, tllreveal, tll_ledger_sync, tll_save_story, tll_saved_shelf, tll_reader_notes, tll_reader_notes_form, tllformcontrolsv3, tllformlabelsv1, tllavatarv1, tllmapv3, tllfbkplacev1); page-applied scripts on every page (only 10 pages have any: account, Contributors/Countries/Stories templates, edit-profile, editors-desk, my-pets, share-photos, stories, submit, the-map, home; none analytics-named). The hosted bodies of those scripts were not fetched (CDN not reachable from this container); their sources in the repo `src/` have no gtag outside copies of the site head. Limit: get_registered_scripts returns 100 of 147 registered scripts (no offset param), but registered-not-applied scripts do not load.
  - **The "two GA4 properties" are not on the site.** Only one measurement ID is deployed. The second property is visible only in Google Analytics: growth-review-2026-10-12.md says Supermetrics "showed two GA4 properties named That Layover Life, one grouped under Lub Bub". Since only G-T1K83PRL1R is tagged, the other property gets no hits from this site (no double count from the page). Nancy must check in GA Admin which property owns G-T1K83PRL1R and archive or relabel the other.
  - **Other tracker:** Ahrefs Web Analytics loads ungated in site head line 132: `<script src="https://analytics.ahrefs.com/analytics.js" data-key="hbUjDXMWTy6UXwJhDa47gw" async></script>` (cookieless per Ahrefs; Cookie Policy should name it).
  - **Consent:** CookieConsent v3.1.0 (orestbida). CSS in site head lines 11-12; JS and `CookieConsent.run({... categories:{necessary:{enabled:true,readOnly:true},analytics:{}} ...})` in site footer lines 1-17, started on `window.load`. GA scripts are `type="text/plain" data-category="analytics"`, so gtag.js is not fetched and `window.gtag` does not exist until the visitor accepts Analytics. No Google Consent Mode calls (`gtag('consent','default'|'update',...)`) exist anywhere. This is a "block until consent" setup: compliant, but GA gets no cookieless pings for declined visitors.
  - **Existing `gtag('event', ...)` calls: none** (0 hits across site code, all page code, repo src).
  - **Search Console:** no `google-site-verification` meta in site head or any page head (0 hits). STATUS row I01 "Sitemap + robots.txt" is Blocked, waiting on Nancy.

- Proposed fix (one consent-gated helper plus six hooks; all inside one existing site-footer block or one new script):
  - Helper: `function tllEv(n,p){try{if(window.gtag&&window.CookieConsent&&CookieConsent.acceptedCategory('analytics'))gtag('event',n,p||{});}catch(e){}}`. `window.gtag` only exists after consent, so the double check keeps events off for anyone who declined.
  - Hooks (forms from list_forms; ids are form element ids):
    | Event | Where it hooks | Notes |
    |---|---|---|
    | `story_submitted` | /submit (6a0d5e5eb7804d3a750dc266) Webflow form `410fe31c-0208-fa02-297c-3b2122ab7d37` ("Html Form") and link-out form `51b9abee-68eb-6095-9a21-24484793e255` ("Link-out story", param `type:'link_out'`) | Fire when the form's sibling `.w-form-done` becomes visible (MutationObserver), not on submit, so failed sends are not counted |
    | `sign_up` | /signup (6a0d5c1fa1d71485d8688f7b), form `d8aa44e7-c49a-d2c7-7ab8-f5d9fb2ef88a` is the Memberstack form | Do not touch any data-ms-* attribute. Hook a Memberstack auth listener (`window.$memberstackDom.onAuthChange`) in a new block, or inside tll_memberstack_init_v2 if Nancy prefers one place; fire once per new member (e.g. guard with sessionStorage) with `method:'email'|'google'` |
    | `newsletter_signup` | /newsletter (6a89841b8c022c36155d6627) "Email Form" `b2abd845-ca41-bfa2-6529-f8c88e749b36`; home (69d6145df421c777840c1e46) native form `3ab123c7-422b-4e6a-d361-a79ad928fa71`; /stories forms `2a4d384b-bbeb-eaf7-7cce-2edaf3976c17` and `6b8749f3-2560-6665-99ed-9b01d8ce6cd1` need a look to confirm which is the newsletter one | Same `.w-form-done` pattern, param `location:<page slug>` |
    | `kofi_click` | Delegated click on `a[href*="ko-fi.com"]` | No Ko-fi link exists today (STATUS I10 "Layover Club price + Ko-fi link": Blocked; /support buttons say COMING SOON). Hook ready, fires once the link goes in |
    | `guide_checkout_click` | Delegated click on links inside `[data-tll-paw-guide]` (/the-paw-passport #guide) that leave the site | Guide is not on sale (STATUS S17, "pet guide not on sale (reminder 23 Oct)"). No checkout URL yet |
    | `affiliate_click` | Delegated click; reuse the rule already in the Stories template head (`isAffiliate`: `rel` contains `sponsored`, or `data-tll-affiliate`, or an affiliate query param) | Send `link_domain` and story slug, never the full URL with tracking params |
  - Placement: either (a) append the helper and hooks to the existing site footer freeform block (set_site_freeform_code, footer) right after the CookieConsent wiring, or (b) register a new hosted script `tll_ga4_events_v1` and add it site-wide (register_hosted_script + add_site_script, footer). Both need Nancy's OK: (a) edits an existing block, (b) is a new script (rule: new scripts need her OK).
  - Optional: add Consent Mode v2 defaults (`gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'})`) plus an `onConsent`/`onChange` update. Only worth it if Nancy wants modeled data; it changes the current "nothing before consent" posture.
  - Search Console: Nancy adds a Domain property for thatlayover.life in Search Console and verifies by DNS TXT at the registrar (covers www and apex, nothing on the site changes). If she picks the URL-prefix HTML-tag method instead, the API can add the one `<meta name="google-site-verification" content="...">` line to site head (set_site_freeform_code, head) once she pastes the token. Then submit https://www.thatlayover.life/sitemap.xml.

- Who can do it: "Nancy decision needed: events in existing site footer vs new script tll_ga4_events_v1; Consent Mode yes/no". "Nancy click (account/service): GA Admin, identify and archive the second That Layover Life property (the one under Lub Bub); Search Console Domain property + DNS TXT; mark the six events as key events in GA4 after DebugView shows them." Code itself: "API now (unpublished edit)" after her OK.

- What could break: editing the site footer touches the CookieConsent block (a typo there removes the banner on every page; keep the edit additive and after the existing scripts). The Memberstack listener must not alter forms or data-ms-* attributes. Firing on submit instead of on `.w-form-done` would count spam and failures. Ko-fi and guide hooks are inert until those links exist.

---

### Item 15: duplicate Fitz Roy og:image on /countries; og:type on stories

- Status: Fitz Roy duplicate ALREADY FIXED. og:type on stories STILL BROKEN.

- Evidence:
  - Countries Template 6a8afbda8e907b41c4da10a1, head code line 1 (now an HTML comment, does not render): `<!-- <meta property="og:image" content="https://s3.amazonaws.com/webflow-prod-assets/69d6145cf421c777840c1e25/6a0e0225995b48deb53b96e8_Fitz%20Roy.jpg"> (ct3, open point 8: the page-settings OG image is the only og:image) -->`. STATUS S40 (Live, published 12 Oct): "Patagonia og:image commented out". Template lastUpdated 06:20, site published 10:44, so it is live.
  - Countries Template page settings: `"openGraph":{"titleCopied":true,"descriptionCopied":true,"imageUrl":null,"imageAssetId":"6ac86b39eaf54b2878f9751a"}` = `og-detail_countries.png` (scripts/og/asset-ids.json), the generic country card. The template footer has no og: tags. So one og:image per country page.
  - /countries 6a8b07db18f836c65f4a3dfe: `imageAssetId":"6ac86b37be72dddcb4bccc44"` = `og-countries.png`; head code has no og tag, only canonical to /destinations, `<meta http-equiv="refresh" content="0;url=/destinations">` and a JS redirect. One og:image.
  - Stories Template 6a0b29eedc14f1444e935766: no `og:type` in its head (168 lines) or footer, nor in site head/footer, nor in any page code (0 hits site-wide). Webflow outputs its default `og:type` "website"; growth-review-2026-10-12 confirms from the live crawl: 'Story pages report og:type "website"'. Head line 1 sets `<meta property="og:image" content="{{wf {&quot;path&quot;:&quot;hero-image&quot;,...} }}">`; page settings `imageAssetId:null`, so no og:image duplicate there.

- Proposed fix: Stories Template head, add one line after line 1: `<meta property="og:type" content="article">` (optionally also `<meta property="article:published_time" content="{{wf {"path":"published-date","type":"DateTime"} }}">`). API: data_scripts_tool > get_page_freeform_code (head) then set_page_freeform_code (page 6a0b29eedc14f1444e935766, head) with the full existing content plus the line. Webflow will still print its own `og:type` "website"; there is no page setting to change it. Check with the Facebook Sharing Debugger and LinkedIn Post Inspector after publish which value they take. If they keep "website", the clean route is asking Webflow support, since the default tag cannot be removed from page code.
- Who can do it: "API now (unpublished edit)" for the head line; Nancy publishes.
- What could break: two og:type tags if Webflow's default stays (harmless for search; some scrapers read the first). set_page_freeform_code replaces the whole block, so the 15,108-char head must be written back verbatim plus the new line.

---

### Item 16: Sitemap cleanup

- Status: PARTLY FIXED. /profile is already out. /map-2-preview, the Destinations items (incl. /destinations/tanzania) and all /collections are still in.

- Evidence (data_sitemap_tool; the sitemap is Webflow's auto-generated one, and the tool sets the per-page/per-item includeInSitemap flag):
  - Static pages (list_pages_sitemap_status, 48 pages): `map-2-preview` 6ac67d31e037b2c2a3183dd7 `"includeInSitemap":true` while its head says `<meta name="robots" content="noindex,nofollow">`. `profile` 69d61469f421c777840c204e `"includeInSitemap":false` (already done; head `noindex, follow`).
  - Other noindex/sitemap conflicts found: `copenhagen-stopover` 6abbdbbadcc11e6928b4481c and `ees-etias-layover` 6abbdbbbbcdc0c05aaa893fc are `includeInSitemap:true` with `<meta name="robots" content="noindex,follow">` (draft guides, tll-guide-noindex-v1). `countries` 6a8b07db18f836c65f4a3dfe is `true` but is a redirect to /destinations.
  - Destinations collection 6a0b29c702602326705dcfb1 (Destinations Template 6a0b29c702602326705dcfcf, head `<meta name="robots" content="noindex, follow">` and a JS redirect to /countries/<slug>): 26 live items, 19 with `includeInSitemap:true`: new-zealand, paraguay, colombia, chile, brazil, el-salvador, spain, portugal, vietnam, qatar, indonesia, zimbabwe, zambia, **tanzania (6a0e9616ed918a866eead1ac)**, south-africa, morocco, lesotho, eswatini, botswana. 7 already false (japan, united-states, denmark, ghana, sweden, montenegro, bulgaria). Staged list has 198 items, all `true`.
  - Collections collection 6a0be81801ee7eff1010907a (Collections Template head `noindex, follow`): 5 live items all `true`: sunset-mist 6a0be887a0693535d34871a8, desert-glow 6a0be887a0693535d34871a5, alpine-escape 6a0be887a0693535d34871a2, wild-routes 6a0be887a0693535d348719f, salty-air 6a0be887a0693535d348719c.
  - Precedent: Themes items (5) are already `includeInSitemap:false`, so item-level exclusion through the API has been used before and works.
  - Noindex templates with no live items (Bookmarks, Comments, Visits, Award Nominations, Pet Notes, Trip Bundles): nothing in the sitemap today.

- Proposed fix:
  1. data_sitemap_tool > bulk_update_pages_sitemap_status (site 69d6145cf421c777840c1e25): `{id:6ac67d31e037b2c2a3183dd7,includeInSitemap:false}` (map-2-preview), plus, if Nancy agrees, copenhagen-stopover, ees-etias-layover and countries set to false.
  2. bulk_update_items_sitemap_status, collection 6a0b29c702602326705dcfb1: all 198 Destinations items to false (two calls of 100 and 98; at least the 19 live ones listed above, which include tanzania).
  3. bulk_update_items_sitemap_status, collection 6a0be81801ee7eff1010907a: the 5 Collections items to false.
  4. Full site publish (sitemap.xml only rebuilds on a full publish, see STATUS S35).
  5. Long term (so new items do not come back in): Nancy in Designer, Pages panel > Destinations Template and Collections Template > Page settings > SEO/Sitemap indexing: turn off. The page sitemap endpoints reject collection template pages, so the API cannot set the template-level switch.
- Who can do it: steps 1-3 "API now (unpublished edit; staged until publish)". Step 1 extras: "Nancy decision needed: also drop the two draft guides and /countries". Step 4: Nancy's publish. Step 5: "Nancy in Designer: Page settings on the two templates, Sitemap indexing off".
- What could break: nothing visible on pages. When the two draft guides lose noindex later, they must be put back in the sitemap. New Destinations or Collections items default to included until step 5 is done.

---

### Item 17: /pillars/* filtering

- Status: PARTLY FIXED. Pages show only the pillar's stories, but only through client-side JavaScript. The server HTML carries every published story on every pillar page, and there is no noindex.

- Evidence (Pillars Template 6a0b29c7d081332e9219016e):
  - Three collection lists: `tllpr-stories` ec5d22cd-3459-7618-d885-98c1080394cf (Stories), `tllpr-layovers` 11806a21-125a-73c8-0c6a-2ba05fe89021, `tllpr-diary` fb60734d-4872-3f69-cd2b-667040e88157.
  - `tllpr-stories` settings: `"filters":[{"fieldSlug":"status","operator":"equals","value":"40fb8550c58a86ae03f3dfb83bf691e3"}]` (Status = Published only), sort `published-date` descending, limit 60. **No pillar filter.**
  - Template footer script `tll-pillar-shelf-v2` hides cards whose `.tllpr-pflag` text is not the URL slug: `if(v===slug){n++;}else{it.style.display='none';}`, shows tllpr-layovers only on layover-guides and tllpr-diary only on paw-passport.
  - No robots meta in the template head (only canonical and CSS). All 5 pillar items are `includeInSitemap:true` (live).
  - Stories collection has a Reference field `pillar-2` ("Pillar", to Pillars 6a0b29c6d081332e921900ff, help text "Drives the list on the pillar page"), so a native filter is possible. Published stories by pillar-2: stories-from-the-road 26, cultural-intelligence 1 (ghana-easter-everyone-wears-white), travel-logistics 1 (balkans-ev-road-trip-twelve-countries), layover-guides 0, paw-passport 0 (that page shows the Magnus Diary list instead).

- Proposed fix: filter by pillar natively, and noindex the thin ones.
  1. Nancy in Designer: select collection list `tllpr-stories` on the Pillars Template > Collection list settings > Filter: add "Pillar (pillar-2) equals Current Pillar", keep "Status equals Published". The API exposes `filters` but marks it `canBind:false`, and the value format for "Current Pillar" is undocumented, so a set_settings write is not safe. The footer script can stay as a backstop.
  2. Until pillars hold 3 or more stories, noindex the thin pages: in the template head, a CMS-driven rule is not possible without a field, so either (a) add `<meta name="robots" content="noindex, follow">` to the whole template head now (API, set_page_freeform_code on 6a0b29c7d081332e9219016e) and drop the 5 pillar items from the sitemap (bulk_update_items_sitemap_status on 6a0b29c6d081332e921900ff), or (b) keep stories-from-the-road indexable and exclude only the other four items from the sitemap, with a JS noindex when `n<3` (the footer script already counts `n`).
- Who can do it: Filter: "Nancy in Designer: Pillars Template > tllpr-stories > Filter Pillar equals Current Pillar". Noindex/sitemap: "Nancy decision needed: noindex all pillars (a) or only the thin four (b)", then "API now (unpublished edit)".
- What could break: the native filter empties the layover-guides and paw-passport story lists (both show their own lists already, and `.tllpr-none` covers an empty state). A whole-template noindex also removes /pillars/stories-from-the-road from search.

---

### Item 18: Story hero images Eager

- Status: STILL BROKEN (Stories); Countries hero also not set. Neither can be fixed through the settings API.

- Evidence:
  - Stories Template hero: Image `8ab51244-143a-308e-7509-e964817a2e61`, class `tll-story-hero-img`, attributes `data-tll-parallax="hero"`, `fetchpriority="high"`, `decoding="async"`, no `loading` attribute. get_settings (query_settings, all) returns only 4 keys: `domId`, `assetId` (CMS Stories > Hero image), `altText` ("inherit"), `visibility`. **No `loading` key is exposed**, so set_settings cannot change Load. Webflow's default for images is Lazy; growth-review-2026-10-12 table: "Story heroes lazy". `fetchpriority=high` plus lazy loading cancel each other out.
  - Countries Template hero: Image `e1e1be5d-c8dd-d315-41c5-06536bf91a4b`, attributes `data-ct3="hero-img"`, `fetchpriority="high"`, `aria-hidden="true"`. Same 4 settings keys, no `loading`. STATUS S40 lists "set country hero image Load: Eager" as a Designer step.
  - For comparison, gallery and related images on the Stories Template already carry custom `loading="lazy"` (7a456e32-…, ff8f1ba5-…), so `loading` is accepted as a custom attribute.
- Proposed fix: Nancy in Designer, on each hero: select the image > Settings (gear) > Image settings > Load: **Eager**. Stories Template element 8ab51244-143a-308e-7509-e964817a2e61 and Countries Template element e1e1be5d-c8dd-d315-41c5-06536bf91a4b. Fallback if she wants it by API: data_element_tool > set_attributes `{name:"loading",value:"eager"}` on both elements. It is untested whether Webflow then prints its own `loading="lazy"` too, so check the published HTML.
- Who can do it: "Nancy in Designer: Image settings > Load: Eager on the two hero images" (preferred). API attribute fallback: "API now (unpublished edit)", needs a check after publish.
- What could break: nothing functional. A custom `loading` next to Webflow's own could produce a duplicate attribute (the browser keeps the first), which is why the Designer switch is the reliable route.
