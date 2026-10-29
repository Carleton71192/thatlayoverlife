# Your content: license draft modeled on Instagram and Facebook (29 Oct 2026)

Status: DRAFT. Nothing here is live. It makes legal promises in Nancy's name, so it needs her approval and a lawyer's check before any of it goes on the site.

Nancy asked on 29 Oct, about the /share-photos success message: "Change this. We need to build the same legal policies as FB and Insta." Earlier the same day she said TLL should flag harmful content rather than edit or approve posts first.

## Sources and how sure we are

This session's network blocks help.instagram.com and facebook.com, so the Meta wording below comes from secondary sources that quote the terms. Before the lawyer review, read the live pages and check every quoted line:

- Instagram Terms of Use: https://help.instagram.com/581066165581870
- Meta (Facebook) Terms of Service: https://www.facebook.com/terms

The secondary sources used:

- Snopes, a fact-check that quotes Meta's terms: https://www.snopes.com/fact-check/facebook-meta-posts-made-public/
- Brunel University, "Ten things you should know about Instagram's terms of use": https://www.brunel.ac.uk/news-and-events/news/articles/Ten-things-you-should-know-about-Instagrams-terms-of-use
- The Conversation, the same article: https://theconversation.com/ten-things-you-should-know-about-instagrams-terms-of-use-102800
- copyrightlaws.com, "Instagram and copyright": https://copyrightlaws.com/instagram-and-copyright/
- Meta's 2019 note on updating its terms: https://about.fb.com/news/2019/06/updating-our-terms/amp/
- Isgur v. Meta complaint (2026), which quotes the 2022 and 2025 terms: https://www.courthousenews.com/wp-content/uploads/2026/07/isgur-v-meta-third-amended-complaint.pdf

## What Instagram and Facebook say (as quoted by those sources)

1. **You keep ownership.**
   - Instagram: "We do not claim ownership of your content, but you grant us a license to use it."
   - Facebook: you own the intellectual property rights in content you create and share, and nothing in the terms takes those rights away.
2. **The license you give them.** Wording common to both: "a non-exclusive, transferable, sub-licensable, royalty-free, and worldwide license to host, use, distribute, modify, run, copy, publicly perform or display, translate, and create derivative works of your content (consistent with your privacy and application settings)."
   - "Transferable" and "sub-licensable" mean they may pass the license on to others.
3. **When it ends.**
   - The license ends when the content is deleted from their systems. You can end it at any time by deleting the content or your account.
   - Exceptions: copies others shared that they have not deleted, and copies kept for legal reasons or investigations.
   - Meta's terms allow up to 90 days to delete, then up to another 90 days to clear backups and disaster-recovery copies.
4. **Your promises.**
   - You only post content you have the right to share.
   - You do not break anyone's intellectual property or other rights.
   - You follow the community rules.
5. **Moderation.**
   - Posts go up right away. There is no review before posting.
   - Anyone can report a post.
   - They remove content that breaks the rules and can restrict accounts.
   - Intellectual property owners use a separate copyright and trademark report form, with a counter-notice route.

## What TLL says today

From the /share-photos form (`src/pages/share-photos/v3/test/round-3-fix/mock-in.html`, live wording as of 23 Oct), there are three promises, each ticked separately and never pre-ticked:

- **agree-rights:** "This is my photograph. I took it. It is a real photograph, not AI-generated and not substantially altered by AI tools, and it follows the Community Guidelines."
- **agree-licence:** "I have read the license and I agree. I keep my copyright. TLL can publish it with my name, never sells it, never passes it on, never feeds it to an AI."
- **agree-people:** "If a person is the clear subject, they are fine with it being published. Crowd and street scenes where nobody is the focus are fine. If a child is the subject and not yours, please do not send it."

The form also says: "A human looks at every photo before it goes up. Changed your mind later? Write to hello@thatlayover.life and we take it down."

There are three opt-ins, all unticked by default. With none ticked, the photo appears in the Lounge only.

- **syndication-social:** "OK to post on TLL social", meaning Instagram and LinkedIn with the same credit line.
- **syndication-rotation:** "OK to include in the Home rotation gallery".
- **syndication-press:** "OK for press to license this photo (we'll ask first)".

The success message reads: "Got them. A human looks at every photo before it goes up, so give us a little time. Changed your mind? Write to hello@thatlayover.life and we take it down, before or after it is published."

From the /submit charter checkbox (`src/pages/submit/live-2026-10-26/form-story-export-2026-10-13.html`):

