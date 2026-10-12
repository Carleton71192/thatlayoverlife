# EXIF option A: strip location data in the browser (build plan, for Nancy's approval)

Nancy chose option A on 12 Oct. Nothing below is built yet. One fact first: the /share-photos form is a plain Webflow form (method GET, one file input). Webflow's form handler does not deliver files from a plain file input, so today's photos most likely never arrive anywhere. Re-encoding in the browser removes EXIF, but the file still needs somewhere to go. The plan covers both.

## What happens in the browser (the part you chose)

1. When a visitor picks photos, a small page script (new, so it needs your OK: `tll-photo-clean-v1`, footer code on /share-photos and later /submit) opens each file, reads only the orientation tag, draws the image onto a canvas at full size (long edge capped at 3,000 px), and exports a fresh JPEG at quality 0.9. Canvas output carries no EXIF at all: no GPS, no camera serial, no capture date.
2. The cleaned files replace the originals in the file input (DataTransfer), so whatever receives the upload receives clean files. This applies to every upload, named or anonymous.
3. Limits: HEIC from iPhone only decodes in Safari; on other browsers the script keeps the original and shows "Send a JPG or WebP from this browser, or use Safari." Files over 25 MB are skipped with a note. The script shows "Cleaning 3 photos…" and "Location data removed" so the page's old promise becomes true again.
4. Copy change after it works: "Up to 12 at a time. JPG or WebP. Location data is removed in your browser before anything is sent."

## Where the files go (needed for A to mean anything)

| Option | What it is | Cost to you | My recommendation |
|---|---|---|---|
| A1. Webflow File Upload element | Replace the file input with Webflow's File Upload field. Files land in Webflow form submissions. One file per field, 10 MB each, needs a site plan with file upload (Business or higher). The Designer swap is yours (the field sits in a form). | Plan check; 2 minutes in the Designer; "up to 12" becomes up to N fields or one zip | Simplest if the plan allows it |
| A2. The existing Worker (tll-travel-wire) | New POST route `/photos` that takes the cleaned files, stores them in an R2 bucket, and emails you a link list (or writes a CMS "Photo submissions" row). Keeps multi-file and 12 at a time. Needs an R2 bucket, a secret, and a deploy. | You create the bucket and run the deploy (I write the code) | Best long-term; also serves the /submit hero photo |
| A3. Uploadcare | Third-party widget; strips metadata server-side too (`strip_meta`). New account, key, and a widget script on the page. | Account plus a new script | Only if you want zero Worker work |

Recommended: A (browser clean) plus A2 (Worker route). Until A2 exists, the page says what is true today.

## One test first

Please send one photo through /share-photos as it is now, then tell me whether it shows up in Webflow's Forms panel with a file link. If it does not (my expectation), A1 or A2 is required, not optional.

## What I need from you
1. OK for the new script `tll-photo-clean-v1` on /share-photos (and /submit later).
2. A1 or A2 (or A3) as the upload target.
3. The test submission result.
