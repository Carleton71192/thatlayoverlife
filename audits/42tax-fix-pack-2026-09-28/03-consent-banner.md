# 03 Consent banner: language, mobile size, and the expand control

## Which tool this is

The site runs **Cookie Information** (cookieinformation.com), a Danish consent management platform. It is loaded in the layout `<head>` as:

```html
<script id="CookieConsent" src="https://policy.app.cookieinformation.com/uc.js"
        data-culture="DA" data-gcm-version="2.0"></script>
```

`data-gcm-version="2.0"` means Google Consent Mode v2 is on, which is correct. The `coi-` prefix on the banner's element ids (for example `#coi-expand`) is Cookie Information's markup.

## Where the settings live

| Setting | Where |
|---|---|
| Which language the banner shows | The `data-culture` attribute on the script tag in the layout (developer), AND the language must be enabled for the domain in the Cookie Information platform (app.cookieinformation.com, log in as the account owner) under the domain's **Banner** settings, languages / texts |
| Banner layout (bottom bar, corner card, or full overlay) | Cookie Information platform, domain > Banner > **Pop-up appearance**, template choice |
| Banner HTML and CSS (where `#coi-expand` is defined) | Cookie Information platform, domain > Banner > Pop-up appearance > **Advanced options** |
| Cookie policy pages | Statamic entries, one per site |

Who holds the Cookie Information login is not recorded in our files. Ask Anja; it is most likely the developer who set up the site.

## Fix 1: English text on English pages

The script hard-codes Danish. Make it follow the site:

```antlers
<script id="CookieConsent" src="https://policy.app.cookieinformation.com/uc.js"
        data-culture="{{ site:short_locale | upper }}" data-gcm-version="2.0"></script>
```

`site:short_locale` is `en` on the English site and `da` on the Danish site, so the attribute becomes `EN` or `DA`. Then, in the Cookie Information platform, make sure English is enabled for 42tax.com and that the English texts (headline, description, button labels, category names) are filled in. If English is not enabled there, the banner falls back to Danish regardless of the attribute.

Test: open `https://42tax.com/` in a private window. The banner should be in English. Open `https://42tax.com/da/`. Danish.

## Fix 2: not full-screen on mobile

The current template is one of Cookie Information's overlay templates, which fill the viewport on phones. Two ways to fix it, pick one:

**Preferred:** in Pop-up appearance, switch the template to a bottom bar or a compact card. No code.

**If the template must stay:** add this to the custom CSS field under Advanced options (or to the site stylesheet, loaded after the banner). Confirm the selectors in the browser inspector first; Cookie Information templates vary.

```css
@media (max-width: 767px) {
  #coiOverlay,
  .coi-banner__wrapper {
    top: auto;
    bottom: 0;
    height: auto;
    max-height: 70vh;
    overflow-y: auto;
  }
}
```

Test on a 390px wide viewport: the page headline should remain visible above the banner, and the banner must scroll internally if it is taller than the space it has.

## Fix 3: an accessible name on `#coi-expand`

`#coi-expand` is the control that opens the detailed cookie settings. It has an icon but no text, so a screen reader announces it as "link" with nothing else. In the banner HTML (Advanced options), give it a name and the right role:

```html
<a id="coi-expand" href="#" role="button" aria-expanded="false"
   aria-label="Show cookie settings">…</a>
```

Danish: `aria-label="Vis cookieindstillinger"`.

If Cookie Information uses one HTML template for both languages and the label cannot be switched inside the platform, set it from the site instead. Add this to the layout, after the banner script:

```html
<script>
(function () {
  var label = document.documentElement.lang.indexOf('da') === 0
    ? 'Vis cookieindstillinger'
    : 'Show cookie settings';
  var observer = new MutationObserver(function () {
    var el = document.getElementById('coi-expand');
    if (el && !el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', label);
      el.setAttribute('role', 'button');
      el.setAttribute('aria-expanded', 'false');
      el.addEventListener('click', function () {
        el.setAttribute('aria-expanded', el.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
      });
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
</script>
```

This relies on `<html lang="da">` on the Danish site, which SEO Pro already sets.

## One thing to verify while in there

Open the site in a private window with the Network tab open and do not touch the banner. No request to `google-analytics.com` or `googletagmanager.com/collect` should fire before consent. If one does, consent is decorative and the GTM tags need consent triggers. This was flagged in July and never confirmed.
