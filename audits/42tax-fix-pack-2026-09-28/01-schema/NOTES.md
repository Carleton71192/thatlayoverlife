# 01 Structured data (JSON-LD) for 42tax.com

Three Antlers partials plus one global set. Everything they output is already on the site or on the Google Business Profile. Nothing is typed into the templates by hand.

## Files in this folder

| Path | What it is |
|---|---|
| `resources/views/partials/schema/professional-service.antlers.html` | ProfessionalService node, site-wide, one per page |
| `resources/views/partials/schema/person.antlers.html` | Person node for each team page |
| `resources/views/partials/schema/article.antlers.html` | Article node for each What we think entry |
| `resources/blueprints/globals/company.yaml` | Blueprint for a new "Company" global set |
| `content/globals/company.yaml` | The global set |
| `content/globals/en/company.yaml` | The values (English site) |
| `content/globals/da/company.yaml` | Danish site inherits the English values (`origin: en`) |

## Where each partial goes

1. **Layout** (`resources/views/layout.antlers.html` or wherever `{{ seo_pro:meta }}` lives). Add directly after it, inside `<head>`:

   ```antlers
   {{ seo_pro:meta }}
   {{ partial:schema/professional-service }}
   ```

2. **Team entry template** (the template that renders `/who-we-are/<name>` and `/da/hvem-vi-er/<navn>`). Add anywhere inside the template:

   ```antlers
   {{ partial:schema/person }}
   ```

3. **Article entry template** (the template that renders `/what-we-think/<slug>`). Add anywhere inside the template:

   ```antlers
   {{ partial:schema/article }}
   ```

If the developer prefers one include, this dispatcher in the layout does the same job. Replace `team` and `what_we_think` with the real collection handles from `content/collections/`:

```antlers
{{ partial:schema/professional-service }}
{{ if collection:handle == 'team' }}{{ partial:schema/person }}{{ /if }}
{{ if collection:handle == 'what_we_think' }}{{ partial:schema/article }}{{ /if }}
```

## Before it ships: four checks

1. **Field handles.** `person.antlers.html` expects `job_title`, `image`, `email`, `linkedin` on the team blueprint. `article.antlers.html` expects `date` and, optionally, `author`. Rename in the partial to match the blueprint. Use the same field that prints the job title on the page so the schema never says something different from the visible text.
2. **LinkedIn.** `linkedin_url` is empty on purpose. Paste the URL the footer links to. The partial skips `sameAs` while the field is empty, so nothing breaks in the meantime.
3. **Logo.** The header logo is an inline SVG, which search engines will not use. Upload a PNG (the 720x720 tagline logo prepared for the Business Profile works) to the assets container and pick it in Globals > Company > Logo.
4. **Address text on the site.** The schema says Bredgade 6, 1260 København K. The footer and the contact page must say the same thing. Google still shows the old Højbro Plads 10 address in its snippet of the contact page, so confirm the live text was updated and the static cache cleared.

## How to validate

Open one page of each type in the Rich Results Test (search.google.com/test/rich-results) or validator.schema.org. Expect one ProfessionalService on every page, one Person on a team page, one Article on an insight. No errors. Warnings about optional fields (such as `priceRange`) can be ignored.

## Why `to_json`

Every value passes through `| to_json`, which adds the quotes and escapes anything a partner's name or a headline might contain (apostrophes, quotes, slashes). Never wrap those values in extra quotes.

## Why an `@id`

The organization node carries `@id: https://42tax.com/#organization`. The Person and Article nodes point at that same `@id` in `worksFor` and `publisher`, so search engines connect the four partners and every article to one entity instead of four loose copies of the company.