- The writer confirms: "These are my words and my photos (or I have the right to publish them), and they follow the Community Guidelines. If a person is the clear subject of a photo, they are fine with being published. If a child is the subject, I have a parent or guardian's permission. No AI-generated writing."
- The charter adds: "That Layover Life publishes in good faith but is not liable for inaccuracies, and does not represent its authors or submitters. Hate has no home here: hateful content is removed and its author is done publishing with us."
- The story opt-ins are newsletter, social quotes, and "press to reach out".

The Terms of Service page (/terms) is about 1,400 words. Its text is not in the repo; it was not read for this draft.

## The gaps

| Topic | Instagram and Facebook | TLL today | Gap |
|---|---|---|---|
| Ownership | User keeps it | "I keep my copyright" | None. |
| License scope | Host, use, distribute, modify, copy, display, translate, derivative works | "TLL can publish it with my name" | TLL never says it may resize, crop, compress or make thumbnails. Every published photo is resized, so this needs saying. |
| Transferable and sub-licensable | Yes | "never sells it, never passes it on" | TLL promises the opposite. Copying Meta here would break a promise already made to everyone who has submitted. See open question 1. |
| AI training | Meta does not rule it out | "never feeds it to an AI" | TLL is stronger. Keep it. |
| Where it can appear | Everywhere, by their settings | Lounge by default; social, home rotation and press only by opt-in | TLL is narrower and clearer. Keep it. |
| When the license ends | On deletion, with set exceptions and a backup window | "write to us and we take it down", with no timing and no exceptions | Add a time frame, a backup window, and the exceptions: already-sent newsletters, social posts already shared by others, and legal holds. |
| Moderation | Posts at once; report and remove | "A human looks at every photo before it goes up" | Goes against Nancy's flag-only call. Change to: photos may go up right away, anyone can flag, and we remove what breaks the rules. |
| Reporting and IP complaints | Report button; a separate copyright and trademark form | None stated for photos | Add a "Flag this" route and a copyright complaint route. US hosting means a DMCA agent. Danish and EU users mean the EU Digital Services Act notice and action rules. |
| Liability and warranties | User warrants rights; platform limits liability | Rights promise yes; liability line only on /submit | Put both in one Terms section that the photo and story forms point to. |
| Age | 13+ | 16+ | Keep 16+. |
| Version tracking | Dated terms | The Photo submissions collection has `license-version` and `consent-recorded-at` fields, both unused | Stamp each submission with the license version it agreed to. |

## Draft: "Your content" section for the Terms of Service

> **Your content**
>
> **You own what you share.** Your photos, stories, captions and notes stay yours. We do not claim ownership of anything you send us.
>
> **The permission you give us.** When you send a photo or story to That Layover Life, you give us a non-exclusive, royalty-free, worldwide license to host, store, copy, show and share it on That Layover Life, with your credit as you chose it. This includes making the technical copies the site needs: resizing, cropping to fit a page, compressing, and making thumbnails. We do not change what your photo shows or what your words say.
>
> **Where it can appear.** By default, a photo appears in the Layover Lounge and on your public page, and a story appears in Stories. It goes further only if you said yes on the form: the home page rotation, our newsletter, or our social accounts, always with your credit. Press and partner use needs a separate yes from you each time, and we ask you first.
>
> **What we never do.** We do not sell your content. We do not pass it on to anyone else to use for their own purposes. We do not use it, or let anyone use it, to train AI.
>
> **What you promise us.** You took the photo or wrote the story, or you have the right to share it. It is real and not made by AI. If a person is the clear subject of a photo, they agreed to it being published. If a child is the subject, you are their parent or guardian or have their permission. It follows our Community Guidelines and does not break anyone's copyright, privacy or other rights.
>
> **How we look after the site.** We do not approve posts before they go up and we do not rewrite them. Anyone can flag a photo or story that breaks the Community Guidelines. A human reviews each flag, usually within 48 hours, and removes what breaks the rules. Hateful content is removed, and its author can no longer publish with us.
>
> **Taking it down.** You can ask us to remove anything you sent, at any time and for any reason, by writing to hello@thatlayover.life or using Remove on your account page. We take it off the site within 7 days. Your permission to us then ends, with three exceptions:
>
> - copies already sent in a newsletter, or already shared by other people on social media, which we cannot recall;
> - backup copies, which are deleted within 90 days;
> - anything we must keep for a legal reason, for as long as that reason lasts.
>
> **If someone used your work without permission.** Write to hello@thatlayover.life with the link, what you own, and how to reach you. We take the content down while we look into it.
>
> **Age.** You must be 16 or older to send us content.
>
> **Changes.** If we change these terms, we tell members before the change takes effect. Content you sent stays under the terms you agreed to when you sent it.

