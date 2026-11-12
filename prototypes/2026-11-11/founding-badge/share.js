/* That Layover Life: founding badge share step (prototype, 11 Nov 2026).
   A web page cannot post an image into Instagram Stories or attach one to an X post through a link. What it can do:
     1. on phones (and some desktops), hand the image file to the system share sheet, where the member picks Instagram or X;
     2. otherwise, save the image, copy the caption, and open X with the caption and link already typed.
   Every path is feature detected. When the page sits in a sandboxed frame (downloads, share and popups refused), the
   finished image stays on the page with "Press and hold, or right-click, to save the image", and copy caption still works.
   Works as window.TLLShare in a page and as module.exports in node (pure parts only). No network calls of its own. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TLLShare = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* The referral link. A plain query the site's analytics can count, with nothing in it about the member. */
  var REF_URL = 'https://www.thatlayover.life/?ref=badge';
  var X_INTENT = 'https://twitter.com/intent/tweet';
  var SAVE_HINT = 'Press and hold, or right-click, to save the image';

  /* ---------- pure helpers ---------- */

  /* Default caption, one or two sentences, no hashtags. The member can rewrite it before sharing.
     info = { design, name, number ('042' or ''), cap (100 or null), places (count, pet only) } */
  function buildCaption(info) {
    var i = info || {};
    var num = i.number ? 'No. ' + i.number + (i.cap && i.design !== 'paw' ? ' of ' + i.cap : '') : '';
    if (i.design === 'paw') {
      var pet = String(i.name || '').trim() || 'My travel pet';
      var first = num ? pet + ' is founding pet ' + num + ' at That Layover Life' : pet + ' has a Paw Passport at That Layover Life';
      if (i.places > 0) first += ', with ' + i.places + (i.places === 1 ? ' country' : ' countries') + ' on the record';
      return first + '. The travel magazine written by the people who took the trips, and their pets.';
    }
    if (num) return 'Founding member ' + num + ' at That Layover Life. A travel magazine written by the people who took the trips.';
    return 'I joined That Layover Life, a travel magazine written by the people who took the trips.';
  }

  /* What "Copy caption" puts on the clipboard: the caption, then the link on its own line (unless the member already kept it). */
  function captionWithLink(caption, url) {
    var c = String(caption || '').trim(), u = url || REF_URL;
    if (!c) return u;
    return c.indexOf(u) >= 0 ? c : c + '\n' + u;
  }

  /* The caption without the link, for targets that take the link separately (X intent, the share sheet). */
  function stripLink(caption, url) {
    var u = url || REF_URL;
    return String(caption || '').split(u).join(' ').replace(/[ \t]+\n/g, '\n').replace(/\n{2,}/g, '\n').replace(/[ \t]{2,}/g, ' ').trim();
  }

  /* https://twitter.com/intent/tweet?text=...&url=... with both parts percent-encoded. X adds the link after the text. */
  function xIntentUrl(caption, url) {
    var u = url || REF_URL;
    return X_INTENT + '?text=' + encodeURIComponent(stripLink(caption, u)) + '&url=' + encodeURIComponent(u);
  }

  /* ---------- environment ---------- */

  function isFramed(win) {
    try { return win.self !== win.top; } catch (e) { return true; }
  }

  /* Is a feature allowed for this document by the frame's permissions policy? Unknown counts as allowed;
     the call itself then tells us. */
  function policyAllows(doc, feature) {
    try {
      var p = doc.permissionsPolicy || doc.featurePolicy;
      if (p && p.allowsFeature) return p.allowsFeature(feature);
    } catch (e) { /* ignore */ }
    return true;
  }

  /* In-app browsers (Instagram, Facebook, X, LinkedIn, TikTok) often drop downloads and the share sheet without saying so. */
  function isInAppBrowser(ua) {
    return /Instagram|FBAN|FBAV|FB_IAB|Twitter|LinkedInApp|BytedanceWebview|musical_ly|Line\//i.test(String(ua || ''));
  }

  function fileFromBlob(blob, name, win) {
    try { return new win.File([blob], name, { type: 'image/png' }); } catch (e) { return null; }
  }

  /* What this browser, in this frame, can be asked to do. Nothing here performs an action. */
  function capabilities(win, file) {
    var nav = win.navigator, doc = win.document;
    var framed = isFramed(win);
    var shareFiles = false;
    if (file && nav.share && nav.canShare && policyAllows(doc, 'web-share')) {
      try { shareFiles = nav.canShare({ files: [file] }); } catch (e) { shareFiles = false; }
    }
    var a = doc.createElement('a');
    var inApp = isInAppBrowser(nav.userAgent);
    return {
      framed: framed,
      inApp: inApp,
      shareFiles: shareFiles,
      /* A framed page (the private artifact view is a sandboxed frame) or an in-app browser drops downloads without telling
         the page, so no Save button is offered there: the image stays on the page to press and hold, or right-click. */
      download: 'download' in a && !framed && !inApp,
      clipboard: !!(nav.clipboard && nav.clipboard.writeText) && policyAllows(doc, 'clipboard-write')
    };
  }

  /* ---------- actions (each from a click handler) ---------- */

  /* Resolves { ok, outcome }: 'shared' | 'canceled' | 'refused' | 'unsupported'. Never throws. */
  function shareImage(win, file, caption, url) {
    var nav = win.navigator, u = url || REF_URL;
    if (!file || !nav.share || !nav.canShare) return Promise.resolve({ ok: false, outcome: 'unsupported' });
    var text = stripLink(caption, u);
    var tries = [{ files: [file], text: text, url: u }, { files: [file], text: captionWithLink(text, u) }, { files: [file] }];
    var payload = null;
    for (var i = 0; i < tries.length && !payload; i++) {
      try { if (nav.canShare(tries[i])) payload = tries[i]; } catch (e) { /* try the next */ }
    }
    if (!payload) return Promise.resolve({ ok: false, outcome: 'unsupported' });
    try {
      return nav.share(payload).then(function () { return { ok: true, outcome: 'shared' }; }, function (err) {
        var n = err && err.name;
        if (n === 'AbortError') return { ok: false, outcome: 'canceled' }; /* the member closed the sheet: not an error */
        return { ok: false, outcome: n === 'NotAllowedError' || n === 'SecurityError' ? 'refused' : 'unsupported', error: n || String(err) };
      });
    } catch (e) {
      return Promise.resolve({ ok: false, outcome: 'refused', error: e && e.name });
    }
  }

  /* Starts a download of the PNG. A sandboxed frame without allow-downloads drops it silently, and no browser
     reports that back to the page, so the caller shows the save hint whenever the page is framed. */
  function saveImage(win, blobUrl, fileName) {
    try {
      var a = win.document.createElement('a');
      a.href = blobUrl; a.download = fileName; a.rel = 'noopener';
      a.style.display = 'none';
      win.document.body.appendChild(a);
      a.click();
      win.setTimeout(function () { a.remove(); }, 0);
      return { ok: true, outcome: 'started' };
    } catch (e) {
      return { ok: false, outcome: 'refused', error: e && e.name };
    }
  }

  /* Clipboard API first, then the older copy command, then hand the text to the member selected. */
  function copyText(win, text, fallbackField) {
    var nav = win.navigator, doc = win.document;
    function legacy() {
      var ok = false, ta = doc.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
      doc.body.appendChild(ta);
      try { ta.select(); ok = doc.execCommand && doc.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      if (ok) return { ok: true, outcome: 'copied', method: 'execCommand' };
      if (fallbackField) { try { fallbackField.focus(); fallbackField.select(); } catch (e) { /* ignore */ } }
      return { ok: false, outcome: 'refused' };
    }
    try {
      if (nav.clipboard && nav.clipboard.writeText) {
        return nav.clipboard.writeText(text).then(function () { return { ok: true, outcome: 'copied', method: 'clipboard' }; }, function () { return legacy(); });
      }
    } catch (e) { /* fall through */ }
    return Promise.resolve(legacy());
  }

  /* Opens X in a new tab. A refused popup returns null, which a plain link could not tell us. */
  function openX(win, caption, url) {
    var href = xIntentUrl(caption, url), w = null;
    try { w = win.open(href, '_blank'); } catch (e) { w = null; }
    if (w) { try { w.opener = null; } catch (e) { /* ignore */ } return { ok: true, outcome: 'opened', href: href }; }
    return { ok: false, outcome: 'refused', href: href };
  }

  /* ---------- the share step UI ----------
     els: { caption, share, shareNote, save, saveNote, copy, x, xNote, hint, status }
     opts: { win, getResult() -> { blob, url, fileName, design, format }, onEvent(name, props) } */
  function attach(els, opts) {
    var win = opts.win || window;
    var emit = opts.onEvent || function () {};
    function say(msg) { if (els.status) els.status.textContent = msg; }
    function showHint() { if (els.hint) els.hint.hidden = false; }
    function props(method) { var r = opts.getResult() || {}; return { method: method, design: r.design, format: r.format }; }

    /* Called each time a new image is ready: decides which buttons to show. */
    function refresh() {
      var r = opts.getResult();
      if (!r) return;
      var file = fileFromBlob(r.blob, r.fileName, win);
      var cap = capabilities(win, file);
      r.file = file;
      els.share.hidden = !cap.shareFiles;
      if (els.shareNote) els.shareNote.hidden = !cap.shareFiles;
      els.save.hidden = !cap.download;
      if (els.saveNote) els.saveNote.hidden = !cap.download;
      els.x.href = xIntentUrl(els.caption.value);
      if (els.hint) els.hint.hidden = !(cap.framed || cap.inApp || !cap.download);
      say('');
      return cap;
    }

    els.caption.addEventListener('input', function () { els.x.href = xIntentUrl(els.caption.value); });

    els.share.addEventListener('click', function () {
      var r = opts.getResult();
      if (!r || !r.file) return;
      say('Opening the share sheet.');
      shareImage(win, r.file, els.caption.value).then(function (res) {
        if (res.outcome === 'shared') { say('Sent to the app you picked.'); emit('badge_shared', props('share_sheet')); }
        else if (res.outcome === 'canceled') say('Nothing was shared.');
        else {
          els.share.hidden = true; if (els.shareNote) els.shareNote.hidden = true; showHint();
          say(res.outcome === 'refused' ? 'This page is not allowed to open the share menu here. ' + SAVE_HINT + ' above.' : 'The share menu could not take the image here. ' + SAVE_HINT + ' above.');
        }
      });
    });

    els.save.addEventListener('click', function () {
      var r = opts.getResult();
      if (!r) return;
      var res = saveImage(win, r.url, r.fileName);
      if (res.ok) {
        emit('badge_shared', props('download'));
        if (isFramed(win) || isInAppBrowser(win.navigator.userAgent)) { showHint(); say('If no file arrived, this browser blocked the download. ' + SAVE_HINT + ' above.'); }
        else say('Download started: ' + r.fileName + '.');
      } else { showHint(); say('This page cannot save files here. ' + SAVE_HINT + ' above.'); }
    });

    els.copy.addEventListener('click', function () {
      var text = captionWithLink(els.caption.value);
      copyText(win, text, els.caption).then(function (res) {
        if (res.ok) { say('Caption copied, with the link.'); emit('badge_shared', props('copy_caption')); }
        else say('Copying is blocked here. The caption is selected: press Ctrl+C, or Cmd+C on a Mac.');
      });
    });

    els.x.addEventListener('click', function (e) {
      e.preventDefault();
      var res = openX(win, els.caption.value);
      if (res.ok) { say('X opened in a new tab with your caption and the link. Attach the image you saved.'); emit('badge_shared', props('x_intent')); }
      else { els.x.hidden = true; if (els.xNote) els.xNote.hidden = true; say('This page cannot open a new tab here. Copy the caption, then post it on X yourself.'); }
    });

    return { refresh: refresh };
  }

  return {
    REF_URL: REF_URL, X_INTENT: X_INTENT, SAVE_HINT: SAVE_HINT,
    buildCaption: buildCaption, captionWithLink: captionWithLink, stripLink: stripLink, xIntentUrl: xIntentUrl,
    isFramed: isFramed, isInAppBrowser: isInAppBrowser, policyAllows: policyAllows, capabilities: capabilities,
    shareImage: shareImage, saveImage: saveImage, copyText: copyText, openX: openX, attach: attach
  };
});
