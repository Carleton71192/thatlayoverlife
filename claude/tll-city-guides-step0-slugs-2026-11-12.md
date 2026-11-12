# TLL city guides, Step 0 audit, task "slugs" (read only, 12 Nov 2026), checked version

**File status.** I could not write findings.md or findings.before-check.md in /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/cities/extra-slugs/. The harness refused my Write call with the same message the first reader got ("Subagents should return findings as text, not write report files"). I did not try to get around that refusal. The corrected findings are below in full, followed by the list of corrections. The uncorrected text is the FINDINGS block in the task.

**Check evidence files** (data files, not reports):
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/cities/extra-slugs-check/pages_check.txt (a fresh list_pages run)
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/cities/extra-slugs-check/web/probe.txt (54 live status checks)
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/cities/extra-slugs-check/web/robots.txt
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/cities/extra-slugs-check/web/sitemap.xml
- /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/cities/extra-slugs-check/web/paths.txt

**Writes.** Nothing was written to Webflow, Notion, Drive or the repo, and there were no git commits. The check made only reads, with agent_id opus-5.5|claude-code|tmzqv and session ses_3Kwnmbq2KBuy8jwu3YowGgTfeNg. The first reader used agent_id opus-5.5|claude-code|qvkre.

The first reader's raw files are in /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/cities/extra-slugs/:
- pages0.txt
- stories0.txt and stories_summary.txt
- cd.txt, cd_items.json and cd_slugs.json
- misc.txt
- clash_out.txt
- web/robots.txt, web/sitemap.xml, web/sitemap_paths.txt and web/status_probe.txt

The clash script is /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/cities/clash.py.

## Sources read
- **The prompt:** /home/user/thatlayoverlife/claude/tll-city-guides-local-experts-prompt-2026-11-12.md.
  - Line 38 holds the decision: "Answered 12 Nov: city pages live at the root, **/copenhagen** (check for slug clashes with existing pages and reserve a list of blocked slugs)."
  - Line 75 adds: "today's /layovers/cph-copenhagen-6h becomes an itinerary under it; 301 redirects listed in the change log, none applied without approval."
- **Webflow MCP, site 69d6145cf421c777840c1e25:**
  - list_pages returned 96 of 96 pages: 56 static and 40 collection templates. The checker re-ran it and got the same result, path for path.
  - get_collection_list returned 40 collections. The checker re-ran it and got the same result.
  - Items read:
    - Layovers: 7 (the checker re-read these)
    - Stories: 63
    - Countries: 197; Destinations: 198
    - States: 56; National Parks: 63; Subdivisions: 100
    - Marathons: 5; Pillars: 5; Themes: 13; Pursuits: 5; Collections: 5; Resources: 4
    - Expat Groups: 0; Trip Bundles: 0
  - get_site.
- **Redirect CSVs:**
  - /home/user/thatlayoverlife/docs/redirects/webflow-301-import-2026-11-09-combined.csv is the newest (12 Nov 09:32) and has 14 rules.
  - /home/user/thatlayoverlife/docs/redirects/webflow-301-import-2026-11-09.csv (9 Nov) has 7 rules. All 7 are also in the combined file.
- **Live site:**
  - https://www.thatlayover.life/robots.txt
  - https://www.thatlayover.life/sitemap.xml (139 URLs, matching the first reader's copy)
  - Status checks without following redirects: 49 by the first reader, plus 54 by the checker.
- **Worker:** /home/user/thatlayoverlife/worker/wrangler.toml, /home/user/thatlayoverlife/worker/README.md and /home/user/thatlayoverlife/worker/src.

## Could not read
- **Webflow's own redirect table and robots settings.** list_301_redirects returned 403, code "not_enterprise_plan_site", with the message "This site does not have an Enterprise hosting plan. This action requires an Enterprise site plan." The checker re-ran it and got the same 403. The first reader also got this error from get_robots_txt. The redirect list below is the CSV plus what the live site does.
- **Folders.** list_pages returns no folder objects or parent IDs. The fields returned are id, siteId, title, slug, createdOn, lastUpdated, archived, draft, shouldPublish, canBranch, isBranch, seo, openGraph, publishedPath and collectionId. Every publishedPath is one segment deep, so no folder holds a page. Empty folders would not show up; check them in the Designer.
- **The site plan name.** get_site does not return it.
- **DNS for thatlayover.life.** There is no dig in this container, and the proxy blocked DNS-over-HTTPS and the apex host.
- **Hosts outside this session's network allowlist.** In the check, these failed to resolve: help.webflow.com, community.webflow.com, discourse.webflow.com and developers.cloudflare.com. The first reader also had en.wikipedia.org and travelmole.com fail. Fetching travelnoire.com, euromonitor.com and ttgasia.com with curl returned no usable text.
  - Every Webflow and Cloudflare documentation claim below therefore rests on web search summaries of those pages, not on reading them.
  - These hosts would have to be allowed in the session's network settings before anyone can quote the pages directly.
