# Site layers hosting: a lasting fix for the jsDelivr 50 MB limit

11 November 2026. Branch `claude/layers-cdn-source`. Nothing in Webflow was changed and nothing was published.

## What is wrong

The site loads its scripts from jsDelivr, pinned to commits of this repository. jsDelivr refuses any commit whose files add up to more than 50 MB, and this repository is 538 MB at the live pin (mostly design screenshots). Files that a jsDelivr server has not cached yet can come back as an error instead of the script.

Checked on 11 November 2026 with files nobody had requested before:

- At commits on the working branch, 3 of 38 requests failed with "Package size exceeded the configured limit of 50 MB". The same kind of file worked on the next try, so the failures are random.
- At slim release commits (16.53.1 and the new candidate), 0 of 201 requests failed.

The 16.53.1 fix (staged on 11 November by the cloud session) moved the core and chunks to the slim branch. It left out eight other files that www loads from this repository. Seven of them sit on pins of 92 to 95 MB, so they can fail too:

| File | Live pin | Size at pin | Pages |
|---|---|---|---|
| member-way script | e4342d4 | 95 MB | /account, /edit-profile, /the-map, contributor profiles |
| quick-log script | cab2aea | 95 MB | /the-map |
| account stories script | a1fb28e | 95 MB | /account |
| photo-clean script | 2201983 | 95 MB | /submit |
| Map 2.0 code, style, data | 46a21a1 | 95 MB | /the-map |
| Map 2.0 code, style, data | a81ffb9 | 92 MB | /account |
| owner map record | aeba470 | 92 MB | home |
| share script | 725d85a | 41 MB | /the-map, /account (under the limit) |

The map has a backup host (statically.io), so it usually recovers. The other scripts have none.

## Options compared

| Option | Verdict |
|---|---|
| Slim release branch in this repository | Recommended. jsDelivr only counts the files in the pinned commit, so a commit holding only the site files is 1.8 MB. Same workflow, same SRI, no new accounts. Already in use for 16.53.1. |
| Separate public release repository | Works the same way as the branch, with an extra repository to look after. No gain. |
| npm package through jsDelivr's npm endpoint | Works, and versions can never change. Needs an npm account and a publish token for every release. More steps for no gain today. |
| Webflow-hosted assets | Not possible. Webflow assets take images and documents, not scripts, and inline scripts are capped at 2,000 characters. The core is 199 KB. |
| Cloudflare (the tll-travel-wire Worker or Cloudflare Pages) | Works, and could serve from a thatlayover.life address later. But every page would depend on the Worker and its deploys. Worth keeping as a backup host, not needed now. |

## What changed on the branch

- The core tells the other layers where it was loaded from. The story search index now loads from that same release, not from a pin written into the code. In 16.53.1 the index was pinned to 44ded90, so search index updates would never have reached the site.
- `tools/layers-release-carry.txt` lists the eight files above. Each release commit copies them byte for byte from their live pins, so their SRI hashes stay the same and Webflow only needs a new address.
- `tools/release-layers.sh` builds each release commit from scratch: the core, chunks, search index and the carry list, nothing else. It refuses an uncommitted build or a release over 20 MB. It can commit to a candidate branch, prints the SRI for every script, then runs the CDN check.
- `tools/check-layers-cdn.mjs` fetches every file of a release from jsDelivr and compares it with git. It also checks the core's chunk hashes. With `--live` it lists every file the live pages load from this repository and flags pins over 50 MB.
- 32 new tests. All 385 tests pass.

Candidate release 16.53.2 is on the branch `layers-release-candidate`, commit `4099b925e88453aead40208f5cc59ffc669c5cd5`: 71 files, 1.8 MB. The CDN check fetched all 71 twice from jsDelivr and got the right bytes every time. Local copies of home, /stories?q=lisbon, /the-map, /account and /submit, with every pin swapped to the candidate, loaded every file from it. The map started, and search fetched its index from the candidate. Only the core is new code. The chunks are the same as 16.53.1.

## For Nancy to approve

