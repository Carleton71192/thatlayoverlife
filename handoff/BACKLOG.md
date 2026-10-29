# Backlog

- 29 October 2026, Nancy: "a later build, I want the map to have an upload feature." (/the-map: members upload from the map. Scope to agree: photos per country, or importing a list of countries.)

## Photos for link-out stories and images sent in chat (Nancy, 29 Oct 2026: "We need a fix for this as a future issue")
- Images pasted into the chat with Claude do not reach the session as files, so a photo sent that way cannot be uploaded. Today's workaround: Nancy uploads to Webflow Assets and sends the link.
- Built 29 Oct (needs `npx wrangler deploy` to go live): Worker GET /link-preview (src/link-preview.js) and the /submit layer tll-linkout-preview-v1.js. A pasted link shows the article's own share photo, title and description; the photo goes with the form as og-image only when it passes the photos-only check (JPEG/PNG/WebP, at least 600 x 315, not banner shaped, no ad, logo or icon address) and the writer leaves "Use this photo" ticked.
- Next: create the Stories draft from a link-out submission automatically (title, summary, URL, country, contributor, og-image as hero with credit "Image: {site}"), so no one builds them by hand. Needs a Webflow form webhook to the Worker.
- Next: a "Photo by" credit field for link-out heroes, so the story page does not say "Photo {writer}" for an image from the outlet.