- **The full Euromonitor top 100 table.** See section 2 for which ranks are confirmed.

## 1. Top-level paths in use today

**1a. Static pages: 56 (32 published, 24 drafts).** The checker confirmed these with a fresh list_pages run. No page is archived.

Published:
- /, /404, /about, /account, /community-guidelines, /contact, /cookies, /corrections
- /destinations, /edit-profile, /editorial-charter, /faq, /for-brands, /for-expats, /for-press
- /forgot-password, /gallery, /layovers, /login, /my-pets, /privacy, /profile
- /share-photos, /signup, /stories, /submit, /support, /terms
- /the-map, /the-paw-passport, /travel-wire, /travelers

Drafts (the slug is still held):
- /awards, /copenhagen-stopover (id 6abbdbbadcc11e6928b4481c, "The Copenhagen stopover, with or without a dog · That Layover Life"), /countries, /creators, /editors-desk
- /ees-etias-layover, /expats, /for-affiliates, /gate-floor-awards, /layover-madness
- /magnus-cookie-index, /map-2-preview, /marathon-diaries, /my-passport, /newsletter
- /passport-wrapped, /pets, /press, /press-trips, /spotlight
- /spotlight-crew, /spotlight-index, /style-guide, /travelers-archive

**1b. Collection template base paths: 40, each served as /base/item.** The checker confirmed these with get_collection_list.
- /award-nominations, /bookmarks, /collection-categories, /collection-items, /collections, /comments, /contributors, /countries
- /destinations (Destinations, id 6a0b29c702602326705dcfb1), /directory, /expat-groups, /interest-tags, /layovers, /marathon-diaries (Marathons), /national-parks, /partners
- /paw-passport (Magnus Diary), /pet-notes, /pets, /photo-placements, /photo-submissions, /pillars, /press-applications, /press-mentions
- /press-trips, /pros, /pursuit-stamps, /pursuits, /resources, /site-settings, /site-stats, /states
- /stories, /story-extras, /submissions, /subdivisions, /themes, /trip-bundles, /visits, /whats-new

Seven bases are shared with a static page (the normal list-page pattern): stories, layovers, destinations, countries, pets, marathon-diaries and press-trips.

**1c. Redirects (combined CSV).**

| From | To |
|---|---|
| /newsletter | / |
| /creators | /travelers |
| /awards | /stories |
| /spotlight | /travelers |
| /pets | /the-paw-passport |
| /pillars/paw-passport | /the-paw-passport |
| /for-affiliates | /travelers |
| /paw-passport/magnus-boryana-sofia-bulgaria | /the-paw-passport |
| /paw-passport/magnus-airport-pickup-ritual-cph | /the-paw-passport |
| /paw-passport/magnus-cph-to-malmo-border | /the-paw-passport |
| /paw-passport/magnus-montenegro-border | /the-paw-passport |
| /countries | /destinations |
| /my-passport | /the-map |
| /ads.txt | https://cdn.prod.website-files.com/69d6145cf421c777840c1e25/6ae22939cdafc9526b63aa5f_ads.txt |

**Live behavior.** The checker tested all 14 rows on the live site.
- 13 return a 301 to the listed target.
- **/ads.txt returns 404.** Either that row was not imported, or Webflow does not allow a redirect on /ads.txt. Neither could be confirmed, because the redirect table cannot be read.

**1d. robots.txt and sitemap.xml.**
- robots.txt has one line, "Sitemap: https://www.thatlayover.life/sitemap.xml", and no Disallow rules.
- sitemap.xml has 139 URLs:
  - /stories: 57 item pages plus the /stories index
  - /countries: 49 item pages (of 197 Countries items)
  - /contributors: 9
  - /layovers: 2 item pages (/layovers/cph-copenhagen-6h and /layovers/sof-sofia-3h) plus the /layovers index
  - /pillars/stories-from-the-road and /pets/magnus-waffles
  - 18 other static pages, including /
