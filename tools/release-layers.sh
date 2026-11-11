#!/usr/bin/env bash
# Copy the built site layers to the slim layers-release branch and push it, so jsDelivr serves them under its 50 MB
# package limit (the working branch is over 500 MB because of design screenshots). Run after
# python3 src/site-layers/build-site-layers-v16.py and npx vitest run, from the repository root.
# Optional: RELEASE_TRAILER (text appended to the commit message, e.g. attribution lines).
# Prints the release commit and the core's SRI for Webflow's tllsitelayersv16 registration.
set -euo pipefail
ROOT=$(git rev-parse --show-toplevel)
WT=${LAYERS_RELEASE_WT:-$(mktemp -d)/layers-release}
SRC_REV=$(git -C "$ROOT" rev-parse --short HEAD)
git -C "$ROOT" fetch -q origin layers-release
git -C "$ROOT" worktree add -q --force "$WT" origin/layers-release 2>/dev/null || true
cd "$WT"
git checkout -q -B layers-release origin/layers-release
mkdir -p src/site-layers/chunks src/data
cp "$ROOT/src/site-layers/tll-site-layers-v16.js" src/site-layers/
rm -f src/site-layers/chunks/*.js
cp "$ROOT"/src/site-layers/chunks/*.js src/site-layers/chunks/
git -C "$ROOT" show HEAD:src/data/story-search-index.json > src/data/story-search-index.json
git add -A
if git diff --cached --quiet; then echo "layers-release already matches $SRC_REV"; else
  git commit -qm "layers-release: built layers from $SRC_REV${RELEASE_TRAILER:+

$RELEASE_TRAILER}"; git push -q origin layers-release; fi
PIN=$(git rev-parse HEAD)
echo "PIN=$PIN"
echo "URL=https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@$PIN/src/site-layers/tll-site-layers-v16.js"
echo "SRI=sha384-$(openssl dgst -sha384 -binary src/site-layers/tll-site-layers-v16.js | openssl base64 -A)"
cd "$ROOT"; git worktree remove --force "$WT"
