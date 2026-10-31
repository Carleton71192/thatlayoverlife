# Value Playbook: change log, Phases 0, 0B and 1 (31 Oct 2026)

For Nancy's approval. Nothing below the line "Needs your yes" is live.

## Done (reversible, or already approved)

| Page | Element / field | Before | After | Reason |
|---|---|---|---|---|
| CMS Contributors | Field `currently-in` | "Currently In", help text: live location line, public profile | "Currently In (retired)", help text: never a current location, leave empty | Privacy rule: never a "currently in" status. No profile had a value, so nothing on the site changed. |
| /the-paw-passport | Paid guide card: €9, "Get it on Ko-fi", price meta | Hidden already | No change | P0 "buy button on the pet guide": verified hidden in the Designer and not re-shown by any site script. |
| All upload forms | Photo GPS | Stripped on /submit, /edit-profile, /my-pets (photo-clean) and /share-photos (photo-send) | No change | Verified: every photo is redrawn on a canvas before upload, so no EXIF or GPS leaves the browser. |
| Story pages, country pages | tll-ads-v1 (16.29.0) | "Advertisement" label, mid-story ad from 6 paragraphs | "Annonce" label, no in-article unit under 600 words, never before the third paragraph, one unit under the stories on country pages | Phase 0B spec. Units still wait for slot IDs. |
| Home (preview only) | New section under the cover, tll-home-value-v1 | None | Value line, the three playbook lines, "What do you collect?" with Food, Marathons, Trekking, Dog travel and Join free | Phase 1. Shows only at /?preview=value (and ?preview=off to clear). |

## Needs your yes

| # | Change | Why | What you do |
|---|---|---|---|
| 1 | Publish the home value section (flip PUBLIC to true) | Phase 1 | Look at https://www.thatlayover.life/?preview=value on phone and desktop, then say yes or edit the copy. |
| 2 | One consent tool: Google Privacy & messaging (free, Google-certified, Consent Mode v2) replaces the CookieConsent banner | AdSense in the EU/EEA needs a Google-certified CMP; two banners is one too many | AdSense > Privacy & messaging > European regulations > Create message (site thatlayover.life, languages English and Danish, "Consent or Manage options", turn on Consent Mode). Tell me when it is published and I remove the old banner and switch GA4 to the same signal. |
| 3 | ads.txt | Required so ads earn | Webflow > Site settings > SEO > ads.txt: paste `google.com, pub-7257230007536660, DIRECT, f08c47fec0942fa0` and publish. |
| 4 | Auto ads off | Spec: manual units only | AdSense > Ads > By site > thatlayover.life > edit: Auto ads off (also vignette and anchor). |
| 5 | Two ad unit IDs | Manual units cannot show without them | AdSense > Ads > By ad unit: create "TLL in-article" (In-article) and "TLL display" (Display, responsive), send me the two slot numbers. |
| 6 | Pet guide intro line "is the part you pay for" | Copy promises a paid product while the buy button is hidden and the trademark is not cleared | Keep, or change to your wording. I do not edit it without you. |

## Still blocked

- The site review doc (tll-site-review-2026-10-29.md) and the other four docs the prompt names are not in the repo or your Drive (only a May 2025 "Site Review" exists). The 12 P0s above were rebuilt from the playbook's own Now row: consent, privacy leaks, buy button. Upload the doc to check nothing is missing.

## Phase 2: pursuits and stamps (31 Oct, 16:28 UTC)

| Page | Element / field | Before | After | Reason |
|---|---|---|---|---|
| CMS Pursuits | New fields | Name and slug only | Display name, Intro, Stories (the hub's stories, kept on the pursuit because Stories is at 60 fields), Members, Stamps, Live stories, Writers, Indexable | Hubs need content and the counts behind the index rule |
| CMS Pursuit stamps | New collection | None | One row per stamp: what, country, city, month, year, photo, Show on profile (drafts only) | Playbook: "what, where, when, one photo" |
| /edit-profile | 05C · Pursuit stamps | None | Log stamps per pursuit; per-pursuit "Show on my profile", off by default | Same privacy shape as collections |
| /contributors/* | Pursuits shelf | None | Badge per shown pursuit with stamps and countries counted, stamps with the year only | The site already promises "Stamps show years only" |
| /pursuits/* | robots meta | Indexable | noindex until 6 live stories from 3 writers and an 80+ character intro | 19 Oct index rule |
| Home preview | Dog travel button | /pursuits/dog-travel | /the-paw-passport (UTM campaign paw-passport) | Merged dog travel hub |

Needs your yes or words: hub display names ("That Global Marathon Life" style) and intros; which stories belong to each hub (tick them in the Pursuits item); month on public stamps (stored, hidden today).

## Phase 3: continent album and Slide Show (31 Oct, 16:37 UTC)

| Page | Element | Before | After | Reason |
|---|---|---|---|---|
| /contributors/* (preview only: ?preview=album) | The album | None | Seven slide mounts with washi-tape labels ("Europe", "23 photos · 4 countries"); "Not yet" in grey; a penguin on an empty Antarctica | Playbook profile item 1 |
| Same | Slide Show | None | Full screen, one photo per slide, mono caption, story line and link, projector click (off by default), arrows, swipe, Esc, Share link ?play=<continent> | Playbook: "the uncle deck, done right" |
| Worker | GET /album | None | Photos from live stories plus shown collections and stamps, placed by country | Public data only |

Counts on the tape are photos and countries in the album, not the member's whole map (the map stores totals only). Open questions from the playbook: Slide Show for logged-out visitors (today yes, profiles are public); which continent cover to use (today the newest story's hero).
