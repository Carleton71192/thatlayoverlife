# Multilingual stories, Phase 1: change log for Nancy's approval (29 Oct 2026)

Status: **nothing below is live.** Code is built and tested in the repo; no CMS field, form, template element, script or publish has been changed on the site for this work. Each row waits for Nancy's yes.

The three docs the prompt names (tll-multilingual-stories-storm-2026-10-29.md, tll-privacy-guardrails-2026-10-19.md, tll-story-template-fixes-2026-10-12.md) are not in the repo or in Google Drive search. This plan follows the prompt itself. Please attach them if any rule there differs.

## Step 0 findings

**a. Target languages.** Provisional set until Nancy picks from GA4 (property G-T1K83PRL1R, Language and Country reports): English, Spanish, Portuguese (Brazil), Danish. All four are DeepL target languages (EN-US, ES, PT-BR, DA). The full picker list (de, fr, it, nl, sv, nb, ja) is also DeepL-supported, per DeepL's docs as quoted in search results; the official pages were not reachable from this session.

**b. Where submissions land today (evidence: handoff/MULTILINGUAL-P1-SUBMIT-FLOW-2026-10-29.md).**
- The live /submit "Story submission" form is a native Webflow form (3 steps by the footer script tll-form-steps-v2). Submissions land in **Webflow Forms only**, plus the form notification email.
- **No importer and no auto-post exist.** No Webflow webhooks, no deployed Worker route, no cloud scheduled task. Luke's Stories draft was built by hand. The 19 Oct "post live, Nancy checks after" code (tll-worker /publish and its email) is built but not deployed.
- So "Auto-post-live stays" and "add a line to Nancy's review flag" have nothing to attach to today. Proposal: the review line goes into whichever comes first, the importer's notes-to-editor or the /publish email: "Written in Español. English preview: https://www.thatlayover.life/stories/{slug}" (Nancy taps "Read it in English" on the story; the preview uses the same endpoint).

**c. DeepL and hosting (sources: DeepL support "DeepL API plans", developers.deepl.com usage limits, auth and HTML handling pages, via search extracts).**
- **Important:** DeepL's support page says **API Free is no longer available for new sign-ups**. New accounts get a **Developer plan: 1,000,000 characters in total, not monthly**. Existing Free keys (500,000 characters a month) keep working. Over the limit DeepL stops with HTTP 456; it does not bill. Signup says "no credit card required" (unverified for the Developer plan).
- Endpoint for free keys: `https://api-free.deepl.com/v2/translate`, header `Authorization: DeepL-Auth-Key <key>`, JSON body, `tag_handling: "html"`. HTML mode keeps anything marked `translate="no"`. Request limit 128 KiB. Characters are counted on the source text.
- Data use: third-party summaries say Free-tier text may be used to improve models; paid plans delete text after translation. Stories sent are already published, so the risk is low; confirm at deepl.com/privacy.
- **Hosting: the existing Cloudflare Worker (tll-travel-wire) and its KV**, not Webflow Cloud. Workers Free: 100,000 requests a day, network wait time is not CPU time, KV 1,000 writes a day (one write per new translation and one usage counter write). Webflow Cloud is metered against the site plan's request and CPU quotas. **Cost: $0** on either DeepL path as long as the cap holds.
- **Cap:** the endpoint stops at `TRANSLATE_MONTHLY_CAP` characters a month (default 450,000 for a Free key). On a Developer plan key, set it to 80,000 so the 1,000,000 lasts about a year. Each story is translated once per language and cached until its text changes.

## Change log

