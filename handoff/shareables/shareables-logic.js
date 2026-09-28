// TLL Shareables logic: sample data, counting math (UN 193 / 195 / 250), ranges, MRZ builder, stamp system,
// Equal Earth map rendering (d3-geo + world-atlas), QR, card rendering (modern-screenshot), share flow + fallbacks,
// privacy levels. Reference for behavior and data shapes; the live build reads real member data.

class Component extends DCLogic {
  state = { geo: null, qr: null, ranges: null, level: 'unlisted', items: { count: true, pct: true, map: true, dog: true, parks: false }, slug: 'k7f3q9', demo: 'idle', cardType: 'percent', sim: '', copied: false };
  cardRefs = { percent: React.createRef(), map: React.createRef(), passport: React.createRef(), pet: React.createRef(), duo: React.createRef() };
  HUMAN = ['076','276','203','703','040','008','688','100','752','807','348','616','208','704','840','499','288','392','484','152','032','578','246','528','056','250','724','620','380','300','191','705','070','642','826','372','756','233','428','440','504','818','710','404','764','116','360','702','458','608','410','036','554','124','604','170','188','192','470','442','196','356'];
  LIVED = ['208','076','704','840'];
  AIRSIDE = ['634','352','591','231'];
  DOG = ['076','276','203','703','040','008','688','100','752','807','348','616'];
  TWO = ['208','752'];
  SMALL = { '702': [103.82, 1.35], '470': [14.44, 35.9] };
  _maps = {}; _els = {}; _ticks = {};
  componentDidMount() { this.loadGeo(); this.loadQr(); }
  async loadGeo() {
    try {
      const d3 = await import('https://cdn.jsdelivr.net/npm/d3-geo@3/+esm');
      const topo = await import('https://cdn.jsdelivr.net/npm/topojson-client@3/+esm');
      const world = await (await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')).json();
      const all = topo.feature(world, world.objects.countries).features;
      const feats = all.filter(f => String(f.id) !== '010' && String(f.id) !== '260' && f.properties.name !== 'Antarctica');
      const fc = { type: 'FeatureCollection', features: feats };
      const proj = d3.geoEqualEarth().fitWidth(1000, fc);
      const path = d3.geoPath(proj);
      if (path.digits) path.digits(1);
      const b = path.bounds(fc);
      const shapes = feats.map(f => ({ id: f.id == null ? '' : String(f.id), name: f.properties.name, d: path(f), a: path.area(f), c: path.centroid(f) })).filter(s => s.d);
      const small = {};
      Object.keys(this.SMALL).forEach(k => { small[k] = proj(this.SMALL[k]); });
      this._maps = {}; this._els = {}; this._defs = null;
      this.setState({ geo: { shapes, small, vb: [b[0][0], b[0][1] - 4, b[1][0] - b[0][0], b[1][1] - b[0][1] + 8].map(n => n.toFixed(1)).join(' ') } });
    } catch (e) { this.setState({ geoErr: true }); }
  }
  async loadQr() {
    try {
      const m = await import('https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/+esm');
      const qrcode = m.default || m;
      const q = qrcode(0, 'M'); q.addData('https://thatlayover.life/p/sample'); q.make();
      const n = q.getModuleCount(); let d = '';
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += 'M' + c + ' ' + r + 'h1v1h-1z';
      this.setState({ qr: { n, d } });
    } catch (e) {}
  }
  mapSvg(mode, uid, th) {
    const key = mode + uid + (th || ''); if (this._maps[key]) return this._maps[key];
    const C = th === 'D' ? { land: '#1E2944', edge: '#0B1220', ink: '#F7F1E8' } : th === 'L' ? { land: '#E4DCCD', edge: '#FAF7F2', ink: '#0A0B14' } : { land: 'var(--land)', edge: 'var(--edge)', ink: 'var(--ink)' };
    const g = this.state.geo;
    const H = new Set(this.HUMAN), L = new Set(this.LIVED), A = new Set(this.AIRSIDE), D = new Set(this.DOG), T = new Set(this.TWO);
    const bonus = s => s.id === '158' || s.id === '540' || s.name === 'Kosovo';
    const hv = s => H.has(s.id) || bonus(s);
    const dv = s => D.has(s.id) || s.name === 'Kosovo';
    const pid = 'hx' + uid + (th || '');
    let out = '<defs><pattern id="' + pid + '" patternUnits="userSpaceOnUse" width="4.4" height="4.4" patternTransform="rotate(45)"><rect width="1.9" height="4.4" fill="#7C5CBF"></rect></pattern></defs>';
    const P = (d, st) => '<path d="' + d + '" style="' + st + '"></path>';
    const LAND = 'fill:' + C.land + ';stroke:' + C.edge + ';stroke-width:.5';
    const ROSE = 'fill:#F0507A;stroke:' + C.edge + ';stroke-width:.5';
    const LIVE = 'fill:#D63859;stroke:' + C.ink + ';stroke-width:.9';
    const AIR = 'fill:' + C.land + ';stroke:' + C.ink + ';stroke-width:1.1;stroke-dasharray:1.8 1.8';
    const HAT = 'fill:url(#' + pid + ');stroke:#7C5CBF;stroke-width:1';
    const TINT = 'fill:rgba(124,92,191,.25);stroke:#7C5CBF;stroke-width:1';
    let dots = '';
    const dot = (x, y) => { dots += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.2" style="fill:#F0507A"></circle><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="6" style="fill:none;stroke:#F0507A;stroke-width:1.3"></circle>'; };
    g.shapes.forEach(s => {
      let st = LAND, over = '';
      if (mode === 'human' || mode === 'duo') {
        if (L.has(s.id)) st = LIVE; else if (hv(s)) st = ROSE; else if (A.has(s.id)) st = AIR;
        if (mode === 'duo' && dv(s)) over = P(s.d, HAT);
        if (hv(s) && s.a < 12) dot(s.c[0], s.c[1]);
      } else if (mode === 'pet') {
        if (dv(s)) { st = TINT; over = P(s.d, HAT); }
      } else if (mode === 'two') {
        if (T.has(s.id)) st = ROSE;
      }
      out += P(s.d, st) + over;
    });
    if (mode === 'human' || mode === 'duo') Object.keys(g.small).forEach(k => { const p = g.small[k]; if (p && H.has(k)) dot(p[0], p[1]); });
    const svg = uid === 'G' ? '<g id="tll-g-' + mode + th + '">' + out + dots + '</g>' : '<svg viewBox="' + g.vb + '" width="100%" style="display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">' + out + dots + '</svg>';
    this._maps[key] = svg; return svg;
  }
  DARK = { duoD: 1, duoO: 1, humD: 1, humO: 1, petD: 1, petO: 1, e1: 1, e3: 1, e5: 1 };
  mapEl(mode, uid) {
    if (!this.state.geo) return React.createElement('div', { style: { aspectRatio: '2.3 / 1', background: 'var(--land)', borderRadius: 6, opacity: .6 } });
    const k = mode + uid;
    const inline = uid === 'duoL' || uid === 'humL';
    if (!this._els[k]) this._els[k] = React.createElement('div', { 'aria-hidden': true, dangerouslySetInnerHTML: { __html: inline ? this.mapSvg(mode, uid) : '<svg viewBox="' + this.state.geo.vb + '" width="100%" style="display:block;overflow:visible"><use href="#tll-g-' + mode + (this.DARK[uid] ? 'D' : 'L') + '"></use></svg>' } });
    return this._els[k];
  }
  mapDefs() {
    if (!this.state.geo) return null;
    if (!this._defs) this._defs = React.createElement('div', { 'aria-hidden': true, style: { position: 'absolute', width: 0, height: 0, overflow: 'hidden' }, dangerouslySetInnerHTML: { __html: '<svg width="0" height="0"><defs>' + ['human','duo','pet','empty','two'].map(md => this.mapSvg(md, 'G', 'L') + this.mapSvg(md, 'G', 'D')).join('') + '</defs></svg>' } });
    return this._defs;
  }
  svgEl(inner, vb, fill) {
    return React.createElement('span', { style: { display: 'block', width: '100%', height: '100%' }, dangerouslySetInnerHTML: { __html: '<svg viewBox="' + vb + '" width="100%" height="100%" fill="' + (fill || 'currentColor') + '" fill-rule="evenodd" style="display:block">' + inner + '</svg>' } });
  }
  PAW = '<path d="M12 13.2c3.4 0 6.2 2.6 6.2 5.3 0 1.9-1.6 2.9-3.2 2.9-1.2 0-2-.6-3-.6s-1.8.6-3 .6c-1.6 0-3.2-1-3.2-2.9 0-2.7 2.8-5.3 6.2-5.3z"></path><ellipse cx="4.6" cy="10.2" rx="2.1" ry="2.7" transform="rotate(-20 4.6 10.2)"></ellipse><ellipse cx="8.8" cy="5.6" rx="2.2" ry="2.9" transform="rotate(-8 8.8 5.6)"></ellipse><ellipse cx="15.2" cy="5.6" rx="2.2" ry="2.9" transform="rotate(8 15.2 5.6)"></ellipse><ellipse cx="19.4" cy="10.2" rx="2.1" ry="2.7" transform="rotate(20 19.4 10.2)"></ellipse>';
  ICON = {
    plane: '<path d="M6 .6l.9 3.9 4.5 2v1.1L6.9 6.7l-.4 2.8 1.5 1.1v.8L6 10.9l-2 .5v-.8l1.5-1.1-.4-2.8L.6 7.6V6.5l4.5-2z"></path>',
    train: '<path d="M3.2 1h5.6a1.7 1.7 0 0 1 1.7 1.7v5a1.7 1.7 0 0 1-1.7 1.7H3.2a1.7 1.7 0 0 1-1.7-1.7v-5A1.7 1.7 0 0 1 3.2 1zM3 2.8v2.6h6V2.8zM3 7h1.2v1.2H3zm4.8 0H9v1.2H7.8z"></path><path d="M3 11.4l1.4-1.6h3.2L9 11.4z"></path>',
    boat: '<path d="M.8 7.2h10.4L9.7 10.6H2.3zM5.4 1.2h1v5.4h-1zM6.4 1.8l3.4 3.8H6.4z"></path>',
    car: '<path d="M2.4 5.2L3.8 2.6h4.4l1.4 2.6h1.2v3.4H1.2V5.2zm1.6 0h4L7.3 3.6H4.7z"></path><path d="M2.6 8.6h2v1.6h-2zm4.8 0h2v1.6h-2z"></path>'
  };
  elCache = null;
  els() {
    if (this.elCache) return this.elCache;
    let ring = '<defs><path id="tllring" d="M75,75 m-57,0 a57,57 0 1,1 114,0 a57,57 0 1,1 -114,0"></path></defs><circle cx="75" cy="75" r="71" fill="none" stroke="#F0507A" stroke-width="1.5"></circle><circle cx="75" cy="75" r="42" fill="none" stroke="#F0507A" stroke-width="1"></circle><text fill="#F7F1E8" style="font-family:JetBrains Mono,monospace;font-size:9px;letter-spacing:1.4px;font-weight:800"><textPath href="#tllring">ESCAPED · FED · SLEPT · LIVED · LEFT THE AIRPORT ·</textPath></text><text x="75" y="84" text-anchor="middle" fill="#F7F1E8" style="font-family:Syne,sans-serif;font-weight:800;font-size:26px">TLL</text>';
    let pr = '<circle cx="100" cy="100" r="96" fill="none" stroke="#F7F1E8" stroke-width="1.2" opacity=".6"></circle>';
    for (let i = 0; i < 13; i++) { const a = i / 13 * Math.PI * 2 - Math.PI / 2; const x = 100 + Math.cos(a) * 78, y = 100 + Math.sin(a) * 78; const deg = a * 180 / Math.PI + 90; pr += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + deg.toFixed(1) + ') translate(-8 -8) scale(.66)">' + this.PAW + '</g>'; }
    this.elCache = {
      ring: this.svgEl(ring, '0 0 150 150', 'none'),
      pawRing: this.svgEl(pr, '0 0 200 200', '#F7F1E8'),
      pawPurple: this.svgEl(this.PAW, '0 0 24 24', '#7C5CBF'),
      icons: { plane: this.svgEl(this.ICON.plane, '0 0 12 12'), train: this.svgEl(this.ICON.train, '0 0 12 12'), boat: this.svgEl(this.ICON.boat, '0 0 12 12'), car: this.svgEl(this.ICON.car, '0 0 12 12') }
    };
    return this.elCache;
  }
  go = (patch) => this.setState(patch);
  makeCard = async () => {
    const r = this.cardRefs[this.state.cardType]; const node = r && r.current;
    if (!node) { this.setState({ demo: 'error' }); return; }
    this.setState({ demo: 'rendering' });
    try {
      if (this.state.sim === 'fail') { await new Promise(res => setTimeout(res, 700)); throw new Error('sim'); }
      const ms = await import('https://cdn.jsdelivr.net/npm/modern-screenshot@4.7.0/+esm');
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      let blob = await ms.domToBlob(node, { scale: 2, type: 'image/png' });
      if (!blob || blob.size < 15000) blob = await ms.domToBlob(node, { scale: 2, type: 'image/png' });
      if (!blob) throw new Error('empty');
      if (this.url) URL.revokeObjectURL(this.url);
      this.blob = blob; this.url = URL.createObjectURL(blob);
      this.setState({ demo: 'preview' });
    } catch (e) { this.setState({ demo: 'error' }); }
  };
  shareUrl() { return 'https://thatlayover.life/p/' + (this.state.level === 'public' ? 'yourhandle' : this.state.slug); }
  share = async () => {
    const url = this.shareUrl(); const text = "You didn't ask to see my travel stats but here they are: " + url; const sim = this.state.sim;
    try {
      const file = new File([this.blob], 'tll-' + this.state.cardType + '-card.png', { type: 'image/png' });
      if (sim !== 'nofile' && sim !== 'none' && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: text }); this.setState({ demo: 'sent' }); return; }
      if (sim !== 'none' && navigator.share) { await navigator.share({ text: text, url: url }); this.setState({ demo: 'linkonly' }); return; }
      this.setState({ demo: 'nofile' });
    } catch (e) { if (e && e.name === 'AbortError') return; this.setState({ demo: 'nofile' }); }
  };
  shareLink = async () => {
    const url = this.shareUrl();
    try { if (this.state.sim !== 'none' && navigator.share) { await navigator.share({ text: "You didn't ask to see my travel stats but here they are: " + url, url: url }); this.setState({ demo: 'sent' }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    this.setState({ demo: 'nofile' });
  };
  download = () => { if (!this.url) return; const a = document.createElement('a'); a.href = this.url; a.download = 'tll-' + this.state.cardType + '-card.png'; document.body.appendChild(a); a.click(); a.remove(); };
  copyLink = () => { try { navigator.clipboard.writeText(this.shareUrl()); } catch (e) {} this.setState({ copied: true }); clearTimeout(this._ct); this._ct = setTimeout(() => this.setState({ copied: false }), 2000); };
  renderVals() {
    const p = this.props, s = this.state;
    const bs = p.countBase || 'UN 193 (recommended)';
    const base = bs.indexOf('TLL') === 0 ? 'tll' : bs.indexOf('Been') === 0 ? 'been' : 'un';
    const ranges = s.ranges === null ? !!p.showRanges : s.ranges;
    const un = base === 'un';
    const den = un ? 193 : base === 'tll' ? 195 : 250;
    const hN = un ? this.HUMAN.length : this.HUMAN.length + 4;
    const dN = un ? this.DOG.length : this.DOG.length + 1;
    const f10 = n => Math.floor(n / 10) * 10;
    const rn = n => ranges ? (n < 10 ? 'Under 10' : f10(n) + '+') : String(n);
    const pc = Math.round(hN / den * 100);
    const tierOf = n => n >= 193 ? 'UN-Done' : n >= 100 ? 'Centurion' : n >= 50 ? 'Half the Stamps' : n >= 25 ? 'Checked Bag' : n >= 10 ? 'Carry-On' : 'Boarding';
    const denLabel = un ? 'OF 193 UN STATES' : base === 'tll' ? 'OF 195 · TLL CLASSIC BASE' : 'OF 250 COUNTRIES + TERRITORIES';
    const unWord = un ? 'UN states' : base === 'tll' ? 'countries (TLL classic)' : 'countries and territories';
    const pctNum = ranges ? String(f10(pc)) : String(pc), pctSuffix = ranges ? '%+' : '%';
    const shared = un ? 12 : 13;
    const h = { countStr: rn(hN), den, denLabel, unWord, pctNum, pctSuffix, pctStr: pctNum + pctSuffix,
      head1: pctNum + pctSuffix + ' of the world.', head2: ranges ? 'The rest has been warned.' : 'The other ' + (100 - pc) + '% has been warned.',
      unChip: rn(hN) + '/' + den + (un ? ' UN' : ''), bonusChip: un ? '+4 BONUS PLACES' : 'BONUS PLACES COUNTED IN', contChip: '7/7 CONTINENTS', tier: tierOf(hN),
      airside: ranges ? '+ A FEW COUNTRIES SEEN THROUGH GLASS' : '+4 COUNTRIES SEEN THROUGH GLASS',
      tickLeft: rn(hN) + ' STAMPED', tickRight: ranges ? 'THE REST TO GO' : (den - hN) + ' TO GO' };
    const d = { countStr: rn(dN), tier: tierOf(dN), unChip: rn(dN) + '/' + den + (un ? ' UN' : ''), bonusChip: un ? '+1 BONUS · KOSOVO' : 'KOSOVO COUNTED IN',
      couch: "He's been to " + rn(dN) + " countries. You've been to the couch." };
    const duo = { head: 'Me: ' + rn(hN) + '. Him: ' + rn(dN) + '.', shared: rn(shared), unsniffed: ranges ? 'Plenty of' : String(hN - shared) };
    const vis = ranges ? f10(hN) : hN; const tk = den + '_' + vis;
    if (!this._ticks[tk]) this._ticks[tk] = Array.from({ length: den }, (_, i) => ({ c: i < vis ? 'var(--rose)' : 'var(--tick)' }));
    const pad = t => (t + '<'.repeat(44)).slice(0, 44);
    const mrz1 = pad('P<TLL<TRAVELER<<SAMPLE');
    const mrz2 = pad((ranges ? f10(hN) + 'PLUS' : hN) + (un ? 'UN' : 'C') + '<' + (ranges ? f10(pc) + 'PLUS' : pc) + 'PCT<SINCE2026<<LAYOVERS<ARE<A<VIBE');
    const E = this.els();
    const m = {};
    [['duoL','duo'],['duoD','duo'],['duoF','duo'],['duoO','duo'],['humL','human'],['humD','human'],['humF','human'],['humO','human'],['petD','pet'],['petF','pet'],['petO','pet'],['flow','human'],['pageD','human'],['pageM','human'],['e1','empty'],['e2','two'],['e3','human'],['e4','empty'],['e5','two'],['e6','pet']].forEach(x => { m[x[0]] = this.mapEl(x[1], x[0]); });
    const ST = (code, name, year, kind, tier, tr, ink, rot, blur) => {
      const w = kind === 'circle' ? '84px' : '124px', hh = kind === 'circle' ? '84px' : '74px';
      const rad = kind === 'ter' ? '16px' : kind === 'circle' ? '50%' : '3px';
      const bd = kind === 'air' ? '2px dashed currentColor' : tier === 'lived' ? '3.5px solid currentColor' : '2px solid currentColor';
      const sh = tier === 'fed' ? 'inset 0 0 0 3px var(--bg), inset 0 0 0 4px currentColor' : tier === 'slept' ? 'inset 0 0 0 3px var(--bg), inset 0 0 0 4px currentColor, inset 0 0 0 6.5px var(--bg), inset 0 0 0 7.5px currentColor' : 'none';
      return { code, name, year, box: kind !== 'tri', tri: kind === 'tri', w, h: hh, rad, bd, sh, fs: kind === 'circle' ? '17px' : '21px', icon: tr ? E.icons[tr] : null, ink: ink === 'r' ? 'var(--rose)' : 'var(--teal)', op: kind === 'air' ? .55 : blur ? .7 : .84, rot, blur: blur ? 'blur(.45px)' : 'none' };
    };
    const stamps = [
      ST('DNK','DENMARK','2018','un','lived','plane','r',-6), ST('BRA','BRAZIL','2019','un','lived','plane','t',5), ST('VNM','VIETNAM','2021','un','lived','plane','r',-3,1),
      ST('MNE','MONTENEGRO','2025','un','slept','car','t',8), ST('GHA','GHANA','2026','un','fed','plane','r',-9), ST('JPN','JAPAN','2024','un','escaped','train','t',4),
      ST('MEX','MEXICO','2024','un','fed','boat','r',-4), ST('TWN','TAIWAN · BONUS','2023','ter','slept','plane','t',7), ST('NCL','NEW CALEDONIA · BONUS','2022','ter','escaped','boat','r',-8,1),
      ST('ATA','ANTARCTICA · WILD CARD','2023','tri','escaped',null,'t',3), ST('7/7','CONTINENTS','MILESTONE','circle','escaped',null,'r',-5), ST('QAT','QATAR · AIRSIDE','2024','air','escaped','plane','t',6)
    ];
    const pc13 = [['BRA','2021'],['DEU','2025'],['CZE','2025'],['SVK','2025'],['AUT','2025'],['ALB','2025'],['SRB','2025'],['XKX','2025'],['BGR','2025'],['SWE','2023'],['MKD','2025'],['HUN','2025'],['POL','2025']];
    const rots = [-6,4,-3,7,-8,2,-5,6,-2,5,-7,3,-4];
    const petStamps = pc13.map((x, i) => ({ code: x[0], year: x[1], rot: rots[i], op: i % 5 === 3 ? .7 : .86, tag: x[0] === 'XKX' ? 'BONUS' : '' }));
    const dm = { idle: s.demo === 'idle', rendering: s.demo === 'rendering', preview: s.demo === 'preview', sent: s.demo === 'sent', linkonly: s.demo === 'linkonly', nofile: s.demo === 'nofile', error: s.demo === 'error' };
    const reset = () => this.setState({ demo: 'idle' });
    const ex = [['Flex it (Story)','1080×1920 · SHARE SHEET',this.share,1],['Grid it','1080×1350 · OWN LAYOUT, NOT A CROP',this.share],['Send the link. Be subtle.','LINK ONLY',this.shareLink],['Save it for strategic bragging later','PNG DOWNLOAD',this.download],['Drop it in the group chat','SHARE SHEET',this.share],['Not today, Instagram','CANCEL',reset]].map(x => ({ label: x[0], note: x[1], act: x[2], bg: x[3] ? '#F0507A' : 'transparent', fg: x[3] ? '#0A0B14' : '#F7F1E8' }));
    const cardTypes = [['percent','Percent'],['map','Map'],['passport','Passport'],['pet','Pet'],['duo','Duo']].map(x => { const on = s.cardType === x[0]; return { label: x[1], pick: () => this.setState({ cardType: x[0], demo: 'idle' }), bg: on ? '#F0507A' : 'transparent', fg: on ? '#0A0B14' : '#F7F1E8', bd: on ? '#F0507A' : '#26324D' }; });
    const simBtns = [['','REAL BROWSER'],['nofile','NO IMAGE SHARING'],['none','NO SHARING AT ALL'],['fail','RENDER FAILS']].map(x => { const on = s.sim === x[0]; return { label: x[1], pick: () => this.setState({ sim: x[0], demo: s.demo === 'rendering' ? 'rendering' : 'idle' }), bg: on ? '#00C9C8' : 'transparent', fg: on ? '#0A0B14' : '#9AA3B8' }; });
    const levels = [['off','Just me (the default, obviously)','No public link. You can still download your own card.'],['unlisted','Anyone with the link','A random link, not indexed. Revoke or swap it anytime.'],['public','The whole internet. Bold.','Your handle URL. Search engines can find it.']].map(x => { const on = s.level === x[0]; return { label: x[1], sub: x[2], aria: on ? 'true' : 'false', pick: () => this.setState({ level: x[0] }), bd: on ? '#0A0B14' : 'var(--line)', bg: on ? '#fff' : 'transparent', dot: on ? '4px' : '0' }; });
    const it = s.items;
    const tog = k => () => this.setState({ items: Object.assign({}, s.items, { [k]: !s.items[k] }) });
    const sw = (label, sub, on, t) => ({ label, sub, aria: on ? 'true' : 'false', toggle: t, track: on ? '#067A79' : '#cfc6b6', knob: on ? '20px' : '3px' });
    const pItems = [sw('Country count', 'The big number.', it.count, tog('count')), sw('Percent of the world', 'The arguable one.', it.pct, tog('pct')), sw('Map', 'Rose and blank.', it.map, tog('map')), sw('Magnus', 'Your pet inherits this whole setting.', it.dog, tog('dog')), sw('National parks', 'Off by default.', it.parks, tog('parks')), sw('Show ranges, not exact numbers. Mysterious.', '62 becomes 60+. Rewrites every card on this board.', ranges, () => this.setState({ ranges: !ranges }))];
    const pv = { off: s.level === 'off', on: s.level !== 'off', linkBox: s.level !== 'off', canRegen: s.level === 'unlisted', url: this.shareUrl().replace('https://', ''), tag: s.level === 'public' ? 'PUBLIC · INDEXABLE' : 'UNLISTED · NOT INDEXED', count: it.count, pct: it.pct, map: it.map, dog: it.dog, parks: it.parks };
    const alt = {
      percent: 'That Layover Life percent card for @yourhandle: ' + h.countStr + ' of ' + den + ' ' + unWord + ' (' + h.pctStr + ')' + (un ? ', plus 4 bonus places (Taiwan, New Caledonia, Kosovo and Antarctica)' : '') + '. Tier: ' + h.tier + '.',
      map: 'World map in the Equal Earth projection. ' + h.countStr + ' of ' + den + ' ' + unWord + ' filled in rose, lived-in countries darker with an outline, airside-only stops dotted. Antarctica shown as a separate badge.',
      passport: 'Layover passport page for @yourhandle with 12 stamps showing country codes and years only, and a joke machine-readable strip reading ' + h.countStr + ' ' + (un ? 'UN states' : 'countries') + ', ' + h.pctStr + ', member since 2026.',
      pet: 'Paw passport for Magnus, a Samoyed: ' + d.countStr + ' of ' + den + ' ' + unWord + ', paws down' + (un ? ', plus Kosovo as a bonus place' : '') + '. Approved by the human.',
      duo: 'Duo card: @yourhandle ' + h.countStr + ', Magnus ' + d.countStr + ', ' + duo.shared + ' shared countries on one map. Human countries in rose, Magnus in striped purple.'
    };
    const walker = p.motion === false ? null : React.createElement('span', { style: { position: 'absolute', left: 24, top: 0, fontSize: 17, lineHeight: '22px', display: 'inline-block', animation: 'tllWalk 16s linear infinite' } }, '🐻‍❄️');
    const qr = s.qr ? React.createElement('span', { style: { display: 'block', width: '100%', height: '100%' }, dangerouslySetInnerHTML: { __html: '<svg viewBox="0 0 ' + s.qr.n + ' ' + s.qr.n + '" width="100%" height="100%" shape-rendering="crispEdges" style="display:block"><path d="' + s.qr.d + '" style="fill:var(--ink)"></path></svg>' } }) : null;
    return {
      packN: 'SAMPLE · 9', h, d, duo, m, mapDefs: this.mapDefs(), el: E, ticks: this._ticks[tk], mrz1, mrz2, stamps, stampsFeed: stamps.slice(0, 9), petStamps, qr, walker, alt,
      guides: p.safeGuides !== false, airsideOn: p.showAirside !== false,
      cardRefs: this.cardRefs, dm, cardTypes, simBtns, exportMenu: ex, makeCard: this.makeCard, resetDemo: reset, copyLink: this.copyLink,
      copyLabel: s.copied ? 'LINK COPIED' : 'COPY LINK', demoBg: this.url && dm.preview ? "url('" + this.url + "')" : 'none', demoHref: this.url || '#',
      levels, pItems, pv, regen: () => { const c = 'abcdefghjkmnpqrstuvwxyz23456789'; let x = ''; for (let i = 0; i < 6; i++) x += c[Math.floor(Math.random() * c.length)]; this.setState({ slug: x }); }, revoke: () => this.setState({ level: 'off' })
    };
  }
}
