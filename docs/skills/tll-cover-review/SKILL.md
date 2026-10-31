---
name: tll-cover-review
description: Weekly review of That Layover Life cover candidates. Finds live stories whose cover photo is a place (never a selfie, ad, logo or stock), proposes ticks and unticks for the Stories "Cover candidate" switch, refreshes candidates.json, rebuilds the rotating cover and the site layers bundle, and reports to Nancy. Use when asked to review covers, refresh cover candidates, or on the weekly scheduled run.
---

# TLL weekly cover review

The home page cover rotates every Monday (00:00 UTC) through the stories in
`src/design/magazine-2026-10/cover-build/candidates.json`. This skill keeps that list right.
(Kept in docs/skills because sessions may not write to .claude/skills. To load it as a real skill, copy this folder to
.claude/skills/tll-cover-review/.)

## House rules (do not break)
- Photos are always members' own photos or art. Never an ad, logo, banner, stock image or AI image.
- A cover photo shows a place. No selfies, no faces filling the frame, no group portraits, no screenshots, no text-heavy images.
- Never write or change a headline, body or caption. Alt text may be proposed, never published without Nancy.
- Never expose where a member is now. Never delete a story, field or member.
- US English, no em dashes, no exclamation marks, no word containing s-h-i-p, no counts typed by hand.
- Log every Webflow write in `handoff/WEBFLOW-LOCK.md`. Commit trailer per the repo rules.

## Steps
1. `git pull --rebase` on the working branch.
2. List live Stories (collection 6a0b29eddc14f1444e935760) with the Webflow MCP `data_cms_tool` (live items).
   Skip sponsored or hosted stories, drafts, archived items and any story without a hero image.
3. Look at each hero image (download and Read it, or `get_asset_preview`). Judge it:
   - **Yes**: landscape, street, food, wildlife, architecture or detail of a place; sharp and at least 1200 px wide.
   - **No**: a selfie or portrait, a face larger than about a fifth of the frame, a group photo, a logo, ad or screenshot,
     blurry or small.
4. Compare with the current Cover candidate ticks (field id e993155563a0afae0174de567b701608, slug `weekend-read`).
   Build two lists, stories to add and stories to remove, each with a one-line reason.
5. Under Nancy's standing approval, tick stories that clearly pass and untick ones that clearly fail, then publish those
   items. Anything borderline goes in the report as a question and is left unchanged.
6. Rewrite `candidates.json` from the ticked, passing stories (fields: id, slug, title, img, alt, contributor, byline,
   published, pillar). If a contributor is missing from `AUTHORS` in `build-cover.py`, add them (name, slug, avatar URL
   from the Contributors collection 6a0b29c7a7b1840afe9390a5).
7. Run `python3 src/design/magazine-2026-10/cover-build/build-cover.py`, then
   `python3 src/site-layers/build-site-layers-v16.py`. Check the new entries with `?cover=N` at 390 and 1440 if a browser
   can reach the site; otherwise render the built cover HTML locally with Playwright.
8. Only when candidates.json changed: commit, push, then release. SRI hash of the committed bundle
   (`git show HEAD:src/site-layers/tll-site-layers-v16.js | openssl dgst -sha384 -binary | openssl base64 -A`),
   `register_hosted_script` (display name tllsitelayersv16, next minor version, jsDelivr URL pinned to the commit),
   `add_site_script` (header), `publish_site` to both custom domains (6a0de97be677e4daf81431cc, 6a0de979e677e4daf8143190)
   and the subdomain. Space publishes about 75 seconds apart.
9. Report to Nancy in one short message: next week's cover, stories added and removed with reasons, questions on
   borderline photos.

## Needs
- Webflow connector (CMS read, item update and publish, scripts, site publish).
- Network access to cdn.prod.website-files.com to look at photos; without it use `get_asset_preview`, or list the
  stories for Nancy to check by eye and change nothing.
