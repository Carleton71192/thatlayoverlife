#!/bin/bash
# after after5: first paint at CPU 4x, 6 loads a cell and core, for the three cells whose 3-load medians were later with the new core
B=B
until grep -q "^done$" $B/out/after5.flag 2>/dev/null; do sleep 3; done
cd $B/bin
rm -f $B/out/g-cpufcp2.jsonl
node h2.cjs $B/out/g-cpufcp2.jsonl $B/out/j-cpufcp2.json > $B/out/g-cpufcp2.log 2>&1
echo done >> $B/out/after6.flag