- No /destinations/ item pages are in the sitemap. Only the /destinations index is.

**1e. Webflow-reserved and system paths.**
- **Always reserved.** Webflow reserves /images, /css, /js, /index, /manifest and /static-manifest. The /index rule also applies nested, so /blog/index is invalid.
  - Source: https://help.webflow.com/hc/en-us/articles/33961362705171-Page-URLs, through a search summary, because the page itself was unreachable.
- **Reserved when a feature is on** (same search summary):
  - Users: /log-in, /sign-up and the other User page slugs.
  - Ecommerce: /checkout, /paypal-checkout and /order-confirmation for static pages; /product and /category for folders.
- **System paths:** /robots.txt and /sitemap.xml (both answer 200), and /.well-known (/.well-known/security.txt returns 404).
- **Utility pages:** /404, /401 and /search keep fixed slugs.
  - /404 answers 200 when requested directly.
  - /401 returns 404, so no password page is live.
  - /search returns 404, so site search is not published.

## 2. Clash check

**Method.** Each city name was turned into a slug (lowercase, accents dropped, so São Paulo becomes sao-paulo). Each slug was compared with every path in section 1 and with the item slugs in Countries, Destinations, States, Subdivisions and Marathons.

**Cities checked.**
- **Layovers.** The checker re-read all 7 items:
  - Live: Sofia (/layovers/sof-sofia-3h) and Copenhagen (/layovers/cph-copenhagen-6h). Both answer 200.
  - Archived drafts: Istanbul (ist-istanbul-9h), Amsterdam (ams-amsterdam-6h), Tokyo (nrt-tokyo-12h) and Doha (doh-doha-9h).
  - Draft: a second Copenhagen item at /layovers/copenhagen-cph-6-hour-layover, which returns 404 live.
- **Stories (titles, slugs, byline):**
  - Pompei/Pompeii, Torrevieja, New Orleans, Schengen, São Paulo, Istanbul, Reims, Phuket, Singapore
  - Cabo San Lucas, Kuala Lumpur, Vientiane, Agra, Hanoi, Bangkok, Siem Reap, Rio de Janeiro, Ilhabela
  - Punta del Este, Lisbon, Portland (Oregon, and Maine in the slug portland-maine-to-ohio), Amsterdam, Mayfield Heights, Bogotá, Santiago, Bali, Doha
  - Santa Ana, Ibiza, Valencia, Buñol, Salvador, Madrid, La Paz, Budva, Accra
  - Westport (New Zealand), Porto Jofre, Tokyo, Rudbøl, plus country words such as Luxembourg, Mexico and Georgia
- **The 50 most visited cities** (Euromonitor Top 100 City Destinations 2025, international arrivals):
  - **Confirmed by the checker through search summaries:** 1 Bangkok 30.3M, 2 Hong Kong 23.2M, 3 London 22.7M, 4 Macao 20.4M, 9 Paris 18.3M, 10 Kuala Lumpur 17.3M.
    - https://www.timeout.com/news/revealed-the-worlds-most-visited-cities-by-international-arrivals-in-2025-120525
    - https://www.statista.com/chart/amp/35880/top-cities-for-international-visitors-in-2025
    - https://www.ttgasia.com/2025/12/16/asia-pacific-drives-tourism-growth-in-euromonitors-top-100-cities/
  - **Ranks 5 to 8 are not re-confirmed:** Istanbul 19.7M, Dubai 19.5M, Mecca 18.7M and Antalya 18.6M. They come only from the first reader's sources, which the checker could not open:
    - https://travelnoire.com/most-visited-cities-international-visitors-2025
    - https://www.euromonitor.com/newsroom/press-releases/december-2025/euromonitor-international-unveils-worlds-top-100-city-destinations-for-2025
  - **Places 11 to 50 are a candidate list from general knowledge, not verified rank by rank:** New York, Cancún, Singapore, Rome, Tokyo, Pattaya, Phuket, Barcelona, Milan, Amsterdam, Seoul, Osaka, Shenzhen, Taipei, Prague, Vienna, Madrid, Miami, Los Angeles, Orlando, Athens, Berlin, Dublin, Venice, Florence, Lisbon, Riyadh, Medina, Cairo, Mumbai, Delhi, Ho Chi Minh City, Hanoi, Denpasar, Shanghai, Budapest, Munich, Toronto, Sydney and Mexico City.
  - None of these names equals a top-level path in section 1.

