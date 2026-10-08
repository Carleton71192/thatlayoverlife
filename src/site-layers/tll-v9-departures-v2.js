/* tll-v9-departures-v2 · served from the repo through jsDelivr, pinned to one commit, registered as a Webflow hosted script. Source of truth: this file. */
/* v9 J10 (6 Oct 2026) and J11 (8 Oct 2026): the page header at the top of main on every page except home and story pages. v1 was a seven-cell departures board; v2 keeps the status, the title and the one-liner. Values from the 2.0 TX table. Additive. */
(function(){
var TX={
 stories:['LIB','Your couch','The Library','S1','14C','NOW','{N} stories, all first-hand. More landing weekly.','SHELF CHECKED'],
 destinations:['ATL','Everywhere','The Atlas','A1','ANY','ANYTIME','Every country by flag. Most are open slots.','193 TO STAMP'],
 country:['CTY','The Atlas','A country','A2','AISLE','NOW','Facts checked, verdict ours.','FACTS CHECKED'],
 travelers:['CRW','Arrivals hall','The Travelers','T1','ROW 1','NOW','Named humans. No fake crowd for scale.','EVERY BYLINE A PERSON'],
 profile:['PRF','The Travelers','A profile','T2','1A','NOW','Where they know, never where they are.','LOCATION: COUNTRY ONLY'],
 editprofile:['EDT','Your profile','Edit mode','T3','YOURS','WHENEVER','Every switch starts off. You turn things on.','PRIVATE BY DEFAULT'],
 spotlight:['SPT','The Travelers','Spotlight','T4','STAGE','SOON','Open slots, honestly labeled.','OPEN SLOT'],
 paw:['PAW','The kennel','Paw Passport','P1','FLOOR','PAWS DOWN','Floof class. Window seat, obviously.','PET BOARDING'],
 mypets:['PET','Paw Passport','My pets','P2','FLOOR','WHENEVER','Name, species, breed, countries along. That is it.','NO PAPERWORK HERE'],
 pawpassport:['PPT','My pets','A pet passport','P3','FLOOR','NOW','Good boy. Great passport.','PAWS DOWN'],
 pets:['PTS','Paw Passport','The pets','P4','FLOOR','NOW','Every pet here has a human who said yes.','HUMAN APPROVED'],
 gallery:['LNG','The terminal','The Layover Lounge','L1','LOUNGE','OPEN','Wish you were here. Most of them did.','LOUNGE ACCESS'],
 map:['MAP','Your passport','The Map','M1','ALL','ANYTIME','Rose means been there. Blank means working on it.','LEFT THE AIRPORT'],
 about:['ABT','Arrivals','About TLL','B1','1A','NOW','One editor, one Samoyed, a lot of opinions.','EST. COPENHAGEN'],
 share:['PEN','Your notes app','Pen a Tale','W1','DESK','WHEN READY','Reviewed within 48 hours by a human.','DRAFT SAVES ITSELF'],
 sharephotos:['PIX','Camera roll','Share a postcard','W2','DESK','WHEN READY','Pack light. Bring the good shot.','PAR AVION'],
 forexpats:['EXP','Somewhere new','The expats','E1','LOCAL','NOW','Find the people who know the place.','LOCAL KNOWLEDGE'],
 forpress:['PRS','The newsroom','Press trips','E2','PRESS','DEADLINE','Hosted trips labeled at the top. Always.','REKLAME LABELED'],
 foraffiliates:['CRT','Your channel','Creators','E3','STUDIO','NOW','Credit given, links followed.','CREDITED'],
 faq:['FAQ','Confused','Answers','H1','HELP','NOW','Short answers. Longer ones by email.','ANSWERED'],
 support:['SUP','Help desk','Support','H2','HELP','NOW','A human reads every message.','HUMAN ON DUTY'],
 contact:['MSG','Your inbox','Contact','H3','HELLO@','NOW','A human reads this. Usually with coffee.','RETURN TO SENDER'],
 auth:['ID','Departures','Your account','X1','YOURS','NOW','Free to join. Free forever.','CHECK-IN OPEN'],
 forgot:['RST','Lost and found','Password reset','X2','DESK','NOW','It happens to the best of us.','LOST AND FOUND'],
 account:['ACC','Check-in','Your account','X3','YOURS','NOW','Your map, your stories, your pets.','MEMBER'],
 charter:['CHR','The fine print','Editorial charter','F1','READ','NOW','How we work, in plain words.','SIGNED OFF'],
 guidelines:['GDL','The fine print','House rules','F2','READ','NOW','Five rules. Shorter than the safety demo.','HOUSE RULES'],
 legal:['LGL','The fine print','Privacy and terms','F3','READ','NOW','Lawyer-approved words, human-readable layout.','GDPR DEFAULTS'],
 cookies:['CKE','The fine print','Cookies','F4','READ','NOW','Necessary ones only, unless you say yes.','YOUR CALL'],
 directory:['DIR','Arrivals hall','The directories','D1','ROSTER','SHUFFLED','Shuffled on every load. Never ranked.','NO PAID PLACEMENT'],
 editor:['EDI','The queue','Editor desk','Z1','EDITOR','QUEUE','The queue, read by a human.','EDITOR ONLY'],
 wire:['WIR','The world','The Travel Wire','N1','NEWS','LIVE','Headlines from the people who did the reporting.','ON THE WIRE'],
 guide:['GDE','The question','A guide','G1','ANSWER','NOW','Sourced, dated, checked.','SOURCES CITED'],
 awards:['AWD','The ballot','Layover Awards','G2','VOTE','DECEMBER','Members nominate. The editor picks.','NOMINATIONS OPEN'],
 forbrands:['BRD','Your brand','For brands','G3','PARTNER','BY EMAIL','Paid work never buys a verdict.','REKLAME FIRST'],
 notfound:['404','A wrong turn','Nowhere','??','LOST','NEVER','Rebooking you on the next page.','GATE CLOSED'],
 styleguide:['STY','The kit','Style guide','K1','REF','NOW','Reference only.','INTERNAL']
};
var ROUTES=[[/^\/stories$/,'stories'],[/^\/destinations$/,'destinations'],[/^\/countries\//,'country'],[/^\/travelers(-archive)?$/,'travelers'],[/^\/(profile|contributors)(\/|$)/,'profile'],[/^\/edit-profile$/,'editprofile'],[/^\/spotlight/,'spotlight'],[/^\/the-paw-passport$/,'paw'],[/^\/my-pets$/,'mypets'],[/^\/paw-passport\//,'pawpassport'],[/^\/pets$/,'pets'],[/^\/gallery$/,'gallery'],[/^\/the-map$/,'map'],[/^\/about$/,'about'],[/^\/submit$/,'share'],[/^\/share-photos$/,'sharephotos'],[/^\/for-expats$/,'forexpats'],[/^\/(for-press|press-trips)$/,'forpress'],[/^\/for-affiliates$/,'foraffiliates'],[/^\/(expats|creators|press)$/,'directory'],[/^\/faq$/,'faq'],[/^\/support$/,'support'],[/^\/contact$/,'contact'],[/^\/(login|signup)$/,'auth'],[/^\/forgot-password$/,'forgot'],[/^\/(account|my-passport)$/,'account'],[/^\/editorial-charter$/,'charter'],[/^\/community-guidelines$/,'guidelines'],[/^\/(privacy|terms)$/,'legal'],[/^\/cookies$/,'cookies'],[/^\/editors-desk$/,'editor'],[/^\/travel-wire$/,'wire'],[/^\/guides\//,'guide'],[/^\/awards$/,'awards'],[/^\/for-brands$/,'forbrands'],[/^\/404$/,'notfound'],[/^\/style-guide$/,'styleguide']];
function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h);}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function build(){
  var old=document.getElementById('tll-departures');
  if(old){ if(old.getAttribute('data-tll-departures-v')==='2')return; old.parentNode.removeChild(old); } /* v2 replaces the v1 board while v1 is still in the site head */
  if(/[?&]embed=1/.test(location.search))return;
  var P=location.pathname.replace(/\/$/,'')||'/';
  if(P==='/'||/^\/stories\//.test(P))return;
  var key=null;for(var i=0;i<ROUTES.length;i++){if(ROUTES[i][0].test(P)){key=ROUTES[i][1];break;}}
  if(!key&&document.title.indexOf('404')>-1)key='notfound';
  var tx=TX[key]||['TLL','Somewhere','That Layover Life','A1','1A','NOW','Somewhere worth the layover.','LEFT THE AIRPORT'];
  var via=['RAIL','SEA','AIR','ROAD'][hash(key||'x')%4];
  var line=tx[6];
  if(line.indexOf('{N}')>-1){var n=0;try{n=+sessionStorage.getItem('tllStoryN')||0;}catch(e){}line=n?line.replace('{N}',n):'All first-hand. More landing weekly.';}
  var main=document.querySelector('main');if(!main)return;
  /* v2 (8 Oct 2026, Nancy: the board was too busy). Three things only: a status eyebrow, the title, the one-liner. Same Ink band, same type, half the height. */
  var b=document.createElement('div');b.id='tll-departures';b.setAttribute('data-tll-departures',key||'default');b.setAttribute('data-tll-departures-v','2');b.setAttribute('role','region');b.setAttribute('aria-label','Page header');
  b.style.cssText='background:#0A0B14;color:#F7F1E8;border-bottom:1px solid #23263c';
  b.innerHTML='<div style="padding:30px 6vw 28px;max-width:1280px;box-sizing:border-box">'
   +'<div style="font-family:\'JetBrains Mono\',monospace;font-size:10.5px;letter-spacing:3px;font-weight:700;color:#00C9C8;text-transform:uppercase">'+esc(tx[7])+'</div>'
   +'<div style="font-family:\'Playfair Display\',serif;font-weight:800;font-size:clamp(26px,3.2vw,40px);line-height:1.08;letter-spacing:-.015em;color:#F7F1E8;margin-top:10px;max-width:22ch">'+esc(tx[2])+'</div>'
   +'<div style="font-family:\'IBM Plex Sans Condensed\',sans-serif;font-size:16px;line-height:1.45;color:#B9C0D0;margin-top:10px;max-width:60ch">'+esc(line)+'</div>'
   +'</div>';
  main.insertBefore(b,main.firstChild);
}
if(document.readyState!=='loading')build();else document.addEventListener('DOMContentLoaded',build);
})();
