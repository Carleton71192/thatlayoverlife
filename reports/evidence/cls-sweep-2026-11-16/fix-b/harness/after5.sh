#!/bin/bash
# after after4: the work-per-tick set (core-b11dbg: the bdc6d21 core with a timer around the layer's tick), cut off by the 23:51 restart
B=B
until grep -q "^done$" $B/out/after4.flag 2>/dev/null; do sleep 3; done
cd $B/bin
mv -f $B/out/g-tt.jsonl $B/out/g-tt.prev 2>/dev/null
node h2.cjs $B/out/g-tt.jsonl $B/out/j-tt.json > $B/out/g-tt.log 2>&1
echo done >> $B/out/after5.flag