1. **Make 16.53.2 the release.** Move `layers-release` forward to commit 4099b92 (git only, the site does not change).
2. **Site header (Webflow, needs the lock).** Register `tllsitelayersv16` version 16.53.2 and apply it in the header in place of the staged 16.53.1.
   - Address: `https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@4099b925e88453aead40208f5cc59ffc669c5cd5/src/site-layers/tll-site-layers-v16.js`
   - SRI: `sha384-OdWkGd1fy7tuW6A4P1/7nZots3RWCAoGRt4kzhzkhPx/+kK5JUgE1+fwllWDS6eZ`
3. **Page scripts (Webflow, needs the lock).** Register each one again at the new pin with the same SRI as today, and swap it in on its pages. The base address for all of them is `https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@4099b925e88453aead40208f5cc59ffc669c5cd5/`, followed by the file's path.
   - `src/components/member-way/tll-member-way-v1.js` (tllmemberwayv11), `sha384-5sLCIrRVb02lPTc8ICl8NTrJwYvYGeAgnH8c7hjMcUdRHPp82IEd28EjZKSrgZ0b`
   - `src/components/quick-log/tll-quick-log-v1.js` (tllquicklogv1), `sha384-XlVzAudOeXfapc7N8BhbRwk8PzI3ez23Pz90unIwCJUkiNbQUAPoJnqhXGCHr3G/`
   - `src/pages/account/tll-acct-stories-v2.js`, `sha384-EBvhI9bWyvCQpuEbPtNioPMfb4svlk9ZJBjiRyUwnsP3vzQq9rmVCNKPMeAmQutl`
   - `src/components/photo-clean/tll-photo-clean-v1.js`, `sha384-AAifp68s8YonZMUePqdmkqh1tCcdKPmYFwY640tgYRXuXGeynwK9F5ARXarResAO`
4. **Map embeds (Webflow, needs the lock).** In the /the-map embed 682054d4 and the /account map embed ee672abf, replace the 40-character pin everywhere it appears (`data-tll-version`, `var V=`, the stylesheet links) with the new pin. /account moves from the a81ffb9 map to the 46a21a1 copy. The only difference is a sample mode that /account does not switch on. Signed out, both versions behave the same.
5. **Home dashboard embed 405baa84.** Change the pin in the `owner-record.json` address to the new pin. The file is the same.
6. **Share script (optional).** Its 41 MB pin is under the limit. Moving it gives one source for everything, with no other change.
7. **Publish** to www, the apex and the subdomain, on your word.
8. **Check.** After the publish, run `node tools/check-layers-cdn.mjs --live`. It should end with `RESULT: OK`. Today it ends with "live pages still use over-limit pins", flagging 14 files on pins over the limit.

## Releasing a new version from now on

1. Build and test: `python3 src/site-layers/build-site-layers-v16.py`, then `npx vitest run`. Commit.
2. Release: `bash tools/release-layers.sh`. Use `LAYERS_RELEASE_BRANCH=layers-release-candidate` while a version waits for approval. The script prints the pin and SRI, then runs the CDN check. Go on only if it ends with `RESULT: OK`.
3. Webflow, under the lock: `register_hosted_script` with display name `tllsitelayersv16`, the new version number, the address and the SRI. Then `add_site_script` for the header with the new version in place of the old one, keeping every other site script as it is (the site is at its 15-script cap). Read it back.
4. Publish on Nancy's word, then run `node tools/check-layers-cdn.mjs --live`.
5. Log it in `handoff/WEBFLOW-LOCK.md`.

To ship a new version of a carried file (member-way, the map and so on), change its commit in `tools/layers-release-carry.txt`, release, and register the new SRI for that script.

## Rollback

- Apply the previous registered version again in Webflow (16.53.1, then 16.53.0) and publish. Old versions stay registered.
- For page scripts and embeds, put the old pins back. They are listed in the table above.
- Never force-push or rewrite `layers-release`. Old pins must stay on GitHub for rollback to work.

## Risks left

- The repository has to stay public. That is true today.
- jsDelivr can still have outages unrelated to size. Cloudflare as a second host would cover that, as a later step.
