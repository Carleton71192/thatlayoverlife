/* TLL /submit v5 (21 Oct 2026). Target: handoff/claude-design-source/TLL Submit v5.dc.html and handoff/claude-code-send-2026-10-21/SUBMIT-V5-2026-10-21.md.
   Served from the repo through jsDelivr, pinned to one commit, registered as a Webflow hosted script. Source of truth: this file.
   The authenticity contract, in code: the page never writes to body, headline, excerpt or pull quote except (a) what the writer types and
   (b) one "Fix it" on one Editor's note, which replaces exactly that span. Themes are suggestions the writer picks. Reading time is
   words / 220, computed here, never asked. Photos: the original upload is kept; nothing is adjusted here. No secret lives in this file;
   the Worker holds every key. Rules (8): a place, headline 60 or fewer, 300 words or more, own hero photo, it's travel, words and photos
   are yours, links work and paid links declared, Charter agreed. Send stays disabled until every rule passes; tapping it scrolls to the first miss.
   Edit mode (/submit?edit={slug}): the same form loaded with the live story from GET /story (owner only), saved through POST /story/update.
   Link mode fills and submits the live Webflow "Link-out story" form (data-tll-form="link-out-story"), so its name and hooks keep working. */
(function () {
  'use strict';
  var root = document.getElementById('tll-submit-v5');
  if (!root) return;
  var WORKER = (root.getAttribute('data-worker') || '').replace(/\/$/, '');
  var CLOUD = root.getAttribute('data-cloud') || 'idonvlow';
  var PRESET = root.getAttribute('data-preset') || 'tll_photos';
  var EDIT_SLUG = (function () { try { var v = new URLSearchParams(location.search).get('edit') || ''; return /^[a-z0-9-]{1,120}$/.test(v) ? v : ''; } catch (e) { return ''; } })();
  var DRAFT_KEY = EDIT_SLUG ? 'tll_submit_edit_' + EDIT_SLUG : 'tll_submit_v5_draft';
  var MAX_GALLERY = 8; /* the Worker keeps 8 */
  var MAX_SHOUT = 5;
  var MAX_SPONSORS = 5;
  var MAX_THEMES = 3;
  var MAX_BYTES = 10 * 1024 * 1024;
  var KINDS = [['paid', 'PAID FOR'], ['hosted', 'HOSTED'], ['gifted', 'GIFTED'], ['discount', 'DISCOUNTED']];
  var KIND_LABEL = { paid: 'Paid for', hosted: 'Hosted', gifted: 'Gifted', discount: 'Discounted' };

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    saveline: $('tsv5-saveline'), sent: $('tsv5-sent'), sentEye: $('tsv5-sent-eye'), sentH: $('tsv5-sent-h'), sentP: $('tsv5-sent-p'), sentTitle: $('tsv5-sent-title'), sentLink: $('tsv5-sent-link'), sentAgain: $('tsv5-sent-again'),
    form: $('tsv5-form'), editbar: $('tsv5-editbar'), write: $('tsv5-write'), link: $('tsv5-link'),
    country: $('tsv5-country'), countries: $('tsv5-countries'), region: $('tsv5-region'), city: $('tsv5-city'), when: $('tsv5-when'),
    title: $('tsv5-title'), titleCount: $('tsv5-title-count'), excerpt: $('tsv5-excerpt'), excerptCount: $('tsv5-excerpt-count'),
    body: $('tsv5-body'), words: $('tsv5-words'), read: $('tsv5-read'), themes: $('tsv5-themes'),
    hero: $('tsv5-hero'), heroFile: $('tsv5-hero-file'), heroChip: $('tsv5-hero-chip'), heroStatus: $('tsv5-hero-status'),
    gallery: $('tsv5-gallery'), gadd: $('tsv5-gadd'), galleryFile: $('tsv5-gallery-file'), galleryCount: $('tsv5-gallery-count'), galleryStatus: $('tsv5-gallery-status'), lounge: $('tsv5-lounge'),
    sponsorSum: $('tsv5-sponsor-sum'), sponsorsWrap: $('tsv5-sponsors-wrap'), sponsors: $('tsv5-sponsors'), sponsorAdd: $('tsv5-sponsor-add'), sponsorPreview: $('tsv5-sponsor-preview'),
    shoutsSum: $('tsv5-shouts-sum'), shouts: $('tsv5-shouts'), shoutAdd: $('tsv5-shout-add'),
    hookSum: $('tsv5-hook-sum'), quote: $('tsv5-quote'), question: $('tsv5-question'), signoff: $('tsv5-signoff'), anchors: $('tsv5-anchors'), hashtags: $('tsv5-hashtags'),
    crewSum: $('tsv5-crew-sum'), crew: $('tsv5-crew'), crewChips: $('tsv5-crew-chips'), pets: $('tsv5-pets'), prefsSum: $('tsv5-prefs-sum'),
    penWrap: $('tsv5-pen-wrap'), pen: $('tsv5-pen'), website: $('tsv5-website'), instagram: $('tsv5-instagram'),
    notesLine: $('tsv5-notes-line'), note: $('tsv5-note'), noteK: $('tsv5-note-k'), noteT: $('tsv5-note-t'), noteAccept: $('tsv5-note-accept'), noteSkip: $('tsv5-note-skip'), noteLine: $('tsv5-note-line'),
    travel: $('tsv5-travel'), rights: $('tsv5-rights'), charter: $('tsv5-charter'), send: $('tsv5-send'), sendRail: $('tsv5-send-rail'), sendBar: $('tsv5-send-bar'), next: $('tsv5-next'), formStatus: $('tsv5-form-status'),
    ruleLine: $('tsv5-rule-line'), prog: $('tsv5-prog'), rules: $('tsv5-rules'), bar: $('tsv5-bar'), barGo: $('tsv5-bar-go'), barRule: $('tsv5-bar-rule'), barNext: $('tsv5-bar-next'),
    cardImg: $('tsv5-cardp-img'), cardMeta: $('tsv5-cardp-meta'), cardT: $('tsv5-cardp-t'), cardX: $('tsv5-cardp-x'), cardS: $('tsv5-cardp-s'),
    lkUrl: $('tsv5-lk-url'), lkHost: $('tsv5-lk-host'), lkTitle: $('tsv5-lk-title'), lkCountry: $('tsv5-lk-country'), lkSummary: $('tsv5-lk-summary'), lkGated: $('tsv5-lk-gated'), lkCharter: $('tsv5-lk-charter'), lkStatus: $('tsv5-lk-status')
  };

  /* ---------- state ---------- */
  var S = {
    mode: 'write', places: [], countryId: '', hero: null, gallery: [], pendingHero: null, pendingGallery: [], pets: [], crewIds: [],
    sponsored: null, sponsors: [{ name: '', kind: 'hosted' }], shouts: [{ who: '', link: '', affiliate: false, comped: false }],
    themes: [], themeOptions: [], suggested: [], pursuit: null, credit: 'Full', log: [], edits: [], editIndex: 0, me: null, notesFor: '',
    edit: null, editBodyHtml: '', active: 'trip', busy: false
  };

  /* ---------- helpers ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function bodyText() { return (el.body.innerText || '').replace(/ /g, ' '); }
  function words(t) { return (t || '').trim().split(/\s+/).filter(Boolean).length; }
  function readingTime(t) { return Math.max(1, Math.ceil(words(t) / 220)); }
  function setStatus(node, msg, isErr) { if (!node) return; node.textContent = msg || ''; node.classList.toggle('is-err', !!isErr); }
  function httpsOk(u) { return /^https:\/\/[^\s.]+\.[^\s]+$/.test((u || '').trim()); }
  function ms() { return window.$memberstackDom || null; }
  function member() { var m = ms(); if (!m) return Promise.resolve(null); return m.getCurrentMember().then(function (r) { return r && r.data ? r.data : null; }).catch(function () { return null; }); }
  function token() { var m = ms(); if (!m) return null; try { return (m.getMemberToken && m.getMemberToken()) || (m.getMemberCookie && m.getMemberCookie()) || null; } catch (e) { return null; } }
  function api(path, body, method) {
    var t = token(), h = { 'content-type': 'application/json' };
    if (t) h.authorization = 'Bearer ' + t;
    return fetch(WORKER + path, { method: method || 'POST', headers: h, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, data: j }; }); });
  }
  function reduced() { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function bodyHtml() { return el.body.innerHTML; }
  function setBodyHtml(html) { el.body.innerHTML = html || ''; }

  /* ---------- draft (localStorage, in try/catch) ---------- */
  var saveTimer = null;
  function snapshot() {
    return {
      mode: S.mode, country: el.country.value, countryId: S.countryId, city: el.city.value, when: el.when.value, title: el.title.value, excerpt: el.excerpt.value, bodyHtml: bodyHtml(),
      hero: S.hero, gallery: S.gallery, lounge: el.lounge.checked, sponsored: S.sponsored, sponsors: S.sponsors, shouts: S.shouts, quote: el.quote.value, question: el.question.value,
      signoff: el.signoff.value, anchors: el.anchors.value, hashtags: el.hashtags.value, crew: el.crew.value, crewIds: S.crewIds, pets: S.pets, prefs: prefs(), credit: S.credit, pen: el.pen.value,
      website: el.website.value, instagram: el.instagram.value, themes: S.themes, pursuit: S.pursuit, log: S.log, travel: el.travel.checked, rights: el.rights.checked, charter: el.charter.checked,
      lk: { url: el.lkUrl.value, title: el.lkTitle.value, country: el.lkCountry.value, summary: el.lkSummary.value, gated: el.lkGated.checked, charter: el.lkCharter.checked }, savedAt: new Date().toISOString()
    };
  }
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot())); el.saveline.textContent = 'DRAFT SAVED ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); } catch (e) {}
    }, 400);
  }
  function restore() {
    var d = null;
    try { d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch (e) { d = null; }
    if (!d) return;
    if (EDIT_SLUG) {
      var since = S.edit && (S.edit.lastUpdated || S.edit.publishedDate);
      if (!S.edit || !d.savedAt || (since && d.savedAt <= since)) { clearDraft(); return; }
    }
    el.country.value = d.country || ''; S.countryId = d.countryId || ''; el.city.value = d.city || ''; el.when.value = d.when || '';
    el.title.value = d.title || ''; el.excerpt.value = d.excerpt || ''; if (d.bodyHtml) setBodyHtml(d.bodyHtml);
    S.hero = d.hero || null; S.gallery = d.gallery || []; el.lounge.checked = !!d.lounge;
    S.sponsored = typeof d.sponsored === 'boolean' ? d.sponsored : null; S.sponsors = (d.sponsors && d.sponsors.length) ? d.sponsors : S.sponsors;
    S.shouts = (d.shouts && d.shouts.length) ? d.shouts : S.shouts;
    el.quote.value = d.quote || ''; el.question.value = d.question || ''; el.signoff.value = d.signoff || ''; el.anchors.value = d.anchors || ''; el.hashtags.value = d.hashtags || '';
    el.crew.value = d.crew || ''; S.crewIds = d.crewIds || []; S.pets = d.pets || [];
    if (d.prefs) root.querySelectorAll('[data-pref]').forEach(function (c) { if (c.getAttribute('data-pref') in d.prefs) c.checked = !!d.prefs[c.getAttribute('data-pref')]; });
    S.credit = d.credit || 'Full'; el.pen.value = d.pen || ''; el.website.value = d.website || ''; el.instagram.value = d.instagram || '';
    S.themes = d.themes || []; S.pursuit = d.pursuit || null; S.log = d.log || [];
    el.travel.checked = !!d.travel; el.rights.checked = !!d.rights; el.charter.checked = !!d.charter;
    if (d.lk) { el.lkUrl.value = d.lk.url || ''; el.lkTitle.value = d.lk.title || ''; el.lkCountry.value = d.lk.country || ''; el.lkSummary.value = d.lk.summary || ''; el.lkGated.checked = !!d.lk.gated; el.lkCharter.checked = !!d.lk.charter; }
    if (d.mode === 'link' && !EDIT_SLUG) setMode('link');
    if (d.savedAt) el.saveline.textContent = (EDIT_SLUG ? 'UNFINISHED EDIT FROM ' : 'DRAFT FROM ') + new Date(d.savedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).toUpperCase();
  }
  function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch (e) {} }

  /* ---------- places and themes ---------- */
  function loadPlaces() {
    if (!WORKER) return;
    fetch(WORKER + '/places').then(function (r) { return r.json(); }).then(function (j) {
      S.places = (j && j.places) || [];
      var frag = document.createDocumentFragment();
      S.places.forEach(function (p) { var o = document.createElement('option'); o.value = p.name; frag.appendChild(o); });
      el.countries.innerHTML = ''; el.countries.appendChild(frag);
      resolveCountry(); paint();
    }).catch(function () {});
  }
  function resolveCountry() {
    var v = el.country.value.trim().toLowerCase();
    var hit = S.places.filter(function (p) { return p.name.toLowerCase() === v; })[0];
    S.countryId = hit ? hit.id : '';
    el.region.textContent = hit && hit.region ? 'REGION · ' + String(hit.region).toUpperCase() + ' · ADDED FOR YOU' : '';
    return !!hit;
  }
  function loadThemes() {
    if (!WORKER) return;
    fetch(WORKER + '/themes').then(function (r) { return r.json(); }).then(function (j) { S.themeOptions = (j && j.themes) || []; paintThemes(); }).catch(function () {});
  }
  function paintThemes() {
    el.themes.innerHTML = '';
    S.themeOptions.forEach(function (t) {
      var on = S.themes.indexOf(t.id) > -1, sug = S.suggested.indexOf(t.id) > -1;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'tsv5-chip'; b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.setAttribute('data-sug', sug ? '1' : '0');
      b.innerHTML = '<i aria-hidden="true"></i>' + esc(t.name);
      b.addEventListener('click', function () {
        if (on) S.themes = S.themes.filter(function (x) { return x !== t.id; });
        else if (S.themes.length < MAX_THEMES) S.themes.push(t.id);
        paintThemes(); save();
      });
      el.themes.appendChild(b);
    });
  }

  /* ---------- photos ---------- */
  function upload(file, folder) {
    var fd = new FormData();
    fd.append('file', file); fd.append('upload_preset', PRESET); fd.append('folder', 'tll/' + folder);
    return fetch('https://api.cloudinary.com/v1_1/' + CLOUD + '/image/upload', { method: 'POST', body: fd })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (!j || !j.secure_url) throw new Error('upload'); return { publicId: j.public_id, originalUrl: j.secure_url, cleanedUrl: j.secure_url, approved: 'original', preview: j.secure_url }; });
  }
  function okFile(f, statusNode) {
    if (!f) return false;
    if (!/^image\//.test(f.type)) { setStatus(statusNode, 'That is not a photo file.', true); return false; }
    if (f.size > MAX_BYTES) { setStatus(statusNode, 'That one is over 10 MB. Try a smaller export.', true); return false; }
    return true;
  }
  function heroPick(f) {
    if (!okFile(f, el.heroStatus)) return;
    member().then(function (m) {
      if (!m) { S.pendingHero = f; S.hero = null; paintHero(URL.createObjectURL(f)); setStatus(el.heroStatus, 'Saved on this page. It uploads when you send.'); paint(); return; }
      setStatus(el.heroStatus, 'Uploading');
      upload(f, 'hero-image').then(function (rec) { S.hero = rec; S.pendingHero = null; paintHero(); setStatus(el.heroStatus, ''); save(); paint(); })
        .catch(function () { setStatus(el.heroStatus, 'That did not go through. Try again.', true); });
    });
  }
  function paintHero(previewUrl) {
    var url = previewUrl || (S.hero ? (S.hero.preview || S.hero.originalUrl) : '');
    el.hero.style.backgroundImage = url ? 'url("' + url + '")' : '';
    el.hero.classList.toggle('has-photo', !!url);
    el.heroChip.textContent = url ? 'CHANGE' : 'ADD YOUR PHOTO';
    el.cardImg.style.backgroundImage = url ? 'url("' + url + '")' : '';
  }
  function galleryPick(files) {
    var list = Array.prototype.slice.call(files || []);
    if (!list.length) return;
    var room = MAX_GALLERY - S.gallery.length - S.pendingGallery.length;
    if (list.length > room) { setStatus(el.galleryStatus, 'Up to ' + MAX_GALLERY + ' photos here.', true); list = list.slice(0, Math.max(0, room)); }
    list = list.filter(function (f) { return okFile(f, el.galleryStatus); });
    if (!list.length) return;
    member().then(function (m) {
      if (!m) { S.pendingGallery = S.pendingGallery.concat(list); paintGallery(); setStatus(el.galleryStatus, list.length + ' saved on this page. They upload when you send.'); return; }
      setStatus(el.galleryStatus, 'Uploading ' + list.length);
      Promise.all(list.map(function (f) { return upload(f, 'photo-gallery'); })).then(function (recs) { S.gallery = S.gallery.concat(recs); paintGallery(); setStatus(el.galleryStatus, ''); save(); })
        .catch(function () { setStatus(el.galleryStatus, 'One of those did not go through. Try again.', true); });
    });
  }
  function paintGallery() {
    el.gallery.querySelectorAll('.tsv5-g').forEach(function (n) { n.remove(); });
    var all = S.gallery.map(function (g) { return { url: g.preview || g.originalUrl, rec: g }; }).concat(S.pendingGallery.map(function (f) { return { url: URL.createObjectURL(f), file: f }; }));
    all.forEach(function (it, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'tsv5-g'; b.setAttribute('aria-label', 'Remove photo ' + (i + 1)); b.style.backgroundImage = 'url("' + it.url + '")';
      b.innerHTML = '<span aria-hidden="true">×</span>';
      b.addEventListener('click', function () { if (it.rec) S.gallery = S.gallery.filter(function (g) { return g !== it.rec; }); else S.pendingGallery = S.pendingGallery.filter(function (f) { return f !== it.file; }); paintGallery(); save(); });
      el.gallery.insertBefore(b, el.gadd);
    });
    el.galleryCount.textContent = all.length + ' / ' + MAX_GALLERY;
    el.gadd.hidden = all.length >= MAX_GALLERY;
  }
  function uploadPending() {
    var jobs = [];
    if (S.pendingHero) jobs.push(upload(S.pendingHero, 'hero-image').then(function (rec) { S.hero = rec; S.pendingHero = null; paintHero(); }));
    if (S.pendingGallery.length) jobs.push(Promise.all(S.pendingGallery.map(function (f) { return upload(f, 'photo-gallery'); })).then(function (recs) { S.gallery = S.gallery.concat(recs); S.pendingGallery = []; paintGallery(); }));
    if (!jobs.length) return Promise.resolve();
    setStatus(el.formStatus, 'Uploading your photos');
    return Promise.all(jobs).then(function () { setStatus(el.formStatus, ''); save(); });
  }
  el.heroFile.addEventListener('change', function () { heroPick(el.heroFile.files[0]); el.heroFile.value = ''; });
  el.galleryFile.addEventListener('change', function () { galleryPick(el.galleryFile.files); el.galleryFile.value = ''; });

  /* ---------- extras: accordions ---------- */
  root.querySelectorAll('.tsv5-xh').forEach(function (h) {
    h.addEventListener('click', function () {
      var open = h.getAttribute('aria-expanded') === 'true', body = $(h.getAttribute('aria-controls'));
      h.setAttribute('aria-expanded', open ? 'false' : 'true'); if (body) body.hidden = open;
    });
  });
  function openX(id) { var b = $(id); if (!b) return; b.hidden = false; var h = root.querySelector('[aria-controls="' + id + '"]'); if (h) h.setAttribute('aria-expanded', 'true'); }

  /* sponsors */
  function namedSponsors() { return S.sponsors.filter(function (r) { return r.name.trim(); }); }
  function disclosurePreview() {
    var named = namedSponsors();
    return named.length ? named.map(function (r) { return KIND_LABEL[r.kind] + ' by ' + r.name.trim(); }).join('. ') + '. Opinions are the writer’s own.' : 'Add who, and readers see it here.';
  }
  function paintSponsors() {
    root.querySelectorAll('[data-sponsored]').forEach(function (b) { b.setAttribute('aria-checked', (S.sponsored === (b.getAttribute('data-sponsored') === 'yes')) ? 'true' : 'false'); });
    el.sponsorsWrap.hidden = S.sponsored !== true;
    el.sponsors.innerHTML = '';
    S.sponsors.forEach(function (r, i) {
      var card = document.createElement('div'); card.className = 'tsv5-card tsv5-card-grid';
      var inp = document.createElement('input'); inp.className = 'tsv5-input tsv5-input-line'; inp.placeholder = 'Who, named exactly'; inp.setAttribute('aria-label', 'Sponsor or host ' + (i + 1)); inp.maxLength = 120; inp.value = r.name;
      inp.addEventListener('input', function () { r.name = inp.value; el.sponsorPreview.textContent = disclosurePreview(); paintSums(); paint(); save(); });
      var seg = document.createElement('div'); seg.className = 'tsv5-seg tsv5-seg-mono'; seg.setAttribute('role', 'radiogroup'); seg.setAttribute('aria-label', 'What they gave');
      KINDS.forEach(function (k) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'tsv5-chip'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', r.kind === k[0] ? 'true' : 'false'); b.textContent = k[1];
        b.addEventListener('click', function () { r.kind = k[0]; paintSponsors(); save(); });
        seg.appendChild(b);
      });
      card.appendChild(inp); card.appendChild(seg);
      if (S.sponsors.length > 1) { var rm = document.createElement('button'); rm.type = 'button'; rm.className = 'tsv5-link tsv5-link-rose'; rm.style.justifySelf = 'end'; rm.textContent = 'Remove'; rm.setAttribute('aria-label', 'Remove ' + (r.name || 'sponsor ' + (i + 1))); rm.addEventListener('click', function () { S.sponsors.splice(i, 1); paintSponsors(); save(); }); card.appendChild(rm); }
      el.sponsors.appendChild(card);
    });
    el.sponsorAdd.hidden = S.sponsors.length >= MAX_SPONSORS;
    el.sponsorPreview.textContent = disclosurePreview();
    paintSums();
  }
  root.querySelectorAll('[data-sponsored]').forEach(function (b) { b.addEventListener('click', function () { S.sponsored = b.getAttribute('data-sponsored') === 'yes'; paintSponsors(); paint(); save(); }); });
  el.sponsorAdd.addEventListener('click', function () { if (S.sponsors.length < MAX_SPONSORS) { S.sponsors.push({ name: '', kind: 'hosted' }); paintSponsors(); var last = el.sponsors.querySelector('.tsv5-card:last-child input'); if (last) last.focus(); } });

  /* shout-outs */
  function filledShouts() { return S.shouts.filter(function (s) { return s.link.trim(); }); }
  function paintShouts() {
    el.shouts.innerHTML = '';
    S.shouts.forEach(function (s, i) {
      var card = document.createElement('div'); card.className = 'tsv5-card';
      var two = document.createElement('div'); two.className = 'tsv5-two';
      var name = document.createElement('input'); name.className = 'tsv5-input tsv5-input-line'; name.placeholder = 'The place'; name.maxLength = 120; name.value = s.who; name.setAttribute('aria-label', 'Shout-out ' + (i + 1) + ' name');
      var url = document.createElement('input'); url.className = 'tsv5-input tsv5-input-line'; url.placeholder = 'https://'; url.inputMode = 'url'; url.maxLength = 500; url.value = s.link; url.setAttribute('aria-label', 'Shout-out ' + (i + 1) + ' link');
      var tagline = document.createElement('div'); tagline.className = 'tsv5-tagline';
      var tag = document.createElement('span'); tag.className = 'tsv5-mono';
      function paintTag() { var bad = s.link.trim() && !httpsOk(s.link); url.classList.toggle('is-bad', !!bad); tag.classList.toggle('is-bad', !!bad); tag.textContent = bad ? 'NEEDS HTTPS://' : [s.affiliate && 'AFFILIATE', s.comped && 'COMPED'].filter(Boolean).join(' · ') || (s.link.trim() ? 'PLAIN LINK' : ''); }
      name.addEventListener('input', function () { s.who = name.value; paintSums(); save(); });
      url.addEventListener('input', function () { s.link = url.value; paintTag(); paintSums(); paint(); save(); });
      function check(label, key) {
        var l = document.createElement('label'); l.className = 'tsv5-check'; l.style.minHeight = '40px';
        var c = document.createElement('input'); c.type = 'checkbox'; c.style.width = '18px'; c.style.height = '18px'; c.checked = !!s[key];
        c.addEventListener('change', function () { s[key] = c.checked; paintTag(); paint(); save(); });
        l.appendChild(c); l.appendChild(document.createTextNode(label)); return l;
      }
      two.appendChild(name); two.appendChild(url);
      tagline.appendChild(check('I earn from this link', 'affiliate')); tagline.appendChild(check('Free or discounted', 'comped')); tagline.appendChild(tag);
      card.appendChild(two); card.appendChild(tagline); el.shouts.appendChild(card); paintTag();
    });
    el.shoutAdd.hidden = S.shouts.length >= MAX_SHOUT;
    paintSums();
  }
  el.shoutAdd.addEventListener('click', function () { if (S.shouts.length < MAX_SHOUT) { S.shouts.push({ who: '', link: '', affiliate: false, comped: false }); paintShouts(); var last = el.shouts.querySelector('.tsv5-card:last-child input'); if (last) last.focus(); } });

  /* crew, pets */
  function chip(label, pressed, onToggle, img) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tsv5-chip' + (img !== undefined ? ' tsv5-chip-pet' : ''); b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    if (img !== undefined) b.innerHTML = (img ? '<img src="' + esc(img) + '" alt="">' : '<b aria-hidden="true">' + esc(label.charAt(0)) + '</b>') + esc(label); else b.textContent = label;
    b.addEventListener('click', function () { var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on ? 'true' : 'false'); onToggle(on); });
    return b;
  }
  function paintMe() {
    if (!S.me) return;
    el.pets.innerHTML = ''; el.crewChips.innerHTML = '';
    (S.me.pets || []).forEach(function (p) { el.pets.appendChild(chip(p.name, S.pets.indexOf(p.id) > -1, function (on) { S.pets = S.pets.filter(function (x) { return x !== p.id; }); if (on) S.pets.push(p.id); paintSums(); save(); }, p.image || '')); });
    (S.me.crew || []).forEach(function (c) { el.crewChips.appendChild(chip(c.name, S.crewIds.indexOf(c.id) > -1, function (on) { S.crewIds = S.crewIds.filter(function (x) { return x !== c.id; }); if (on) S.crewIds.push(c.id); paintSums(); save(); })); });
    if (!el.website.value && S.me.website) el.website.value = S.me.website;
    if (!el.instagram.value && S.me.instagram) el.instagram.value = '@' + S.me.instagram;
    if (!el.pen.value && S.me.penName) el.pen.value = S.me.penName;
    if (S.me.creditMode === 'Pen' && !S.edit) setCredit('Pen');
    paintSums();
  }
  function loadMe() { if (!WORKER) return Promise.resolve(null); return api('/me', null, 'GET').then(function (r) { if (r.ok) { S.me = r.data; paintMe(); } return r; }).catch(function () { return null; }); }

  /* prefs */
  function prefs() { var o = {}; root.querySelectorAll('[data-pref]').forEach(function (c) { o[c.getAttribute('data-pref')] = c.checked; }); return o; }
  root.querySelectorAll('[data-pref]').forEach(function (c) { c.addEventListener('change', function () { paintSums(); save(); }); });

  function paintSums() {
    var named = namedSponsors();
    el.sponsorSum.textContent = S.sponsored === null ? 'ANSWER THIS ONE' : S.sponsored ? named.length + ' NAMED' : 'NOBODY PAID, HOSTED OR GIFTED';
    el.sponsorSum.classList.toggle('is-ask', S.sponsored === null);
    var fs = filledShouts(); el.shoutsSum.textContent = fs.length ? fs.length + ' ADDED' : 'PLACES YOU WOULD SEND A FRIEND';
    el.hookSum.textContent = [el.quote.value.trim() && 'QUOTE', el.signoff.value.trim() && 'SIGN-OFF', el.question.value.trim() && 'QUESTION'].filter(Boolean).join(' · ') || 'THE LINE THEY SCREENSHOT';
    var hasCrew = !!el.crew.value.trim() || S.pets.length > 0 || S.crewIds.length > 0; el.crewSum.textContent = hasCrew ? 'TAGGED' : 'PEOPLE AND PETS';
    var p = prefs(), n = Object.keys(p).filter(function (k) { return p[k]; }).length; el.prefsSum.textContent = n + ' OF 6 ON';
  }

  /* byline */
  function setCredit(v) { S.credit = v; root.querySelectorAll('[data-credit]').forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-credit') === v ? 'true' : 'false'); }); el.penWrap.hidden = v !== 'Pen'; }
  root.querySelectorAll('[data-credit]').forEach(function (b) { b.addEventListener('click', function () { setCredit(b.getAttribute('data-credit')); save(); }); });

  /* ---------- editor toolbar ---------- */
  root.querySelectorAll('.tsv5-tool').forEach(function (b) {
    b.addEventListener('mousedown', function (e) { e.preventDefault(); });
    b.addEventListener('click', function () {
      var cmd = b.getAttribute('data-cmd'), arg = b.getAttribute('data-arg') || null;
      el.body.focus();
      if (cmd === 'createLink') { arg = window.prompt('Link (https://)'); if (!arg || !httpsOk(arg)) return; }
      try { document.execCommand(cmd, false, arg); } catch (e) {}
      onBody();
    });
  });
  el.body.addEventListener('paste', function (e) {
    if (!e.clipboardData) return;
    var t = e.clipboardData.getData('text/plain'); if (!t) return;
    e.preventDefault();
    var html = t.replace(/\r\n?/g, '\n').split(/\n{2,}/).map(function (p) { return '<p>' + esc(p.trim()).replace(/\n/g, '<br>') + '</p>'; }).join('');
    try { document.execCommand('insertHTML', false, html); } catch (x) { el.body.appendChild(document.createTextNode(t)); }
    onBody();
  });
  function onBody() { counters(); paint(); save(); }
  el.body.addEventListener('input', onBody);

  /* ---------- counters ---------- */
  function counters() {
    var w = words(bodyText()), tl = el.title.value.trim().length, xl = el.excerpt.value.length;
    el.words.textContent = w + ' WORDS'; el.words.classList.toggle('is-ok', w >= 300);
    el.read.textContent = w ? readingTime(bodyText()) + ' MIN READ · WORKED OUT FOR YOU' : '';
    el.titleCount.textContent = tl + ' / 60'; el.titleCount.classList.toggle('is-over', tl > 60);
    el.excerptCount.textContent = xl + ' / 240'; el.excerptCount.classList.toggle('is-over', xl > 240);
    el.cardMeta.textContent = [(el.country.value.trim() || 'COUNTRY').toUpperCase(), w ? readingTime(bodyText()) + ' MIN' : null].filter(Boolean).join(' · ');
    el.cardT.textContent = el.title.value.trim() || 'Your headline';
    el.cardX.textContent = el.excerpt.value.trim() || 'Your excerpt shows here.';
    var named = namedSponsors();
    el.cardS.hidden = !(S.sponsored && named.length);
    if (!el.cardS.hidden) { var kinds = []; named.forEach(function (r) { var k = KIND_LABEL[r.kind].toUpperCase(); if (kinds.indexOf(k) < 0) kinds.push(k); }); el.cardS.textContent = kinds.join(' · ') + ' · ' + named.length + (named.length === 1 ? ' PARTNER' : ' PARTNERS'); }
  }

  /* ---------- rules ---------- */
  function rules() {
    var tl = el.title.value.trim().length, w = words(bodyText());
    var shoutsOk = filledShouts().every(function (s) { return httpsOk(s.link); }) && (!el.website.value.trim() || httpsOk(el.website.value));
    var spOk = S.sponsored === false || (S.sponsored === true && namedSponsors().length > 0 && S.sponsors.every(function (r) { return r.name.trim(); }));
    if (S.mode === 'link') {
      return [
        ['link', 'A link that works', httpsOk(el.lkUrl.value)], ['link', 'A title', !!el.lkTitle.value.trim()], ['link', 'A place', !!el.lkCountry.value.trim()],
        ['link', 'One line on what it is', !!el.lkSummary.value.trim()], ['link', "It's travel, Charter agreed", el.lkCharter.checked]
      ];
    }
    return [
      ['trip', 'A place', !!S.countryId || (!WORKER && !!el.country.value.trim())],
      ['story', 'A headline, 60 or fewer', tl > 0 && tl <= 60],
      ['story', '300 words or more', w >= 300],
      ['photos', 'Your own hero photo', !!(S.hero || S.pendingHero)],
      ['send', "It's travel", el.travel.checked],
      ['send', 'Your words and photos', el.rights.checked],
      ['extras', 'Links work, paid links declared', shoutsOk && spOk],
      ['send', 'Charter agreed', el.charter.checked]
    ];
  }
  function paint() {
    counters();
    var R = rules(), done = R.filter(function (r) { return r[2]; }).length, ready = done === R.length, miss = R.filter(function (r) { return !r[2]; })[0];
    var line = done + ' OF ' + R.length + ' RULES', next = miss ? 'Next: ' + miss[1] : 'Ready to go live.';
    var label = ready ? (EDIT_SLUG ? 'Save changes' : 'Send it live') : (R.length - done) + ' to go';
    el.ruleLine.textContent = line; el.barRule.textContent = line; el.next.textContent = next; el.barNext.textContent = next;
    el.prog.setAttribute('aria-valuemax', String(R.length)); el.prog.setAttribute('aria-valuenow', String(done)); el.prog.firstElementChild.style.width = Math.round(done / R.length * 100) + '%';
    [el.send, el.sendRail, el.sendBar].forEach(function (b) { b.textContent = label; b.setAttribute('aria-disabled', ready ? 'false' : 'true'); });
    el.rules.innerHTML = '';
    R.forEach(function (r) {
      var li = document.createElement('li'), b = document.createElement('button'); b.type = 'button'; b.className = 'tsv5-rule'; b.setAttribute('data-ok', r[2] ? '1' : '0');
      b.innerHTML = '<i aria-hidden="true"></i><span>' + esc(r[1]) + '<span class="tsv5-sr">' + (r[2] ? ' (done)' : ' (to do)') + '</span></span>';
      b.addEventListener('click', function () { if (r[0] !== 'link') go(r[0]); });
      li.appendChild(b); el.rules.appendChild(li);
    });
    root.querySelectorAll('.tsv5-tab').forEach(function (t) {
      var id = t.getAttribute('data-tab'), sec = R.filter(function (r) { return r[0] === id; });
      t.setAttribute('data-ok', sec.length ? (sec.every(function (r) { return r[2]; }) ? '1' : '0') : '');
    });
    S.ready = ready; S.firstMiss = miss;
  }

  /* ---------- sub nav, scroll-spy ---------- */
  var lock = 0;
  function headerHeight() { var n = document.querySelector('.tll-nav-v1, nav[role="navigation"], .w-nav'); return n ? n.getBoundingClientRect().height : 0; }
  function go(id) {
    var sec = $('sv-' + id); if (!sec) return;
    lock = Date.now(); setActive(id);
    var top = sec.getBoundingClientRect().top + window.pageYOffset - headerHeight() - 56;
    window.scrollTo({ top: Math.max(0, top), behavior: reduced() ? 'auto' : 'smooth' });
  }
  function setActive(id) {
    S.active = id;
    root.querySelectorAll('.tsv5-tab').forEach(function (t) { var cur = t.getAttribute('data-tab') === id; if (cur) t.setAttribute('aria-current', 'location'); else t.removeAttribute('aria-current'); if (cur && t.scrollIntoView) try { t.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) {} });
  }
  root.querySelectorAll('.tsv5-tab').forEach(function (t) { t.addEventListener('click', function () { go(t.getAttribute('data-tab')); }); });
  window.addEventListener('scroll', function () {
    if (Date.now() - lock < 800 || S.mode !== 'write') return;
    var cur = 'trip', h = headerHeight() + 80;
    root.querySelectorAll('[data-sv]').forEach(function (s) { if (s.getBoundingClientRect().top <= h) cur = s.getAttribute('data-sv'); });
    if (cur !== S.active) setActive(cur);
  }, { passive: true });
  root.style.setProperty('--top', headerHeight() + 'px');
  window.addEventListener('resize', function () { root.style.setProperty('--top', headerHeight() + 'px'); });

  /* tooltips: tap and focus open, Esc and outside tap close */
  root.querySelectorAll('.tsv5-i').forEach(function (b) {
    b.addEventListener('click', function (e) { e.stopPropagation(); var on = b.getAttribute('aria-expanded') === 'true'; root.querySelectorAll('.tsv5-i').forEach(function (x) { x.setAttribute('aria-expanded', 'false'); }); b.setAttribute('aria-expanded', on ? 'false' : 'true'); });
  });
  document.addEventListener('click', function () { root.querySelectorAll('.tsv5-i').forEach(function (x) { x.setAttribute('aria-expanded', 'false'); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') root.querySelectorAll('.tsv5-i').forEach(function (x) { x.setAttribute('aria-expanded', 'false'); }); });

  /* ---------- modes ---------- */
  function setMode(m) {
    S.mode = m;
    root.querySelectorAll('[data-mode]').forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-mode') === m ? 'true' : 'false'); });
    el.write.hidden = m !== 'write'; el.link.hidden = m !== 'link'; el.cardImg.parentNode.hidden = m !== 'write';
    paint(); save();
  }
  root.querySelectorAll('[data-mode]').forEach(function (b) { b.addEventListener('click', function () { if (!EDIT_SLUG) setMode(b.getAttribute('data-mode')); }); });
  el.lkUrl.addEventListener('input', function () { var v = el.lkUrl.value.trim(), host = ''; try { if (v) host = new URL(v).hostname.replace(/^www\./, ''); } catch (e) {} el.lkHost.textContent = host ? 'THE CARD SAYS: OPENS ON ' + host.toUpperCase() : ''; });

  /* ---------- Editor's notes (Worker /notes, one at a time) ---------- */
  var notesTimer = null;
  function notesKey() { return [bodyText(), el.title.value, el.excerpt.value, el.quote.value].join('\u0001'); }
  function askNotes() {
    if (!WORKER || S.mode !== 'write' || words(bodyText()) < 300) return;
    var key = notesKey(); if (key === S.notesFor) return;
    member().then(function (m) {
      if (!m) return;
      S.notesFor = key; el.notesLine.textContent = 'READING';
      api('/notes', { body: bodyText(), headline: el.title.value, excerpt: el.excerpt.value, pullQuote: el.quote.value, country: el.country.value, city: el.city.value, when: el.when.value })
        .then(function (r) {
          if (!r.ok) { S.notesFor = ''; el.notesLine.textContent = 'ALL CLEAR'; return; }
          S.edits = (r.data.edits || []).filter(function (e) { return fieldFor(e.field) !== null; });
          S.editIndex = 0;
          var sug = (r.data.tags || []).map(function (t) { return t.id; });
          S.suggested = sug;
          if (!S.themes.length) S.themes = sug.slice(0, MAX_THEMES);
          if (!S.pursuit && r.data.pursuit) S.pursuit = r.data.pursuit.id;
          paintThemes(); paintNote(); save();
        }).catch(function () { S.notesFor = ''; el.notesLine.textContent = 'ALL CLEAR'; });
    });
  }
  function fieldFor(f) { return { body: 'body', headline: el.title, excerpt: el.excerpt, pullQuote: el.quote }[f] === undefined ? null : f; }
  function fieldValue(f) { return f === 'body' ? bodyText() : { headline: el.title, excerpt: el.excerpt, pullQuote: el.quote }[f].value; }
  function paintNote() {
    var left = S.edits.slice(S.editIndex), e = left[0];
    el.notesLine.textContent = left.length ? left.length + ' TO LOOK AT' : 'ALL CLEAR';
    el.note.hidden = !e; el.noteLine.hidden = !!e;
    el.noteLine.textContent = words(bodyText()) ? 'Nothing to flag. Nice.' : 'Notes appear once you write.';
    if (!e) return;
    var kind = ({ spelling: 'SPELLING', punctuation: 'PUNCTUATION', capitalization: 'CAPITALIZATION', paragraph: 'PARAGRAPH BREAK', order: 'SENTENCE ORDER', fact: 'FACT TO CONFIRM' })[e.type] || String(e.type || '').toUpperCase();
    el.noteK.textContent = kind + (e.field && e.field !== 'body' ? ' · ' + ({ headline: 'HEADLINE', excerpt: 'EXCERPT', pullQuote: 'PULL QUOTE' })[e.field] : '');
    el.noteT.innerHTML = '“' + esc(e.original) + '” → “<b>' + esc(e.suggested) + '</b>”' + (e.note ? ' <span class="tsv5-note-line">' + esc(e.note) + '</span>' : '');
    el.noteAccept.textContent = e.type === 'fact' ? 'Checked' : 'Fix it';
    el.noteAccept.focus();
  }
  function decide(decision) {
    var e = S.edits[S.editIndex]; if (!e) return;
    if (decision === 'accepted' && e.type !== 'fact') {
      if (e.field === 'body') {
        var html = bodyHtml(), i = html.indexOf(esc(e.original)), j = html.indexOf(e.original);
        if (i > -1) setBodyHtml(html.slice(0, i) + esc(e.suggested) + html.slice(i + esc(e.original).length));
        else if (j > -1) setBodyHtml(html.slice(0, j) + esc(e.suggested) + html.slice(j + e.original.length));
      } else {
        var f = { headline: el.title, excerpt: el.excerpt, pullQuote: el.quote }[e.field], k = f.value.indexOf(e.original);
        if (k > -1) f.value = f.value.slice(0, k) + e.suggested + f.value.slice(k + e.original.length);
      }
    }
    S.log.push({ type: e.type, field: e.field, original: e.original, suggested: e.suggested, decision: decision, at: new Date().toISOString() });
    S.editIndex++; S.notesFor = notesKey(); paintNote(); paint(); save();
  }
  el.noteAccept.addEventListener('click', function () { decide('accepted'); });
  el.noteSkip.addEventListener('click', function () { decide('skipped'); });
  function scheduleNotes() { clearTimeout(notesTimer); notesTimer = setTimeout(askNotes, 1500); }
  var sendSec = $('sv-send');
  if (sendSec && window.IntersectionObserver) new IntersectionObserver(function (es) { if (es.some(function (x) { return x.isIntersecting; })) scheduleNotes(); }, { rootMargin: '0px 0px -20% 0px' }).observe(sendSec);

  /* ---------- send ---------- */
  function openModal(kind) {
    var m = ms(); if (!m) { location.href = (kind === 'SIGNUP' ? '/signup' : '/login') + '?redirect=' + encodeURIComponent(EDIT_SLUG ? '/submit?edit=' + EDIT_SLUG : '/submit'); return Promise.resolve(null); }
    return m.openModal(kind).then(function () { return member(); }).catch(function () { return null; });
  }
  function payload() {
    var named = namedSponsors(), p = prefs();
    var body = (EDIT_SLUG && S.editBodyHtml && bodyHtml() === S.editBodyHtml) ? S.editBodyHtml : bodyHtml();
    var out = {
      country: S.countryId, city: el.city.value.trim(), when: el.when.value.trim(), body: body, headline: el.title.value.trim(), excerpt: el.excerpt.value.trim(), pullQuote: el.quote.value.trim(),
      heroPhoto: S.hero ? { publicId: S.hero.publicId, originalUrl: S.hero.originalUrl, cleanedUrl: S.hero.cleanedUrl, approved: S.hero.approved } : null,
      gallery: S.gallery.map(function (g) { return { publicId: g.publicId, originalUrl: g.originalUrl, cleanedUrl: g.cleanedUrl, approved: g.approved }; }),
      pets: S.pets, coTravelers: S.crewIds, coTravelersText: el.crew.value.trim(), signOff: el.signoff.value.trim(),
      shoutOuts: filledShouts().map(function (s) { return { who: s.who.trim() || s.link.trim().replace(/^https?:\/\/(www\.)?/, '').split('/')[0], link: s.link.trim(), why: '', affiliate: !!s.affiliate, comped: !!s.comped }; }),
      creditMode: S.credit, penName: S.credit === 'Pen' ? el.pen.value.trim() : '',
      profileLinks: { website: el.website.value.trim(), instagram: el.instagram.value.trim() },
      sponsored: S.sponsored === true, sponsors: named.map(function (r) { return { name: r.name.trim(), kind: r.kind }; }), sponsorName: named.map(function (r) { return r.name.trim(); }).join(', '),
      syndication: ['news', 'social', 'press'].filter(function (k) { return p[k]; }).map(function (k) { return k === 'news' ? 'newsletter' : k; }),
      datesShown: { posted: !!p.posted, traveled: !!p.traveled, edited: !!p.edited },
      readerQuestion: el.question.value.trim(), anchors: el.anchors.value.trim(), hashtags: el.hashtags.value.trim(), loungeOptIn: el.lounge.checked,
      charterAgreed: el.charter.checked, rightsAgreed: el.rights.checked && el.travel.checked,
      affiliateLinks: filledShouts().some(function (s) { return s.affiliate; }), editorNotesLog: S.log, tags: S.themes, pursuit: S.pursuit, readingTime: readingTime(bodyText())
    };
    if (EDIT_SLUG) out.slug = EDIT_SLUG;
    return out;
  }
  function send() {
    if (S.busy) return;
    if (S.mode === 'link') return sendLink();
    if (!S.ready) { if (S.firstMiss) go(S.firstMiss[0]); return; }
    if (!WORKER) { setStatus(el.formStatus, 'That did not go through. Try again, or write to hello@thatlayover.life.', true); return; }
    S.busy = true;
    member().then(function (m) { return m || openModal('SIGNUP'); }).then(function (m) {
      if (!m) { S.busy = false; return; }
      setStatus(el.formStatus, EDIT_SLUG ? 'Saving' : 'Sending');
      return uploadPending().then(function () {
        if (!S.hero) { S.busy = false; setStatus(el.formStatus, 'Your hero photo did not upload. Add it again.', true); go('photos'); return; }
        return api(EDIT_SLUG ? '/story/update' : '/publish', payload()).then(function (r) {
          S.busy = false;
          if (!r.ok) { setStatus(el.formStatus, (r.data && r.data.error) || 'That did not go through. Try again, or write to hello@thatlayover.life.', true); return; }
          clearDraft(); sent(r.data);
          try { if (window.tllEv) window.tllEv(EDIT_SLUG ? 'story_edited' : 'story_submitted', { type: 'write' }); } catch (x) {}
        });
      });
    }).catch(function () { S.busy = false; setStatus(el.formStatus, 'That did not go through. Try again, or write to hello@thatlayover.life.', true); });
  }
  function sent(d) {
    el.form.hidden = true; el.bar.hidden = true; root.classList.remove('has-bar'); el.sent.hidden = false;
    el.sentLink.href = d.url || '/stories';
    if (EDIT_SLUG) { el.sentEye.textContent = 'SAVED'; el.sentH.textContent = 'Saved.'; el.sentP.textContent = d.message || 'Saved. The story is live again with your changes.'; el.sentLink.textContent = 'See the story'; el.sentAgain.hidden = true; }
    else { el.sentEye.textContent = 'LIVE · ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(); el.sentTitle.textContent = el.title.value.trim() || 'Your story'; }
    window.scrollTo({ top: 0, behavior: 'auto' });
    el.sentH.setAttribute('tabindex', '-1'); el.sentH.focus();
  }
  el.sentAgain.addEventListener('click', function () { location.href = '/submit'; });
  function sendLink() {
    var R = rules(), miss = R.filter(function (r) { return !r[2]; })[0];
    if (miss) { setStatus(el.lkStatus, 'Next: ' + miss[1], true); return; }
    var f = document.querySelector('form[data-tll-form="link-out-story"]');
    if (!f) { setStatus(el.lkStatus, 'That did not go through. Try again, or write to hello@thatlayover.life.', true); return; }
    function put(name, v) { var i = f.querySelector('[name="' + name + '"]'); if (!i) return; if (i.type === 'checkbox') i.checked = !!v; else i.value = v; }
    put('external-url', el.lkUrl.value.trim()); put('field-5', el.lkTitle.value.trim()); put('country', el.lkCountry.value.trim()); put('summary', el.lkSummary.value.trim()); put('gated', el.lkGated.checked);
    S.busy = true; setStatus(el.lkStatus, 'Sending');
    var wrap = f.closest('.w-form') || f.parentNode, done = wrap && wrap.querySelector('.w-form-done'), fail = wrap && wrap.querySelector('.w-form-fail');
    var tries = 0, iv = setInterval(function () {
      var ok = done && getComputedStyle(done).display !== 'none', bad = fail && getComputedStyle(fail).display !== 'none';
      if (ok || bad || ++tries > 60) {
        clearInterval(iv); S.busy = false;
        if (ok) { clearDraft(); el.form.hidden = true; el.bar.hidden = true; root.classList.remove('has-bar'); el.sent.hidden = false; el.sentEye.textContent = 'SENT'; el.sentH.textContent = (done.textContent || 'Got it.').trim().split('. ')[0] + '.'; el.sentP.textContent = ''; el.sentLink.href = el.lkUrl.value.trim(); el.sentLink.textContent = 'Open the story'; window.scrollTo(0, 0); }
        else setStatus(el.lkStatus, 'That did not go through. Try again, or write to hello@thatlayover.life.', true);
      }
    }, 250);
    if (typeof f.requestSubmit === 'function') f.requestSubmit(); else { var sb = f.querySelector('[type="submit"]'); if (sb) sb.click(); else f.submit(); }
  }
  [el.send, el.sendRail, el.sendBar].forEach(function (b) { b.addEventListener('click', send); });
  el.barGo.addEventListener('click', function () { if (S.firstMiss && S.firstMiss[0] !== 'link') go(S.firstMiss[0]); });

  /* ---------- edit mode: the live story into the form, owner only ---------- */
  function fillFromStory(d) {
    S.edit = d;
    el.title.value = d.headline || ''; el.excerpt.value = d.excerpt || ''; el.quote.value = d.pullQuote || '';
    S.editBodyHtml = d.body || ''; setBodyHtml(S.editBodyHtml);
    el.country.value = d.countryName || ''; S.countryId = d.country || ''; el.city.value = d.city || ''; el.when.value = d.when || '';
    S.hero = (d.heroPhoto && d.heroPhoto.publicId) ? d.heroPhoto : null;
    if (!S.hero) setStatus(el.heroStatus, 'Add the hero photo again to save.', true);
    S.gallery = (d.gallery || []).filter(function (g) { return g && g.publicId; });
    S.pets = d.pets || []; S.crewIds = d.coTravelers || [];
    S.shouts = (d.shoutOuts && d.shoutOuts.length) ? d.shoutOuts.map(function (x) { return { who: x.who || '', link: x.link || '', affiliate: !!x.affiliate, comped: !!x.comped }; }) : [{ who: '', link: '', affiliate: false, comped: false }];
    el.signoff.value = d.signOff || ''; el.question.value = d.readerQuestion || ''; el.anchors.value = d.anchors || ''; el.hashtags.value = d.hashtags || '';
    S.themes = d.tags || []; S.pursuit = d.pursuit || null;
    S.sponsored = !!d.sponsored;
    S.sponsors = (d.sponsors && d.sponsors.length) ? d.sponsors.map(function (r) { return { name: r.name || '', kind: r.kind || 'hosted' }; }) : (d.sponsorName ? [{ name: d.sponsorName, kind: 'hosted' }] : [{ name: '', kind: 'hosted' }]);
    if (d.affiliateLinks && !S.shouts.some(function (s) { return s.affiliate; })) S.shouts.forEach(function (s) { if (s.link) s.affiliate = true; });
    var synd = d.syndication || [], ds = d.datesShown || {};
    root.querySelectorAll('[data-pref]').forEach(function (c) { var k = c.getAttribute('data-pref'); if (k === 'news') c.checked = synd.indexOf('newsletter') > -1; else if (k === 'social' || k === 'press') c.checked = synd.indexOf(k) > -1; else c.checked = ds[k] !== undefined ? !!ds[k] : c.checked; });
    if (d.charterOnFile) { [el.travel, el.rights, el.charter].forEach(function (c) { c.checked = true; c.disabled = true; var l = c.closest('label'); if (l) l.title = 'Agreed when the story was first published.'; }); }
    el.editbar.hidden = false;
    paintHero(); paintGallery(); paintSponsors(); paintShouts(); paintThemes(); paintMe(); openX('tsv5-x-sponsor'); resolveCountry(); paint();
  }
  function loadStory() {
    setStatus(el.formStatus, 'Loading your story');
    return api('/story?slug=' + encodeURIComponent(EDIT_SLUG), null, 'GET').then(function (r) {
      if (!r.ok) { setStatus(el.formStatus, (r.data && r.data.error) || 'We could not load that story.', true); return false; }
      fillFromStory(r.data); restore(); loadMe(); setStatus(el.formStatus, ''); paint();
      return true;
    }).catch(function () { setStatus(el.formStatus, 'We could not load that story right now. Try again in a moment.', true); return false; });
  }

  /* ---------- wire up ---------- */
  [el.country, el.city, el.when, el.title, el.excerpt, el.quote, el.question, el.signoff, el.anchors, el.hashtags, el.crew, el.pen, el.website, el.instagram, el.lkUrl, el.lkTitle, el.lkCountry, el.lkSummary].forEach(function (i) {
    i.addEventListener('input', function () { if (i === el.country) resolveCountry(); paintSums(); paint(); save(); });
  });
  [el.travel, el.rights, el.charter, el.lounge, el.lkGated, el.lkCharter].forEach(function (c) { c.addEventListener('change', function () { paint(); save(); }); });
  function barFit() { var narrow = window.innerWidth < 900 && !el.form.hidden; el.bar.hidden = !narrow; root.classList.toggle('has-bar', narrow); }
  window.addEventListener('resize', barFit);

  paintSponsors(); paintShouts(); paintGallery(); paintHero(); setCredit('Full');
  if (!EDIT_SLUG) restore();
  paint(); barFit(); loadPlaces(); loadThemes();
  if (EDIT_SLUG) { el.editbar.hidden = false; root.querySelectorAll('[data-mode]').forEach(function (b) { b.disabled = true; }); setStatus(el.formStatus, 'Loading your story'); }
  var tries = 0, iv = setInterval(function () {
    if (ms()) {
      clearInterval(iv);
      member().then(function (m) {
        if (EDIT_SLUG) { if (m) loadStory(); else setStatus(el.formStatus, 'Sign in to edit this story.', true); }
        else if (m) loadMe();
      });
    } else if (++tries > 40) { clearInterval(iv); if (EDIT_SLUG) setStatus(el.formStatus, 'Sign in to edit this story.', true); }
  }, 250);
})();
