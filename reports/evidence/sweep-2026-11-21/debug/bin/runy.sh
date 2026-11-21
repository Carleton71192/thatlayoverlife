#!/bin/bash
cd /tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov21/sweep-debug/bin
while pgrep -f headless_shell >/dev/null; do sleep 30; done
echo "== y $(date -u +%H:%M:%S)"
NODE_PATH=/opt/node22/lib/node_modules timeout 1200 node y.cjs 2>&1
echo "== end $(date -u +%H:%M:%S)"
