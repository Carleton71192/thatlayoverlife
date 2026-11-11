# Photo hold: member photos wait for you before anyone sees them (11 November 2026)

For Nancy. Nothing in this note is live yet. Nothing was deployed, released or published, and nothing changed in Webflow.

## In short

- Since the Worker deploy of 11 November, 13:28 UTC, a photo a member sends on /share-photos would go public within minutes, with nobody looking at it first. The page tells the member the opposite.
- No photo has gone through that path yet. The Photo submissions collection holds 0 items.
- The fix is built and tested (421 tests pass). It has two parts. Either part alone closes the gap. Both are needed for the full fix.
- **Part 2 needs you:** one command on your Mac deploys the Worker. Until Part 1 or Part 2 is live, the first member photo still goes public unreviewed.

## What was wrong

1. **Photos went live at once.** The Worker created each member photo as a published CMS item, and the Lounge code on /gallery put the newest twelve at the front of the grid within about five minutes.
2. **The page said otherwise.** The form and its thank-you box say "A human looks at every photo before it goes up". Right after that box, a second line said the photos were already in the Lounge.
3. **The member's name was in the web address.** The item name, the URL slug and (with no caption) the alt text all carried the member's name, also for a member who picked "Pen name only" or "Anonymous Traveler".
4. **The credit ignored the member's byline choice.** The photo was credited with the name on the member record, even when the profile says first name only or pen name.
5. **A tick that proves nothing was stored as consent.** The two boxes "On our Instagram and LinkedIn" and "On the homepage" are served already ticked, and the Worker stored the first one as permission for social.
6. **Any Cloudinary link was accepted.** The Worker took a photo link from any Cloudinary account and any folder, so a file that never went through the page's location-data removal could have reached the Lounge.

## What changes, and when

### Part 1: the page stops sending photos to the Worker

- **Takes effect:** with the next site code release from this repo (the one after 16.58.0). No Worker deploy needed.
- **What it does:** on /share-photos, the form still goes to Webflow exactly as before. The second step, which handed the photo to the Worker, is switched off by one line in `src/site-layers/tll-intake-v1.js`: `var HOLD_PHOTOS=true;`.
- **Stories and link-outs on /submit are untouched.** They still reach you as drafts.
- The line that said the photos were in the Lounge is gone from the code for good, with the hold on or off.

### Part 2: the Worker keeps photos as drafts

- **Takes effect:** the moment the Worker is deployed. No Webflow publish needed.
- **What it does:**
  - Each photo is saved as a **Draft** item in Photo submissions. The Worker never publishes it.
  - Moderation stage is **Received**, Review status is **pending**, and "Gallery published at" stays empty.
  - The item name is the place, a batch code and a number, for example "Sofia, Bulgaria · bmhv1abc · 1". The slug and the alt text are built the same way. No member name in any of the three.
  - The credit follows the member's own byline rule from the profile: full name, first name, or pen name. "Anonymous Traveler" gives no credit. A member who picked a pen name and has none on the profile gets no credit, never the real name. If no credit choice arrived, "Credit preference" reads "not chosen".
  - "Social opt-in" is recorded as off for now, whatever the box said. The Webflow form copy still holds what was sent. "Press interest opt-in" is recorded as sent, because that box is served unticked.
  - Only photo links from your own Cloudinary account (`idonvlow`), folder `tll/photos`, are accepted. That is the folder the page's own upload uses.
  - The address the Lounge code reads (`/lounge`) now always answers an empty list. So the Lounge code that is live on /gallery adds nothing, whatever is in the CMS. Approved photos will come from a native CMS list on the page, which is not built yet.

### The order does not matter

| What is live | What happens to a member photo | Where you find it |
|---|---|---|
| Neither part (today) | Published at once, shown on /gallery | Do not leave it like this |
| Part 1 only | Stays in Webflow's form inbox | The form notification email |
| Part 2 only | Saved as a CMS draft | Photo submissions, as a Draft |
| Both, hold line still `true` | Stays in Webflow's form inbox | The form notification email |
| Both, hold line set to `false` in a later release | Saved as a CMS draft | Photo submissions, as a Draft |

Once Part 2 is live and checked, the hold line in Part 1 can be set to `false` in the following site code release. From then on photos arrive as CMS drafts and the form email is the backup copy.

## Before you deploy

1. An independent review of this change is still running. Deploy only after handoff/WEBFLOW-LOCK.md says **"photo hold review passed"**.
2. Please do not add fields to the Photo submissions collection, or rename it, before the Worker is deployed. If Webflow refuses to publish single items after a structure change, the Worker that is live today leaves each photo "queued to publish", and the next site publish by anyone puts it live.

