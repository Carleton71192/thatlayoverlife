(() => { const out = [];
  const walk = (n, d) => { if (n.nodeType === 3) { const t = n.nodeValue.replace(/\s+/g, ' ').trim(); if (t) out.push(' '.repeat(d) + '"' + t.slice(0, 80) + '"'); return; }
    if (n.nodeType !== 1) return; const tag = n.tagName.toLowerCase(); if (tag === 'script' || tag === 'iframe' || tag === 'svg' || tag === 'canvas') { out.push(' '.repeat(d) + '<' + tag + ' ' + (n.id || '') + '>'); return; }
    if (tag === 'style') { out.push(' '.repeat(d) + '<style ' + (n.id || '') + ' ' + n.textContent.length + '>'); return; }
    const a = [...n.attributes].map(x => x.name + '=' + x.value.slice(0, 120)).sort().join(' | ');
    out.push(' '.repeat(d) + '<' + tag + ' ' + a + '>'); for (const c of n.childNodes) walk(c, d + 1); };
  out.push('HEAD ' + [...document.head.children].map(n => n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (n.tagName === 'STYLE' ? ':' + n.textContent.length : '')).join(' '));
  out.push('HTML ' + [...document.documentElement.attributes].map(x => x.name + '=' + x.value).sort().join(' | '));
  walk(document.body, 0); return out.join('\n'); })()
