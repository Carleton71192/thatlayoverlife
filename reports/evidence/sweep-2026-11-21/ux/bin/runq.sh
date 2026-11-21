#!/bin/bash
cd /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-ux/bin
export NODE_PATH=/opt/node22/lib/node_modules
while pgrep -f headless_shell >/dev/null; do sleep 30; done
for w in 390 1440; do timeout 400 node sub.cjs $w > ../run-sub-$w.log 2>&1; done
for j in stories story auth nf expats map forms acct home; do timeout 900 node jour.cjs $j > ../run-j-$j.log 2>&1; done
echo ALLDONE > ../runq.done
