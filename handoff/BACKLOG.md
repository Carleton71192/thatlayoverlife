# Backlog

- 29 October 2026, Nancy: "a later build, I want the map to have an upload feature." (/the-map: members upload from the map. Scope to agree: photos per country, or importing a list of countries.)

## Photos for link-out stories and images sent in chat (Nancy, 29 Oct 2026: "We need a fix for this as a future issue")
- Images pasted into the chat with Claude do not reach the session as files, so a photo sent that way cannot be uploaded. Today's workaround: Nancy uploads to Webflow Assets and sends the link.
- Built 29 Oct (needs `npx wrangler deploy` to go live): Worker GET /link-preview (src/link-preview.js) and the /submit layer tll-linkout-preview-v1.js. A pasted link shows the article's own share photo, title and description; the photo goes with the form as og-image only when it passes the photos-only check (JPEG/PNG/WebP, at least 600 x 315, not banner shaped, no ad, logo or icon address) and the writer leaves "Use this photo" ticked.
- Next: create the Stories draft from a link-out submission automatically (title, summary, URL, country, contributor, og-image as hero with credit "Image: {site}"), so no one builds them by hand. Needs a Webflow form webhook to the Worker.
- Next: a "Photo by" credit field for link-out heroes, so the story page does not say "Photo {writer}" for an image from the outlet.

## Tester Roberta Bianchi, 29 Oct 2026
- Captions and choosing where each photo sits in the story: needs the v5 editor (inline photos) plus the Worker.
- "An expats map, showing where all the expats currently live": conflicts with the rule never to expose a member's current whereabouts. If built, it should show only cities that expats chose to list as their Location Expert desk (opt in), at city level, never a live location.
- Her Pompeii story is in Webflow Forms; her extra photos went to Nancy on Upwork.
- Long stories (29 Oct): Webflow keeps only about 5,000 characters per form field. /submit now also sends the full body in hidden fields body-part-1 to body-part-12 (3,500 characters each, cut at a space) when the story is longer than 3,500 characters. Whoever builds the story from Webflow Forms joins the body-part fields in order; the body field alone may be cut off.
