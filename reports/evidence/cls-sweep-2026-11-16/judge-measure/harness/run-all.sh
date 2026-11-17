#!/bin/bash
# Runs the two measurement sets one after the other. Safe to start again after a restart: finished loads are skipped.
cd "$(dirname "$0")"
export NODE_PATH=/opt/node22/lib/node_modules
node jm.cjs std >> ../results/std.log 2>&1
node jm.cjs cpu >> ../results/cpu.log 2>&1
echo "ALL DONE $(date -u +%FT%TZ)" >> ../results/run-all.flag
