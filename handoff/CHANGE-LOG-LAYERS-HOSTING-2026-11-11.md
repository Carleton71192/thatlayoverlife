# Site layers hosting: a lasting fix for the jsDelivr 50 MB limit

11 November 2026, updated 12 November 2026. Branch `claude/layers-hosting` (on top of the working branch at 14f04c0, reviewed by an independent panel, all fixes in). Nothing in Webflow was changed and nothing was published by this work.

## Where things stand on 12 November

- The site layers core already loads from the slim `layers-release` branch on www (published 11 November). That part of the problem is solved.
- Nine other files still load from old pins of this repository. Eight of those pins are 92 to 95 MB, over jsDelivr's 50 MB limit, so a visitor can get an error instead of the file. This is what is left to fix.
- All nine files are already on jsDelivr in a small release commit, byte for byte the same as today. Moving them is only a change of address in Webflow.

## What is wrong

jsDelivr refuses any commit whose files add up to more than 50 MB. This repository is over 500 MB (mostly design screenshots). A file a jsDelivr server has not cached yet can come back as an error.

Checked on 11 November 2026 with files nobody had requested before:

- At commits on the working branch, 3 of 38 requests failed with "Package size exceeded the configured limit of 50 MB". The failures are random.
- At slim release commits, 0 of 201 requests failed.

Files www loads from this repository on 12 November, outside the site layers (all 146 pages of the sitemap plus the member pages read):

| File | Webflow name | Live pin | Size at pin | Pages |
|---|---|---|---|---|
| member-way script | tllmemberwayv11 1.1.0 | e4342d4 | 95 MB | /account, /edit-profile, /the-map, /my-pets, contributor profiles |
| quick-log script | tllquicklogv1 1.0.0 | cab2aea | 95 MB | /the-map |
| account stories script | tllacctstoriesv21 2.1.0 | a1fb28e | 95 MB | /account |
| photo-clean script | tllphotocleanv11 1.1.0 | 2201983 | 95 MB | /submit, /my-pets |
| photo-send script | tllphotosendv1 | 4d12668 | 95 MB | /share-photos |
| Map 2.0 code, style, data | /the-map embed 682054d4 | 46a21a1 | 95 MB | /the-map (/my-passport redirects there) |
| Map 2.0 code, style, data | /account map embed ee672abf | a81ffb9 | 92 MB | /account |
| owner map record | home embed 405baa84 | aeba470 | 92 MB | home |
| share script | page code | 725d85a | 41 MB | /the-map, /account (under the limit) |

The map has a backup host (statically.io), so it usually recovers. The other scripts have none.

## Options compared

| Option | Verdict |
|---|---|
| Slim release branch in this repository | Recommended, and already in use for the core. jsDelivr only counts the files in the pinned commit, so a commit holding only the site files is under 2 MB. Same workflow, same SRI, no new accounts. |
| Separate public release repository | Works the same way as the branch, with an extra repository to look after. No gain. |
| npm package through jsDelivr's npm endpoint | Works, and versions can never change. Needs an npm account and a publish token for every release. More steps for no gain today. |
| Webflow-hosted assets | Not workable for the core: inline scripts are capped at 2,000 characters and the core is about 200 KB. |
| Cloudflare (the tll-travel-wire Worker or Cloudflare Pages) | Works, and could serve from a thatlayover.life address later. But every page would depend on the Worker and its deploys. Worth keeping as a backup host, not needed now. |

## What changed on the branch

- `tools/layers-release-carry.txt` lists the nine files. Every release commit copies them byte for byte from their live pins, so their SRI hashes stay the same.
- `tools/release-layers.sh` builds each release commit from scratch: the core, chunks, story search index and the carry list, nothing else. It stops on a mistake in the carry list (a wrong commit, a missing folder, a line without a commit), refuses an uncommitted or untracked build file and a release over 20 MB, and checks the core's chunk hashes before anything is pushed. It can push to a candidate branch or do a dry run that changes no branch. It prints the SRI for every script, then fetches every file from jsDelivr. The `RELEASE_TRAILER` option other sessions added is kept.
- `tools/check-layers-cdn.mjs` fetches every file of a release from jsDelivr and compares it with git, checks the core's chunk hashes, and fails if the layers hold a pinned address of this repository. With `--live` it reads every page in the sitemap plus the member pages, lists every file they load from this repository, flags pins over 50 MB, and fails on any page or file that does not load.
- The core tells the other layers where it was loaded from, and the story search index loads from that same release. Today the index is pinned to commit 44ded90, so a future index update would never reach the site. (The index has not changed since, so nothing is wrong on www today.)
- 38 new tests. All 459 tests pass on the branch. Taking the base line out of the loader makes 4 of them fail, so they guard the change.

The release commit holding the nine files is `d80574b06c09a869ff54788becc33b43202f3649`, kept on GitHub by the tag `layers-carry-2026-11-12` (and the branch `layers-release-candidate`). It sits on top of the current `layers-release`. The CDN check fetched all 73 of its files twice from jsDelivr and got the right bytes every time. Local copies of /share-photos, /my-pets, /the-map, /account, home, /stories and /submit with the pins swapped to it loaded every file from it with the SRI accepted, and the map started. (The earlier commit 4099b92 and its tag `layers-carry-2026-11-11` lack the photo-send script; use d80574b.)

