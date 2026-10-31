# Photo captions and placement: plan (for Nancy's approval)

31 October 2026. From Roberta's beta note: "Could you add captions or choose where each photo sits in the story? No, I did not see this option."

## What exists already

- **Photo placements** collection (6accbabf97231f9b5b985c55): one row per story, field `photo-placement` with one line per inline photo, `Section heading | photo filename slug`. The story page script puts each listed photo under that heading; unlisted photos stay in the end gallery. Today an editor fills it by hand.
- **Story extras** collection: per-story extras written by /submit (sponsors, Lounge opt-in, owner id, anonymous, photos 26 to 50).
- Gallery images already carry alt text in the CMS.
- Stories is at Webflow's 60-field limit, so nothing new goes on Stories.

## What the writer gets on /submit

Under each chosen photo (the gallery previews built on 29 Oct):

1. **Caption** (optional, up to 200 characters): "What are we looking at?" Placeholder: "The Forum at 9am, Vesuvius behind."
2. **Where it goes**: a menu filled live from the section headings the writer typed in the story (lines on their own, as Roberta and Luke wrote theirs), plus "Top of the story (cover)" for the cover photo and "Gallery at the end" (default).
3. Drag handles to reorder the gallery.

The cover photo also gets a caption field. Nothing is required; a story with no captions publishes as today.

## How it travels

- One hidden field `photo-plan`: JSON list of `{file, caption, after}` in the writer's order, sent with the form (well under Webflow's 5,000-character field limit for 12 photos at 200 characters).
- Whoever builds the story (today Claude, by hand from Webflow Forms) writes:
  - `photo-placement` lines for photos placed under a heading;
  - a new `photo-captions` field on Photo placements: one line per photo, `photo filename slug | caption`;
  - the caption also becomes the photo's alt text when the alt is empty.
- The writer's words are kept exactly; captions are theirs, never written by AI.

## How readers see it

- A placed photo sits under its heading, full width of the text column, with the caption under it in 14px Plex Condensed, muted ink, and the writer's credit.
- Gallery photos show their caption in the lightbox and as a small line under the thumbnail.
- The cover caption sits under the hero (the existing `hero-caption` field).

## Build steps (each tested at 390 and 1440 on staging first)

1. Add the `photo-captions` field to Photo placements (additive).
2. /submit layer: caption and placement controls on the gallery previews, `photo-plan` hidden field, heading detection from the story text.
3. Story page layer: read `photo-captions` and render captions inline and in the gallery.
4. Builder notes in `handoff/` so every story built from a submission uses the plan.
5. Later, with the importer: write Photo placements automatically.

## Open question

- Caption length: 200 characters (recommended, one or two lines) or longer?
