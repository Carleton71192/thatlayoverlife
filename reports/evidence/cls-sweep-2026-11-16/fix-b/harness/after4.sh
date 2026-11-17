#!/bin/bash
# after final4: two small checks for the notes in fix.md (one browser at a time)
B=B
until grep -q "^done$" $B/out/final4.flag 2>/dev/null; do sleep 3; done
cd $B/bin
for s in ph acct; do
  grep -q "^$s$" $B/out/after4.flag 2>/dev/null && continue
  rm -f $B/out/g-$s.jsonl
  node h2.cjs $B/out/g-$s.jsonl $B/out/j-$s.json > $B/out/g-$s.log 2>&1
  echo $s >> $B/out/after4.flag
done
echo done >> $B/out/after4.flag
