# Claude Code prompt: TLL place links (Google Maps, Tripadvisor, Yelp) and experiences affiliate

Received from Nancy in the cloud session on 12 Nov 2026. Saved as given. Note from the session: the base prompt it names, claude/tll-city-guides-expert-bench-build-prompt-2026-11-12.md, is saved in this repo as claude/tll-city-guides-local-experts-prompt-2026-11-12.md; the research file and the three other files it names were not in the repo when this was saved.

Date: 12 Nov 2026 Research: claude/tll-places-integrations-storm-2026-11-12.md (read first; it has the licensing facts and sources) This is an add-on to claude/tll-city-guides-expert-bench-build-prompt-2026-11-12.md. Use its Places collection, change-log process, voice rules and "Done means" section. Do not build a second Places collection. Also read: claude/tll-build-principles-2026-10-31.md, claude/tll-consent-schema-stay22-prompt-2026-11-11.md, claude/tll-tools-integrations-review-2026-11-11.md (script cap).

You are working on That Layover Life (thatlayover.life): Webflow CMS, Memberstack, the one server function from Flows v2. Work through the Webflow and Memberstack MCP tools.

## Goal

Readers get from a TLL story or pick to directions, hours and outside ratings in one tap, and TLL earns on bookable experiences, without importing anyone's reviews and without adding page-load scripts. Target cost: $0.

## Rule zero: link out, never import

* Store the Google place ID only (it may be stored indefinitely). Never store, cache or display Google, Tripadvisor or Yelp ratings, review text, photos or hours in the CMS.
* No Tripadvisor or Yelp API. No scraping services (Apify, Bright Data, SerpApi or similar). No blended or averaged star score anywhere.
* TLL's own signals only: "Crew Approved" and "Picked by N locals".
* No AggregateRating markup that uses outside ratings.

## Defaults (Claude's recommendation; Nancy to confirm after Step 0, build with these meanwhile)

1. Yelp link shows on US places only (field present on every place, rendered only when country is United States and the field is filled).
2. Experiences partner: GetYourGuide only to start. Viator later if a city has better inventory there.
3. City page map: if Stay22 is already on the page, its map is the only map (Crew Approved pins on it if Stay22 supports custom points; report what it supports). Otherwise a Google Maps Embed iframe behind a click-to-load placeholder. Never two maps on one page.

## How to work

Same rules as the city guides prompt: Step 0 audit first, Design then Edit then Implement with a change-log table per phase, drafts and staging only, Nancy publishes, nav and footer untouched, honest states, ask before any third-party script with Lighthouse before and after, Emil Kowalski, Taste and Impeccable design skills, WCAG 2.2 AA, US spelling, no em dashes, no word containing s-h-i-p, never "l-e-d-g-e-r", "No filler", "Truth over polish" or "real names". Mark every line of copy you write as DRAFT.

Anything that needs an account, a card or a contract (Google Cloud billing account, GetYourGuide partner account) is Nancy's to create. Tell her exactly what to sign up for and what to send back; do not create accounts.

## Step 0 audit (report before changing anything)

