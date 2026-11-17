#!/bin/bash
B=B
cd $B/bin
: > $B/out/final.flag
for s in std cpu slow other dom split fail sizes fcp; do
  mv -f $B/out/f-$s.jsonl $B/out/f-$s.prev 2>/dev/null
  node h2.cjs $B/out/f-$s.jsonl $B/out/j-$s.json > $B/out/f-$s.log 2>&1
  echo $s >> $B/out/final.flag
done
echo done >> $B/out/final.flag
