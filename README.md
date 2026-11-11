# layers-release

Built site-layer files only, so jsDelivr serves them under its 50 MB package limit (the main branch is about 538 MB because of design screenshots). Do not edit here: build on the working branch with `python3 src/site-layers/build-site-layers-v16.py`, then copy `src/site-layers/tll-site-layers-v16.js` and `src/site-layers/chunks/*.js` here with `tools/release-layers.sh`, commit, push, and pin Webflow's `tllsitelayersv16` to this branch's commit. Paths match the main branch, so the core finds its chunks at the same relative path.
