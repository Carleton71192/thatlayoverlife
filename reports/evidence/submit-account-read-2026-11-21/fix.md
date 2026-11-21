# /submit: the account read waits for Memberstack (21 Nov 2026)

Built on session branch `claude/new-session-zxm063` at `2e4570c`. A proposal for the /submit page footer custom code (a Webflow
page code write and a publish, not done here). Files in this folder:

- `webflow-c2-before.html`: the footer as live on www, confirmed by one plain GET of https://www.thatlayover.life/submit on
  21 Nov 08:56 UTC. The block occurs exactly once in the served HTML and equals
  `reports/evidence/submit-save-2026-11-17/webflow-c-after.html` byte for byte (10093 bytes, 10085 characters,
  `sha384-942cxWFLNZomZqVj1NCAwq/G4w8+b896sgq7368PrZTfSkk0V3cD/c5LOb1wSA4N`).
- `webflow-c2-after.html`: the full new footer content (10782 bytes, 10774 characters, under the 50,000 character page code
  limit), `sha384-12ICmEg6gz0q02hbdXeY36z3wDw0ztw8stfIVqoAk/MWQfvZl6ApO2QPddT8hMGe`.
- Tests: `test/submit-account-read.test.js` (10 tests).

## The problem

From `reports/evidence/submit-save-2026-11-17/check-final.md` notes 1 and 2 and `reports/evidence/release-16.68.0-check/behavior/check.md`.

1. The steps script (`tll-form-steps-js-v2`) reads `window.$memberstackDom` once, at DOMContentLoaded. Memberstack is added later
   by the site header script `tll_memberstack_init_v2` (it injects `static.memberstack.com/scripts/v2/memberstack.js` as a dynamic
   script), so on a real load the account read is skipped. The autosave reads Memberstack on every tick, so a signed-in
   writer's draft is written to the account but never read back:
   - the draft never follows the writer to another browser or device;
   - the credit website and Instagram are never prefilled from the account (`tllLinks`, then the custom fields);
   - the 18 Nov line "Already sent to the editor. A copy stays in your account." never shows.
2. On a blank visit (for example right after a send) the autosave saves only fields other scripts fill
   (`cf-turnstile-response`, `invite-link`, `lounge-photo-pick`, `trip-code`). The next visit in that browser then says
   "Draft restored from your last visit." over an empty form, and the account copy marked sent is moved to `tllStorySent`.

## How Memberstack signals readiness here

There is no ready event in use on the site. Every TLL script that needs Memberstack polls for `window.$memberstackDom` with a
bounded counter and gives up quietly:

- core `src/site-layers/tll-site-layers-v16.js`: `whenMemberstack(fn)`, a check now, then every 250 ms, 60 tries (15 s);
  `member(cb)`, every 150 ms, 40 tries;
- site footer (`src/site/live-2026-11-13/fonts/site-footer.after.html`, login redirect): every 250 ms, 40 tries (10 s);
- `src/components/member-way/tll-member-way-v1.js`: interval, 60 tries.

The new code reuses the core `whenMemberstack` shape: check at once, then every 250 ms, up to 60 tries (15 s), then stop.
The init script source itself is not in the repo (only its registration in `src/site/live-*/site-scripts.*.json`); it was not
fetched.

## The change (steps script only, 3 lines out, 6 lines in)

1. Autosave guard. New `own(o)`: true when at least one of `name`, `excerpt`, `body` or `country` has a value. The autosave's
   `Object.keys(o).length===0` test becomes `!own(o)`, so helper fields alone never make a draft (in this browser or the
   account). Everything else in the autosave is unchanged.
2. Account read. The load-time block `var ms=window.$memberstackDom; if(ms&&ms.getMemberJSON){...}` becomes
   `function read(ms){...}`, with the same body, called by a bounded wait:
   `(function wait(n){var ms=window.$memberstackDom;if(ms&&ms.getMemberJSON)return read(ms);if(n<60)setTimeout(function(){wait(n+1);},250);})(0);`
   Memberstack ready at once: the read runs at once, as before. Ready later: the read runs within 250 ms of it. Not there
   after 15 s (or signed out, where it never comes): no read, nothing shown, no timer left.
3. When the account answers: marked sent, the already-sent line shows and nothing is filled (as the code intended). Otherwise
   the account draft fills the form only if `name`, `excerpt`, `body` and `country` are all still empty at that moment
   (`&&!own(snap())`), so a late draft never lands on top of what the writer typed; `fill()` still skips any filled field.
   The credit prefill (`tllLinks`, then the custom fields, with the PREFILLED tag) runs as written, now also on a late load.

