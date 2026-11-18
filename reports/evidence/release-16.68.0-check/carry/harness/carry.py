"""Carry check: prove test vs www HTML differ only in the expected places.
Usage: python3 -I carry.py HTMLDIR CBEFORE CAFTER OUTJSON"""
import sys, re, json, hashlib
from html.parser import HTMLParser
HD, CB, CA, OUT = sys.argv[1:5]
PAGES = ["home","stories","about","paw-passport","travelers","layovers","the-map","for-expats","cookies","balkans","lisbon","account","submit","my-pets","share-photos","login","signup"]
REPO = "https://cdn.jsdelivr.net/gh/Carleton71192/thatlayoverlife@"
def tag(pin, path, sri):
    return '<script src="%s%s/%s" type="text/javascript" integrity="%s" crossorigin="anonymous">' % (REPO, pin, path, sri)
CORE_P = "src/site-layers/tll-site-layers-v16.js"
PC_P = "src/components/photo-clean/tll-photo-clean-v1.js"
CORE_OLD = tag("a254306f6c62a79f314754d24b44041d61be716d", CORE_P, "sha384-2Bc75us2J2jpgsYU/Hger8bd7CrNh9cZyfStM3otS/aENprUVw1HFUruv8eGw3cU")
CORE_NEW = tag("0f04fabf403d5c61d1e1f4ff8d850c493a9de62f", CORE_P, "sha384-a9tcQUfkTLuUzZ1IXfw7dVcXSKJnilK7aqF6p5HiS5d80ghZvRrQ6Akt8Ewg/2st")
PC_OLD = tag("22019832ad62816bc7c9f20805d2549615cfc508", PC_P, "sha384-AAifp68s8YonZMUePqdmkqh1tCcdKPmYFwY640tgYRXuXGeynwK9F5ARXarResAO")
PC_NEW = tag("f67f3f74d9a5b4c20ec282ac4935ebe2831be667", PC_P, "sha384-b9+lDanshflZ9KVhLlM/GTjhrqKXDFpVs+iXXE5NYL7BLq1hiKvHH6v7kWFDo/rP")
C_BEFORE = open(CB, encoding="utf-8").read()
C_AFTER = open(CA, encoding="utf-8").read()
LP = re.compile(r"<!-- Last Published: [^>]*-->")
DOM_T = 'data-wf-domain="that-layover-life.webflow.io"'
DOM_W = 'data-wf-domain="www.thatlayover.life"'

class Grab(HTMLParser):
    """Collect outer HTML of nav/footer/form elements and all data-ms-* attributes."""
    def __init__(self, src):
        super().__init__(convert_charrefs=False)
        self.src = src; self.lines = [0]
        for m in re.finditer("\n", src): self.lines.append(m.end())
        self.stack = []; self.blocks = {"nav": [], "footer": [], "form": []}
        self.ms = []; self.forms = []; self.curform = None
    def pos(self):
        l, c = self.getpos(); return self.lines[l-1] + c
    def handle_starttag(self, t, a):
        d = dict(a)
        for k, v in a:
            if k.startswith("data-ms-"): self.ms.append([t, k, v])
        if t in self.blocks: self.stack.append((t, self.pos()))
        if t == "form": self.curform = {"name": d.get("name"), "id": d.get("id"), "data-name": d.get("data-name"), "method": d.get("method"), "action": d.get("action"), "fields": []}
        if t in ("input", "select", "textarea", "button") and self.curform is not None:
            self.curform["fields"].append([t, d.get("type"), d.get("name"), d.get("id"), d.get("data-name")])
    def handle_endtag(self, t):
        if t in self.blocks:
            for i in range(len(self.stack)-1, -1, -1):
                if self.stack[i][0] == t:
                    _, s = self.stack.pop(i)
                    e = self.src.index(">", self.pos()) + 1
                    self.blocks[t].append(self.src[s:e]); break
        if t == "form" and self.curform is not None:
            self.forms.append(self.curform); self.curform = None

