/* TLL /account Stories tab v2 (21 October 2026). Replaces tllacctstoriesv1.
   Lists the signed-in member's own stories from the Worker (GET /story/mine) with Edit, Take down and Put it back
   (change log E1.1, E4). Without a Worker address, or when the Worker cannot be reached, it falls back to what v1 did:
   the member's cards read from /stories, with no actions. Types no story copy; every title and image is the item's own.
   Worker address: window.TLL_WORKER or a data-tll-worker attribute on any element. No secret lives here. */
(function () {
  'use strict';
  if (!/^\/account/.test(location.pathname)) return;
  var WORKER = (function () {
    var n = document.querySelector('[data-tll-worker]');
    return ((n && n.getAttribute('data-tll-worker')) || window.TLL_WORKER || '').replace(/\/$/, '');
  })();
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function ms() { return window.$memberstackDom || null; }
  function token() {
    var m = ms(); if (!m) return null;
    try { return (m.getMemberToken && m.getMemberToken()) || (m.getMemberCookie && m.getMemberCookie()) || null; } catch (e) { return null; }
  }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; }
  function slugify(t) { return (t + '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function when(iso) { var d = iso ? new Date(iso) : null; return d && !isNaN(d.getTime()) ? MON[d.getMonth()] + ' ' + d.getFullYear() : ''; }
  function host() {
    var block = null;
    [].forEach.call(document.querySelectorAll('.tll-account-mine-block'), function (b) { if (!block && /my stories/i.test(b.textContent)) block = b; });
    return block ? block.querySelector('.tll-account-empty-state') : null;
  }
  function api(path, body, method) {
    var h = { 'content-type': 'application/json' }, t = token();
    if (t) h.authorization = 'Bearer ' + t;
    return fetch(WORKER + path, { method: method || 'POST', headers: h, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, data: j }; }); });
  }

  function render(host, stories) {
    var cta = host.querySelector('a');
    host.textContent = '';
    host.dataset.tms = '1';
    var live = stories.filter(function (s) { return s.state === 'live'; }).length;
    host.appendChild(el('div', 'tms-h', live + (live === 1 ? ' story' : ' stories') + ' published'));
    stories.forEach(function (s) {
      var row = el('div', 'tms-a tms-row');
      if (s.heroUrl) { var img = el('img'); img.src = s.heroUrl; img.alt = ''; img.loading = 'lazy'; row.appendChild(img); }
      var body = el('div', 'tms-body');
      var meta = [when(s.publishedDate), s.city].filter(Boolean).join(' · ');
      if (meta) body.appendChild(el('div', 'tms-m', meta));
      var title = el('a', 'tms-t'); title.textContent = s.headline; title.href = s.url; body.appendChild(title);
      var acts = el('div', 'tms-acts');
      var edit = el('a', 'tms-act', s.state === 'taken-down' ? 'Put it back' : 'Edit'); edit.href = '/submit?edit=' + encodeURIComponent(s.slug);
      if (s.state === 'taken-down') { acts.appendChild(el('span', 'tms-state', 'Taken down')); acts.appendChild(el('span', 'tms-dot', ' · ')); acts.appendChild(edit); }
      else {
        if (s.state === 'held') { acts.appendChild(el('span', 'tms-state', 'With the editor')); acts.appendChild(el('span', 'tms-dot', ' · ')); }
        acts.appendChild(edit);
        acts.appendChild(el('span', 'tms-dot', ' · '));
        var down = el('button', 'tms-act tms-btn', 'Take down'); down.type = 'button';
        down.addEventListener('click', function () {
          if (!window.confirm('Take this story off the site? You can put it back from this tab.')) return;
          down.disabled = true; down.textContent = 'Taking down';
          api('/story/unpublish', { slug: s.slug }).then(function (r) {
            if (!r.ok) { down.disabled = false; down.textContent = 'Take down'; window.alert((r.data && r.data.error) || 'That did not go through. Try again in a moment.'); return; }
            s.state = 'taken-down'; render(host, stories);
          }).catch(function () { down.disabled = false; down.textContent = 'Take down'; window.alert('That did not go through. Try again in a moment.'); });
        });
        acts.appendChild(down);
      }
      body.appendChild(acts);
      row.appendChild(body);
      host.appendChild(row);
    });
    if (cta) { cta.textContent = 'Share another story'; host.appendChild(cta); }
  }

  /* v1 fallback: the member's cards as /stories shows them, no actions. */
  function fallback(member) {
    var cf = member.customFields || {};
    var name = cf['custom-slug'] || ((cf['first-name'] || '') + ' ' + (cf['last-name'] || ''));
    var mine = slugify(name); if (!mine) return;
    fetch('/stories', { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html'), list = [], seen = {};
      [].forEach.call(doc.querySelectorAll('a[data-tll-card]'), function (card) {
        var author = card.querySelector('[data-tll-author]'), href = card.getAttribute('href');
        var txt = function (sel) { var n = card.querySelector(sel); return n ? n.textContent.trim() : ''; };
        var img = card.querySelector('img.tll-lib-img');
        if (author && slugify(author.textContent) === mine && href && !seen[href]) { seen[href] = 1; list.push({ h: href, t: txt('.tll-lib-title') || 'Untitled', m: txt('.tll-lib-meta'), i: img ? img.getAttribute('src') : '' }); }
      });
      var h = host(); if (!list.length || !h || h.dataset.tms) return;
      h.dataset.tms = '1';
      var cta = h.querySelector('a'); h.textContent = '';
      h.appendChild(el('div', 'tms-h', list.length + (list.length > 1 ? ' stories' : ' story') + ' published'));
      list.forEach(function (s) {
        var a = el('a', 'tms-a'); a.href = s.h;
        if (s.i) { var im = el('img'); im.src = s.i; im.alt = ''; a.appendChild(im); }
        var b = el('div'); if (s.m) b.appendChild(el('div', 'tms-m', s.m)); b.appendChild(el('div', 'tms-t', s.t)); a.appendChild(b); h.appendChild(a);
      });
      if (cta) { cta.textContent = 'Share another story'; h.appendChild(cta); }
    }).catch(function () {});
  }

  function start(member) {
    var h = host();
    if (!h || h.dataset.tms) return;
    if (!WORKER) { fallback(member); return; }
    api('/story/mine', null, 'GET').then(function (r) {
      if (!r.ok || !r.data || !Array.isArray(r.data.stories)) { fallback(member); return; }
      if (r.data.stories.length) render(h, r.data.stories);
    }).catch(function () { fallback(member); });
  }

  var style = document.createElement('style');
  style.id = 'tll-acct-stories-v2';
  style.textContent = '.tms-row{cursor:default}.tms-row .tms-t{text-decoration:none;color:inherit;display:block}.tms-row .tms-t:hover{color:#F0507A}.tms-acts{margin-top:6px;font:600 12px/1.4 "JetBrains Mono",monospace;letter-spacing:.5px;color:#6B6660}.tms-act{color:#067A79;text-decoration:underline;background:none;border:0;padding:0;font:inherit;cursor:pointer}.tms-act:hover{color:#F0507A}.tms-act:focus-visible{outline:3px solid #F0507A;outline-offset:2px}.tms-btn[disabled]{opacity:.6;cursor:wait}.tms-state{color:#6B6660}';
  document.head.appendChild(style);

  var tries = 0, iv = setInterval(function () {
    var m = ms();
    if (m) { clearInterval(iv); m.getCurrentMember().then(function (r) { if (r && r.data) start(r.data); }).catch(function () {}); }
    else if (++tries > 40) clearInterval(iv);
  }, 250);
})();
