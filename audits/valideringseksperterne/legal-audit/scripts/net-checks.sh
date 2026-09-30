#!/usr/bin/env bash
# Network, TLS, header, redirect and DNS evidence for the EU legal audit.
# Usage: bash net-checks.sh <evidenceDir>
set -u
OUT="${1:?evidence dir}"; mkdir -p "$OUT"
UA='Mozilla/5.0 (legal-audit)'
log() { echo "== $*"; }

{
log "Status and redirect chains"
for u in https://valideringseksperterne.dk/ http://valideringseksperterne.dk/ https://www.valideringseksperterne.dk/ \
         https://valideringseksperterne.com/ https://www.valideringseksperterne.com/ http://valideringseksperterne.com/ \
         https://valideringseksperterne.dk/robots.txt https://valideringseksperterne.dk/sitemap.xml \
         https://valideringseksperterne.dk/og-image.jpg https://valideringseksperterne.dk/favicon.ico \
         https://valideringseksperterne.dk/this-page-does-not-exist-404-check; do
  printf '%-64s ' "$u"
  curl -s -o /dev/null -m 20 -A "$UA" -w 'final=%{http_code} hops=%{num_redirects} url=%{url_effective}\n' -L "$u" 2>&1 || echo "curl error"
done

log "Response headers (security)"
curl -sI -m 20 -A "$UA" https://valideringseksperterne.dk/ | grep -iE '^(HTTP|strict-transport|content-security|x-content-type|referrer-policy|permissions-policy|x-frame|content-type|server|last-modified|cache-control)' || echo "no headers"

log "TLS certificate .dk"
echo | openssl s_client -servername valideringseksperterne.dk -connect valideringseksperterne.dk:443 2>/dev/null | openssl x509 -noout -subject -issuer -dates -ext subjectAltName 2>/dev/null || echo "openssl failed (blocked?)"
log "TLS certificate .com (expected: simply.com cert, the bug)"
echo | openssl s_client -servername valideringseksperterne.com -connect valideringseksperterne.com:443 2>/dev/null | openssl x509 -noout -subject -issuer -dates -ext subjectAltName 2>/dev/null || echo "openssl failed (blocked?)"
log "TLS certificate www.com"
echo | openssl s_client -servername www.valideringseksperterne.com -connect www.valideringseksperterne.com:443 2>/dev/null | openssl x509 -noout -subject -issuer -dates 2>/dev/null || echo "openssl failed (blocked?)"

log "AI and search crawlers (expect 200; GPTBot 429 is the open Simply ticket)"
for ua in Googlebot bingbot GPTBot OAI-SearchBot ChatGPT-User ClaudeBot Claude-SearchBot PerplexityBot Google-Extended; do
  printf '%-18s %s\n' "$ua" "$(curl -s -o /dev/null -m 20 -w '%{http_code}' -A "$ua" https://valideringseksperterne.dk/)"
done

log "DNS: A, MX, SPF, DMARC, DKIM guesses (email domain for the site contact is damgaardgroup.com)"
for d in valideringseksperterne.dk valideringseksperterne.com damgaardgroup.com; do
  echo "-- $d"; dig +short "$d" A; dig +short "$d" MX; dig +short "$d" TXT | grep -i spf; dig +short "_dmarc.$d" TXT
  for s in selector1 selector2 google default k1 simply; do r=$(dig +short "$s._domainkey.$d" TXT | head -1); [ -n "$r" ] && echo "DKIM $s: $r"; done
done

log "Third-party endpoints"
for u in https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800\&display=swap https://api.web3forms.com/submit; do
  printf '%-90s %s\n' "$u" "$(curl -s -o /dev/null -m 20 -X GET -w '%{http_code}' -A "$UA" "$u")"
done

log "Mixed content and external hosts in the live HTML"
curl -s -m 20 -A "$UA" https://valideringseksperterne.dk/ -o "$OUT/live-index.html"
grep -oE 'https?://[a-z0-9.-]+' "$OUT/live-index.html" | sort | uniq -c | sort -rn
grep -c 'http://' "$OUT/live-index.html" || true
} 2>&1 | tee "$OUT/net-checks.txt"
