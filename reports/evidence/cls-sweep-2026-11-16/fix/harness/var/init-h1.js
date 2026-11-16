(() => { const L = window.__INI = []; let last = '';
  const f = () => { const h = document.querySelector('.tll-map-title'); let s = 'none';
    if (h) { const r = h.getBoundingClientRect(), cs = getComputedStyle(h); const em = h.querySelector('em'); const ec = em ? getComputedStyle(em) : null;
      let pf = '?'; try { pf = [document.fonts.check('800 76px "Playfair Display"'), document.fonts.check('italic 800 76px "Playfair Display"')].join('/'); } catch (e) { }
      const loaded = [...document.fonts].filter(x => x.status === 'loaded').map(x => x.family.replace(/"/g, '') + ' ' + x.weight + ' ' + x.style[0]).join(',');
      s = [Math.round(r.top), Math.round(r.height), 'w' + Math.round(r.width), cs.fontSize, cs.lineHeight, cs.fontFamily.slice(0, 60), cs.fontWeight, ec ? ec.display + ' ' + ec.fontStyle : '', 'pf=' + pf, 'styles=' + document.styleSheets.length, 'loaded=' + loaded.slice(0, 200)].join(' ; '); }
    if (s !== last) { L.push([Math.round(performance.now()), document.readyState[0], s]); last = s; }
    if (performance.now() < 1500) requestAnimationFrame(f); };
  requestAnimationFrame(f); })();
