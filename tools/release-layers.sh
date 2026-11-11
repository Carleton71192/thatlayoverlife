#!/usr/bin/env bash
# Copy the built site layers to the slim layers-release branch and push it, so jsDelivr serves them under its 50 MB
# package limit (the working branch is over 500 MB because of design screenshots). jsDelivr measures the files at the
# pinned commit, so a commit that holds only these files stays far under the limit.
#
# Run from the repository root after python3 src/site-layers/build-site-layers-v16.py, npx vitest run and a commit of
# the build (the release copies committed bytes only, so the pin always matches a commit on the working branch).
#
# What goes in a release commit:
#   src/site-layers/tll-site-layers-v16.js and src/site-layers/chunks/*.js   from HEAD
#   src/data/story-search-index.json                                       from HEAD (the core loads it beside itself)
#   every entry of tools/layers-release-carry.txt                          from the commit named there
# Anything else on the branch is removed, so the release tree is exactly that list.
#
# Settings (environment):
#   LAYERS_RELEASE_BRANCH  branch to commit to (default layers-release). Use a candidate branch for a release that is
#                          not approved yet; approving it is then a fast-forward of layers-release to the same commit.
#   LAYERS_RELEASE_PUSH    1 (default) pushes; 0 commits in a temporary worktree only and prints what would ship.
#   LAYERS_RELEASE_MAX_MB  size guard for the whole release tree (default 20; jsDelivr refuses packages over 50).
#   RELEASE_TRAILER        optional text appended to the release commit message (e.g. attribution lines).
#
# Prints the release commit, the core URL and every script's SRI for the Webflow registrations, then runs
# tools/check-layers-cdn.mjs against the new commit when it was pushed.
set -euo pipefail
ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"
BRANCH=${LAYERS_RELEASE_BRANCH:-layers-release}
PUSH=${LAYERS_RELEASE_PUSH:-1}
MAX_MB=${LAYERS_RELEASE_MAX_MB:-20}
REPO=Carleton71192/thatlayoverlife
CARRY="$ROOT/tools/layers-release-carry.txt"

if ! git diff --quiet HEAD -- src/site-layers src/data/story-search-index.json; then
  echo "The built layers differ from HEAD. Commit the build first, so the release matches a commit." >&2; exit 1; fi
SRC_REV=$(git rev-parse --short HEAD)

git fetch -q origin
WT=$(mktemp -d)/layers-release
if git rev-parse -q --verify "origin/$BRANCH" >/dev/null; then BASE="origin/$BRANCH"; else BASE=origin/layers-release; fi
git worktree add -q --detach "$WT" "$BASE"
trap 'cd "$ROOT"; git worktree remove --force "$WT" 2>/dev/null || true' EXIT
cd "$WT"
git checkout -q -B "$BRANCH" "$BASE"

# Start from an empty tree, then add exactly the release files.
git rm -r -q --cached . >/dev/null 2>&1 || true
find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
put() { mkdir -p "$(dirname "$2")"; git -C "$ROOT" show "$1:$2" > "$2"; }
put HEAD src/site-layers/tll-site-layers-v16.js
for f in $(git -C "$ROOT" ls-tree --name-only HEAD src/site-layers/chunks/ | grep '\.js$'); do put HEAD "$f"; done
put HEAD src/data/story-search-index.json
while read -r path rev; do
  case "$path" in ''|'#'*) continue;; esac
  if [ "${path%/}" != "$path" ]; then
    for f in $(git -C "$ROOT" ls-tree --name-only "$rev" "$path"); do
      if [ "$(git -C "$ROOT" cat-file -t "$rev:$f")" = blob ]; then put "$rev" "$f"; fi; done
  else put "$rev" "$path"; fi
done < "$CARRY"
git add -A

BYTES=$(git ls-files -z | xargs -0 cat | wc -c | tr -d ' ')
FILES=$(git ls-files | wc -l | tr -d ' ')
echo "release tree: $FILES files, $BYTES bytes"
if [ "$BYTES" -gt $((MAX_MB * 1048576)) ]; then echo "Release tree is over $MAX_MB MB. Stopping." >&2; exit 1; fi

if git diff --cached --quiet; then echo "$BRANCH already matches $SRC_REV"; else
  git commit -qm "layers-release: built layers from $SRC_REV, carried files per tools/layers-release-carry.txt${RELEASE_TRAILER:+

$RELEASE_TRAILER}"
  if [ "$PUSH" = 1 ]; then git push -q origin "$BRANCH"; else echo "LAYERS_RELEASE_PUSH=0: not pushed"; fi; fi
PIN=$(git rev-parse HEAD)
sri() { echo "sha384-$(openssl dgst -sha384 -binary "$1" | openssl base64 -A)"; }
echo "PIN=$PIN"
echo "BASE=https://cdn.jsdelivr.net/gh/$REPO@$PIN/"
echo "SRI for each script registered in Webflow (same bytes as before give the same SRI):"
for f in $(git ls-files | grep -E '\.js$' | grep -v '^src/site-layers/chunks/' | grep -v '^map-2.0/'); do printf '  %s  %s\n' "$(sri "$f")" "$f"; done
cd "$ROOT"
if [ "$PUSH" = 1 ]; then node tools/check-layers-cdn.mjs "$PIN"; fi
