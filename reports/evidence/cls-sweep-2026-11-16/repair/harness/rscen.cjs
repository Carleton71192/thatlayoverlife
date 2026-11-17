/* Repair sets (17 Nov 2026): the adversarial check's notes 1, 2, 3 and 7 again, three arms (ctl = 16.66.0, old = afe01e7, new = repaired),
   and the 16 claimed cells plus home and one story for the regression table. Scenario code is the adversarial check's (scen.cjs). */
const S = require('./scen.cjs'); const { cell } = S.__h;
const R = {};
const rot = i => [['ctl', 'old', 'new'], ['new', 'ctl', 'old'], ['old', 'new', 'ctl']][i % 3];
const find = (set, id) => { const s = S[set].find(x => x.id === id); if (!s) throw new Error('no scenario ' + set + ' ' + id); return s; };
const again = (set, id, i, extra) => Object.assign({}, find(set, id), { id: id + '-r' + i, arms: rot(i) }, extra || {});
/* note 1 */
R.n1 = []; for (let i = 1; i <= 9; i++) R.n1.push(again('markup', 'st-q-1440', i));
for (let i = 1; i <= 3; i++) { R.n1.push(again('markup', 'st-q-390', i)); R.n1.push(again('markup', 'st-q-none-1440', i)); }
for (let i = 1; i <= 3; i++) R.n1.push(Object.assign(cell('stories-plain-1440-r' + i, 'stories', 1440), { arms: rot(i) }));
/* note 2 */
R.n2 = []; for (let i = 1; i <= 4; i++) for (const p of ['about', 'expats']) R.n2.push(again('reload', p + '-reload-bottom-390', i));
for (let i = 1; i <= 2; i++) for (const p of ['about', 'expats']) R.n2.push(again('reload', p + '-reload-mid-390', i));
/* the other six pages once, so a change to the reload path is seen everywhere */
R.n2b = []; for (const p of ['travelers', 'map', 'account', 'submit', 'profile', 'stories']) for (const w of ['bottom', 'mid']) R.n2b.push(again('reload', p + '-reload-' + w + '-390', 1));
/* note 3 */
R.n3 = []; let k = 0; for (const w of [1440, 390]) for (const n of ['mapcode-empty', 'mapcode-throw', 'mapdata404', 'mapcode404', 'mapembed404']) R.n3.push(again('fail', 'map-' + n + '-' + w, ++k, { wait: 13000 }));
for (const w of [1440, 390]) for (let i = 1; i <= 2; i++) R.n3.push(Object.assign(cell('map-plain-' + w + '-r' + i, 'map', w), { arms: rot(i), wait: 6000 }));
/* note 7 */
R.n7 = []; for (let i = 1; i <= 2; i++) for (const p of ['stories', 'account']) R.n7.push(again('menu', p + '-earlytap-390', i));
R.n7.push(again('menu', 'stories-menu-390', 1)); R.n7.push(again('menu', 'account-menu-390', 1));
/* the regression table: the 16 claimed cells, home and one story, 3 loads a cell and arm */
R.reg = []; let j = 0;
for (let i = 1; i <= 3; i++) for (const p of ['travelers', 'map', 'expats', 'about', 'account', 'submit', 'profile', 'stories', 'home', 'lisbon']) for (const w of [390, 1440]) {
  j++; R.reg.push(Object.assign(cell(p + '-' + w + '-r' + i, p, w), { arms: (i + j) % 2 ? ['ctl', 'new'] : ['new', 'ctl'] })); }
/* more reloads at the very end, control and repaired core only */
const two = i => (i % 2 ? ['ctl', 'new'] : ['new', 'ctl']);
R.n2c = []; for (let i = 5; i <= 12; i++) R.n2c.push(again('reload', 'about-reload-bottom-390', i, { arms: two(i) }));
for (let i = 5; i <= 8; i++) R.n2c.push(again('reload', 'expats-reload-bottom-390', i, { arms: two(i) }));
/* the new pieces under other conditions: the note style missing from the page, the document in pieces at CPU 4x, a search on a slow load */
const { rep } = (() => { const rep = (a, b) => (k, h) => { const parts = h.split(a); if (parts.length !== 2) throw new Error('patch: not found once: ' + a); return parts.join(b); }; return { rep }; })();
R.xtra = [];
for (const w of [390, 1440]) R.xtra.push(Object.assign(cell('about-nonotecss-' + w, 'about', w, { opts: { html: rep('<style id="tll-note-v1-css">', '<style id="tll-note-v1-cssx">') } }), { arms: two(w) }));
R.xtra.push(Object.assign({}, find('slow', 'about-cut1-390'), { arms: two(1) })); R.xtra.push(Object.assign({}, find('slow', 'about-even-1440'), { arms: two(2) }));
R.xtra.push(Object.assign({}, find('slow', 'stories-even-1440'), { id: 'stories-q-even-1440', query: '?q=lisbon', arms: ['ctl', 'old', 'new'] }));
R.xtra.push(Object.assign({}, find('slow', 'stories-cut1-1440'), { id: 'stories-q-cut1-1440', query: '?q=lisbon', arms: ['new', 'old', 'ctl'] }));
R.xtra.push(Object.assign({}, find('slow', 'map-even-1440'), { arms: two(1) })); R.xtra.push(Object.assign({}, find('slow', 'map-cut1-390'), { arms: two(2) }));
R.xtra.push(Object.assign({}, find('rm', 'stories-rm-1440'), { id: 'stories-q-rm-1440', query: '?q=lisbon', arms: two(1) }));
/* the slow /the-map load again, the afe01e7 build against the repaired one (the load event waits for the map library in some loads) */
R.xmap = []; for (let i = 1; i <= 3; i++) R.xmap.push(Object.assign({}, find('slow', 'map-even-1440'), { id: 'map-even-1440-r' + i, arms: i % 2 ? ['old', 'new'] : ['new', 'old'] }));
/* first paint on home at 1440 again, three arms (the three new loads of set reg read 220 to 260 ms against 192 to 196) */
R.xhome = []; for (let i = 1; i <= 6; i++) R.xhome.push(Object.assign(cell('home-1440-r' + i, 'home', 1440), { arms: rot(i) }));
module.exports = Object.assign({}, R);
