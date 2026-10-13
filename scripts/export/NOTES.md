# Webflow MCP shapes seen on 13 Oct 2026

Recorded while writing `scripts/export/wf2html.mjs`. Every shape below was read from
the live site (site id 69d6145cf421c777840c1e25) with read-only calls. Nothing here is
guessed.

## Element tree (`data_element_tool` get_all_elements, depth -1)

Result: `{status, message, data: <node>}`. A node looks like

```
{
  "id": {"component": "<page id or component id>", "element": "<element id>"},
  "type": "Block",
  "styleNames": ["tll-section", "tll-bg-paper"],      // optional
  "attributes": {"data-ms-content": "members"},        // optional, custom attributes incl. class and href
  "settings": {"tag": "section", "visibility": true},  // optional
  "children": [ ... ]                                  // optional
}
```

Observed per type:

- `String`: `{"type":"String","textContent":"..."}`, no id-level settings. An empty String
  node has no `textContent` key at all.
- `Block` / `Section` / `DOM`: `settings.tag` carries the HTML tag. Block also repeats it
  in `settings.block.tag`, DOM in `settings.dom.tag`.
- `Heading`: `settings.tag` ("h1") and `settings.headingLevel` (1).
- `Paragraph`, `Span`, `Emphasized`, `Strong`: `settings.visibility` only.
- `Link`: `settings.link = {"linkType":"url","href":"/the-map"}`. Email links come back as
  `{"linkType":"email","href":"mailto:hello@thatlayover.life?subject=..."}`, so the href
  already carries the `mailto:` prefix. Some links also repeat `href` under
  `attributes.href`; a few have only `attributes.href` and no `settings.link` (for example
  the Sign out link with `data-ms-action="logout"` and the Cookie preferences link).
- `Image`: the tree already includes `settings.assetId` and `settings.altText` when the
  image is static. A CMS-bound image has neither in the tree.
- `FormWrapper` and `FormForm`: both carry
  `settings.form = {"name":"Html Form","formSettings":{"action":"","method":"get","name":"Html Form","redirect":"","state":"normal"}}`.
- `FormTextInput`: `settings.input = {"inputName":"field","inputType":"text"}`
  (`inputType` is text, number or url on this page). Custom attributes such as `id`,
  `data-ms-member`, `min`, `max` sit in `attributes`.
- `FormTextarea`: `settings.input = {"inputName":"field"}`, `rows` in `attributes`.
- `FormCheckboxInput`: `settings.input = {"inputName":"Checkbox"}`.
- `FormButton`: `settings.visibility` only in the tree; the text lives in resolved settings.
- `HtmlEmbed`: `settings.visibility` only in the tree; the code lives in resolved settings.
- `ComponentInstance`:
  `{"type":"ComponentInstance","instanceDetails":{"type":"ComponentInstance","id":"<component id>","name":"TLL Nav v1","props":[],"slots":[]}}`.
  No children in the page tree. Fetch the definition with
  `get_all_elements {depth:-1, scope_component_id}`; the root element id equals the
  component id.
- `DynamoWrapper` > `DynamoList` > `DynamoItem`, plus `DynamoEmpty`: only
  `settings.visibility` in the tree. The bound collection is not visible in the tree.
- `settings.visibility === false` marks a node hidden in the Designer (seen on the footer
  "traveler" stat span and the Countries link).

## Resolved settings (`data_element_settings_tool` get_settings, type all_resolved_settings)

Result data: `{"type":"all_resolved_settings","total_matches":N,"matches":[{"key":"...","value":...}, ...]}`.
`wf2html.mjs` flattens `matches` into a `key -> value` object.

Keys per type:

- `FormTextInput`: `domId` ("field"), `visibility`, `name` ("field"), `required` (false),
  `type` ("text" | "number" | "url"), `attributes` (array of `{name, value}` with the custom
  attributes, for example `[{"name":"data-ms-member","value":"country-count"},{"name":"min","value":"0"}]`).
  No `placeholder` or `maxLength` key came back on this page.
- `FormTextarea`: same keys without `type`.
- `FormCheckboxInput`: `domId` ("checkbox"), `visibility`, `name` ("Checkbox"), `required`, `attributes`.
- `FormButton`: `domId` (""), `visibility`, **`buttonText`** ("Submit"), `loadingText`
  ("Please wait..."), `type` ("submit"), `attributes` ([]).
- `HtmlEmbed`: `domId`, `visibility`, **`code`** (the full embed HTML as one string),
  `attributes`.
- `Image`: `domId`, **`assetId`** ("6a115ea686f678134db92154"), **`altText`**
  ("Doha at night, photographed on a long layover"), `visibility`, `attributes`.
  A CMS-bound image resolves to `assetId: null` and `altText: "inherit"`.
