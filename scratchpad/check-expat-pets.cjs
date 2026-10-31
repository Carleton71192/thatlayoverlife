const { chromium } = require('playwright');
const fs = require('fs');
const bundle = ['tll-album-v1','tll-series-v1','tll-expat-v1','tll-pet-passport-v1'].map((f) => fs.readFileSync(`src/site-layers/${f}.js`, 'utf8')).join('\n');
const J = (b) => ({ contentType: 'application/json', body: JSON.stringify(b) });
const card = (slug, label, title) => ({ slug, label, title, image: '', series: 'x' });
const data = {
  '/series?group=expat': { ok: true, series: [{ slug: 'the-first-friend', name: 'The First Friend', stories: [card('cph-friend', 'The First Friend · Copenhagen', 'The running club that finally worked')] }, { slug: 'moving-back', name: 'Moving Back', stories: [] }] },
  '/series?group=pets': { ok: true, series: [{ slug: 'cats-who-travel', name: 'Cats Who Travel', stories: [card('cat', 'Cats Who Travel · Malmö', 'Under the bed in three countries')] }] },
  '/living-library': { ok: true, books: [{ slug: 'ana', name: 'Ana', avatar: '', homeCity: 'Copenhagen', years: '2019–now', knowsWell: ['Nørrebro bakeries', 'Winter swimming'], languages: ['English', 'Portuguese'], interests: ['Marathons'], stories: [{ slug: 'x', title: 'My first Danish winter' }] }, { slug: 'ben', name: 'Ben', avatar: '', homeCity: '', years: '', knowsWell: [], languages: ['English'], interests: [], stories: [] }] },
  '/album?slug=nancy': { ok: true, name: 'Nancy', model: 'seven', homes: { total: 3, perContinent: { europe: 1, 'north-america': 1, 'south-america': 1 }, places: [{ c: 'br', years: '2012–2015' }, { c: 'us', years: '1990–2012' }], badges: ['first-move-abroad', 'lived-on-two-continents'] }, moves: [{ c: 'us', years: '1990–2012', line: '', img: '' }, { c: 'br', years: '2012–2015', line: 'The moving boxes won.', img: '' }], continents: [] },
  '/pets/public?slug=magnus': { ok: true, name: 'Magnus Waffles', slug: 'magnus', avatar: '', homeCity: 'Copenhagen', forever: false, countries: ['Denmark', 'Germany', 'Sweden'], count: 3, firsts: [{ k: 'ferry', label: 'First ferry', where: 'Helsingør', when: 'May 2025' }, { k: 'snow', label: 'First snow', where: 'Sweden', when: 'January 2026' }], pursuit: { label: 'Beaches sniffed', count: 9, countries: ['dk', 'se'] }, owner: { name: 'Nancy Carleton', slug: 'nancy' }, stories: [], album: [] },
  '/pets/featured': { ok: true, pets: [{ name: 'Magnus Waffles', slug: 'magnus', avatar: 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==', count: 3 }] },
  '/pets/notes': { ok: true, notes: [{ story: 'cat', pet: 'Mochi', box: { stayedAt: 'Hotel Example', city: 'Malmö', welcoming: 'A water bowl at check-in and nobody sighed.', when: 'September 2026' } }] },
  '/pros': { ok: true, pros: [] },
  '/series/story?slug=cat': { ok: true, series: 'cats-who-travel', group: 'pets', label: 'Cats Who Travel · Malmö', fields: { carrier: 'Carrier, then harness on day two', hid: 'Under every bed available', when: 'September 2026' }, safetyNote: '', tripKit: [], sponsor: null, petBox: { stayedAt: 'Hotel Example', city: 'Malmö', url: 'https://hotel.example', rel: 'nofollow ugc noopener', paid: 'Nothing extra', sizeRule: 'Under 10 kg', welcoming: 'A water bowl at check-in.', tell: 'Ask for a ground floor room.', when: 'September 2026' } },
};
const posts = { '/album/settings': { ok: true, showHomeBase: false, coffee: true, moves: true, movedBack: false, moveLines: {}, desks: [{ c: 'us', years: '1990–2012' }, { c: 'dk', years: '2019–now', now: true }] },
  '/pets/mine': { ok: true, pets: [{ id: 'p1', slug: 'magnus', name: 'Magnus Waffles', homeCity: 'Copenhagen', birthdayMonth: 4, status: 'traveling', visibility: 'public', firsts: [{ k: 'ferry', label: 'First ferry', where: 'Helsingør', when: 'May 2025' }], pursuitLabel: 'Beaches sniffed', pursuitCount: 9, pursuitCountries: 'dk,se' }] } };
const pages = [
  ['/for-expats?preview=expat', '<main><section><h1>For Expats</h1></section></main>'],
  ['/contributors/nancy?preview=expat', '<main><section><h1>Nancy Carleton</h1><div data-pf5="stats" style="display:flex;gap:24px"><div><div class="pf5-stat-v">52</div><div class="pf5-stat-k">COUNTRIES</div></div></div></section></main>'],
  ['/edit-profile?preview=expat', '<main><div id="tll-col">collections</div></main>'],
  ['/pets/magnus?preview=pets', '<main><section><h1>Magnus Waffles</h1></section></main>'],
  ['/the-paw-passport?preview=pets', '<main><section><h1>The Paw Passport</h1></section></main>'],
  ['/my-pets?preview=pets', '<main><section><h1>Your Paw Passport</h1></section></main>'],
  ['/stories/cat', '<main><h1>Under the bed in three countries</h1><div class="tll-body"><p>Story.</p></div></main>'],
];
(async () => {
  const b = await chromium.launch();
  for (const w of [390, 1440]) for (const [path, html] of pages) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.route('**/*', (r) => {
      const u = new URL(r.request().url());
      if (u.hostname === 'www.thatlayover.life') return r.fulfill({ contentType: 'text/html; charset=utf-8', body: '<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width"></head><body style="margin:0;font-family:sans-serif">' + html + '<script>window.$memberstackDom={getMemberCookie:()=>"tok"};<\/script><script>' + bundle + '<\/script></body></html>' });
      const k = u.pathname + u.search.replace(/&member=1$/, '');
      if (r.request().method() === 'POST') return r.fulfill(J(posts[u.pathname] || { ok: true }));
      if (data[k]) return r.fulfill(J(data[k]));
      if (data[u.pathname]) return r.fulfill(J(data[u.pathname]));
      return r.fulfill({ status: 404, body: '' });
    });
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto('https://www.thatlayover.life' + path); await p.waitForTimeout(2600);
    const name = path.split('?')[0].replace(/\//g, '_') + '_' + w + '.png';
    await p.screenshot({ path: 'scratchpad/shots-1031/' + name, fullPage: true });
    console.log(name, 'scrollW', await p.evaluate(() => document.documentElement.scrollWidth), errs.join(' | '));
  }
  await b.close();
})();