def sha(s): return hashlib.sha256(s.encode("utf-8")).hexdigest()
res = {"pages": {}, "all_ok": True}
for pg in PAGES:
    w = open("%s/www/%s.html" % (HD, pg), encoding="utf-8").read()
    t = open("%s/test/%s.html" % (HD, pg), encoding="utf-8").read()
    r = {"bytes_www": len(w.encode()), "bytes_test": len(t.encode()),
         "sha256_www": sha(w), "sha256_test": sha(t)}
    r["counts"] = {
        "core_old_in_www": w.count(CORE_OLD), "core_new_in_test": t.count(CORE_NEW),
        "core_new_in_www": w.count(CORE_NEW), "core_old_in_test": t.count(CORE_OLD),
        "pc_old_in_www": w.count(PC_OLD), "pc_new_in_test": t.count(PC_NEW),
        "pc_new_in_www": w.count(PC_NEW), "pc_old_in_test": t.count(PC_OLD),
        "c_before_in_www": w.count(C_BEFORE), "c_after_in_test": t.count(C_AFTER),
        "c_after_in_www": w.count(C_AFTER), "c_before_in_test": t.count(C_BEFORE),
        "lastpub_www": len(LP.findall(w)), "lastpub_test": len(LP.findall(t)),
        "dom_www": w.count(DOM_W), "dom_test": t.count(DOM_T),
        "webflow_io_in_test": t.count("that-layover-life.webflow.io"),
        "webflow_io_in_www": w.count("that-layover-life.webflow.io"),
    }
    r["lastpub_www"] = [x[5:-4] for x in LP.findall(w)]; r["lastpub_test"] = [x[5:-4] for x in LP.findall(t)]
    pc_page = pg in ("submit", "my-pets"); c_page = pg == "submit"
    c = r["counts"]
    exp = {"core_old_in_www": 1, "core_new_in_test": 1, "core_new_in_www": 0, "core_old_in_test": 0,
           "pc_old_in_www": 1 if pc_page else 0, "pc_new_in_test": 1 if pc_page else 0, "pc_new_in_www": 0, "pc_old_in_test": 0,
           "c_before_in_www": 1 if c_page else 0, "c_after_in_test": 1 if c_page else 0, "c_after_in_www": 0, "c_before_in_test": 0,
           "lastpub_www": 1, "lastpub_test": 1, "dom_www": 1, "dom_test": 1, "webflow_io_in_test": 1, "webflow_io_in_www": 0}
    r["count_mismatches"] = {k: [c[k], v] for k, v in exp.items() if not c[k] == v}
    # Map test onto www with only the allowed substitutions, then require byte equality.
    n = LP.sub("<!-- Last Published: X -->", t)
    n = n.replace(DOM_T, DOM_W).replace(CORE_NEW, CORE_OLD)
    if pc_page: n = n.replace(PC_NEW, PC_OLD)
    if c_page: n = n.replace(C_AFTER, C_BEFORE)
    wn = LP.sub("<!-- Last Published: X -->", w)
    r["identical_after_allowed_substitutions"] = (n == wn)
    if not n == wn:
        i = next((k for k in range(min(len(n), len(wn))) if not n[k] == wn[k]), min(len(n), len(wn)))
        r["first_diff_at"] = i; r["first_diff_www"] = wn[max(0, i-80):i+120]; r["first_diff_test"] = n[max(0, i-80):i+120]
    gw, gt = Grab(w), Grab(t); gw.feed(w); gt.feed(t)
    r["blocks"] = {}
    for b in ("nav", "footer", "form"):
        r["blocks"][b] = {"count_www": len(gw.blocks[b]), "count_test": len(gt.blocks[b]),
                          "sha256_www": [sha(x) for x in gw.blocks[b]], "sha256_test": [sha(x) for x in gt.blocks[b]],
                          "identical": gw.blocks[b] == gt.blocks[b]}
    r["data_ms"] = {"count_www": len(gw.ms), "count_test": len(gt.ms), "identical": gw.ms == gt.ms,
                    "attr_names": sorted(set(x[1] for x in gw.ms))}
    r["forms_www"] = gw.forms; r["forms_identical"] = gw.forms == gt.forms
    ok = (not r["count_mismatches"]) and r["identical_after_allowed_substitutions"] and r["forms_identical"] \
         and r["data_ms"]["identical"] and all(v["identical"] for v in r["blocks"].values())
    r["ok"] = ok; res["all_ok"] &= ok
    res["pages"][pg] = r
    print("%-13s ok=%s ident=%s nav=%d footer=%d form=%d ms=%d mism=%s" % (pg, ok, r["identical_after_allowed_substitutions"],
          len(gw.blocks["nav"]), len(gw.blocks["footer"]), len(gw.blocks["form"]), len(gw.ms), r["count_mismatches"]))
json.dump(res, open(OUT, "w"), indent=1)
print("ALL_OK", res["all_ok"])