- `Heading` (CMS template): `domId`, `tag` ("h1"), `text` (null when bound), `visibility`, `attributes`.
- `RichText` (CMS template): `domId`, `tag` ("div"), `richText` (null when bound), `visibility`, `attributes`.

## Raw settings (type all_raw_settings)

Same envelope as resolved settings. For static values the raw and resolved maps are
identical (checked on every edit-profile form node and on a Home image). For a CMS binding
the value is an object instead of a scalar:

```
{"key":"assetId","value":{"sourceType":"cms","collectionId":"6a0b29eddc14f1444e935760","collectionName":"Stories","fieldId":"0332657b2c0f1268b574f20644569d13","fieldName":"Hero image","fieldGroup":null,"fieldType":"image"}}
{"key":"text","value":{"sourceType":"cms","collectionId":"6a0b29eddc14f1444e935760","collectionName":"Stories","fieldId":"4f8f9a69191510bd511fd2fe03a504af","fieldName":"Name","fieldGroup":null,"fieldType":"plainText"}}
{"key":"richText","value":{"sourceType":"cms","collectionId":"6a0b29eddc14f1444e935760","collectionName":"Stories","fieldId":"e6053102687631e24bc21aad71a8f4ee","fieldName":"Short version","fieldGroup":null,"fieldType":"richText"}}
```

So a binding is any raw value with `sourceType: "cms"`, `collectionId` and `fieldId`. The
binding key tells the target: `text` for Heading/Paragraph/Span text, `assetId` for an
image, `richText` for a rich text block. The converter maps `fieldId` to a slug through
`cms/<collectionId>.json` (`schema.fields[].id -> slug`) and falls back to a slugified
`fieldName` when the collection file is absent.

Prop bindings inside a component would use `sourceType: "prop"` with a `propId` (from the
set_settings schema); none were present in the nav or footer definitions.

## Page scripts and custom code (`data_scripts_tool`)

- `get_page_freeform_code` returns one result per block:
  `{"location":"head","content":"..."}` and `{"location":"footer","content":"..."}`.
- `get_page_scripts` returns
  `{"scripts":[{"id":"tllgateflashv1","displayName":"tllgateflashv1","version":"1.0.0","location":"header","attributes":{}}],"lastUpdated":"...","createdOn":"..."}`.
  These are stored under `pageScripts` in meta.json. The registered script sources are in
  `state/registered-scripts-first100.json` and `state/registered-scripts-extra.json`; the
  converter emits a script tag for each applied script from its `hostedLocation` (see below).

## Styles map (`state/styles/styles-base.json`)

Array of `{id, name, isFromLibrary, isComboClass, type, selector, properties}`. 5154 entries.
A combo class has a selector like `.checkbox_toggle.on-accent-tertiary`; the converter
takes the last segment. Names with spaces (`"margin-top_small parent"`) map to a hyphenated
selector (`.margin-top_small-parent`). The same name can appear twice (a global `w-input`
and a combo `.tll-newsletter-input._w-input`); the converter prefers the non-combo entry.

## Things the API does not expose

- Select options (`FormSelect`), so the export writes one placeholder option and a comment.
- Placeholder text on inputs (no `placeholder` key came back).
- Select option labels on a form select are not exposed (see above).

## Component definitions (`state/components/`, captured 13 Oct 2026)

One file per component, named by component id, plus `index.json`. Shape:
`{id, name, group, description, instanceCount, capturedAt, source, nodeCount, nodeTypes,
tree, settings, rawSettings, props}`. `tree` is the `{status, message, data}` envelope from
`get_all_elements {depth:-1, scope_component_id}`; `settings` and `rawSettings` are keyed by
element id and hold the `{type, total_matches, matches}` envelope from `get_settings`.
`props` comes from `get_component` with `includeProps`.

Observed shapes:

- A prop binding in raw settings looks like
  `{"key":"text","value":{"sourceType":"prop","propId":"4c3c...","propName":"Signature name","propGroup":"Sign-Off"}}`.
  The resolved value for the same element is the prop default, for example
  `{"key":"text","value":{"innerText":"Nancy Carleton"}}`. Seen on TLL Sign-Off v1 (two
  text props) and TLL Pull Quote v1 (one text prop). The bound element is a plain `Block`
  with no `String` child in the tree.
- A `Link` whose tree node has `attributes.href: "#"` and no `settings.link` resolves to
  `{"key":"link","value":{"mode":"url"}}` with no `to`. These are the unset links in the
  template Navigation and Footer components (0 instances each). The Cookie preferences link
  in TLL Site Footer resolves to `{"mode":"url","to":"#"}`.
- `FormTextInput` with `inputType: "email"` resolves to `type: "email"`, `required: true`.
- Five TLL components (TLL Footer v1, Reader Question v1, Hashtag Set v1, Magnus Moment v1,
  Sponsor Disclosure v1) have a definition that is a single empty `Block` with no style,
  children, settings or props. Their descriptions mention props that do not exist.
