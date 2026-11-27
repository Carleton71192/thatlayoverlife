#!/bin/bash
# Safety wrapper: refuse any curl call that is not forced onto 127.0.0.1 with no proxy.
LOG=${CURL_WRAP_LOG:-/tmp/claude-0/-home-user-thatlayoverlife/16a08c1e-77ab-50a3-8cf3-b364d5e24f1b/scratchpad/nov27/guard2/repro/chk/curl-calls.log}
args="$*"
if [[ "$args" == *"--noproxy *"* && "$args" == *"--connect-to ::127.0.0.1:"* ]]; then
  echo "OK $(date +%T) ${@: -1}" >> $LOG
  unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy ALL_PROXY all_proxy
  exec /usr/bin/curl "$@"
fi
echo "REFUSED $(date +%T) $args" >> $LOG
echo "curl wrapper: refused (not forced to 127.0.0.1)" >&2
exit 7
