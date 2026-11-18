# /submit send wait: Webflow write plan for the TEST SITE only (18 Nov 2026)

Plan only. Nothing here was written to Webflow, registered, applied or published. Reads used (18 Nov, about 09:20 to 09:30 UTC,
agent opus-5.5 wfpln): `get_site`, `get_site_scripts`, `get_registered_scripts` (first 100 of 263), `get_registered_script`,
`list_pages`, `get_page_scripts` (/submit, /my-pets, /share-photos), `get_page_freeform_code` (/submit). One plain GET to jsDelivr
(photo clean at the merge pin, 09:28:38 UTC). No member or contributor data. Read with `fix.md` (parts A, B, C) and
`check-final.md` (PASS WITH NOTES) in this folder.

Site `69d6145cf421c777840c1e25`. Test site: `https://that-layover-life.webflow.io`. Custom domains (NOT published by this plan):
www `6a0de97be677e4daf81431cc`, apex `6a0de979e677e4daf8143190`. Last publish 2026-11-17T17:13:08Z (all three), site lastUpdated
2026-11-17T17:13:20Z.

## 1. Part A: photo clean (page scripts)

Today:

- Registered script id `tllphotocleanv11`, display name `tllphotocleanv11`, newest version `1.1.0` (created 2026-10-25T17:43:58Z).
- Hosted URL `https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@22019832ad62816bc7c9f20805d2549615cfc508/src/components/photo-clean/tll-photo-clean-v1.js`
- Integrity `sha384-AAifp68s8YonZMUePqdmkqh1tCcdKPmYFwY640tgYRXuXGeynwK9F5ARXarResAO`.
- (Older `tllphotocleanv1` 1.0.0, pin c3d6bcc, is registered and applied nowhere.)
- Version `1.2.0` of `tllphotocleanv11` does not exist yet (404 on read).

Pages and their full current script lists, in order (`get_page_scripts`):

| Page | Page id | Scripts now (id, version, location) |
|---|---|---|
| /submit | `6a0d5e5eb7804d3a750dc266` | `tllgateflashv1` 1.0.0 header; `tllphotocleanv11` 1.1.0 footer |
| /my-pets | `6a0df9ffc4a846ee4db92b63` | `tllgateflashv1` 1.0.0 header; `tllmemberwayv11` 1.1.0 footer; `tllphotocleanv11` 1.1.0 footer |
| /share-photos | `6a0dfca3f9fa5b751d154257` | `tllgateflashv1` 1.0.0 header; `tllphotosendv1` 1.0.0 footer (no photo clean: no change) |

All attributes are `{}`. Saved as `webflow-page-scripts.before.json`; the planned lists are `webflow-page-scripts.after.json`.

New version to register:

- id/display name `tllphotocleanv11`, version **`1.2.0`** (next minor: new behavior, same file name).
- URL `https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@f67f3f74d9a5b4c20ec282ac4935ebe2831be667/src/components/photo-clean/tll-photo-clean-v1.js`
  (merge commit on `claude/new-session-zxm063`, on origin).
