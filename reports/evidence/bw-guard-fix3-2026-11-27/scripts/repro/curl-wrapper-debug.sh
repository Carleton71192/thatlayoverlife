#!/bin/bash
# debug variant of the safety wrapper: same refusal rule, and it logs the full arguments, exit code and time taken
LOG=${CURL_WRAP_LOG:-/dev/null}
args="$*"
if [[ "$args" == *"--noproxy *"* && "$args" == *"--connect-to ::127.0.0.1:"* ]]; then
  unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy ALL_PROXY all_proxy
  t0=$(date +%s%N); /usr/bin/curl "$@"; x=$?; t1=$(date +%s%N)
  echo "OK exit=$x ms=$(( (t1-t0)/1000000 )) $args" >> "$LOG"; exit $x
fi
echo "REFUSED $(date +%T) $args" >> "$LOG"; echo "curl wrapper: refused (not forced to 127.0.0.1)" >&2; exit 7
