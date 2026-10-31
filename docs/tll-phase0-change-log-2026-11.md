# Phase 0, fix and protect: change log (staged 31 Oct 2026, nothing published)

**Read for this phase:**
- Nancy's Phase 0 prompt.
- The "TLL build order and brand refresh" doc.
- The live Webflow head, footer and page code, saved before and after in `scratchpad/p0-1031/`.

**Not available in this session:** tll-p0-recheck-2026-10-31, tll-site-review-2026-10-29, the privacy guardrails, the AdSense readiness prompt and the performance baseline. The P0 list below comes from the prompt itself.

**Network:** this sandbox cannot reach thatlayover.life, so the re-check, Lighthouse and axe runs, and live screenshots could not be done. Each fix was tested against the saved code, and the consent tool in a browser with a stand-in consent message. To run the checks here, allow www.thatlayover.life in the environment's network settings.

Everything below is staged in Webflow: page code, site head, CMS fields and site layers 16.48.0 applied but not published. **One publish makes all of it live together.**

## Fix order
1. Consent
2. False ad label
3. Privacy leaks
4. Things that look broken
5. Featured content and dead links
6. Counts and small truths
7. Quick wins

---

## 1. Consent (P0 1 and 2)

**The decision:** one consent tool, Google's certified "European regulations" message (Funding Choices, IAB TCF v2.2). TLL's CookieConsent banner is retired, so two banners can no longer disagree.

| Where | Before | After | Why |
|---|---|---|---|
| Site head | AdSense script loaded on every page at first paint ("publisher verification", 29 Oct). Ahrefs analytics loaded at first paint. GA4 held back by CookieConsent. CookieConsent stylesheet. | AdSense verification by meta tag only. A new consent block runs first: Google tags default to denied (Consent Mode v2), Google's consent message loads, GA4 and Ahrefs load only after analytics consent. Outside the EEA and UK the message reports GDPR does not apply and tags load. | No ad or analytics request before a choice |
| Site layers, `tll-ads-v1` | Loaded adsbygoogle on story, library and country pages straight away | Loads it only after ad consent | Same |
| Site layers, consent file | Defaults plus CookieConsent updates | Defaults only if the head block is missing | One source of truth |
| Footer, CookieConsent | Banner opened after page load; "Cookie settings" threw an error | Still loads (left untouched), but the head block stands in for it, so it never shows. Its old link handler and the GA4 events gate now read the new tool. | No footer rewrite needed; one banner |
| "Cookie settings" anywhere | Opened nothing | Reopens Google's consent message on every page | P0 2 |

**How consent maps to Google's signals:**

| Consent mode signal | Requires TCF purposes |
|---|---|
| ad_storage | 1 |
| ad_user_data | 1 and 7 |
| ad_personalization | 3 and 4 |
| analytics_storage | 1 and 8 |

**Tested in a browser with a stand-in consent message:**
- Before a choice, nothing loads.
- Accept loads GA4 and Ahrefs.
- Reject loads nothing.
- Outside the EEA, everything loads.
- "Cookie settings" reopens the message.
- The old banner stays hidden.

**Nancy, in AdSense (Privacy and messaging):**
- Keep the European regulations message on.
- Turn on "Consent Mode" support.
- Turn on the US state regulations message if you want it.

### Policy text for /cookies and /privacy (draft, apply after approval)

What loads, and when:
- **Webflow:** hosting and forms. Always.
- **Cloudflare:** the TLL Worker API at tll-travel-wire.thatlayoverlife.workers.dev, for profiles, stamps, album and summaries. Always, and no cookies.
- **Memberstack:** sign-in and member data. Necessary cookies.
- **jsDelivr and cdnjs:** site scripts. Google Fonts: type. No cookies.
- **Google Funding Choices:** the consent message. It stores your choice in the FCCDCF and FCNEC cookies.
- **Google Analytics 4** (G-T1K83PRL1R): only after analytics consent.
- **Ahrefs Web Analytics:** only after analytics consent. Ahrefs says it uses no cookies.
- **Google AdSense:** only after ad consent, and only on story, library and country pages.
- **Cloudinary:** member photo uploads. Location data is removed before upload.
- **Ko-fi:** only when you click a Ko-fi link.
- **LinkedIn:** a plain share link, with no LinkedIn script on our pages.

Legal entity wording stays entity-neutral until the Site settings record is filled.

---

## 2. False ad label (P0 3)

| Where | Before | After |
|---|---|---|
| Stories template head, `tll-label-js-v1` | Built "Reklame for …" from the Disclosure line, so "Paid for by the traveler" read "REKLAME FOR THE TRAVELER" | Reads the story's own **Sponsor name** and **Sponsor URL** fields. The label shows only when both are filled, with the name linked in a new tab with rel="sponsored noopener noreferrer". Self-paid stories show no label. |

**Nancy:** for any hosted or sponsored story, fill Sponsor name and Sponsor URL. The Disclosure line alone no longer makes a label.

---

## 3. Privacy leaks (P0 4 and 6)

