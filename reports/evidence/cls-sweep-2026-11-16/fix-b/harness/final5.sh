#!/bin/bash
# /account and /submit again with core-b15 (the nav shown by a style, not moved). Results out/t-<set>.jsonl; finished sets in out/final5.flag (resumable).
B=B
cd $B/bin
for s in a3 std cpu dom fail split slow sizes fcp; do
  grep -q "^$s$" $B/out/final5.flag 2>/dev/null && continue
  rm -f $B/out/t-$s.jsonl
  node h2.cjs $B/out/t-$s.jsonl $B/out/n-$s.json > $B/out/t-$s.log 2>&1
  echo $s >> $B/out/final5.flag
done
echo done >> $B/out/final5.flag
