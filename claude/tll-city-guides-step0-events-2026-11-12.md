# Events sources for Copenhagen: Step 0 audit (read only), checked version

Date: 12 Nov 2026. Task "events", checked under "check:events".

**About the file:** I did not create /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/cities/extra-events/findings.md or findings.before-check.md. This session's standing rules say not to write findings or report .md files and to return findings as text. The first reader's Write call was also blocked for the same reason. This report is the only copy of the corrected findings.

The only files I wrote are evidence: a shallow, read-only clone of the public repository github.com/danskernesdigitalebibliotek/dpl-cms (commit c78e228ce46b346ff3d583a567d0ac42b13a9095, dated 9 Mar 2026) at /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov12/cities/extra-events-check/raw/dpl-cms. The first reader's empty folders .../extra-events and .../extra-events/raw exist; I confirmed this.

I read the whole prompt at /home/user/thatlayoverlife/claude/tll-city-guides-local-experts-prompt-2026-11-12.md (172 lines). Three parts of it matter here. I checked each line number.
- **Line 40, the events decision:** Nancy approves sources once per city. Events from approved sources are pulled weekly and publish without a per-event approval. Each event shows its source and a link. Each source's terms must be checked, and official feeds or iCal are preferred. Events from unapproved sources or from member submissions go through the normal live-then-flag checks.
- **Line 66, the Events collection:** title, city, start, end, area, minutes from airport, type badge (Official, Community, Paid), listed by, link. Past events drop off by date.
- **Line 172, open question 4:** Nancy is to name the approved Copenhagen sources.

Two other rules affect this work. Line 50: anything that costs money is proposed with the price first, and the target is $0. Line 51: third-party scripts need approval first.

I wrote nothing to Webflow, Notion, Drive or git. I created no account, subscribed to nothing and submitted no form.

## 1. What I could not read

- **No source host answered in this session.**
  - **curl through the agent proxy:** "CONNECT tunnel failed, response 403". The first reader got this on 11 hosts. I got it again on bibliotek.kk.dk/api/v1/events, ihcph.kk.dk, www.kultunaut.dk, api.guidedanmark.org and www.tivoli.dk.
  - **WebFetch:** "getaddrinfo ENOTFOUND" (host outside the allowed domains) for www.folkebibliotekernescms.dk and www.kultunaut.dk. The first reader got the same for www.visitcopenhagen.com, visitorservice.kk.dk and www.cph.dk.
  - **GitHub API:** reading danskernesdigitalebibliotek repositories through the API or gh is not enabled for this session (HTTP 403). Plain git over HTTPS did work for the public dpl-cms repository, so the library API facts in A3 come from its source code.
- **No live feed URL has been fetched or confirmed to answer.** The library API path and fields are confirmed in the platform's source code, but https://bibliotek.kk.dk/api/v1/events itself was not reached.
- **Every other claim comes from web search results**, which give a summary and the result URLs. Quotes are as the search results showed them. Each one still needs a check on the live page before Nancy approves a source.
- **Not checked at all:**
  - any robots.txt
  - the full text of any terms page
  - live update timestamps
  - Webflow (the Events collection check belongs to the main Step 0 audit)
- **Hosts to allow so a follow-up run can confirm feeds and terms:** www.visitcopenhagen.com, www.wonderfulcopenhagen.com, visitorservice.kk.dk, www.kk.dk, bibliotek.kk.dk, brugbyen.kk.dk, ihcph.kk.dk, arbejdsmiljoe.kk.dk, cphmuseum.kk.dk, dansekapellet.kk.dk, www.cph.dk, www.tivoli.dk, kglteater.dk, www.drkoncerthuset.dk, www.smk.dk, en.louisiana.dk, amcham.dk, amchamdenmark.nemtilmeld.dk, www.internations.org, api.guidedanmark.org, portal.opendata.dk, www.opendata.dk, www.visitdenmark.dk, www.folkebibliotekernescms.dk, www.detdigitalefolkebibliotek.dk, www.kultunaut.dk.

