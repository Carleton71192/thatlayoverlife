# /share-photos v3 repair log (13 Oct 2026)

Stage: repair after read-back. Page 6a0dfca3f9fa5b751d154257, site 69d6145cf421c777840c1e25. Agent fable-5.1|workflow|rpkqv, session ses_3JxJ0e4t0CfR7N00ZUfLZKPGz64. No publish call, no site code, no registered scripts, no page code write. No write in this stage landed: every attempted write was refused by Webflow with applied_keys empty, and each was read back. Fresh invariant read-back: applied/repair-readback.json.

Id shorthand: …8687 means c09ceb51-0ee9-0a93-6196-eee626758687.

## Fixes attempted

| Mismatch | What was done | Read-back | Result |
|---|---|---|---|
| 41 accept on …8687 | 1. data_element_tool set_attributes [accept=image/jpeg,image/webp] (the apply plan's route): "Tool set_attributes failed: An internal error occurred". 2. Same call retried once with return_element_info: same error. 3. data_element_settings_tool set_settings key "attributes" with the full current list read seconds before (accept=image/jpeg,image/webp, multiple=""): refused, `attributes[0]: "accept" is a reserved attribute name`, applied_keys []. | get_attributes and all_raw_settings after each attempt: accept "image/*", multiple "", domId photos-upload, name photos, type file, required true. Unchanged. | Not fixable through the API. The "attributes" key exposes accept for reading but Webflow refuses to write it (reserved). Left for the Designer: …8687 field settings, accept to image/jpeg,image/webp, keep multiple. Runtime: footer script step 2 sets accept on load (page footer line 261). |
| 33 to 38 placeholders on …8687, …8692, …8696, …869a, …86b8, …86c5 | Probe: all_raw_settings on …8687 and …8692 and query_settings (all) on …8692 list domId, visibility, name, required, type, attributes only. get_attributes name "placeholder" on …8692 returns null, and no input lists placeholder among its attributes. Plan route tried once on …8692: set_settings key "placeholder" clear: refused, `Setting "placeholder" is not applicable to this element`, applied_keys []. Not repeated on the other five (same element type FormTextInput). The "attributes" key was not used: placeholder is not in any attribute list and is reserved. | all_raw_settings on …8692 after the attempt: unchanged (domId field, name country, required true, type text, attributes []). | Not fixable through the API. Left for the Designer (section 5 step 3). Note for the checker: the placeholders it found come from the two form records, which Webflow compiles at publish (lastUpdated 07:42:50Z). They will keep showing the old placeholders until the next publish even after the Designer clears them, so a pre-publish read-back on get_form cannot pass. Runtime: footer script step 1 removes the attribute on load (page footer lines 257 to 258; footer sha256 464d1b35…5520, same as the apply readback). |
| publish-state (site published 2026-10-13T07:42:52.854Z) | Nothing to write. No unpublish or publish exists inside the stage rules, and none was made. get_site re-read at repair time. | lastPublished and fullSiteCompiledAt still 2026-10-13T07:42:52.854Z on www.thatlayover.life and thatlayover.life; site lastUpdated 10:33:15.454Z; page lastUpdated 10:49:36.145Z (no change from this stage). | No publish since the checker's read. The 07:42Z publish came before every apply write, so the live page is the pre-apply page and the v3 edits remain staged only. Left for Nancy (see below). |

## Invariant check against state/element-map.json

all_resolved_settings read on 19 elements: the 14 inputs (photos, country, city, year, trip-type, caption, pets-along, credit-mode radios named, pen-name and anonymous, syndication-social, syndication-rotation, syndication-press, agree-rights, agree-licence, agree-people), form …8710, and gate blocks …8719 and …872a. 86 values compared (domId, name or groupName and value, required, type, attributes, form method, action, redirect, state, name).

- Matches the capture on every value except the two approved changes: …8687 required false to true (op 40, row 12) and …869a required true to false (op 39, row 17).
- Form …8710: method get, action "", redirect "", name "Html Form", data-tll-form share-photos, data-ms-member-bound true, enctype multipart/form-data. Unchanged.
- data-ms-content members on …8719 and anonymous on …872a. Unchanged.
- Form records 6a0dfd649a488acac67dd773 and 6a0dfd639a488acac67dd65d keep their ids, page and form element (…8710) and field names. Their field ids were re-minted by the 07:42Z publish compile (6acdc5da… to 6acde0fa…); those are Webflow form-record internals, not element ids, names or attributes, and cannot be written through the API. Nothing to restore.

Result: no input, id, name, data-ms attribute or form attribute changed, so no restore was needed.

## Correction to the record

The apply log carries no apply time. The checker's 06:05Z does not match the evidence: the apply writes are after 07:42Z (applied/page-footer-readback.html 09:50Z, site lastUpdated 10:33:15Z, page lastUpdated 10:49:36Z). The 07:42Z publish is not attributable to the apply stage (it logged no publish call) or to this stage.

## Left for Nancy and the Designer

1. Find out who or what published the full site at 2026-10-13T07:42:52Z (a Designer session, another agent, or a scheduled job). Until v3 is approved, hold every full-site publish: the next one takes the staged v3 draft on /share-photos live along with whatever else is pending.
2. Designer, field settings: clear the placeholder on …8687, …8692, …8696, …869a, …86b8 and …86c5 (section 5 step 3).
3. Designer, field settings on …8687: accept to image/jpeg,image/webp, keep multiple.
4. After the publish she approves, re-read both form records: placeholders should read null for these six fields.