**2a. Exact root clashes: none.** No city slug equals a static page, a draft page, a collection base, a redirect source or a reserved path. /copenhagen, /singapore, /sofia, /istanbul and /tokyo all return 404 today.

**2b. Near clashes and same-name items.** None of these collide on a URL, but each needs a decision.

1. **/copenhagen-stopover.** A draft static page with the title "The Copenhagen stopover, with or without a dog". Published next to /copenhagen, it would compete for the same searches. Fold it into /copenhagen or redirect it there. Because it is a draft, a redirect on its slug would work, which is the same pattern as /pets and /countries today (see 2c).
2. **Two Copenhagen layover items.**
   - /layovers/cph-copenhagen-6h is live and in the sitemap. The prompt (line 75) turns it into an itinerary under the hub.
   - /layovers/copenhagen-cph-6-hour-layover is a draft (404 live) and needs a redirect-or-delete decision.
3. **Cities named like a country.** Singapore and Luxembourg exist at /countries/... and /destinations/..., and all four URLs answer 200. The Countries capital field gives the same name, or "[name] City", for:
   - Monaco, Vatican City, Djibouti and San Marino ("City of San Marino")
   - Mexico (Mexico City), Panama (Panama City), Guatemala (Guatemala City) and Kuwait (Kuwait City)

   A root city page would sit beside two country pages, so each needs one canonical choice.
4. **Country slugs that are also city or first names.**
   - **Mexico:** /countries/mexico and /destinations/mexico. Mexico City is also a draft Subdivisions item, /subdivisions/mexico-city (404 live).
   - **Georgia:** /countries/georgia (200 live), /destinations/georgia-country (200 live) and /states/georgia-state (draft, 404).
   - **First names:** jordan, chad and georgia, which matters if members ever get root URLs.
5. **A city equals a state or region item.** All of these are drafts and return 404 today (checked: /states/new-york and /subdivisions/berlin):
   - States: New York (/states/new-york) and Washington (/states/washington).
   - Subdivisions: Berlin (/subdivisions/berlin), Hamburg and Bremen.
6. **Countries exist twice.**
   - Countries has 197 items under /countries/. The /countries index redirects to /destinations.
   - Destinations has 198 items under /destinations/.
   - 13 slugs appear in only one set:
     - Only in Countries: cape-verde, dr-congo, georgia, ivory-coast, republic-of-the-congo, turkiye.
     - Only in Destinations: cabo-verde, congo, cote-divoire, democratic-republic-of-the-congo, georgia-country, taiwan, turkey.
   - Taiwan answers 200 at /destinations/taiwan and 404 at /countries/taiwan.
   - A city page's country link has to pick one set.
7. **Marathons items.** All 5 are drafts, and 3 of them are also archived. None is live:
   - berlin-marathon-2026-prerace (archived)
   - copenhagen-marathon-2026-recap
   - ironman-tallinn-2027-prerace (archived)
   - tokyo-marathon-2027-prerace
   - tokyo-marathon-2027-pre-race (archived)

   The three checked live URLs (Berlin, Copenhagen and the first Tokyo item) return 404. When they are published, they should link to the city hubs, not compete with them.
8. **Ambiguous names already in Stories.** Each needs a naming rule before Phase 5 starts creating pages automatically, for example /portland-oregon and /portland-maine:
   - Portland (Oregon and Maine)
   - Santiago (Chile, or Santiago de Compostela on the Camino)
   - La Paz (Mexico or Bolivia)
   - Santa Ana (El Salvador or California)
   - Valencia (Spain or Venezuela)
   - Salvador (Brazil)
   - Westport (New Zealand, Ireland or Connecticut)
9. **Schengen.** In the story it is the village in Luxembourg, but the word also means the visa area.
10. **A naming clash in code, not in a URL.** Line 21 of /home/user/thatlayoverlife/worker/wrangler.toml reads PLACES_COLLECTION = "6a0b29c702602326705dcfb1", which is the Destinations collection id. The worker's GET /places serves that list, and the README says "Country is a Places item id (the list GET /places serves)". A new Places collection from the prompt would collide with that name.

**2c. How Webflow resolves a root page versus a template path.**

