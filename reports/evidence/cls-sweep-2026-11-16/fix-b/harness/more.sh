#!/bin/bash
# after the final sets: small sets for the notes in fix.md (one browser at a time, same harness)
B=B
cd $B/bin
for s in diag lcp dom2 tt cpufcp; do
  node h2.cjs $B/out/g-$s.jsonl $B/out/j-$s.json > $B/out/g-$s.log 2>&1
  echo $s >> $B/out/more.flag
done
echo done >> $B/out/more.flag
