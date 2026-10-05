// Prototype logic: sample data, link stack, expat finder, resources, gate copy.
// Reference for copy and data shapes only; live uses Webflow CMS + Memberstack.

class Component extends DCLogic {
  state = { screen: 'home', storyIdx: 0, loggedIn: false, authMode: 'login' };

  LOUNGE = [
    {img:'images/coast2.jpg', credit:'NC · MONTENEGRO'},
    {img:'images/doha.jpg', credit:'NC · QATAR'},
    {img:'images/bulgaria.jpg', credit:'NC · BULGARIA'},
    {img:'images/ghana.jpg', credit:'NC · GHANA'},
    {img:'', credit:'NC · JAPAN'},
    {img:'images/fitzroy.jpg', credit:'NC · PATAGONIA'},
    {img:'images/antarctica.jpg', credit:'NC · ANTARCTICA'},
    {img:'images/rio.jpg', credit:'NC · BRAZIL'}
  ];

  // The six stories published on /stories (Antarctica added 2026-09-23). Titles, ledes, quotes,
  // quick answers and hero images are the live CMS values, not prototype filler.
  STORIES = [
    {place:'Antarctica', continent:'Antarctica', country:'KING GEORGE ISLAND, ANTARCTICA', pillar:'STORIES FROM THE ROAD', mins:'12 MIN',
     img:'https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6ab3d9bc5c183888afac103a_6ab3d9295c183888afabcab9_antarctica-hero-landing-in-the-sun.jpeg',
     flag:'linear-gradient(#0A0B14,#1d5e5d)',
     title:'Whiskey on 10,000-Year-Old Ice and Chasing the Impossible: The Antarctica Marathon',
     author:'Nancy Carleton',
     lede:'The honeymoon that became a four-year cancellation saga, and then the coldest, strangest, most beautiful race I have ever run. Four attempts, one pandemic, and an apartment marathon I recommend to nobody.',
     body:'The Drake Passage crossing was described to us as "gentle." The waves only reached sixty feet. Take a moment with that. I spent two days horizontal doing the same. Nobody tells you this, but the running is not the hard part of the Antarctica Marathon. The hard part is showing up at the start line at all. We needed four attempts, four years, a global pandemic, a military quarantine, and one full marathon run inside my own apartment in Copenhagen.',
     quote:'Our crossing was described as gentle, which meant the waves only reached 60 feet. I will let you sit with that sentence.',
     short:'A full 42.2km on King George Island, on gravel roads linking four research bases. Looped course, self-supported, six-hour cutoff. Roughly $11,000 to $20,300 per person plus a $275 race fee, booked years ahead, only 100 people ashore at a time. It took us four attempts.'},
    {place:'Balkans', continent:'Europe', country:'BALKANS', pillar:'TRAVEL LOGISTICS', mins:'9 MIN',
     img:'https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6aae867b7b616826932f4447_6a1183262f8a632aeff43aed_Bulgaria.jpeg',
     flag:'linear-gradient(#fff 0 33%,#00966E 33% 66%,#D62612 66% 100%)',
     title:'Fourteen days, twelve countries, one EV, and a gal who cannot be historically trusted to charge her own phone',
     author:'Nancy Carleton',
     lede:'Copenhagen to Kosovo and back in an EV, with one Samoyed operating in an advisory capacity and a back seat that ended up looking like a small artisan jam factory in transit.',
     body:'As I write, my phone sits beside its charger at half battery. The charger is plugged in. The phone is not. I had ABSOLUTELY NO business driving an EV across Eastern Europe. I did it anyway. Copenhagen to Kosovo and back. I worked remotely from Balkan lounges, a Serbian side street, and one bus that has not moved since 1974. Apparently, when adventure relies on a charged battery, I become someone who plans. New personality trait unlocked.',
     quote:'A Serbian stranger gestured follow me and led me to a charger nobody on the internet had ever heard of.',
     short:'Fourteen days, twelve countries, Copenhagen to Kosovo and back. The rule I landed on: charge more, charge earlier, do not be brave. Charging is slower than Austria and less mapped.'},
    {place:'Chile and Argentina', continent:'Americas', country:'CHILE AND ARGENTINA', pillar:'STORIES FROM THE ROAD', mins:'6 MIN',
     img:'https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6a3e79b1f2ea14b30d7a5e0f_6a0e0225995b48deb53b96e8_Fitz%2520Roy.jpeg',
     flag:'linear-gradient(90deg,#75AADB 0 33%,#fff 33% 66%,#75AADB 66% 100%)',
     title:'Patagonia, measured in Camp Italianos',
     author:'Nancy Carleton',
     lede:'Some people do vision boards. We did blisters. An accelerated W Trek over Christmas, a rainbow nobody deserved, and a New Year in the golden light at Estancia Bonanza.',
     body:'Some people do vision boards. We did blisters. This adventure started with a flight route that raised several eyebrows and at least one TSA sigh: Copenhagen to Helsinki to Miami to Punta Cana to Santiago. Questionable. Ambitious. Deeply on brand. Boxing Day was a push. Thirty-three kilometers. Mirador Britanico delivered a horizon-wide rainbow that felt wildly undeserved and absolutely perfect.',
     quote:'Not quitting and making smart safety calls are, in fact, different skill sets.',
     short:'We ran an accelerated W Trek because peak-season campsites dictated it. Boxing Day alone was thirty-three kilometers. We turned back below the Towers on local advice, and that was the right call.'},
    {place:'Montenegro', continent:'Europe', country:'MONTENEGRO', pillar:'STORIES FROM THE ROAD', mins:'3 MIN',
     img:'https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6a0e027dbb2d090c01c473b4_6a0e02265e2392e5fc632431_Montenegro%2520coast.jpeg',
     flag:'linear-gradient(#C40308 0 33%,#0C1446 33% 66%,#C40308 66% 100%)',
     title:'The annual retreat, or what happens when you put a Mangalitsa fillet and a switchback road in a blender',
     author:'Nancy Carleton',
     lede:'Montenegro\u2019s roads are about to get a quiet word from Nepal, Austria and Croatia. Narrow, one-way as a suggestion, with semi-trucks reversing down mountains.',
     body:'This was not a vacation. It was a work trip, and we descended on Budva in two waves. I drove the first group out of Podgorica in a Skoda, and I would like to formally announce that Montenegro\u2019s roads are about to get a quiet word from Nepal, Austria, and Croatia. The best drive of the week was hip-hop on blast, windows open, the road to Kotor with three colleagues.',
     quote:'Semi-trucks reversing down mountains with the casual confidence of someone parallel-parking a Fiat.',
     short:'Narrow roads, one-way as a suggestion, semi-trucks reversing downhill. The road to Kotor is the best drive of the week. Farm Carevic feeds carnivores, pescatarians and one chicken-iterian at once.'},
    {place:'Ghana', continent:'Africa', country:'GHANA', pillar:'CULTURAL INTELLIGENCE', mins:'3 MIN',
     img:'https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6a0e027dbb2d090c01c473b8_6a0e0224fb0e0ee3c092ec01_Ghana%2520kids.jpeg',
     flag:'linear-gradient(#CE1126 0 33%,#FCD116 33% 66%,#006B3F 66% 100%)',
     title:'Ghana asked us to wear all white. We complied. Eventually.',
     author:'Nancy Carleton',
     lede:'Denmark had just thrown the coldest winter in 16 years at us, the map had a gap, and we had a few days. Then we landed in a country where everyone was wearing white except us.',
     body:'We touched down in Accra dressed for a colorful print country, only to discover that in Ghana, on Easter, everyone wears all white. The whole country. Parades, brunch tables, church steps, everyone looking suspiciously photogenic. We looked like the only two people who did not get the memo, because we were. We hiked Mount Afadjato, which was steeper than the brochure implied.',
     quote:'The best part was at the base, where a circle of kids drumming for Easter sent the sound bouncing through the valley.',
     short:'Everyone wears white at Easter, the whole country. Mount Afadjato is steeper than the brochure implied. Eat at Buka: veggie curry, banku, fufu, hibiscus juice, fresh coconut.'},
    {place:'Mexico', continent:'Americas', country:'MEXICO', pillar:'STORIES FROM THE ROAD', mins:'3 MIN',
     img:'https://cdn.prod.website-files.com/6a0b29c6d081332e921900d8/6aae867b7b616826932f4444_6a0e022469c0ce59398ce287_La%2520Paz%2520Mexico.jpeg',
     flag:'linear-gradient(90deg,#006847 0 33%,#fff 33% 66%,#CE1126 66% 100%)',
     title:'La Paz, whale sharks, and a sea lion who chose chaos',
     author:'Nancy Carleton',
     lede:'Wider than your sense of scale, moving with an ease that is almost funny once the initial shock wears off. Then the sea lions, who chose chaos.',
     body:'WHALE SHARKS. Huge. Polka-dotted. Gentle giants. Silently drifting past, wider than your sense of scale, moving with an ease that is almost funny once the initial shock wears off. Meanwhile, I am absolutely more like a sea lion when it comes to aquatic life. Sea lions, true to form, chose chaos. One bold little menace grabbed scuba fins and played tug-of-war with our instructor\u2019s safety rope.',
     quote:'Sea lions, true to form, chose chaos. No fear. Full confidence.',
     short:'You can swim with whale sharks in protected waters, and most tours are led by marine biology students. Playa Balandra at sunrise. Todos Santos for quiet nights. Cabo for pastries.'}
  ];

  PILLARS = ['Layover Guides','Paw Passport','Travel Logistics','Cultural Intelligence','Stories From the Road'];

