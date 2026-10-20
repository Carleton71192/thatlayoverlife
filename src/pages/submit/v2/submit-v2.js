/* TLL /submit v2 (19 Oct 2026). Writer-led story flow. Served from the repo through jsDelivr, pinned to one commit, registered as a
   Webflow hosted script. Source of truth: this file.
   The authenticity contract, in code: the page never writes to body, headline, excerpt or pull quote except (a) what the writer types and
   (b) one Accept on one Editor's note, which replaces exactly that span. There is no other path. Tags and pursuit are suggestions the
   writer can change. Reading time is words / 220, computed here, never asked. Photos: the original upload is never changed; a cleaned
   version is a derived URL the writer can pick. No secret lives in this file; the Worker holds every key. */
(function () {
  'use strict';
  var root = document.getElementById('tll-submit-v2');
  if (!root) return;
  var WORKER = (root.getAttribute('data-worker') || '').replace(/\/$/, '');
  var CLOUD = root.getAttribute('data-cloud') || 'idonvlow';
  var PRESET = root.getAttribute('data-preset') || 'tll_photos';
  var CLEAN = 'e_improve,e_auto_brightness,e_auto_color,e_auto_contrast,q_auto,f_auto,fl_keep_iptc';
  var DRAFT_KEY = 'tll_submit_draft';
  var MAX_GALLERY = 8;
  var MAX_SHOUT = 5;
  var MAX_BYTES = 10 * 1024 * 1024;

  var $ = function (id) { return document.getElementById(id); };
  var form = root.querySelector('.tsv2-form');
  var el = {
    country: $('tsv2-country'), countryList: $('tsv2-country-list'), city: $('tsv2-city'), month: $('tsv2-month'), year: $('tsv2-year'),
    body: $('tsv2-body'), words: $('tsv2-words'), readtime: $('tsv2-readtime'), headline: $('tsv2-headline'), headlineCount: $('tsv2-headline-count'),
    excerpt: $('tsv2-excerpt'), excerptCount: $('tsv2-excerpt-count'), pullquote: $('tsv2-pullquote'), signoff: $('tsv2-signoff'),
    crewText: $('tsv2-crew-text'), cost: $('tsv2-cost'), forwhom: $('tsv2-forwhom'),
    heroFile: $('tsv2-hero-file'), heroPhoto: $('tsv2-hero-photo'), heroImg: $('tsv2-hero-img'), heroAngle: $('tsv2-hero-angle'),
    heroAngleOut: $('tsv2-hero-angle-out'), heroCrop: $('tsv2-hero-crop'), heroRemove: $('tsv2-hero-remove'), heroStatus: $('tsv2-hero-status'),
    galleryFile: $('tsv2-gallery-file'), gallery: $('tsv2-gallery'), galleryStatus: $('tsv2-gallery-status'),
    pets: $('tsv2-pets'), petsHint: $('tsv2-pets-hint'), crew: $('tsv2-crew'), crewHint: $('tsv2-crew-hint'),
    shoutouts: $('tsv2-shoutouts'), shoutAdd: $('tsv2-shoutout-add'),
    gate: $('tsv2-gate'), confirm: $('tsv2-confirm'), login: $('tsv2-login'), join: $('tsv2-join'), rights: $('tsv2-rights'), charter: $('tsv2-charter'),
    penname: $('tsv2-penname'), sponsor: $('tsv2-sponsor'), sponsorName: $('tsv2-sponsor-name'), sponsorUrl: $('tsv2-sponsor-url'),
    back: $('tsv2-back'), next: $('tsv2-next'), publish: $('tsv2-publish'), formStatus: $('tsv2-form-status'), doneLink: $('tsv2-done-link'),
    notesAsk: $('tsv2-notes-ask'), notesEmpty: $('tsv2-notes-empty'), notesStatus: $('tsv2-notes-status'), sugg: $('tsv2-sugg'), suggK: $('tsv2-sugg-k'),
    suggOrig: $('tsv2-sugg-orig'), suggNew: $('tsv2-sugg-new'), suggNote: $('tsv2-sugg-note'), suggCount: $('tsv2-sugg-count'),
    accept: $('tsv2-accept'), skip: $('tsv2-skip'), tipsWrap: $('tsv2-tips-wrap'), tips: $('tsv2-tips'), tagsWrap: $('tsv2-tags-wrap'),
    tags: $('tsv2-tags'), pursuit: $('tsv2-pursuit')
  };

  /* ---------- state ---------- */
  var S = {
    step: 1, places: [], countryId: '', hero: null, gallery: [], pets: [], crew: [], shoutouts: [{ who: '', link: '', why: '' }],
    tags: [], pursuit: null, tagOptions: [], pursuitOptions: [], log: [], edits: [], editIndex: 0, me: null, pendingHero: null, pendingGallery: []
  };

  /* ---------- helpers ---------- */
  function words(t) { return (t || '').trim().split(/\s+/).filter(Boolean).length; }
  function readingTime(t) { return Math.max(1, Math.ceil(words(t) / 220)); }
  function setStatus(node, msg, isErr) { if (!node) return; node.textContent = msg || ''; node.classList.toggle('is-err', !!isErr); }
  function showErr(id, on) { var n = $(id); if (n) n.hidden = !on; }
  function mark(input, bad) { if (input) input.setAttribute('aria-invalid', bad ? 'true' : 'false'); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function paragraphsToHtml(t) {
    return (t || '').replace(/\r\n?/g, '\n').split(/\n{2,}/).map(function (p) { return p.trim(); }).filter(Boolean)
      .map(function (p) { return '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>'; }).join('');
  }
  function cleanedUrl(url, opts) {
    var i = url.indexOf('/image/upload/');
    if (i < 0) return url;
    var t = [];
    if (opts && opts.crop) t.push('c_crop,ar_16:9,g_center');
    if (opts && opts.angle) t.push('a_' + opts.angle);
    t.push(CLEAN);
    return url.slice(0, i + 14) + t.join('/') + '/' + url.slice(i + 14);
  }
  function ms() { return window.$memberstackDom || null; }
  function member() {
    var m = ms(); if (!m) return Promise.resolve(null);
    return m.getCurrentMember().then(function (r) { return r && r.data ? r.data : null; }).catch(function () { return null; });
  }
  function token() {
    var m = ms(); if (!m || !m.getMemberToken) return null;
    try { return m.getMemberToken(); } catch (e) { return null; }
  }
  function api(path, body, method) {
    var t = token();
    var h = { 'content-type': 'application/json' };
    if (t) h.authorization = 'Bearer ' + t;
    return fetch(WORKER + path, { method: method || 'POST', headers: h, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, data: j }; }); });
  }

  /* ---------- draft (localStorage, in try/catch) ---------- */
  var saveTimer = null;
  function snapshot() {
    return {
      country: el.country.value, countryId: S.countryId, city: el.city.value, month: el.month.value, year: el.year.value,
      body: el.body.value, headline: el.headline.value, excerpt: el.excerpt.value, pullQuote: el.pullquote.value, signOff: el.signoff.value,
      crewText: el.crewText.value, cost: el.cost.value, forWhom: el.forwhom.value, hero: S.hero, gallery: S.gallery, pets: S.pets, crew: S.crew,
      shoutouts: S.shoutouts, tags: S.tags, pursuit: S.pursuit, log: S.log, step: S.step, savedAt: new Date().toISOString()
    };
  }
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot())); } catch (e) {} }, 400);
  }
  function restore() {
    var d = null;
    try { d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch (e) { d = null; }
    if (!d) return;
    el.country.value = d.country || ''; S.countryId = d.countryId || ''; el.city.value = d.city || ''; el.month.value = d.month || ''; el.year.value = d.year || '';
    el.body.value = d.body || ''; el.headline.value = d.headline || ''; el.excerpt.value = d.excerpt || ''; el.pullquote.value = d.pullQuote || '';
    el.signoff.value = d.signOff || ''; el.crewText.value = d.crewText || ''; el.cost.value = d.cost || ''; el.forwhom.value = d.forWhom || '';
    S.hero = d.hero || null; S.gallery = d.gallery || []; S.pets = d.pets || []; S.crew = d.crew || []; S.tags = d.tags || []; S.pursuit = d.pursuit || null; S.log = d.log || [];
    S.shoutouts = (d.shoutouts && d.shoutouts.length) ? d.shoutouts : S.shoutouts;
    if (S.hero) paintHero();
    paintGallery();
    paintShoutouts();
    if (d.savedAt) setStatus(el.formStatus, 'Draft restored from ' + new Date(d.savedAt).toLocaleString());
  }
  function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch (e) {} }

  /* ---------- counters ---------- */
  function counters() {
    var w = words(el.body.value);
    el.words.textContent = w + (w === 1 ? ' word' : ' words');
    el.readtime.textContent = w ? readingTime(el.body.value) + ' min read' : '';
    el.headlineCount.textContent = el.headline.value.length + ' characters. About 60 fits a search result.';
    el.excerptCount.textContent = el.excerpt.value.length + ' characters. About 155 fits a search result.';
  }

  /* ---------- places ---------- */
  function loadPlaces() {
    fetch(WORKER + '/places').then(function (r) { return r.json(); }).then(function (j) {
      S.places = (j && j.places) || [];
      var frag = document.createDocumentFragment();
      S.places.forEach(function (p) { var o = document.createElement('option'); o.value = p.name; frag.appendChild(o); });
      el.countryList.innerHTML = ''; el.countryList.appendChild(frag);
      resolveCountry();
    }).catch(function () {});
  }
  function resolveCountry() {
    var v = el.country.value.trim().toLowerCase();
    var hit = S.places.filter(function (p) { return p.name.toLowerCase() === v; })[0];
    S.countryId = hit ? hit.id : '';
    return !!hit;
  }

  /* ---------- years ---------- */
  (function years() {
    var y = new Date().getFullYear();
    for (var i = y; i >= y - 40; i--) { var o = document.createElement('option'); o.value = String(i); o.textContent = String(i); el.year.appendChild(o); }
  })();

  /* ---------- photos ---------- */
  function upload(file, folder) {
    var fd = new FormData();
    fd.append('file', file); fd.append('upload_preset', PRESET); fd.append('folder', 'tll/' + folder);
    return fetch('https://api.cloudinary.com/v1_1/' + CLOUD + '/image/upload', { method: 'POST', body: fd })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (!j || !j.secure_url) throw new Error('upload'); return { publicId: j.public_id, originalUrl: j.secure_url, cleanedUrl: cleanedUrl(j.secure_url), approved: 'original', angle: 0, crop: false }; });
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
      if (!m) {
        S.pendingHero = f;
        el.heroImg.src = URL.createObjectURL(f); el.heroPhoto.hidden = false;
        setStatus(el.heroStatus, 'Saved on this page. It uploads when you sign in at step 3.');
        return;
      }
      setStatus(el.heroStatus, 'Uploading');
      upload(f, 'hero-image').then(function (rec) { S.hero = rec; S.pendingHero = null; paintHero(); setStatus(el.heroStatus, 'Uploaded. The original is kept.'); save(); })
        .catch(function () { setStatus(el.heroStatus, 'That did not go through. Try again.', true); });
    });
  }
  function paintHero() {
    if (!S.hero) { el.heroPhoto.hidden = true; return; }
    var h = S.hero;
    h.cleanedUrl = cleanedUrl(h.originalUrl, { angle: h.angle, crop: h.crop });
    el.heroImg.src = h.approved === 'cleaned' ? h.cleanedUrl : h.originalUrl;
    el.heroImg.alt = 'Your hero photo, ' + h.approved + ' version';
    el.heroPhoto.hidden = false;
    root.querySelectorAll('[data-hero-pick]').forEach(function (b) { var on = b.getAttribute('data-hero-pick') === h.approved; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    el.heroAngle.value = h.angle || 0; el.heroAngleOut.textContent = (h.angle || 0) + '°'; el.heroCrop.checked = !!h.crop;
  }
  root.querySelectorAll('[data-hero-pick]').forEach(function (b) {
    b.addEventListener('click', function () { if (!S.hero) return; S.hero.approved = b.getAttribute('data-hero-pick'); paintHero(); save(); });
  });
  el.heroAngle.addEventListener('input', function () { if (!S.hero) return; S.hero.angle = parseFloat(el.heroAngle.value) || 0; if (S.hero.angle) S.hero.approved = 'cleaned'; paintHero(); save(); });
  el.heroCrop.addEventListener('change', function () { if (!S.hero) return; S.hero.crop = el.heroCrop.checked; if (S.hero.crop) S.hero.approved = 'cleaned'; paintHero(); save(); });
  el.heroRemove.addEventListener('click', function () { S.hero = null; S.pendingHero = null; el.heroFile.value = ''; paintHero(); setStatus(el.heroStatus, ''); save(); });
  el.heroFile.addEventListener('change', function () { heroPick(el.heroFile.files[0]); });

  function galleryPick(files) {
    var list = Array.prototype.slice.call(files || []);
    if (!list.length) return;
    if (S.gallery.length + S.pendingGallery.length + list.length > MAX_GALLERY) { setStatus(el.galleryStatus, 'Up to ' + MAX_GALLERY + ' photos here.', true); list = list.slice(0, Math.max(0, MAX_GALLERY - S.gallery.length - S.pendingGallery.length)); }
    list = list.filter(function (f) { return okFile(f, el.galleryStatus); });
    member().then(function (m) {
      if (!m) { S.pendingGallery = S.pendingGallery.concat(list); setStatus(el.galleryStatus, list.length + ' saved on this page. They upload when you sign in at step 3.'); return; }
      setStatus(el.galleryStatus, 'Uploading ' + list.length);
      Promise.all(list.map(function (f) { return upload(f, 'photo-gallery'); })).then(function (recs) {
        S.gallery = S.gallery.concat(recs); paintGallery(); setStatus(el.galleryStatus, 'Uploaded. Originals are kept.'); save();
      }).catch(function () { setStatus(el.galleryStatus, 'One of those did not go through. Try again.', true); });
    });
  }
  function paintGallery() {
    el.gallery.innerHTML = '';
    S.gallery.forEach(function (g, i) {
      var li = document.createElement('li');
      var img = document.createElement('img'); img.src = g.approved === 'cleaned' ? g.cleanedUrl : g.originalUrl; img.alt = 'Photo ' + (i + 1) + ', ' + g.approved;
      var tg = document.createElement('button'); tg.type = 'button'; tg.className = 'tsv2-tg' + (g.approved === 'cleaned' ? ' is-on' : ''); tg.setAttribute('aria-pressed', g.approved === 'cleaned' ? 'true' : 'false'); tg.textContent = g.approved === 'cleaned' ? 'Cleaned' : 'Clean it';
      tg.addEventListener('click', function () { g.approved = g.approved === 'cleaned' ? 'original' : 'cleaned'; paintGallery(); save(); });
      var rm = document.createElement('button'); rm.type = 'button'; rm.className = 'tsv2-link'; rm.textContent = 'Remove';
      rm.addEventListener('click', function () { S.gallery.splice(i, 1); paintGallery(); save(); });
      li.appendChild(img); li.appendChild(tg); li.appendChild(rm); el.gallery.appendChild(li);
    });
  }
  el.galleryFile.addEventListener('change', function () { galleryPick(el.galleryFile.files); el.galleryFile.value = ''; });
  root.querySelectorAll('.tsv2-drop').forEach(function (d) {
    d.addEventListener('dragover', function (e) { e.preventDefault(); d.classList.add('is-over'); });
    d.addEventListener('dragleave', function () { d.classList.remove('is-over'); });
    d.addEventListener('drop', function (e) { e.preventDefault(); d.classList.remove('is-over'); var inp = d.querySelector('input[type=file]'); if (inp === el.heroFile) heroPick(e.dataTransfer.files[0]); else galleryPick(e.dataTransfer.files); });
  });
  function uploadPending() {
    var jobs = [];
    if (S.pendingHero) jobs.push(upload(S.pendingHero, 'hero-image').then(function (rec) { S.hero = rec; S.pendingHero = null; paintHero(); }));
    if (S.pendingGallery.length) jobs.push(Promise.all(S.pendingGallery.map(function (f) { return upload(f, 'photo-gallery'); })).then(function (recs) { S.gallery = S.gallery.concat(recs); S.pendingGallery = []; paintGallery(); }));
    if (!jobs.length) return Promise.resolve();
    setStatus(el.formStatus, 'Uploading your photos');
    return Promise.all(jobs).then(function () { setStatus(el.formStatus, ''); save(); });
  }

  /* ---------- chips: pets, crew, tags, pursuit ---------- */
  function chip(label, pressed, onToggle) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tsv2-chip'; b.textContent = label; b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    b.addEventListener('click', function () { var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on ? 'true' : 'false'); onToggle(on); });
    return b;
  }
  function paintMe() {
    if (!S.me) return;
    el.pets.innerHTML = '';
    if (S.me.pets && S.me.pets.length) {
      S.me.pets.forEach(function (p) { el.pets.appendChild(chip(p.name, S.pets.indexOf(p.id) > -1, function (on) { S.pets = S.pets.filter(function (x) { return x !== p.id; }); if (on) S.pets.push(p.id); save(); })); });
    } else { el.pets.innerHTML = '<p class="tsv2-help">No pets on your account yet. <a href="/my-pets">Add one</a>.</p>'; }
    el.crew.innerHTML = '';
    if (S.me.crew && S.me.crew.length) {
      S.me.crew.forEach(function (c) { el.crew.appendChild(chip(c.name, S.crew.indexOf(c.id) > -1, function (on) { S.crew = S.crew.filter(function (x) { return x !== c.id; }); if (on) S.crew.push(c.id); save(); })); });
    } else { el.crew.innerHTML = '<p class="tsv2-help">No crew on your profile yet. Name them below.</p>'; }
    if (S.me.creditMode) { var r = form.querySelector('input[name=creditMode][value="' + S.me.creditMode + '"]'); if (r) r.checked = true; }
    el.penname.textContent = S.me.penName ? '(' + S.me.penName + ')' : '(set one on your profile)';
  }
  function loadMe() {
    return api('/me', null, 'GET').then(function (r) { if (r.ok) { S.me = r.data; paintMe(); } return r; }).catch(function () { return null; });
  }
  function paintTags() {
    el.tags.innerHTML = ''; el.pursuit.innerHTML = '';
    S.tagOptions.forEach(function (t) { el.tags.appendChild(chip(t.name, S.tags.indexOf(t.id) > -1, function (on) { S.tags = S.tags.filter(function (x) { return x !== t.id; }); if (on) S.tags.push(t.id); save(); })); });
    S.pursuitOptions.forEach(function (p) {
      var b = chip(p.name, S.pursuit === p.id, function (on) { S.pursuit = on ? p.id : null; paintTags(); save(); });
      el.pursuit.appendChild(b);
    });
    el.tagsWrap.hidden = !(S.tagOptions.length || S.pursuitOptions.length);
  }

  /* ---------- shout-outs ---------- */
  function paintShoutouts() {
    el.shoutouts.innerHTML = '';
    S.shoutouts.forEach(function (s, i) {
      var row = document.createElement('div'); row.className = 'tsv2-shout';
      [['who', 'Who', 'text'], ['link', 'Link', 'url'], ['why', 'Why', 'text']].forEach(function (f) {
        var wrap = document.createElement('div'); wrap.className = 'tsv2-field';
        var lab = document.createElement('label'); lab.className = 'tsv2-label'; lab.htmlFor = 'tsv2-shout-' + i + '-' + f[0]; lab.textContent = f[1];
        var inp = document.createElement('input'); inp.className = 'tsv2-input'; inp.id = lab.htmlFor; inp.type = f[2]; inp.maxLength = 160; inp.value = s[f[0]] || ''; if (f[2] === 'url') inp.placeholder = 'https://';
        inp.addEventListener('input', function () { s[f[0]] = inp.value; save(); });
        wrap.appendChild(lab); wrap.appendChild(inp); row.appendChild(wrap);
      });
      var rm = document.createElement('button'); rm.type = 'button'; rm.className = 'tsv2-link'; rm.textContent = 'Remove';
      rm.addEventListener('click', function () { S.shoutouts.splice(i, 1); if (!S.shoutouts.length) S.shoutouts.push({ who: '', link: '', why: '' }); paintShoutouts(); save(); });
      row.appendChild(rm); el.shoutouts.appendChild(row);
    });
    el.shoutAdd.hidden = S.shoutouts.length >= MAX_SHOUT;
  }
  el.shoutAdd.addEventListener('click', function () { if (S.shoutouts.length < MAX_SHOUT) { S.shoutouts.push({ who: '', link: '', why: '' }); paintShoutouts(); var last = el.shoutouts.querySelector('.tsv2-shout:last-child input'); if (last) last.focus(); } });

  /* ---------- Editor's notes ---------- */
  var FIELD = { body: el.body, headline: el.headline, excerpt: el.excerpt, pullQuote: el.pullquote };
  function askNotes() {
    if (!el.body.value.trim()) { setStatus(el.notesStatus, 'Write a little first. The notes need a draft to read.', true); return; }
    member().then(function (m) {
      if (!m) { setStatus(el.notesStatus, 'Editor’s notes need you signed in. Keep writing; sign in at step 3.', true); return; }
      el.notesAsk.disabled = true; setStatus(el.notesStatus, 'Reading your draft'); el.notesEmpty.hidden = true;
      api('/notes', { body: el.body.value, headline: el.headline.value, excerpt: el.excerpt.value, pullQuote: el.pullquote.value, country: el.country.value, city: el.city.value, when: el.month.value + ' ' + el.year.value })
        .then(function (r) {
          el.notesAsk.disabled = false;
          if (!r.ok) { setStatus(el.notesStatus, (r.data && r.data.error) || 'Editor’s notes are unavailable right now.', true); return; }
          S.edits = (r.data.edits || []).filter(function (e) { return FIELD[e.field] && FIELD[e.field].value.indexOf(e.original) > -1; });
          S.editIndex = 0;
          el.tips.innerHTML = ''; (r.data.tips || []).forEach(function (t) { var li = document.createElement('li'); li.textContent = t; el.tips.appendChild(li); });
          el.tipsWrap.hidden = !(r.data.tips || []).length;
          S.tagOptions = r.data.tags || []; S.pursuitOptions = r.data.pursuit ? [r.data.pursuit] : [];
          if (!S.tags.length) S.tags = S.tagOptions.map(function (t) { return t.id; });
          if (!S.pursuit && r.data.pursuit) S.pursuit = r.data.pursuit.id;
          paintTags();
          setStatus(el.notesStatus, S.edits.length ? S.edits.length + ' suggestion' + (S.edits.length === 1 ? '' : 's') + '. One at a time.' : 'No edits to suggest. Tips below, if any.');
          if (!S.edits.length && !(r.data.tips || []).length && !S.tagOptions.length) el.notesEmpty.hidden = false;
          paintSuggestion(); save();
        }).catch(function () { el.notesAsk.disabled = false; setStatus(el.notesStatus, 'Editor’s notes are unavailable right now.', true); });
    });
  }
  function paintSuggestion() {
    var e = S.edits[S.editIndex];
    if (!e) { el.sugg.hidden = true; return; }
    el.sugg.hidden = false;
    el.suggK.textContent = ({ spelling: 'Spelling', punctuation: 'Punctuation', capitalization: 'Capitalization', paragraph: 'Paragraph break', order: 'Sentence order' })[e.type] || e.type;
    el.suggOrig.textContent = e.original; el.suggNew.textContent = e.suggested; el.suggNote.textContent = e.note || '';
    el.suggCount.textContent = (S.editIndex + 1) + ' of ' + S.edits.length + ' in ' + ({ body: 'your story', headline: 'the headline', excerpt: 'the excerpt', pullQuote: 'the pull quote' })[e.field];
    el.accept.focus();
  }
  function decide(decision) {
    var e = S.edits[S.editIndex]; if (!e) return;
    if (decision === 'accepted') {
      var f = FIELD[e.field]; var i = f.value.indexOf(e.original);
      if (i > -1) f.value = f.value.slice(0, i) + e.suggested + f.value.slice(i + e.original.length);
      counters();
    }
    S.log.push({ type: e.type, field: e.field, original: e.original, suggested: e.suggested, decision: decision, at: new Date().toISOString() });
    S.editIndex++; paintSuggestion(); save();
    if (!S.edits[S.editIndex]) setStatus(el.notesStatus, 'That is all of them.');
  }
  el.notesAsk.addEventListener('click', askNotes);
  el.accept.addEventListener('click', function () { decide('accepted'); });
  el.skip.addEventListener('click', function () { decide('skipped'); });

  /* ---------- steps ---------- */
  function validate1() {
    var ok = true;
    var c = resolveCountry(); mark(el.country, !c); showErr('tsv2-country-err', !c); ok = ok && c;
    var city = !!el.city.value.trim(); mark(el.city, !city); showErr('tsv2-city-err', !city); ok = ok && city;
    var when = !!(el.month.value && el.year.value); mark(el.year, !when); showErr('tsv2-when-err', !when); ok = ok && when;
    var b = words(el.body.value) >= 300; mark(el.body, !b); showErr('tsv2-body-err', !b); ok = ok && b; /* beta B2.2: the Worker refuses under 300 words */
    var h = !!el.headline.value.trim(); mark(el.headline, !h); showErr('tsv2-headline-err', !h); ok = ok && h;
    var x = !!el.excerpt.value.trim(); mark(el.excerpt, !x); showErr('tsv2-excerpt-err', !x); ok = ok && x;
    var p = !!(S.hero || S.pendingHero); showErr('tsv2-hero-err', !p); ok = ok && p;
    if (!ok) { var first = root.querySelector('[aria-invalid="true"], .tsv2-err:not([hidden])'); if (first && first.focus) first.focus(); else if (first) first.scrollIntoView({ block: 'center' }); }
    return ok;
  }
  function validate3() {
    var ok = true;
    showErr('tsv2-rights-err', !el.rights.checked); ok = ok && el.rights.checked;
    showErr('tsv2-charter-err', !el.charter.checked); ok = ok && el.charter.checked;
    var aff = form.querySelector('input[name=affiliateLinks]:checked'); showErr('tsv2-affiliate-err', !aff); ok = ok && !!aff;
    return ok;
  }
  function go(step) {
    S.step = step;
    root.querySelectorAll('.tsv2-panel').forEach(function (p) { p.hidden = p.getAttribute('data-step') !== String(step); });
    root.querySelectorAll('[data-step-tab]').forEach(function (t) { var n = parseInt(t.getAttribute('data-step-tab'), 10); t.classList.toggle('is-current', n === step); t.classList.toggle('is-done', n < step); });
    el.back.hidden = step === 1 || step === 'done'; el.next.hidden = step === 3 || step === 'done'; el.publish.hidden = step !== 3;
    $('tsv2-nav').hidden = step === 'done';
    if (step === 3) gate();
    var top = root.getBoundingClientRect().top + window.pageYOffset - 80; window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
    var h = root.querySelector('.tsv2-panel:not([hidden]) .tsv2-h2, .tsv2-panel:not([hidden]) .tsv2-intro, .tsv2-panel:not([hidden]) summary'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    save();
  }
  function gate() {
    member().then(function (m) {
      el.gate.hidden = !!m; el.confirm.hidden = !m; el.publish.disabled = !m;
      if (m) uploadPending().then(loadMe);
    });
  }
  el.next.addEventListener('click', function () { if (S.step === 1) { if (validate1()) go(2); } else if (S.step === 2) go(3); });
  el.back.addEventListener('click', function () { if (S.step === 3) go(2); else if (S.step === 2) go(1); });
  function openModal(kind) {
    var m = ms(); if (!m) { location.href = (kind === 'SIGNUP' ? '/signup' : '/login') + '?redirect=' + encodeURIComponent('/submit'); return; }
    m.openModal(kind).then(function () { gate(); }).catch(function () {});
  }
  el.login.addEventListener('click', function () { openModal('LOGIN'); });
  el.join.addEventListener('click', function () { openModal('SIGNUP'); });
  form.querySelectorAll('input[name=sponsored]').forEach(function (r) { r.addEventListener('change', function () { el.sponsor.hidden = form.querySelector('input[name=sponsored]:checked').value !== 'yes'; }); });

  /* ---------- publish ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (S.step !== 3) return;
    if (!validate3()) return;
    if (!resolveCountry() || !S.hero) { setStatus(el.formStatus, 'Step 1 is missing something. Go back and check.', true); return; }
    el.publish.disabled = true; setStatus(el.formStatus, 'Publishing');
    var sponsored = form.querySelector('input[name=sponsored]:checked').value === 'yes';
    var payload = {
      country: S.countryId, city: el.city.value.trim(), when: el.month.value + ' ' + el.year.value,
      body: paragraphsToHtml(el.body.value), headline: el.headline.value.trim(), excerpt: el.excerpt.value.trim(), pullQuote: el.pullquote.value.trim(),
      heroPhoto: { publicId: S.hero.publicId, originalUrl: S.hero.originalUrl, cleanedUrl: S.hero.cleanedUrl, approved: S.hero.approved },
      gallery: S.gallery.map(function (g) { return { publicId: g.publicId, originalUrl: g.originalUrl, cleanedUrl: g.cleanedUrl, approved: g.approved }; }),
      pets: S.pets, signOff: el.signoff.value.trim(), coTravelers: S.crew, coTravelersText: el.crewText.value.trim(),
      shoutOuts: S.shoutouts.filter(function (s) { return s.who && s.link; }), cost: el.cost.value.trim(), forWhom: el.forwhom.value.trim(),
      creditMode: form.querySelector('input[name=creditMode]:checked').value, sponsored: sponsored,
      sponsorName: sponsored ? el.sponsorName.value.trim() : '', sponsorUrl: sponsored ? el.sponsorUrl.value.trim() : '',
      syndication: Array.prototype.map.call(form.querySelectorAll('input[name=syndication]:checked'), function (c) { return c.value; }),
      charterAgreed: el.charter.checked, rightsAgreed: el.rights.checked,
      affiliateLinks: (form.querySelector('input[name=affiliateLinks]:checked') || {}).value === 'yes', editorNotesLog: S.log, tags: S.tags, pursuit: S.pursuit, readingTime: readingTime(el.body.value)
    };
    api('/publish', payload).then(function (r) {
      if (!r.ok) { el.publish.disabled = false; setStatus(el.formStatus, (r.data && r.data.error) || 'That did not go through. Try again, or write to hello@thatlayover.life.', true); return; }
      el.doneLink.href = r.data.url || '/stories'; clearDraft(); go('done');
      try { if (window.tllEv) window.tllEv('story_submitted', { type: 'write' }); } catch (x) {}
    }).catch(function () { el.publish.disabled = false; setStatus(el.formStatus, 'That did not go through. Try again, or write to hello@thatlayover.life.', true); });
  });

  /* ---------- wire up ---------- */
  ['country', 'city', 'month', 'year', 'body', 'headline', 'excerpt', 'pullquote', 'signoff', 'crewText', 'cost', 'forwhom'].forEach(function (k) {
    el[k].addEventListener('input', function () { counters(); if (k === 'country') resolveCountry(); save(); });
    el[k].addEventListener('change', save);
  });
  restore(); counters(); paintShoutouts(); loadPlaces();
  if (S.step && S.step !== 1 && S.step !== 'done') go(S.step); else go(1);
  var tries = 0, iv = setInterval(function () { if (ms()) { clearInterval(iv); member().then(function (m) { if (m) loadMe(); }); } else if (++tries > 40) clearInterval(iv); }, 250);
})();
