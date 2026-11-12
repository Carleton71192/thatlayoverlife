/* Tests for the pure parts of badge.js and share.js. Run: node test.cjs
   Number formatting, coordinate rounding and formatting (S, W, the antimeridian), dates, pen names,
   caption building and URL encoding, and the layout math for the three formats with a stand-in text measurer. */
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
/* Loaded as plain scripts: the repo's package.json says "type": "module", which would make require() treat them as ES modules. */
function load(f) { const m = { exports: {} }; new Function('module', 'exports', fs.readFileSync(path.join(__dirname, f), 'utf8'))(m, m.exports); return m.exports; }
const B = load('badge.js');
const S = load('share.js');

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; }
  catch (e) { failed++; console.log('FAIL ' + name + '\n  ' + (e && e.message)); }
}

/* ---------- founding number ---------- */
t('number pads to three digits', () => {
  assert.strictEqual(B.formatNumber(42), '042');
  assert.strictEqual(B.formatNumber(1), '001');
  assert.strictEqual(B.formatNumber(100, 100), '100');
  assert.strictEqual(B.formatNumber('7'), '007');
  assert.strictEqual(B.formatNumber(' 12 '), '012');
  assert.strictEqual(B.formatNumber(1000), '1000');
});
t('number refuses what is not a real number', () => {
  for (const v of [0, -1, 4.5, NaN, Infinity, '', '4a', null, undefined, '1e2', {}]) assert.strictEqual(B.formatNumber(v), '', String(v));
});
t('number above the cap is not drawn', () => {
  assert.strictEqual(B.formatNumber(101, 100), '');
  assert.strictEqual(B.formatNumber(101, null), '101');
});

/* ---------- coordinates ---------- */
t('coordinates round to one decimal and never get more precise', () => {
  assert.strictEqual(B.formatCoords(55.6761, 12.5683), '55.7° N 12.6° E');
  assert.strictEqual(B.roundCoord(55.6761), 55.7);
  assert.strictEqual(B.roundCoord(-0.04), 0);
  assert.ok(!Object.is(B.roundCoord(-0.04), -0), 'no negative zero');
});
t('south and west use letters, never signs', () => {
  assert.strictEqual(B.formatCoords(-23.5505, -46.6333), '23.6° S 46.6° W');
  assert.strictEqual(B.formatCoords(-36.8485, 174.7633), '36.8° S 174.8° E');
  assert.strictEqual(B.formatCoords(29.95, -90.07), '30.0° N 90.1° W');
  assert.ok(!/-/.test(B.formatCoords(-33.9, -70.7)));
});
t('rounding is symmetric about zero', () => {
  assert.strictEqual(B.roundCoord(23.55), 23.6);
  assert.strictEqual(B.roundCoord(-23.55), -23.6);
  assert.strictEqual(B.roundCoord(0.05), 0.1);
  assert.strictEqual(B.roundCoord(-0.05), -0.1);
});
t('equator and prime meridian carry no letter', () => {
  assert.strictEqual(B.formatCoords(0, 0), '0.0° 0.0°');
  assert.strictEqual(B.formatCoords(0.04, -0.04), '0.0° 0.0°');
  assert.strictEqual(B.formatCoords(51.48, -0.001), '51.5° N 0.0°');
});
t('the antimeridian is 180.0° with no letter, from either side', () => {
  assert.strictEqual(B.formatCoords(-17.7, 180), '17.7° S 180.0°');
  assert.strictEqual(B.formatCoords(-17.7, -180), '17.7° S 180.0°');
  assert.strictEqual(B.formatCoords(-17.7, 179.97), '17.7° S 180.0°');
  assert.strictEqual(B.formatCoords(-17.7, -179.96), '17.7° S 180.0°');
  assert.strictEqual(B.formatCoords(-17.7, 179.94), '17.7° S 179.9° E');
  assert.strictEqual(B.formatCoords(-17.7, -179.94), '17.7° S 179.9° W');
});
t('longitudes outside the range wrap', () => {
  assert.strictEqual(B.formatCoords(10, 190), '10.0° N 170.0° W');
  assert.strictEqual(B.formatCoords(10, -190), '10.0° N 170.0° E');
  assert.strictEqual(B.formatCoords(10, 540), '10.0° N 180.0°');
});
t('unusable pairs give no coordinates at all', () => {
  for (const [a, b] of [[91, 0], [-90.1, 0], [null, 1], [1, undefined], ['', ''], ['x', 2], [NaN, 3]]) assert.strictEqual(B.formatCoords(a, b), '', a + ',' + b);
  assert.strictEqual(B.formatCoords(90, 0), '90.0° N 0.0°');
});
t('every built-in city is rounded already and has a code', () => {
  B.CITIES.forEach(c => {
    assert.ok(/^[A-Z]{3}$/.test(c.code), c.name);
    assert.strictEqual(B.roundCoord(c.lat), c.lat, c.name);
    assert.strictEqual(B.roundCoord(c.lon), c.lon, c.name);
    assert.ok(B.formatCoords(c.lat, c.lon), c.name);
  });
  assert.strictEqual(B.CITIES[0].code, 'CPH');
});
t('no location drops the place line and the coordinates', () => {
  const m = B.normalize({ design: 'traveler', format: 'square', name: 'A', number: 1, city: null });
  assert.strictEqual(m.city, null);
  const rows = B.buildRows(m, B.layout('square', 'traveler'), fakeMeasure, 1);
  assert.ok(!rows.some(r => r.id === 'place' || r.id === 'coords'));
});
t('no geolocation anywhere in the code', () => {
  for (const f of ['badge.js', 'share.js', 'index.html']) {
    const src = fs.readFileSync(path.join(__dirname, f), 'utf8');
    assert.ok(!/navigator\.geolocation|getCurrentPosition|watchPosition/.test(src), f);
  }
});

