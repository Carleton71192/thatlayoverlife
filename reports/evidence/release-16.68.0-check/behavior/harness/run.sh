#!/bin/bash
# form runs, one at a time; resumable (rows already in results.jsonl are skipped)
P=/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov18/check1668-behavior
export NODE_PATH=/opt/node-tools/node_modules
cd $P/bin
OUT=$P/out/results.jsonl
while read p v s vp; do
  [ -z "$p" ] && continue
  if grep -q "\"page\":\"$p\",\"variant\":\"$v\",\"host\":\"$v\",\"scen\":\"$s\",\"vp\":\"$vp\"" $OUT 2>/dev/null; then echo "skip $p $v $s $vp"; continue; fi
  avail=$(df -k --output=avail /tmp | tail -1); [ $avail -lt 2097152 ] && { echo "STOP disk"; exit 4; }
  n=0; while pgrep -f 'headless_shell|chrome-linux|chromium' >/dev/null; do [ $n = 0 ] && echo "browser busy, waiting"; sleep 10; n=$((n+1)); [ $n -gt 360 ] && exit 3; done
  echo "$(date -u +%H:%M:%S) start $p $v $s $vp"
  timeout 420 node h3.cjs $p $v $s $vp $OUT 2>&1 | tail -2
done < ${1:-runs.txt}
echo "$(date -u +%H:%M:%S) ALLDONE ${1:-runs.txt}"