Byte-identical: everything outside the steps script, and every other line of it, in the same order: the 18 Nov `sentNow`
(autosave stop, this browser's copy removed, the sent mark written after `pend`, the account write still on its way), the
autosave's account write, `fill`, `snap`, the submit handler, the prefill. No page text is new or changed. No core or chunk
change.

Behavior note: when this browser restores its own local draft (name, excerpt, body or country filled from `localStorage`),
the account draft is not mixed into it. Before, on the rare load where Memberstack was already there, the account draft
filled the fields the local copy left empty. Now the local copy wins whole, which matches "never overwrite what the writer
has in front of them" and avoids a mix of two drafts.

## Diff of the footer block

```diff
@@ -72,16 +72,19 @@
 function snap(){...}
 function fill(o){...}
 var last='',sent=false,pend=null;
-function autosave(){if(sent)return;var o=snap(),s=JSON.stringify(o);if(s===last||Object.keys(o).length===0)return;last=s;
+/* 21 Nov 2026: a draft needs words the writer typed. Fields other scripts fill (Turnstile token, invite link, photo pick, trip code) never make one on their own. */
+var OWN=['name','excerpt','body','country'];function own(o){return OWN.some(function(k){return o[k];});}
+function autosave(){if(sent)return;var o=snap(),s=JSON.stringify(o);if(s===last||!own(o))return;last=s;
 ...
 try{fill(JSON.parse(localStorage.getItem(KEY)||'null'));}catch(e){}
-var ms=window.$memberstackDom;
-if(ms&&ms.getMemberJSON){ms.getMemberJSON().then(function(r){var j=(r&&r.data)||{};var d=j.tllStoryDraft;if(d&&d.sent)save.textContent='Already sent to the editor. A copy stays in your account.';else if(d&&d.fields)fill(d.fields);
+/* 21 Nov 2026: Memberstack is added later by the site header (tll_memberstack_init_v2), so the account read waits for it (every 250 ms, up to 15 s, then gives up quietly). A late account draft fills the form only while name, excerpt, body and country are still empty, so it never overwrites what the writer typed. */
+function read(ms){ms.getMemberJSON().then(function(r){var j=(r&&r.data)||{};var d=j.tllStoryDraft;if(d&&d.sent)save.textContent='Already sent to the editor. A copy stays in your account.';else if(d&&d.fields&&!own(snap()))fill(d.fields);
 var links=...
 function pre(el,v){...}
 pre(w,links.website);pre(ig,links.instagram);if(...){...}}).catch(function(){});}
+(function wait(n){var ms=window.$memberstackDom;if(ms&&ms.getMemberJSON)return read(ms);if(n<60)setTimeout(function(){wait(n+1);},250);})(0);
 var timer=setInterval(autosave,20000);
```

(Unchanged context lines are shortened here; `diff -u webflow-c2-before.html webflow-c2-after.html` gives the full text.)

## Tests

`test/submit-account-read.test.js` runs the before and after steps scripts, taken from the two files, with photo clean and the
built submit chunk on the story form as exported, in `test/mini-dom.js` (stand-ins for Memberstack, Cloudinary, Webflow's form
handler and the Worker; no network; no member data). Memberstack is set 0 s, 2 s or 20 s after the steps script, or never.

1. Files: before equals the 18 Nov footer confirmed on www; after differs only inside the steps script (3 lines out, 6 in, the
   rest in order); no new page text; under 50,000 characters.
2. 0 s: a new browser gets the account draft, before and after alike (one read at 0 s).
3. 2 s: before makes no read and the form stays empty (the bug); after reads at 2.0 s, fills the form, stops waiting, and the
   next autosave keeps the draft in this browser and the account.
4. 20 s: after still waits at 14.9 s, has stopped at 15.1 s, never reads, fills nothing and writes nothing on a blank visit;
   once the writer types, the autosave reaches the account as before.
5. A typed field (each of name, excerpt, body, country) is never overwritten by a late account draft, and nothing from the
   account draft is mixed in.
6. A late account draft marked sent shows the already-sent line (not "Draft restored") and fills nothing.
7. Credit prefill with a late Memberstack: from `tllLinks`, and from the custom fields; the live footer prefills nothing on the
   same load; a website the writer typed first is kept.
8. A blank visit after a send (helper fields filled, left open a minute): before writes a draft, moves the sent copy and the
   next visit says "Draft restored" over an empty form; after writes nothing, the account stays marked sent, and both that
   visit and the next one show the already-sent line.
9. The 18 Nov sent mark still waits for an autosave account write on its way (Memberstack 2 s late, slow write): the late
   autosave write lands first, the sent mark last.
10. Signed out (no Memberstack ever): a typed draft saves to this browser and is restored next visit exactly as with the live
    footer (same saved JSON, same lines, same form); helper fields alone save nothing with the new code.

Mutation check (each change reverted on its own, then the new tests run): the fill guard (1 test fails), the autosave guard
(3), a 20 s wait instead of 15 s (2), the sent line (2), the website prefill (2), the sent mark not waiting for `pend` (1).

Runs: `npx vitest run` 63 files, 753 tests, all pass (743 before plus these 10); `node --test worker/test/*.test.js` 83 pass.

## Not done

- No Webflow write, no publish. Putting `webflow-c2-after.html` in as the /submit footer custom code is a page code write and a
  publish, for Nancy to approve.
- Not run in a browser against the saved live page (a later check can reuse `check-final-run/h2.cjs` with Memberstack arriving
  late, as on the real page).
- The real Memberstack, Turnstile, Cloudinary, Webflow form endpoint and Worker were not used (stand-ins).

## c3: a leftover copy without the four fields is removed at load (21 Nov 2026, check note 1)

`check.md` note 1: a browser that already holds a copy written by the live footer on a blank visit (only fields other scripts fill,
for example `invite-link`, `lounge-photo-pick`, `trip-code`) kept seeing "Draft restored from your last visit." over an empty form
with c2, on every visit, because c2 stops new leftovers but never removes old ones.

Where the line comes from: `src/site-layers/tll-submit-gallery-v1.js` (in `chunks/submit.js`), `autosaveLine(form)`, sets
`restored=!!localStorage.getItem('tllStoryDraft')`. It runs from `run()` at DOMContentLoaded (or at once if the chunk loads later),
and again at 1.2 s and 3 s, but returns early until `.tllst-save` exists. The steps script builds `.tllst-save` in its `init()` and
reads this browser's copy later in the same synchronous `init()`, so nothing can read the key in between. The footer alone can
remove the leftover before the gallery layer looks: no core or chunk change.

`webflow-c3-after.html` (c2 files kept as they are) changes one line of the steps script and adds one comment above it:

```diff
-try{fill(JSON.parse(localStorage.getItem(KEY)||'null'));}catch(e){}
+/* 21 Nov 2026 (c3): the old footer saved a draft on blank visits, with only the fields other scripts fill. Such a copy in this browser (none of name, excerpt, body or country) is removed at load instead of filled, so the autosave line no longer says a draft was restored over an empty form. */
+try{var lo=JSON.parse(localStorage.getItem(KEY)||'null');if(lo&&!own(lo))localStorage.removeItem(KEY);else fill(lo);}catch(e){}
```

A copy with any of name, excerpt, body or country is filled exactly as with c2 and still says "Draft restored". No new page text.
Side effect: the story extras script (`src/pages/submit/embed-lounge.html`) reuses a `trip-code` from this browser's copy; a removed
leftover means a fresh trip code on the next visit, as for any browser without a draft.

Files: `webflow-c3-after.html` 11137 bytes, 11129 characters, `sha384-PjyB0x3Jw3oWBh37tLPDMuLSLB4EbdYIghrvSj4UHMdhc9C4zMFOvDUTVZ8tWgxc`.

Tests (`test/submit-account-read.test.js`, 6 more, 16 in the file): the file diff above; a leftover made by the live footer's blank
visit (signed out and Memberstack 2 s late, chunk after and before the steps script): c2 shows "Draft restored", c3 removes the copy
during init, shows the plain line past the gallery layer's 1.2 s and 3 s passes, writes nothing on a blank visit, and saves and
restores a typed draft as before; a leftover with only city, a credit pick and helper fields is removed, odd copies (`{}`, `[]`, a
string, a number) are removed, and broken JSON is left as with c2 (no error); a copy with any one of the four fields is kept and filled the same as c2; leftover
plus account draft with Memberstack 2 s late: leftover removed, account draft fills the form, no "Draft restored"; with no
leftover, c3 gives the same results as c2 over 24 scenarios (Memberstack 0 s, 2 s, 20 s, never; account draft, sent, none; typed or
not; two visits). Mutation check: no removal (4 tests fail), remove always (5), remove and also fill (3), removal 1.5 s late (4).

Browser run (`c3-run/`, the check harness `h3b.cjs` plus a `c3` variant, same saved page and stand-ins, 390x844, 14 runs: 7 scenarios, c2 and c3,
page errors 0, cache misses 0): leftover (Memberstack 3000 ms and real): c2 "Draft restored" over an empty form on every visit;
c3 the plain line on every visit, the copy gone at load, 0 writes. Leftover plus account draft (3000, real): both fill the account
draft; c2 also says "Draft restored", c3 does not. Account draft, signed-out typed draft, blank visit: c2 and c3 the same.

Runs: `npx vitest run` 63 files, 759 tests, all pass; `node --test worker/test/*.test.js` 83 pass. No Webflow write, no publish.
