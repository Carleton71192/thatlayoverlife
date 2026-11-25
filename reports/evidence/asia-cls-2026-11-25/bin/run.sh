#!/bin/bash
# resumable; one Chromium at a time (place, then eq)
cd /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov25/asia-cls-check/bin
R=../results
for set in place eq; do
  for i in 1 2 3; do NODE_PATH=/opt/node22/lib/node_modules node pw.cjs $set >> $R/$set.log 2>&1 && break; sleep 5; done
  echo "$set-DONE $(date -u +%H:%M)" >> $R/run.log
done
