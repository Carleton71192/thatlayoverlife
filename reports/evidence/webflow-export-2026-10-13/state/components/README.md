# Component definitions, Webflow export of 13 October 2026

Site 69d6145cf421c777840c1e25 (That Layover Life). Every file here was read from the live
Designer with read-only MCP calls. Nothing was changed or published.

## Files

| File | Component | Group | Instances | Nodes | Notes |
| --- | --- | --- | --- | --- | --- |
| `69d61481769462c4e6caa136.json` | Navigation | none | 0 | 194 | Template mega-menu nav. All 16 links point to `#`. |
| `69d61481769462c4e6caa137.json` | Footer | none | 0 | 62 | Template footer with a Subscribe form. All 5 links point to `#`. |
| `8484ce87-193e-8ab5-fff8-590bb198f8a8.json` | TLL Nav v1 | TLL Globals | 63 | 33 | Live site nav. Memberstack attributes on the anonymous and member blocks. |
| `8e19d1be-00d9-83c5-6d77-245b384524e0.json` | TLL Footer v1 | TLL Globals | 3 | 1 | Empty definition: one Block, no children. |
| `5f26fa7c-8546-3f4c-c41b-a71a7922c657.json` | TLL Sign-Off v1 | TLL Editorial | 1 | 6 | Two text props bound to the name and location blocks. |
| `61fd1e77-9157-2ddc-7139-28cd4ec5ad33.json` | TLL Pull Quote v1 | TLL Editorial | 0 | 2 | One text prop bound to the quote block. |
| `439d1541-de23-80c6-4fcf-75c6a43fdf0a.json` | TLL Reader Question v1 | TLL Editorial | 1 | 1 | Empty definition. |
| `1080a25e-7a36-1129-6d69-e0316321a68a.json` | TLL Hashtag Set v1 | TLL Editorial | 1 | 1 | Empty definition. |
| `db11b276-3c28-5e59-6f49-4c79d6092d9e.json` | TLL Magnus Moment v1 | TLL Editorial | 0 | 1 | Empty definition. |
| `b25b24db-a356-968b-ed9c-0a0e2c6dd79a.json` | TLL Sponsor Disclosure v1 | TLL Editorial | 0 | 1 | Empty definition. |
| `710ff458-c06e-d602-a663-e5e88ca1456b.json` | TLL Site Footer | none | 63 | 117 | Live site footer. One HTML embed (tll-live-counts-v2.1). |
| `index.json` | all eleven | | | | `{id, name, group, description, instanceCount, nodeCount, embeds, images}` per component. |

Each component file holds `{id, name, group, description, instanceCount, capturedAt, source,
nodeCount, nodeTypes, tree, settings, rawSettings, props, variants}`. `tree` is the full element
tree at depth -1. `settings` (resolved) and `rawSettings` are keyed by element id and were
fetched for every embed, image, form field, form button and every link whose tree node had no
href, plus the prop-bound text blocks. `props` and `variants` come from `get_component`.
Every component has only the Base variant.

Shapes are documented in `scripts/export/NOTES.md`. The assembler is
`scripts/export/components-build.py`.

## Tasks still to be completed

These are open items this capture surfaced. None of them block the export; they are listed so
the handoff is honest about what the definitions do and do not contain.

1. Decide what to do with the five empty TLL components (TLL Footer v1, Reader Question v1,
   Hashtag Set v1, Magnus Moment v1, Sponsor Disclosure v1). Each is a single empty Block with
   no styles, children or props, so their instances render nothing. TLL Footer v1 has 3
   instances, Reader Question v1 and Hashtag Set v1 have 1 each. Options: rebuild them from the
   descriptions, or remove the instances and the components.
2. Decide whether to delete the two template components, Navigation and Footer. Both have 0
   instances and every link in them points to `#`. They add 256 nodes to the export for no
   live use.
3. Capture instance-level prop values. The definition files hold prop defaults only (for
   example Sign-Off defaults to "Nancy Carleton" and "Reported from Sofia, Bulgaria."). The
   value set on each placed instance lives in the page tree under
   `instanceDetails.props`, which the page capture covers.
4. Footer stats are static in the definition (6 stories, 87 countries, 1 traveler hidden,
   1 pet). The embed script rewrites them in the browser from the sitemap and /stories. Any
   static render of the footer will show the stored numbers unless the converter runs that
   script or substitutes live counts.
5. Variants were read with `includeVariants` only. Calling `get_component` with
   `includeSelectedVariant` as well returns an internal error from the MCP server; if a
   future component gains variants, the selected one will need a separate check.
