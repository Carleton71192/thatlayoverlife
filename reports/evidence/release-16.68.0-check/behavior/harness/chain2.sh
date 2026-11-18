#!/bin/bash
# page loads after the form runs (one browser at a time); resumable
P=/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov18/check1668-behavior
cd $P/bin
while pgrep -f 'run.sh runs.txt' >/dev/null; do sleep 15; done
NODE_PATH=/opt/node-tools/node_modules node pl.cjs P >> ../results/P.log 2>&1
echo "$(date -u +%H:%M:%S) CHAIN2 DONE exit $?" >> ../results/P.log
