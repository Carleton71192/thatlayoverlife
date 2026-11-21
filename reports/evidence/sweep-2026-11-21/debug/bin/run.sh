#!/bin/bash
cd /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-debug/bin
for set in "$@"; do
  while pgrep -f headless_shell >/dev/null; do sleep 30; done
  echo "== $set $(date -u +%H:%M:%S)"
  NODE_PATH=/opt/node22/lib/node_modules timeout 1500 node d.cjs $set 2>&1 | tail -60
done
echo "== end $(date -u +%H:%M:%S)"