  // ISO2:Name · UN members + common travel territories · flags via circle-flags CDN (Nancy's pick)
  COUNTRY_DATA = 'af:Afghanistan|al:Albania|dz:Algeria|ad:Andorra|ao:Angola|ag:Antigua and Barbuda|ar:Argentina|am:Armenia|au:Australia|at:Austria|az:Azerbaijan|bs:Bahamas|bh:Bahrain|bd:Bangladesh|bb:Barbados|by:Belarus|be:Belgium|bz:Belize|bj:Benin|bt:Bhutan|bo:Bolivia|ba:Bosnia and Herzegovina|bw:Botswana|br:Brazil|bn:Brunei|bg:Bulgaria|bf:Burkina Faso|bi:Burundi|cv:Cabo Verde|kh:Cambodia|cm:Cameroon|ca:Canada|cf:Central African Republic|td:Chad|cl:Chile|cn:China|co:Colombia|km:Comoros|cg:Congo|cd:DR Congo|cr:Costa Rica|ci:Ivory Coast|hr:Croatia|cu:Cuba|cy:Cyprus|cz:Czechia|dk:Denmark|dj:Djibouti|dm:Dominica|do:Dominican Republic|ec:Ecuador|eg:Egypt|sv:El Salvador|gq:Equatorial Guinea|er:Eritrea|ee:Estonia|sz:Eswatini|et:Ethiopia|fj:Fiji|fi:Finland|fr:France|ga:Gabon|gm:Gambia|ge:Georgia|de:Germany|gh:Ghana|gr:Greece|gd:Grenada|gt:Guatemala|gn:Guinea|gw:Guinea-Bissau|gy:Guyana|ht:Haiti|hn:Honduras|hu:Hungary|is:Iceland|in:India|id:Indonesia|ir:Iran|iq:Iraq|ie:Ireland|il:Israel|it:Italy|jm:Jamaica|jp:Japan|jo:Jordan|kz:Kazakhstan|ke:Kenya|ki:Kiribati|kw:Kuwait|kg:Kyrgyzstan|la:Laos|lv:Latvia|lb:Lebanon|ls:Lesotho|lr:Liberia|ly:Libya|li:Liechtenstein|lt:Lithuania|lu:Luxembourg|mg:Madagascar|mw:Malawi|my:Malaysia|mv:Maldives|ml:Mali|mt:Malta|mh:Marshall Islands|mr:Mauritania|mu:Mauritius|mx:Mexico|fm:Micronesia|md:Moldova|mc:Monaco|mn:Mongolia|me:Montenegro|ma:Morocco|mz:Mozambique|mm:Myanmar|na:Namibia|nr:Nauru|np:Nepal|nl:Netherlands|nz:New Zealand|ni:Nicaragua|ne:Niger|ng:Nigeria|mk:North Macedonia|no:Norway|om:Oman|pk:Pakistan|pw:Palau|pa:Panama|pg:Papua New Guinea|py:Paraguay|pe:Peru|ph:Philippines|pl:Poland|pt:Portugal|qa:Qatar|ro:Romania|ru:Russia|rw:Rwanda|kn:Saint Kitts and Nevis|lc:Saint Lucia|vc:Saint Vincent|ws:Samoa|sm:San Marino|st:Sao Tome and Principe|sa:Saudi Arabia|sn:Senegal|rs:Serbia|sc:Seychelles|sl:Sierra Leone|sg:Singapore|sk:Slovakia|si:Slovenia|sb:Solomon Islands|so:Somalia|za:South Africa|kr:South Korea|ss:South Sudan|es:Spain|lk:Sri Lanka|sd:Sudan|sr:Suriname|se:Sweden|ch:Switzerland|sy:Syria|tj:Tajikistan|tz:Tanzania|th:Thailand|tl:Timor-Leste|tg:Togo|to:Tonga|tt:Trinidad and Tobago|tn:Tunisia|tr:Turkiye|tm:Turkmenistan|tv:Tuvalu|ug:Uganda|ua:Ukraine|ae:United Arab Emirates|gb:United Kingdom|us:United States|uy:Uruguay|uz:Uzbekistan|vu:Vanuatu|va:Vatican City|ve:Venezuela|vn:Vietnam|ye:Yemen|zm:Zambia|zw:Zimbabwe|aq:Antarctica';

  STORY_COUNTRIES = { aq: 0, bg: 1, rs: 1, xk: 1, al: 1, cl: 2, ar: 2, me: 3, gh: 4, mx: 5 };

  // The member roster IS the counter — add a member here and every count updates.
  // In production this binds to the Memberstack member count, never a hard-coded number.
  MEMBERS = ['Nancy Carleton'];

  aboutCounterTitle() {
    const n = this.MEMBERS.length;
    const WORDS = ['zero','one','two','three','four','five','six','seven','eight','nine'];
    const w = n < 10 ? WORDS[n] : String(n);
    return 'A travel magazine with ' + w + ' ' + (n === 1 ? 'writer' : 'writers') + ' and open doors.';
  }

  WIRE = [
    {region:'EUROPE', regionColor:'#F0507A', country:'SCHENGEN AREA', source:'REUTERS', when:'2H AGO', title:'EES biometric border checks expand to all Schengen air entries', sum:'The Entry/Exit System now covers every non-EU arrival by air; first-time registrations add 5 to 10 minutes at the booth.', take:'Budget an extra 30 minutes on your first EU entry this year. After that it is fingerprints and go.'},
    {region:'ASIA', regionColor:'#067A79', country:'JAPAN', source:'SKIFT', when:'5H AGO', title:'Japan raises the departure tax to fund overtourism measures', sum:'The sayonara tax triples, folded into ticket prices from October; proceeds ringfenced for regional rail and trail maintenance.', take:'Still cheaper than one Yamanote-loop breakfast. Book shoulder season and the crowds fund your trails.'},
    {region:'EUROPE', regionColor:'#F0507A', country:'DENMARK', source:'SIMPLE FLYING', when:'8H AGO', title:'Copenhagen Airport opens a dedicated pet relief zone airside', sum:'CPH adds a 200 m² airside relief and water area in Terminal 3, the first in the Nordics.', take:'Magnus has opinions about the gravel. A 13-country dog approves of the water fountain.'},
    {region:'AMERICAS', regionColor:'#D98A2B', country:'UNITED STATES', source:'THE POINTS GUY', when:'11H AGO', title:'US carriers standardize in-cabin pet fees on transatlantic routes', sum:'Three majors align at one flat fee each way; weight limits unchanged, booking windows widen to 330 days.', take:'Predictable beats cheap. Book the pet slot the day the calendar opens — they still cap at four per cabin.'},
    {region:'MIDDLE EAST', regionColor:'#C8425E', country:'QATAR', source:'AP', when:'14H AGO', title:'Doha extends free transit visas to 96 hours', sum:'Qatar doubles the stopover window for 95 nationalities; hotel stopover packages relaunch with the change.', sumq:1, take:'Eight hours was enough for one mistake and one correction. Ninety-six is a whole second act.'},
    {region:'AFRICA', regionColor:'#067A79', country:'GHANA', source:'BBC TRAVEL', when:'1D AGO', title:'Accra named among top cultural capitals for 2027 travel', sum:'Detty December momentum carries into year-round programming; direct routes from three new European hubs announced.'},
    {region:'EUROPE', regionColor:'#F0507A', country:'BULGARIA', source:'LONELY PLANET NEWS', when:'1D AGO', title:'Sofia metro extension reaches Vitosha trailheads', sum:'Line 3 now runs to the mountain gondola; airport-to-trail in under an hour on one ticket.', take:'The 9am rakia is now 40 minutes closer to the summit. Correlation, not causation.'},
    {region:'OCEANIA', regionColor:'#6B6660', country:'NEW ZEALAND', source:'REUTERS', when:'2D AGO', title:'NZ trials digital arrival declarations for all visitors', sum:'Paper cards retired at Auckland and Christchurch; the app declaration opens 24 hours before landing.'}
  ];

  QUEUE = [
    { title: 'The Night Ferry to Helsinki Smelled Like Cardamom', meta: 'FINLAND · PRIYA M. · NAMED · SUBMITTED 14H AGO', clock: '34H LEFT', clockColor: '#067A79', voice: 86, seo: 74, dashes: 0, banned: 'None — clean.', flagged: false,
      excerpt: 'The 17:30 ferry out of Stockholm carries two kinds of people: the ones going home and the ones who missed something. I was the third kind, the one with a cinnamon bun in each pocket.',
      disclosure: 'NONE DECLARED', credit: 'NAMED', photos: '1 HERO + 4 GALLERY',
      quotes: ['The ferry carries two kinds of people: the ones going home and the ones who missed something.', 'A cinnamon bun in each pocket is a personality, not a snack.', 'Helsinki at 07:00 forgives everything.'] },
    { title: 'Doha in Eight Hours, Including the Mistake', meta: 'QATAR · SEB A. · PEN NAME · SUBMITTED 39H AGO', clock: '9H LEFT', clockColor: '#C8425E', voice: 71, seo: 58, dashes: 3, banned: 'None — clean.', flagged: true,
      excerpt: 'The Souq Waqif falconry shops open at four. The mistake was believing the metro map instead of the man selling karak outside the station, who was right about everything.',
      disclosure: 'HOSTED — QATAR TOURISM (DECLARED IN PITCH)', credit: 'PEN NAME', photos: '1 HERO + 2 GALLERY',
      quotes: ['The man selling karak outside the station was right about everything.', 'Eight hours is enough for one mistake and one correction.', 'Falcons before breakfast recalibrate a person.'] },
    { title: 'My Dog Failed the Ferry Etiquette Test in Tallinn', meta: 'ESTONIA · MAYA K. · NAMED · SUBMITTED 3H AGO', clock: '45H LEFT', clockColor: '#067A79', voice: 92, seo: 81, dashes: 0, banned: 'None — clean.', flagged: false,
      excerpt: 'Bruno, a Bernese with the self-image of a lapdog, boarded the Tallink ferry convinced the pet corner was a suggestion. The Estonian grandmother in seat 14C disagreed, then fed him herring.',
      disclosure: 'NONE DECLARED', credit: 'NAMED', photos: '1 HERO + 6 GALLERY',
      quotes: ['Bruno boarded convinced the pet corner was a suggestion.', 'The grandmother in 14C disagreed, then fed him herring.', 'Ferry etiquette is negotiable. Herring is not.'] }
  ];

  wireVals(screen) {
    const REGIONS = ['ALL REGIONS','EUROPE','ASIA','AMERICAS','AFRICA','MIDDLE EAST','OCEANIA'];
    const sel = this.state.wireRegion || 0;
    const items = this.WIRE.filter(w => sel === 0 || w.region === REGIONS[sel]);
    const q = (this.state.searchQ || '').trim();
    return {
      isWire: screen === 'wire',
      wireRegions: REGIONS.map((label, i) => ({
        label,
        color: i === sel ? '#F7F1E8' : '#3a3a3a',
        bg: i === sel ? '#0A0B14' : '#fff',
        border: i === sel ? '#0A0B14' : '#E0DACE',
        pick: () => this.setState({wireRegion: i})
      })),
      wireItems: items.map(w => ({...w, hasTake: !!w.take})),
      blogWireItems: [
        {title:'Ljubljana has quietly become the best layover in the Balkans', blog:'THE SLOW ROUTE', author:'MARTA K.', when:'3H AGO', region:'EUROPE'},
        {title:'Taking a 40kg dog on the Santander ferry: what nobody tells you', blog:'FOUR PAWS ABROAD', author:'DAVID R.', when:'YESTERDAY', region:'EUROPE'}
      ],
      blogApplied: this.state.blogApplied === true,
      blogNotApplied: this.state.blogApplied !== true,
      applyBlog: () => this.setState({blogApplied: true}),
      countryWire: this.WIRE.filter(w => w.country === 'BULGARIA'),
      hasCountryWire: this.WIRE.some(w => w.country === 'BULGARIA'),
      wireEmpty: items.length === 0,
      goWire: () => { this.setState({screen:'wire'}); window.scrollTo(0,0); },
      goForPress: () => { this.setState({screen:'forpress'}); window.scrollTo(0,0); },
      goForExpats: () => { this.setState({screen:'forexpats'}); window.scrollTo(0,0); },
      noFrontHide: screen === 'stories' && !q && !(this.state.locFilter || 0) && !(this.state.sortBy || 0),
      mostRead: [this.STORIES[1], this.STORIES[0]].map(s => {
        const i = this.STORIES.indexOf(s);
        return {...s, open: () => { this.setState({screen:'story', storyIdx:i}); window.scrollTo(0,0); }};
      })
    };
  }

