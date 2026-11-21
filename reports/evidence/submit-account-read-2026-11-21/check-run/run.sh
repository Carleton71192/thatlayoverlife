#!/bin/bash
D=/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/acct-check
export NODE_PATH=/opt/node-tools/node_modules
cd $D/bin
OUT=$D/out/results.jsonl
LIST="acct:early acct:real acct:500 acct:3000 acct:never typing:500 typing:3000 typing-country:3000 typing-other:3000 sent:real sent:3000 links:real links:3000 cf:3000 links-typed:3000 signedout:real signedout-blank:real blank:3000 send:real send:3000 postfail:3000"
for vp in 390x844 1440x900; do for sm in $LIST; do s=${sm%%:*}; m=${sm##*:}; for v in live new; do
  if grep -q "\"variant\":\"$v\",\"scen\":\"$s\",\"ms\":\"$m\",\"vp\":\"$vp\"" $OUT 2>/dev/null; then continue; fi
  n=0; while pgrep -f headless_shell >/dev/null; do sleep 5; n=$((n+1)); [ $n -gt 120 ] && pkill -f headless_shell; done
  timeout 400 node h3.cjs $v $s $m $vp $OUT 2>&1 | tail -1
done; done; done
echo ALLDONE
