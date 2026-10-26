# Ready to apply: tll-site-layers-v2 (26 Oct 2026)

One script swap carries four fixes:
1. Member bar SETTINGS and CONTRIBUTIONS on /account.
2. The /edit-profile country field.
3. The pen name note copy.
4. The "Tell the editor" button on phones.

## 1. Member bar SETTINGS and CONTRIBUTIONS on /account

Nancy, 26 Oct, from her phone on /account: "The settings button is not working."

## Cause

The member bar links are /account#settings and /account#stories. On /account each section is a tab panel that stays hidden until its tab is chosen. The tabs listen for the browser's hashchange event. Webflow's smooth scroll catches same-page # links and changes the address with history.pushState, which fires no hashchange. So the tab never opened, and the target section stayed hidden: the tap did nothing.

Links from other pages to /account#settings already work, because the tab script reads the address on load.

## Fix

The fix is `src/components/member-bar/tll-account-hash-tabs-v1.js`. It is a click listener that runs before Webflow's. When a same-page link points at an account tab (#a3-tab-<name>), it opens that tab. It acts only on /account, where those tab buttons exist.

It ships inside `src/site-layers/tll-site-layers-v2.js`, which is tll-site-layers-v1 (unchanged styles) plus this listener. That keeps the site at 15 scripts.

Test: `node src/components/member-bar/test/hash-tabs.mjs`. It reproduces the bug without the fix (both links fail) and passes with it (CONTRIBUTIONS opens Stories, SETTINGS opens Login and email, and a second tap stays put).

## 2. /edit-profile "From, and has lived in" (Nancy, 26 Oct screenshot)

"Portland, Oregon, USA" got "No country by that name". The matcher took only an exact country name, a two letter code or the start of a name.

`src/components/edit-profile-fixes/tll-ep-country-v1.js` replaces `TLLEP.ccode` on /edit-profile. It reads each comma part from the end, knows short forms (USA, UK, England, Holland, UAE and others) and US state names, and keeps exact country names first, so "Georgia" stays the country. The stored value is unchanged: two letter codes.

The hint under the field now reads "Type a country, or a place with its country, and press Enter. Up to five."

Test: `node src/components/edit-profile-fixes/test/country.cjs` (20/20).

## 3. Pen name note

The note read "Your real name stays on file with the editor..." ("real name" is banned). It now reads "Only the editor sees your full name. Readers see your pen name, and every byline is still a person." The same file changes it at load.

When the lock allows, change the embed text itself as well: it is in `src/pages/edit-profile/after-2026-10-20/03-ep-shown.html`.

## 4. "Tell the editor" on phones

The pill covered the Languages field (keyboard up) and the /account tab strip. Under 960px it is now a 44px round button with the dot, as in prototype 3.4, and the words stay for screen readers. It steps aside while a page field has focus, but not while the note itself is open.

Test: `node src/components/edit-profile-fixes/test/note-pill.mjs`.

## Steps (Webflow write: only the session holding the lock in handoff/WEBFLOW-LOCK.md)

1. Register a hosted script:
   - display name: tllsitelayersv2
   - version: 1.0.0
   - URL: https://cdn.jsdelivr.net/gh/carleton71192/thatlayoverlife@bb91e2e6f2cdd930824d2cd55da302f80d247787/src/site-layers/tll-site-layers-v2.js
   - SRI: sha384-4HnVWVCh1b/ZsLMPryu1Qt+WXSHSQu+P5qFl04gPmdLnDgn9eWnKP/Y86dDgNhoJ
2. Remove the site script tllsitelayersv1.
3. Add tllsitelayersv2 to the site, location header.
4. Publish. Then, on a phone:
   - at /account, tap CONTRIBUTIONS and then SETTINGS;
   - at /edit-profile, type "Portland, Oregon, USA" and press Enter, and a US flag appears;
   - confirm the note button is a small round dot and hides while you type.

Rollback: remove tllsitelayersv2, re-add tllsitelayersv1, publish.