  editorVals(screen) {
    const idx = this.state.editorIdx;
    const inReview = screen === 'editor' && idx != null;
    const cur = inReview ? this.QUEUE[idx] : null;
    const decided = this.state['decision' + idx];
    const scoreColor = v => v >= 80 ? '#00C9C8' : v >= 60 ? '#D98A2B' : '#FF7093';
    return {
      isEditor: screen === 'editor' && this.state.loggedIn,
      editorQueueView: screen === 'editor' && idx == null,
      editorReviewView: inReview,
      queueCount: this.QUEUE.length,
      queue: this.QUEUE.map((s, i) => ({
        ...s, border: s.flagged ? '#D98A2B' : '#23263c',
        voiceColor: scoreColor(s.voice), seoColor: scoreColor(s.seo),
        dashColor: s.dashes === 0 ? '#00C9C8' : '#FF7093',
        open: () => { this.setState({editorIdx: i}); window.scrollTo(0,0); }
      })),
      backToQueue: () => this.setState({editorIdx: null}),
      curTitle: cur ? cur.title : '', curMeta: cur ? cur.meta : '', curExcerpt: cur ? cur.excerpt : '',
      curDisclosure: cur ? cur.disclosure : '', curCredit: cur ? cur.credit : '', curPhotos: cur ? cur.photos : '',
      curVoice: cur ? cur.voice : '', curSeo: cur ? cur.seo : '', curDashes: cur ? cur.dashes : '',
      curVoiceColor: cur ? scoreColor(cur.voice) : '#4a4d63', curSeoColor: cur ? scoreColor(cur.seo) : '#4a4d63',
      curDashColor: cur && cur.dashes === 0 ? '#00C9C8' : '#FF7093',
      curBanned: cur ? cur.banned : '', curBannedColor: cur && cur.banned.startsWith('None') ? '#7de8e7' : '#FF7093',
      curQuotes: cur ? cur.quotes.map((q, qi) => ({
        text: q,
        bg: (this.state['pq' + idx] ?? 0) === qi ? '#0d2b2a' : '#0A0B14',
        border: (this.state['pq' + idx] ?? 0) === qi ? '#067A79' : '#2b2f52',
        pick: () => this.setState({['pq' + idx]: qi})
      })) : [],
      editorNote: this.state.editorNote ?? '',
      setEditorNote: (e) => this.setState({editorNote: e.target.value}),
      decidePublish: () => this.setState({['decision' + idx]: 'Published. The story goes live with the picked pull quote; the writer gets the note and the link.'}),
      decideChanges: () => this.setState({['decision' + idx]: 'Changes requested. The writer gets your note, the AI flags, and the draft stays on their shelf.'}),
      decideDecline: () => this.setState({['decision' + idx]: 'Declined, with reasons attached. The writer can contest — a human re-reads.'}),
      hasDecision: !!decided,
      decisionNote: decided || ''
    };
  }

