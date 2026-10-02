# 02 Two sitemap URLs return 404

| URL | What it is |
|---|---|
| `/what-were-good-at` | Parent of the four English service pages |
| `/da/det-er-vi-gode-til` | Parent of the Danish service pages |

Both sit in the page tree as parents so the navigation can group the services, but neither has a page of its own. SEO Pro still lists them in `sitemap.xml`, so Google is sent to two dead ends, and the breadcrumb on every service page links to a 404. Ahrefs flagged this on 20 Aug and again on 27 Aug 2026.

**Update 2 Oct 2026, from the Ahrefs affected-URL export.** Both URLs show 0 incoming internal links and depth 0. Nothing on the site links to them: not the navigation, not the breadcrumbs. They are sitemap-only. So option B shrinks to two toggles plus two optional redirect lines; step 3 (breadcrumbs and nav) is not needed unless a later template change adds those links. Option A is unchanged and still the better outcome for the business.

Pick one of the two options. Option A is the better one for the business. Option B is the ten-minute one.

## Option A (recommended): make the parents real overview pages

A services overview page is the page a prospect lands on when they search for the category rather than one service. It also gives the four service pages one more internal link each (the August crawl flagged 28 pages with a single internal link).

1. In the control panel, open the "What we're good at" entry in Pages. Give it a template, for example `pages/services-overview`.
2. Create `resources/views/pages/services-overview.antlers.html`. It needs no new copy. It lists the children with the intro text each service page already has:

   ```antlers
   {{ layout:default }}
   <main id="content">
     <h1>{{ title }}</h1>
     <ul class="service-list">
       {{ children }}
       <li>
         <h2><a href="{{ url }}">{{ title }}</a></h2>
         {{ if seo:description }}<p>{{ seo:description }}</p>{{ /if }}
       </li>
       {{ /children }}
     </ul>
   </main>
   ```

   If the service pages have an `intro` or `summary` field, print that instead of `seo:description`.

3. Do the same for the Danish entry "Det er vi gode til" (it can share the template).
4. Clear the static cache. Both URLs now return 200 and the sitemap is correct with no further change.

## Option B: keep them as grouping labels only

1. Open each of the two entries in the control panel, SEO section, and switch off **Include in sitemap**. (In the entry file this lands as `sitemap: false` under the `seo` key.)
2. Add a redirect so anyone who reaches the parent URL lands on the first service instead of a 404. In `routes/web.php`, above any other routes:

   ```php
   Route::redirect('/what-were-good-at', '/what-were-good-at/transfer-pricing', 301);
   Route::redirect('/da/det-er-vi-gode-til', '/da/det-er-vi-gode-til/transfer-pricing', 301);
   ```

3. Only if something links to the parents (as of 2 Oct 2026 nothing does), point the breadcrumb and the main navigation at the first child. In the breadcrumb partial:

   ```antlers
   <nav aria-label="Breadcrumb">
     <ol class="breadcrumb">
       {{ nav:breadcrumbs }}
         {{ crumb_url = url }}
         {{# Parents that are only grouping labels: link to their first child #}}
         {{ if slug == 'what-were-good-at' || slug == 'det-er-vi-gode-til' }}
           {{ children limit="1" }}{{ crumb_url = url }}{{ /children }}
         {{ /if }}
         <li>
           {{ if is_current }}
             <span aria-current="page">{{ title }}</span>
           {{ else }}
             <a href="{{ crumb_url }}">{{ title }}</a>
           {{ /if }}
         </li>
       {{ /nav:breadcrumbs }}
     </ol>
   </nav>
   ```

   In the navigation partial, the same two entries should link to `{{ children limit="1" }}{{ url }}{{ /children }}` rather than their own `{{ url }}`.

4. Clear the static cache and confirm `sitemap.xml` no longer lists either URL.

## Either way, afterwards

- Resubmit `https://42tax.com/sitemap.xml` in Search Console so the two errors clear.
- Check the two orphan pages from the August crawl while in the templates. An orphan page has no internal link pointing at it; the overview page from Option A is the natural place to link them if they are service related.
