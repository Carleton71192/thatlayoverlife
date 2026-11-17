# /submit save on 17 Nov 2026: form entry count

Read-only count from the Webflow Data API (forms tool, list calls only) on 17 Nov 2026.
Window checked: 17 Nov 2026, 11:30 to 12:30 UTC. Counts and times only; no personal data.

## Forms involved

| Form | Form element | Pages | Notes |
|---|---|---|---|
| Story submission | 410fe31c-0208-fa02-297c-3b2122ab7d37 | /submit | 3 form records (one per domain); www entries land on 6a0dfb0d2d3ed4c6d2b357e7 |
| Html Form (share photos) | c09ceb51-0ee9-0a93-6196-eee626758710 | /share-photos | the "Html Form" photo entries in the notification emails |
| Html Form (pet passport) | 152582f5-e04c-ffa4-dc94-4a8cb930caf2 | /my-pets | the pet form entry |
| Link-out story | 51b9abee-68eb-6095-9a21-24484793e255 | /submit | no entry in the window |

The site holds 273 form records in all (most are the "Tell the editor" form, one per page and domain) and 13 submissions in total.

## Entries in the window (site-wide, all forms)

| Time (UTC) | Form | Path | Content check |
|---|---|---|---|
| 11:52:59.494 | Html Form (pet passport) | /my-pets | one pet record; no avatar or pet gallery URL |
| 11:56:15.338 | Html Form (share photos) | /share-photos | 1 photo, Cloudinary version 1794916574 (11:56:14 UTC) |
| 11:58:03.484 | Html Form (share photos) | /share-photos | 1 photo, Cloudinary version 1794916681 (11:58:01 UTC) |
| 12:09:44.000 | Story submission | /submit | trip code matches; body present; hero and two gallery URLs present |

Nothing else was submitted on the site in the window. The next earlier entry anywhere on the site is from 11 Nov.

## Story submission

- Count in the window: 1. No second entry with the same trip code exists in the form at any time (the form holds 4 entries in total; the other 3 are from October with other trip codes).
- Not partial: title, excerpt, body, region, themes, consent boxes and credit fields are filled.
- hero-image: present, Cloudinary version 1794917373 (12:09:33 UTC).
- photo-gallery: present, two URLs, versions 1794917377 (12:09:37 UTC) and 1794917382 (12:09:42 UTC).
- The photo plan field lists one captioned gallery photo, consistent with the two gallery URLs.
- No Story submission entry in the window has an empty or missing hero-image or photo-gallery field.
- dateSubmitted carries whole seconds (.000), while every other entry on the site carries milliseconds.

## Html Form photo entries

- Count in the window: 2, both on the share photos form.
- Not the same photo twice: different Cloudinary public IDs, different upload versions (107 s apart), different captions and places.
- Each entry is about 1 to 2 s after its own upload, which matches a pick, upload, then send flow.

## Reading

- The three story uploads ran one after another at send time (12:09:33, :37, :42), about 4 to 5 s each, and the entry was saved 2 s after the last one. The live submit chunk says the gallery photos "upload when you send", so the final step waits about 11 s before the save lands.
- Only one entry exists, so the extra clicks did not create duplicates. Either the extra clicks fell inside that wait, or earlier attempts failed before any form post. An earlier attempt that had uploaded photos would have left Cloudinary assets with versions before 1794917373; a Cloudinary read could settle that.