### Review

An independent panel of 24 reviewers checked the branch on 12 November. They confirmed 19 findings, all fixed on the branch:
- One missed file, the photo-send script on /share-photos.
- /my-pets missing from the page lists.
- Ways the release script could ship an incomplete release without an error.
- Ways the check script could report OK when it should not.
- Four gaps in the tests.

Nothing they found affects the live site today.

The core change is not released. The cloud session asked on 12 November that nobody release site layers until it logs its current batch. The core change rides along with the next release after this branch is merged into the working branch, and from then on every release also carries the nine files.

## For Nancy to approve

1. **Merge this branch into the working branch** (git only, the site does not change). From then on, `tools/release-layers.sh` carries the nine files in every release and the search index follows the release.
2. **Page scripts (Webflow, needs the lock).** For each script, register a new version at the new address with the same SRI, then apply it on its pages in place of the old version. Base address: `https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@d80574b06c09a869ff54788becc33b43202f3649/`, followed by the path.
   - tllmemberwayv11 1.1.1: `src/components/member-way/tll-member-way-v1.js`, `sha384-5sLCIrRVb02lPTc8ICl8NTrJwYvYGeAgnH8c7hjMcUdRHPp82IEd28EjZKSrgZ0b`. Pages: /account, /edit-profile, /the-map, /my-pets, the contributors template.
   - tllquicklogv1 1.0.1: `src/components/quick-log/tll-quick-log-v1.js`, `sha384-XlVzAudOeXfapc7N8BhbRwk8PzI3ez23Pz90unIwCJUkiNbQUAPoJnqhXGCHr3G/`. Page: /the-map.
   - tllacctstoriesv21 2.1.1: `src/pages/account/tll-acct-stories-v2.js`, `sha384-EBvhI9bWyvCQpuEbPtNioPMfb4svlk9ZJBjiRyUwnsP3vzQq9rmVCNKPMeAmQutl`. Page: /account.
   - tllphotocleanv11 1.1.1: `src/components/photo-clean/tll-photo-clean-v1.js`, `sha384-AAifp68s8YonZMUePqdmkqh1tCcdKPmYFwY640tgYRXuXGeynwK9F5ARXarResAO`. Pages: /submit, /my-pets.
   - tllphotosendv1, next patch version: `src/pages/share-photos/v3/tll-photo-send-v1.js`, `sha384-JWLuzJCWJU2M9E0cABghbjq/JBU1cRoJCGqZyxjg6zii4IjFoew6JtqaiDny01/x`. Page: /share-photos.
3. **Map embeds (Webflow, needs the lock).** In the /the-map embed 682054d4, replace every `46a21a18a404b7162bf3bd61c3c26ae70c441445` with `d80574b06c09a869ff54788becc33b43202f3649` (four places: `data-tll-version`, `var V=`, the stylesheet link and its noscript copy). In the /account map embed ee672abf, replace every `a81ffb96ac9077c7e2cc7217f131a25dcef616a1` the same way. /account then runs the same map version as /the-map. The only difference is a sample mode that /account does not switch on; signed out, both behave the same.
4. **Home embed 405baa84.** Replace `aeba470383a28a3d6143f282a758de18ded29aec` with the new pin in the `owner-record.json` address. The file is the same.
5. **Share script (optional).** Its 41 MB pin is under the limit. Moving it gives one source for everything.
6. **Publish** on your word.
7. **Check.** After the publish, run `node tools/check-layers-cdn.mjs --live`. It should end with `RESULT: OK`. Today it flags 14 files on pins over the limit.

Items 2 to 4 do not touch the site layers core or the three home embeds the cloud session has asked others to leave alone (84f7180f, a4c1009d, 94ce12c0).

## Releasing a new version from now on

1. Build and test: `python3 src/site-layers/build-site-layers-v16.py`, then `npx vitest run`. Commit.
2. Release: `bash tools/release-layers.sh`. Use `LAYERS_RELEASE_BRANCH=layers-release-candidate` while a version waits for approval, or `LAYERS_RELEASE_PUSH=0` for a dry run. The script prints the pin and SRI, then runs the CDN check. Go on only if it ends with `RESULT: OK`.
3. Webflow, under the lock: `register_hosted_script` with display name `tllsitelayersv16`, the new version number, the address and the SRI. Then `add_site_script` for the header with the new version. Read it back.
4. Publish on Nancy's word, then run `node tools/check-layers-cdn.mjs --live`.
5. Log it in `handoff/WEBFLOW-LOCK.md`.

To ship a new version of a carried file, change its commit in `tools/layers-release-carry.txt`, release, and register the new version with its new SRI.

## Rollback

- Page scripts: apply the previous version again (still registered). Embeds: put the old pin back. The old pins are in the table above.
- Site layers: apply the previous registered version of `tllsitelayersv16` again and publish.
- Never force-push or rewrite `layers-release`, and never delete the tags `layers-carry-2026-11-12` and `layers-carry-2026-11-11`. Old pins must stay on GitHub for rollback to work.

## Risks left

- The repository has to stay public. That is true today.
- jsDelivr can still have outages unrelated to size. Cloudflare as a second host would cover that, as a later step.
