(() => { const L = window.__INI = []; let last = '';
  const f = () => { const d = document.getElementById('tllm-drawer'); let s = 'none';
    if (d) { const r = d.getBoundingClientRect(), cs = getComputedStyle(d); const anc = []; for (let n = d.parentElement; n && n !== document.documentElement; n = n.parentElement) { const c = getComputedStyle(n); if (c.transform !== 'none' || c.filter !== 'none' || c.willChange !== 'auto' || c.contain !== 'none' || c.opacity !== '1') anc.push((n.id || n.className || n.tagName).toString().slice(0, 40) + ' tf=' + c.transform + ' op=' + c.opacity + ' wc=' + c.willChange); }
      s = [Math.round(r.top), Math.round(r.height), cs.position, cs.transform, cs.display, d.getAttribute('data-open'), 'off=' + d.offsetTop, anc.join(' | ')].join(' ; '); }
    if (s !== last) { L.push([Math.round(performance.now()), document.readyState[0], s]); last = s; }
    if (performance.now() < 4000) requestAnimationFrame(f); };
  requestAnimationFrame(f); })();
