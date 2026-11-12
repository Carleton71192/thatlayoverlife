#!/usr/bin/env bash
# Copy the built site layers to the slim layers-release branch and push it, so jsDelivr serves them under its 50 MB
# package limit (the working branch is over 500 MB because of design screenshots). jsDelivr measures the files at the
# pinned commit, so a commit that holds only these files stays far under the limit.
#
# Run from the repository root after python3 src/site-layers/build-site-layers-v16.py, npx vitest run and a commit of
# the build. The release copies committed bytes only, so the pin always matches a commit on the working branch.
#
# What goes in a release commit (anything else is removed, so the release tree is exactly this list):
#   src/site-layers/tll-site-layers-v16.js and src/site-layers/chunks/*.js   from HEAD
#   src/data/story-search-index.json                                       from HEAD (the core loads it beside itself)
#   every entry of tools/layers-release-carry.txt (as committed at HEAD)   from the commit named there
#
# Settings (environment):
#   LAYERS_RELEASE_BRANCH  branch to push to (default layers-release). Any other name is a candidate: it is rebuilt on top
#                          of layers-release each run and force-pushed, so approving it is a fast-forward of layers-release
#                          to the same commit (git push origin <pin>:refs/heads/layers-release).
#   LAYERS_RELEASE_PUSH    1 (default) pushes; 0 builds and checks the release commit locally, pushes nothing and
#                          changes no branch (the commit is left unreferenced).
#   LAYERS_RELEASE_MAX_MB  size guard for the whole release tree (default 20; jsDelivr refuses packages over 50).
#   RELEASE_TRAILER        optional text appended to the release commit message (e.g. attribution lines).
#
# Checks before anything is pushed: committed build, valid carry list, size guard, and the core's embedded chunk hashes
# against the chunk files in the release (tools/check-layers-cdn.mjs --local). After a push the same script fetches every
# file from jsDelivr. Prints the release commit and the SRI of every script for the Webflow registrations.
set -euo pipefail
ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"
BRANCH=${LAYERS_RELEASE_BRANCH:-layers-release}
PUSH=${LAYERS_RELEASE_PUSH:-1}
MAX_MB=${LAYERS_RELEASE_MAX_MB:-20}
REPO=Carleton71192/thatlayoverlife
CARRY=tools/layers-release-carry.txt
die() { echo "release-layers: $*" >&2; exit 1; }

# Only committed bytes are released: no changed or untracked file in the build output or the carry list.
if [ -n "$(git status --porcelain --untracked-files=all -- src/site-layers src/data/story-search-index.json "$CARRY")" ]; then
  git status --short --untracked-files=all -- src/site-layers src/data/story-search-index.json "$CARRY" >&2
  die "the files above differ from HEAD. Commit the build (and the carry list) first, so the release matches a commit."; fi
SRC_REV=$(git rev-parse HEAD)
if [ -z "$(git branch -r --contains "$SRC_REV" 2>/dev/null)" ]; then
  echo "release-layers: note, $SRC_REV is not on GitHub yet; push the working branch so the release can be traced." >&2; fi

git fetch -q origin
BASE=origin/layers-release
TMP=$(mktemp -d)
WT="$TMP/release"
trap 'cd "$ROOT"; git worktree remove --force "$WT" 2>/dev/null || true; rm -rf "$TMP"' EXIT
git worktree add -q --detach "$WT" "$BASE"
cd "$WT"

# Start from an empty tree, then add exactly the release files.
git rm -r -q --cached . >/dev/null 2>&1 || true
find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
put() { mkdir -p "$(dirname "$2")"; git -C "$ROOT" show "$1:$2" > "$2"; }
put "$SRC_REV" src/site-layers/tll-site-layers-v16.js
CHUNKS=$(git -C "$ROOT" ls-tree --name-only "$SRC_REV" src/site-layers/chunks/ | grep '\.js$' || true)
[ -n "$CHUNKS" ] || die "no chunks at $SRC_REV"
for f in $CHUNKS; do put "$SRC_REV" "$f"; done
put "$SRC_REV" src/data/story-search-index.json

while read -r path rev rest || [ -n "${path:-}" ]; do
  case "${path:-}" in ''|'#'*) continue;; esac
  [ -n "${rev:-}" ] || die "carry list: $path has no commit"
  [ -z "${rest:-}" ] || die "carry list: extra text after $path $rev"
  git -C "$ROOT" cat-file -e "$rev^{commit}" 2>/dev/null || die "carry list: $rev (for $path) is not a commit here; git fetch first?"
  if [ "${path%/}" != "$path" ]; then
    files=$(git -C "$ROOT" ls-tree --name-only "$rev" "$path")
    [ -n "$files" ] || die "carry list: folder $path is empty or missing at $rev"
    n=0
    for f in $files; do
      if [ "$(git -C "$ROOT" cat-file -t "$rev:$f")" = blob ]; then put "$rev" "$f"; n=$((n + 1)); fi; done
    [ "$n" -gt 0 ] || die "carry list: folder $path has no files at $rev"
  else put "$rev" "$path"; fi
done < <(git -C "$ROOT" show "$SRC_REV:$CARRY")
git add -A

BYTES=$(git ls-files -z | xargs -0 cat | wc -c | tr -d ' ')
FILES=$(git ls-files | wc -l | tr -d ' ')
echo "release tree: $FILES files, $BYTES bytes"
[ "$BYTES" -le $((MAX_MB * 1048576)) ] || die "release tree is over $MAX_MB MB"
node "$ROOT/tools/check-layers-cdn.mjs" --local "$WT" || die "local check failed; nothing was pushed"

if git diff --cached --quiet; then echo "layers-release already matches $SRC_REV"; else
  git commit -qm "layers-release: built layers from $SRC_REV, carried files per $CARRY${RELEASE_TRAILER:+

$RELEASE_TRAILER}"; fi
PIN=$(git rev-parse HEAD)
if [ "$PUSH" = 1 ]; then
  if [ "$BRANCH" = layers-release ]; then git push -q origin "HEAD:refs/heads/layers-release"
  else git push -q --force-with-lease="refs/heads/$BRANCH" origin "HEAD:refs/heads/$BRANCH"; fi
  echo "pushed $PIN to $BRANCH"
else echo "LAYERS_RELEASE_PUSH=0: nothing pushed, no branch changed ($PIN stays local and unreferenced)"; fi

sri() { echo "sha384-$(openssl dgst -sha384 -binary "$1" | openssl base64 -A)"; }
echo "PIN=$PIN"
echo "BASE=https://cdn.jsdelivr.net/gh/$REPO@$PIN/"
echo "SRI of each script (same bytes as before give the same SRI):"
for f in $(git ls-files | grep -E '\.js$' | grep -v -E '^(src/site-layers/chunks/|map-2.0/)'); do
  case "$f" in dist/tll-share-v1.min.js) note='  (page code, no SRI on www; only the pin in its src changes)';; *) note='';; esac
  printf '  %s  %s%s\n' "$(sri "$f")" "$f" "$note"; done
cd "$ROOT"
if [ "$PUSH" = 1 ]; then node tools/check-layers-cdn.mjs "$PIN"; fi
