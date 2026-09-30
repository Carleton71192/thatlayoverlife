# C group build notes (30 Sep 2026)

Collections created (site 69d6145cf421c777840c1e25):
- Resources 6abcd637bff19cda8e2426c5 (status Live id 90944567f8b4221e176b69160b0a844a)
- Expat Groups 6abcd6371aa0f0654773a56e (status In review id 7c0e78895ebe523884637a27d366d1eb)
- Interest Tags 6abcd6371aa0f0654773a59e
- Directory 6abcd638b10dc7b4930f6410 (contact-mode Platforms id d630433321cba2d6fce1d9759a96e163)
- Press Trips 6abcd638b10dc7b4930f6440
Countries: Denmark 6a8afc5dbbe4ec84f69815fe, Brazil 6ab4c642bf853b11d9521a51, Vietnam 6ab64ec594788ceb9c973315
Founder Directory item 6abcd6c0e03ef5f1ffae94bb, Memberstack mem_cmqcj6qqo35ab0sn20bafhzh3
All items isDraft=false; they go live with the next site publish.

## Directory pages (30 Sep 2026, all DRAFT)
- /expats 6abd0c6e7cf398d2a5c5d71d: body 6abd0c6e7cf398d2a5c5d723, nav 92394351-…2748, shell main a3c9f46e-…2185, tools a3c9f46e-…2174, src a3c9f46e-…2178, wrapper 9bfce667-…a61c (source Directory, filter is-expat isOn), item …a61e, data node 2170dfac-…1b5b (attrs bound), image 374b3947-…898d (assetId bound), search input f511abad-…744d, footer cb0cf8d5-…e0e6. Head tll-dir-v1 CSS, footer tll-dir-js-v1.
- /creators 6abd0c6f30f767558eb3782b: body …37831, nav 7e0c7602-…6470, shell ec474d05-…49bf, tools …49ae, src …49b2, wrapper 51e50175-…a035 (filter is-creator isOn), item …a037, data node 028ea5e8-…492f, image 3ea46f9e-…8746, search bc1458f3-…1efe, footer 85d029f6-…8063.
- /press 6abd0c6f7cf398d2a5c5d76d: body …d773, nav a1d2ad35-…5c4d, shell 89ee32dd-…8cee, tools …8cd3, src …8cd7, wrapper 534b86d4-…d625 (filter is-press isOn), item …d627, data node 43dd65d9-…f44a, image ae77a543-…faa6, search 3911f881-…798e, footer c4d37b5c-…a9e3.
- /press-trips 6abd0c6f580bbf3da54a1091: body …1097 (not built yet).
Pattern: whtml shell with data-tll-dir-src slot; CMSCollection element moved into the slot; DOM div data node with CMS attribute bindings (image fields cannot bind to attributes, so an Image child carries the photo); page code renders shuffled cards. Switch fields cannot bind to attributes: flags text field carries expat/creator/press/verified/relay tokens.
- Countries template 6a8afbda8e907b41c4da10a1: main 8d48cd25-…63f3; expat block section 46d3c292-…017b (data-tll-cx-name bound to Countries name 3642b94a…), src slot …017a; Directory wrapper ddb8c9a6-…75d7 (item …75d9, node 54249a00-…7da5, img 07033471-…aa06); Resources wrapper 9eb86884-…557b (item …557d, node fa249eac-…ebfb; Resources country-name field 33ad61be…). Head style tll-cx-expats-v1, footer script tll-cx-expats-js-v1 appended after existing code.
- Stories: external-url field ddee2f7b…; platform/gated blocked by 60-field cap.