| Where | Before | After |
|---|---|---|
| /my-passport | Forwarded to /the-map by script, but the page HTML still carried Nancy's personal details ("with Jay", "Next on the spreadsheet", Romania, Estonia) | Page set to **draft**, so it leaves the site on publish. **Nancy: add a 301 /my-passport to /the-map in Site settings before publishing.** |
| Visits, Bookmarks, Comments templates | noindex only; /visits/nancy-carleton-luxembourg-city-2026 answered 200 | noindex plus an immediate redirect away (Visits to /the-map, Bookmarks to /account, Comments to /stories) |
| Photo submissions, Press applications, Photo placements templates | Nothing | noindex plus a redirect |
| Profiles | Home base shown to everyone; the Person structured data carried the home base | Home base hidden unless the member switches it on (Nancy, 31 Oct: "Yep"). No home location in structured data. |

**Still open, needs Nancy:**
- A redirect still serves the page HTML for a moment.
- **To close it fully:** in the Designer, remove the bound fields from the Visits, Bookmarks, Comments, Photo submissions and Press applications template bodies, or password-protect those templates, and untick "Include in sitemap" for those collections. Either way, the API can't do it.

**Privacy sweep of live stories** (these are your words, so I didn't change them):
- `amsterdam-stroopwafel-time`: "my son Freed" names a child, if he is under 18.
- `sort-sol-black-sun-denmark`: "We are signing up for next year." This is a future plan on a public page.

The other pattern hits were history ("the next year" in past tense).

---

## 4. Things that look broken

| Where | Before | After |
|---|---|---|
| /the-paw-passport guide and the home "Get the guide · €9" link | No Ko-fi link | **Left hidden.** The Ko-fi URL is not in the project, and the guide needs your confirmation that it was checked against Regulation (EU) 2026/131. Send both and it goes in. |
| /contact | Member-to-member relay form ("through TLL") | Hidden. A ?relay= link explains members choose how to be reached. Profile buttons that pointed at the relay are hidden. |
| /support | "Six doors. Pick yours." white on cream | Ink (#0A0B14 on cream, well above 4.5:1) |
| /stories search | 0px-wide input on phones; matched card text only | Full width on phones. Also matches title, place, country and body words from an index loaded only when someone searches. Tested on the index: Kilimanjaro, Toubkal, Patagonia and whale sharks each find their story. New stories are matched on their card text until the index is rebuilt. |
| /the-map | "Open full screen" opened a panel with no map; "Edit my destinations" showed to visitors | The button is hidden (the full-screen code lives in the map's own script); "Edit my destinations" shows to members only |

---

## 5. Featured content and dead links

| Where | Before | After |
|---|---|---|
| Thailand stub `/stories/the-art-of-wellbeing-thailand-luxury-health-destination-2026` | Indexed; could appear in rails | noindex, and hidden from every rail and featured spot. Already off Cover candidate and gallery. **Recommend unpublishing:** it is a thin piece with no writer's trip in it. |
| Home value row | Foodie, Marathons and Trekking linked to /pursuits/* (404) | Each opens a library search (food, marathon, trek) until the hubs are built. Dog travel goes to the Paw Passport. |
| Cover story | | Already editor-picked by the **Cover candidate** field, rotating weekly. Nothing changed. |

---

## 6. Counts and small truths

| Where | Before | After |
|---|---|---|
| Home shelf note | "06 stories · they move sideways", next to "58 stories" | Counts the cards actually on the shelf: "[n] newest stories". The site total stays bound to the sitemap. |
| Home cover credit | "Nancy Carleton went to Qatar" (reads like a live check-in) | "Photo: Nancy Carleton" with the place on the line below. The cover byline also shows map coordinates such as "38.98° N 1.43° E". These are about 1 km precise; **recommend removing.** Say yes and I'll take them out. |

---

## 7. Quick wins

- **Done (staged):** noindex on /spotlight, /awards and /creators, and on contributor profiles with no stories.
- **Needs Nancy in Webflow, Site settings, 301s:**
  - /for-affiliates to /creators
  - /countries to /destinations
  - /my-passport to /the-map
- **Navigation links** to /spotlight, /awards and /creators sit in the nav and footer components. Those wait for a session together.
- **Not done, needs your words or a Designer edit:**
  - Relabel the home expat cards ("Moving guide (Ko-fi)" needs the URL; "Visa tracker: coming soon, get notified").
  - The contributor deal on /submit. Proposed text: "Your story stays yours. You give TLL the right to publish it here and in our newsletter. It goes live when you press send, and Nancy checks it after. AI never writes your words; anything AI made is labeled."
  - Please confirm this matches your 19 Oct decision and every page that mentions review timing.

---

## Needs Nancy
1. Approve publishing, after adding the three 301s.
2. The Ko-fi URL and the EU guide check.
3. Thailand stub: unpublish?
4. Designer: remove bound fields from the member-data templates, or password-protect them.
5. The privacy flags in two stories.
6. Cover coordinates: remove?
7. The marathon diary: untouched, as asked.
8. The nav and footer link changes: a session together.
9. AdSense: Consent Mode support on.
10. Allow www.thatlayover.life in this environment's network settings so the re-check, Lighthouse and axe can run.

## Not done, and why
- **Live re-check, Lighthouse before and after, axe, live screenshots:** the sandbox cannot reach the site.
- **Policy page text:** drafted above. The pages are edited in the Designer, after your approval.
- **"Featured/cover story editor-picked":** already true, so nothing to change.

## Rollback
- **Site layers:** re-apply 16.47.0.
- **Head, footer and page code:** originals in `scratchpad/p0-1031/before/`.
- **/my-passport:** set draft off.
