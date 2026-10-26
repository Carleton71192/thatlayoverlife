# Ready to apply: member bar SETTINGS and CONTRIBUTIONS on /account (26 Oct 2026)

Nancy, 26 Oct, from her phone on /account: "The settings button is not working."

## Cause

The member bar links are /account#settings and /account#stories. On /account each section is a tab panel that stays hidden until its tab is chosen. The tabs listen for the browser's hashchange event. Webflow's smooth scroll catches same-page # links and changes the address with history.pushState, which fires no hashchange. So the tab never opened, and the target section stayed hidden: the tap did nothing.

Links from other pages to /account#settings already work, because the tab script reads the address on load.

## Fix

The fix is `src/components/member-bar/tll-account-hash-tabs-v1.js`. It is a click listener that runs before Webflow's. When a same-page link points at an account tab (#a3-tab-<name>), it opens that tab. It acts only on /account, where those tab buttons exist.

It ships inside `src/site-layers/tll-site-layers-v2.js`, which is tll-site-layers-v1 (unchanged styles) plus this listener. That keeps the site at 15 scripts.

Test: `node src/components/member-bar/test/hash-tabs.mjs`. It reproduces the bug without the fix (both links fail) and passes with it (CONTRIBUTIONS opens Stories, SETTINGS opens Login and email, and a second tap stays put).

## Steps (Webflow write: only the session holding the lock in handoff/WEBFLOW-LOCK.md)

1. Register a hosted script:
   - display name: tllsitelayersv2
   - version: 1.0.0
   - URL: https://cdn.jsdelivr.net/gh/carleton71192/thatlayoverlife@5a83406eaeed3688e324d54f931e83101c88dd76/src/site-layers/tll-site-layers-v2.js
   - SRI: sha384-8L8pWmbxM4HQ7J/bAhwZ89lU1OUKW3D5YY5JggfCB7UpNw5ZgiaLMzA9wZU7eB83
2. Remove the site script tllsitelayersv1.
3. Add tllsitelayersv2 to the site, location header.
4. Publish. Then, on a phone at /account, tap CONTRIBUTIONS and then SETTINGS.

Rollback: remove tllsitelayersv2, re-add tllsitelayersv1, publish.

## Also seen in the same screenshot (not fixed yet)

The floating "Tell the editor" pill covers the left end of the account tab strip on phones ("Overview", "Map and lists"). This needs a bottom offset on /account, or a hidden pill while that strip is pinned.
