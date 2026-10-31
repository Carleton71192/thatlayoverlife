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