## 2. Sources, one by one

"Feed" means iCal, RSS, JSON or an API. "Not found" means the search showed none; it does not prove there is none.

### A. City of Copenhagen (Københavns Kommune)

**A1. kk.dk (main municipal site)**
- **URLs:** https://www.kk.dk/brug-byen/kunst-og-kultur and https://www.kk.dk/indhold/kunst-og-kultur
- **What it lists:** I found no single city events calendar. The culture page points to brugbyen.kk.dk (A2).
- **Feed:** not found.
- **Terms:** I did not find the main kk.dk terms. A municipal sub-site has its own copyright page (https://arbejdsmiljoe.kk.dk/ophavsret-og-brug-af-materiale). Per the search, that page says:
  - texts, images, illustrations, leaflets, videos and talks belong to Arbejdsmiljø København and Københavns Kommune and are protected by copyright;
  - "Materialet må ikke anvendes, kopieres eller videreformidles uden forudgående tilladelse." (contact amk@kk.dk).
  - The first reader's quote of the opening sentence ("Alt skriftligt, visuelt og grafisk materiale på denne hjemmeside ... tilhører ...") could not be reproduced, so its exact wording is unconfirmed.
  - This is one sub-site's notice. It suggests, but does not prove, that the city's default is "ask first".
- **Open data:** Copenhagen's datasets on opendata.dk are mostly CC BY 4.0, but I found no events dataset. The nearest is "Booking data" for culture and leisure (https://www.opendata.dk/city-of-copenhagen/bookingdata). The data contact listed is bydata@kk.dk (https://www.opendata.dk/organization). I did not re-check this item.
- **Language:** Danish.

**A2. Brug Byen (https://brugbyen.kk.dk)**
- **What it lists:** according to kk.dk, "kulturarrangementer i Københavns Kommunes kulturhuse, idrætshaller og biblioteker", from concerts to author talks (https://www.kk.dk/indhold/kunst-og-kultur). I did not re-check this.
- **Feed and terms:** not found.
- **Language:** Danish.
- **End date, place, price:** not seen.

**A3. Copenhagen Libraries (https://bibliotek.kk.dk/arrangementer): the best feed candidate**
- **What it lists:** library events, which can be filtered by branch and category. Search snippets show date, time, branch and price ("free or costs DKK") for each event (https://bibliotek.kk.dk/arrangementer?f%5B0%5D=filial:230).
- **Platform:** the site runs on the shared CMS of Danish public libraries (dpl-cms).
  - The first reader said Københavns Biblioteker was the pilot library for this CMS, citing https://www.detdigitalefolkebibliotek.dk/folkebibliotekernes-cms and https://bibliotek.kk.dk/artikler/velkommen-til-bibliotekets-hjemmeside. My search did not confirm the "pilot" claim, so it is unverified.
- **Feed: confirmed in the platform's source code** (dpl-cms, commit c78e228, 9 Mar 2026):
  - **Endpoint:** web/modules/custom/dpl_event/src/Plugin/rest/resource/v1/EventsResource.php declares `"canonical" = "/api/v1/events"`, labeled "Retrieve all events". The 200 response is described as "List of all publicly available events."
  - **Filter:** an optional query parameter `from_date` ("Retrieve events which occur after and including the provided date. In ISO 8601 format.").
  - **Method and access:** config/sync/rest.resource.events.yml allows GET in JSON format. The anonymous role has the permission 'restful get events' (config/sync/user.role.anonymous.yml, line 28), so the default setup needs no login.
  - **Fields:** uuid, title, description, url ("An absolute URL end users should use to view the event at the website"), created_at, updated_at, image, state, all_day, date_time (start and end, both required), branches, address (location name, street, zip code, city, country), categories, tags, partners, ticket_categories (with price currency and value; "Not present for events without ticketing"), ticket_capacity, series, body, external_data, screen_names.
  - **No language field** exists, so "English-language events" cannot be filtered directly. A filter would have to use categories or tags.
  - **Not found:** the second path, /api/v1/events/happening, which the first reader took from https://github.com/danskernesdigitalebibliotek/dpl-web/pull/2093, is not in the dpl-cms code at this commit. That PR could not be opened (GitHub API 403).
  - The docs page https://www.folkebibliotekernescms.dk/main/integrationer/arrangements-api/ could not be fetched (ENOTFOUND), so the quote "Arrangementer er tilgængelige i JSON-format for hvert bibliotek via denne URL" and the named users (ticketing systems, KultuNaut, screen systems) are from search only. The code's `screen_names` and `ticket_manager_relevance` fields are consistent with those users.
  - **Live feed URL:** https://bibliotek.kk.dk/api/v1/events. NOT CONFIRMED live (proxy 403). The Copenhagen site could have changed the default permissions.
- **Terms:** I found no reuse terms for the API or the site. A public endpoint is not a license, so we need to ask the library.
- **Language:** mostly Danish (not checked against live data).
- **End date, place, price:** all three exist in the API schema (date_time.end is required; address; ticket_categories.price).

**A4. International House Copenhagen (https://ihcph.kk.dk/events): best fit for the "Moving here" tab**
- **Example event page:** https://ihcph.kk.dk/events/welcome-to-copenhagen-5
- **What it lists:** free social and information events for new international residents, on tax, banking, insurance, housing, volunteering and Danish culture.
  - The event collaboration page says: "we offer 10-12 social and informative events for new international citizens in Greater Copenhagen each year" (https://ihcph.kk.dk/meet-us/event-collaboration).
  - Welcome events "take place every other month". One example, in March 2026, was at Nyropsgade 1, free, with sign-up required.
  - The calendar also carries other events. On 12 Nov 2026 the search showed The Danish Tax System (12 Nov, 16:30 to 18:00), Children & Language (16 Nov), Buying a Home in Denmark (26 Nov) and The Danish Healthcare System (10 Dec). Most of these are online.
  - It also lists International Café meetups and the annual International Citizen Days (https://ihcph.kk.dk/events/international-citizen-days-2026-saturday).
- **Feed and terms:** not found. It is a kk.dk sub-site, so the "ask first" default in A1 likely applies.
- **Language:** English.
- **Update frequency:** several events a month.
- **End date, place, price:** place shown (or "online"), price "free", end time shown on some listings.
- **Note:** online events do not belong on a city page. The pull should keep in-person events only.

**A5. Copenhagen Visitor Service (https://visitorservice.kk.dk/en/events)**
- **Who runs it:** Københavns Kommune. It is the city's tourist information center at Vesterbrogade 4B, 1620 København V (visitorservice@kk.dk, +45 70 22 24 42; https://visitorservice.kk.dk/en).
- **What it lists:** a paged events list with type filters (https://visitorservice.kk.dk/en/events?type=3).
- **Feed and terms:** not found.
- **Language:** English.
- **Update frequency: it lags.** On 12 Nov 2026 the Christmas page said all its information is from 2025 and will be updated in November 2026 (https://visitorservice.kk.dk/en/events/christmas-events/christmas-and-new-years-in-copenhagen). Its event pages still showed 2025 dates, for example Christmas in Tivoli Gardens on 25 Dec 2025.
- **End date, place, price:** not verified.

**A6. Municipal venues with their own lists**
- **Venues:** Copenhagen Museum (https://cphmuseum.kk.dk/en/whats-on) and Dansekapellet (https://dansekapellet.kk.dk/en/events).
- **Language:** both have English pages.
- **Feed and terms:** not found. Not re-checked.

### B. Official tourism

**B1. VisitCopenhagen (Wonderful Copenhagen)**
- **URLs:** https://www.visitcopenhagen.com/copenhagen/things-to-do/events/events-in-copenhagen and https://www.visitcopenhagen.com/copenhagen/activities/events-copenhagen
- **Who runs it:** Wonderful Copenhagen, the official tourist organization for the region.
- **What it lists:** an events hub that links to a separate calendar. The search could not show the calendar's listings.
- **Feed:** none found for the site. See B2 for the data behind it.
- **Terms:**
  - I did not find the site's own terms.
  - **Copenhagen Media Center terms** cover photos and film only. They are at https://www.wonderfulcopenhagen.com/conditions-copenhagen-media-center and also at https://www.visitcopenhagen.com/copenhagen/conditions-use-material-copenhagen-media-center. Per the search:
    - Material is free "as long as all of the below stated conditions are upheld".
    - It may be used only in connection with the promotion of Copenhagen.
    - The photographer must always be credited.
    - Protected artworks in a photo need the artist's written consent.
    - Offensive use is barred; the example given is putting images on profit-making merchandise.
    - The Little Mermaid needs a special permit.
  - Editorial policy (not read): https://www.visitcopenhagen.com/copenhagen/this-is-copenhagen/about/editorial-policy
- **Language:** English.
- **End date, place, price:** not verified.

**B2. GuideDanmark, VisitDenmark's national tourism database (probably the data behind B1)**
- **Link to VisitCopenhagen:** VisitCopenhagen page URLs end in GuideDanmark-style IDs, for example "kulturhuset-islands-brygge-gdk414330" (https://www.visitcopenhagen.com/copenhagen/planning/kulturhuset-islands-brygge-gdk414330). This is my inference from the URL pattern; no page states it.
- **What it lists:** attractions, activities, places to stay, events and other experiences across Denmark.
  - The first reader quoted "omkring 30.000 ..." and "GuideDanmark er ejet af VisitDenmark" from https://www.opendata.dk/open-data-dk/guidedanmark-oplevelser-overnantning-aktiviteter-i-hele-danmark. My search did not reproduce that quote.
  - A 2021 EU tender notice says about 37,000 tourism products are registered (https://ted.europa.eu/en/notice/268472-2021/pdf).
  - A 2020 notice says VisitDenmark operates GuideDanmark on behalf of Det Digitale Partnerskab (https://ted.europa.eu/en/notice/630482-2020/pdf).
- **Feed, route 1 (live API):** https://api.guidedanmark.org/ (data model at https://api.guidedanmark.org/DataHelp).
  - It uses OAuth2 password-grant tokens from https://api.guidedanmark.org/token.
  - The first reader also reported that the help page says "The API is owned by VisitDenmark", that the API returns JSON or XML, and that the token is "currently, as a rule, valid for one hour" (https://api.guidedanmark.org/Help/Postman). Not re-checked.
  - **Price (confirmed by search, page not fetched):** the VisitDenmark page https://www.visitdenmark.dk/corporate/aktiviteter/guidedanmark-web-service says:
    - access is for tourism-industry actors;
    - VisitDenmark assesses each application on purpose and relevance;
    - there is **a one-time fee of DKK 5,000 excluding VAT**;
    - after approval it sends the technical documentation and access details;
    - the contact is guidedanmark@visitdenmark.com.
  - **This is a money item:** under the price-first rule, Nancy decides.
- **Feed, route 2 (static extract on opendata.dk):** Copenhagen experiences as JSON and XML, in Danish and English (https://portal.opendata.dk/dataset/guidedanmark-oplevelser-overnantning-aktiviteter-i-hele-danmark).
  - The portal's search filter lists CC BY 4.0 (https://www.opendata.dk/search?q=tags:oplevelser), but the license on the dataset page is not seen.
  - It is a one-off extract, so it is no use for weekly events.
- **Terms:** I found no API terms. A 2016 agreement exists but I did not read it (https://www.visitdenmark.com/sites/visitdenmark.com/files/2019-05/samarbejdsaftale_om_guidedanmark_2016.pdf).
- **Language:** Danish, English and German.
- **Update frequency:** continuous. VisitAarhus asks organizers to send events at least 8 weeks ahead (https://www.visitaarhus.dk/corporate/partnersamarbejde/faa-dit-event-med-i-visitaarhus-kalender; not re-checked).

### C. Copenhagen Airport

**C1. cph.dk press and news (https://www.cph.dk/en/about-cph/press)**
- **What it lists:** press releases and traffic news, not passenger events. Example: https://www.cph.dk/en/about-cph/press/news/2026/10/peak%20travel%20season%20continues%20into%20autumn
- **Feed:** no RSS found.
- **Terms:** a website terms page exists at https://www.cph.dk/en/terms-and-conditions/website (search title "Updated: 7th August 2023"). Its copyright wording was not seen. Commercial filming needs an agreement with the airport's VIP service (https://www.cph.dk/en/about-cph/press/non-press-related-recording).
- **Language:** English.
- **Fit:** not an events source. It is useful for the Phase 6 weekly fact check (line 149: "the weekly check watches the airport's own news page").

### D. Major venues and institutions

**D1. Tivoli Gardens: FLAGGED, forbids reuse without written permission**
- **URLs:** https://www.tivoli.dk/en/programme and the weekly page https://www.tivoli.dk/en/programme/concerts-and-events-in-tivoli-this-week
- **Feed:** not found.
- **Terms:**
  - **Legal Disclaimer** (https://www.tivoli.dk/en/legal-disclaimer). Per the search summary:
    - the content of the website is reserved;
    - reproducing material from tivoli.dk without Tivoli's written permission is prohibited, including images, logos, trademarks, written content, programs, typography and illustrations;
    - printing or downloading is allowed only for private, non-commercial use;
    - users in doubt must contact Tivoli first;
    - violations lead to legal steps for compensation.
    - The exact sentences could not be captured.
  - **Press room:** photos may not be used commercially without written permission (https://www.tivoli.dk/en/om/presse).
- **Language:** English.
- **Update frequency:** a weekly page exists.
- **End date:** seasons have end dates (Christmas season 13 Nov 2026 to 3 Jan 2027; not re-checked).
- **Price:** entrance-fee model.

**D2. Royal Danish Theatre (https://kglteater.dk/en)**
- **What it lists:** ballet, opera, drama and concerts on its stages, plus guided tours.
- **Feed:** not found.
- **Terms:** only the ticket sales terms were found (https://kglteater.dk/kgl/handelsbetingelser). There is no notice on reusing website content.
- **Language:** English.
- **End date, place, price:** run dates and venue are shown; price not verified.

**D3. DR Koncerthuset (https://www.drkoncerthuset.dk)**
- **What it lists:** concerts. The search did not reach the official calendar. The 2026-27 season brochure is in Danish (https://www.drkoncerthuset.dk/media/3skfeerl/drso_saesonbrochure26-27_digital_opslag.pdf).
- **Feed and terms:** not found.
- **Language:** mainly Danish.

**D4. SMK, National Gallery of Denmark (https://www.smk.dk/en/)**
- **Open API:** it covers the art collection, not events. Collection metadata is CC0 according to secondary sources (https://agentaccess.dk/sites/smk/api/smk-api, https://commons.wikimedia.org/wiki/Commons:SMK_-_Statens_Museum_for_Kunst).
- **Events feed and terms:** not found.

**D5. Louisiana Museum of Modern Art (https://en.louisiana.dk)**
- **Location:** Humlebæk, north of the city (distance not checked).
- **What it lists:** exhibitions, talks, tours and workshops. Listings are mirrored on https://artmatter.dk/en/artguide/calendar/introduction-roni-horn.
- **Feed and terms:** not found.
- **Images:** artwork images carry third-party rights (an ADAGP credit was seen).
- **Fit:** day trip only.

### E. Aggregator

**E1. KultuNaut: FLAGGED, no scraping or commercial reuse without a written agreement**
- **Terms page:** https://www.kultunaut.dk/perl/view/type-nynaut/betingelser. Per the search (page not fetched):
  - "Oplysningerne i KultuNaut stilles gratis til rådighed til privat brug."
  - "Kommerciel genbrug, systematisk kopiering, scraping, videresalg eller indlejring af kalenderens indhold kræver en forudgående skriftlig aftale med KultuNaut."
  - "Dette gælder ikke, hvis brugen allerede er tilladt gennem en af vores kalender- eller widgetløsninger eller følger af ufravigelig lovgivning."
- **Feed:** an RSS path (/perl/mini/type-rss) appears only on an unofficial third-party page. Not confirmed.
- **Language:** Danish.
- **Recommendation:** do not scrape or pull. The allowed routes are a written agreement or one of KultuNaut's own calendar or widget products. A widget is a third-party script, so it would need Nancy's approval and a before and after Lighthouse run (line 51).

### F. Expat and community groups

**F1. InterNations Copenhagen**
- **What it lists:** events for logged-in members only. There is no public feed (join page: https://in-cdn.net/copenhagen-expats).
- **Terms:** https://www.internations.org/terms-and-conditions/. Not read.
- **Fit:** poor. Pulling events would need an account. At most, use a static link-out.

**F2. AmCham Denmark**
- **URLs:** https://amcham.dk/upcoming-events/, with registration on https://amchamdenmark.nemtilmeld.dk
- **What it lists:** the site says it holds "more than 50 events a year" (confirmed in search): business breakfasts, webinars and an annual general meeting with a summit. Many events are for member companies.
  - The newest dated listings in the search index were from spring 2025 (for example https://amchamdenmark.nemtilmeld.dk/68), so I could not judge how current the calendar is.
- **Feed:** not found. The site runs on WordPress, but no calendar feed was seen.
- **Terms:** not found.
- **Language:** English.
- **Fit:** low.

**F3. Facebook group "Expats in Copenhagen"**
- **Name:** no group with that exact name was confirmed. Similar groups found:
  - "Expat Community: Copenhagen Denmark"
  - "Expats in Denmark"
  - "Beyond Stereotypes: Danes & Internationals"
  - Sources: https://www.expatfocus.com/?p=2868, https://www.thelocal.dk/20200702/the-facebook-group-building-bridges-between-danes-and-internationals
- **Feed:** none.
- **Terms (confirmed by search):**
  - The Meta Terms of Service say "You may not access or collect data from our Products using automated means (without our prior permission)" (https://www.facebook.com/terms/).
  - Meta's Automated Data Collection Terms say accepting them is not the needed written permission (https://www.facebook.com/legal/automated_data_collection_terms).
- **Fit:** not usable as a source. Members can submit events through the normal live-then-flag path (line 40).

### G. Press, for reference only

- The Local Denmark publishes a weekly English "On the agenda" post (https://www.thelocal.dk/20261031/on-the-agenda-whats-happening-in-denmark-next-week-8).
- Not a source to pull from; its terms were not checked.

## 3. Ranking by fit

None of the terms pages found grants reuse of event listings, so no source has clear reuse terms yet.

| Rank | Source | Feed | Reuse terms | English | Traveler and airport fit |
|---|---|---|---|---|---|
| 1 | Copenhagen Libraries JSON API (A3) | JSON GET /api/v1/events, public by default in platform code; live URL not reached | Unknown, ask | Mostly Danish; no language field | Low to medium |
| 2 | GuideDanmark API (B2) | API with login (not reached) | Unknown; application needed; DKK 5,000 excl. VAT one-time fee per VisitDenmark page | Yes | High |
| 3 | International House Copenhagen (A4) | None found | Unknown, ask | Yes | High for "Moving here" (in-person events only) |
| 4 | Copenhagen Visitor Service (A5) | None found | Unknown, ask | Yes | High, but updates lag |
| 5 | VisitCopenhagen (B1) | None found | Unknown (Media Center terms cover photos and film only) | Yes | High |
| 6 | Royal Danish Theatre (D2) | None found | None found | Yes | Medium |
| 7 | Copenhagen Museum, Dansekapellet (A6) | None found | Unknown | Yes | Medium |
| 8 | Brug Byen (A2) | None found | Unknown | No | Low |
| 9 | DR Koncerthuset (D3) | None found | None found | Mostly no | Medium |
| 10 | Louisiana (D5) | None found | None found | Yes | Day trip only |
| 11 | Tivoli (D1) | None found | Forbids reproduction without written permission | Yes | High, but blocked by its terms |
| 12 | AmCham Denmark (F2) | None found | None found | Yes | Low |
| 13 | SMK (D4) | Collection API only | CC0 for the collection only | Yes | No events feed |
| 14 | Copenhagen Airport (C1) | No RSS found | Terms page exists, not read | Yes | No events; use for fact checks |
| 15 | KultuNaut (E1) | Unofficial RSS | Written agreement needed, except via its own widgets | No | Do not pull |
| 16 | InterNations (F1) | None; members only | Not read | Yes | Needs an account |
| 17 | Facebook group (F3) | None | Meta bars automated collection without permission | Yes | Not usable |

## 4. Recommended starting list for Nancy

Before any source goes into the weekly pull, it needs a written yes from that source to listing title, date, place and a link. One email to the city (bydata@kk.dk or visitorservice@kk.dk) may cover sources 1 to 3.

1. **International House Copenhagen** (https://ihcph.kk.dk/events). English, free, municipal and made for newcomers; it feeds the "Moving here" tab. No feed was found, so the pull would read the public list page. Keep in-person events only.
2. **Copenhagen Libraries JSON API** (https://bibliotek.kk.dk/api/v1/events, with `from_date`). This is the only machine feed from an official Copenhagen body whose fields are documented in code. It has start, end, place and ticket price fields. It has no language field, so English events must be picked by category or tag, or by the Main Library branch. First confirm that the live URL answers.
3. **Copenhagen Visitor Service** (https://visitorservice.kk.dk/en/events). English and visitor-focused. Its information can be out of date, so past events must drop off strictly by end date.
4. **GuideDanmark, only if Nancy approves the cost.** It has the best English tourist coverage. Access needs an application to VisitDenmark and a one-time fee of DKK 5,000 excluding VAT (stated on the VisitDenmark page according to search; page not fetched). The target is $0, so by default leave it out and show a plain link to VisitCopenhagen's events page.
5. **Royal Danish Theatre** (https://kglteater.dk/en), optional. English calendar from a public institution. No terms were found, so ask before pulling.

Not for automated pulling:
- **Tivoli:** written permission needed.
- **KultuNaut:** written agreement or its own widget only.
- **InterNations:** members only.
- **The Facebook group:** no feed.
- **The airport:** no events.

Tivoli and InterNations can still appear as static links.

## 5. What each event card can show

Show the facts (what, when, where), credit the source and link to it. Do not copy the source's own writing or images.

Danish copyright law protects catalogues and databases against repeated and systematic copying of even small parts (ophavsretsloven section 71; https://danskelove.dk/ophavsretsloven/71 and the 1997 bill https://folketingstidende.dk/samling/19971/lovforslag/L94/19971_L94_som_fremsat.pdf, per search). A weekly pull is systematic, which is one more reason to get written consent. This is not legal advice.

Safe on every card:
- **Title:** the short name as the source writes it.
- **Dates:** start date and time, plus the end date when the source gives one. The end date also drives when the event drops off.
- **Place:** name and area.
- **Minutes from the airport:** worked out by TLL, not taken from the source.
- **Type badge:** Official, Community or Paid (the existing field). Show "Free" or "Paid" only when the source says so; copy no price amounts.
- **Source credit:** "Listed by [source]" plus a "Details on [source]" link to the event's own page (for the library API, its `url` field).
- **Language tag** when known ("In English").

Do not show:
- **The source's description or blurb.** For the library API this means the `description` and `body` fields. If a line is wanted, write one in TLL's own words, marked DRAFT for Nancy.
- **The source's images, logos or posters.** This includes the library API's `image` and `teaser_image`. Tivoli and the Media Center restrict these. Use no image, or a stand-in photo under build principles v1.1 section 5.
- **Anything from member-only sources** (InterNations, Facebook groups, AmCham member events).

---

## Corrections made in this check

1. **The file was not written.** I did not create findings.md or findings.before-check.md, because this session's rules say not to write findings files (the same block the first reader hit). This text is the corrected copy.
2. **A3 library API is now confirmed in source code** (dpl-cms commit c78e228). Confirmed: the path /api/v1/events, GET in JSON, anonymous access by default, the `from_date` filter, and the fields (start and end both required, address, ticket price). The first reader had "not verified".
3. **A3: /api/v1/events/happening was not found** in the dpl-cms code. It is now marked unverified.
4. **A3: there is no language field in the API.** The plan to "filter to English-language events" is changed to filtering by category, tag or branch.
5. **A3: the "pilot library" claim** was not confirmed by search. It is now marked unverified.
6. **A4: wrong source URL for the "10-12" quote.** It comes from https://ihcph.kk.dk/meet-us/event-collaboration. The quote is now full: "we offer 10-12 social and informative events ...".
7. **A4: update frequency** changed from "about monthly" to "several events a month", with the dated November and December examples. Added that most of those events are online, so only in-person events should be kept.
8. **A1: the arbejdsmiljoe.kk.dk quote.** The second sentence is confirmed. The first sentence's wording is not reproduced and is now marked unconfirmed. The "city default" is now framed as an inference from one sub-site.
9. **B1: second URL added.** The Media Center terms also exist at the visitcopenhagen.com URL. Added the artwork-consent and merchandise points.
10. **B2: DKK 5,000 fee upgraded** from "not confirmed" to "stated on the VisitDenmark page per search (page not fetched)". Added the contact address.
11. **B2: the "omkring 30.000" quote** was not reproduced. Added the 2021 TED figure of about 37,000 products and the operator note.
12. **C1: terms page found.** "Terms: not found" changed to the website terms page URL (contents not read).
13. **D1: Tivoli disclaimer filled in.** The clauses now come from search (private, non-commercial use only; contact first; legal steps). Exact sentences are still not captured.
14. **E1: KultuNaut exception added.** The terms exempt use through KultuNaut's own calendar or widget products. The recommendation changed from "do not use" to "do not pull; written agreement or its widget only, and a widget needs script approval".
15. **F2: AmCham's "more than 50 events" confirmed.** Noted that the newest listings in the search index were from 2025.
16. **F3: Meta terms quote confirmed** (it was "as I recall"). Added the Automated Data Collection Terms URL.
17. **Section 5: the section 71 wording is now sourced** (repeated and systematic copying of small parts). Added the library API fields not to copy.
18. **Prompt lines confirmed.** Lines 40, 66 and 172 are as stated. Added the line 40 tail (unapproved sources and member submissions) and lines 50 and 51 (money, scripts).
19. **Hosts list** extended with the hosts that failed in this check or are needed for the corrected claims.

Checked and correct as written: lines 40, 66 and 172 of the prompt; the Visitor Service "information is from 2025 and will be updated in November 2026" notice and its address; the IHCPH "every other month" and topic list; the Media Center "as long as all of the below stated conditions are upheld" line at the wonderfulcopenhagen.com URL; the KultuNaut first two quoted sentences; the empty extra-events and raw folders.