- `get_component` with both `includeVariants` and `includeSelectedVariant` returns
  `OPERATION_FAILED: An internal error occurred` for every component. `includeVariants` on its
  own works and returns `variants: [{"id":"base","name":"Base","isSelected":true}]`. The
  variants list is stored under `variants` in each component file.

## Collection lists, attribute bindings and option labels (added 13 Oct 2026)

- The collection binding sits on the `DynamoWrapper`, not the `DynamoList`. Raw settings of
  the wrapper on edit-profile: `source: {"collectionId":"6abcd6371aa0f0654773a59e"}`,
  `queryMode: "dynamic"`, `filters: []`, `filterMatch: "all"`, `sort: []`, `limit: 100`,
  `offset: 0`, `pagination: null`, `curatedItemIds: []`. Resolved settings of the wrapper and
  both raw and resolved settings of the `DynamoList` hold only domId, tag, visibility and
  attributes. These entries are now in edit-profile settings.json and raw-settings.json.
  The converter repeats the `DynamoItem` once per sample item (slice by offset and limit).
  Filters and sort are not applied to the sample; a list that has them gets
  `data-cms-note`.
- Custom attributes can be bound to CMS fields. Raw settings of the tag element inside the
  edit-profile list hold
  `attributes: [{"name":"data-slug","value":{"sourceType":"cms",...,"fieldType":"plainText"}}, ...]`.
  The resolved value of a bound attribute is `null`. The converter fills the attribute from
  the sample item and lists the field slugs in `data-cms-field`.
- `cms/<id>.json` has no field validations. `get_collection_details` returns them, so they
  are saved in `state/cms-schemas/<collection id>.json` (all 29 collections). Option fields
  carry `validations.options: [{id, name}]`; reference fields carry
  `validations.collectionId`. The converter prints the option name and the referenced item
  name. A value it cannot resolve keeps the Designer text and gets
  `data-cms-unresolved="<reason>"` (for example `option-label-unknown`,
  `reference-not-captured`, `switch-not-text`, `empty-in-sample`, `field-not-in-schema`).

## Registered scripts in the export (added 13 Oct 2026)

- `registered-scripts-first100.json` holds 100 of 150 registered scripts. Two applied site
  scripts were outside that page (`tll_memberstack_skin_v1`, `tll_world_map_v1`). Their
  records came from `get_registered_script` and are saved in
  `state/registered-scripts-extra.json`. The converter reads every
  `registered-scripts*.json` file and matches applied scripts by id and version.
- Each page now loads the applied site scripts (`site-scripts.json`) and page scripts
  (`meta.pageScripts`) from their `hostedLocation`, in the header or footer as applied,
  plus the standard Webflow jQuery file. A script with no captured source becomes an HTML
  comment and is listed in `out.meta.json` under `scripts.unresolved`.
- `webflow.js` (the Webflow runtime for nav, dropdowns, tabs, sliders and the form
  handler) is a site-specific file. Its URL is not exposed by the API and was not captured,
  so the export leaves a comment where it belongs. The `<html>` tag carries
  `data-wf-page` and `data-wf-site` as on the live site.

## Converter behavior worth knowing

- Text bound to a component prop is resolved in this order: the instance override, the
  resolved `text.innerText` of the definition, then the prop `defaultValue`. The element gets
  `data-wf-prop="<prop name>"`. When converting a component definition as a page, pass its
  props in `meta.componentProps`.
- Page links use `publishedPath` from pages.json (a collection template page links to
  `/stories`, not `/detail_stories`). An unknown page id gives `href="#"` with
  `data-wf-missing="page"`. Phone links get `tel:`, email links get `mailto:` when missing.
  `pageSection` links resolve an element id to its DOM id. `collectionPage` links use the
  collection slug.
- A link with no target in the tree falls back to the resolved `link` in settings.json,
  then to `attributes.href`. A link with no target at all gets `data-wf-missing`.
  Links that open in a new tab get `rel="noopener"`.
- Grid, Row and Column get `w-layout-grid`, `w-row` and `w-col`.
- A style name missing from the styles map becomes a class the way Webflow builds one:
  lowercase, with every run of characters outside a-z, 0-9, underscore and hyphen turned
  into one hyphen. Tag styles (selector `p` or `.rich-text h1`) are never used as classes.
- Attribute names with spaces, quotes or other characters HTML does not allow are dropped
  and listed under `droppedAttributes` in `out.meta.json`.
- An error envelope saved in settings.json counts as missing settings, so the
  `data-wf-missing` marker still appears.
- The export keeps invalid nesting from the Designer as it is (a label inside a label,
  repeated ids such as `field` and `checkbox` on edit-profile) and lists it under
  `warnings` and `duplicateIds` in `out.meta.json`.
- Slots passed to a component instance are not rendered yet (no slot data was seen on the
  site). The converter leaves a comment and a warning when an instance has slots.