- Integrity `sha384-b9+lDanshflZ9KVhLlM/GTjhrqKXDFpVs+iXXE5NYL7BLq1hiKvHH6v7kWFDo/rP`.
- jsDelivr check (one GET, 18 Nov 09:28:38 UTC): HTTP 200, 7920 bytes, byte equal to `git show f67f3f74:<path>` and to the
  working tree; same sha384. `EDGE=3000` present (Nancy's choice 3).

`set_page_scripts` after the change (only the photo clean version changes):

- /submit `6a0d5e5eb7804d3a750dc266`:
  `[{id:"tllgateflashv1",version:"1.0.0",location:"header",attributes:{}},{id:"tllphotocleanv11",version:"1.2.0",location:"footer",attributes:{}}]`
- /my-pets `6a0df9ffc4a846ee4db92b63`:
  `[{id:"tllgateflashv1",version:"1.0.0",location:"header",attributes:{}},{id:"tllmemberwayv11",version:"1.1.0",location:"footer",attributes:{}},{id:"tllphotocleanv11",version:"1.2.0",location:"footer",attributes:{}}]`
- /share-photos: no write.

## 2. Part C: the /submit steps script (page custom code)

How it is stored: page custom code, Before `</body>` (freeform `footer` block) of page `6a0d5e5eb7804d3a750dc266`, inside
`<script id="tll-form-steps-js-v2">`. It is not a registered script (the page carries only the two registered scripts above). The
2,000-character limit for registered inline scripts does not apply. The page block limit is 50,000 characters (other pages already
hold 19,933 to 31,566 character blocks).

Current footer block (read today), saved byte for byte as `webflow-c-before.html`: 8,696 characters, 8,704 bytes, 91 lines,
`sha384-HGOlJzYyyxlmsLeEUVSYubjMwg5YTSxj7hgFwnwhhBouLDCY4a3Ocf0VL1zLqGeV`.

- It equals `src/pages/submit/live-2026-11-11/followups/footer.before.html` plus the 3 CSS lines of the 11 Nov /submit card fix
  (lines 16 to 18, "placeholder review, problem 5"). Nothing else differs.
- The block C changes is lines **74 to 86** of the live block (lines 71 to 83 of the repo copy). It occurs exactly once and is
  byte equal to the "Before" block in `fix.md` part C (checked by script, not by eye).
- The head block (canonical link, share fork style and script) is not touched.

New content: `webflow-c-after.html`, the full footer block with only lines 74 to 86 replaced by the "After" block of `fix.md`
part C: 10,085 characters, 10,093 bytes, 96 lines, `sha384-942cxWFLNZomZqVj1NCAwq/G4w8+b896sgq7368PrZTfSkk0V3cD/c5LOb1wSA4N`.
`node --check` on the steps script: OK. It is the same code `test/submit-sent-draft.test.js` and the 42 browser runs tested.

Write: `set_page_freeform_code` page `6a0d5e5eb7804d3a750dc266`, location `footer`, content = the file `webflow-c-after.html`
exactly (no trailing newline added).

## 3. Part B: core 16.68.0 (site scripts)

Site scripts now (`get_site_scripts`, lastUpdated 2026-11-17T10:29:00.217Z): 15 scripts, equal to
`src/site/live-2026-11-17/r1667/site-scripts.after.json`. Saved as `src/site/live-2026-11-18/r1668/site-scripts.before.json`.
Planned list: `src/site/live-2026-11-18/r1668/site-scripts.after.json`, the same 15 in the same order, locations and attributes,
with only `tllsitelayersv16` 16.67.0 -> **16.68.0** (header, last). Version 16.68.0 is not registered yet (404 on read).

Today's core: `tllsitelayersv16` 16.67.0, pin `a254306f6c62a79f314754d24b44041d61be716d`, integrity
`sha384-2Bc75us2J2jpgsYU/Hger8bd7CrNh9cZyfStM3otS/aENprUVw1HFUruv8eGw3cU` (= origin/layers-release head today).

What 16.68.0 carries (session branch head `5fac3e5` against `37a115a`): `tll-intake-v1.js` built into the chunks `submit.js`,
`submit-preview.js`, `share-photos.js`, and the 4 chunk integrity lines in the core. The search index is the same blob as on
layers-release. Nothing else.

Steps:

1. On `claude/new-session-zxm063` (clean tree, pulled), check the core is still
   `sha384-a9tcQUfkTLuUzZ1IXfw7dVcXSKJnilK7aqF6p5HiS5d80ghZvRrQ6Akt8Ewg/2st`, 277,485 bytes, and `npx vitest run` passes.
   If HEAD moved and the core differs, stop and re-plan.
2. `RELEASE_TRAILER="<the two trailer lines>" tools/release-layers.sh`. It commits to `layers-release` and prints `PIN`, `URL`, `SRI`.
   Expected release diff: the core and the three chunks only. `SRI` must equal the one in step 1.
3. Four GETs of jsDelivr at `PIN` (core, `chunks/submit.js`, `chunks/submit-preview.js`, `chunks/share-photos.js`): byte equal
   to the tree. Chunk SRIs:
   submit.js `sha384-H8LLSn6cs4mqCm/QR8tY36mqOXCV7sQisZZRzby7yklFvq7xLq60YGuTB9rW5+8n`, submit-preview.js
   `sha384-ED9lWFcqBQ0JkIGDSx1ENCschMJNcES/yVNRsCVRivWWCXd/dHR4immfqBePp/xc`, share-photos.js
   `sha384-uoZrsptUVDrS9Bea7KGffpTQOPGbNz+lOSdMpN/d7QUhLkkiw1abBjuF+1eOh8DY`.
4. `register_hosted_script`: site `69d6145cf421c777840c1e25`, display_name `tllsitelayersv16`, version `16.68.0`,
   hosted_location `https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@<PIN>/src/site-layers/tll-site-layers-v16.js`,
   integrity_hash `sha384-a9tcQUfkTLuUzZ1IXfw7dVcXSKJnilK7aqF6p5HiS5d80ghZvRrQ6Akt8Ewg/2st`.
5. `set_site_scripts` with the `scripts` array of `r1668/site-scripts.after.json`, verbatim.

## 4. Order, read-backs, publish, rollback

Before any write:

0a. Nancy's go-ahead for the TEST SITE in chat, and a SCOPE line in `handoff/WEBFLOW-LOCK.md` (pushed) naming parts A, B, C, the
    ids and versions below, "publish to the Webflow subdomain only".
0b. Re-read and compare: `get_site_scripts` = `r1668/site-scripts.before.json`; `get_page_scripts` on the 3 pages =
    `webflow-page-scripts.before.json`; `get_page_freeform_code` /submit footer = `webflow-c-before.html` byte for byte;
    `get_site` lastPublished 2026-11-17T17:13:08Z and nothing written since. Any difference: stop.

Writes, in this order (each followed by its read-back; any mismatch: roll that part back and stop):

1. A, register: `register_hosted_script` site `69d6145cf421c777840c1e25`, display_name `tllphotocleanv11`, version `1.2.0`,
   hosted_location the f67f3f74 URL above, integrity `sha384-b9+lDanshflZ9KVhLlM/GTjhrqKXDFpVs+iXXE5NYL7BLq1hiKvHH6v7kWFDo/rP`.
   Read back: `get_registered_script` `tllphotocleanv11` version `1.2.0`: id `tllphotocleanv11` (not a new id), the URL and
   integrity as sent. If Webflow made a new id instead, stop and re-plan the page lists.
2. A, apply: `set_page_scripts` /submit and /my-pets with the lists in section 1. Read back `get_page_scripts` on both (and
   /share-photos unchanged) = `webflow-page-scripts.after.json`.
3. C: `set_page_freeform_code` /submit `footer` = `webflow-c-after.html`. Read back `get_page_freeform_code`: footer byte equal
   (sha384 `942cx...SA4N`), head unchanged.
4. B: steps 1 to 5 of section 3. Read back `get_registered_script` `tllsitelayersv16` `16.68.0` (URL with PIN, integrity a9tc),
   and `get_site_scripts` = `r1668/site-scripts.after.json` (15 scripts, only the core version changed).
5. Publish once: `publish_site` site `69d6145cf421c777840c1e25`, `customDomains: []`, `publishToWebflowSubdomain: true`.
   Then plain GETs on the test site: /submit and /my-pets carry `@f67f3f74...` once and `@22019832` nowhere; /share-photos has no
   photo clean; every page carries the new core PIN once and `a254306f` nowhere; /submit carries
   `var last='',sent=false,pend=null;` once. www /submit still carries `a254306f` and `22019832` (www not published).
6. Lock line: TEST SITE PUBLISHED with publishTaskId and read-backs. www waits for Nancy's check and a separate scope line.

Rollback (each part on its own; then one test-site publish, at least a minute after the last):

- A: `set_page_scripts` /submit and /my-pets with the lists in `webflow-page-scripts.before.json` (`tllphotocleanv11` 1.1.0, pin
  22019832, integrity AAif...ResAO). Read back. Version 1.2.0 stays registered and unused. Never use `delete_registered_script`
  (it deletes every version).
- C: `set_page_freeform_code` /submit `footer` = `webflow-c-before.html` (sha384 `HGOl...qGeV`). Read back byte equal. Account
  copies already marked sent then fill the form again on the next visit, as today.
- B: `set_site_scripts` with `r1668/site-scripts.before.json` (core 16.67.0, pin a254306f). Read back. The layers-release commit
  and the 16.68.0 registration stay, unused.

## 5. Blockers and cautions

- B's PIN does not exist until `tools/release-layers.sh` runs (a push to `layers-release`, part of the write session). Its SRI is
  known now (a9tc...), so only the URL is filled in then.
- Webflow keeps one draft state for the whole site. After step 5, www and the apex still serve 16.67.0 and pin 22019832 only
  because they were not published. Any later publish to the custom domains, by any session, takes A, B and C live. If Nancy does
  not approve, roll back before the next www publish. The lock line must say so.
- A send on the test site is a real send: Webflow form, Worker, Cloudinary and the member's account JSON. Checks there should
  use Nancy's own test story or stand-ins, as before.
- Open notes from `check-final.md` before C goes in (both mean a change to the C block, new tests, and a new `webflow-c-after.html`):
  note 1, the "Already sent to the editor" line rarely shows on the real page because Memberstack loads after the steps script
  (the draft rule still holds); note 2, a blank visit after a send can lead to "Draft restored" over an empty form on the visit
  after it (not the sent story). This plan writes C exactly as tested; if Nancy wants either fix, C waits and A and B can go first.
- Registered scripts total 263; `get_registered_scripts` returned the first 100 only. Photo clean was read by id.
