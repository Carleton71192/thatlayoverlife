#!/bin/bash
# runs the sets in order; safe to start again (finished loads are skipped)
cd "$(dirname "$0")"
for s in "$@"; do NODE_PATH=/opt/node22/lib/node_modules node r.cjs $s >> ../results/$s.log 2>&1; echo "$(date -u +%H:%M:%S) set $s exit $?" >> ../chain.log; done
echo "$(date -u +%H:%M:%S) CHAIN DONE $*" >> ../chain.log
