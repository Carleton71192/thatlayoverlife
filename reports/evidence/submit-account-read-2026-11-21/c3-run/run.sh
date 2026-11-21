#!/bin/bash
S=/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/leftover-build
export NODE_PATH=/opt/node-tools/node_modules
cd $S/bin
OUT=$S/out/results.jsonl
for sm in leftover:3000 leftover:real leftover-acct:3000 leftover-acct:real acct:3000 signedout:real blank:3000; do s=${sm%%:*}; m=${sm##*:}; for v in new c3; do
  if grep -q "\"variant\":\"$v\",\"scen\":\"$s\",\"ms\":\"$m\"" $OUT 2>/dev/null; then continue; fi
  n=0; while pgrep -f headless_shell >/dev/null; do sleep 5; n=$((n+1)); [ $n -gt 120 ] && break; done
  timeout 400 node h3c.cjs $v $s $m 390x844 $OUT 2>&1 | tail -1
done; done
echo ALLDONE