Notes on the draft:

- "We take it down while we look into it" is a simple notice-and-takedown route. A lawyer should decide whether TLL needs a registered DMCA agent and a formal counter-notice process. It likely does if it wants the US safe harbor. The EU DSA notice-and-action rules also apply.
- "Usually within 48 hours" matches the 48-hour line used elsewhere on the site.
- The 7-day and 90-day figures are proposals, not current practice.

## New label text for the forms

The input names stay the same; only the visible words change.

/share-photos, three promises, ticked separately:

- **agree-rights:** "I took this photo, or I have the right to share it. It is a real photo, not made by AI, and it follows the Community Guidelines."
- **agree-licence:** "I keep my copyright. TLL may show it on the site with my credit, and only where I said yes below. TLL never sells it, never passes it on, and never uses it to train AI. I have read the Your content terms."
- **agree-people:** "If a person is the clear subject, they agreed to it being published. If a child is the subject, I am their parent or guardian or I have their permission."

The current agree-people line says "If a child is the subject and not yours, please do not send it." That is stricter than /submit, which allows it with a parent or guardian's permission. Nancy should pick one rule for both forms; see open question 4.

/submit charter line:

- "These are my words and my photos, or I have the right to share them. They are real, not written or made by AI, and they follow the Community Guidelines. If a person is the clear subject of a photo, they agreed to it being published. If a child is the subject, I have a parent or guardian's permission. I have read the Your content terms."

## /share-photos success message, three options

Recommended, option A:

> Got them. Your photos can go up in the Lounge without waiting for us. Anyone can flag a photo that breaks the Community Guidelines, and a human checks every flag. Changed your mind? Write to hello@thatlayover.life and we take it down within 7 days.

Option B, shorter:

> Got them. They can go up right away, with your credit. Want one taken down? Write to hello@thatlayover.life, any time, for any reason.

Option C, a gentler middle ground if photos are not truly live at once yet:

> Got them. Your photos go up in the Lounge with your credit, with no approval queue and no edits. If one breaks the Community Guidelines, someone can flag it and a human takes a look. To remove one, write to hello@thatlayover.life.

Caution: today a photo does not go live on its own. The Photo submissions collection is empty, and nothing turns a form submission into a public Lounge photo yet. Options A and B say photos can go up right away, which is only true once that path exists. Until then, option C is the honest one, or option A without its first sentence.

## Needs a lawyer's check

- **Jurisdiction and governing law:** TLL is edited in Copenhagen, the site runs in the US on Webflow, and the members are worldwide. That brings in EU GDPR, the DSA, Danish law, and US DMCA safe harbor.
- **Photos of people:** GDPR treats a photo of an identifiable person as personal data. The draft relies on the uploader's promise; a lawyer should say whether that is enough.
- **License wording:** whether "non-exclusive, royalty-free, worldwide" with the listed actions covers everything TLL does, including the newsletter, social posts and Webflow's image CDN, without being transferable or sub-licensable.
- **Takedown timing:** whether the 7-day takedown and the 90-day backup window are workable promises.
- **Existing submissions:** how to treat content sent under the old wording. Recommended: it stays under the old promises, which are narrower anyway.
- **Liability:** a limitation of liability and an indemnity clause. Meta has both; TLL's Terms may already have them, but this draft did not read them.

## Open questions for Nancy

1. **Same as Meta, or narrower?** Meta's license is transferable and sub-licensable, so they can pass your content on. TLL has promised "never sells it, never passes it on, never feeds it to an AI." Recommendation: keep TLL's narrower promise. It is a reason for members to trust TLL over Instagram, and changing it would break a promise already made.
2. **Live at once, or after a look?** Should photos go live without review, matching your flag-only policy, with a human handling flags? Today nothing posts on its own, so this needs the publishing path built first.
3. **Takedown routes:** is "write to hello@" enough, or do you want a Remove button on the account page and a Flag link on each photo?
4. **Children:** one rule for both forms. Either "not yours, do not send it" (today's photo form) or "with a parent or guardian's permission" (today's story form).
5. **Press:** is "we ask you first, every time" still the rule for press licensing? The draft keeps it.
