# /share-photos send fix, 23 October 2026

Jay could not send photos. Two causes, both on the live page:

1. A safety gate (inline footer script `tll-photo-intake-safety-20261015`) stopped every submit and printed "Photo submissions are temporarily unavailable". It was waiting for location data to be stripped from photos (Nancy chose option A on 12 Oct, see reports/fix-pass-2026-10-12/exif-option-a-plan.md).
2. The registered script `tll_photo_upload_v1` (19 Oct) renamed the photos input on load, so the page check (`tll-photos-form-v1`) read the wrong field and always said "Add at least one photo". It also uploaded original photos, location data included, to Cloudinary the moment they were chosen.

Applied (staged, then published to the webflow.io subdomain only, task 40080057-d0f0-4e8b-b791-407a7edcf16a):

- Page footer: the gate block removed, nothing else changed (`page-footer-after.html` = first 48,127 characters of `page-footer-before.html`). Read back from Webflow after the write.
- Page script `tll_photo_upload_v1` removed from the page (still registered on the site, not deleted).
- New registered hosted script `tllphotosendv1` 1.0.0, footer: jsDelivr pinned to commit 4d12668de9b7f6343d6187881272eed28109772e, SRI sha384-JWLuzJCWJU2M9E0cABghbjq/JBU1cRoJCGqZyxjg6zii4IjFoew6JtqaiDny01/x. Source: src/pages/share-photos/v3/tll-photo-send-v1.js.

What the new script does on Send, after the page check passes: redraws each photo on a canvas (no EXIF: no GPS, camera or time), uploads the clean JPEG to Cloudinary (preset tll_photos, folder tll/photos), then sends the Webflow form with the links in a "photos" field. Nothing uploads before Send.

Offline test: src/pages/share-photos/v3/test/round-4-send, 14 of 14 checks pass (EXIF and a GPS marker present in the originals, absent from every upload; one Webflow send with the links; failure path sends nothing).

Not verified from the sandbox (network blocks the live site, webflow.io and jsDelivr): a real send on a phone. Nancy or Jay to test on the test site or after publish.

Follow-up for Nancy: photos chosen on /share-photos between 19 and 23 October were uploaded as originals to Cloudinary folder tll/photos before the form was blocked. They may carry location data. Delete them in Cloudinary if they should not be kept.