Observed on the live site (re-checked):
- A one-segment URL can only be a static page or a redirect. Collection items always have two segments, so /copenhagen and /layovers/cph-copenhagen-6h never compete.
- A static page and a collection can share a base: /stories and /stories/item pages both serve 200.
- Redirects match the exact path only. /countries returns 301, while /countries/denmark and /countries/singapore return 200.
- /copenhagen/ and /stories/ return 301 to the version without the trailing slash. /COPENHAGEN returns 404, so paths are case sensitive.
- Every redirect that sits on a page slug today sits on a draft page: /pets, /countries, /creators, /awards, /spotlight, /newsletter, /for-affiliates and /my-passport.

From Webflow documentation, through search summaries (the pages themselves could not be opened):
- **A redirect cannot sit on a published page.** Webflow rejects a redirect whose old path is a page ("The old url is already a page on this project"). The help center says that to redirect an existing static page, you must delete it, set it to draft, or change its slug first.
  - This matches the draft-page pattern above.
  - It also means a published /copenhagen page and a /copenhagen redirect cannot coexist.
  - Sources: https://help.webflow.com/hc/en-us/articles/33961294898835 and https://discourse.webflow.com/t/301-redirect-not-working-error-message-result/224980
- **A CSV import overwrites the whole redirect table instead of appending to it.** The recommended practice is to export, add the new rows and import the combined file, which explains the "combined" CSV.
  - Sources: https://help.webflow.com/hc/en-us/articles/33961211526291 (Import/export 301 redirects) and https://webflow.com/updates/301-redirect-management
- **Redirect syntax,** from the first reader's read of https://help.webflow.com/hc/en-us/articles/33961294898835-How-do-I-set-up-redirects-in-Webflow, which the checker did not re-check: redirects run oldest first, wildcards use (.*) and %1, and hyphens in a wildcard old path may need escaping.
- **Folders and collections:** a folder cannot share a URL with a collection (Page URLs doc above, from the first reader, not re-checked).
- **General Webflow knowledge, unverified:**
  - A static page and a folder cannot share a slug at the same level.
  - A folder has no index page of its own. A forum thread reports that naming a folder page "index" is blocked: https://discourse.webflow.com/t/webflow-folders/27693/4

## 3. Building a root URL per city

**The fixed point.** The collection slug is part of every collection page path and cannot be removed. It can be renamed, and a template can sit inside a folder (/folder/collection/item), but a template can never sit at the root. A reverse proxy is the only way around this.

Sources (the checker confirmed the claim through a search summary):
- https://help.webflow.com/hc/en-us/articles/33961244391059-Manage-CMS-Collections
- https://webflow.com/glossary/collection-url
- https://discourse.webflow.com/t/collection-url-without-slug/187365
- https://wishlist.webflow.com/ideas/WEBFLOW-I-1499
- https://discourse.webflow.com/t/root-page-inside-collection/106099