  renderVals() {
    const {screen, storyIdx, loggedIn, authMode} = this.state;
    const go = s => () => { this.setState({screen: s}); window.scrollTo(0,0); };
    const NAV = [['stories','Stories'],['destinations','Destinations'],['travelers','Travelers'],['paw','Paw Passport'],['about','About']];
    const navItems = NAV.map(([k,label]) => ({
      label,
      color: (screen === k || (k==='stories' && screen==='story')) ? '#00C9C8' : '#b8b4ad',
      weight: (screen === k) ? 700 : 400,
      go: go(k)
    }));
    let stories = this.STORIES.map((s,i) => ({...s, open: () => { this.setState({screen:'story', storyIdx:i}); window.scrollTo(0,0); }}));
    const q = (this.state.searchQ || '').trim().toLowerCase();
    if (screen === 'stories' && q) {
      stories = stories.filter(s => [s.title, s.country, s.pillar, s.lede, s.author, s.continent].join(' ').toLowerCase().includes(q));
    }
    const lf = this.state.locFilter || 0;
    if (screen === 'stories') {
      if (lf >= 1 && lf <= 4) { const cont = ['Europe','Africa','Americas','Antarctica'][lf-1]; stories = stories.filter(s => s.continent === cont); }
      const sb = this.state.sortBy || 0;
      if (sb === 1 || lf === 5) stories = [...stories].sort((a,b) => a.place.localeCompare(b.place));
      if (lf === 6) stories = [...stories].sort((a,b) => a.place.localeCompare(b.place)); // city grouping placeholder: same order until cities are logged
      if (sb === 2) stories = [...stories].sort((a,b) => parseInt(a.mins) - parseInt(b.mins));
    }
    return {
      navItems, stories,
      pillars: this.PILLARS,
      isHome: screen==='home', isStories: screen==='stories', isStory: screen==='story',
      isTravelers: screen==='travelers', isPaw: screen==='paw', isAbout: screen==='about',
      // Memberstack gating: these screens are the data-ms-content="members" half.
      // Logged out they render the gate block below (the "anonymous" half) instead.
      isShare: screen==='share' && loggedIn,
      isCountry: screen==='country',
      isProfile: screen==='profile',
      isNotFound: screen==='notfound', isDirectory: screen==='directory',
      isEditProfile: screen==='editprofile' && loggedIn,
      isSpotlight: screen==='spotlight',
      isFaq: screen==='faq', isSupport: screen==='support',
      isRecruit: screen==='foraffiliates',
      isExpatsPage: screen==='forexpats', isPressPage: screen==='forpress',
      goEditProfile: go('editprofile'),
      applyExpat: () => this.setState({appliedExpat: !this.state.appliedExpat}),
      applyPress: () => this.setState({appliedPress: !this.state.appliedPress}),
      applyBlogProfile: () => this.setState({blogApplied: !this.state.blogApplied}),
      blogBtnLabel: this.state.blogApplied ? '✓ Applied · in review' : 'Apply · Blog Desk',
      blogBtnBg: this.state.blogApplied ? '#7de8e7' : '#D98A2B',
      expatBtnLabel: this.state.appliedExpat ? '✓ Applied · in review' : 'Apply · Location Expert',
      expatBtnBg: this.state.appliedExpat ? '#067A79' : '#F0507A',
      pressBtnLabel: this.state.appliedPress ? '✓ Applied · in review' : 'Apply · Press',
      pressBtnBg: this.state.appliedPress ? '#7de8e7' : '#00C9C8',
      isMyPets: screen==='mypets' && loggedIn, isPawPassport: screen==='pawpassport', isPets: screen==='pets',
      isMap: screen==='map', isCharter: screen==='charter', isGuidelines: screen==='guidelines',
      isSharePhotos: screen==='sharephotos' && loggedIn, isStyleGuide: screen==='styleguide', isShareCard: screen==='sharecard',
      cardLine: this.state.cardLine ?? '',
      hasCardLine: !!(this.state.cardLine && this.state.cardLine.trim()),
      setCardLine: (e) => this.setState({cardLine: e.target.value}),
      isLegal: screen==='legal', isContact: screen==='contact', isCookies: screen==='cookies', isForgot: screen==='forgot',
      goExpats: go('forexpats'), goPress: go('forpress'), goAffiliates: go('foraffiliates'),
      goMyPets: go('mypets'), goPawPassport: go('pawpassport'), goSupport: go('support'),
      goSharePhotos: go('sharephotos'),
      // Opt-in link stack ("travel linktree"). Every link is private until switched on.
      // Live: Memberstack custom fields link-{type} + link-{type}-on; pets: Pets CMS fields.
      ...(() => {
        const META = {website:['Blog or website','WEB','yourblog.com'], newsletter:['Newsletter','NEWS','yours.substack.com'], instagram:['Instagram','IG','@handle'], tiktok:['TikTok','TT','@handle'], youtube:['YouTube','YT','@channel'], strava:['Strava','STRAVA','strava.com/athletes/you'], other:['Anything else','LINK','your-link.com']};
        const myL = this.state.myLinks || [{t:'website',url:'thatlayover.life',on:true},{t:'newsletter',url:'',on:false},{t:'instagram',url:'@nancycarleton',on:true},{t:'tiktok',url:'',on:false},{t:'youtube',url:'@nancycarleton',on:true},{t:'strava',url:'',on:false},{t:'other',url:'linktr.ee/nancycarleton',on:true}];
        const petL = this.state.petLinks || [{t:'instagram',url:'',on:false},{t:'tiktok',url:'',on:false},{t:'youtube',url:'',on:false}];
        const setL = (key, arr, i, patch) => this.setState({[key]: arr.map((x,j) => j===i ? {...x, ...patch} : x)});
        const edit = (key, arr) => arr.map((l,i) => ({ t: l.t, label: META[l.t][0], badge: META[l.t][1], ph: META[l.t][2], phFull: META[l.t][0] + ' · ' + META[l.t][2], url: l.url,
          setUrl: e => setL(key, arr, i, {url: e.target.value}),
          toggle: () => setL(key, arr, i, {on: !l.on}),
          tgLabel: l.on ? 'SHOWN' : 'HIDDEN',
          tgBg: l.on ? '#067A79' : '#fff', tgColor: l.on ? '#fff' : '#6B6660', tgBorder: l.on ? '#067A79' : '#E0DACE',
          tgDarkBg: l.on ? '#00C9C8' : 'transparent', tgDarkColor: l.on ? '#06302f' : '#7d7f96', tgDarkBorder: l.on ? '#00C9C8' : '#2b2f52' }));
        const pub = arr => arr.filter(l => l.on && l.url.trim()).map(l => ({ label: META[l.t][0], badge: META[l.t][1], url: l.url.trim(), stop: e => e.stopPropagation() }));
        const pl = pub(myL), ppl = pub(petL);
        const tf = this.state.travFilter || 0;
        return {
          linkEditRows: edit('myLinks', myL),
          signupLinkRows: edit('myLinks', myL).filter(r => ['website','instagram','tiktok'].includes(r.t)),
          petEditRows: edit('petLinks', petL),
          publicLinks: pl, hasPublicLinks: pl.length > 0, noPublicLinks: pl.length === 0, cardLinks: pl.slice(0,4),
          petPublicLinks: ppl, petHasLinks: ppl.length > 0, petNoLinks: ppl.length === 0,
          signupLinksOpen: !!this.state.signupLinksOpen, signupLinksIcon: this.state.signupLinksOpen ? '−' : '+',
          toggleSignupLinks: () => this.setState({signupLinksOpen: !this.state.signupLinksOpen}),
          travFilters: ['Everyone','Founder','Location Experts','Press','Travel companions'].map((l,i) => ({label: l, pick: () => this.setState({travFilter: i}),
            bg: tf===i ? '#0A0B14' : '#fff', color: tf===i ? '#F7F1E8' : '#3a3a3a', border: tf===i ? '#0A0B14' : '#E0DACE'})),
          showFounders: tf===0 || tf===1, showExperts: tf===0 || tf===2, showPress: tf===0 || tf===3, showPets: tf===0 || tf===4,
        };
      })(),
      tabExpats: screen==='forexpats' ? '#00C9C8' : '#9a958d',
      tabPress: screen==='forpress' ? '#00C9C8' : '#9a958d',
      tabAffiliates: screen==='foraffiliates' ? '#00C9C8' : '#9a958d',
      recruitEyebrow: screen==='forpress' ? 'FOR PRESS · CREDENTIALED, DISCLOSED' : screen==='foraffiliates' ? 'FOR AFFILIATES · LABELED, NEVER HIDDEN' : 'FOR EXPATS · LIVING IT, NOT PASSING THROUGH',
      recruitAccent: screen==='forpress' ? '#00C9C8' : screen==='foraffiliates' ? '#D98A2B' : '#F0507A',
      recruitTitle: screen==='forpress' ? 'Disclosure at the top,' : screen==='foraffiliates' ? 'Bring your audience,' : 'Eight years somewhere beats',
      recruitAccentWord: screen==='forpress' ? 'never buried.' : screen==='foraffiliates' ? 'keep your links.' : 'eight days everywhere.',
      recruitSub: screen==='forpress' ? 'Press travelers welcome. Every hosted or gifted trip labeled at the top of the story.' : screen==='foraffiliates' ? 'Affiliate links welcome when labeled. A founding-partner invitation, honestly pre-launch.' : 'Bring the local truth. We credit you and link you, byline up top.',
      recruitCards: screen==='forpress'
        ? [{t:'Bylined features',b:'Your name, your outlet, your links. Person schema on your profile.'},{t:'Disclosure built in',b:'Hosted trips labeled at the top. Your compliance team will approve.'},{t:'48-hour review',b:'One human editor. No committee, no six-week queue.'}]
        : screen==='foraffiliates'
        ? [{t:'Labeled links',b:'Reklamelink markers inline, disclosure up top. Danish rules, done right.'},{t:'Founding partner',b:'Pre-launch honesty: small reach today, first position tomorrow.'},{t:'Real terms',b:'A programme page with terms and process, not a poster.'}]
        : [{t:'A profile that is yours',b:'Byline, bio, links, and your map. The platform is the people.'},{t:'Credited and linked',b:'We credit you and link your site and Substack on your stories.'},{t:'Your voice stays',b:'Edited lightly. No rewriting your sentences into ours.'}],
      faqItems: [
        {q:'What is That Layover Life?', a:'A community travel magazine. Real travelers writing about specific places on specific dates, read and published by an actual editor in Copenhagen.'},
        {q:'Is it free?', a:'Yes. Free to read, free to join, no paywall, no newsletter bribe.'},
        {q:'How do I get published?', a:'Share your story. A human reviews it within 48 hours, including weekends. Your byline stays yours: named, pen name, or anonymous traveler.'},
        {q:'Can I bring my dog?', a:'The Paw Passport exists for exactly this. EU pet passport logistics, large-dog hotels, and Magnus 🐻‍❄️ as proof of concept.'},
        {q:'Do you take press trips?', a:'Yes, disclosed at the top of the story, never buried in a footnote.'},
        {q:'Who reads my submission?', a:'Nancy. An AI tool flags typos and em dashes first; a human makes every decision.'}
      ],
      supportCards: [
        {tag:'CORRECTIONS', color:'#00C9C8', title:'Fix a story', body:'Wrong price, renamed cafe, moved trailhead. Tell us, we fix it and note it.', sla:'REPLY WITHIN 48H', subject:'SUBJECT: CORRECTION', mailto:'mailto:hello@thatlayover.life?subject=CORRECTION'},
        {tag:'ACCOUNT', color:'#F0507A', title:'Delete my account', body:'Self-serve from Account settings, or email with subject DELETE.', sla:'DONE WITHIN 30 DAYS', subject:'SUBJECT: DELETE', mailto:'mailto:hello@thatlayover.life?subject=DELETE'},
        {tag:'TAKEDOWNS', color:'#D98A2B', title:'Remove content', body:'Your photo, your face, your rights. Fast-track for people pictured who did not submit.', sla:'ACKNOWLEDGED IN 72H', subject:'SUBJECT: TAKEDOWN', mailto:'mailto:hello@thatlayover.life?subject=TAKEDOWN'},
        {tag:'APPEALS', color:'#00C9C8', title:'Contest a decision', body:'Removed content comes with reasons. Disagree? A human re-reads it.', sla:'REPLY WITHIN 7 DAYS', subject:'SUBJECT: APPEAL', mailto:'mailto:hello@thatlayover.life?subject=APPEAL'},
        {tag:'DATA', color:'#F0507A', title:'Export my data', body:'JSON for your data, Markdown for your stories. Email subject DATA EXPORT.', sla:'SENT WITHIN ONE MONTH', subject:'SUBJECT: DATA EXPORT', mailto:'mailto:hello@thatlayover.life?subject=DATA%20EXPORT'},
        {tag:'PRESS', color:'#D98A2B', title:'Press inquiries', body:'Quotes, interviews, the story behind the magazine.', sla:'USUALLY SAME DAY', subject:'SUBJECT: PRESS', mailto:'mailto:hello@thatlayover.life?subject=PRESS'}
      ],
      charterRules: [
        {n:'01', t:'Named human travelers', b:'Every byline is a real person: named, pen name, or anonymous traveler. Never a machine.'},
        {n:'02', t:'No chatbot drafts', b:'AI may flag typos and em dashes. It writes nothing. A human makes every editorial decision.'},
        {n:'03', t:'Disclosure at the top', b:'Hosted or gifted travel is labeled at the top of the story, never buried in a footnote.'},
        {n:'04', t:'Your byline stays yours', b:'You keep copyright. TLL is a publishing venue, not a rights grab. Withdraw any time.'},
        {n:'05', t:'Specific or nothing', b:'Named streets, real prices, actual dates. If it could describe anywhere, it runs nowhere.'},
        {n:'06', t:'Corrections owned in public', b:'We fix errors visibly and say what changed. No silent edits.'},
        {n:'07', t:'Reviewed within 48 hours', b:'One human editor, one promise: you hear back within two days, including weekends.'},
        {n:'08', t:'Paid work never buys a verdict', b:'Brands hire The Brand Collective, never space on TLL. If paid work touches a story, it says Reklame at the top and names who paid. Full policy below.'}
      ],
      guidelineRules: [
        {icon:'📷', t:'Your own photos and words', b:'You took it, you wrote it, or you have the right to publish it. Nothing lifted.'},
        {icon:'📍', t:'Real places, real dates', b:'Specifics are the currency here. Invented detail gets the whole piece pulled.'},
        {icon:'🏷', t:'Disclose commercial ties', b:'Hosted trips, gifted gear, affiliate links: label them or leave them out.'},
        {icon:'🧑‍🤝‍🧑', t:'Photo subjects said yes', b:'If a person is the clear subject, they agreed to appear. Crowd scenes are fine. No children as subjects without a parent or guardian\u2019s permission.'},
        {icon:'🚫', t:'Zero tolerance for harassment', b:'One warning is one more than most places give. Then the door.'}
      ],
      legalTab: this.state.legalTab || 'privacy',
      legalTitle: (this.state.legalTab || 'privacy')==='privacy' ? 'Privacy policy.' : 'Terms of service.',
      pickPrivacy: () => this.setState({legalTab:'privacy'}),
      pickTerms: () => this.setState({legalTab:'terms'}),
      privacyBorder: (this.state.legalTab||'privacy')==='privacy' ? '#0A0B14' : '#d8d2c6',
      privacyBg: (this.state.legalTab||'privacy')==='privacy' ? '#0A0B14' : '#fff',
      privacyColor: (this.state.legalTab||'privacy')==='privacy' ? '#F7F1E8' : '#3a3a3a',
      termsBorder: (this.state.legalTab||'privacy')==='terms' ? '#0A0B14' : '#d8d2c6',
      termsBg: (this.state.legalTab||'privacy')==='terms' ? '#0A0B14' : '#fff',
      termsColor: (this.state.legalTab||'privacy')==='terms' ? '#F7F1E8' : '#3a3a3a',
      legalSections: (this.state.legalTab||'privacy')==='privacy'
        ? [
          {t:'What we collect, and the legal basis for each', b:'Account data to run your account (contract). Analytics and non-essential cookies only with consent. Security logs on legitimate interest, named as such.'},
          {t:'Public profiles are public', b:'Your name, city, and map are an indexable page. Here is how to make a profile private.'},
          {t:'Processors, named', b:'Memberstack, Webflow, GA4, Cookiebot, Google Sign-In, Substack (US, with named transfer safeguards per recipient).'},
          {t:'AI-assisted first read, disclosed', b:'An AI tool gives submissions a first read. A human makes the final decision, so no automated decision-making applies. You can contest and request human review.'},
          {t:'Your rights, with real routes', b:'Export: email subject DATA EXPORT, sent within one month. Delete: self-serve or email. Complaints: Datatilsynet, Carl Jacobsens Vej 35, 2500 Valby.'}
        ]
        : [
          {t:'You keep ownership', b:'TLL is a publishing venue, not a copyright transfer. Your byline stays yours.'},
          {t:'What you license us', b:'Display on TLL and the newsletter, with credit. No sublicensing, no selling, no AI training. Ever.'},
          {t:'If you withdraw', b:'We remove your story within 14 days. Copies in past newsletters cannot be recalled.'},
          {t:'Reviewed within 48 hours', b:'Submissions get a human read within two days. Publishing is a decision, not a promise.'},
          {t:'Prospective changes only', b:'New terms apply to new submissions. What you already sent stays under the terms you agreed to.'},
          {t:'Stories are the writer\u2019s own account', b:'TLL publishes in good faith but is not liable for inaccuracies, and does not represent its authors or submitters. Verify the timetable before you run for the train.'},
          {t:'Hate has no home here', b:'Hateful content is removed, its author is done publishing with us, and there is no second warning.'}
        ],
      cookieCats: [
        {dot:'#F0507A', t:'Necessary', b:'Login session (Memberstack) and your consent choice itself (Cookiebot). Cannot be switched off.'},
        {dot:'#00C9C8', t:'Preferences', b:'Remembers choices like your map settings so you make them once.'},
        {dot:'#D98A2B', t:'Statistics', b:'Google Analytics 4, consent-gated, retained 14 months. Tells us which stories get read.'},
        {dot:'#6B6660', t:'Marketing', b:'Not currently used. If that changes, this page changes first.'}
      ],
      goCountry: go('country'),
      goProfile: go('profile'),
      openStory0: () => { this.setState({screen:'story', storyIdx:1}); window.scrollTo(0,0); },
      shareFormOpacity: 1,
      shareSaveNote: 'DRAFT SAVED 12 SECONDS AGO',
      ...(() => {
        // The anonymous half of each gated page. Copy is per page, the mechanism is one Memberstack split.
        const GATES = {
          share: ['PEN A TALE', 'An account first, then the story.', 'Submissions are tied to a byline, which means an account. It takes a minute, it is free, and it means your draft autosaves instead of vanishing when the airport wifi gives up.'],
          sharephotos: ['THE LAYOVER LOUNGE', 'Photos need a name attached.', 'Every photo in the Lounge is credited to a real person, so the upload lives behind an account. One minute, no cost, and your shots stay yours.'],
          mypets: ['PAW PASSPORT', 'Your bestie needs an account too.', 'Technically you need the account. Register once and every pet you travel with gets their own public passport page.'],
          editprofile: ['EDIT PROFILE', 'This is your profile, so we need to know it is you.', 'Log in to edit your bio, your labels, your links, and the countries that drive your map.'],
          account: ['YOUR ACCOUNT', 'Welcome back, presumably.', 'Log in to see your map, your drafts, your pets, and everything else the roster knows about you.'],
          editor: ["EDITOR'S DESK", 'This desk is Nancy\u2019s.', 'The review queue is restricted to the editor role. If you are here by accident, the library is the better door.']
        };
        const g = GATES[screen] || GATES.account;
        // The editor desk is role-restricted, not a signup funnel: no join CTA, no free pitch.
        const roleOnly = screen === 'editor';
        return { isGate: !!GATES[screen] && !loggedIn, gateEyebrow: g[0], gateHeadline: g[1], gateBody: g[2],
          gateJoinDisplay: roleOnly ? 'none' : 'inline-block', gateFreeDisplay: roleOnly ? 'none' : 'block' };
      })(),
      locFilters: ['All places','Europe','Africa','Americas','Antarctica','By country','By city'].map((l,i) => ({
        label: l,
        border: (this.state.locFilter||0)===i ? '#0A0B14' : '#d8d2c6',
        bg: (this.state.locFilter||0)===i ? '#0A0B14' : 'transparent',
        color: (this.state.locFilter||0)===i ? '#fff' : '#3a3a3a',
        weight: (this.state.locFilter||0)===i ? 700 : 400,
        pick: () => this.setState({locFilter: i})
      })),
      sortOpts: ['Most recent','A→Z by country','Read time'].map((l,i) => ({
        label: l,
        border: (this.state.sortBy||0)===i ? '#0A0B14' : '#d8d2c6',
        bg: (this.state.sortBy||0)===i ? '#0A0B14' : 'transparent',
        color: (this.state.sortBy||0)===i ? '#fff' : '#3a3a3a',
        weight: (this.state.sortBy||0)===i ? 700 : 400,
        pick: () => this.setState({sortBy: i})
      })),
      story: stories[storyIdx],
      storySponsored: !!(this.STORIES[storyIdx] && this.STORIES[storyIdx].sponsor),
      storySponsorName: (this.STORIES[storyIdx] && this.STORIES[storyIdx].sponsor) || '',
      aboutEyebrow: screen==='share' ? 'SHARE YOUR STORY · DOORS OPENING' : 'ABOUT',
      aboutTitle: screen==='share' ? 'Submissions open soon. Yours can be first in line.' : this.aboutCounterTitle(),
      aboutBody: screen==='share'
        ? 'The submission tool is being built right now. Until it opens: tell us where you have been and we will come find you. When it ships, your story gets a human read within 48 hours, with a light edit that keeps your voice and a byline that stays yours.'
        : 'That Layover Life started with one traveler, 87 countries, and a Samoyed in an advisory capacity. It is being written in public while the doors open: real places, real opinions, real names. The platform is the people.',
      footerStats: this.STORIES.length + ' STORIES · ' + new Set(this.STORIES.map(s => s.country)).size + ' COUNTRIES · 1 TRAVELER · 1 PET',
      searchQ: this.state.searchQ ?? '',
      hasSearchQ: !!q,
      noResults: screen==='stories' && !!q && stories.length===0,
      setSearchQ: (e) => this.setState({searchQ: e.target.value}),
      nlEmail: this.state.nlEmail ?? '',
      nlSent: !!this.state.nlSent,
      nlNotSent: !this.state.nlSent,
      setNlEmail: (e) => this.setState({nlEmail: e.target.value}),
      nlSubmit: () => { if ((this.state.nlEmail||'').includes('@')) this.setState({nlSent: true}); },
      nlKey: (e) => { if (e.key === 'Enter' && (this.state.nlEmail||'').includes('@')) this.setState({nlSent: true}); },
      clearSearch: () => this.setState({searchQ: ''}),
      goSearch: () => { this.setState({screen:'stories'}); window.scrollTo(0,0); },
      searchKey: (e) => { if (e.key === 'Enter') { this.setState({screen:'stories'}); window.scrollTo(0,0); } },
      isShareStep1: (this.state.shareStep ?? 1) === 1 && !this.state.shareSubmitted,
      isShareStep2: (this.state.shareStep ?? 1) === 2 && !this.state.shareSubmitted,
      isShareStep3: (this.state.shareStep ?? 1) === 3 && !this.state.shareSubmitted,
      shareSubmitted: !!this.state.shareSubmitted,
      stepBar1: (this.state.shareStep ?? 1) >= 1 ? '#F0507A' : '#E0DACE',
      stepBar2: (this.state.shareStep ?? 1) >= 2 ? '#F0507A' : '#E0DACE',
      stepBar3: (this.state.shareStep ?? 1) >= 3 ? '#F0507A' : '#E0DACE',
      shareGo1: () => this.setState({shareStep: 1, shareSubmitted: false}),
      shareGo2: () => this.setState({shareStep: 2, shareSubmitted: false}),
      shareGo3: () => this.setState({shareStep: 3, shareSubmitted: false}),
      shareSubmit: () => { this.setState({shareSubmitted: true}); window.scrollTo(0,0); },
      ...this.editorVals(screen),
      ...this.wireVals(screen),
      goHome: go('home'), goStories: go('stories'), goTravelers: go('travelers'),
      goPaw: go('paw'), goAbout: go('about'), goShare: go('share'),
      aboutPhotoA: (this.state.aboutPhoto||'A')==='A', aboutPhotoB: this.state.aboutPhoto==='B', aboutPhotoC: this.state.aboutPhoto==='C',
      aboutPhotoTabs: [['A','A · Green, window'],['B','B · Rust, midnight'],['C','C · Black and white']].map(([k,l]) => { const on = (this.state.aboutPhoto||'A')===k;
        return {label:l, pick: () => this.setState({aboutPhoto:k}), bg: on?'#0A0B14':'#fff', color: on?'#F7F1E8':'#3a3a3a', border: on?'#0A0B14':'#E0DACE'}; }),
      goProfile: go('profile'), goPawPassport: go('pawpassport'),
      goGallery: go('gallery'), goDestinations: go('destinations'),
      // Core traveling groups: one switcher across the four group landing pages.
      groupTabs: [['forexpats','Expats · Location Experts'],['forpress','Press · The Pros'],['paw','Pet travelers'],['foraffiliates','Creators & affiliates']].map(([s,l]) => ({
        label: l, go: go(s), bg: screen===s ? '#F0507A' : 'transparent', color: screen===s ? '#fff' : '#cfcbc4', border: screen===s ? '#F0507A' : '#2b2f52' })),
      // Expat finder. Resources are hand-checked only; live: a Resources CMS collection referencing Countries.
      ...(() => {
        const C = 'Afghanistan:af|Albania:al|Algeria:dz|Andorra:ad|Angola:ao|Antigua and Barbuda:ag|Argentina:ar|Armenia:am|Australia:au|Austria:at|Azerbaijan:az|Bahamas:bs|Bahrain:bh|Bangladesh:bd|Barbados:bb|Belarus:by|Belgium:be|Belize:bz|Benin:bj|Bhutan:bt|Bolivia:bo|Bosnia and Herzegovina:ba|Botswana:bw|Brazil:br|Brunei:bn|Bulgaria:bg|Burkina Faso:bf|Burundi:bi|Cabo Verde:cv|Cambodia:kh|Cameroon:cm|Canada:ca|Central African Republic:cf|Chad:td|Chile:cl|China:cn|Colombia:co|Comoros:km|Congo:cg|Costa Rica:cr|Croatia:hr|Cuba:cu|Cyprus:cy|Czechia:cz|Democratic Republic of the Congo:cd|Denmark:dk|Djibouti:dj|Dominica:dm|Dominican Republic:do|Ecuador:ec|Egypt:eg|El Salvador:sv|Equatorial Guinea:gq|Eritrea:er|Estonia:ee|Eswatini:sz|Ethiopia:et|Fiji:fj|Finland:fi|France:fr|Gabon:ga|Gambia:gm|Georgia:ge|Germany:de|Ghana:gh|Greece:gr|Grenada:gd|Guatemala:gt|Guinea:gn|Guinea-Bissau:gw|Guyana:gy|Haiti:ht|Honduras:hn|Hungary:hu|Iceland:is|India:in|Indonesia:id|Iran:ir|Iraq:iq|Ireland:ie|Israel:il|Italy:it|Ivory Coast:ci|Jamaica:jm|Japan:jp|Jordan:jo|Kazakhstan:kz|Kenya:ke|Kiribati:ki|Kosovo:xk|Kuwait:kw|Kyrgyzstan:kg|Laos:la|Latvia:lv|Lebanon:lb|Lesotho:ls|Liberia:lr|Libya:ly|Liechtenstein:li|Lithuania:lt|Luxembourg:lu|Madagascar:mg|Malawi:mw|Malaysia:my|Maldives:mv|Mali:ml|Malta:mt|Marshall Islands:mh|Mauritania:mr|Mauritius:mu|Mexico:mx|Micronesia:fm|Moldova:md|Monaco:mc|Mongolia:mn|Montenegro:me|Morocco:ma|Mozambique:mz|Myanmar:mm|Namibia:na|Nauru:nr|Nepal:np|Netherlands:nl|New Zealand:nz|Nicaragua:ni|Niger:ne|Nigeria:ng|North Korea:kp|North Macedonia:mk|Norway:no|Oman:om|Pakistan:pk|Palau:pw|Palestine:ps|Panama:pa|Papua New Guinea:pg|Paraguay:py|Peru:pe|Philippines:ph|Poland:pl|Portugal:pt|Qatar:qa|Romania:ro|Russia:ru|Rwanda:rw|Saint Kitts and Nevis:kn|Saint Lucia:lc|Saint Vincent and the Grenadines:vc|Samoa:ws|San Marino:sm|Sao Tome and Principe:st|Saudi Arabia:sa|Senegal:sn|Serbia:rs|Seychelles:sc|Sierra Leone:sl|Singapore:sg|Slovakia:sk|Slovenia:si|Solomon Islands:sb|Somalia:so|South Africa:za|South Korea:kr|South Sudan:ss|Spain:es|Sri Lanka:lk|Sudan:sd|Suriname:sr|Sweden:se|Switzerland:ch|Syria:sy|Taiwan:tw|Tajikistan:tj|Tanzania:tz|Thailand:th|Timor-Leste:tl|Togo:tg|Tonga:to|Trinidad and Tobago:tt|Tunisia:tn|Turkey:tr|Turkmenistan:tm|Tuvalu:tv|Uganda:ug|Ukraine:ua|United Arab Emirates:ae|United Kingdom:gb|United States:us|Uruguay:uy|Uzbekistan:uz|Vanuatu:vu|Vatican City:va|Venezuela:ve|Vietnam:vn|Yemen:ye|Zambia:zm|Zimbabwe:zw'
          .split('|').map(p => { const [n, c] = p.split(':'); return {name: n, code: c}; });
        const ALIAS = {usa:'us', 'united states of america':'us', america:'us', uk:'gb', england:'gb', britain:'gb', 'great britain':'gb', uae:'ae', dubai:'ae', holland:'nl', 'czech republic':'cz', 'cote d\u2019ivoire':'ci', "cote d'ivoire":'ci', turkiye:'tr', 't\u00fcrkiye':'tr', korea:'kr', burma:'mm', copenhagen:'dk', lisbon:'pt', berlin:'de', tokyo:'jp'};
        const flag = c => 'https://cdn.jsdelivr.net/gh/HatScripts/circle-flags@gh-pages/flags/' + c + '.svg';
        const RES = { dk: [
          {name:'International House Copenhagen', type:'OFFICIAL', host:'ihcph.kk.dk', url:'https://ihcph.kk.dk/', note:'The city\u2019s one-stop office for newcomers: CPR number, health card, MitID, tax card. Also runs a calendar of social and info events.'},
          {name:'Expats in Copenhagen', type:'FACEBOOK GROUP', host:'facebook.com', url:'https://www.facebook.com/ExpatsInCopenhagen', note:'Where the newbie questions go. Flat hunts, bikes, which form comes first.'},
          {name:'Copenhagen Expats', type:'GUIDE', host:'copenhagenexpats.com', url:'https://copenhagenexpats.com/', note:'Step by step: the lease, the CPR application, the International House appointment.'},
          {name:'InterNations', type:'EVENTS', host:'internations.org', url:'https://www.internations.org/', note:'Networking and social events for internationals, with an active Copenhagen calendar.'}
        ]};
        const TAG = {OFFICIAL:['#067A79','#e2f3f2'], 'FACEBOOK GROUP':['#1a4fb5','#e7eefb'], GUIDE:['#b8791f','#fbf0df'], EVENTS:['#C8425E','#fbe6ec']};
        const EXPERTS = { dk: true };
        const find = q => { const s = (q||'').trim().toLowerCase(); if (!s) return null;
          const a = ALIAS[s]; if (a) return C.find(x => x.code === a);
          return C.find(x => x.name.toLowerCase() === s) || C.find(x => x.name.toLowerCase().startsWith(s)) || null; };
        const q = this.state.finderQuery !== undefined ? this.state.finderQuery : 'Denmark';
        const sel = this.state.finderSel !== undefined ? this.state.finderSel : 'dk';
        const cur = C.find(x => x.code === sel);
        const groups = (this.state.expatGroups || []).filter(g => cur && g.where.includes(cur.name.toUpperCase()));
        const res = (cur && RES[cur.code] || []).map(r => ({...r, tagColor: TAG[r.type][0], tagBg: TAG[r.type][1]}));
        const pick = c => this.setState({finderSel: c.code, finderQuery: c.name, finderMiss: false});
        return {
          finderQuery: q, setFinderQuery: e => { const v = e.target.value; const m = C.find(x => x.name.toLowerCase() === v.trim().toLowerCase()); this.setState(m ? {finderQuery: v, finderSel: m.code, finderMiss: false} : {finderQuery: v}); },
          runFinder: () => { const m = find(q); this.setState(m ? {finderSel: m.code, finderQuery: m.name, finderMiss: false} : {finderMiss: true}); },
          finderCountryOptions: C.map(x => x.name),
          finderQuick: ['dk','pt','de','es','mx','sg','jp','ae'].map(c => { const x = C.find(y => y.code === c); const on = sel === c;
            return {name: x.name, flag: flag(c), flagCss: "url('" + flag(c) + "')", pick: () => pick(x), bg: on ? '#0A0B14' : '#fff', color: on ? '#F7F1E8' : '#3a3a3a', border: on ? '#0A0B14' : '#E0DACE'}; }),
          finderHasResult: !!cur && !this.state.finderMiss, finderNoMatch: !!this.state.finderMiss,
          fr: cur ? {
            name: cur.name, upper: cur.name.toUpperCase(), flag: flag(cur.code), flagCss: "url('" + flag(cur.code) + "')",
            hasExpert: !!EXPERTS[cur.code], noExpert: !EXPERTS[cur.code],
            summary: (EXPERTS[cur.code] ? '1 LOCATION EXPERT' : 'DESK OPEN') + ' · ' + groups.length + (groups.length === 1 ? ' GROUP' : ' GROUPS') + ' · ' + res.length + (res.length === 1 ? ' RESOURCE' : ' RESOURCES'),
            groups, noGroups: groups.length === 0, resources: res, noResources: res.length === 0,
            suggestHref: 'mailto:hello@thatlayover.life?subject=' + encodeURIComponent('RESOURCE · ' + cur.name)
          } : {groups: [], resources: []},
          goCountryFromFinder: () => { this.setState({screen: 'country'}); window.scrollTo(0,0); },
        };
      })(),
      // ===== Research pass (28 Sep 2026): ledger, been/want, lists, Wrapped, guides, awards, export =====
      ...(() => {
        const FL = c => "url('https://cdn.jsdelivr.net/gh/HatScripts/circle-flags@gh-pages/flags/" + c + ".svg')";
        const places = this.state.places || {};
        const setPlace = (code, v) => { if (!this.state.loggedIn) { this.setState({screen:'auth', authMode:'login'}); window.scrollTo(0,0); return; }
          const p = {...(this.state.places||{})}; p[code] = p[code] === v ? undefined : v; this.setState({places: p}); };
        const pill = (on, onLabel, offLabel, tone) => ({ label: on ? onLabel : offLabel,
          bg: on ? tone : '#fff', color: on ? '#fff' : '#0A0B14', border: on ? tone : '#0A0B14' });
        // Story
        const s = this.STORIES[storyIdx] || this.STORIES[0];
        const CODE = {'Balkans':'rs','Chile and Argentina':'cl','Montenegro':'me','Ghana':'gh','Mexico':'mx','Antarctica':'aq'};
        const ROUTE = {'Balkans':[['COPENHAGEN','ROAD','KOSOVO'],'14 DAYS · 12 COUNTRIES · BY EV'],
          'Chile and Argentina':[['CPH','HEL','MIA','PUJ','SCL'],'THE FLIGHT ROUTE FROM THE STORY']};
        const TRIP = {'Balkans':'14 days','Chile and Argentina':'Christmas to New Year','Montenegro':'The annual work retreat','Ghana':'Easter'};
        const sc = CODE[s.place] || '';
        const r = ROUTE[s.place];
        const missing = '#9a958d';
        // Country page (prototype shows Bulgaria)
        const cc = 'bg';
        // Lists
        const MAGNUS = 'br:Brazil|de:Germany|cz:Czechia|sk:Slovakia|at:Austria|al:Albania|rs:Serbia|xk:Kosovo|bg:Bulgaria|se:Sweden|mk:North Macedonia|hu:Hungary|pl:Poland';
        const NAMES = {}; this.COUNTRY_DATA.split('|').forEach(e => { const i = e.indexOf(':'); NAMES[e.slice(0,i)] = e.slice(i+1); });
        const want = Object.keys(places).filter(k => places[k] === 'want');
        const LISTS = {
          pets: ['Pet stamps', MAGNUS.split('|').map(e => { const [c,n] = e.split(':'); return {name:n, flag:FL(c), meta:'MAGNUS', ring:'#00C9C8'}; }), ''],
          want: ['Want to go', want.map(c => ({name: NAMES[c] || c.toUpperCase(), flag: FL(c), meta:'SOMEDAY', ring:'#F0507A'})), 'Nothing on the someday list yet. Tap "Want to go" on any story or country page.'],
          airports: ['Layover airports survived', [], 'No airports logged yet. Every one you add gets a stamp and a line of opinion.'],
          marathons: ['Marathons', [], 'Seven continents run, zero logged here yet. Add them one stamp at a time.'],
          parks: ['National parks', [], 'No parks logged yet.']
        };
        const lk = this.state.listKey || 'pets';
        const L = LISTS[lk];
        const stamps = L[1].map((x,i) => ({...x, tilt: [-3,2,-1,3,-2,1][i % 6]}));
        // Wrapped
        const quiet = !!this.state.wrapQuiet, hid = !!this.state.wrapHide;
        const nStories = this.STORIES.length, nCtry = new Set(this.STORIES.map(x => x.country)).size;
        // Guides
        const GUIDES = {
          cph: { img:'images/denmark.jpg', eyebrow:'ANSWER GUIDE · STOPOVERS', title:'The Copenhagen stopover,', accent:'with or without a dog.',
            lede:'The airline program is a phone call, the Metro is 15 minutes, and the dog question has an answer. Here it is, in order.',
            short:'Leaving the airport means entering Schengen, so the entry rules apply to you and to the dog. The Metro and trains run from Terminal 3. SAS arranges stopovers through customer service, so get it confirmed in writing. Big dogs usually fly in the hold, so ask the airline how a stopover changes the booking.',
            qa:[
              {q:'Can you leave Copenhagen Airport on a layover?', a:'If you are allowed to enter Schengen, yes. The airport is about 8 km from the centre, and the Metro (M2) and regional trains both leave from Terminal 3. Non-EU travellers register in the EU Entry/Exit System at their first Schengen border.', src:'CPH.DK', url:'https://www.cph.dk/en'},
              {q:'How long a layover do you need to see the city?', a:'Our rule of thumb: six hours or more between flights makes a walk through Nyhavn and Strøget realistic, once you allow for the transfer and security on the way back. Under five, stay airside and eat well.', src:'EDITOR\u2019S RULE OF THUMB', url:'https://www.cph.dk/en'},
              {q:'Does SAS offer a Copenhagen stopover?', a:'SAS lists Copenhagen as a stopover option, but it is arranged through customer service rather than a booking button. Ask before you pay, and get the stopover confirmed in writing.', src:'FLYSAS.COM', url:'https://www.flysas.com'},
              {q:'Can a dog ride the Copenhagen Metro?', a:'Dogs travel on Danish public transport, and a large dog generally needs its own ticket. Check the current DSB and Metro rules before you go, because they are the ones the inspector reads.', src:'DSB.DK', url:'https://www.dsb.dk/en/'},
              {q:'Can my dog do a Copenhagen stopover?', a:'Only if the dog meets EU entry rules for Denmark, because a stopover means entering the country. The Paw Passport guide walks through the paperwork in the right order.', src:'DANISH VETERINARY AND FOOD ADMINISTRATION', url:'https://foedevarestyrelsen.dk/english'}
            ], ctaTitle:'Doing it with a dog?', ctaBody:'The Paw Passport guide covers the order of operations. €9.', ctaBtn:'The Paw Passport →', cta:'paw' },
          ees: { img:'images/doha.jpg', eyebrow:'ANSWER GUIDE · BORDER RULES', title:'EES and ETIAS on a layover,', accent:'without the panic.',
            lede:'Two new EU systems, one simple test: are you entering Schengen, or just changing planes?',
            short:'Stay airside and fly on to a non-Schengen destination, and neither system touches you. Connect onward inside Schengen, and you enter at your first Schengen airport: EES registers you there. ETIAS is expected in the last quarter of 2026, with a transition period after launch.',
            qa:[
              {q:'Do I register in EES on a layover?', a:'Only if you cross the Schengen external border. Stay airside and fly on to a non-Schengen destination and you never enter, so you do not register. Connect to another Schengen flight and you enter at your first Schengen airport, and that is where EES records you.', src:'EUROPEAN COMMISSION · EES', url:'https://travel-europe.europa.eu/ees_en'},
              {q:'When did EES start?', a:'EES rolled out in stages and has been fully in operation at Schengen borders since 10 April 2026.', src:'EUROPEAN COMMISSION · EES', url:'https://travel-europe.europa.eu/ees_en'},
              {q:'Do I need ETIAS for a layover?', a:'Not yet: ETIAS is expected in the last quarter of 2026, followed by a transition period. Once it runs, visa-exempt travellers who enter Schengen will need it. Airport transit without entering is expected to be exempt; confirm on the official ETIAS site before you fly.', src:'EUROPEAN UNION · ETIAS', url:'https://travel-europe.europa.eu/etias_en'},
              {q:'Does EES apply to EU citizens or residents?', a:'No. EES covers non-EU nationals on short stays. EU citizens and people with an EU residence permit are not registered.', src:'EUROPEAN COMMISSION · EES', url:'https://travel-europe.europa.eu/ees_en'},
              {q:'What does EES record?', a:'Your name, travel document details, fingerprints and a facial image, plus the date and place of each entry and exit.', src:'EUROPEAN COMMISSION · EES', url:'https://travel-europe.europa.eu/ees_en'}
            ], ctaTitle:'Stuck at a Schengen gate right now?', ctaBody:'Tell us which airport. The next guide might be yours.', ctaBtn:'Share your story →', cta:'share' }
        };
        const gk = this.state.guideKey || 'cph';
        const G = {...GUIDES[gk], ledger:[{k:'CHECKED BY', v:'Nancy Carleton, editor'},{k:'LAST CHECKED', v:'Draft, not yet checked'},{k:'SOURCES', v:'Official, linked per answer'},{k:'UPDATED', v:'When the rules change'}]};
        // Awards
        const CATS = ['Best layover airport','Best stopover city','Most pet-friendly hub','Best airport to sleep in','Worst gate to be stuck at'];
        const cat = this.state.awardCat || CATS[0];
        const aPlace = this.state.awardPlace || '', aWhy = this.state.awardWhy || '';
        const mine = this.state.awardMine || [];
        return {
          storyHasRoute: !!r, storyRoute: r ? r[0].map((x,i,a) => ({stop:x, arrow: i < a.length-1 ? 'inline' : 'none'})) : [], storyRouteNote: r ? r[1] : '',
          storyBeen: pill(places[sc]==='been', '✓ Been here', 'Been here', '#067A79'),
          storyWant: pill(places[sc]==='want', '★ On my list', 'Want to go', '#F0507A'),
          storyToggleBeen: () => setPlace(sc,'been'), storyToggleWant: () => setPlace(sc,'want'),
          storyToggleNote: loggedIn ? 'SAVES TO YOUR MAP AND LISTS' : 'LOG IN TO SAVE',
          storyLedger: [
            {k:'SUBMITTED BY', v:s.author, color:'#3a3a3a'},
            {k:'EDITED BY', v:'Nancy Carleton', color:'#3a3a3a'},
            {k:'TRIP', v: TRIP[s.place] || 'Contributor to add', color: TRIP[s.place] ? '#3a3a3a' : missing},
            {k:'PUBLISHED', v: s.published || '19 September 2026', color:'#3a3a3a'},
            {k:'LAST UPDATED', v: s.updated || s.published || '19 September 2026', color:'#3a3a3a'},
            {k:'WHAT IT COST', v: s.cost || 'Contributor to add', color: s.cost ? '#3a3a3a' : missing},
            {k:'SOURCES', v: s.sources || 'First-hand', color:'#3a3a3a'},
            {k:'DISCLOSURE', v: s.sponsor ? 'Hosted: ' + s.sponsor : 'Paid for by the traveler', color:'#3a3a3a'}
          ],
          ctryBeen: pill(places[cc]==='been', '✓ Been here', 'Been here', '#067A79'),
          ctryWant: pill(places[cc]==='want', '★ On my list', 'Want to go', '#F0507A'),
          ctryToggleBeen: () => setPlace(cc,'been'), ctryToggleWant: () => setPlace(cc,'want'),
          ctryToggleCount: (1 + (places[cc]==='been' ? 1 : 0)) + ' BEEN · ' + (places[cc]==='want' ? 1 : 0) + ' WANT TO GO' + (loggedIn ? '' : ' · LOG IN TO SAVE'),
          listTabs: Object.keys(LISTS).map(k => { const on = k === lk; return {label: LISTS[k][0] + ' · ' + LISTS[k][1].length, pick: () => this.setState({listKey:k}),
            bg: on ? '#0A0B14' : '#fff', color: on ? '#F7F1E8' : '#3a3a3a', border: on ? '#0A0B14' : '#E0DACE'}; }),
          listStamps: stamps, listEmpty: stamps.length === 0, listEmptyLine: L[2],
          wrapHeadline: quiet ? '0 countries, 100% couch.' : 'Your 2026, so far.',
          wrapStats: quiet ? [{k:'Countries logged', v:'0'},{k:'Stories filed', v:'0'},{k:'Naps taken', v:'Uncounted'},{k:'Regrets', v:'None'}]
            : [{k:'Stories filed', v:String(nStories)},{k:'Countries in those stories', v:String(nCtry)},{k:'Pet stamps', v:'13 · Magnus'},{k:'On the someday list', v:String(want.length)}],
          wrapCrewLine: 'Crew comparison switches on when your crew has more than you and Magnus in it. Quiet years get their own card, so nobody gets an empty one.',
          wrapQuietLabel: quiet ? 'Show my real year' : 'Preview a quiet year',
          toggleWrapQuiet: () => this.setState({wrapQuiet: !quiet}),
          wrapHideLabel: hid ? 'Hidden from your crew' : 'Visible to your crew', wrapHideColor: hid ? '#C8425E' : '#00C9C8',
          toggleWrapHide: () => this.setState({wrapHide: !hid}),
          exportLabel: this.state.exported ? 'Downloaded ✓' : 'Export my data',
          exportMyData: () => {
            const data = { exported: new Date().toISOString(), member: {name:'Nancy Carleton', lives:'Denmark', since:2018, languages:['English','Danish','Portuguese']},
              places, lists: {pets: MAGNUS.split('|').map(e => e.split(':')[1])}, nominations: mine,
              stories: this.STORIES.map(x => ({title:x.title, place:x.place, pillar:x.pillar, body:x.body})), wrapped: {hidden: hid},
              note: 'Live export: JSON of member + passport data, Markdown for stories. Emailed within one month of request.' };
            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type:'application/json'}));
            a.download = 'tll-my-data.json'; document.body.appendChild(a); a.click(); a.remove(); this.setState({exported:true}); },
          isGuide: screen === 'guide', guide: G,
          guideTabs: [['cph','Copenhagen stopover'],['ees','EES and ETIAS on a layover']].map(([k,l]) => { const on = k === gk;
            return {label:l, pick: () => { this.setState({guideKey:k}); window.scrollTo(0,0); }, bg: on ? '#0A0B14' : '#fff', color: on ? '#F7F1E8' : '#3a3a3a', border: on ? '#0A0B14' : '#E0DACE'}; }),
          guideCta: () => { this.setState({screen: G.cta}); window.scrollTo(0,0); },
          goGuideCph: () => { this.setState({screen:'guide', guideKey:'cph'}); window.scrollTo(0,0); },
          goGuideEes: () => { this.setState({screen:'guide', guideKey:'ees'}); window.scrollTo(0,0); },
          goAwards: () => { this.setState({screen:'awards'}); window.scrollTo(0,0); },
          goForBrands: () => { this.setState({screen:'forbrands'}); window.scrollTo(0,0); },
          goClub: () => { this.setState({screen:'support'}); setTimeout(() => { const el = document.querySelector('[data-tll-anchor="layover-club"]'); if (el) window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth'}); }, 150); },
          goCharterPaid: () => { this.setState({screen:'charter'}); setTimeout(() => { const el = document.querySelector('[data-tll-anchor="paid-work"]'); if (el) window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth'}); }, 150); },
          isForBrands: screen === 'forbrands',
          isAwards: screen === 'awards',
          awardCats: CATS.map(c => { const on = c === cat; return {label:c, pick: () => this.setState({awardCat:c}), bg: on ? '#0A0B14' : '#fff', color: on ? '#F7F1E8' : '#3a3a3a', border: on ? '#0A0B14' : '#E0DACE'}; }),
          awardPlace: aPlace, setAwardPlace: e => this.setState({awardPlace: e.target.value}),
          awardWhy: aWhy, setAwardWhy: e => this.setState({awardWhy: e.target.value.slice(0,140)}), awardWhyCount: aWhy.length,
          awardVerifyLine: loggedIn ? 'Your nomination is labeled LOGGED if that country is on your map, so readers can tell who has actually been.' : 'Log in to nominate. We label every nomination with whether the nominator has been there.',
          awardMsg: this.state.awardMsg || '', awardMsgColor: this.state.awardErr ? '#C8425E' : '#067A79',
          submitAward: () => {
            if (!loggedIn) { this.setState({screen:'auth', authMode:'login'}); window.scrollTo(0,0); return; }
            if (!aPlace.trim() || !aWhy.trim()) { this.setState({awardErr:true, awardMsg:'Add the place and one line on why, and it is on its way.'}); return; }
            if (mine.some(m => m.cat === cat)) { this.setState({awardErr:true, awardMsg:'One nomination per category. You already picked for this one.'}); return; }
            this.setState({awardErr:false, awardMsg:'Got it. The editors read every one.', awardPlace:'', awardWhy:'',
              awardMine: [...mine, {cat: cat.toUpperCase(), place: aPlace.trim(), tag: 'LABEL CHECKED IN REVIEW'}]}); },
          awardMine: mine, awardNone: mine.length === 0,
        };
      })(),
      goSpotlight: go('spotlight'), goContact: go('contact'), goCharter: go('charter'), goGuidelines: go('guidelines'),
      goLegalPage: go('legal'), goCookiesPage: go('cookies'), goPetsIndex: go('pets'), goMapPage: go('map'),
      // Expat groups by area: submissions feed an Expat Groups CMS collection, reviewed before publishing.
      ...(() => {
        const g = this.state.groupDraft || {gName:'', gCity:'', gCountry:'', gLink:'', gEmail:''};
        const setters = {};
        Object.keys(g).forEach(k => { setters['set_' + k] = e => this.setState({groupDraft: {...g, [k]: e.target.value}}); });
        const groups = this.state.expatGroups || [];
        return { ...g, ...setters,
          expatGroups: groups, noExpatGroups: groups.length === 0,
          groupSent: !!this.state.groupSent, groupFormOpen: !this.state.groupSent,
          groupError: this.state.groupError || 'Listed groups show a name, an area and a link. Your email stays with the editor.',
          submitGroup: () => {
            if (!g.gName.trim() || !g.gCity.trim() || !g.gEmail.trim()) { this.setState({groupError: 'Add a group name, a city and your email, and it is on its way.'}); return; }
            this.setState({groupSent: true, groupError: null, expatGroups: [...groups, {name: g.gName.trim(), where: (g.gCity.trim() + (g.gCountry.trim() ? ', ' + g.gCountry.trim() : '')).toUpperCase()}], groupDraft: null});
          },
          resetGroup: () => this.setState({groupSent: false}),
          goGroupsAnchor: () => { const el = document.querySelector('[data-tll-anchor="groups"]'); if (el) window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth'}); },
        };
      })(),
      loggedIn, loggedOut: !loggedIn,
      isAuth: screen === 'auth',
      isSignup: authMode === 'signup',
      isAccount: screen === 'account' && loggedIn,
      isGallery: screen === 'gallery',
      isDestinations: screen === 'destinations',
      loungeTiles: this.LOUNGE,
      toggleProtoNav: () => this.setState(s => ({protoNavOpen: !s.protoNavOpen})),
      protoNavDisplay: this.state.protoNavOpen ? 'flex' : 'none',
      protoToggleLabel: this.state.protoNavOpen ? 'HIDE ▾' : 'SCREENS ▴',
      protoScreenLabel: screen.toUpperCase(),
      protoNav: [
        ['home','Home'],['stories','Stories'],['story','Story'],['destinations','Destinations'],['country','Country'],
        ['travelers','Travelers'],['profile','Profile'],['editprofile','Edit profile'],['spotlight','Spotlight'],
        ['paw','Paw hub'],['mypets','My pets'],['pawpassport','Pet passport'],['pets','Pets index'],
        ['gallery','Lounge'],['map','The Map'],['about','About'],
        ['share','Share Your Story'],['sharephotos','Share photos'],['forexpats','For Expats'],['forpress','For Press'],['foraffiliates','For Affiliates'],
        ['faq','FAQ'],['support','Support'],['contact','Contact'],
        ['auth-login','Log in'],['auth-signup','Sign up'],['forgot','Reset'],['account','Account'],
        ['charter','Charter'],['guidelines','Guidelines'],['legal','Privacy/Terms'],['cookies','Cookies'],
        ['directory','Directory boards'],['styleguide','Style guide'],['sharecard','Share card'],['editor','Editor desk'],['wire','Travel Wire'],['guide-cph','CPH stopover'],['guide-ees','EES/ETIAS'],['awards','Layover Awards'],['forbrands','For Brands'],['notfound','404']
      ].map(([k,label]) => {
        const active = screen === k || (k==='guide-cph' && screen==='guide' && (this.state.guideKey||'cph')==='cph') || (k==='guide-ees' && screen==='guide' && this.state.guideKey==='ees') || (k==='auth-login' && screen==='auth' && authMode==='login') || (k==='auth-signup' && screen==='auth' && authMode==='signup');
        return { label, bg: active ? '#00C9C8' : '#16182a', color: active ? '#06302f' : '#b8b4ad',
          go: () => {
            if (k==='auth-login') this.setState({screen:'auth', authMode:'login'});
            else if (k==='auth-signup') this.setState({screen:'auth', authMode:'signup'});
            else if (k==='account') this.setState({screen:'account', loggedIn:true});
            else if (k==='story') this.setState({screen:'story', storyIdx:0});
            else if (k==='guide-cph') this.setState({screen:'guide', guideKey:'cph'});
            else if (k==='guide-ees') this.setState({screen:'guide', guideKey:'ees'});
            else this.setState({screen:k});
            window.scrollTo(0,0);
          } };
      }),
      loungeStrip: this.LOUNGE.slice(0, 5),
      atlasTotal: this.COUNTRY_DATA.split('|').length,
      atlasStoryCount: Object.keys(this.STORY_COUNTRIES).length,
      atlasRest: this.COUNTRY_DATA.split('|').length - Object.keys(this.STORY_COUNTRIES).length,
      goAtlasAll: () => { const go2 = () => { const el = document.querySelector('[data-tll-anchor="atlas-all"]'); if (el) window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth'}); };
        if (this.state.screen !== 'destinations') { this.setState({screen: 'destinations'}); setTimeout(go2, 150); } else go2(); },
      atlas: this.COUNTRY_DATA.split('|').map(e => {
        const ix = e.indexOf(':'); const code = e.slice(0,ix), name = e.slice(ix+1);
        const si = this.STORY_COUNTRIES[code];
        const has = si !== undefined;
        return {
          code, name,
          flagCss: "url('https://hatscripts.github.io/circle-flags/flags/" + code + ".svg')",
          bg: has ? '#0A0B14' : '#fff',
          border: has ? '#0A0B14' : '#E0DACE',
          weight: has ? 700 : 500,
          meta: has ? '1 STORY · READ IT' : 'BE THE FIRST',
          metaColor: has ? '#00C9C8' : '#b8b4ad',
          go: code === 'bg'
            ? () => { this.setState({screen:'country'}); window.scrollTo(0,0); }
            : has
              ? () => { this.setState({screen:'story', storyIdx: si}); window.scrollTo(0,0); }
              : () => { this.setState({screen:'share'}); window.scrollTo(0,0); }
        };
      }),
      mapSrc: loggedIn ? 'TLL Map.html?mode=personal&embed=1' : 'TLL Map.html?mode=generic&embed=1',
      mapFullSrc: loggedIn ? 'TLL Map.html?mode=personal' : 'TLL Map.html?mode=generic',
      mapHeadline: loggedIn ? 'Log your' : 'Where the Travelers have',
      mapAccent: loggedIn ? 'visits.' : 'been.',
      writerCount: (() => { const n = this.MEMBERS.length; const W=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine']; return (n<10?W[n]:n) + ' ' + (n===1?'writer':'writers'); })(),
      authTitle: authMode === 'signup' ? 'Join the Travelers.' : 'Welcome back.',
      authSub: authMode === 'signup' ? 'A map, a byline, a passport for your bestie. Free, obviously.' : 'Your map missed you.',
      authCta: authMode === 'signup' ? 'Create my account →' : 'Log in →',
      authSwapLead: authMode === 'signup' ? 'Already on the roster?' : 'Not on the roster yet?',
      authSwapLabel: authMode === 'signup' ? 'Log in' : 'Join the Travelers',
      authSwap: () => this.setState({authMode: authMode === 'signup' ? 'login' : 'signup'}),
      goLogin: () => { this.setState({screen:'auth', authMode:'login'}); window.scrollTo(0,0); },
      goSignup: () => { this.setState({screen:'auth', authMode:'signup'}); window.scrollTo(0,0); },
      goAccount: go('account'),
      doLogin: () => { this.setState({loggedIn: true, screen: 'account'}); window.scrollTo(0,0); },
      doLogout: () => { this.setState({loggedIn: false, screen: 'home'}); window.scrollTo(0,0); }
    };
  }
}