/* ---------- dates ---------- */
t('dates are day month year', () => {
  assert.strictEqual(B.formatDate('2026-11-11'), '11 November 2026');
  assert.strictEqual(B.formatDate('2026-03-05'), '5 March 2026');
  assert.strictEqual(B.formatStampDate('2026-03-05'), '05 MAR 2026');
  assert.strictEqual(B.formatDate('2026-13-01'), '');
  assert.strictEqual(B.formatDate(''), '');
});

/* ---------- names ---------- */
t('pen names are respected', () => {
  assert.strictEqual(B.displayName({ name: 'Jane Q Doe', 'credit-mode': 'pen', 'pen-name': 'The Gate Floor' }), 'The Gate Floor');
  assert.strictEqual(B.displayName({ name: 'Jane Q Doe', 'credit-mode': 'pen', 'pen-name': '  ' }), '', 'no pen name saved: nothing, never the real name');
  assert.strictEqual(B.displayName({ name: 'Jane Q Doe', 'credit-mode': 'first' }), 'Jane');
  assert.strictEqual(B.displayName({ name: 'Jane Q Doe' }), 'Jane Q Doe');
});
t('places are counted, not typed, and duplicates count once', () => {
  assert.strictEqual(B.countPlaces(['Denmark', 'denmark ', 'Sweden', '', null]), 2);
  const magnus = 'Brazil, Germany, Czech Republic, Slovakia, Austria, Albania, Serbia, Kosovo, Bulgaria, Sweden, North Macedonia, Hungary, Poland, Luxembourg, Denmark'.split(', ');
  assert.strictEqual(B.countPlaces(magnus), 15);
  assert.strictEqual(B.placesPhrase(1), '1 country');
});

