#!/bin/bash
# /stories again with core-b14 (first card marked at once). Order: std, cpu, fail, split first (what the keep/drop decision needs), then the rest.
B=B
cd $B/bin
for s in std cpu fail split slow dom sizes fcp; do
  grep -q "^$s$" $B/out/final4.flag 2>/dev/null && continue
  node h2.cjs $B/out/s-$s.jsonl $B/out/k-$s.json > $B/out/s-$s.log 2>&1
  echo $s >> $B/out/final4.flag
done
echo done >> $B/out/final4.flag
