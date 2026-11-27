export PATH=<scratch>/probes/bin:$PATH
unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy ALL_PROXY all_proxy NO_PROXY no_proxy
export WF_GUARD_STATE=<scratch>/probes/tmp/state WF_GUARD_MAIN_LOG=none WF_GUARD_LOG=<scratch>/probes/tmp/default-log.md
export WF_GUARD_CURL_ARGS='["--noproxy","*","--connect-to","::127.0.0.1:"]'
export NODE_PATH=/opt/node22/lib/node_modules TMPDIR=<scratch>/probes/tmp CURL_WRAP_LOG=<scratch>/probes/runs/curl-calls.log