/* ---------- caption and link ---------- */
const BANNED = /\b(ship|ships|shipped|ledger|filed|seamless|elevate|wanderlust|bucket list)\b|free forever|—|!|#\w/i;
t('captions: one or two sentences, voice rules, no hashtags', () => {
  const cases = [
    { design: 'traveler', name: 'Sample Traveler', number: '042', cap: null },
    { design: 'traveler', name: 'Sample Traveler', number: '042', cap: 100 },
    { design: 'traveler', name: 'Sample Traveler', number: '' },
    { design: 'paw', name: 'Magnus Waffles', number: '003', places: 15 },
    { design: 'paw', name: 'Magnus Waffles', number: '', places: 0 }
  ];
  cases.forEach(c => {
    const s = S.buildCaption(c);
    assert.ok(!BANNED.test(s), s);
    const sentences = s.split(/(?<!No)\.\s/).length;
    assert.ok(sentences >= 1 && sentences <= 2, s);
  });
  assert.ok(S.buildCaption(cases[0]).includes('No. 042'));
  assert.ok(!S.buildCaption(cases[0]).includes('of 100'));
  assert.ok(S.buildCaption(cases[1]).includes('No. 042 of 100'));
  assert.ok(S.buildCaption(cases[3]).includes('15 countries'));
});
t('the referral link is plain and carries nothing about the member', () => {
  assert.strictEqual(S.REF_URL, 'https://www.thatlayover.life/?ref=badge');
  const u = new URL(S.REF_URL);
  assert.deepStrictEqual([...u.searchParams.keys()], ['ref']);
});
t('copy caption adds the link once', () => {
  assert.strictEqual(S.captionWithLink('Hello.'), 'Hello.\n' + S.REF_URL);
  assert.strictEqual(S.captionWithLink('Hello. ' + S.REF_URL), 'Hello. ' + S.REF_URL);
  assert.strictEqual(S.captionWithLink(''), S.REF_URL);
});
t('X intent link encodes the text and passes the link separately', () => {
  const caption = 'No. 042 & counting: São Paulo → anywhere #1? 50% "yes"\n' + S.REF_URL;
  const href = S.xIntentUrl(caption);
  assert.ok(href.startsWith('https://twitter.com/intent/tweet?text='));
  assert.ok(!/[\s"#]/.test(href), 'no raw spaces, quotes or hashes');
  const u = new URL(href);
  assert.strictEqual(u.searchParams.get('url'), S.REF_URL);
  assert.strictEqual(u.searchParams.get('text'), 'No. 042 & counting: São Paulo → anywhere #1? 50% "yes"');
  assert.ok(!u.searchParams.get('text').includes('thatlayover.life'), 'link not repeated in the text');
});

t('in-app browsers are recognized, ordinary ones are not', () => {
  assert.ok(S.isInAppBrowser('Mozilla/5.0 (iPhone) AppleWebKit Instagram 300.0'));
  assert.ok(S.isInAppBrowser('Mozilla/5.0 (iPhone) [FBAN/FBIOS;FBAV/400.0]'));
  assert.ok(!S.isInAppBrowser('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1'));
  assert.ok(!S.isInAppBrowser('Mozilla/5.0 (Linux; Android 14) Chrome/130.0 Mobile Safari/537.36'));
});

/* ---------- layout math ---------- */
/* Stand-in measurer: a fixed width per character by family, wide enough to be pessimistic. */
function fakeMeasure(text, font, tracking) {
  const size = parseFloat(/(\d+(?:\.\d+)?)px/.exec(font)[1]);
  const k = /Mono/.test(font) ? 0.62 : /Playfair/.test(font) ? 0.6 : 0.5;
  return text.length * size * k + (tracking || 0) * text.length;
}
const NAMES = ['Sample Traveler', 'Al', 'Maximiliana Oyelaran-Whitfield' /* 30 */, 'Bartholomew Featherstonehaugh', 'AbcdefghijklmnopqrstuvwxyzAB' /* 28, no space */, 'Sample Traveler Twenty-Eight' /* 28 */];
t('formats have the right pixel sizes', () => {
  assert.deepStrictEqual([B.FORMATS.story.w, B.FORMATS.story.h], [1080, 1920]);
  assert.deepStrictEqual([B.FORMATS.square.w, B.FORMATS.square.h], [1080, 1080]);
  assert.deepStrictEqual([B.FORMATS.landscape.w, B.FORMATS.landscape.h], [1200, 675]);
});
['story', 'square', 'landscape'].forEach(format => ['traveler', 'paw'].forEach(design => {
  t('layout ' + design + ' ' + format, () => {
    const L = B.layout(format, design);
    Object.keys(L.sizes).forEach(k => assert.ok(L.sizes[k] >= B.MIN_TYPE, k + ' ' + L.sizes[k]));
    if (format === 'story') { assert.ok(L.safeTop >= 250 && L.safeBottom >= 250, 'Story keeps clear of the top and bottom bands'); }
    NAMES.forEach(name => [null, { code: 'CPH', name: 'Copenhagen', lat: 55.7, lon: 12.6 }, { code: 'GRU', name: 'São Paulo', lat: -23.5, lon: -46.6 }].forEach(city => {
      const data = { design, format, theme: 'dark', name, number: 42, cap: 100, city, word: 'anywhere', joined: '2026-11-11',
        pet: { name: design === 'paw' ? name : '', species: 'Dog', breed: 'Samoyed', places: ['Denmark', 'Sweden'] } };
      const C = B.compose(B.normalize(data), fakeMeasure);
      const st = C.stamp;
      assert.ok(st.d >= B.STAMP_MIN, 'stamp ' + st.d);
      assert.ok(st.cx - st.d / 2 >= L.m - 1 && st.cx + st.d / 2 <= L.W - L.m + 1, 'stamp inside left/right margins');
      assert.ok(st.cy - st.d / 2 >= Math.min(L.safeTop, L.m) - 1 && st.cy + st.d / 2 <= L.ruleY, 'stamp inside top and above footer');
      C.rows.forEach(r => {
        assert.ok(r.x >= L.m && r.x + r.w <= L.W - L.m + 1, name + ': row ' + r.id + ' fits the width (' + r.w + ')');
        assert.ok(!B.hitsStamp(r, st, 0), name + ': row ' + r.id + ' clear of the stamp');
        r.runs.forEach(run => assert.ok(run.size >= B.MIN_TYPE, 'type size ' + run.size));
      });
      assert.ok(C.rows[0].top > L.wordmarkBase, name + ': stack clear of the wordmark');
      for (let i = 1; i < C.rows.length; i++) assert.ok(C.rows[i].top >= C.rows[i - 1].base, 'rows in order');
      const nameRows = C.rows.filter(r => /^name/.test(r.id));
      assert.ok(nameRows.length >= 1 && nameRows.length <= 2);
      assert.ok(!nameRows.some(r => r.runs[0].text.endsWith('…')) || name.length > 28, name + ': 28 characters fit without a cut');
    }));
  });
}));

/* ---------- review additions (12 Nov) ---------- */
t('the name is always larger than the number', () => {
  ['story', 'square', 'landscape'].forEach(format => NAMES.concat(['Søren Ærø', 'São']).forEach(name => {
    const C = B.compose(B.normalize({ design: 'traveler', format, name, number: 100, cap: 100, city: B.CITIES[0], joined: '2026-11-11' }), fakeMeasure);
    const num = C.rows.find(r => r.id === 'number'), nm = C.rows.find(r => r.id === 'name1');
    assert.ok(num.runs[1].size < nm.runs[0].size, format + ' ' + name + ': number ' + num.runs[1].size + ' vs name ' + nm.runs[0].size);
  }));
});
t('the postmark never says FOUNDING three times', () => {
  const base = { design: 'traveler', format: 'square', name: 'A', joined: '2026-11-11' };
  assert.strictEqual(B.stampContent(B.normalize(Object.assign({}, base, { number: 42, city: B.CITIES[0] }))).big, 'CPH');
  assert.strictEqual(B.stampContent(B.normalize(Object.assign({}, base, { number: 42, city: null }))).big, 'No. 042');
  const none = B.stampContent(B.normalize(Object.assign({}, base, { number: '', city: null })));
  assert.strictEqual(none.big, 'TLL'); assert.strictEqual(none.small, '');
});
t('alt text says what is drawn, place line and postmark included', () => {
  const alt = B.describe({ design: 'traveler', format: 'story', theme: 'dark', name: 'Søren Ærø', number: 1, city: B.CITIES[0], word: 'anywhere', joined: '2026-11-11' });
  ['That Layover Life', 'Søren Ærø', 'No. 001', 'CPH to anywhere', '55.7° N 12.6° E', 'Ink postmark', '11 NOV 2026', 'Joined 11 November 2026', 'thatlayover.life'].forEach(w => assert.ok(alt.includes(w), w + ' in ' + alt));
  const pet = B.describe({ design: 'paw', format: 'square', theme: 'light', number: 3, city: null, joined: '2026-11-11', pet: { name: 'Magnus Waffles', species: 'Dog', breed: 'Samoyed', places: ['Denmark', 'Sweden'] } });
  ['Paw Passport', 'Magnus Waffles', 'Dog, Samoyed', '2 countries', 'No. 003'].forEach(w => assert.ok(pet.includes(w), w + ' in ' + pet));
  assert.ok(!/·/.test(pet), 'no middle dots read aloud');
});
t('São Paulo keeps its accent in the city list', () => {
  assert.ok(B.CITIES.some(c => c.name === 'São Paulo' && c.code === 'GRU'));
});

/* share step against stand-in browsers */
function fakeWin(o) {
  o = o || {};
  const nav = Object.assign({ userAgent: o.ua || 'Mozilla/5.0 Chrome/130' }, o.nav || {});
  const doc = { createElement: () => ({ download: '' }), featurePolicy: o.policy };
  const w = { navigator: nav, document: doc, File: function (parts, name, opt) { this.name = name; this.type = opt.type; } };
  w.self = w; w.top = o.framed ? {} : w;
  return w;
}
t('no Share button without navigator.share and canShare', () => {
  const w = fakeWin({ nav: { share: () => Promise.resolve() } });
  assert.strictEqual(S.capabilities(w, {}).shareFiles, false);
});
t('no Share button when canShare refuses files', () => {
  const w = fakeWin({ nav: { share: () => Promise.resolve(), canShare: () => false } });
  assert.strictEqual(S.capabilities(w, {}).shareFiles, false);
});
t('no Share button when the frame policy forbids web-share', () => {
  const w = fakeWin({ framed: true, nav: { share: () => Promise.resolve(), canShare: () => true }, policy: { allowsFeature: f => f !== 'web-share' } });
  assert.strictEqual(S.capabilities(w, {}).shareFiles, false);
});
t('no Save button in a frame or an in-app browser, where downloads vanish', () => {
  assert.strictEqual(S.capabilities(fakeWin(), null).download, true);
  assert.strictEqual(S.capabilities(fakeWin({ framed: true }), null).download, false);
  assert.strictEqual(S.capabilities(fakeWin({ ua: 'Mozilla/5.0 (iPhone) Instagram 300.0' }), null).download, false);
});
async function shareOutcome(err) {
  const w = fakeWin({ nav: { canShare: () => true, share: () => err ? Promise.reject(err) : Promise.resolve() } });
  return (await S.shareImage(w, {}, 'Hi')).outcome;
}
const asyncTests = [
  ['share resolves shared', async () => assert.strictEqual(await shareOutcome(null), 'shared')],
  ['closing the share sheet (AbortError) is canceled, not an error', async () => assert.strictEqual(await shareOutcome({ name: 'AbortError' }), 'canceled')],
  ['NotAllowedError is refused', async () => assert.strictEqual(await shareOutcome({ name: 'NotAllowedError' }), 'refused')],
  ['other share errors are unsupported', async () => assert.strictEqual(await shareOutcome({ name: 'DataError' }), 'unsupported')],
  ['a refused clipboard falls back and reports refused, never throws', async () => {
    let selected = false;
    const w = fakeWin({ nav: { clipboard: { writeText: () => Promise.reject(new Error('denied')) } } });
    w.document.createElement = () => ({ setAttribute() {}, style: {}, select() {}, remove() {} });
    w.document.body = { appendChild() {} };
    w.document.execCommand = () => false;
    const r = await S.copyText(w, 'x', { focus() {}, select() { selected = true; } });
    assert.strictEqual(r.outcome, 'refused'); assert.ok(selected, 'caption selected for a manual copy');
  }],
  ['a refused popup is reported, not assumed', async () => {
    const w = fakeWin(); w.open = () => null;
    assert.strictEqual(S.openX(w, 'Hi').outcome, 'refused');
  }]
];

(async () => {
  for (const [name, fn] of asyncTests) { try { await fn(); passed++; } catch (e) { failed++; console.log('FAIL ' + name + '\n  ' + (e && e.message)); } }
  console.log(passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})();
