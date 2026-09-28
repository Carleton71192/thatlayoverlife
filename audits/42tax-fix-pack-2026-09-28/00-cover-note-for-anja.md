# What this round of website changes does for 42TAX

Prepared by The Brand Collective, 28 Sep 2026. For Anja Kirk.

Nothing in this pack is live. It is a set of instructions for the developer, plus this note. You approve, they apply, we check.

Every change below has the same goal: when a finance lead or a CFO looks for a transfer pricing adviser in Copenhagen, on Google or by asking an AI assistant, 42TAX should come up, look right, and be easy to contact.

## 1. A machine-readable business card on every page

Search engines and AI assistants read a hidden block on each page that says, in a format they trust, who you are: the firm name, the Bredgade address, the country you serve, your LinkedIn page, each partner and their title, and each article with its author and date. Today that block does not exist, so Google has to guess, and AI assistants have nothing to quote.

For clients: the firm shows up as one clear entity with the right address, and your articles can be cited with a partner's name attached. The developer fills in a small settings form; no facts are typed into code.

## 2. Two dead links in the site map

The site tells Google about two pages that do not exist: the English and Danish "What we're good at" parents. Google treats dead links as a sign of neglect. We either give those two addresses a short overview page (better, because it becomes a landing page for "transfer pricing services") or take them out of the map and send anyone who lands there to the transfer pricing page.

For clients: fewer dead ends, and a page that lists all four things you do in one place.

## 3. The cookie banner

Three small things. English visitors currently get a Danish banner. On phones it covers the whole screen before anyone has read a word. And the "show details" control has no name for people using a screen reader. All three are settings in Cookie Information, the tool you already pay for, plus one line in the site template.

For clients: an English-speaking prospect on a phone sees your headline, not a wall of Danish cookie text.

## 4. Four accessibility fixes

The logo link, the menu button, the contact form fields and the "Read more" links all lack the labels that screen readers and keyboard users depend on. The fixes are invisible to sighted visitors. The "Read more" change also helps search: each link will carry the article's title instead of the same two words forty times.

For clients: anyone can use the contact form, and every article link tells Google what the article is about.

## 5. Page titles

Right now every page title starts with "42TAX (en)" or "42TAX (da)", which is a language code sitting in the most valuable line of text on the site. Article titles also run so long that Google cuts them off. We set the site name to "42TAX", cap article titles so they display in full, and give the Danish contact page a Danish title. We also remove a leftover copy of the homepage at /42tax so Google stops seeing the same page twice.

For clients: search results read "Transfer pricing documentation | 42TAX" rather than "42TAX (en) / ...", and Danish searchers see Danish.

## What we need from you

- Confirm the LinkedIn company page address, so it can go into the business card block.
- Tell us who has the Cookie Information login.
- Decide on item 2: overview pages or plain redirects. We recommend overview pages.

Everything else the developer can do from the pack. Expect about half a day of their time.
