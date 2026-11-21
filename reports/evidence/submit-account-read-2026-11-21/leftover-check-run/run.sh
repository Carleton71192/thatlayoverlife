#!/bin/bash
# Independent leftover check, 21 Nov 2026. One browser at a time. Part A: leftover and local-draft runs, c2 (new) and c3.
# Part B: the main 21-scenario set, c3 only, at 390x844 and 1440x900 (compared with the stored c2 results of check.md).
S=/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/leftover-check
export NODE_PATH=/opt/node-tools/node_modules
cd $S/bin
one(){ v=$1; s=$2; m=$3; vp=$4; OUT=$5
  if grep -q "\"variant\":\"$v\",\"scen\":\"$s\",\"ms\":\"$m\",\"vp\":\"$vp\"" $OUT 2>/dev/null; then return; fi
  n=0; while pgrep -f headless_shell >/dev/null; do sleep 5; n=$((n+1)); done
  timeout 400 node h3d.cjs $v $s $m $vp $OUT 2>&1 | tail -1; }
A="leftover:3000:390x844 leftover:3000:1440x900 leftover-acct:3000:390x844 leftover-acct:3000:1440x900 leftover:real:390x844 upgrade:real:390x844 upgrade-out:real:390x844 upgrade:3000:1440x900 localdraft:3000:390x844 localdraft:real:390x844 localdraft:real:1440x900 localdraft-body:real:390x844 localdraft-acct:3000:390x844 signedout-revisit:real:390x844"
for x in $A; do IFS=: read s m vp <<<"$x"; for v in new c3; do one $v $s $m $vp $S/out/extra.jsonl; done; done
echo PART_A_DONE
LIST="acct:early acct:real acct:500 acct:3000 acct:never typing:500 typing:3000 typing-country:3000 typing-other:3000 sent:real sent:3000 links:real links:3000 cf:3000 links-typed:3000 signedout:real signedout-blank:real blank:3000 send:real send:3000 postfail:3000"
for vp in 390x844 1440x900; do for sm in $LIST; do one c3 ${sm%%:*} ${sm##*:} $vp $S/out/main.jsonl; done; done
echo ALLDONE
