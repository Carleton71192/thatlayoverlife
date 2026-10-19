# HANDOFF TO CLAUDE CODE · That Layover Life · 19 October 2026

Source of truth for design: `TLL Site Prototype 3.2.dc.html`, `TLL Account v5.dc.html`, `TLL Map Page v2.dc.html`, `TLL Map.html` (prototype map), `TLL Session 1 Spec · Stories, people, places, one library.dc.html`.
Rules: `CLAUDE.md` (standing rulings), `uploads/COUNT-RULES.md`, `uploads/STANDING-RULINGS.md`, `skills/tll-morning-review/SKILL.md`, `research/webflow-fix-list-2026-10-19.md`, `research/handoff-v5-review-2026-10-19.md`.
Build everything as unpublished edits. Nancy publishes all three domains. Never touch Memberstack blocks, legal wording or a contributor's submitted text.
Copy rules: US spelling, no em dashes, no exclamation marks. Never: filed, ship/shipped, ledger, "the shelf", "counted by hand", "real names", "Truth over polish", "No filler", "Currently in", "walked" as a counting rule.

---

## PACKET 1 · No new fields, no approval needed
Clicks and bindings. Do all, then one publish.

| # | What | Where | Reference |
|---|---|---|---|
| 1.1 | Bind story/country card links to their CMS pages (today: `/detail_stories`, `/detail_countries`) | /destinations, /stories, home, profiles | fix-list 1 |
| 1.2 | Bind card image to Stories › Hero image | all card lists | fix-list 2 |
| 1.3 | Footer counts bound, labeled "stories from N countries" | site footer | 3.2 `footerStats` |
| 1.4 | Remove "A human reviews every submission within 48 hours" from /stories, /submit, /account WRITTEN card, FAQ publish answer. Directory applications keep "reviewed within 48 hours" | 4 pages | ruling 2026-10-10 |
| 1.5 | Word sweep: filed→from / stories from / stories by; ship/shipped→publishes / goes live; "STORY FILED"→"HAS A STORY" | site-wide | handoff §1 Words |
| 1.6 | Home search bar: left aligned, full column width, placeholder fits at 390px | home | handoff §1 |
| 1.7 | Webflow responsive images on; hero 2400px max | all | fix-list 14 |
| 1.8 | Home map TopoJSON loads when the section is within 600px of the viewport | home | 3.2 `hmLoad` |
| 1.9 | Every click target is `<a>` or `<button>`; chips min 44px tall; visible focus | site-wide | 3.2 pattern |
| 1.10 | robots.txt: allow GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended | robots | fix-list 16 |
| 1.11 | 301 /destinations → /stories; remove Destinations from nav and footer; footer "Countries" → /stories#places | nav, footer, redirects | decision 07, approved |
| 1.12 | 301 /pets → /the-paw-passport; /share → /submit; /gallery → /the-layover-lounge (pending Nancy's 301 list) | redirects | rulings |
| 1.13 | Date format everywhere: "19 October 2026" | site-wide | ruling 2026-09-28 |

## PACKET 2 · Approved today, needs the fields created first
Nancy approved Session 1 decisions 01 to 07 and the review model on 19 October. Create fields, then build.

### 2.1 CMS fields
**Stories:** `author` (ref Contributors, required), `co-travelers` (multi-ref Contributors), `pets` (multi-ref Pets), `countries` (multi-ref Countries 6a8afbd98e907b41c4da109b, at least one), `link-url` (link, for link-out stories), `link-site` (text), `last-edited` (date), `edit-note` (text), `review-status` (option: live / on hold / resubmitted / removed), `hold-reason` (text), `hold-date` (date), `removal-rule` (text), `sponsor-name` (text, exists?), `sponsor-url` (link).
**Countries:** `story-count` (number, written by script), `answer` (text, two sentences, editor writes).
**Contributors:** `credit-mode` (option: full / first / pen), `pen-name` (text), `contact-mode` (option: relay / instagram / email / off), `share-ranges` (switch, exists), `share-level` (exists).
**Pets:** `shared-with` (multi-ref Contributors).

### 2.2 Backfill
Set `author`, `countries`, `pets`, `co-travelers` on every live story (the full CMS list, not only the 21 public). Spec: Session 1 §02 "Backfill". Jay: author on his story; co-traveler on Patagonia, Antarctica, Camino, Seven continents if he agrees.

### 2.3 /submit publish script
- Creates exactly one Draft per send (import made four copies).
- Writes the reference fields from the pickers; falls back to free text for people not on TLL.
- Publishes on passing the rules (headline, place, 300+ words or a confirmed link, own hero photo, it is travel, rights, links work, Charter). No email to Nancy. Writer gets the copy email with the live link.
- Sets `review-status` = live. Increments `story-count` on each referenced Country.
- Rich-text editor keeps inline photos (retires the "Photo placements" record).
- Link-out mode: stores `link-url`, `link-site`, the confirmed title/summary/image; card label "READ ON {SITE}"; opens in a new tab with `rel="noopener"`.
- Sponsored block: name + optional link rendered as the Reklame label at the top of the story, `rel="sponsored"`.
Reference: 3.2 /submit steps 1 to 3, `shareRules()`, `lkVals()`, `tagVals()`.

### 2.4 /stories (one library)
Build per the Session 1 spec §03 anatomy. By story / By place tabs, Where chips, Order chips, country filter via `?country=` and `?view=`. Atlas of all countries from the Countries collection with two conditional styles on `story-count`. Nested-list limit noted in the spec. Copy table in §05.

### 2.5 Country template
Story list filtered by `countries contains current`. Intro: "What is it like to travel in {Country}?" + `answer` field (fallback: newest story's lede, first two sentences). FAQ structured data from the same field. "Stories from {Country} · N stories".

### 2.6 Story template
Flag chips (first four referenced countries + "+N more") linking to hubs. Lede 19px, body 18px, lh 1.7, measure 720. "Published {date}"; "Edited {date} · What changed" only when `last-edited` is set (Charter 06). Article structured data (headline, image, datePublished, dateModified, author Person → profile URL). Fudge mode: one script + `tll_fudge` localStorage key, strip above the lede only when the text contains a listed word; swap list in 3.2 `FUDGE`.

### 2.7 Profiles live at sign-up
Superseded by `HANDOFF-PROFILES-2026-10-19.md` (public profile v2, edit profile v2, Travelers v2, pursuits, sign-up, counts). Build from that file.

### 2.8 /account
One count function per COUNT-RULES.md: Countries (Lived/Stayed minus Antarctica, "+ Antarctica" when ticked), Places of 249, Layovers beside, UN 193 beside, pets own count. "Last saved" + "Refresh from my account" (code fix: move the timestamp only after a successful save). Stories tab ON HOLD state with reason and "Edit and resend". Share card rendered server-side at 1080×1920, 1000×1500, 1200×630 with the options in Account v5 `scVals`; profile link carries `utm_source=share_card`.

### 2.9 Morning review
Schedule `skills/tll-morning-review/SKILL.md` at 07:30 Copenhagen. Hold = `review-status` on hold + Draft; Charter paused page and removed page (two static pages). Resend from /submit sets `resubmitted`.

## PACKET 3 · Needs a decision from Nancy before code
| # | Item | Decision needed |
|---|---|---|
| 3.1 | AI at publish: place suggestions (step 2) and the read-through (step 3). One API call each, inside the publish script | OK on the API key (rule 4) and the Charter privacy line |
| 3.2 | /share-photos upload destination | Worker to R2 recommended; Nancy to approve the add-on |
| 3.3 | Export the saved map as `tll-map-data.js` (pins, iso, lived, layoverOnly, magnus, stories) so prototype and live agree | New Caledonia yes/no; 249 or 250; Denmark for Magnus |
| 3.4 | Open Graph fetch proxy for link-out stories (small Worker) | OK under rule 4 |
| 3.5 | Public-profile country number | Written from the map on every save, or hidden for visitors |
| 3.6 | Hero buttons | Two (current) or four |

## Not ready for code (design review pending)
/travelers is now in the profiles handoff (Travelers v2, 19 Oct). Still pending: Lounge, home hero and Chapter 02 (Session 4), structural /account map work (flat Equal Earth default, hatch, summary band), Pursuit Hub (own handoff to follow once Nancy signs off the template).

## Verification per item
Side by side with the prototype screen at desktop and 390px: section order, copy, states (empty, partial, error), links, focus order. List every difference found and fixed in STATUS.