* Is the Places collection from the city guides prompt live yet? Which fields exist? If not built, stop and say so: this add-on waits for it.
* Is a Google Cloud project with a restricted API key already set up for TLL? (Check Webflow settings and the server function's env vars; do not print the key.)
* Is the CMP (consent banner) live, and what category names does it use? Is Stay22 live, and on which pages?
* Current page-load script count against the cap.
* Any existing outbound links to Google Maps, Tripadvisor or Yelp in stories (count them; these become place tags later, not now).

## Phase 1: Place fields and the place ID resolver

* Add to Places (if missing): google_place_id (text), maps_url (text, generated), tripadvisor_url (link), yelp_url (link), gyg_url (link, affiliate), country (ref, already planned), links_checked (date).
* maps_url is built, never typed: `https://www.google.com/maps/search/?api=1&query=<URL-encoded name, city>&query_place_id=<place ID>`. No API key is needed for Maps URLs.
* Resolver route on the server function: input a pasted Google Maps link or "name, city"; call Places API (New) Text Search with field mask `places.id` only (the ID-only request is no-cost); return candidates (name and address from the user's input or the link, not from stored Google data) for the contributor to confirm. Keep the API key server-side, restricted to Places API (New) and the function's origin. Set a Google Cloud budget alert at $1 and a daily quota cap; report both.
* Wire the resolver into the "Add a new place" step of the story, photo and pick forms (city guides Phase 2). Paste a Maps link or type a name; one tap to confirm.
* tripadvisor_url and yelp_url are optional plain URL fields the contributor or Nancy can paste. Validate the domain only (tripadvisor., yelp.). No fetching from those sites.
* Quarterly job: refresh each stored place ID with an ID-only call; if Google returns a new ID, update it; if not found, set "needs recheck" and create a Notion "TLL Flags" row.

Done when: pasting a Google Maps link in a test pick stores the place ID and a working maps_url, with zero Places API cost showing in the Cloud billing report for that day.

## Phase 2: The button row ("Where to next")

* One Webflow component used on: pick cards, place tiles, place pages, itinerary stops, layover guide recommendations.
* Buttons in this order, each rendered only when its field is filled: Directions (maps_url), Tripadvisor, Yelp (US only per default 1), Book (gyg_url).
* Plain links, target="_blank", rel="noopener". Book gets rel="sponsored noopener" and a visible "Affiliate" label next to it (her rule: anything affiliated shows as such). Outside review links get rel="nofollow noopener".
* Outside brand names as text; use official logos only if each brand's guidelines allow it on a third-party site, otherwise text. Report what you chose and why.
* No script. 44px targets. Works without JavaScript.
* Microcopy (DRAFT, for Nancy's pass): section eyebrow "WHERE TO NEXT"; helper line under the row: "Our story, their stars. Hours and reviews live on these sites and change faster than we do."
* Event: place_outlink_click with type (maps, tripadvisor, yelp, book), after analytics consent only.

Done when: a test place with all four fields shows four buttons on mobile in one row or a clean two-by-two, each opens the right page in a new tab, and Lighthouse shows no new requests on page load.

## Phase 3: One map per city page, behind consent

* Follow default 3. If using the Google Maps Embed: render a static placeholder (a TLL-styled card or a member photo of the city, not a screenshot of Google's map) with "Load map (Google Maps sets cookies)" and a link to the privacy page. The iframe loads only after the visitor taps and the CMP shows the right category is granted. Remember the choice through the CMP, not your own cookie.
* Itineraries: one "Open the whole route in Google Maps" link built with the Maps URLs directions format (origin, destination, waypoints from the stops' place IDs). No embed needed.
* Add Google Maps to the privacy policy's embedded-services list (DRAFT text for Nancy).
* If Places data is ever shown on a map, it must be a Google map (not needed in this build; note it in the change log so nobody mixes them later).

Done when: with consent declined, a city page makes zero requests to google.com or gstatic.com (network panel screenshot); after "Load map" plus consent, the map appears; the itinerary route link opens all stops in order.

## Phase 4: GetYourGuide on city pages and layover guides

* Prerequisite: Nancy creates the GetYourGuide partner account and sends the partner ID. Until then, build the slots in staging with the field empty (slots do not render when empty).
* Placement: city page "Longer trips" and the "How long have you got?" tabs (activities that fit the time window, for example "Got 6 hours?"), and the top-10 airport layover guides. Never inside a member's story body unless the member labeled it themselves.
* Use deep links on specific activities first (gyg_url on Places and a small "Bookable" list per city tab). Only propose GetYourGuide's widget if links underperform after a month; the widget is a script and needs consent and a slot under the cap.
* Every slot carries the "Affiliate" label and a one-line disclosure linking to the disclosure page. Picks by experts never get an affiliate link added by TLL without the expert's opt-in.
* Event: affiliate_click with partner and city.

Done when: the Copenhagen page shows at least three labeled, working GetYourGuide links in the right tabs, each with Nancy's partner ID, and the disclosure line renders on every slot.

## Phase 5: Schema and search

* Place pages: Restaurant, CafeOrCoffeeShop, Bakery or TouristAttraction (by type) with name, address only if the contributor entered it, geo only if the contributor entered it, and `sameAs` listing maps_url, tripadvisor_url and yelp_url when present. No ratings from outside.
* If Crew Approved counts are marked up at all, they must be visible on the page, come from members directly, and never be incentivized without disclosure. Propose it; do not add it in this build.
* Place pages stay noindex until they have two mentions (city guides Phase 2) and pass the city index bar.
* Validate with the Rich Results Test and Schema.org validator; screenshots in the report.

## Open for Nancy (one message after Step 0)

1. Confirm the three defaults: Yelp US only; GetYourGuide only to start; Stay22 map or click-to-load Google map as the single city map.
2. Sign up for GetYourGuide's partner program and send the partner ID.
3. Approve a Google Cloud billing account with a $1 budget alert for the resolver (expected cost $0), or say no and contributors paste Maps links only (resolver off).
4. Approve the helper line and button labels.

## Done means

Change log in the TLL project; before and after screenshots at 1440 and 390; network-panel proof that nothing loads before consent; Cloud billing screenshot after a week of testing; a test report with one test per rule above; a list of anything unfinished and why.