**Option A. One static page per city, fed by a Cities CMS item**
- **How it works:** a master page is duplicated per city. The Data API's create_page takes duplicateOf (confirmed in the Webflow MCP tool schema). Each copy's collection lists are filtered to that city's Cities, Facts, Places, Picks, Events and Media items.
- **Cost:** one static page per city.
  - 56 static pages are used today, 24 of them drafts.
  - **Plan limits under the May 2026 plans** (search summary of https://help.webflow.com/hc/en-us/articles/51059955082387 and https://webflow.com/blog/simplified-plans-and-updated-pricing-2026):
    - Premium, which replaces CMS and Business: 300 static pages, 40 CMS collections and 20,000 CMS items.
    - Existing CMS plan sites go from 150 to 300 static pages.
    - Basic has no CMS, so it does not apply to this site.
  - The TLL plan was not readable. On a 300-page limit there is room for about 244 city pages; if an older 150-page limit still applies, about 94.
  - Webflow caps the number of collection lists per page and nested lists (general knowledge; confirm the current numbers).
- **What breaks:**
  - Phase 5 is only half automatic. The duplicate can be made by API, but changing its collection-list filters is a Designer job (general knowledge, unverified).
  - Page SEO and og fields on a static page do not pull from the CMS, so they must be synced by API.
  - A design change has to be repeated on every city page unless the page body is one shared Component.
- **What it gives:** /copenhagen natively, as Nancy decided.

**Option B. A Cities collection with a base path, plus root 301s**
- **How it works:** pages live at /cities/copenhagen, and /copenhagen redirects there.
- **Cost:** one CMS item per city, plus one redirect per city.
  - Redirects have to be added by hand in Site settings or by CSV. This plan has no redirect API (the 403 above), and a CSV import overwrites the whole table, so every import must carry all existing rows.
  - A root wildcard is impossible, because /(.*) would catch every page.
- **What breaks:** the indexed URL becomes /cities/copenhagen and /copenhagen is only a short link. This reverses the 12 Nov decision.
- **What it gives:** a fully automatic Phase 5 and a single template.

**Option C. A page folder per city**
- **What breaks:**
  - A folder has no index page, so it cannot provide /copenhagen itself.
  - A page with the same slug as the folder is probably not allowed (verify).
  - A template can sit in only one folder, so a shared Places template cannot live in every city's folder.
- **What it gives:** a place for a few hand-made city subpages. It does not work as the city hub pattern.

**Option D. A Cloudflare Worker in front of the site**
- **How it works:**
  - A Worker route on www.thatlayover.life/* serves /copenhagen from /cities/copenhagen.
  - It rewrites canonical, og:url and internal links, and 301s /cities/* to the root.
  - It serves a rewritten sitemap.
- **Cost:**
  - Workers Free covers about 100,000 requests a day, and Workers Paid has a $5 a month minimum per account. This comes from a search summary of https://developers.cloudflare.com/workers/platform/pricing/, which could not be opened directly.
  - Every page view goes through the Worker.
  - It needs Cloudflare Orange-to-Orange (O2O). Webflow says it does not support third-party proxies, and that O2O is not a full reverse proxy. These two pages were read by the first reader and not re-checked:
    - https://help.webflow.com/hc/en-us/articles/45039458051347-Using-Cloudflare-Orange-to-Orange-O2O-with-Webflow
    - https://help.webflow.com/hc/en-us/articles/49835650986259-Set-up-a-self-managed-reverse-proxy-in-Webflow
  - A forum thread reports a Cloudflare proxy that broke after Webflow changed its publishing rules: https://discourse.webflow.com/t/cloudflare-proxy-no-longer-works-with-new-webflow-publishing-rules-how-to-keep-worker-based-functionality/329463/3
- **What breaks:**
  - Webflow's own sitemap, canonical tags, the webflow.io staging site and Webflow's SEO tools keep showing /cities/.
  - A Worker outage takes down the whole site.
  - Webflow support will not help with proxy problems.
- **Current state (re-checked):**
  - The site is served from Webflow's own Cloudflare edge. The response headers show "server: cloudflare", "x-wf-region: us-east-1" and a surrogate-key that contains the site id 69d6145cf421c777840c1e25.
  - Neither /home/user/thatlayoverlife/wrangler.toml (name "tll-travel-wire") nor /home/user/thatlayoverlife/worker/wrangler.toml (name "tll-worker") defines a route on www.
  - Whether the domain's DNS sits in a Cloudflare zone TLL controls was not readable.

**Summary.**
- Only Option A gives /copenhagen natively.
- Option B is the cheapest and most automatic, but /copenhagen becomes a redirect.
- Option D gives both, but puts an unsupported proxy in front of the whole site.
- Option C does not work as a city hub.
- **Whichever option is chosen, the collection limit blocks it first.** The site already has exactly 40 collections, and 40 is the cap on Premium per the search summary above. The prompt's data model adds up to 7 (Cities, Facts, Places, Picks, Experts, Events, Media). So no new collection can be created on the current plan unless existing ones are merged or removed (Expat Groups and Trip Bundles have 0 items), or the plan changes.

## 4. Proposed reserved slug list

A city, a place, a member handle or a future root page may not take any of these words. Match after slugging, and also block the same word with an added "s" or with the hyphens removed.

**1. Every top-level path in use today.** An exact clash would break a live URL, a redirect, or a draft that may go live.
about, account, award-nominations, awards, bookmarks, collection-categories, collection-items, collections, comments, community-guidelines, contact, contributors, cookies, copenhagen-stopover, corrections, countries, creators, destinations, directory, edit-profile, editorial-charter, editors-desk, ees-etias-layover, expat-groups, expats, faq, for-affiliates, for-brands, for-expats, for-press, forgot-password, gallery, gate-floor-awards, interest-tags, layover-madness, layovers, login, magnus-cookie-index, map-2-preview, marathon-diaries, my-passport, my-pets, national-parks, newsletter, partners, passport-wrapped, paw-passport, pet-notes, pets, photo-placements, photo-submissions, pillars, press, press-applications, press-mentions, press-trips, privacy, profile, pros, pursuit-stamps, pursuits, resources, share-photos, signup, site-settings, site-stats, spotlight, spotlight-crew, spotlight-index, states, stories, story-extras, style-guide, submissions, submit, subdivisions, support, terms, the-map, the-paw-passport, themes, travel-wire, travelers, travelers-archive, trip-bundles, visits, whats-new.

**2. Webflow and web system paths.**
- Webflow always reserves images, css, js, index, manifest and static-manifest.
- Webflow reserves checkout, paypal-checkout, order-confirmation, product and category when Ecommerce is on.
- Crawlers, browsers and ad networks request the rest by fixed name.

images, css, js, index, manifest, static-manifest, checkout, paypal-checkout, order-confirmation, product, category, search, 401, 404, 500, robots.txt, sitemap.xml, sitemap, ads.txt, app-ads.txt, llms.txt, humans.txt, security.txt, favicon.ico, .well-known, feed, rss, atom, cdn, static, assets.

**3. Account, sign-in and member tools.** Memberstack flows, Webflow's own User page slugs (log-in, sign-up and the rest) and the planned "My picks" area must never be covered by a city or a member handle.
account, accounts, login, log-in, logout, log-out, signin, sign-in, signup, sign-up, register, join, forgot-password, reset-password, update-password, verify, verification, access-denied, user-account, member, members, me, my, my-account, my-picks, my-stories, my-photos, profile, profiles, edit-profile, settings, dashboard, inbox, notifications, saved, bookmarks, onboarding, welcome, unsubscribe.

**4. Admin, API, Worker and staff words.** These block impersonation, junk slugs and confusion with Worker endpoints.
- Worker endpoints in /home/user/thatlayoverlife/worker/README.md and worker/src: /health, /me, /notes, /photo, /places, /publish, /story, /story/mine, /story/update, /story/unpublish and /themes.
- The Worker runs on its own host, not on www, so this is a precaution, not a live clash.

admin, administrator, api, auth, oauth, callback, webhook, webhooks, worker, server, root, www, mail, email, staging, preview, draft, test, dev, debug, status, health, notes, publish, unpublish, update, story, cms, editor, editors, moderator, moderation, staff, team, crew, official, verified, tll, thatlayoverlife, that-layover-life, null, undefined.

**5. Information and legal pages.** Standard root pages; several already exist.
about, contact, privacy, cookies, terms, legal, imprint, accessibility, faq, help, support, press, media, corrections, editorial-charter, community-guidelines, careers, jobs, advertise, sponsors, partners, affiliates, disclosure.

**6. Content hubs, current and planned.** The prompt names experts, places, picks, events, media, clips and itineraries, and each may need a root index.
cities, city, places, place, picks, pick, experts, expert, local-experts, events, event, facts, guides, guide, itineraries, itinerary, airports, airport, layover, layovers, stopover, stopovers, photos, photo, clips, videos, video, gallery, map, maps, stories, story, destinations, countries, country, regions, continents, states, travelers, contributors, expats, pets, newsletter, awards, blog, news, travel-wire, tags, topics, themes, collections, pursuits, pillars, marathons, marathon-diaries, shop, store, deals, trips, flags, votes, crew-approved, new, popular, trending, near-me, random, all.

**7. All country, state and region slugs.**
- This covers the 197 Countries and 198 Destinations slugs (cd_slugs.json) plus the 56 States and 100 Subdivisions slugs (misc.txt).
- No city or member should take georgia, jordan, chad, washington, new-york and the like.
- Places whose capital shares the country's name may take the root slug only after a decision on which page is canonical: singapore, luxembourg, monaco, vatican-city, san-marino and djibouti. Where the city is "[name] City" (mexico-city, panama-city, guatemala-city, kuwait-city), use that full form for the city.

**8. Held until a naming rule exists.**
- Each of these names two or more real places, and several are already in Stories.
- Proposal: keep the plain slug reserved, or use it as a short chooser page, and give each city a qualified slug such as /portland-oregon or /portland-maine.
- Schengen is held because the word also means the visa area.

portland, santiago, la-paz, santa-ana, valencia, salvador, westport, victoria, kingston, san-jose, cambridge, birmingham, alexandria, cordoba, merida, leon, hamilton, perth, schengen.

**9. Common words that are also city names.** Allow these as a city page only with Nancy's approval, and never as a member handle.
nice, split, bath, reading, mobile, marathon, normal, hope, paradise, batman.

**Note on members.** Members should not get root URLs at all. They already live under /contributors/ and /directory/, and the signed-in view is /profile. Keeping them there removes most of the risk in groups 3, 4, 7 and 9.

---

## Corrections made in the check

**Claims checked:**
- **list_pages:** 56 static pages (32 published, 24 drafts) and 40 templates, identical path for path.
- **get_collection_list:** 40 collections; Destinations id 6a0b29c702602326705dcfb1 matches worker/wrangler.toml line 21.
- **Layovers:** all 7 items, with their states and slugs.
- **Redirects:** all 14 CSV rows tested live, 13 returning 301 and /ads.txt returning 404.
- **list_301_redirects:** the 403 error.
- **robots.txt:** the single Sitemap line.
- **sitemap.xml:** 139 URLs and the per-segment counts.
- **Reserved slugs:** the six Webflow-reserved slugs and that each returns 404.
- **Live paths:** case sensitivity and trailing-slash behavior.
- **Countries and Destinations:** 197 and 198 items, with the 13 one-sided slugs.
- **Response headers:** server cloudflare, with the site id in surrogate-key.
- **The documentation claims** listed in the corrections below.

**Corrections:**
1. **Marathons (section 2b item 7):** the original said Berlin, Copenhagen, Tallinn and Tokyo "live at /marathon-diaries/...". That is wrong.
   - All 5 Marathons items are drafts, and 3 are also archived. Their slugs are race-specific (for example berlin-marathon-2026-prerace).
   - The three checked live URLs return 404, and the /marathon-diaries index page is itself a draft (404).
2. **Redirect on a published page (section 2c):** the original cited an unofficial community post and said the behavior was unobserved. Webflow's help center (via search summary) says you must delete, draft or re-slug a static page before you can redirect it, and the editor rejects such a redirect with "The old url is already a page on this project". Added the consequence: a published /copenhagen page and a /copenhagen redirect cannot coexist, while draft /copenhagen-stopover can take a redirect.
3. **CSV import replaces the table (sections 2c and 3B):** this is confirmed by official sources (via search summary): https://help.webflow.com/hc/en-us/articles/33961211526291 and https://webflow.com/updates/301-redirect-management. They replace the two community.webflow.com URLs, which could not be resolved or confirmed.
4. **Plan limits (section 3A):** the original said "300 static pages on Basic and CMS/Premium".
   - Basic has no CMS, so it is irrelevant to this site.
   - Premium has 300 static pages, 40 collections and 20,000 items, and existing CMS plan sites go from 150 to 300.
   - The "about 94" figure applies only if a 150-page limit still holds.
5. **Collection cap (section 3 summary):** made explicit that the site is already at 40 of 40 collections, so no new collection fits on the current plan.
6. **Euromonitor ranks:** the original said "Only ranks 1 to 10 are verified". The checker confirmed ranks 1 to 4, 9 and 10 through search summaries, with new source URLs added. Ranks 5 to 8 (Istanbul, Dubai, Mecca, Antalya) could not be re-confirmed.
7. **Worker routes (reserved group 4):** the original listed only /health, /notes, /photo and /publish.
   - The README and src also define /me, /places, /story, /story/mine, /story/update, /story/unpublish and /themes.
   - Added the missing words, and noted that the Worker is not on www.
8. **Webflow-reserved slugs (section 1e and group 2):** added the Ecommerce slugs (checkout, paypal-checkout, order-confirmation, product, category) and the Users page slugs, both from the Page URLs search summary. Also added that /index is invalid nested too.
9. **Sitemap counts (section 1d):** "/stories: 58" and "/layovers: 3" include the index pages. Restated as 57 and 2 item pages plus each index.
10. **Utility pages (section 1e):** /401 returns 404 live (no password page), and /404 answers 200 when requested directly.
11. **Capital-name list (section 2b item 3 and group 7):** taken from the Countries capital field. Kuwait, Panama, Guatemala and Mexico are "[name] City", so the advice is the full form, not the bare slug.
12. **Could not read:** added help.webflow.com, community.webflow.com, discourse.webflow.com and developers.cloudflare.com, all unresolvable in this session. Every documentation claim is marked as resting on search summaries.
13. **File status:** neither findings.md nor findings.before-check.md exists. Both Write attempts were refused by the harness, so the corrected findings are only in this reply.