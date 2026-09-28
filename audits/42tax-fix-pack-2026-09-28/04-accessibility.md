# 04 Accessibility: four template fixes

All four are template edits in `resources/views/`. None change the design.

## 1. Name the logo link

The header logo is an inline SVG inside a link with no text, so assistive technology announces it as "link" and nothing more.

Before (shape of the current markup):

```html
<a href="/"><svg …>…</svg></a>
```

After:

```antlers
<a href="{{ site:url }}" aria-label="{{ if site:short_locale == 'da' }}42TAX forside{{ else }}42TAX home{{ /if }}">
  <svg aria-hidden="true" focusable="false" …>…</svg>
</a>
```

`aria-hidden` on the SVG stops it being read twice; `focusable="false"` stops old Edge from tabbing into it. If the SVG already has a `<title>` element, remove it so the label is the only name.

## 2. The empty `.toggle` link

The mobile menu control is an `<a class="toggle" href="#"></a>` with no content. It is a button, not a link, and it has no name. Replace it with a real button and keep the class so the existing JavaScript keeps working:

```antlers
<button type="button" class="toggle" aria-controls="main-nav" aria-expanded="false"
        aria-label="{{ if site:short_locale == 'da' }}Åbn menu{{ else }}Open menu{{ /if }}">
  <span class="toggle__bar" aria-hidden="true"></span>
  <span class="toggle__bar" aria-hidden="true"></span>
  <span class="toggle__bar" aria-hidden="true"></span>
</button>
```

Give the `<nav>` the id `main-nav`. In the JavaScript that opens the menu, flip `aria-expanded` and the label:

```js
var toggle = document.querySelector('.toggle');
var nav = document.getElementById('main-nav');
var isDa = document.documentElement.lang.indexOf('da') === 0;
toggle.addEventListener('click', function () {
  var open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
  toggle.setAttribute('aria-label', open ? (isDa ? 'Åbn menu' : 'Open menu') : (isDa ? 'Luk menu' : 'Close menu'));
  nav.classList.toggle('is-open');
});
```

If the current script calls `event.preventDefault()` because the element was a link, that line can go. If the design cannot use a `<button>` for CSS reasons, the minimum fix is `role="button"`, `aria-label`, and `aria-expanded` on the existing link.

## 3. Visible labels on the contact form

The contact form fields rely on placeholder text. Placeholders vanish when the visitor starts typing, fail contrast, and are not read as labels by every screen reader. Each field needs a `<label>` tied to its input.

Statamic's form tag makes this simple. The `display` value comes from the form blueprint, so the label is whatever the control panel already calls the field, in the right language for each site:

```antlers
{{ form:contact }}
  {{ if success }}
    <p class="form__success" role="status">{{ success }}</p>
  {{ /if }}

  {{ fields }}
    <div class="form__field{{ if error }} form__field--error{{ /if }}">
      <label for="contact-{{ handle }}">{{ display }}</label>
      {{ field }}
      {{ if error }}<p class="form__error" id="contact-{{ handle }}-error">{{ error }}</p>{{ /if }}
    </div>
  {{ /fields }}

  <button type="submit">{{ if site:short_locale == 'da' }}Send{{ else }}Send{{ /if }}</button>
{{ /form:contact }}
```

Two details to make the `for` attribute match:

- In the form blueprint, each field's fieldtype config can carry an `id`. If it does not, set it in the template by rendering the inputs by hand instead of `{{ field }}`:

  ```antlers
  <input type="{{ input_type ?? 'text' }}" id="contact-{{ handle }}" name="{{ handle }}"
         value="{{ old }}"
         {{ if error }}aria-invalid="true" aria-describedby="contact-{{ handle }}-error"{{ /if }}>
  ```

- Add `required` and `aria-required="true"` on the inputs the form blueprint validates as required (name, email, message), so browsers and screen readers announce it before submit.
- Add `autocomplete` on the obvious ones: `name`, `email`, `tel`, `organization`. Phones fill them in and fewer people abandon the form.

Keep the placeholders if the design wants them, but as hints, not as the only label.

## 4. "Read more" and "Læs mere" become the article title

On the insights listing every card ends with the same link text. A screen reader user tabbing through hears "Read more, Read more, Read more" with no way to tell the articles apart, and search engines get no anchor text.

Before (shape of the current markup):

```antlers
{{ collection:what_we_think }}
  <article class="card">
    <h2>{{ title }}</h2>
    <a href="{{ url }}">Read more</a>
  </article>
{{ /collection:what_we_think }}
```

After. The heading is the link, and "Read more" stays as a purely visual cue if the design wants it:

```antlers
{{ collection:what_we_think }}
  <article class="card">
    <h2 class="card__title"><a href="{{ url }}">{{ title }}</a></h2>
    <span class="card__more" aria-hidden="true">{{ if site:short_locale == 'da' }}Læs mere{{ else }}Read more{{ /if }}</span>
  </article>
{{ /collection:what_we_think }}
```

If the whole card must be clickable, wrap the card in the link and keep the title as the first text inside it. Never add a second link with generic text.

## How to check

Run the axe browser extension, or Lighthouse's Accessibility audit, on `/`, `/about/contact`, `/what-we-think` and one team page, before and after. The four issues above should drop out of the "links must have discernible text", "form elements must have labels" and "buttons must have discernible text" rules.
