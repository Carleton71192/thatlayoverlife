#!/bin/bash
# Tables, notes and harness into the worktree's report folder, and part B into fix.md.  bin/publish.sh <head commit of the core>
set -e
B=B
R=SCRATCH/nov16/wt/reports/evidence/cls-sweep-2026-11-16
cd $B
python3 bin/merge.py > out/merge.log
python3 bin/export.py out/exp3 m- > /dev/null
python3 bin/extra.py out/exp3 m- > out/extra.log
python3 bin/mkfill.py $1 > out/mkfill.log
python3 bin/fill_manual.py
python3 bin/assemble.py out/exp3 $R/fix.md
mkdir -p $R/fix-b
cp out/exp3/table.md out/exp3/cells.json out/exp3/loads.csv out/exp3/extra.md $R/fix-b/
rm -rf $R/fix-b/harness
python3 bin/pack.py $R/fix-b/harness
S=$(sed 's#/contributors/##' profile-path.txt)
if grep -rl -- "$S" $R/fix-b $R/fix.md; then echo "LEAK: profile slug"; exit 1; fi
grep -rIl "PENDING" $R/fix.md $R/fix-b/*.md && echo "PENDING left" || true
echo published