## The deploy, on your Mac

Run these in the repo folder, one line at a time:

```
git fetch origin
git checkout claude/new-session-zxm063
git pull origin claude/new-session-zxm063
git status
```

`git status` must say "nothing to commit, working tree clean". If it lists `src/feeds.js` or any other changed file, stop: that change would go live with the deploy. Use a clean copy of the branch instead, as the Worker catch-up session did.

```
npm ci
npx vitest run
npx wrangler deploy
```

`npx vitest run` must end with "421 passed". Compared with the Worker that is live now (commit `af5de76`), this deploy changes two files only: `src/intake.js` and one comment line in `src/index.js`. No new secret, no new setting.

## The check after the deploy

```
curl -s https://tll-travel-wire.thatlayoverlife.workers.dev/lounge
```

Expected answer, exactly:

```
{"photos":[],"held":true}
```

Today, before the deploy, the same command answers `{"photos":[]}` without `"held":true`, because no photo exists yet. So the word `held` is what tells you the new Worker is live.

A fuller check, if you want one: sign in on www, send one of your own photos on /share-photos, then look in Webflow under CMS, Photo submissions. One Draft item, stage Received, no name in its title. Nothing new on /gallery.

## What a member sees

- **Today (neither part live):** the thank-you box, then "Setting it up on the site…", then a line saying the photos are in the Lounge with a link to /gallery.
- **After Part 1 (site code release):** the page's own thank-you box and nothing else: "Got them. A human looks at every photo before it goes up, so give us a little time. Changed your mind? Write to hello@thatlayover.life and we take it down, before or after it is published."
- **After Part 2 only (Worker deployed, site code still 16.58.0):** the same thank-you box, then one more line: "Saved. It is with the editor."

I added no new sentence. The thank-you box already makes the promise in your words, so a second line would only repeat it. If that sentence is ever removed from the box, the page adds "Saved. It is with the editor.", the same line /submit uses.

## How you find a held photo

- **Today, and with Part 1 only:** the Webflow form notification email for /share-photos (the form is named "Html Form" in Webflow, under Site settings, Forms). The "photos" field holds one Cloudinary link per photo. The CMS stays empty.
- **After the Worker deploy, when the page is sending photos to it:** Webflow, CMS, Photo submissions. Each photo is one item marked Draft, named by place, with the photo, the caption, the credit, the three promises and the member's profile linked. Photos sent together share a "Batch ID".
- **For now, leave approved photos as drafts.** The page that will show approved photos is not built yet, so publishing an item does not put it in the Lounge. To turn one down, set Moderation stage to Rejected or delete the draft.

## How to undo each part

Undoing either part while the other is not live brings back instant publishing. Please undo only one at a time.

- **Part 1:** in `src/site-layers/tll-intake-v1.js` change `var HOLD_PHOTOS=true;` to `var HOLD_PHOTOS=false;`, run `python3 src/site-layers/build-site-layers-v16.py` and `npx vitest run`, then release the site code as usual. Or put site layers 16.58.0 back in the site header (pin `3066315b`). Do this only when the Worker with the hold is live.
- **Part 2:** in the Cloudflare dashboard open Workers, `tll-travel-wire`, Deployments, and roll back to the version before this deploy (today that is `040dddfb`). Or run `npx wrangler rollback` in the repo folder. Drafts already created stay in the CMS as drafts; delete them there if you do not want them.

## Still open, yours to decide

- The two boxes on /share-photos that are served ticked ("On our Instagram and LinkedIn", "On the homepage"). Only the Designer can switch "Start checked" off. Until then the Worker records no social permission.
- The page's line "Credited as (name), from your account" can now differ from the credit on the draft, which follows the profile's byline rule. The draft is the more careful of the two. The page line gets fixed with the form rework.
- A draft still links the member's profile, also when that profile is Unlisted or Off. Nothing shows it today. The rule for that belongs to the approval step.
- The Cloudinary upload preset `tll_photos` accepts uploads from anyone who has its name. Worth a look in the Cloudinary console (Settings, Upload, Upload presets).

## Files

- `src/site-layers/tll-intake-v1.js` (Part 1), with the rebuilt `src/site-layers/chunks/share-photos.js`, `submit.js`, `submit-preview.js` and `src/site-layers/tll-site-layers-v16.js`
- `src/intake.js`, `src/index.js` (Part 2)
- `test/intake-layer.test.js` (new, 18 tests), `test/intake.test.js` (24 tests, 19 of them new)