| # | Where | What (before → after) | Why |
|---|---|---|---|
| 1 | CMS, Stories | New **Option** field "Story language" (slug `story-language`). Options named "Native name (code)": English (en), Español (es), Português (Brasil) (pt-BR), Dansk (da), Deutsch (de), Français (fr), Italiano (it), Nederlands (nl), Svenska (sv), Norsk bokmål (nb), 日本語 (ja), Other. Default English (en). Backfill: every existing story set to English (en). | The source of truth for the story's language; the code in brackets drives lang and the endpoint. |
| 2 | CMS, Stories | New **Plain text** field "Story language (other)" (`story-language-other`), a BCP-47 code when Other is picked. | Any language can be submitted. |
| 3 | CMS, Stories | New **Switch** "Allow translation" (`allow-translation`), default on. Backfill: on for Nancy's stories. For member stories: on only where the contributor terms already allow it; today's terms do not mention translation, so **off for Chesney Lish, Barzy Adam, Luke Luby, Zain M (link-out) and any Anonymous-house stories until each agrees**, listed for Nancy. | Consent before any translation. |
| 4 | CMS, Stories | New **Rich text** "Author translation (English)" (`author-translation-english`), optional. | The writer's own English version wins for English readers, labeled "Translated by the author." |
| 5 | Note | Stories is at Webflow's 60-field cap (handoff notes, Oct 19). Adding 4 fields needs 4 empty or unused fields removed first, or the two code fields folded into the "Story extras" collection like hero focal point. **Nancy picks.** Nothing is deleted without her yes. | Field cap. |
| 6 | /submit step 1 (layer `tll-submit-lang-v1.js`, staged) | Adds "I'm writing in" (required select, guess from Chrome's Language Detector on the writer's text when available, else browser language, else English; the writer's choice always wins), "Let readers see a translation of my story." (on) with "Your words stay exactly as you wrote them. Translations are labeled and the original is one tap away.", and a collapsed "Got your own English version? Paste it here." for non-English stories. New form fields: story-language, story-language-other, allow-translation, author-translation-english. Existing fields unchanged. 19 Oct AI rules unchanged. | Step 2 of the prompt, without Designer edits. |
| 7 | Worker `POST /translate` (src/translate.js, routed in src/index.js) | New route. Takes `{ itemId, target }` or `{ slug, target }` only; reads the **published** item from Webflow itself; refuses extra fields, unknown targets, same language, unpublished items, Allow translation off; sends title, excerpt and body (places marked `translate="no"`; author, sign-off, hashtags never sent); author English wins for English; KV cache by item + target + SHA-256 of the source; monthly cap and usage log; 40 calls an hour per IP; no cookies; CORS thatlayover.life and www only. 16 tests; all 219 Worker tests pass. | Step 3. |
| 8 | Story template (Designer, staged after #1 to #4 exist) | Three hidden helper elements inside the story page: `[data-tll-story-lang]` text bound to Story language; `[data-tll-tr-allow]` empty div shown only when Allow translation is on (conditional visibility); `[data-tll-tr-author]` shown only when Author translation is set. | The layer reads them; Webflow cannot bind an option field straight into a valid lang value. |
| 9 | Story page (layer `tll-story-translate-v1.js`, staged) | Sets `lang` on `.tll-story-body` from the story language (the html element keeps lang="en"). Pill above the body, JetBrains Mono: "Read it in English" / "Leer en español" / "Ler em português" / "Læs på dansk"; after the swap "Show the original" and the label "Translated by a robot. Some jokes may have missed their connection." (draft; Nancy approves) or "Translated by the author." Swaps title, excerpt and body text only; images, captions, names, places and the sign-off stay. Wrapper lang follows the shown language; aria-live announces the swap; keyboard and screen reader friendly; remembers the reader's language in localStorage (try/catch); never on load, never a redirect, never unlabeled; translated text never in page source. Skeleton shimmer while loading; error "Our translator missed its connection. Try again in a minute." with the original kept. GA4 `translate_open` and `translate_original` with source_lang and target_lang only. UI strings in es, pt-BR and da are drafts for Nancy. | Step 4. |
| 10 | Story cards (Designer + layer `tll-card-lang-v1.js`, staged) | Hidden `[data-tll-card-lang]` text in the card template bound to Story language; non-English stories get a small black tag ("ES", "DA", "PT-BR") next to the washi-tape place label (.tll-lib-meta). | Step 4, cards and rails. |
| 11 | Contributor terms (draft below) | Add translation, including machine translation, to the license TLL receives. Not published without Nancy's yes. | Berne Art. 8: translation is the author's right. |
| 12 | Nothing for Google | No new URLs, no hreflang, no redirects, no new locales. Translations exist only in the reader's browser after a tap. | Phase 1 rule. |

## Draft contributor terms language (for Nancy and her lawyer)

> **Translations.** If you leave "Let readers see a translation of my story" on, you also allow That Layover Life to show readers a translation of your story, including a machine translation, on That Layover Life. We always label a translation, we never change your original, and the original is always one tap away. You can turn this off at any time from your story, and we stop offering translations of it. If you give us your own English version, we show that to English readers, labeled as yours.

This sits next to the content license draft in handoff/LEGAL-CONTENT-LICENSE-DRAFT-2026-10-29.md and needs the same lawyer's check.

## Nancy's setup steps (she does these; nothing here asks for a key in chat)

1. Go to https://www.deepl.com/pro-api and sign in or create an account. If you already have a DeepL API Free key (it ends in `:fx`), keep it. If DeepL only offers the Developer plan, pick it; do not add a payment method.
2. In the account, open **API Keys** and copy the key.
3. In the repo folder, run `npx wrangler secret put DEEPL_KEY` and paste the key when asked. It goes only into Cloudflare's secret store.
4. If the key is a Developer plan key (1,000,000 in total), add `TRANSLATE_MONTHLY_CAP = "80000"` under `[vars]` in wrangler.toml. With a Free key leave it out (450,000 a month).
5. Run `npx wrangler deploy`. This also takes live the link-preview route and needs the MEMBERSTACK_KEY fix from earlier today.
6. Tell me "deployed", then approve rows 1 to 11 and I stage the CMS fields, template helpers and layers, test, and publish after your yes.

## Release checklist status

| Check | Status |
|---|---|
| 1. Spanish and Danish test stories post, carry lang, flag Nancy | Waiting: needs rows 1 to 4, 6, 8 and an importer or /publish (none exists). |
| 2. Toggle both directions, label, exact original restored | Passed on a stand-in with the real endpoint code (src/pages/story/translate-p1-2026-10-29/try.mjs): Spanish story for an English reader, English story for a Spanish reader at 375 px, exact HTML restored, lang back to es. |
| 3. Allow off: no toggle, endpoint refuses | Passed (stand-in and unit test, 403). |
| 4. Arbitrary text, unknown targets, unpublished items refused; cap and rate limit | Passed (unit tests). |
| 5. No key or translated text in page source | Passed on the stand-in (no "[EN-US]" in source before the tap; the key lives only in the Worker). Live check after deploy. |
| 6. Names, places, sign-off untranslated | Places sent with translate="no"; author and sign-off never sent (unit test, stand-in). |
| 7. 375 px, desktop, keyboard, axe, Lighthouse | 375 and desktop and keyboard on the stand-in; axe and Lighthouse on the live page after staging. |
| 8. No new URLs, hreflang or redirects | By design. |

## Open questions for Nancy

1. GA4 Language and Country reports, or her pick of target languages.
2. Which DeepL key: an existing Free key, or the new Developer plan (one-time 1,000,000)?
3. Field cap: which 4 Stories fields can go, or move the two code fields to Story extras?
4. Contributor terms: approve the draft above; which existing member stories may be switched on.
5. Freelance story contracts (Chesney, Barzy via Upwork): do they cover translation?
6. The robot label line and the es, pt-BR, da UI strings.
7. Phase 2 language data: which languages would earn real locales.

## Files

- src/translate.js, src/index.js (route), test/translate.test.js
- src/site-layers/tll-story-translate-v1.js, tll-card-lang-v1.js, tll-submit-lang-v1.js (not in the bundle)
- src/pages/story/translate-p1-2026-10-29/try.mjs, form.mjs and screenshots
- handoff/MULTILINGUAL-P1-SUBMIT-FLOW-2026-10-29.md
